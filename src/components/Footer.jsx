import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ExternalLink, Heart, AlertCircle, PhoneCall } from 'lucide-react';

export default function Footer({ onNavigate, onOpenPrivacyModal }) {
  const { lang, t } = useLanguage();

  return (
    <footer className="portal-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Village Portal Info */}
          <div className="footer-col">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={18} style={{ color: 'var(--primary-500)' }} />
              {t('portal_title')}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-400)', lineHeight: '1.6', marginBottom: '1rem' }}>
              {t('footer_text')}
            </p>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#fed7aa', border: '1px solid rgba(254, 215, 170, 0.2)' }}>
              <strong>{lang === 'te' ? 'గమనిక:' : 'Notice:'}</strong> {t('footer_disclaimer')}
            </div>
          </div>

          {/* Column 2: Verified Official AP State Portals */}
          <div className="footer-col">
            <h4>{lang === 'te' ? 'ధృవీకరించబడిన అధికారిక పోర్టల్స్' : 'Verified Official Portals'}</h4>
            <ul className="footer-links">
              <li>
                <a href="https://spandana.ap.gov.in" target="_blank" rel="noopener noreferrer">
                  AP Spandana Grievance <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
              <li>
                <a href="https://meeseva.gov.in" target="_blank" rel="noopener noreferrer">
                  AP MeeSeva Services <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
              <li>
                <a href="https://epdsap.ap.gov.in" target="_blank" rel="noopener noreferrer">
                  Civil Supplies e-PDS <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
              <li>
                <a href="https://www.apeasternpower.com" target="_blank" rel="noopener noreferrer">
                  APEPDCL Power 1912 <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
              <li>
                <a href="https://sspensions.ap.gov.in" target="_blank" rel="noopener noreferrer">
                  AP Social Pensions <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
              <li>
                <a href="https://pmayg.nic.in" target="_blank" rel="noopener noreferrer">
                  PMAY-Gramin Housing <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Privacy */}
          <div className="footer-col">
            <h4>{lang === 'te' ? 'పౌర హక్కులు & సమాచారం' : 'Citizen Rights & Policy'}</h4>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  style={{ color: 'var(--slate-400)', fontSize: '0.9rem', textAlign: 'left', padding: '0.2rem 0' }}
                >
                  {t('privacy_policy_btn')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacyModal}
                  style={{ color: '#93c5fd', fontSize: '0.9rem', textAlign: 'left', padding: '0.2rem 0', fontWeight: 600 }}
                >
                  {lang === 'te' ? 'సమాచార సవరణ / తొలగింపు దరఖాస్తు' : 'Request Data Correction / Deletion'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contacts')}
                  style={{ color: 'var(--slate-400)', fontSize: '0.9rem', textAlign: 'left', padding: '0.2rem 0' }}
                >
                  {t('nav_contacts')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('households')}
                  style={{ color: 'var(--slate-400)', fontSize: '0.9rem', textAlign: 'left', padding: '0.2rem 0' }}
                >
                  {t('nav_households')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 Paderu Grama Sachivalayam Demonstration Portal • Paderu, ASR District, Andhra Pradesh
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
              Designed for Mobile & Rural Low-Bandwidth Connectivity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
