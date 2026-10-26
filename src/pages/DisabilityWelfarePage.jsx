import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  HeartHandshake,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Building,
  HelpCircle,
  Accessibility
} from 'lucide-react';

export default function DisabilityWelfarePage() {
  const { lang, t } = useLanguage();

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Accessibility size={16} />
            {lang === 'te' ? 'దివ్యాంగుల సాధికారత & సంక్షేమం' : 'Empowerment of Persons with Disabilities'}
          </div>
          <h1 className="section-title">{t('disability_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('disability_desc')}
          </p>
        </div>

        {/* Respectful Language & Support Banner */}
        <div className="card" style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            <HeartHandshake size={22} style={{ color: 'var(--primary-700)' }} />
            <span>{lang === 'te' ? 'గౌరవప్రదమైన సేవలు & సంపూర్ణ సమానత్వం' : 'Dignity, Respect & Equal Opportunity'}</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
            {lang === 'te'
              ? 'పాడేరు గ్రామ సచివాలయం దివ్యాంగ సోదర సోదరీమణుల సాధికారతకు మరియు సంపూర్ణ సదుపాయాల కల్పనకు కట్టుబడి ఉంది. సదరెం (SADAREM) వైద్య ధృవీకరణ నుండి సహాయక పరికరాలు మరియు ప్రత్యేక పింఛన్ల వరకు అన్ని సేవలను మీ చెంతకే చేరుస్తున్నాము.'
              : 'Paderu Grama Sachivalayam upholds the dignity, rights, and inclusion of all Divyangjan citizens. From SADAREM scientific medical board evaluations at Area Hospital Paderu to motorized tricycles and enhanced monthly social pensions, full assistance is facilitated at your doorstep.'}
          </p>
        </div>

        {/* SADAREM Camp & Schemes Grid */}
        <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                <Calendar size={18} style={{ color: 'var(--primary-700)' }} />
                <span>{lang === 'te' ? 'సదరెం (SADAREM) మెడికల్ బోర్డు శిబిరాల విధానం' : 'SADAREM Medical Assessment Camp'}</span>
              </div>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: '1.8' }}>
                <li>
                  <strong>Venue:</strong> Area Hospital Paderu (District Hospital Campus).
                </li>
                <li>
                  <strong>Camp Schedule:</strong> Every Wednesday between 09:30 AM to 02:00 PM.
                </li>
                <li>
                  <strong>Free Slot Booking:</strong> Book your appointment through Sachivalayam Digital Assistant without any fee.
                </li>
                <li>
                  <strong>Categories Evaluated:</strong> Locomotor (orthopedic), Visual Impairment, Hearing Impairment, Speech Impairment, Mental Retardation, Mental Illness, and Multiple Disabilities.
                </li>
                <li>
                  <strong>Certificate Generation:</strong> Web-based computerized SADAREM certificate with Unique Disability ID (UDID) card.
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'హాజరు కావలసిన పత్రాలు' : 'Documents to Carry for Assessment'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                <div>• Original Aadhaar Card and 2 photocopies</div>
                <div>• White Smart Rice Card / Ration Card</div>
                <div>• 3 Recent Passport size photographs clearly showing the disability</div>
                <div>• Previous hospital treatment discharge summaries or X-ray reports (if any)</div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ backgroundColor: 'var(--slate-50)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--primary-700)' }} />
                <span>Official SADAREM Portal</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: '1.6' }}>
                Verify certificate authenticity, download digital UDID e-cards, or track application status online.
              </p>
              <a
                href="https://sadarem.ap.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-block"
              >
                <span>Visit Official SADAREM Portal</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                {lang === 'te' ? 'అందుబాటులో ఉన్న సహాయక సంక్షేమ పథకాలు' : 'Welfare & Assistive Device Schemes'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--slate-700)' }}>
                <div>
                  <strong>Enhanced Divyangjan Pension:</strong> ₹6,000 per month for benchmark disability (40% to 79%) and ₹15,000 per month for severe/complete disability (80%+ or bedridden).
                </div>
                <div>
                  <strong>Free Assistive Devices:</strong> Motorized tricycles, smart canes, digital hearing aids, and battery-operated wheelchairs through AP Differently Abled Corporation.
                </div>
                <div>
                  <strong>Transport Concessions:</strong> 100% free bus pass in APSRTC Palle Velugu & Express services for person with disability and 50% concession for one escort.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Aggregate Figures (Privacy Protected) */}
        <div className="card" style={{ borderLeft: '4px solid var(--blue-700)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            {lang === 'te' ? 'పాడేరు పంచాయతీ సంక్షేమ గణాంకాలు (గోప్యత రక్షించబడినవి)' : 'Paderu Grama Panchayat Divyangjan Summary (Privacy Protected)'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
            Public demographic figures are shown as aggregate metrics. Individual medical conditions, diagnostic percentages, and supporting documents are strictly restricted from public display.
          </p>

          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>248</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>SADAREM Certified Beneficiaries</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--blue-800)' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>Doorstep Pension Delivery on 1st</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e' }}>42</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>Assistive Devices Allocated (2025-26)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
