import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Global Sandbox Toggle
// Set this to true to enable integration with the local Node/Express + MongoDB server on port 5005.
// Set to false to run purely in a silent local Sandbox mode (eliminating all browser connection errors).
export const CONNECT_TO_BACKEND_SERVER = true;

// Production-ready dynamic API Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [balances, setBalances] = useState({
    staticIdl: '2500.000',
    dynamicIdl: '850.000',
    releasedIdl: '150.000',
    usdt: '5000.000',
    gyr: '350.000',
    stakedIdl: '1200.000',
  });

  const [stakes, setStakes] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [vestingHistory, setVestingHistory] = useState([]);
  
  // Database status states
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    mode: CONNECT_TO_BACKEND_SERVER ? 'Checking status...' : 'Sandbox Mode (Offline)',
    uri: CONNECT_TO_BACKEND_SERVER ? '' : 'Local Storage Fallback',
    dbType: CONNECT_TO_BACKEND_SERVER ? 'MongoDB' : 'Client In-Memory'
  });

  // Load persistent simulated state on mount
  useEffect(() => {
    const init = async () => {
      const isBackendAlive = CONNECT_TO_BACKEND_SERVER ? await fetchDbStatus() : false;
      const savedAddress = localStorage.getItem('inf_dao_addr');
      const savedConnected = localStorage.getItem('inf_dao_connected') === 'true';
      if (savedConnected && savedAddress) {
        setIsConnected(true);
        setAddress(savedAddress);
        await loadBalancesAndSync(savedAddress, isBackendAlive);
      }
    };

    init();
    
    // Fetch live MongoDB connection status with a larger interval to avoid console spam (e.g. 20s) if enabled
    if (CONNECT_TO_BACKEND_SERVER) {
      const interval = setInterval(fetchDbStatus, 20000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchDbStatus = async () => {
    if (!CONNECT_TO_BACKEND_SERVER) {
      return false;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/db-status`);
      if (res.ok) {
        const status = await res.json();
        setDbStatus(status);
        return status.connected;
      }
    } catch (err) {
      setDbStatus({
        connected: false,
        mode: 'Local client fallback mode',
        uri: 'Offline / Port 5005 blocked',
        dbType: 'MongoDB'
      });
      return false;
    }
    return false;
  };

  const loadBalancesAndSync = async (userAddr, isBackendConnected = dbStatus.connected) => {
    const normalizedAddr = userAddr.toLowerCase();
    
    // 1. Fetch from MongoDB Backend if active
    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${normalizedAddr}`);
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances);
          setStakes(data.stakes || []);
          setBonds(data.bonds || []);
          setSwaps(data.swaps || []);
          setVestingHistory(data.vestingHistory || []);
          return;
        }
      } catch (err) {
        console.warn('MongoDB server offline, falling back to browser storage.', err);
      }
    }

    // 2. Client fallback
    const key = `balances_${normalizedAddr}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setBalances(JSON.parse(stored));
    } else {
      const initialBalances = {
        staticIdl: '2500.000',
        dynamicIdl: '850.000',
        releasedIdl: '150.000',
        usdt: '5000.000',
        gyr: '350.000',
        stakedIdl: '1200.000',
      };
      setBalances(initialBalances);
      localStorage.setItem(key, JSON.stringify(initialBalances));
    }

    const savedStakes = localStorage.getItem('inf_dao_stakes');
    if (savedStakes) setStakes(JSON.parse(savedStakes));

    const savedBonds = localStorage.getItem('inf_dao_bonds');
    if (savedBonds) setBonds(JSON.parse(savedBonds));

    const savedSwaps = localStorage.getItem('inf_dao_swaps');
    if (savedSwaps) setSwaps(JSON.parse(savedSwaps));

    const savedVesting = localStorage.getItem('inf_dao_vesting');
    if (savedVesting) setVestingHistory(JSON.parse(savedVesting));
  };

  const updateBalances = (newBalances) => {
    const updated = { ...balances, ...newBalances };
    setBalances(updated);
    if (address) {
      localStorage.setItem(`balances_${address.toLowerCase()}`, JSON.stringify(updated));
    }
  };

  const connectWallet = async () => {
    // 1. Check if MetaMask (or any injected wallet) is installed
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn("MetaMask not detected, initiating sandbox developer connection.");
      const mockAddr = '0x71C7656EC7ab88b098defB751B7401B5f6d2bE23';
      setIsConnected(true);
      setAddress(mockAddr);
      localStorage.setItem('inf_dao_addr', mockAddr);
      localStorage.setItem('inf_dao_connected', 'true');
      await loadBalancesAndSync(mockAddr);
      return mockAddr;
    }

    try {
      // 2. Initialize the Web3 Provider (Ethers v6)
      const provider = new ethers.BrowserProvider(window.ethereum);

      // 3. Prompt the user to connect their wallet
      await provider.send("eth_requestAccounts", []);

      // 4. Get the signer (the connected user)
      const signer = await provider.getSigner();

      // 5. Get the user's wallet address
      const walletAddress = await signer.getAddress();

      console.log("Wallet connected successfully via Ethers!", walletAddress);

      setIsConnected(true);
      setAddress(walletAddress);
      localStorage.setItem('inf_dao_addr', walletAddress);
      localStorage.setItem('inf_dao_connected', 'true');
      await loadBalancesAndSync(walletAddress);
      return walletAddress;
      
    } catch (error) {
      console.error("User rejected the request or an error occurred", error);
      
      // Secondary fallback to support testing & developer flow
      const fallbackAddr = '0x71C7656EC7ab88b098defB751B7401B5f6d2bE23';
      setIsConnected(true);
      setAddress(fallbackAddr);
      localStorage.setItem('inf_dao_addr', fallbackAddr);
      localStorage.setItem('inf_dao_connected', 'true');
      await loadBalancesAndSync(fallbackAddr);
      return fallbackAddr;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    localStorage.removeItem('inf_dao_addr');
    localStorage.setItem('inf_dao_connected', 'false');
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Web3 + MongoDB sync actions
  const executeStake = async (amount, duration) => {
    if (!isConnected) return false;
    const numAmount = parseFloat(amount);
    const currentUsdt = parseFloat(balances.usdt);
    const currentStatic = parseFloat(balances.staticIdl);
    
    if (currentUsdt < numAmount) {
      return { success: false, error: 'Insufficient USDT balance to cover staking collateral fee.' };
    }
    if (currentStatic < numAmount) {
      return { success: false, error: 'Insufficient Static IDL balance.' };
    }

    // Try posting to MongoDB if connected
    if (dbStatus.connected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${address.toLowerCase()}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'STAKE',
            payload: { amount, duration }
          })
        });
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances);
          setStakes(data.stakes);
          return { success: true };
        }
      } catch (err) {
        console.warn('MongoDB action sync failed. Falling back to local simulated state.', err);
      }
    }

    // Local fallback
    const newStatic = (currentStatic - numAmount).toFixed(3);
    const newStaked = (parseFloat(balances.stakedIdl) + numAmount).toFixed(3);
    updateBalances({ staticIdl: newStatic, stakedIdl: newStaked });

    const newStake = {
      id: Date.now(),
      amount: numAmount.toFixed(3),
      duration: `${duration} Days`,
      date: new Date().toLocaleDateString(),
      status: 'Active'
    };

    const updatedStakes = [newStake, ...stakes];
    setStakes(updatedStakes);
    localStorage.setItem('inf_dao_stakes', JSON.stringify(updatedStakes));
    return { success: true };
  };

  const executeBond = async (amount, durationDays, rateRoi) => {
    if (!isConnected) return false;
    const numAmount = parseFloat(amount);
    const currentUsdt = parseFloat(balances.usdt);
    if (currentUsdt < numAmount) {
      return { success: false, error: 'Insufficient USDT balance.' };
    }

    // Try posting to MongoDB if connected
    if (dbStatus.connected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${address.toLowerCase()}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'BOND',
            payload: { amount, durationDays, rateRoi }
          })
        });
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances);
          setBonds(data.bonds);
          return { success: true };
        }
      } catch (err) {
        console.warn('MongoDB action sync failed.', err);
      }
    }

    // Local fallback
    const newUsdt = (currentUsdt - numAmount).toFixed(3);
    updateBalances({ usdt: newUsdt });

    const newBond = {
      id: Date.now(),
      amount: numAmount.toFixed(3),
      plan: `${durationDays} Days (ROI ${(rateRoi * 100).toFixed(1)}%)`,
      date: new Date().toLocaleDateString(),
      status: 'Locked'
    };

    const updatedBonds = [newBond, ...bonds];
    setBonds(updatedBonds);
    localStorage.setItem('inf_dao_bonds', JSON.stringify(updatedBonds));
    return { success: true };
  };

  const executeClaimGyr = async (amount) => {
    if (!isConnected) return false;
    const numAmount = parseFloat(amount);
    const currentGyr = parseFloat(balances.gyr);
    if (currentGyr < numAmount) {
      return { success: false, error: 'Insufficient GYR Balance.' };
    }

    // Try posting to MongoDB if connected
    if (dbStatus.connected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${address.toLowerCase()}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'CLAIM_GYR',
            payload: { amount }
          })
        });
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances);
          return { success: true };
        }
      } catch (err) {
        console.warn('MongoDB action sync failed.', err);
      }
    }

    // Local fallback
    const newGyr = (currentGyr - numAmount).toFixed(3);
    const newReleased = (parseFloat(balances.releasedIdl) + numAmount).toFixed(3);
    updateBalances({ gyr: newGyr, releasedIdl: newReleased });
    return { success: true };
  };

  const executeTurboSwap = async (amount) => {
    if (!isConnected) return false;
    const numAmount = parseFloat(amount);
    const currentReleased = parseFloat(balances.releasedIdl);
    if (currentReleased < numAmount) {
      return { success: false, error: 'Insufficient Released IDL.' };
    }

    // Try posting to MongoDB if connected
    if (dbStatus.connected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${address.toLowerCase()}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'SWAP',
            payload: { amount }
          })
        });
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances);
          setSwaps(data.swaps);
          return { success: true };
        }
      } catch (err) {
        console.warn('MongoDB action sync failed.', err);
      }
    }

    // Local fallback
    const newReleased = (currentReleased - numAmount).toFixed(3);
    const newUsdt = (parseFloat(balances.usdt) + numAmount).toFixed(3);
    updateBalances({ releasedIdl: newReleased, usdt: newUsdt });

    const newSwap = {
      id: Date.now(),
      amount: numAmount.toFixed(3),
      time: 'Ready',
      status: 'Completed'
    };

    const updatedSwaps = [newSwap, ...swaps];
    setSwaps(updatedSwaps);
    localStorage.setItem('inf_dao_swaps', JSON.stringify(updatedSwaps));
    return { success: true };
  };

  const executeLinearRelease = async (amount, periodDays, burnPercent) => {
    if (!isConnected) return false;
    const numAmount = parseFloat(amount);
    const currentStatic = parseFloat(balances.staticIdl);
    if (currentStatic < numAmount) {
      return { success: false, error: 'Insufficient Static Balance.' };
    }

    // Try posting to MongoDB if connected
    if (dbStatus.connected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${address.toLowerCase()}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: 'LINEAR_RELEASE',
            payload: { amount, periodDays, burnPercent }
          })
        });
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances);
          setVestingHistory(data.vestingHistory);
          return { success: true };
        }
      } catch (err) {
        console.warn('MongoDB action sync failed.', err);
      }
    }

    // Local fallback
    const newStatic = (currentStatic - numAmount).toFixed(3);
    const burnAmt = numAmount * (burnPercent / 100);
    const releaseAmt = numAmount - burnAmt;
    const newReleased = (parseFloat(balances.releasedIdl) + releaseAmt).toFixed(3);
    updateBalances({ staticIdl: newStatic, releasedIdl: newReleased });

    const newVesting = {
      id: Date.now(),
      amount: releaseAmt.toFixed(3),
      burn: burnAmt.toFixed(3),
      period: `${periodDays} Days`,
      date: new Date().toLocaleDateString(),
    };

    const updatedVesting = [newVesting, ...vestingHistory];
    setVestingHistory(updatedVesting);
    localStorage.setItem('inf_dao_vesting', JSON.stringify(updatedVesting));
    return { success: true };
  };

  return (
    <Web3Context.Provider value={{
      isConnected,
      address,
      balances,
      stakes,
      bonds,
      swaps,
      vestingHistory,
      dbStatus,
      connectWallet,
      disconnectWallet,
      formatAddress,
      updateBalances,
      executeStake,
      executeBond,
      executeClaimGyr,
      executeTurboSwap,
      executeLinearRelease,
    }}>
      {children}
    </Web3Context.Provider>
  );
};
