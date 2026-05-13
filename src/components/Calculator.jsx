import React, { useState } from 'react';
import './Calculator.css';

const PkgBox = ({ name, duration, roi, meta, isSelected, onClick }) => (
  <div className={`calc-pkg-box ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    <span className="pkg-name">{name}</span>
    <span className="pkg-duration">{duration}</span>
    <span className="pkg-roi">{roi} ROI</span>
    {meta && <span className="pkg-meta">{meta}</span>}
  </div>
);

const Calculator = () => {
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [amount, setAmount] = useState('');

  const singleTokenPkgs = [
    { id: 'f24h', name: 'Flexible Stake', duration: '24H', roi: '0.6%' },
    { id: 'f45d', name: 'Fixed Stake', duration: '45 DAYS', roi: '0.7%' },
    { id: 'f90d', name: 'Fixed Stake', duration: '90 DAYS', roi: '0.8%' },
    { id: 'f180d', name: 'Fixed Stake', duration: '180 DAYS', roi: '0.9%' },
    { id: 'f360d', name: 'Fixed Stake', duration: '360 DAYS', roi: '1.0%' },
  ];

  const bondPkgs = [
    { id: 'b45d', name: 'Bond Stake', duration: '45 DAYS', roi: '0.7%', meta: 'Paid in IDL' },
    { id: 'b90d', name: 'Bond Stake', duration: '90 DAYS', roi: '0.8%', meta: 'Paid in IDL' },
    { id: 'b180d', name: 'Bond Stake', duration: '180 DAYS', roi: '0.9%', meta: 'Paid in IDL' },
    { id: 'b360d', name: 'Bond Stake', duration: '360 DAYS', roi: '360 DAYS', roi: '1.0%', meta: 'Paid in IDL' },
  ];

  const allPkgs = [...singleTokenPkgs, ...bondPkgs];
  const activePkg = allPkgs.find(p => p.id === selectedPkgId);

  // Simulation logic
  const amt = parseFloat(amount) || 0;
  const roiPct = activePkg ? parseFloat(activePkg.roi) / 100 : 0;
  
  const first12h = amt * (roiPct / 2);
  const compoundAmt = amt + first12h;
  const next12h = compoundAmt * (roiPct / 2);
  const totalGained = first12h + next12h;
  const finalAmt = amt + totalGained;

  return (
    <main className="calculator-content animate-up">
      <div className="calc-title-section">
        <h1 className="text-gradient">Staking ROI Calculator</h1>
        <p>Simulate daily compounding returns for Flexible, Fixed & Bond stakes.</p>
      </div>

      <div className="calc-main-grid">
        <div className="calc-card-glass">
          <div className="calc-section-header">
            <span className="calc-section-title">Select a Plan</span>
            <span className="calc-type-labels">FLEXIBLE • FIXED • BOND</span>
          </div>

          <span className="calc-sub-label">Single Token Staking</span>
          <div className="calc-package-grid">
            {singleTokenPkgs.map(pkg => (
              <PkgBox 
                key={pkg.id}
                {...pkg}
                isSelected={selectedPkgId === pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
              />
            ))}
          </div>

          <span className="calc-sub-label">Bond (LP) Staking</span>
          <div className="calc-package-grid bond">
            {bondPkgs.map(pkg => (
              <PkgBox 
                key={pkg.id}
                {...pkg}
                isSelected={selectedPkgId === pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
              />
            ))}
          </div>

          <div className="calc-amount-section">
             <div className="calc-section-header">
               <span className="calc-section-title">Amount</span>
               <span className="unit-tag">Unit: IDL</span>
             </div>
             <div className="amount-input-wrapper">
               <input 
                 type="number" 
                 placeholder="Enter amount to simulate" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
               />
               <span className="unit-tag">IDL</span>
             </div>
             <p className="calc-sub-label" style={{ marginTop: '1rem', textTransform: 'none' }}>
               Calculator will use this amount with compound interest based on your selected plan.
             </p>
          </div>
        </div>

        <div className="calc-card-glass">
           <div className="calc-section-header">
             <span className="calc-section-title">Plan Summary</span>
           </div>

           <div className="summary-top-grid">
              <div className="summary-stat-box">
                <span className="stat-box-label">Plan</span>
                <span className="stat-box-val">{activePkg ? activePkg.name : 'Not selected'}</span>
              </div>
              <div className="summary-stat-box">
                <span className="stat-box-label">Lock Period</span>
                <span className="stat-box-val">{activePkg ? activePkg.duration : 'N/A'}</span>
              </div>
              <div className="summary-stat-box">
                <span className="stat-box-label">Plan ROI %</span>
                <span className="stat-box-val">{activePkg ? activePkg.roi : 'N/A'}</span>
              </div>
           </div>

           <div className="breakdown-card">
              <div className="breakdown-header">24H Compounding Breakdown</div>
              <div className="breakdown-row">
                <span className="breakdown-label">First 12H ROI:</span>
                <span className="breakdown-val">{activePkg && amount ? `${first12h.toFixed(3)} IDL` : 'N/A'}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Compound Amount (after 12H):</span>
                <span className="breakdown-val">{activePkg && amount ? `${compoundAmt.toFixed(3)} IDL` : 'N/A'}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Next 12H ROI:</span>
                <span className="breakdown-val">{activePkg && amount ? `${next12h.toFixed(3)} IDL` : 'N/A'}</span>
              </div>

              <div className="final-result-box">
                <p className="final-result-text">
                   If you stake <span>{amount || '0'} IDL</span> for <span>{activePkg ? activePkg.duration : 'N/A'}</span>, you get:
                </p>
                <h3 className="text-gradient" style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: '900' }}>
                  {activePkg && amount ? `${finalAmt.toFixed(3)} IDL` : 'N/A'}
                </h3>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
};

export default Calculator;
