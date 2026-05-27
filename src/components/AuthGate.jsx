import React from 'react';
import { ShieldAlert, LogIn, UserPlus } from 'lucide-react';

const AuthGate = ({ pageName, setShowAuthModal }) => {
  return (
    <div className="auth-gate-container animate-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      textAlign: 'center',
      padding: '2.5rem 1.5rem',
      background: 'rgba(14, 14, 20, 0.45)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '24px',
      margin: '2rem auto',
      maxWidth: '640px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      <div className="auth-gate-icon-wrapper" style={{
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.2)',
        borderRadius: '50%',
        width: '84px',
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.75rem',
        boxShadow: '0 0 35px rgba(236, 72, 153, 0.15)',
        color: '#ec4899',
        animation: 'pulse-glow 3s infinite ease-in-out'
      }}>
        <ShieldAlert size={42} style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }} />
      </div>

      <h2 style={{ 
        fontSize: '1.95rem', 
        fontWeight: 800, 
        marginBottom: '0.85rem', 
        color: '#fff',
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Authentication Required
      </h2>

      <p style={{ 
        color: 'var(--text-muted)', 
        maxWidth: '460px', 
        fontSize: '0.98rem', 
        lineHeight: 1.6, 
        marginBottom: '2.25rem',
        padding: '0 10px'
      }}>
        Unlock full access to the <strong style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{pageName}</strong>, premium yield packages, and your personalized web3 analytics ledger.
      </p>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', width: '100%', maxWidth: '360px' }}>
        <button 
          className="btn-connect" 
          onClick={() => setShowAuthModal('login')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            flex: 1,
            padding: '0.8rem 1.5rem',
            borderRadius: '14px',
            fontWeight: '700'
          }}
        >
          <LogIn size={16} /> LOG IN
        </button>
        <button 
          className="btn-secondary" 
          onClick={() => setShowAuthModal('register')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px', 
            flex: 1,
            padding: '0.8rem 1.5rem', 
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            color: '#fff',
            fontWeight: '700'
          }}
        >
          <UserPlus size={16} /> SIGN UP
        </button>
      </div>
    </div>
  );
};

export default AuthGate;
