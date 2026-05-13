import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ExternalLink, X, Info, TrendingUp } from 'lucide-react';
import './Bond.css';

const InfinityLogo = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#gradient-bond)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="gradient-bond" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
  </svg>
);

const BondModal = ({ isOpen, onClose, planName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-up">
        <header className="modal-header">
          <div className="modal-title">
            <InfinityLogo size={24} />
            <span>Bond Yield</span>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="modal-body">
          <div className="balance-grid">
            <div className="balance-container" style={{ marginBottom: 0 }}>
              <div className="balance-accent"></div>
              <div className="balance-text">
                IDL Available Balance : <span className="balance-val">0.000 IDL</span>
              </div>
            </div>
            <div className="balance-container" style={{ marginBottom: 0 }}>
              <div className="balance-text" style={{ marginLeft: '1rem' }}>
                USDT Available Balance: <span className="balance-val">0.000 USDT</span>
              </div>
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
                  <p className="referral-label">Your Referral:</p>
                  <p className="referral-desc">No referral input needed for additional stakes.</p>
                </div>
                <div className="referral-link-display">
                  <div className="link-accent"></div>
                  <span className="link-placeholder"></span>
                </div>
                <button className="btn-referral-copy">Copy</button>
              </div>
            </div>

            <div className="modal-column">
              <div className="modal-col-title">Amount to Stake USDT</div>
              <div className="amount-input-wrapper">
                <input type="text" placeholder="Enter amount" />
                <button className="btn-max">MAX</button>
              </div>
              <div className="percent-buttons">
                <button className="btn-percent">25%</button>
                <button className="btn-percent">50%</button>
                <button className="btn-percent">75%</button>
                <button className="btn-percent">100%</button>
              </div>
              <div className="idl-value-display">
                <span>IDL Value:</span>
                <span>0</span>
              </div>
              <div className="wallet-warning" style={{ marginTop: '1.5rem' }}>
                First connect your wallet.
              </div>
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="btn-modal-process">Process</button>
          <button className="btn-modal-cancel" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

const BondCard = ({ title, durationBadge, period, bonus, onStake }) => (
  <div className="bond-card">
    <div className="bond-card-header">
      <div className="stacked-icon-wrapper">
        <div className="bond-logo-main">
          <InfinityLogo size={32} />
        </div>
        <div className="bond-logo-sub">T</div>
      </div>
      <div className="bond-title-group">
        <h3>{title}</h3>
        <span className="badge-duration">{durationBadge}</span>
      </div>
    </div>
    
    <div className="bond-stats-row">
      <div className="bond-stat">
        <span className="stat-label">Period</span>
        <span className="stat-val">{period}</span>
      </div>
      <div className="bond-stat" style={{ textAlign: 'right' }}>
        <span className="stat-label">Bonus ROI</span>
        <span className="stat-val" style={{ color: 'var(--accent-light)' }}>{bonus}</span>
      </div>
    </div>

    <button className="btn-bond-submit" onClick={onStake}>Stake Now</button>
  </div>
);

const Bond = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [timeLeft, setTimeLeft] = useState(34941);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const bondOptions = [
    { id: 1, title: 'Bond Yield IDL', durationBadge: '45d', period: '45 Days', bonus: '0.7%' },
    { id: 2, title: 'Bond Yield IDL', durationBadge: '90d', period: '90 Days', bonus: '0.8%' },
    { id: 3, title: 'Bond Yield IDL', durationBadge: '180d', period: '180 Days', bonus: '0.9%' },
    { id: 4, title: 'Bond Yield IDL', durationBadge: '360d', period: '360 Days', bonus: '1.0%' },
  ];

  return (
    <main className="bond-content animate-up">
      <header className="bond-header">
        <h1>Infinity Bond</h1>
        <button className="btn-connect" style={{background: 'var(--accent-purple)', color: '#111'}}>Connect</button>
      </header>

      <div className="timer-section">
        <div className="release-timer-box">
          <span className="release-label">Next Release</span>
          <span className="time-val">{hours.toString().padStart(2, '0')}</span> <span className="time-unit">HRS</span>
          <span className="time-val">{minutes.toString().padStart(2, '0')}</span> <span className="time-unit">MIN</span>
          <span className="time-val">{seconds.toString().padStart(2, '0')}</span> <span className="time-unit">SEC</span>
        </div>

        <div className="bond-tabs">
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('list')}
          >
            Bond List
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('my')}
          >
            My Bond
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bond-grid">
          {bondOptions.map(option => (
            <BondCard 
              key={option.id}
              title={option.title}
              durationBadge={option.durationBadge}
              period={option.period}
              bonus={option.bonus}
              onStake={() => setIsModalOpen(true)}
            />
          ))}
        </div>
      ) : (
        <div className="staked-list-container glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '32px' }}>
           <ExternalLink size={40} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
           <p style={{ color: 'var(--text-muted)' }}>No active bonds found. Start bonding to earn higher yield.</p>
        </div>
      )}

      <BondModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};

export default Bond;
