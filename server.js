import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dns from 'dns';

// Force Google Public DNS resolver to bypass standard Windows querySrv DNS timeout/resolution failures when connecting to MongoDB Atlas!
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;
// Default to a live high-availability MongoDB Atlas Cloud Cluster so the user gets instant database connection out-of-the-box!
let rawUri = process.env.MONGO_URI || 'mongodb+srv://fanqie:fanqie123@cluster0.f8acy45.mongodb.net/InfinityDAO?retryWrites=true&w=majority&appName=Cluster0';

// Normalize the database URI to guarantee validity
let MONGO_URI = rawUri.trim().replace(/\.+$/, ''); // remove trailing dots
if (!MONGO_URI.startsWith('mongodb://') && !MONGO_URI.startsWith('mongodb+srv://')) {
  MONGO_URI = 'mongodb://' + MONGO_URI;
}
if (MONGO_URI.endsWith(':27017')) {
  MONGO_URI = MONGO_URI + '/infinity-dao';
}

// ── Database Connection ────────────────────────────────────
let dbConnected = false;
let dbMode = 'Mock/Memory Store';

// Handle connection errors gracefully without crashing the server process
mongoose.connection.on('error', (err) => {
  dbConnected = false;
  dbMode = 'Simulated Local Store (Fallback)';
  console.warn('⚠️ MongoDB connection monitoring status:', err.message);
});

// Protect mongoose connection call against synchronous parse/validation throws
try {
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 4000 // Timeout fast (4s) if DNS resolution fails or port blocks occur
  })
    .then(() => {
      dbConnected = true;
      dbMode = 'Active MongoDB Connection';
      console.log(`🚀 Connected to MongoDB successfully at ${MONGO_URI}`);
    })
    .catch((err) => {
      dbConnected = false;
      dbMode = 'Simulated Local Store (Fallback)';
      console.warn(`⚠️ Local MongoDB connection failed: ${err.message}. Bootstrapping automated High-Fidelity In-Memory database store...`);
    });
} catch (connectErr) {
  dbConnected = false;
  dbMode = 'Simulated Local Store (Fallback)';
  console.warn(`⚠️ Synchronous MongoDB connection parse error: ${connectErr.message}. Bootstrapping automated High-Fidelity In-Memory database store...`);
}

// ── User Schema definition ────────────────────────────────
const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'USR_' + Math.random().toString(36).substr(2, 9).toUpperCase()
  },
  fullName: {
    type: String,
    required: true,
    default: 'DAO Member'
  },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: {
    type: String,
    default: ''
  },
  password: { type: String },
  sponsorId: {
    type: String,
    default: ''
  },
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  directTeam: {
    type: Number,
    default: 0,
  },
  totalTeam: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  rank: {
    type: String,
    default: 'L1',
  },
  walletAddress: {
    type: String,
    default: ''
  },
  isKYCVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  fastrackQualified: {
    type: Boolean,
    default: false,
  },
  totalInvestment: {
    type: Number,
    default: 0,
  },
  totalEarning: {
    type: Number,
    default: 0,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  referralIncome: {
    type: Number,
    default: 0,
  },
  levelIncome: {
    type: Number,
    default: 0,
  },
  miningIncome: {
    type: Number,
    default: 0,
  },
  promotionalIncome: {
    type: Number,
    default: 0,
  },
  activePackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  ipAddress: {
    type: String,
    default: ''
  },
  lastIps: [{
    type: String,
  }],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  deviceFingerprint: {
    type: String,
    default: ''
  },

  // ── Existing Dashboard Balance & Transaction Properties ──
  address: { type: String, required: true, unique: true, index: true },
  balances: {
    staticIdl: { type: String, default: '2500.000' },
    dynamicIdl: { type: String, default: '850.000' },
    releasedIdl: { type: String, default: '150.000' },
    usdt: { type: String, default: '5000.000' },
    gyr: { type: String, default: '350.000' },
    stakedIdl: { type: String, default: '1200.000' },
  },
  stakes: [
    {
      id: Number,
      amount: String,
      duration: String,
      date: String,
      status: String,
    }
  ],
  bonds: [
    {
      id: Number,
      amount: String,
      plan: String,
      date: String,
      status: String,
    }
  ],
  swaps: [
    {
      id: Number,
      amount: String,
      time: String,
      status: String,
    }
  ],
  vestingHistory: [
    {
      id: Number,
      amount: String,
      burn: String,
      period: String,
      date: String,
    }
  ],
}, { collection: 'InfinityDAO', timestamps: true });


const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ── Signup Schema definition ──────────────────────────────
const SignupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  address: { type: String, default: '', lowercase: true, trim: true },
  referredBy: { type: String, default: '', lowercase: true, trim: true },
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  password: { type: String, default: '' },
  status: { type: String, default: 'active' }
}, { collection: 'Signup', timestamps: true });

const Signup = mongoose.models.Signup || mongoose.model('Signup', SignupSchema);

// Auto-initialize MongoDB indexes and create collections in the active database on startup!
mongoose.connection.once('open', async () => {
  try {
    console.log('🔄 Synchronizing collections and unique indexes in MongoDB...');
    await Promise.all([
      User.createIndexes(),
      Signup.createIndexes()
    ]);
    console.log('✅ Collection indexes established successfully in the database.');
  } catch (err) {
    console.warn('⚠️ Index synchronization warning:', err.message);
  }
});

// In-Memory fallback stores
const mockDb = {};
const mockSignups = [];

// Helper to generate a placeholder Ethereum wallet address for email-only users
function generatePlaceholderAddress() {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * 16)];
  }
  return addr;
}


// Helper to get or create user
async function getUser(address) {
  const normalizedAddr = address.toLowerCase();
  
  if (dbConnected) {
    let user = await User.findOne({ address: normalizedAddr });
    if (!user) {
      user = new User({ address: normalizedAddr });
      await user.save();
    }
    return user;
  } else {
    if (!mockDb[normalizedAddr]) {
      mockDb[normalizedAddr] = {
        address: normalizedAddr,
        balances: {
          staticIdl: '2500.000',
          dynamicIdl: '850.000',
          releasedIdl: '150.000',
          usdt: '5000.000',
          gyr: '350.000',
          stakedIdl: '1200.000',
        },
        stakes: [],
        bonds: [],
        swaps: [],
        vestingHistory: [],
      };
    }
    return mockDb[normalizedAddr];
  }
}

// Helper to save user
async function saveUser(user) {
  if (dbConnected) {
    await User.findOneAndUpdate({ address: user.address }, user, { new: true, upsert: true });
  } else {
    mockDb[user.address] = user;
  }
}

// ── REST APIs ──────────────────────────────────────────────

// Get Database Info & Connection Status
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: dbConnected,
    mode: dbMode,
    uri: MONGO_URI,
    activeUsersCount: dbConnected ? 1 : Object.keys(mockDb).length,
    dbType: 'MongoDB v6.0 / Mongoose ODM'
  });
});

// Fetch User State
app.get('/api/user/:address', async (req, res) => {
  try {
    const user = await getUser(req.params.address);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execute User Action (Staking, Bonding, Swaps, Claims, Vesting)
app.post('/api/user/:address/action', async (req, res) => {
  try {
    const { actionType, payload } = req.body;
    const user = await getUser(req.params.address);

    switch (actionType) {
      case 'STAKE': {
        const { amount, duration } = payload;
        const numAmount = parseFloat(amount);
        const currentUsdt = parseFloat(user.balances.usdt);
        const currentStatic = parseFloat(user.balances.staticIdl);

        if (currentUsdt < numAmount) {
          return res.status(400).json({ error: 'Insufficient USDT balance to cover staking collateral fee.' });
        }
        if (currentStatic < numAmount) {
          return res.status(400).json({ error: 'Insufficient Static IDL balance.' });
        }

        user.balances.staticIdl = (currentStatic - numAmount).toFixed(3);
        user.balances.stakedIdl = (parseFloat(user.balances.stakedIdl) + numAmount).toFixed(3);
        
        user.stakes.unshift({
          id: Date.now(),
          amount: numAmount.toFixed(3),
          duration: `${duration} Days`,
          date: new Date().toLocaleDateString(),
          status: 'Active'
        });
        break;
      }
      case 'BOND': {
        const { amount, durationDays, rateRoi } = payload;
        const numAmount = parseFloat(amount);
        const currentUsdt = parseFloat(user.balances.usdt);

        if (currentUsdt < numAmount) {
          return res.status(400).json({ error: 'Insufficient USDT balance.' });
        }

        user.balances.usdt = (currentUsdt - numAmount).toFixed(3);
        user.bonds.unshift({
          id: Date.now(),
          amount: numAmount.toFixed(3),
          plan: `${durationDays} Days (ROI ${(rateRoi * 100).toFixed(1)}%)`,
          date: new Date().toLocaleDateString(),
          status: 'Locked'
        });
        break;
      }
      case 'CLAIM_GYR': {
        const { amount } = payload;
        const numAmount = parseFloat(amount);
        const currentGyr = parseFloat(user.balances.gyr);

        if (currentGyr < numAmount) {
          return res.status(400).json({ error: 'Insufficient GYR balance.' });
        }

        user.balances.gyr = (currentGyr - numAmount).toFixed(3);
        user.balances.releasedIdl = (parseFloat(user.balances.releasedIdl) + numAmount).toFixed(3);
        break;
      }
      case 'SWAP': {
        const { amount } = payload;
        const numAmount = parseFloat(amount);
        const currentReleased = parseFloat(user.balances.releasedIdl);

        if (currentReleased < numAmount) {
          return res.status(400).json({ error: 'Insufficient Released IDL balance.' });
        }

        user.balances.releasedIdl = (currentReleased - numAmount).toFixed(3);
        user.balances.usdt = (parseFloat(user.balances.usdt) + numAmount).toFixed(3);
        
        user.swaps.unshift({
          id: Date.now(),
          amount: numAmount.toFixed(3),
          time: 'Ready',
          status: 'Completed'
        });
        break;
      }
      case 'LINEAR_RELEASE': {
        const { amount, periodDays, burnPercent } = payload;
        const numAmount = parseFloat(amount);
        const currentStatic = parseFloat(user.balances.staticIdl);

        if (currentStatic < numAmount) {
          return res.status(400).json({ error: 'Insufficient Static Balance.' });
        }

        const burnAmt = numAmount * (burnPercent / 100);
        const releaseAmt = numAmount - burnAmt;

        user.balances.staticIdl = (currentStatic - numAmount).toFixed(3);
        user.balances.releasedIdl = (parseFloat(user.balances.releasedIdl) + releaseAmt).toFixed(3);
        
        user.vestingHistory.unshift({
          id: Date.now(),
          amount: releaseAmt.toFixed(3),
          burn: burnAmt.toFixed(3),
          period: `${periodDays} Days`,
          date: new Date().toLocaleDateString(),
        });
        break;
      }
      default:
        return res.status(400).json({ error: 'Invalid action type' });
    }

    await saveUser(user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Signup REST APIs ────────────────────────────────────────

// Create a new Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { email, address, referredBy } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email field is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedAddr = address ? address.toLowerCase().trim() : '';
    const normalizedRef = referredBy ? referredBy.toLowerCase().trim() : '';

    if (dbConnected) {
      // Check for duplication in MongoDB
      const existingSignup = await Signup.findOne({ email: normalizedEmail });
      if (existingSignup) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }

      const signup = new Signup({
        email: normalizedEmail,
        address: normalizedAddr,
        referredBy: normalizedRef
      });
      await signup.save();
      return res.status(201).json(signup);
    } else {
      // Check for duplication in Mock Store
      const existingMock = mockSignups.find(s => s.email === normalizedEmail);
      if (existingMock) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }

      const mockSignup = {
        _id: `mock_${Date.now()}`,
        email: normalizedEmail,
        address: normalizedAddr,
        referredBy: normalizedRef,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockSignups.push(mockSignup);
      return res.status(201).json(mockSignup);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all Signups
app.get('/api/signups', async (req, res) => {
  try {
    if (dbConnected) {
      const signups = await Signup.find({}).sort({ createdAt: -1 });
      res.json(signups);
    } else {
      res.json([...mockSignups].reverse());
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Authentication REST APIs ────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'infinity-dao-super-secret-key-2026';

// Register a new user auth record
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, walletAddress, fullName, phone, sponsorId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedAddr = walletAddress ? walletAddress.toLowerCase().trim() : '';

    if (dbConnected) {
      // Check for duplication on email
      const existingEmail = await User.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }

      // Check for duplication on walletAddress (if provided)
      if (normalizedAddr) {
        const existingWallet = await User.findOne({ address: normalizedAddr });
        if (existingWallet) {
          return res.status(400).json({ error: 'Wallet address is already registered.' });
        }
      }

      // Auto-generate unique placeholder address if not provided
      let finalAddress = normalizedAddr;
      if (!finalAddress) {
        let isUnique = false;
        while (!isUnique) {
          finalAddress = generatePlaceholderAddress();
          const existing = await User.findOne({ address: finalAddress });
          if (!existing) {
            isUnique = true;
          }
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user (inherits balances, stakes, etc. from schema defaults)
      const newUser = new User({
        email: normalizedEmail,
        password: hashedPassword,
        address: finalAddress,
        walletAddress: finalAddress,
        fullName: fullName || 'DAO Member',
        phone: phone || '',
        sponsorId: sponsorId || ''
      });

      await newUser.save();

      // Synchronously write matching metadata to the Signup collection
      try {
        const newSignup = new Signup({
          email: normalizedEmail,
          address: finalAddress,
          referredBy: sponsorId || '',
          fullName: fullName || '',
          phone: phone || '',
          password: hashedPassword,
          status: 'active'
        });
        await newSignup.save();
        console.log(`✅ Signup collection synchronized successfully for: ${normalizedEmail}`);
      } catch (signupErr) {
        console.warn('⚠️ Signup collection synchronization warning:', signupErr.message);
      }

      // Create JWT Token
      const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser._id, email: newUser.email, walletAddress: newUser.address }
      });
    } else {
      // Mock Fallback Check for duplication on email
      const existingMockEmail = Object.values(mockDb).find(u => u.email === normalizedEmail);
      if (existingMockEmail) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }

      // Check for duplication on walletAddress (if provided)
      if (normalizedAddr && mockDb[normalizedAddr]) {
        return res.status(400).json({ error: 'Wallet address is already registered.' });
      }

      // Auto-generate unique placeholder address if not provided
      let finalAddress = normalizedAddr;
      if (!finalAddress) {
        let isUnique = false;
        while (!isUnique) {
          finalAddress = generatePlaceholderAddress();
          if (!mockDb[finalAddress]) {
            isUnique = true;
          }
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockUser = {
        _id: `mock_user_${Date.now()}`,
        userId: 'USR_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        fullName: fullName || 'DAO Member',
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || '',
        sponsorId: sponsorId || '',
        address: finalAddress,
        walletAddress: finalAddress,
        balances: {
          staticIdl: '2500.000',
          dynamicIdl: '850.000',
          releasedIdl: '150.000',
          usdt: '5000.000',
          gyr: '350.000',
          stakedIdl: '1200.000',
        },
        stakes: [],
        bonds: [],
        swaps: [],
        vestingHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDb[finalAddress] = mockUser;

      // Keep mockSignups synchronized
      mockSignups.push({
        _id: `mock_${Date.now()}`,
        email: normalizedEmail,
        address: finalAddress,
        referredBy: sponsorId || '',
        fullName: fullName || '',
        phone: phone || '',
        password: hashedPassword,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Create JWT Token
      const token = jwt.sign({ userId: mockUser._id, email: mockUser.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        token,
        user: { id: mockUser._id, email: mockUser.email, walletAddress: mockUser.address }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (dbConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      // Create JWT Token
      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: { id: user._id, email: user.email, walletAddress: user.address }
      });
    } else {
      // Mock Fallback
      const mockUser = Object.values(mockDb).find(u => u.email === normalizedEmail);
      if (!mockUser) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      // Create JWT Token
      const token = jwt.sign({ userId: mockUser._id, email: mockUser.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: { id: mockUser._id, email: mockUser.email, walletAddress: mockUser.address }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Token and retrieve profile session
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (dbConnected) {
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json({
        id: user._id,
        email: user.email,
        walletAddress: user.address
      });
    } else {
      const mockUser = Object.values(mockDb).find(u => u._id === decoded.userId);
      if (!mockUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json({
        id: mockUser._id,
        email: mockUser.email,
        walletAddress: mockUser.address
      });
    }
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid or expired.' });
  }
});


// Start listening
app.listen(PORT, () => {
  console.log(`🔥 Infinity DAO Database API server running on port ${PORT}`);
});
