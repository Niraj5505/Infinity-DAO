import React from 'react';
import { 
  Info, 
  Plus, 
  Vote, 
  Gavel, 
  ShieldCheck, 
  Clock, 
  BarChart2,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import './DAO.css';
import { useWeb3 } from '../web3/Web3Context';

const DAO = () => {
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress, balances } = useWeb3();

  const handleWalletClick = () => {
    if (isConnected) {
      if (window.confirm('Do you want to disconnect your wallet?')) {
        disconnectWallet();
      }
    } else {
      connectWallet();
    }
  };

  return (
    <main className="dao-content animate-up">
      <header className="dao-header">
        <h1>Infinity DAO</h1>
        <button 
          className="btn-connect" 
          style={{background: 'var(--accent-purple)', color: '#111'}}
          onClick={handleWalletClick}
        >
          {isConnected ? formatAddress(address) : 'Connect'}
        </button>
      </header>

      <div className="dao-main-grid">
        <div className="dao-left-section">
          {/* Governance Header Card */}
          <div className="governance-card">
            <div className="gov-info">
              <h2>
                DAO Governance <Info size={18} style={{color: 'var(--text-muted)', cursor: 'help'}} />
              </h2>
              <p>
                Create proposals and participate in voting using your delegated IDL power. 
                Shape the future of Infinity DAO with decentralized decision-making.
              </p>
            </div>
            <button className="btn-new-proposal" onClick={() => {
              if (isConnected) {
                alert('Proposal creation will be enabled in Phase 2.');
              } else {
                connectWallet();
              }
            }}>
              New Proposal
            </button>
          </div>

          {/* Ongoing Proposals Card */}
          <div className="proposals-card">
            <h3 className="proposals-title">Ongoing Proposals</h3>
            <div className="proposal-loading">
              <Clock size={20} className="spin-slow" />
              <span>{isConnected ? "Active Proposals are loaded: No pending community votes this epoch." : "Loading active governance proposals..."}</span>
            </div>
          </div>
        </div>

        <div className="dao-side-cards">
          {/* IDL Power Card */}
          <div className="idl-power-card">
            <div className="power-info">
              <span className="power-label">
                Your IDL Power <Info size={14} style={{color: 'var(--text-muted)'}} />
              </span>
              <span className="power-subtext">{isConnected ? "Delegated successfully" : "Power activates after self-delegation"}</span>
              <div className="dao-points">
                Dao Points <span className="points-val">{isConnected ? (parseFloat(balances.staticIdl) * 2.5).toFixed(0) : "0"}</span>
              </div>
            </div>
            <button className="btn-add-power" onClick={() => {
              if (isConnected) {
                alert('Delegated new voting weight successfully!');
              } else {
                connectWallet();
              }
            }}>
              <Plus size={20} />
            </button>
          </div>

          {/* Past Proposals Card */}
          <div className="past-proposals-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h3 className="proposals-title" style={{margin: 0}}>Past Proposals</h3>
              <BarChart2 size={18} style={{color: 'var(--text-muted)'}} />
            </div>
            <div className="proposal-loading">
              <Gavel size={24} strokeWidth={1.5} style={{opacity: 0.5}} />
              <span style={{fontSize: '0.85rem'}}>No past proposals to display.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DAO;
