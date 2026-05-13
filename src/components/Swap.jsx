import React, { useState } from 'react';
import { Settings, ArrowDown, ChevronDown, Info } from 'lucide-react';
import './Swap.css';

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
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  return (
    <main className="swap-content animate-up">
      <div className="swap-bg-glow"></div>
      
      <header className="swap-header">
        <h1>Infinity Swap</h1>
        <button className="btn-connect">Connect</button>
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
            <span className="balance-label">Balance: 1,245.50</span>
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
              <UsdtLogo size={24} />
              <span className="token-symbol">USDT</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="swap-divider">
          <button className="switch-btn">
            <ArrowDown size={20} />
          </button>
        </div>

        <div className="token-input-group">
          <div className="input-top">
            <span className="input-label">You Receive</span>
            <span className="balance-label">Balance: 0.00</span>
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
              <div className="token-icon" style={{background: 'rgba(147, 51, 234, 0.1)'}}>
                <InfinityLogo size={20} />
              </div>
              <span className="token-symbol">IDL</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="swap-info">
          <div className="info-row">
            <span className="info-label">Exchange Rate</span>
            <span className="info-value">1 USDT ≈ 0.57 IDL</span>
          </div>
          <div className="info-row">
            <span className="info-label" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Slippage Tolerance <Info size={14} />
            </span>
            <span className="info-value">0.5%</span>
          </div>
          <div className="info-row">
            <span className="info-label">Minimum Received</span>
            <span className="info-value">0.00 IDL</span>
          </div>
        </div>

        <button className="btn-swap-execute">
          Enter an amount
        </button>
      </div>
    </main>
  );
};

export default Swap;
