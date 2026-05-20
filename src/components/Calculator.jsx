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
    { id: 'b360d', name: 'Bond Stake', duration: '360 DAYS', roi: '1.0%', meta: 'Paid in IDL' },
  ];

  const allPkgs = [...singleTokenPkgs, ...bondPkgs];
  const activePkg = allPkgs.find(p => p.id === selectedPkgId);

  const getDaysFromDuration = (duration) => {
    if (!duration) return 0;
    if (duration.toUpperCase() === '24H') return 1;
    const match = duration.match(/(\d+)\s*DAYS/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  const truncate3Dec = (val) => {
    return (Math.floor(val * 1000) / 1000).toFixed(3);
  };

  // Simulation logic
  const amt = parseFloat(amount) || 0;
  const days = activePkg ? getDaysFromDuration(activePkg.duration) : 0;
  const periods = days * 2;
  const roiPct = activePkg ? parseFloat(activePkg.roi) / 100 : 0;
  const halfRoi = roiPct / 2;
  const halfRoiPct = activePkg ? parseFloat(activePkg.roi) / 2 : 0;

  const first12h = amt * halfRoi;
  const compoundAmt = amt + first12h;
  const next12h = compoundAmt * halfRoi;
  const finalAmt = activePkg ? amt * Math.pow(1 + halfRoi, periods) : 0;

  const TOKEN_PRICE = 1.859;
  const amtInUsdt = amt * TOKEN_PRICE;
  const isBond = activePkg ? activePkg.id.startsWith('b') : false;

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
            <div className="breakdown-header-container">
              <span className="breakdown-header">24H Compounding Breakdown</span>
              {isBond && activePkg && (
                <span className="token-price-pill">Token Price: 1.859 USDT</span>
              )}
            </div>

            {isBond && activePkg && (
              <div className="breakdown-row">
                <span className="breakdown-label">Amount in USDT:</span>
                <span className="breakdown-val" style={{ color: 'var(--text-muted)' }}>
                  {amount !== '' ? `${truncate3Dec(amtInUsdt)} USDT` : '0.000 USDT'}
                </span>
              </div>
            )}

            <div className="breakdown-row">
              <span className="breakdown-label">First 12H ROI:</span>
              <span className="breakdown-val">
                {activePkg && amount !== '' ? (
                  `${amt} × ${halfRoiPct}% = ${truncate3Dec(first12h)} IDL`
                ) : 'N/A'}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">Compound Amount (after 12H):</span>
              <span className="breakdown-val">
                {activePkg && amount !== '' ? (
                  `${amt} + ${truncate3Dec(first12h)} = ${truncate3Dec(compoundAmt)} IDL`
                ) : 'N/A'}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">Next 12H ROI:</span>
              <span className="breakdown-val">
                {activePkg && amount !== '' ? (
                  `${truncate3Dec(compoundAmt)} × ${halfRoiPct}% = ${truncate3Dec(next12h)} IDL`
                ) : 'N/A'}
              </span>
            </div>

            <div className="final-result-box">
              <p className="final-result-text" style={{ color: 'var(--text-secondary)' }}>
                If you {activePkg ? activePkg.name : 'Staking'} for {activePkg ? activePkg.duration : 'N/A'}, you get:
              </p>
              <h3 className="text-gradient" style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: '900' }}>
                {activePkg && amount !== '' ? `${truncate3Dec(finalAmt)} IDL` : '0.000 IDL'}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Calculator;
