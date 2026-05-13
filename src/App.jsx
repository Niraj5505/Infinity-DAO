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
import { Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
          <Route path="/" element={<DashboardContent />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/bond" element={<Bond />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/public-alliance" element={<PublicAlliance />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/aic" element={<AIC />} />
          <Route path="/dao" element={<DAO />} />
          <Route path="*" element={<div style={{padding: '2rem'}}>Under Construction</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
