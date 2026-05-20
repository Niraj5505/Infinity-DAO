import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCw, ChevronDown, ExternalLink, X, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import './Stake.css';
import { useWeb3 } from '../web3/Web3Context';

const InfinityLogo = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#gradient-stake)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="gradient-stake" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
  </svg>
);

const StakeModal = ({ isOpen, onClose, planName }) => {
  const { isConnected, balances, executeStake, formatAddress, address } = useWeb3();
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const staticBalance = parseFloat(balances.staticIdl || '0');

  const handleMax = () => {
    setAmount(staticBalance.toFixed(3));
  };

  const handlePercent = (percent) => {
    const calculated = (staticBalance * (percent / 100)).toFixed(3);
    setAmount(calculated);
  };

  const getDurationFromPlan = (plan) => {
    if (plan.includes('24h')) return 1;
    if (plan.includes('45d')) return 45;
    if (plan.includes('90d')) return 90;
    if (plan.includes('180d')) return 180;
    return 360;
  };

  const handleProcess = () => {
    setErrorMsg('');
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    const duration = getDurationFromPlan(planName);
    const result = executeStake(amount, duration);
    if (result && result.success) {
      alert(`Successfully staked ${amount} IDL for plan: ${planName}!`);
      onClose();
    } else {
      setErrorMsg(result.error || 'Transaction failed.');
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container animate-up" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title">
            <InfinityLogo size={24} />
            <span>{planName}</span>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="modal-body">
          <div className="balance-container">
            <div className="balance-accent"></div>
            <div className="balance-text">
              IDL Available Balance : <span className="balance-val">{balances.staticIdl} IDL</span>
            </div>
          </div>

          <div className="modal-columns">
            <div className="modal-column">
              <div className="modal-col-title">Referral Details</div>
              <div className="referral-box">
                <div className="referral-status">
                  <div className="status-dot"></div>
                  Referral Already Set
                </div>
                <div className="referral-info-group">
                  <p className="referral-label">Your Referral Link:</p>
                  <p className="referral-desc">Share and earn rewards with your community.</p>
                </div>
                <div className="referral-link-display">
                  <div className="link-accent"></div>
                  <span className="link-placeholder" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {isConnected ? `https://infinitydao.ai/ref/${formatAddress(address)}` : 'Wallet not connected'}
                  </span>
                </div>
                <button className="btn-referral-copy" onClick={() => {
                  if (isConnected) {
                    navigator.clipboard.writeText(`https://infinitydao.ai/ref/${address}`);
                    alert('Referral link copied!');
                  } else {
                    alert('Please connect your wallet first.');
                  }
                }}>Copy Link</button>
              </div>
            </div>

            <div className="modal-column">
              <div className="modal-col-title">Amount to Stake</div>
              <div className="amount-input-wrapper">
                <input 
                  type="number" 
                  placeholder="0.000" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button className="btn-max" onClick={handleMax}>MAX</button>
              </div>
              <div className="percent-buttons">
                <button className="btn-percent" onClick={() => handlePercent(25)}>25%</button>
                <button className="btn-percent" onClick={() => handlePercent(50)}>50%</button>
                <button className="btn-percent" onClick={() => handlePercent(75)}>75%</button>
                <button className="btn-percent" onClick={() => handlePercent(100)}>100%</button>
              </div>
              
              {!isConnected ? (
                <div className="wallet-warning">
                  <AlertCircle size={14} style={{ marginRight: '6px' }} />
                  First connect your wallet.
                </div>
              ) : errorMsg ? (
                <div className="wallet-warning" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                  <AlertCircle size={14} style={{ marginRight: '6px' }} />
                  {errorMsg}
                </div>
              ) : (
                <div className="wallet-warning" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                  <CheckCircle2 size={14} style={{ marginRight: '6px' }} />
                  Ready to stake IDL
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="btn-modal-process" onClick={handleProcess}>Process</button>
          <button className="btn-modal-cancel" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

const StakeCard = ({ title, durationBadge, period, bonus, onStake }) => {
  return (
    <div className="stake-card">
      <div className="stake-card-header">
        <div className="stake-logo-wrapper">
          <InfinityLogo size={32} />
        </div>
        <div className="stake-title-group">
          <h3>{title}</h3>
          <span className="badge-duration">{durationBadge}</span>
        </div>
      </div>

      <div className="stake-stats-row">
        <div className="stake-stat">
          <span className="stat-label">Period</span>
          <span className="stat-val">{period}</span>
        </div>
        <div className="stake-stat" style={{ textAlign: 'right' }}>
          <span className="stat-label">Bonus ROI</span>
          <span className="stat-val" style={{ color: 'var(--accent-light)' }}>{bonus}</span>
        </div>
      </div>

      <button className="btn-stake-submit" onClick={onStake}>Stake Now</button>
    </div>
  );
};

const Stake = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [timeLeft, setTimeLeft] = useState(36788);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, stakes } = useWeb3();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const stakeOptions = [
    { id: 1, title: 'Flexible Stake IDL', durationBadge: '24h', period: '24h', bonus: '0.6%' },
    { id: 2, title: 'Fixed Stake IDL', durationBadge: '45d', period: '45 Days', bonus: '0.7%' },
    { id: 3, title: 'Fixed Stake IDL', durationBadge: '90d', period: '90 Days', bonus: '0.8%' },
    { id: 4, title: 'Fixed Stake IDL', durationBadge: '180d', period: '180 Days', bonus: '0.9%' },
    { id: 5, title: 'Fixed Stake IDL', durationBadge: '360d', period: '360 Days', bonus: '1.0%' },
  ];

  const handleStakeClick = (planName) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

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
    <main className="stake-content animate-up">
      <header className="stake-header">
        <h1>Velocity Staking</h1>
        <button className="btn-connect" onClick={handleWalletClick}>
          {isConnected ? formatAddress(address) : 'Connect'}
        </button>
      </header>

      <div className="timer-section">
        <div className="release-timer-box">
          <span className="release-label">Next Release</span>
          <span className="time-val">{hours.toString().padStart(2, '0')}</span> <span className="time-unit">HRS</span>
          <span className="time-val">{minutes.toString().padStart(2, '0')}</span> <span className="time-unit">MIN</span>
          <span className="time-val">{seconds.toString().padStart(2, '0')}</span> <span className="time-unit">SEC</span>
        </div>

        <div className="stake-tabs">
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('list')}
          >
            Stake List
          </button>
          <button
            className={`tab-btn ${activeTab === 'my' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('my')}
          >
            My Staking
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="stake-grid">
          {stakeOptions.map(option => (
            <StakeCard
              key={option.id}
              title={option.title}
              durationBadge={option.durationBadge}
              period={option.period}
              bonus={option.bonus}
              onStake={() => handleStakeClick(option.title)}
            />
          ))}
        </div>
      ) : (
        <div className="staked-list-container">
          <div className="staked-list-header">
            <h2 className="staked-list-title">Staked List</h2>
            <div className="staked-list-actions">
              <button className="refresh-btn">
                <RefreshCw size={18} />
              </button>
              <div className="page-selector">
                <span>5 / page</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          
          {!isConnected ? (
            <div className="empty-staked-state">
              <div style={{ textAlign: 'center' }}>
                <AlertCircle size={40} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5, color: '#f87171' }} />
                <p>Please connect your wallet first to view your stakes.</p>
              </div>
            </div>
          ) : stakes.length === 0 ? (
            <div className="empty-staked-state">
              <div style={{ textAlign: 'center' }}>
                <ExternalLink size={40} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No active stakes found. Select a plan to get started.</p>
              </div>
            </div>
          ) : (
            <div className="staked-table-wrapper" style={{ padding: '1.5rem', background: '#0e0e11', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Staked Amount</th>
                    <th style={{ padding: '12px 8px' }}>Staking Period</th>
                    <th style={{ padding: '12px 8px' }}>Staked Date</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stakes.map(st => (
                    <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '16px 8px', fontWeight: '700' }}>{st.amount} IDL</td>
                      <td style={{ padding: '16px 8px', color: 'var(--accent-light)' }}>{st.duration}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{st.date}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <StakeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan}
      />
    </main>
  );
};

export default Stake;
