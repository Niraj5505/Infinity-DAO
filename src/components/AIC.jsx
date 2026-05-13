import React, { useState } from 'react';
import './AIC.css';

const DetailedScoreItem = ({ name, desc, value, max }) => (
  <div className="detailed-score-card">
    <div className="score-info">
      <span className="score-name">{name}</span>
      <span className="score-desc">{desc}</span>
    </div>
    <div className="score-value-pill">
      {value}/{max}
    </div>
  </div>
);

const AIC = () => {
  const [rewardOn, setRewardOn] = useState(false);

  return (
    <main className="aic-content animate-up">
      <header className="aic-header">
        <h1>AIC Dashboard</h1>
        <button className="btn-connect" style={{background: 'var(--accent-purple)', color: '#111'}}>Connect</button>
      </header>

      {/* Main Score Card */}
      <div className="aic-score-card">
        <h2 className="score-title">AI Commitment Index Score</h2>
        
        <div className="score-display-container">
          <div className="score-value">0</div>
          <div className="score-max">/100</div>
        </div>

        <button className="claim-btn">CLAIM GYR</button>

        <div className="score-requirements">
          <div className="requirement-item">
            <span className="requirement-label">Minimum Rank</span>
            <span className="requirement-value">Surge or above</span>
          </div>
          <div className="requirement-item">
            <span className="requirement-label">AIC Score Requirement</span>
            <span className="requirement-value">≥ 60X</span>
          </div>
        </div>

        <div className="reward-toggle-container">
          <span className="reward-label" style={{ color: rewardOn ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            Guardian Yield Reward
          </span>
          <div 
            className="toggle-switch" 
            onClick={() => setRewardOn(!rewardOn)}
            style={{ backgroundColor: rewardOn ? 'var(--accent-magenta)' : '#1a1a1f' }}
          >
            <div className="toggle-knob" style={{ left: rewardOn ? '26px' : '2px' }}></div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="aic-detailed-scores">
        <DetailedScoreItem 
          name="Staking Consistency Score (SCS)" 
          desc="Measures how consistently a user keeps their stake active over the last 30 days."
          value="0"
          max="25"
        />
        <DetailedScoreItem 
          name="Reinvest Discipline Score (RDS)" 
          desc="Tracks how much of a user's rewards are reinvested instead of withdrawn."
          value="0"
          max="20"
        />
        <DetailedScoreItem 
          name="Withdrawal Behaviour Score (WBS)" 
          desc="Evaluates how aggressively a user withdraws from the system."
          value="0"
          max="20"
        />
        <DetailedScoreItem 
          name="Time-in-System Score (TSS)" 
          desc="Rewards users based on how long they have been active in the platform."
          value="0"
          max="15"
        />
        <DetailedScoreItem 
          name="Treasury Support Score (TSS2)" 
          desc="Measures whether a user is growing or reducing the treasury."
          value="0"
          max="10"
        />
        <DetailedScoreItem 
          name="Risk Hygiene Score (RHS)" 
          desc="Analyzes wallet behaviour for suspicious or abusive patterns."
          value="0"
          max="10"
        />
      </div>
    </main>
  );
};

export default AIC;
