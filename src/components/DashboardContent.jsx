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
  ArrowDownRight
} from 'lucide-react';
import './DashboardContent.css';

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
  return (
    <main className="dashboard-content animate-up">
      <header className="dashboard-header">
        <h1>Infinity Dashboard</h1>
        <button className="btn-connect">Connect</button>
      </header>

      <div className="dashboard-banners">
        <div className="banner banner-referral">
          <div>
            <div className="banner-title"><Users size={18} /> Referral Link</div>
            <p className="banner-desc">Invite your friends to Infinity DAO and earn exclusive rewards.</p>
          </div>
          <div className="banner-action">
            <div className="referral-input-box">
              <span>https://infinitydao.ai/ref/0x71...</span>
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
