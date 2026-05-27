import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import Calculator from './components/Calculator';
import Stake from './components/Stake';
import Bond from './components/Bond';
import Swap from './components/Swap';
import PublicAlliance from './components/PublicAlliance';
import MyAccount from './components/MyAccount';
import AIC from './components/AIC';
import DAO from './components/DAO';
import Auth from './components/Auth';
import AuthGate from './components/AuthGate';
import { Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('inf_dao_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('inf_dao_user'));
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login', 'register', or null

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAuthSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowAuthModal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('inf_dao_token');
    localStorage.removeItem('inf_dao_user');
    localStorage.removeItem('inf_dao_addr');
    localStorage.removeItem('inf_dao_connected');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-brand">
          <span className="text-gradient" style={{fontWeight: 800, fontSize: '1.2rem'}}>INFINITY DAO</span>
        </div>
        <button className="mobile-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`main-content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`} onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
        <Routes>
          <Route path="/" element={<DashboardContent isAuthenticated={isAuthenticated} currentUser={currentUser} setShowAuthModal={setShowAuthModal} handleLogout={handleLogout} />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/stake" element={isAuthenticated ? <Stake /> : <AuthGate pageName="Staking Portal" setShowAuthModal={setShowAuthModal} />} />
          <Route path="/bond" element={isAuthenticated ? <Bond /> : <AuthGate pageName="Bonding Center" setShowAuthModal={setShowAuthModal} />} />
          <Route path="/swap" element={isAuthenticated ? <Swap /> : <AuthGate pageName="Turbo Swap" setShowAuthModal={setShowAuthModal} />} />
          <Route path="/public-alliance" element={isAuthenticated ? <PublicAlliance /> : <AuthGate pageName="Public Alliance" setShowAuthModal={setShowAuthModal} />} />
          <Route path="/my-account" element={isAuthenticated ? <MyAccount onLogout={handleLogout} /> : <AuthGate pageName="My Account" setShowAuthModal={setShowAuthModal} />} />
          <Route path="/aic" element={isAuthenticated ? <AIC /> : <AuthGate pageName="AIC Engine" setShowAuthModal={setShowAuthModal} />} />
          <Route path="/dao" element={isAuthenticated ? <DAO /> : <AuthGate pageName="DAO Governance" setShowAuthModal={setShowAuthModal} />} />
          <Route path="*" element={<div style={{padding: '2rem'}}>Under Construction</div>} />
        </Routes>
      </div>

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(null)}>
          <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <Auth 
              initialMode={showAuthModal === 'register' ? false : true} 
              onAuthSuccess={handleAuthSuccess} 
              isModal={true}
              onClose={() => setShowAuthModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
