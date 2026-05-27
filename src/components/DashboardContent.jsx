import React, { useRef, useEffect } from 'react';
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

// Custom high-fidelity illustrations to match the mockup's premium 3D look
const MarketValueIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 14px rgba(217, 70, 239, 0.3))' }}>
    <defs>
      <linearGradient id="mv-arrow-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="mv-bill-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4b5563" />
        <stop offset="50%" stopColor="#374151" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
      <linearGradient id="mv-bill-rim" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d946ef" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* Three glowing rising arrows */}
    {/* Left Arrow */}
    <path d="M22 24L26 20L30 24" stroke="url(#mv-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 20V32" stroke="url(#mv-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" />
    
    {/* Middle Arrow (taller) */}
    <path d="M30 16L34 12L38 16" stroke="url(#mv-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 12V32" stroke="url(#mv-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" />
    
    {/* Right Arrow */}
    <path d="M38 24L42 20L46 24" stroke="url(#mv-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 20V32" stroke="url(#mv-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" />

    {/* Banknote Stack (3D front-facing boxes) */}
    {/* Banknote 3 (Bottom) */}
    <rect x="18" y="44" width="32" height="14" rx="3" fill="#18181b" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <rect x="18" y="44" width="32" height="1" fill="rgba(255,255,255,0.1)" />
    
    {/* Banknote 2 (Middle) */}
    <rect x="16" y="40" width="36" height="14" rx="3" fill="#1f2937" stroke="url(#mv-bill-rim)" strokeWidth="1" />
    <rect x="16" y="40" width="36" height="1" fill="rgba(255,255,255,0.15)" />
    
    {/* Banknote 1 (Top) */}
    <rect x="14" y="36" width="40" height="14" rx="3.5" fill="url(#mv-bill-top)" stroke="url(#mv-bill-rim)" strokeWidth="1.5" />
    {/* Banknote details */}
    <rect x="18" y="40" width="32" height="6" rx="1.5" fill="rgba(0,0,0,0.2)" stroke="url(#mv-bill-rim)" strokeWidth="0.75" />
    <circle cx="34" cy="43" r="2.5" fill="url(#mv-arrow-grad)" />
  </svg>
);

const TreasuryBalanceIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 14px rgba(168, 85, 247, 0.3))' }}>
    <defs>
      <linearGradient id="tb-arrow" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
      <linearGradient id="tb-coin-side" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="30%" stopColor="#cbd5e1" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="tb-coin-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
    {/* Background Glow */}
    <circle cx="34" cy="34" r="20" fill="rgba(168, 85, 247, 0.05)" />

    {/* Coin Stack 1 (Back left) */}
    <ellipse cx="24" cy="46" rx="9" ry="4.5" fill="url(#tb-coin-side)" />
    <ellipse cx="24" cy="43" rx="9" ry="4.5" fill="url(#tb-coin-top)" stroke="#94a3b8" strokeWidth="0.5" />
    <ellipse cx="24" cy="40" rx="9" ry="4.5" fill="url(#tb-coin-top)" stroke="#cbd5e1" strokeWidth="0.5" />
    
    {/* Coin Stack 2 (Front center) */}
    {/* Coin Bottom */}
    <ellipse cx="32" cy="50" rx="10" ry="5" fill="url(#tb-coin-side)" />
    <path d="M22 50V54C22 56.5 42 56.5 42 54V50" fill="url(#tb-coin-side)" />
    <ellipse cx="32" cy="54" rx="10" ry="5" fill="url(#tb-coin-top)" />
    
    {/* Coin Middle */}
    <ellipse cx="32" cy="45" rx="10" ry="5" fill="url(#tb-coin-side)" />
    <path d="M22 45V49C22 51.5 42 51.5 42 49V45" fill="url(#tb-coin-side)" />
    <ellipse cx="32" cy="49" rx="10" ry="5" fill="url(#tb-coin-top)" />
    
    {/* Coin Top */}
    <ellipse cx="32" cy="40" rx="10" ry="5" fill="url(#tb-coin-side)" />
    <path d="M22 40V44C22 46.5 42 46.5 42 44V40" fill="url(#tb-coin-side)" />
    <ellipse cx="32" cy="44" rx="10" ry="5" fill="url(#tb-coin-top)" />
    <ellipse cx="32" cy="40" rx="10" ry="5" fill="url(#tb-coin-top)" stroke="#ffffff" strokeWidth="0.75" />
    
    {/* Ascending Trend Arrow (glowing purple/magenta) */}
    <path d="M22 34C28 28 34 22 44 18" stroke="url(#tb-arrow)" strokeWidth="4" strokeLinecap="round" />
    <path d="M36 18H44V26" stroke="url(#tb-arrow)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

    {/* Magnifying Glass with Checkmark (bottom-right) */}
    <circle cx="48" cy="45" r="7.5" fill="#111827" stroke="#d946ef" strokeWidth="2.2" />
    <line x1="53.5" y1="50.5" x2="59" y2="56" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" />
    {/* Green checkmark inside magnifying glass */}
    <path d="M45.5 45L47.5 47L51 43.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TotalSupplyIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 14px rgba(217, 70, 239, 0.3))' }}>
    <defs>
      <linearGradient id="ts-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
      <linearGradient id="ts-coin-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#db2777" />
        <stop offset="50%" stopColor="#701a75" />
        <stop offset="100%" stopColor="#4a044e" />
      </linearGradient>
      <linearGradient id="ts-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    {/* Network Lines */}
    <path d="M34 14L50 23.5V42.5L34 52L18 42.5V23.5L34 14Z" stroke="url(#ts-glow)" strokeWidth="1.5" strokeOpacity="0.5" />
    <path d="M34 14V27M18 23.5L29.5 30M50 23.5L38.5 30M18 42.5L29.5 36M50 42.5L38.5 36M34 52V39" stroke="url(#ts-glow)" strokeWidth="1" strokeOpacity="0.4" />
    
    {/* Spherical Nodes (glowing) */}
    <circle cx="34" cy="14" r="3.5" fill="url(#ts-node-grad)" />
    <circle cx="50" cy="23.5" r="3.5" fill="url(#ts-node-grad)" />
    <circle cx="50" cy="42.5" r="3.5" fill="url(#ts-node-grad)" />
    <circle cx="34" cy="52" r="3.5" fill="url(#ts-node-grad)" />
    <circle cx="18" cy="42.5" r="3.5" fill="url(#ts-node-grad)" />
    <circle cx="18" cy="23.5" r="3.5" fill="url(#ts-node-grad)" />

    {/* Center 3D overlapping coins */}
    {/* Coin 2 (Back right) */}
    <g transform="translate(38, 35) rotate(-15)">
      <ellipse cx="0" cy="0" rx="9" ry="5.5" fill="url(#ts-coin-bg)" stroke="#d946ef" strokeWidth="1" />
      <ellipse cx="0" cy="-1.5" rx="9" ry="5.5" fill="#f472b6" fillOpacity="0.2" stroke="#f472b6" strokeWidth="0.5" />
      <circle cx="0" cy="-1" r="2.5" fill="#ffffff" fillOpacity="0.4" />
    </g>
    
    {/* Coin 1 (Front left) */}
    <g transform="translate(29, 31) rotate(-15)">
      <ellipse cx="0" cy="0" rx="10" ry="6" fill="url(#ts-coin-bg)" stroke="#ffffff" strokeWidth="1.25" />
      <ellipse cx="0" cy="-1.5" rx="10" ry="6" fill="#f472b6" fillOpacity="0.3" stroke="#f472b6" strokeWidth="0.75" />
      <circle cx="0" cy="-1" r="3" fill="#ffffff" fillOpacity="0.6" />
    </g>
  </svg>
);

const IDLTokenIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 18px rgba(168, 85, 247, 0.5))' }}>
    <defs>
      <linearGradient id="idl-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b0764" />
        <stop offset="35%" stopColor="#1e1b4b" />
        <stop offset="70%" stopColor="#0f0728" />
        <stop offset="100%" stopColor="#02000a" />
      </linearGradient>
      <linearGradient id="idl-rim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="50%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="idl-neon-infinity" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    {/* Outer Glowing Rim */}
    <circle cx="34" cy="34" r="23" fill="url(#idl-metal)" stroke="url(#idl-rim)" strokeWidth="2.5" />
    {/* Inner dashed detail */}
    <circle cx="34" cy="34" r="19" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" strokeDasharray="4 2.5" />
    
    {/* Infinity Double-Diamond Symbol */}
    <g transform="translate(34, 34) scale(0.95)">
      {/* Outer Glow behind infinity */}
      <path d="M-10 0C-10 -4.5 -4.5 -4.5 0 0C4.5 4.5 10 4.5 10 0C10 -4.5 4.5 -4.5 0 0C-4.5 4.5 -10 4.5 -10 0Z" stroke="#d946ef" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" style={{ filter: 'blur(3px)' }} />
      {/* Main Sharp Infinity Line */}
      <path d="M-10 0C-10 -4.5 -4.5 -4.5 0 0C4.5 4.5 10 4.5 10 0C10 -4.5 4.5 -4.5 0 0C-4.5 4.5 -10 4.5 -10 0Z" stroke="url(#idl-neon-infinity)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkle dot in intersection */}
      <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
    </g>
  </svg>
);

const USDTTokenIcon = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 18px rgba(168, 85, 247, 0.55))' }}>
    <defs>
      <linearGradient id="usdt-metal-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#e2e8f0" />
        <stop offset="70%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
      <linearGradient id="usdt-rim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="usdt-green" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#26a17b" />
        <stop offset="100%" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    {/* Glowing backdrop halo */}
    <circle cx="34" cy="34" r="23" fill="rgba(168, 85, 247, 0.15)" style={{ filter: 'blur(4px)' }} />

    {/* Silver Coin Rim and Base */}
    <circle cx="34" cy="34" r="23" fill="url(#usdt-metal-bg)" stroke="url(#usdt-rim)" strokeWidth="2.5" />
    <circle cx="34" cy="34" r="19" fill="#f8fafc" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="1.2" />
    
    {/* Inner dashed ring */}
    <circle cx="34" cy="34" r="16.5" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" strokeDasharray="3 2" />

    {/* Tether Symbol */}
    <g transform="translate(34, 34) scale(0.9)">
      {/* Green/Teal Tether icon inside */}
      <path d="M-10 -9H10V-5H2V5C2 6.5 1 7 0 7C-1 7 -2 6.5 -2 5V-5H-10V-9Z" fill="url(#usdt-green)" />
      <path d="M-12 -4H12V-2H-12V-4Z" fill="url(#usdt-green)" />
      {/* White high-gloss line */}
      <path d="M-10 -9H10V-7H-10V-9Z" fill="#ffffff" fillOpacity="0.4" />
    </g>
  </svg>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="stat-card">
    <div className="stat-card-bg-glow"></div>
    <div className="stat-icon-wrapper-large" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
      <Icon />
    </div>
    <div className="stat-info" style={{ textAlign: 'center', width: '100%' }}>
      <span className="stat-label" style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

const DashboardTradingViewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.height = '100%';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      symbol: "BINANCE:BTCUSDT",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: true,
      support_host: "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container dashboard-chart-iframe-container" ref={containerRef} />
  );
};

const DashboardContent = ({ isAuthenticated, currentUser, setShowAuthModal, handleLogout }) => {
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, dbStatus, balances } = useWeb3();

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
      <header className="dashboard-header" style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Infinity Dashboard</h1>
        </div>

        <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    handleLogout();
                  }
                }}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  background: 'rgba(239, 68, 68, 0.05)',
                  color: '#f87171',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn-connect" 
                onClick={() => setShowAuthModal('login')}
                style={{ 
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                }}
              >
                Log In
              </button>
              <button 
                className="btn-connect" 
                onClick={() => setShowAuthModal('register')}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                }}
              >
                Sign Up
              </button>
            </>
          )}

          <button className="btn-connect" onClick={handleWalletClick} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px' }}>
            {isConnected ? formatAddress(address) : 'Connect'}
          </button>
        </div>
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
          icon={MarketValueIcon} 
          label="MARKET VALUE" 
          value="$ 11,626,573.410" 
        />
        <StatCard 
          icon={TreasuryBalanceIcon} 
          label="TREASURY BALANCE" 
          value="4,181,096.275" 
        />
        <StatCard 
          icon={TotalSupplyIcon} 
          label="TOTAL SUPPLY" 
          value="6,250,435.944" 
        />
        <StatCard 
          icon={IDLTokenIcon} 
          label="CURRENT TOKEN PRICE" 
          value="1.860" 
        />
        <StatCard 
          icon={IDLTokenIcon} 
          label={<>WALLET <span className="highlight-idl">IDL</span> BALANCE</>} 
          value={isConnected ? parseFloat(balances.releasedIdl || "0").toFixed(3) : "0.000"} 
        />
        <StatCard 
          icon={USDTTokenIcon} 
          label={<>WALLET <span className="highlight-usdt">USDT</span> BALANCE</>} 
          value={isConnected ? parseFloat(balances.usdt || "0").toFixed(3) : "0.000"} 
        />
      </div>

      {/* Dynamic Bitcoin Live Chart */}
      <div className="dashboard-chart-section animate-up" style={{ marginTop: '2.5rem', width: '100%' }}>
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <TrendingUp size={18} style={{ color: 'var(--accent-magenta)' }} />
                <span>Live Bitcoin Market Analysis</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                Real-time interactive candle data powered by TradingView.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Feed</span>
            </div>
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-glow)', background: '#0e0e11' }}>
            <DashboardTradingViewWidget />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
