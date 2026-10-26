import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, demoLogin, loading } = useAuth();
  const { lang, t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemoSelect = async (role) => {
    setError('');
    try {
      await demoLogin(role);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '520px' }}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}
          >
            <Lock size={26} />
          </div>
          <h2 id="login-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {lang === 'te' ? 'సచివాలయ ఉద్యోగుల పోర్టల్ లాగిన్' : 'Paderu Staff & Resident Sign In'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
            {lang === 'te' ? 'అధికారిక రికార్డులు & సేవల నిర్వహణ' : 'Role-based access for village administration and records'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--danger-100)' }}>
            {error}
          </div>
        )}

        {/* 1-Click Demo Switcher Section */}
        <div style={{ marginBottom: '1.75rem', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--primary-700)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)' }}>
              {lang === 'te' ? 'డెమో కోసం ఒకే క్లిక్‌తో లాగిన్ అవ్వండి:' : 'Quick 1-Click Demo Reviewer Switch:'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoSelect('Resident')}
              disabled={loading}
              style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.8rem' }}
            >
              <User size={14} style={{ color: 'var(--blue-700)', flexShrink: 0 }} />
              <div>
                <strong>Resident</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>K. Somanna</div>
              </div>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoSelect('Service Staff')}
              disabled={loading}
              style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--primary-700)', flexShrink: 0 }} />
              <div>
                <strong>Digital Asst.</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Staff Role</div>
              </div>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoSelect('Department Officer')}
              disabled={loading}
              style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div>
                <strong>VRO Officer</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Dept Officer</div>
              </div>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoSelect('Administrator')}
              disabled={loading}
              style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--danger-600)', flexShrink: 0 }} />
              <div>
                <strong>Administrator</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Panchayat Secy</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Credential Autofill chips */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>{lang === 'te' ? 'ఆటో-ఫిల్ వివరాలు:' : 'Auto-fill Form:'}</span>
          <button
            type="button"
            onClick={() => { setUsername('admin_paderu'); setPassword('Admin@123'); setError(''); }}
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--slate-100)', borderRadius: '9999px', border: '1px solid var(--slate-300)', cursor: 'pointer', fontWeight: 600, color: 'var(--slate-700)' }}
          >
            Admin (Admin@123)
          </button>
          <button
            type="button"
            onClick={() => { setUsername('officer_vro'); setPassword('Officer@123'); setError(''); }}
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--slate-100)', borderRadius: '9999px', border: '1px solid var(--slate-300)', cursor: 'pointer', fontWeight: 600, color: 'var(--slate-700)' }}
          >
            VRO (Officer@123)
          </button>
          <button
            type="button"
            onClick={() => { setUsername('staff_digital'); setPassword('Staff@123'); setError(''); }}
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--slate-100)', borderRadius: '9999px', border: '1px solid var(--slate-300)', cursor: 'pointer', fontWeight: 600, color: 'var(--slate-700)' }}
          >
            Staff (Staff@123)
          </button>
          <button
            type="button"
            onClick={() => { setUsername('resident_user'); setPassword('Resident@123'); setError(''); }}
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--slate-100)', borderRadius: '9999px', border: '1px solid var(--slate-300)', cursor: 'pointer', fontWeight: 600, color: 'var(--slate-700)' }}
          >
            Resident (Resident@123)
          </button>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              {lang === 'te' ? 'యూజర్‌నేమ్ (Username)' : 'Username'}
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. staff_digital or admin_paderu"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              {lang === 'te' ? 'పాస్‌వర్డ్ (Password)' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="form-helper">
              {lang === 'te' ? 'నమూనా పాస్‌వర్డ్: Staff@123 లేదా Admin@123' : 'Sample pass: Staff@123, Officer@123, Admin@123'}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1.25rem' }}
          >
            {loading ? (lang === 'te' ? 'ధృవీకరిస్తున్నాము...' : 'Verifying...') : (lang === 'te' ? 'ఖాతాలోకి ప్రవేశించండి' : 'Sign In with Password')}
          </button>
        </form>
      </div>
    </div>
  );
}
