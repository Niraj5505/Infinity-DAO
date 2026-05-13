import React from 'react';
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
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
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
        {/* Fallback route for all other links */}
        <Route path="*" element={<div style={{marginLeft: '250px', padding: '2rem'}}>Under Construction</div>} />
      </Routes>
    </div>
  );
}

export default App;
