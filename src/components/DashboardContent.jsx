import React from 'react';
import { 
  Copy, 
  Plus, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Coins, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Database
} from 'lucide-react';
import './DashboardContent.css';
import { useWeb3 } from '../web3/Web3Context';

const StatCard = ({ icon: Icon, label, value, trend, trendType }) => (
  <div className="stat-card">
    <div className="stat-card-bg-glow"></div>
    <div className="stat-icon-wrapper">
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {trend && (
        <div className={`stat-trend ${trendType === 'up' ? 'trend-up' : 'trend-down'}`}>
          {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
    </div>
  </div>
);

const DashboardContent = () => {
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, dbStatus } = useWeb3();

  const handleWalletClick = () => {
    if (isConnected) {
      if (window.confirm('Do you want to disconnect your wallet?')) {
        disconnectWallet();
      }
    } else {
      connectWallet();
    }
  };

  const copyReferral = () => {
    const link = `https://infinitydao.ai/ref/${address || '0x71C7656EC7ab88b098defB751B7401B5f6d2bE23'}`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  return (
    <main className="dashboard-content animate-up">
      <header className="dashboard-header" style={{ alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ margin: 0 }}>Infinity Dashboard</h1>
          {/* MongoDB Connection Status Indicator */}
          <div className="mongodb-badge" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            padding: '5px 12px', 
            borderRadius: '20px',
            fontSize: '0.75rem',
            width: 'fit-content',
            color: 'var(--text-secondary)'
          }}>
            <Database size={12} style={{ color: dbStatus.connected ? '#10b981' : '#f59e0b' }} />
            <span>DB Status:</span>
            <span style={{ 
              fontWeight: '700', 
              color: dbStatus.connected ? '#10b981' : '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {dbStatus.connected ? 'MongoDB Active' : 'MongoDB Sandbox'}
              <span className="db-glow-dot" style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: dbStatus.connected ? '#10b981' : '#f59e0b',
                boxShadow: dbStatus.connected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
                display: 'inline-block'
              }} />
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>| API URI: {dbStatus.uri}</span>
          </div>
        </div>
        <button className="btn-connect" onClick={handleWalletClick}>
          {isConnected ? formatAddress(address) : 'Connect'}
        </button>
      </header>

      <div className="dashboard-banners">
        <div className="banner banner-referral">
          <div>
            <div className="banner-title"><Users size={18} /> Referral Link</div>
            <p className="banner-desc">Invite your friends to Infinity DAO and earn exclusive rewards.</p>
          </div>
          <div className="banner-action">
            <div className="referral-input-box" onClick={copyReferral} style={{ cursor: 'pointer' }}>
              <span>{`https://infinitydao.ai/ref/${isConnected ? formatAddress(address) : '0x71...d2bE'}`}</span>
              <button className="copy-btn" style={{color: 'var(--accent-magenta)', fontWeight: '700'}}>COPY</button>
            </div>
          </div>
        </div>

        <div className="banner banner-idl">
          <div>
            <div className="banner-title"><Coins size={18} /> IDL Token</div>
            <p className="banner-desc">Add IDL to your wallet to start participating in governance.</p>
          </div>
          <div className="banner-action">
            <button className="btn-add-idl">
              <Plus size={18} style={{marginRight: '8px'}} /> Add IDL to Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={ShieldCheck} 
          label="Total Staked" 
          value="1,245,500 IDL" 
          trend="+12.5% this week" 
          trendType="up"
        />
        <StatCard 
          icon={Wallet} 
          label="Treasury Balance" 
          value="$4,820,000" 
          trend="+5.2% vs last month" 
          trendType="up"
        />
        <StatCard 
          icon={TrendingUp} 
          label="IDL Market Cap" 
          value="$12.4M" 
          trend="+8.1% today" 
          trendType="up"
        />
        <StatCard 
          icon={Users} 
          label="Total Members" 
          value="45,230" 
          trend="+1,205 today" 
          trendType="up"
        />
        <StatCard 
          icon={BarChart3} 
          label="24h Trading Vol" 
          value="$850,000" 
          trend="-2.4% vs avg" 
          trendType="down"
        />
        <StatCard 
          icon={Coins} 
          label="IDL Price" 
          value="$0.27" 
          trend="+1.5% in 1h" 
          trendType="up"
        />
      </div>
    </main>
  );
};

export default DashboardContent;
