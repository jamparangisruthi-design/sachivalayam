import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PhoneCall, Zap, Shield, HeartPulse, Building2 } from 'lucide-react';

export default function EmergencyBar() {
  const { lang, t } = useLanguage();

  const helplines = [
    { label: lang === 'te' ? 'పోలీస్ / అత్యవసరం' : 'Police & Emergency', number: '112', icon: Shield, color: '#ef4444' },
    { label: lang === 'te' ? 'అంబులెన్స్' : 'Medical (108)', number: '108', icon: HeartPulse, color: '#dc2626' },
    { label: lang === 'te' ? 'ఆరోగ్య సమాచారం' : 'Health Helpline (104)', number: '104', icon: HeartPulse, color: '#0284c7' },
    { label: lang === 'te' ? 'విద్యుత్ సమస్యలు (APEPDCL)' : 'Power Outage (APEPDCL)', number: '1912', icon: Zap, color: '#d97706' },
    { label: lang === 'te' ? 'పాడేరు ఏరియా ఆసుపత్రి' : 'Area Hospital Paderu', number: '08935250022', display: '08935-250022', icon: Building2, color: '#16a34a' }
  ];

  return (
    <div className="emergency-strip" role="region" aria-label="Verified Emergency Contacts">
      <div className="container emergency-strip-content">
        <div className="emergency-strip-title">
          <PhoneCall size={16} />
          <span>{lang === 'te' ? 'అత్యవసర హెల్ప్‌లైన్లు (24x7)' : 'Emergency & Essential Helplines (24x7)'}</span>
        </div>
        <div className="emergency-items">
          {helplines.map((item, idx) => (
            <a
              key={idx}
              href={`tel:${item.number}`}
              className="emergency-btn"
              title={`Call ${item.label}`}
              aria-label={`Call ${item.label} on ${item.display || item.number}`}
            >
              <item.icon size={13} style={{ color: item.color }} />
              <span>{item.label}: <strong>{item.display || item.number}</strong></span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
