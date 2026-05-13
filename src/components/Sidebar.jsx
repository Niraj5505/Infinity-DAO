import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  Layers, 
  Shield, 
  ArrowLeftRight, 
  Users, 
  UserCircle, 
  Cpu,
  Gavel
} from 'lucide-react';
import './Sidebar.css';

const XIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 4l16 16" />
    <path d="M4 20L20 4" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TelegramIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const InfinityLogo = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#gradient)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
  </svg>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-brand">
        <InfinityLogo />
        <span className="text-gradient" style={{ letterSpacing: '1px' }}>INFINITY DAO</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()} end>
          <LayoutDashboard size={20} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/calculator" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <Calculator size={20} className="nav-icon" />
          <span>Calculator</span>
        </NavLink>
        <NavLink to="/stake" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <Layers size={20} className="nav-icon" />
          <span>Stake</span>
        </NavLink>
        <NavLink to="/bond" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <Shield size={20} className="nav-icon" />
          <span>Bond</span>
        </NavLink>
        <NavLink to="/swap" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <ArrowLeftRight size={20} className="nav-icon" />
          <span>Swap</span>
        </NavLink>
        <NavLink to="/public-alliance" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <Users size={20} className="nav-icon" />
          <span>Public Alliance</span>
        </NavLink>
        <NavLink to="/my-account" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <UserCircle size={20} className="nav-icon" />
          <span>My Account</span>
        </NavLink>
        <NavLink to="/aic" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <Cpu size={20} className="nav-icon" />
          <span>AIC</span>
        </NavLink>
        <NavLink to="/dao" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 992 && toggleSidebar()}>
          <Gavel size={20} className="nav-icon" />
          <span>DAO</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="copyright">© 2026 InfinityDAO. All Rights Reserved.</div>
        <div className="social-links">
          <XIcon size={20} className="social-icon" />
          <InstagramIcon size={20} className="social-icon" />
          <TelegramIcon size={20} className="social-icon" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
