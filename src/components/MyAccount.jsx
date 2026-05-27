import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Wallet, Copy, ArrowUpRight, History, Zap, Clock,
  ChevronLeft, ChevronRight, TrendingUp, Activity,
  Infinity as InfinityIcon, X, AlertCircle, Flame,
  ArrowLeftRight, RotateCcw, Info, CheckCircle2
} from 'lucide-react';
import './MyAccount.css';
import { useWeb3 } from '../web3/Web3Context';

/* ── Linear Release Modal ─────────────────────────────────── */
const PERIODS = [
  { days: 0,  label: '0 day(s)',  burn: '20% Burn', burnPercent: 20 },
  { days: 10, label: '10 day(s)', burn: '15% Burn', burnPercent: 15 },
  { days: 20, label: '20 day(s)', burn: '10% Burn', burnPercent: 10 },
  { days: 30, label: '30 day(s)', burn: '5% Burn',  burnPercent: 5 },
  { days: 60, label: '60 day(s)', burn: 'No Burn',  burnPercent: 0 },
];

const LinearReleaseModal = ({ isOpen, onClose }) => {
  const { isConnected, balances, executeLinearRelease } = useWeb3();
  const [balanceType, setBalanceType]   = useState('static');
  const [selectedPeriod, setSelected]   = useState(0);
  const [amount, setAmount]             = useState('');
  const [errorMsg, setErrorMsg]         = useState('');

  if (!isOpen) return null;

  const currentAvailable = balanceType === 'static' ? parseFloat(balances.staticIdl) : parseFloat(balances.dynamicIdl);
  const approxUsdtRequired = amount ? parseFloat(amount) : 0;
  const usdtBalance = parseFloat(balances.usdt);

  const handleMax = () => {
    setAmount(currentAvailable.toFixed(3));
  };

  const handleProcess = () => {
    setErrorMsg('');
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (numAmount > currentAvailable) {
      setErrorMsg('Amount exceeds available IDL balance.');
      return;
    }
    if (approxUsdtRequired > usdtBalance) {
      setErrorMsg('Insufficient USDT balance for collateral fee.');
      return;
    }

    const period = PERIODS[selectedPeriod];
    const result = executeLinearRelease(amount, period.days, period.burnPercent);
    if (result && result.success) {
      alert(`Successfully initiated Linear Release of ${amount} IDL for ${period.label}!`);
      onClose();
    } else {
      setErrorMsg(result.error || 'Transaction failed.');
    }
  };

  return createPortal(
    <div className="lr-overlay" onClick={onClose}>
      <div className="lr-container animate-up" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <header className="lr-header">
          <div className="lr-title">
            <span>Linear Release</span>
            <span className="lr-badge">IDL</span>
          </div>
          <button className="lr-close" onClick={onClose}><X size={16}/></button>
        </header>

        {/* Static / Dynamic balance cards */}
        <div className="lr-balance-cards">
          <div className="lr-balance-card">
            <span className="lr-bc-label">Static Balance</span>
            <span className="lr-bc-val">{balances.staticIdl} IDL</span>
          </div>
          <div className="lr-balance-card">
            <span className="lr-bc-label">Dynamic Balance</span>
            <span className="lr-bc-val">{balances.dynamicIdl} IDL</span>
          </div>
        </div>

        {/* Balance type selector */}
        <div className="lr-section">
          <span className="lr-label">Select Balance Type</span>
          <div className="lr-type-toggle">
            <button
              className={`lr-type-btn ${balanceType === 'static' ? 'active' : ''}`}
              onClick={() => setBalanceType('static')}
            >
              Static Balance <span className="lr-sub">({balances.staticIdl} IDL)</span>
            </button>
            <button
              className={`lr-type-btn ${balanceType === 'dynamic' ? 'active' : ''}`}
              onClick={() => setBalanceType('dynamic')}
            >
              Dynamic Balance <span className="lr-sub">({balances.dynamicIdl} IDL)</span>
            </button>
          </div>
        </div>

        {/* Release Amount */}
        <div className="lr-section">
          <span className="lr-label">Release Amount</span>
          <div className="lr-input-wrapper">
            <input
              type="number"
              placeholder="0.000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button className="lr-max-btn" onClick={handleMax}>Max</button>
          </div>
        </div>

        {/* Release Period */}
        <div className="lr-section">
          <span className="lr-label">
            Release Period <span className="lr-sublabel">(Choose one)</span>
          </span>
          <div className="lr-periods">
            {PERIODS.map((p, i) => (
              <button
                key={i}
                className={`lr-period-btn ${selectedPeriod === i ? 'active' : ''}`}
                onClick={() => setSelected(i)}
              >
                <span className="lr-period-days">{p.label}</span>
                <span className="lr-period-burn">{p.burn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="lr-disclaimer">
          *Once a withdrawal is initiated, the smart contract will purchase the equivalent
          of IDL required for burning from the gIDL and proceed to burn it. Please ensure
          you have an equivalent amount of USDT in your wallet; otherwise, the transaction
          will fail.
        </p>

        {/* USDT Stats */}
        <div className="lr-stats">
          <div className="lr-stat-card">
            <span className="lr-stat-label">USDT Required</span>
            <span className="lr-stat-val">{approxUsdtRequired.toFixed(3)} USDT</span>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-label">Wallet USDT Balance</span>
            <span className="lr-stat-val">{balances.usdt} USDT</span>
          </div>
        </div>

        {/* Warning & Process Buttons */}
        {!isConnected ? (
          <div className="lr-warning">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>First connect your wallet.</span>
          </div>
        ) : errorMsg ? (
          <div className="lr-warning" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <div className="lr-warning" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>Ready to initiate linear release.</span>
          </div>
        )}

        <button 
          className="card-action-btn" 
          onClick={handleProcess}
          style={{ width: '100%', marginTop: '1.25rem', padding: '0.9rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-magenta))', color: 'white', border: 'none' }}
        >
          INITIATE RELEASE
        </button>

      </div>
    </div>,
    document.body
  );
};

/* ── Turbo Swap Modal ────────────────────────────────────── */
const TurboSwapModal = ({ isOpen, onClose }) => {
  const { isConnected, balances, executeTurboSwap, connectWallet, swaps } = useWeb3();
  const [amount, setAmount] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const releasedBalance = parseFloat(balances.releasedIdl || '0');
  const usdtBalance = parseFloat(balances.usdt || '0');
  const approxUsdtRequired = amount ? parseFloat(amount) : 0;

  const handleMax = () => {
    setAmount(releasedBalance.toFixed(3));
  };

  const handleSwap = () => {
    setErrorMsg('');
    if (!isConnected) {
      connectWallet();
      return;
    }
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (numAmount > releasedBalance) {
      setErrorMsg('Amount exceeds Released IDL balance.');
      return;
    }

    const result = executeTurboSwap(amount);
    if (result && result.success) {
      alert(`Successfully swapped ${amount} IDL for USDT!`);
      setAmount('');
    } else {
      setErrorMsg(result.error || 'Transaction failed.');
    }
  };

  return createPortal(
    <div className="ts-overlay" onClick={onClose}>
      <div className="ts-container animate-up" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <header className="ts-header">
          <div className="ts-title">
            <div className="ts-title-icon"><ArrowLeftRight size={18}/></div>
            <span>Turbo Swap</span>
            <span className="ts-badge">IDL → USDT</span>
          </div>
          <button className="lr-close" onClick={onClose}><X size={16}/></button>
        </header>

        {/* Turbo input row */}
        <div className="ts-input-section">
          <div className="ts-turbo-label">
            <span className="ts-turbo-tag">Turbo Available</span>
            <span className="ts-turbo-val">{balances.releasedIdl} IDL</span>
          </div>

          <div className="ts-input-wrapper">
            <input
              type="number"
              placeholder="0.000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button className="ts-max-btn" onClick={handleMax}>MAX</button>
          </div>

          <div className="ts-usdt-stats">
            <div className="ts-usdt-item">
              <span className="ts-usdt-label">USDT Receive:</span>
              <span className="ts-usdt-val">{approxUsdtRequired.toFixed(3)} USDT</span>
            </div>
            <div className="ts-usdt-item">
              <span className="ts-usdt-label">Your USDT Balance:</span>
              <span className="ts-usdt-val">{balances.usdt} USDT</span>
            </div>
          </div>

          <button className="ts-swap-btn" onClick={handleSwap}>
            <ArrowLeftRight size={16}/> Swap and Withdraw
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.5rem 1.75rem', color: '#f87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {/* Divider */}
        <div className="ts-divider"/>

        {/* Swap List / History toggle */}
        <div className="ts-list-header">
          <h3 className="ts-list-title">{
            showHistory ? 'Swap History' : 'Swap List'
          }</h3>
          <button
            className="ts-history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            <RotateCcw size={14}/>
            {showHistory ? 'Swap List' : 'Swap History'}
          </button>
        </div>

        {/* Table header */}
        <div className="ts-table-head">
          <span>Amount in Swap</span>
          <span>Swap Countdown Timer</span>
          <span style={{textAlign:'right'}}>Status</span>
        </div>

        {/* Swaps Render */}
        {showHistory ? (
          swaps.length === 0 ? (
            <div className="ts-empty">
              <div className="ts-empty-icon"><Info size={22}/></div>
              <span>No Swap history available</span>
            </div>
          ) : (
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {swaps.map(sw => (
                <div key={sw.id} className="ts-table-head" style={{ borderTop: 'none', background: 'transparent' }}>
                  <span style={{ color: 'white', fontWeight: '700' }}>{sw.amount} IDL</span>
                  <span style={{ color: 'var(--text-muted)' }}>{sw.time}</span>
                  <span style={{ textAlign: 'right', color: '#34d399', fontWeight: '700' }}>{sw.status}</span>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="ts-empty">
            <div className="ts-empty-icon"><Info size={22}/></div>
            <span>No active Swaps pending</span>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};

/* ── Sub-components ───────────────────────────────────────── */
const BalanceItem = ({ icon: Icon, label, value }) => (
  <div className="balance-item">
    <div className="balance-icon"><Icon size={20} /></div>
    <div className="balance-details">
      <span className="balance-label">{label}</span>
      <div className="balance-value-row">
        <span className="balance-value">{value}</span>
        <span className="balance-unit">IDL</span>
      </div>
    </div>
  </div>
);

/* ── Main Component ───────────────────────────────────────── */
const MyAccount = ({ onLogout }) => {
  const [showLinearRelease, setShowLinearRelease] = useState(false);
  const [showTurboSwap, setShowTurboSwap] = useState(false);
  
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, balances, vestingHistory } = useWeb3();

  const handleWalletClick = () => {
    if (isConnected) {
      if (window.confirm('Do you want to disconnect your wallet?')) {
        disconnectWallet();
      }
    } else {
      connectWallet();
    }
  };

  const copyAddress = () => {
    if (isConnected) {
      navigator.clipboard.writeText(address);
      alert('Wallet address copied safely!');
    }
  };

  return (
    <main className="account-content animate-up">
      <header className="account-header">
        <h1>My Account</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-connect" 
            style={{background: 'var(--accent-purple)', color: '#111'}}
            onClick={handleWalletClick}
          >
            {isConnected ? formatAddress(address) : 'Connect'}
          </button>
          <button 
            className="btn-connect" 
            style={{background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)'}}
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                if (onLogout) {
                  onLogout();
                } else {
                  localStorage.removeItem('inf_dao_token');
                  localStorage.removeItem('inf_dao_user');
                  window.location.reload();
                }
              }
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="account-grid-top">
        {/* Wallet Card */}
        <div className="wallet-card">
          <div className="wallet-card-bg-icon"><InfinityIcon size={180} /></div>
          <div>
            <div className="wallet-label">YOUR CONNECTED WALLET</div>
            <div className="wallet-info">
              <span className="card-label" style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>
                {isConnected ? 'This address is safely authenticated. Click copy to share it.' : 'Please connect your decentralized wallet to authenticate.'}
              </span>
              <div className="wallet-address-box">
                <span className="wallet-address">{isConnected ? address : 'Wallet Disconnected'}</span>
                {isConnected && (
                  <button className="copy-btn" onClick={copyAddress} style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <Copy size={16} /> Copy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reward Info Card */}
        <div className="account-info-card">
          <h2 className="card-title">REWARD INFORMATION</h2>
          <div className="balance-items">
            <BalanceItem icon={TrendingUp} label="Static Balance"  value={isConnected ? balances.staticIdl : '0.000'} />
            <BalanceItem icon={Activity}   label="Dynamic Balance" value={isConnected ? balances.dynamicIdl : '0.000'} />
          </div>
          <button className="card-action-btn" onClick={() => setShowLinearRelease(true)}>
            <Zap size={16} /> Linear Release
          </button>
        </div>

        {/* Balance Info Card */}
        <div className="account-info-card">
          <h2 className="card-title">BALANCE INFORMATION</h2>
          <div className="balance-items">
            <BalanceItem icon={Wallet} label="Released Balance" value={isConnected ? balances.releasedIdl : '0.000'} />
          </div>
          <button className="card-action-btn" style={{borderColor: 'var(--accent-purple)'}} onClick={() => setShowTurboSwap(true)}>
            <ArrowUpRight size={16} /> Turbo Swap
          </button>
        </div>
      </div>

      {/* Revenue Section */}
      <section className="history-section">
        <div className="history-header">
          <h2 className="section-title">Revenue Source Details</h2>
          <div className="pagination">
            <span>Page 1 of 1</span>
            <button className="page-btn"><ChevronLeft size={16} /></button>
            <button className="page-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="empty-history-card">
          <TrendingUp size={40} strokeWidth={1} />
          <span>No revenue data found.</span>
        </div>
      </section>

      {/* Vesting Section */}
      <section className="history-section">
        <div className="history-header">
          <h2 className="section-title">Vesting History</h2>
        </div>
        
        {!isConnected ? (
          <div className="empty-history-card empty-history-card-large">
            <AlertCircle size={48} strokeWidth={1} style={{ color: '#f87171' }} />
            <span>Connect Wallet to view Vesting History</span>
            <p style={{fontSize: '0.8rem', opacity: 0.6}}>Your active vesting schedules require authentication.</p>
          </div>
        ) : vestingHistory.length === 0 ? (
          <div className="empty-history-card empty-history-card-large">
            <Clock size={48} strokeWidth={1} />
            <span>No Vesting History Available</span>
            <p style={{fontSize: '0.8rem', opacity: 0.6}}>Your vesting schedule will appear here once active.</p>
          </div>
        ) : (
          <div className="staked-table-wrapper" style={{ padding: '1.5rem', background: '#0e0e11', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Released Amount</th>
                  <th style={{ padding: '12px 8px' }}>Burned Amount</th>
                  <th style={{ padding: '12px 8px' }}>Vesting Period</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Initiated Date</th>
                </tr>
              </thead>
              <tbody>
                {vestingHistory.map(vh => (
                  <tr key={vh.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: '700', color: '#34d399' }}>+{vh.amount} IDL</td>
                    <td style={{ padding: '16px 8px', color: '#f87171' }}>-{vh.burn} IDL</td>
                    <td style={{ padding: '16px 8px', color: 'var(--accent-light)' }}>{vh.period}</td>
                    <td style={{ padding: '16px 8px', textAlign: 'right', color: 'var(--text-secondary)' }}>{vh.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <LinearReleaseModal isOpen={showLinearRelease} onClose={() => setShowLinearRelease(false)} />
      <TurboSwapModal    isOpen={showTurboSwap}    onClose={() => setShowTurboSwap(false)} />
    </main>
  );
};

export default MyAccount;

