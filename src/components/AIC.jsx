import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import './AIC.css';
import { useWeb3 } from '../web3/Web3Context';

const ClaimGyrModal = ({ isOpen, onClose }) => {
  const { isConnected, balances, executeClaimGyr, formatAddress } = useWeb3();
  const [claimAmount, setClaimAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const gyrBalance = parseFloat(balances.gyr || '0');
  const usdtBalance = parseFloat(balances.usdt || '0');
  const approxUsdtRequired = claimAmount ? parseFloat(claimAmount) : 0;

  const handleMax = () => {
    setClaimAmount(gyrBalance.toFixed(3));
  };

  const handleProcessClaim = () => {
    setErrorMsg('');
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first.');
      return;
    }
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      setErrorMsg('Please enter a valid claim amount.');
      return;
    }
    if (approxUsdtRequired > usdtBalance) {
      setErrorMsg('Insufficient USDT balance for collateral fee.');
      return;
    }

    const result = executeClaimGyr(claimAmount);
    if (result && result.success) {
      alert(`Successfully claimed ${claimAmount} GYR rewards!`);
      onClose();
    } else {
      setErrorMsg(result.error || 'Transaction failed.');
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container animate-up" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 style={{ margin: 0 }}>GYR Claim Portal</h2>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </header>

        <div className="balance-card-dark">
          <span className="balance-card-label">Available GYR Balance:</span>
          <span className="balance-card-val">{balances.gyr} GYR</span>
        </div>

        <span className="input-label-small">Amount to Claim</span>
        <div className="modal-input-wrapper">
          <input
            type="number"
            placeholder="0.000"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
          />
          <button className="btn-max-pill" onClick={handleMax}>MAX</button>
        </div>

        <p className="disclaimer-small">
          To claim this reward you need USDT equivalent to the amount you are claiming.
        </p>

        <div className="two-col-stats">
          <div className="stat-card-glass">
            <span className="stat-card-label">USDT approx. required</span>
            <span className="stat-card-val">{approxUsdtRequired.toFixed(3)} USDT</span>
          </div>
          <div className="stat-card-glass">
            <span className="stat-card-label">Your USDT balance</span>
            <span className="stat-card-val">{balances.usdt} USDT</span>
          </div>
        </div>

        {!isConnected ? (
          <div className="warning-block">
            <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
            <span className="warning-text">First connect your wallet.</span>
          </div>
        ) : errorMsg ? (
          <div className="warning-block" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
            <span className="warning-text" style={{ color: '#f87171' }}>{errorMsg}</span>
          </div>
        ) : (
          <div className="warning-block" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0 }} />
            <span className="warning-text" style={{ color: '#34d399' }}>Ready to process claim</span>
          </div>
        )}

        <button
          className="claim-btn"
          onClick={handleProcessClaim}
          style={{ width: '100%', marginTop: '1.25rem', padding: '0.9rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-magenta))' }}
        >
          PROCESS CLAIM
        </button>
      </div>
    </div>,
    document.body
  );
};

const DetailedScoreItem = ({ name, desc, value, max }) => (
  <div className="detailed-score-card">
    <div className="score-info">
      <span className="score-name">{name}</span>
      <span className="score-desc">{desc}</span>
    </div>
    <div className="score-value-pill">
      {value}/{max}
    </div>
  </div>
);

const AIC = () => {
  const [rewardOn, setRewardOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isConnected, address, connectWallet, disconnectWallet, formatAddress } = useWeb3();

  const handleWalletClick = () => {
    if (isConnected) {
      if (window.confirm('Do you want to disconnect your wallet?')) {
        disconnectWallet();
      }
    } else {
      connectWallet();
    }
  };

  return (
    <main className="aic-content animate-up">
      <header className="aic-header">
        <h1>AIC Dashboard</h1>
        <button
          className="btn-connect"
          style={{ background: 'var(--accent-purple)', color: '#111' }}
          onClick={handleWalletClick}
        >
          {isConnected ? formatAddress(address) : 'Connect'}
        </button>
      </header>

      {/* Main Score Card */}
      <div className="aic-score-card">
        <h2 className="score-title">AI Commitment Index Score</h2>

        <div className="score-display-container">
          <div className="score-value">{isConnected ? '65' : '0'}</div>
          <div className="score-max">/100</div>
        </div>

        <button className="claim-btn" onClick={() => setIsModalOpen(true)}>CLAIM GYR</button>

        <div className="score-requirements">
          <div className="requirement-item">
            <span className="requirement-label">Minimum Rank</span>
            <span className="requirement-value">Surge or above</span>
          </div>
          <div className="requirement-item">
            <span className="requirement-label">AIC Score Requirement</span>
            <span className="requirement-value">≥ 60X</span>
          </div>
        </div>

        <div className="reward-toggle-container">
          <span className="reward-label" style={{ color: rewardOn ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            Guardian Yield Reward
          </span>
          <div
            className="toggle-switch"
            onClick={() => setRewardOn(!rewardOn)}
            style={{ backgroundColor: rewardOn ? 'var(--accent-magenta)' : '#1a1a1f' }}
          >
            <div className="toggle-knob" style={{ left: rewardOn ? '26px' : '2px' }}></div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="aic-detailed-scores">
        <DetailedScoreItem
          name="Staking Consistency Score (SCS)"
          desc="Measures how consistently a user keeps their stake active over the last 30 days."
          value={isConnected ? '18' : '0'}
          max="25"
        />
        <DetailedScoreItem
          name="Reinvest Discipline Score (RDS)"
          desc="Tracks how much of a user's rewards are reinvested instead of withdrawn."
          value={isConnected ? '15' : '0'}
          max="20"
        />
        <DetailedScoreItem
          name="Withdrawal Behaviour Score (WBS)"
          desc="Evaluates how aggressively a user withdraws from the system."
          value={isConnected ? '12' : '0'}
          max="20"
        />
        <DetailedScoreItem
          name="Time-in-System Score (TSS)"
          desc="Rewards users based on how long they have been active in the platform."
          value={isConnected ? '10' : '0'}
          max="15"
        />
        <DetailedScoreItem
          name="Treasury Support Score (TSS2)"
          desc="Measures whether a user is growing or reducing the treasury."
          value={isConnected ? '5' : '0'}
          max="10"
        />
        <DetailedScoreItem
          name="Risk Hygiene Score (RHS)"
          desc="Analyzes wallet behaviour for suspicious or abusive patterns."
          value={isConnected ? '5' : '0'}
          max="10"
        />
      </div>

      <ClaimGyrModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};

export default AIC;
