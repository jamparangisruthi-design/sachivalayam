import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function DemoBanner() {
  const { t } = useLanguage();

  return (
    <aside className="demo-banner" role="region" aria-label="Demo Portal Notice">
      <span className="badge">DEMO / COMMUNITY</span>
      <AlertTriangle size={16} />
      <span>
        <strong>{t('demo_banner_title')}:</strong> {t('demo_banner_desc')}
      </span>
    </aside>
  );
}
