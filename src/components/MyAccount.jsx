import React from 'react';
import { 
  Wallet, 
  Copy, 
  ArrowUpRight, 
  History, 
  Zap, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Activity,
  Infinity as InfinityIcon
} from 'lucide-react';
import './MyAccount.css';

const BalanceItem = ({ icon: Icon, label, value }) => (
  <div className="balance-item">
    <div className="balance-icon">
      <Icon size={20} />
    </div>
    <div className="balance-details">
      <span className="balance-label">{label}</span>
      <div className="balance-value-row">
        <span className="balance-value">{value}</span>
        <span className="balance-unit">IDL</span>
      </div>
    </div>
  </div>
);

const MyAccount = () => {
  return (
    <main className="account-content animate-up">
      <header className="account-header">
        <h1>My Account</h1>
        <button className="btn-connect" style={{background: 'var(--accent-purple)', color: '#111'}}>Connect</button>
      </header>

      <div className="account-grid-top">
        {/* Wallet Card */}
        <div className="wallet-card">
          <div className="wallet-card-bg-icon">
            <InfinityIcon size={180} />
          </div>
          <div>
            <div className="wallet-label">YOUR CONNECTED WALLET</div>
            <div className="wallet-info">
              <span className="card-label" style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>
                This address is read-only. Click the icon to copy it safely.
              </span>
              <div className="wallet-address-box">
                <span className="wallet-address">0x71C765...d2bE</span>
                <button className="copy-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                  <Copy size={16} /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Info Card */}
        <div className="account-info-card">
          <h2 className="card-title">REWARD INFORMATION</h2>
          <div className="balance-items">
            <BalanceItem icon={TrendingUp} label="Static Balance" value="0.000" />
            <BalanceItem icon={Activity} label="Dynamic Balance" value="0.000" />
          </div>
          <button className="card-action-btn">
            <Zap size={16} /> Linear Release
          </button>
        </div>

        {/* Balance Info Card */}
        <div className="account-info-card">
          <h2 className="card-title">BALANCE INFORMATION</h2>
          <div className="balance-items">
            <BalanceItem icon={Wallet} label="Released Balance" value="0.000" />
          </div>
          <button className="card-action-btn" style={{borderColor: 'var(--accent-purple)'}}>
            <ArrowUpRight size={16} /> Turbo Swap
          </button>
        </div>
      </div>

      {/* Revenue Section */}
      <section className="history-section">
        <div className="history-header">
          <h2 className="section-title">Revenue Source Details</h2>
          <div className="pagination">
            <span>Page 1 of 1</span>
            <button className="page-btn"><ChevronLeft size={16} /></button>
            <button className="page-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="empty-history-card">
          <TrendingUp size={40} strokeWidth={1} />
          <span>No revenue data found.</span>
        </div>
      </section>

      {/* Vesting Section */}
      <section className="history-section">
        <div className="history-header">
          <h2 className="section-title">Vesting History</h2>
        </div>
        <div className="empty-history-card empty-history-card-large">
          <Clock size={48} strokeWidth={1} />
          <span>No Vesting History Available</span>
          <p style={{fontSize: '0.8rem', opacity: 0.6}}>Your vesting schedule will appear here once active.</p>
        </div>
      </section>
    </main>
  );
};

export default MyAccount;
