import React from 'react';
import { 
  Users, 
  UserPlus, 
  Download, 
  Trophy, 
  Zap, 
  Target, 
  ShieldCheck, 
  BarChart3,
  Link as LinkIcon,
  Crown
} from 'lucide-react';
import './PublicAlliance.css';
import { useWeb3 } from '../web3/Web3Context';

const MiniCard = ({ icon: Icon, label, value }) => (
  <div className="alliance-mini-card">
    <div className="card-icon-circle">
      <Icon size={18} />
    </div>
    <div className="card-info">
      <span className="card-label">{label}</span>
      <span className="card-value">{value}</span>
    </div>
  </div>
);

const RewardCard = ({ icon: Icon, label, value, unit = "IDL" }) => (
  <div className="reward-card">
    <div className="reward-icon">
      <Icon size={32} />
    </div>
    <div className="reward-label">{label}</div>
    <div className="reward-value">
      {value} <span className="reward-unit">{unit}</span>
    </div>
  </div>
);

const ProgressBar = ({ label, current, target, percent }) => (
  <div className="progress-item">
    <div className="progress-item-header">
      <span className="item-label">{label}</span>
      <span className="item-count">{current} / {target}</span>
    </div>
    <div className="progress-bar-bg">
      <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const PublicAlliance = () => {
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
    <main className="alliance-content animate-up">
      <header className="alliance-header">
        <h1>Public Alliance</h1>
        <button 
          className="btn-connect" 
          style={{background: 'var(--accent-purple)', color: '#111'}}
          onClick={handleWalletClick}
        >
          {isConnected ? formatAddress(address) : 'Connect'}
        </button>
      </header>

      <div className="alliance-grid-top">
        <div className="alliance-card-group">
          <h2 className="alliance-section-title">Team Overview</h2>
          <MiniCard icon={Users} label="Total Members" value={isConnected ? "12" : "0"} />
          <MiniCard icon={BarChart3} label="Team Business" value={isConnected ? "25,000.000" : "0.000"} />
        </div>

        <div className="alliance-card-group">
          <h2 className="alliance-section-title">Direct Referral</h2>
          <MiniCard icon={UserPlus} label="Direct Referrals" value={isConnected ? "3" : "0"} />
          <MiniCard icon={Zap} label="Active Direct Referrals" value={isConnected ? "3" : "0"} />
          <MiniCard icon={Target} label="Direct Business" value={isConnected ? "6,500.000" : "0.000"} />
        </div>

        <div className="alliance-card-group">
          <h2 className="alliance-section-title">Referral Info</h2>
          <div className="referral-box">
            <span className="card-label">Your Sponsor</span>
            <div className="referral-input-group">
              <input type="text" className="referral-input" value="0x1234...5678" readOnly />
              <button className="copy-btn">Copy</button>
            </div>
            <div className="sidebar-divider" style={{margin: '0.5rem 0'}}></div>
            <span className="card-label">Presentation</span>
            <button className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <h2 className="alliance-section-title">Velocity Expansion Rewards</h2>
      <div className="alliance-grid-rewards">
        <RewardCard icon={Trophy} label="Direct Acceleration Reward" value={isConnected ? "450.000" : "0.000"} />
        <RewardCard icon={Zap} label="Expansion Tier Reward" value={isConnected ? "Tier 2" : "N/A"} unit="" />
        <RewardCard icon={ShieldCheck} label="Expansion Booster Reward" value={isConnected ? "120.000" : "0.000"} />
        <RewardCard icon={Target} label="Indirect Expansion Reward" value={isConnected ? "890.000" : "0.000"} />
        <RewardCard icon={Crown} label="Rank Achievement Reward" value={isConnected ? "250.000" : "0.000"} />
        <RewardCard icon={BarChart3} label="Expansion Pool Reward" value={isConnected ? "75.000" : "0.000"} />
        <RewardCard icon={Zap} label="Momentum Pool Reward" value={isConnected ? "35.000" : "0.000"} />
        <RewardCard icon={Target} label="Profit Sync Reward" value={isConnected ? "15.000" : "0.000"} />
      </div>

      <div className="alliance-bottom-grid">
        <div className="progress-card">
          <div className="progress-header">
            <h2 className="section-title">Next Rank Progress</h2>
            <span className="rank-badge">{isConnected ? "Level 3 - Surge" : "Level 1 - Starter"}</span>
          </div>
          <div className="progress-list">
            <ProgressBar label="Personal Stake" current={isConnected ? "2500" : "0"} target="1000" percent={isConnected ? 100 : 0} />
            <ProgressBar label="Team Business" current={isConnected ? "25000" : "0"} target="10000" percent={isConnected ? 100 : 0} />
            <ProgressBar label="Strong Leg Business" current={isConnected ? "15000" : "0"} target="5000" percent={isConnected ? 100 : 0} />
            <ProgressBar label="Other Legs Business" current={isConnected ? "10000" : "0"} target="5000" percent={isConnected ? 100 : 0} />
            <ProgressBar label="Direct Active Referrals" current={isConnected ? "3" : "0"} target="3" percent={isConnected ? 100 : 0} />
          </div>
        </div>

        <div className="empty-referral-card">
          <Users size={48} strokeWidth={1} />
          <span>{isConnected ? "Invite code active" : "No direct referrals found."}</span>
          <button className="btn-secondary" style={{fontSize: '0.85rem'}} onClick={() => {
            if (isConnected) {
              navigator.clipboard.writeText(`https://infinitydao.ai/ref/${address}`);
              alert('Copied invite link!');
            } else {
              alert('Please connect your wallet first.');
            }
          }}>Invite Friends</button>
        </div>
      </div>
    </main>
  );
};

export default PublicAlliance;
