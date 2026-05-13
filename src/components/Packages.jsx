import React from 'react';
import { TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import './Packages.css';

const PackageCard = ({ name, roi, time, range, iconBg, iconColor }) => {
  return (
    <div className="package-card">
      <div className="package-icon-box" style={{ backgroundColor: iconBg }}>
        <TrendingUp size={32} />
      </div>
      <h3 className="package-name">{name}</h3>
      <div className="package-roi-row">
        <span className="package-roi">{roi}</span>
        <span className="package-roi-time">/ {time}</span>
      </div>
      <div className="package-features">
        <div className="feature-item">
          <CheckCircle2 size={16} className="feature-icon" />
          <span>{range}</span>
        </div>
        <div className="feature-item">
          <CheckCircle2 size={16} className="feature-icon" />
          <span>Instant Activation</span>
        </div>
        <div className="feature-item">
          <CheckCircle2 size={16} className="feature-icon" />
          <span>24/7 Mining Support</span>
        </div>
      </div>
      <button className="btn-buy-plan">Buy Plan</button>
    </div>
  );
};

const Packages = () => {
  const packages = [
    { name: 'Package 1', roi: '0.5%', time: '12 HRS', range: 'USDT 100 - USDT 1000', iconBg: '#2563eb' },
    { name: 'Package 2', roi: '0.6%', time: '12 HRS', range: 'USDT 1500 - USDT 5000', iconBg: '#9333ea' },
    { name: 'Package 3', roi: '0.7%', time: '12 HRS', range: 'USDT 5500 - USDT 10000', iconBg: '#d946ef' },
    { name: 'Package 4', roi: '0.8%', time: '12 HRS', range: 'USDT 10500 - USDT 50000', iconBg: '#ea580c' },
  ];

  return (
    <main className="packages-content animate-up">
      <div className="packages-top-badge">
        <Zap size={14} /> Available Investment Plans
      </div>
      <h1 className="packages-title">
        Choose Your <span className="text-gradient">Growth Path</span>
      </h1>
      <p className="packages-subtitle">
        Select from our professionally curated investment packages designed to maximize your trading returns.
      </p>

      <div className="packages-grid">
        {packages.map((pkg, index) => (
          <PackageCard key={index} {...pkg} />
        ))}
      </div>
    </main>
  );
};

export default Packages;
