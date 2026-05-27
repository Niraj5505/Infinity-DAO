import React, { useState, useEffect } from 'react';
import { Mail, Lock, ShieldCheck, UserPlus, LogIn, Sparkles, AlertCircle, User, Phone, Wallet, Gift, X } from 'lucide-react';
import './Auth.css';
import { useWeb3 } from '../web3/Web3Context';

const Auth = ({ onAuthSuccess, initialMode = true, isModal = false, onClose }) => {
  const { dbStatus } = useWeb3();
  const [isLogin, setIsLogin] = useState(initialMode);

  useEffect(() => {
    setIsLogin(initialMode);
  }, [initialMode]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setWalletAddress('');
    setFullName('');
    setPhone('');
    setSponsorId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!isLogin && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    // Local Sandbox Offline Fallback
    if (!dbStatus.connected) {
      setLoading(true);
      setTimeout(() => {
        try {
          const mockUsers = JSON.parse(localStorage.getItem('inf_dao_mock_users') || '[]');
          const normalizedEmail = email.toLowerCase().trim();
          
          if (isLogin) {
            const user = mockUsers.find(u => u.email === normalizedEmail);
            if (!user || user.password !== password) {
              throw new Error('Invalid email or password.');
            }
            
            const loginUser = {
              id: user.id,
              email: user.email,
              walletAddress: user.walletAddress
            };
            
            localStorage.setItem('inf_dao_token', 'mock_token_' + Date.now());
            localStorage.setItem('inf_dao_user', JSON.stringify(loginUser));
            if (user.walletAddress) {
              localStorage.setItem('inf_dao_addr', user.walletAddress);
              localStorage.setItem('inf_dao_connected', 'true');
            }
            
            setSuccessMsg('Login successful (Sandbox Mode)! Redirecting...');
            setTimeout(() => {
              onAuthSuccess(loginUser);
            }, 1200);
          } else {
            // Register
            const exists = mockUsers.some(u => u.email === normalizedEmail);
            if (exists) {
              throw new Error('Email is already registered.');
            }
            
            const normalizedAddr = walletAddress.trim().toLowerCase();
            let existingWalletUser = null;
            if (normalizedAddr) {
              existingWalletUser = mockUsers.find(u => u.walletAddress === normalizedAddr);
              if (existingWalletUser && existingWalletUser.email) {
                throw new Error('Wallet address is already registered.');
              }
            }
            
            const newUserAddress = normalizedAddr || '0x' + Math.random().toString(16).substring(2, 42);
            let registeredUser;

            if (existingWalletUser) {
              // Update pre-existing wallet-only mock user
              existingWalletUser.email = normalizedEmail;
              existingWalletUser.password = password;
              existingWalletUser.fullName = fullName || 'DAO Member';
              existingWalletUser.phone = phone || '';
              existingWalletUser.sponsorId = sponsorId || '';
              localStorage.setItem('inf_dao_mock_users', JSON.stringify(mockUsers));

              registeredUser = {
                id: existingWalletUser.id,
                email: existingWalletUser.email,
                walletAddress: existingWalletUser.walletAddress
              };
            } else {
              const newUser = {
                id: 'mock_usr_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
                email: normalizedEmail,
                password: password,
                walletAddress: newUserAddress,
                fullName: fullName || 'DAO Member',
                phone: phone || '',
                sponsorId: sponsorId || ''
              };
              
              mockUsers.push(newUser);
              localStorage.setItem('inf_dao_mock_users', JSON.stringify(mockUsers));

              registeredUser = {
                id: newUser.id,
                email: newUser.email,
                walletAddress: newUser.walletAddress
              };
            }
            
            localStorage.setItem('inf_dao_token', 'mock_token_' + Date.now());
            localStorage.setItem('inf_dao_user', JSON.stringify(registeredUser));
            localStorage.setItem('inf_dao_addr', newUserAddress);
            localStorage.setItem('inf_dao_connected', 'true');
            
            setSuccessMsg('Registration successful (Sandbox Mode)! Redirecting...');
            setTimeout(() => {
              onAuthSuccess(registeredUser);
            }, 1200);
          }
        } catch (err) {
          setErrorMsg(err.message);
        } finally {
          setLoading(false);
        }
      }, 800);
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password }
      : { email, password, walletAddress, fullName, phone, sponsorId };

    try {
      const response = await fetch(`http://localhost:5005${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication process failed.');
      }

      if (data.success) {
        localStorage.setItem('inf_dao_token', data.token);
        localStorage.setItem('inf_dao_user', JSON.stringify(data.user));
        
        // Link decentralized wallet if available on login/register
        if (data.user.walletAddress) {
          localStorage.setItem('inf_dao_addr', data.user.walletAddress);
          localStorage.setItem('inf_dao_connected', 'true');
        }

        setSuccessMsg(isLogin ? 'Login successful! Redirecting...' : 'Registration successful! Accessing Dashboard...');
        
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className={`auth-card-wrapper animate-up ${isModal ? 'auth-modal-card' : ''} ${!isLogin ? 'auth-card-wide' : ''}`}>
      {/* Decorative top bar */}
      <div className="auth-card-accent-bar"></div>

      {isModal && (
        <button type="button" className="auth-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      )}

        <div className="auth-brand-logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#auth-logo-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="auth-logo-svg"
          >
            <defs>
              <linearGradient id="auth-logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
            <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
          </svg>
          <span className="auth-brand-title text-gradient">INFINITY DAO</span>
        </div>

        <div className="auth-header-texts">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Authenticate to securely access your Web3 dashboard' : 'Join Infinity DAO to unlock decentralized yields'}</p>
        </div>

        {errorMsg && (
          <div className="auth-message-block error-block animate-up">
            <AlertCircle size={18} className="message-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-message-block success-block animate-up">
            <ShieldCheck size={18} className="message-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-layout">
          {!isLogin ? (
            <div className="auth-columns-layout animate-up">
              {/* Left Column */}
              <div className="auth-form-column">
                <div className="input-group-wrapper">
                  <label className="input-label-small">Full Name</label>
                  <div className="input-icon-box">
                    <User className="field-icon" size={18} />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-wrapper">
                  <label className="input-label-small">Email Address</label>
                  <div className="input-icon-box">
                    <Mail className="field-icon" size={18} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-wrapper">
                  <label className="input-label-small">Password</label>
                  <div className="input-icon-box">
                    <Lock className="field-icon" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-wrapper">
                  <label className="input-label-small">Confirm Password</label>
                  <div className="input-icon-box">
                    <Lock className="field-icon" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="auth-form-column">
                <div className="input-group-wrapper">
                  <label className="input-label-small">
                    Phone Number <span className="label-optional">(Optional)</span>
                  </label>
                  <div className="input-icon-box">
                    <Phone className="field-icon" size={18} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group-wrapper">
                  <label className="input-label-small">
                    Decentralized Wallet Address <span className="label-optional">(Optional)</span>
                  </label>
                  <div className="input-icon-box">
                    <Wallet className="field-icon" size={18} />
                    <input
                      type="text"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group-wrapper">
                  <label className="input-label-small">
                    Sponsor ID / Sponsor Code <span className="label-optional">(Optional)</span>
                  </label>
                  <div className="input-icon-box">
                    <Gift className="field-icon" size={18} />
                    <input
                      type="text"
                      placeholder="e.g., SPONSOR123"
                      value={sponsorId}
                      onChange={(e) => setSponsorId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-helper-badge">
                  <Sparkles size={14} className="helper-badge-icon" />
                  <span>Secure Web3 Account Registration</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="input-group-wrapper">
                <label className="input-label-small">Email Address</label>
                <div className="input-icon-box">
                  <Mail className="field-icon" size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group-wrapper">
                <label className="input-label-small">Password</label>
                <div className="input-icon-box">
                  <Lock className="field-icon" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="auth-action-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-indicator"></span>
            ) : isLogin ? (
              <>
                <LogIn size={18} style={{ marginRight: '8px' }} /> SECURE LOGIN
              </>
            ) : (
              <>
                <UserPlus size={18} style={{ marginRight: '8px' }} /> REGISTER ACCOUNT
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-toggle">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={toggleAuthMode} className="toggle-mode-btn">
            {isLogin ? 'Register Here' : 'Login Here'}
          </button>
        </div>
      </div>
  );

  if (isModal) {
    return cardContent;
  }

  return (
    <div className="auth-root-container">
      {/* Background Animated Orbs */}
      <div className="bg-orb purple-orb"></div>
      <div className="bg-orb pink-orb"></div>
      <div className="bg-orb cyan-orb"></div>
      {cardContent}
    </div>
  );
};

export default Auth;
