import React, { useState, useEffect, useRef } from 'react';
import { Settings, ChevronDown, ChevronUp, Info, Copy, Check, ArrowUpDown } from 'lucide-react';
import './Swap.css';
import { useWeb3 } from '../web3/Web3Context';

// Custom Logos matching the screenshot visual design
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

const UsdtChainLogo = ({ size = 24 }) => (
  <div className="token-icon-wrapper" style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
    <div style={{
      width: '100%', height: '100%', borderRadius: '50%', 
      background: '#26A17B', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: `${size * 0.55}px`
    }}>
      ₮
    </div>
    {/* Purple chain icon overlay in bottom right corner */}
    <div style={{
      position: 'absolute', bottom: '-2px', right: '-2px',
      width: `${size * 0.48}px`, height: `${size * 0.48}px`, borderRadius: '50%',
      background: '#8b5cf6', display: 'flex', alignItems: 'center',
      justifyContent: 'center', border: '1px solid #0f0e13'
    }}>
      <svg width={size * 0.28} height={size * 0.28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </div>
  </div>
);

const UsdtStandardLogo = ({ size = 24 }) => (
  <div className="token-icon-wrapper" style={{
    width: `${size}px`, height: `${size}px`, borderRadius: '50%', 
    background: '#26A17B', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: `${size * 0.55}px`
  }}>
    ₮
  </div>
);

const IdlLogo = ({ size = 24 }) => (
  <div className="token-icon-wrapper" style={{
    width: `${size}px`, height: `${size}px`, borderRadius: '50%',
    background: '#1e2925', display: 'flex', alignItems: 'center',
    justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.08)'
  }}>
    <InfinityLogo size={size * 0.65} />
  </div>
);

// Token List Config matching mockup
const TOKENS = [
  {
    id: 'usdt-chain',
    symbol: 'USDT',
    logoType: 'usdt-chain',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8f',
    balanceKey: 'usdt'
  },
  {
    id: 'usdt-standard',
    symbol: 'USDT',
    logoType: 'usdt-standard',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8f',
    balanceKey: 'usdt'
  },
  {
    id: 'idl',
    symbol: 'IDL',
    logoType: 'idl',
    address: '0x4cf8B05273C0241A41604B521c10748AEb04B58f72d',
    balanceKey: 'staticIdl'
  }
];

const Swap = () => {
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, balances, updateBalances } = useWeb3();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  // Dropdown & Selection States
  const [fromToken, setFromToken] = useState(TOKENS[0]); // USDT (Chain)
  const [toToken, setToToken] = useState(TOKENS[2]); // IDL
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  // Address Copied States
  const [copiedFrom, setCopiedFrom] = useState(false);
  const [copiedTo, setCopiedTo] = useState(false);

  // Refs for click outside detection
  const fromSelectRef = useRef(null);
  const toSelectRef = useRef(null);

  // Exchange rate calculation
  const getRate = () => {
    if (fromToken.symbol === 'USDT' && toToken.symbol === 'IDL') {
      return 3.704;
    }
    if (fromToken.symbol === 'IDL' && toToken.symbol === 'USDT') {
      return 0.27;
    }
    return 1.0; // USDT-USDT, IDL-IDL
  };

  useEffect(() => {
    if (fromAmount) {
      const converted = (parseFloat(fromAmount) * getRate()).toFixed(3);
      setToAmount(converted);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromSelectRef.current && !fromSelectRef.current.contains(event.target)) {
        setFromDropdownOpen(false);
      }
      if (toSelectRef.current && !toSelectRef.current.contains(event.target)) {
        setToDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount('');
    setToAmount('');
  };

  const handleCopy = (addressToCopy, isFrom) => {
    navigator.clipboard.writeText(addressToCopy);
    if (isFrom) {
      setCopiedFrom(true);
      setTimeout(() => setCopiedFrom(false), 1500);
    } else {
      setCopiedTo(true);
      setTimeout(() => setCopiedTo(false), 1500);
    }
  };

  const getPayBalance = () => {
    if (!isConnected) return 0;
    return parseFloat(balances[fromToken.balanceKey] || 0);
  };

  const getReceiveBalance = () => {
    if (!isConnected) return 0;
    return parseFloat(balances[toToken.balanceKey] || 0);
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
      alert(`Insufficient ${fromToken.symbol} balance.`);
      return;
    }

    // Process local conversion transaction
    const newFromBalance = (payBalance - numFrom).toFixed(3);
    const newToBalance = (getReceiveBalance() + parseFloat(toAmount)).toFixed(3);

    updateBalances({
      [fromToken.balanceKey]: newFromBalance,
      [toToken.balanceKey]: newToBalance
    });

    alert(`Successfully swapped ${numFrom} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`);
    setFromAmount('');
    setToAmount('');
  };

  const renderTokenIcon = (logoType, size = 24) => {
    switch (logoType) {
      case 'usdt-chain':
        return <UsdtChainLogo size={size} />;
      case 'usdt-standard':
        return <UsdtStandardLogo size={size} />;
      case 'idl':
        return <IdlLogo size={size} />;
      default:
        return null;
    }
  };

  const formatContractAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
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
        {/* Mockup Top Brand Header */}
        <div className="swap-card-brand-header">
          <div className="brand-logo-text">
            <InfinityLogo size={22} />
            <span className="brand-name">INFINITY DAO</span>
          </div>
          <span className="swap-badge">SWAP</span>
        </div>

        {/* FROM BLOCK */}
        <div className="swap-section">
          <span className="swap-section-label">From</span>
          <div className="swap-input-card">
            <div className="swap-input-left">
              {/* Token Selector & Custom Dropdown */}
              <div className="token-select-wrapper" ref={fromSelectRef}>
                <div 
                  className={`token-selector-btn ${fromDropdownOpen ? 'active' : ''}`} 
                  onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                >
                  {renderTokenIcon(fromToken.logoType, 24)}
                  <span className="token-symbol">{fromToken.symbol}</span>
                  <ChevronDown size={14} className={`chevron-icon ${fromDropdownOpen ? 'rotated' : ''}`} />
                </div>
                
                {fromDropdownOpen && (
                  <div className="token-dropdown-menu">
                    {TOKENS.map((token) => (
                      <div 
                        key={token.id} 
                        className={`token-dropdown-item ${fromToken.id === token.id ? 'selected' : ''}`}
                        onClick={() => {
                          setFromToken(token);
                          setFromDropdownOpen(false);
                        }}
                      >
                        {renderTokenIcon(token.logoType, 20)}
                        <span className="dropdown-token-symbol">{token.symbol}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contract Address Copy Pill */}
              <div 
                className="contract-address-pill" 
                onClick={() => handleCopy(fromToken.address, true)}
                title="Copy Contract Address"
              >
                <span className="address-text">{formatContractAddress(fromToken.address)}</span>
                {copiedFrom ? (
                  <Check size={12} className="copy-icon success-icon animate-pop" />
                ) : (
                  <Copy size={12} className="copy-icon" />
                )}
              </div>
            </div>

            <div className="swap-input-right">
              <span className="balance-label">
                Balance: {isConnected ? getPayBalance().toFixed(3) : '0.000'} {fromToken.symbol}
              </span>
              <div className="amount-input-row">
                <input 
                  type="number" 
                  className="amount-input" 
                  placeholder="0.00" 
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                />
                <button 
                  className="max-btn"
                  onClick={() => {
                    if (isConnected) {
                      setFromAmount(getPayBalance().toString());
                    }
                  }}
                >
                  Max
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SWAP SWITCH DIVIDER */}
        <div className="swap-divider-wrapper">
          <button className="swap-switch-circle" onClick={handleSwitchDirection} title="Switch Tokens">
            <ArrowUpDown size={18} />
          </button>
        </div>

        {/* TO BLOCK */}
        <div className="swap-section">
          <span className="swap-section-label">To</span>
          <div className="swap-input-card">
            <div className="swap-input-left">
              {/* Token Selector & Custom Dropdown */}
              <div className="token-select-wrapper" ref={toSelectRef}>
                <div 
                  className={`token-selector-btn ${toDropdownOpen ? 'active' : ''}`} 
                  onClick={() => setToDropdownOpen(!toDropdownOpen)}
                >
                  {renderTokenIcon(toToken.logoType, 24)}
                  <span className="token-symbol">{toToken.symbol}</span>
                  <ChevronDown size={14} className={`chevron-icon ${toDropdownOpen ? 'rotated' : ''}`} />
                </div>
                
                {toDropdownOpen && (
                  <div className="token-dropdown-menu">
                    {TOKENS.map((token) => (
                      <div 
                        key={token.id} 
                        className={`token-dropdown-item ${toToken.id === token.id ? 'selected' : ''}`}
                        onClick={() => {
                          setToToken(token);
                          setToDropdownOpen(false);
                        }}
                      >
                        {renderTokenIcon(token.logoType, 20)}
                        <span className="dropdown-token-symbol">{token.symbol}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contract Address Copy Pill */}
              <div 
                className="contract-address-pill" 
                onClick={() => handleCopy(toToken.address, false)}
                title="Copy Contract Address"
              >
                <span className="address-text">{formatContractAddress(toToken.address)}</span>
                {copiedTo ? (
                  <Check size={12} className="copy-icon success-icon animate-pop" />
                ) : (
                  <Copy size={12} className="copy-icon" />
                )}
              </div>
            </div>

            <div className="swap-input-right">
              <span className="balance-label">
                Balance: {isConnected ? getReceiveBalance().toFixed(3) : '0.000'} {toToken.symbol}
              </span>
              <div className="amount-input-row">
                <input 
                  type="number" 
                  className="amount-input" 
                  placeholder="0.00" 
                  value={toAmount}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* SWAP DETAIL INFO ROW */}
        <div className="swap-info">
          <div className="info-row">
            <span className="info-label">Exchange Rate</span>
            <span className="info-value">
              1 {fromToken.symbol} ≈ {getRate()} {toToken.symbol}
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
              {toAmount ? (parseFloat(toAmount) * 0.995).toFixed(3) : '0.000'} {toToken.symbol}
            </span>
          </div>
        </div>

        {/* SWAP SUBMIT BUTTON */}
        {!fromAmount || parseFloat(fromAmount) === 0 ? (
          <button className="btn-swap-execute disabled-btn" disabled>
            Enter Amount
          </button>
        ) : !isConnected ? (
          <button className="btn-swap-execute active-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : getPayBalance() < parseFloat(fromAmount) ? (
          <button className="btn-swap-execute disabled-btn" disabled>
            Insufficient Balance
          </button>
        ) : (
          <button className="btn-swap-execute active-btn" onClick={handleSwapExecute}>
            Swap Tokens
          </button>
        )}
      </div>
    </main>
  );
};

export default Swap;
