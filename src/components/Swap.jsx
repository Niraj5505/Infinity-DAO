import React, { useState, useEffect } from 'react';
import { Settings, ArrowDown, ChevronDown, Info } from 'lucide-react';
import './Swap.css';
import { useWeb3 } from '../web3/Web3Context';

const InfinityLogo = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#gradient-swap)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="gradient-swap" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
  </svg>
);

const UsdtLogo = ({ size = 20 }) => (
  <div style={{
    width: `${size}px`, height: `${size}px`, borderRadius: '50%', 
    background: '#26A17B', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: `${size * 0.6}px`
  }}>
    ₮
  </div>
);

const Swap = () => {
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, balances, updateBalances } = useWeb3();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isUsdtToIdl, setIsUsdtToIdl] = useState(true);

  const rate = isUsdtToIdl ? 3.704 : 0.27; // 1 USDT = 3.704 IDL, 1 IDL = 0.27 USDT

  useEffect(() => {
    if (fromAmount) {
      const converted = (parseFloat(fromAmount) * rate).toFixed(3);
      setToAmount(converted);
    } else {
      setToAmount('');
    }
  }, [fromAmount, isUsdtToIdl]);

  const handleWalletClick = () => {
    if (isConnected) {
      if (window.confirm('Do you want to disconnect your wallet?')) {
        disconnectWallet();
      }
    } else {
      connectWallet();
    }
  };

  const handleSwitchDirection = () => {
    setIsUsdtToIdl(!isUsdtToIdl);
    setFromAmount('');
    setToAmount('');
  };

  const getPayBalance = () => {
    return isUsdtToIdl ? parseFloat(balances.usdt) : parseFloat(balances.staticIdl);
  };

  const handleSwapExecute = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    const numFrom = parseFloat(fromAmount);
    if (!fromAmount || numFrom <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const payBalance = getPayBalance();
    if (payBalance < numFrom) {
      alert(`Insufficient ${isUsdtToIdl ? 'USDT' : 'IDL'} balance.`);
      return;
    }

    // Process conversion transaction
    if (isUsdtToIdl) {
      const newUsdt = (payBalance - numFrom).toFixed(3);
      const newIdl = (parseFloat(balances.staticIdl) + parseFloat(toAmount)).toFixed(3);
      updateBalances({ usdt: newUsdt, staticIdl: newIdl });
      alert(`Successfully swapped ${numFrom} USDT for ${toAmount} IDL!`);
    } else {
      const newIdl = (payBalance - numFrom).toFixed(3);
      const newUsdt = (parseFloat(balances.usdt) + parseFloat(toAmount)).toFixed(3);
      updateBalances({ staticIdl: newIdl, usdt: newUsdt });
      alert(`Successfully swapped ${numFrom} IDL for ${toAmount} USDT!`);
    }

    setFromAmount('');
    setToAmount('');
  };

  return (
    <main className="swap-content animate-up">
      <div className="swap-bg-glow"></div>
      
      <header className="swap-header">
        <h1>Infinity Swap</h1>
        <button className="btn-connect" onClick={handleWalletClick}>
          {isConnected ? formatAddress(address) : 'Connect'}
        </button>
      </header>

      <div className="swap-container">
        <div className="swap-box-header">
          <h2>Swap Tokens</h2>
          <button className="settings-btn">
            <Settings size={20} />
          </button>
        </div>

        <div className="token-input-group">
          <div className="input-top">
            <span className="input-label">You Pay</span>
            <span className="balance-label">
              Balance: {isConnected ? getPayBalance().toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="input-bottom">
            <input 
              type="number" 
              className="amount-input" 
              placeholder="0.0" 
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
            <div className="token-selector">
              {isUsdtToIdl ? (
                <>
                  <UsdtLogo size={24} />
                  <span className="token-symbol">USDT</span>
                </>
              ) : (
                <>
                  <div className="token-icon" style={{background: 'rgba(147, 51, 234, 0.1)', padding: '2px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <InfinityLogo size={20} />
                  </div>
                  <span className="token-symbol">IDL</span>
                </>
              )}
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="swap-divider">
          <button className="switch-btn" onClick={handleSwitchDirection}>
            <ArrowDown size={20} />
          </button>
        </div>

        <div className="token-input-group">
          <div className="input-top">
            <span className="input-label">You Receive</span>
            <span className="balance-label">
              Balance: {isConnected ? (isUsdtToIdl ? parseFloat(balances.staticIdl).toFixed(2) : parseFloat(balances.usdt).toFixed(2)) : '0.00'}
            </span>
          </div>
          <div className="input-bottom">
            <input 
              type="number" 
              className="amount-input" 
              placeholder="0.0" 
              value={toAmount}
              readOnly
            />
            <div className="token-selector">
              {!isUsdtToIdl ? (
                <>
                  <UsdtLogo size={24} />
                  <span className="token-symbol">USDT</span>
                </>
              ) : (
                <>
                  <div className="token-icon" style={{background: 'rgba(147, 51, 234, 0.1)', padding: '2px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <InfinityLogo size={20} />
                  </div>
                  <span className="token-symbol">IDL</span>
                </>
              )}
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="swap-info">
          <div className="info-row">
            <span className="info-label">Exchange Rate</span>
            <span className="info-value">
              {isUsdtToIdl ? '1 USDT ≈ 3.704 IDL' : '1 IDL ≈ 0.27 USDT'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Slippage Tolerance <Info size={14} />
            </span>
            <span className="info-value">0.5%</span>
          </div>
          <div className="info-row">
            <span className="info-label">Minimum Received</span>
            <span className="info-value">
              {toAmount ? (parseFloat(toAmount) * 0.995).toFixed(3) : '0.000'} {isUsdtToIdl ? 'IDL' : 'USDT'}
            </span>
          </div>
        </div>

        <button 
          className="btn-swap-execute" 
          onClick={handleSwapExecute}
          style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-magenta))', color: 'white', fontWeight: '800' }}
        >
          {!isConnected ? 'Connect Wallet' : !fromAmount ? 'Enter an amount' : getPayBalance() < parseFloat(fromAmount) ? 'Insufficient Balance' : 'Swap Tokens'}
        </button>
      </div>
    </main>
  );
};

export default Swap;
