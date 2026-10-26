import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileCheck,
  RefreshCw,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function PrivacyPolicyPage({ onOpenPrivacyModal }) {
  const { lang, t } = useLanguage();

  return (
    <div className="section animate-fade-in">
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} />
            {lang === 'te' ? 'పౌరుల గోప్యత & డేటా పాలసీ' : 'Data Governance & Citizen Rights'}
          </div>
          <h1 className="section-title">
            {lang === 'te' ? 'గోప్యతా విధానం & సమాచార హక్కులు' : 'Privacy Policy & Data Protection Standards'}
          </h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {lang === 'te'
              ? 'పాడేరు గ్రామ సచివాలయ పోర్టల్‌లో పౌరుల సమాచార భద్రత మరియు గోప్యతా రక్షణ నిబంధనలు'
              : 'Our commitment to data minimization, privacy preservation, role-based access control, and citizen consent.'}
          </p>
        </div>

        {/* Synthetic Demonstration Data Notice */}
        <div className="card" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertTriangle size={22} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400e', marginBottom: '0.35rem' }}>
                Synthetic Demonstration Data Notice
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: '1.6' }}>
                All household surveys, complaint records, tax demands, and maternal follow-ups presented on this demonstration portal are synthetic, anonymized demonstration records. No actual resident Aadhaar numbers, biometric credentials, or confidential medical histories are stored or exposed.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Key Principles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Principle 1 */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              <Lock size={18} style={{ color: 'var(--primary-700)' }} />
              <span>1. Separation of Public and Restricted Information</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
              Public pages exclusively present aggregated, non-identifiable statistics, service eligibility guidelines, and official public office telephone numbers. Individual household registers, tax assessment balances, maternal health follow-ups, and pension disbursements are strictly restricted behind role-based authentication on the backend server.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="card" style={{ borderLeft: '4px solid var(--blue-700)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              <EyeOff size={18} style={{ color: 'var(--blue-700)' }} />
              <span>2. Small Population Group Suppression (&lt; 10 Individuals)</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
              To prevent re-identification through demographic cross-tabulation in small rural hamlets, any public demographic subset containing fewer than 10 individuals is automatically suppressed or aggregated into broader ward clusters.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              <Database size={18} style={{ color: 'var(--accent-amber)' }} />
              <span>3. Data Minimization & Identifier Masking</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
              We do not collect or store full Aadhaar numbers, bank account numbers, or unnecessary personal identifiers. Where reference numbers are required for scheme tracking, identifiers are masked (e.g. <code>WAP03******19</code>, <code>RCH-2026-***41</code>) in both citizen and staff interfaces.
            </p>
          </div>

          {/* Principle 4 */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary-700)' }} />
              <span>4. Two-Factor Verification for Grievance Tracking</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
              Public tracking of complaints cannot be performed by reference number alone. A two-factor verification step—requiring the matching 10-digit registered mobile phone number—is strictly enforced to prevent unauthorized scanning of village grievances.
            </p>
          </div>

          {/* Principle 5 */}
          <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              <FileCheck size={18} style={{ color: '#6366f1' }} />
              <span>5. Security Audit Logging & Export Justification</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
              Every access to restricted household registers, status modification of village complaints, and bulk data export is cryptographically recorded in an immutable audit log capturing user ID, timestamp, action type, IP address, and mandatory compliance justification.
            </p>
          </div>

          {/* Principle 6: Citizen Data Rights */}
          <div className="card" style={{ borderLeft: '4px solid var(--danger-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              <RefreshCw size={18} style={{ color: 'var(--danger-600)' }} />
              <span>6. Right to Correction, Deletion & Consent Revocation</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Citizens have the fundamental right to request the correction of clerical errors in their village survey entries, request deletion of obsolete records, or revoke previously granted health follow-up consents.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenPrivacyModal}
            >
              <RefreshCw size={14} />
              <span>{lang === 'te' ? 'సమాచార సవరణ / తొలగింపు దరఖాస్తును తెరవండి' : 'Submit Data Correction or Deletion Request'}</span>
            </button>
          </div>
        </div>

        {/* Data Retention Schedule */}
        <div className="card" style={{ backgroundColor: 'var(--slate-50)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            Data Retention & Deletion Schedule
          </h3>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: '1.8' }}>
            <li><strong>Resolved Grievance Tickets:</strong> Retained for 180 days for social audit, then archived with photo evidence purged.</li>
            <li><strong>Household Survey Baseline:</strong> Refreshed bi-annually during the Gram Sabha social audit.</li>
            <li><strong>Security Audit Logs:</strong> Retained for 365 days for regulatory accountability.</li>
            <li><strong>Uploaded Photos:</strong> Scanned for malware and restricted to 5 MB JPEG/PNG formats.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
