import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  ShieldAlert,
  Droplets,
  Zap,
  Building,
  PhoneCall,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  HeartPulse,
  ExternalLink,
  Award,
  Heart
} from 'lucide-react';

export default function HomePage({ onNavigate, onOpenLogin }) {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()).catch(() => ({ stats: null })),
      fetch('/api/announcements').then(res => res.json()).catch(() => ({ announcements: [] }))
    ]).then(([statsData, annData]) => {
      setStats(statsData.stats);
      setAnnouncements(annData.announcements || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section with Paderu Landscape Banner */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url('/images/paderu-valley.jpg')` }}
      >
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Compass size={16} />
              <span>
                {lang === 'te'
                  ? 'అల్లూరి సీతారామరాజు జిల్లా ప్రధాన కేంద్రం'
                  : 'Tribal Agency Headquarters • Alluri Sitharama Raju District'}
              </span>
            </div>

            <h1 className="hero-title">{t('hero_title')}</h1>
            <p className="hero-subtitle">{t('hero_desc')}</p>

            <div className="hero-actions">
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('apply')}
                style={{ fontSize: '1.05rem', padding: '0.85rem 1.6rem', backgroundColor: '#059669', borderColor: '#059669' }}
              >
                <Award size={18} />
                <span>{lang === 'te' ? 'ఆన్‌లైన్ సర్టిఫికెట్ల దరఖాస్తు' : 'Apply for Certificates'}</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => onNavigate('pension')}
                style={{ fontSize: '1.05rem', padding: '0.85rem 1.6rem', backgroundColor: '#e11d48', borderColor: '#e11d48' }}
              >
                <Heart size={18} />
                <span>{lang === 'te' ? 'ఎన్టీఆర్ భరోసా పింఛన్లు' : 'NTR Bharosa Pensions'}</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => onNavigate('complaints')}
                style={{ fontSize: '1.05rem', padding: '0.85rem 1.6rem' }}
              >
                <ShieldAlert size={18} />
                <span>{t('btn_submit_complaint')}</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('complaints')}
              >
                <FileText size={18} />
                <span>{t('btn_track_status')}</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('services')}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <span>{t('btn_browse_services')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Summary Statistics Banner */}
      <div className="container">
        <div className="stats-banner">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{stats ? stats.surveyed_households_demo.toLocaleString() : '4,820'}</h3>
              <p>{t('stat_households')}</p>
            </div>
            <div className="stat-item">
              <h3>{stats ? `${stats.drinking_water_coverage_pct}%` : '94.8%'}</h3>
              <p>{t('stat_water_coverage')}</p>
            </div>
            <div className="stat-item">
              <h3>{stats ? `${stats.electrification_pct}%` : '98.2%'}</h3>
              <p>{t('stat_electrification')}</p>
            </div>
            <div className="stat-item">
              <h3>{stats ? stats.pension_beneficiaries_demo.toLocaleString() : '1,640'}</h3>
              <p>{t('stat_pensions')}</p>
            </div>
            <div className="stat-item">
              <h3>{stats ? stats.anganwadi_centers_active : '4'}</h3>
              <p>{t('stat_anganwadi')}</p>
            </div>
            <div className="stat-item">
              <h3>{stats ? `${stats.grievances.resolution_rate_pct}%` : '95.1%'}</h3>
              <p>{t('stat_resolution')}</p>
            </div>
          </div>

          <div className="stats-disclaimer">
            <strong>{lang === 'te' ? 'నమూనా గణాంకాలు:' : 'Sample Demonstration Data:'}</strong>{' '}
            {t('stat_privacy_note')}
          </div>
        </div>
      </div>

      {/* 3. Village Overview of Paderu */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                <Building size={16} />
                {lang === 'te' ? 'పాడేరు పరిచయం & పరిపాలన' : 'About Paderu & Village Administration'}
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem', lineHeight: '1.3' }}>
                {lang === 'te'
                  ? 'ప్రజల చెంతకే సచివాలయ సేవలు – పాడేరు గ్రామ సమాచారం'
                  : 'Doorstep Governance for the Tribal Agency Heartland'}
              </h2>
              <p style={{ color: 'var(--slate-600)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {lang === 'te'
                  ? 'పాడేరు ఆంధ్రప్రదేశ్‌లోని అల్లూరి సీతారామరాజు (ASR) జిల్లా కేంద్రం మరియు తూర్పు కనుమలలోని ప్రముఖ గిరిజన ప్రాంతం. ఎత్తైన కాఫీ తోటలు, ప్రసిద్ధ మోదకొండమ్మ అమ్మవారి క్షేత్రం మరియు వారపు సంత (శనివారం) ఇక్కడి ప్రధాన విశేషాలు.'
                  : 'Paderu serves as the district headquarters of Alluri Sitharama Raju (ASR) district, situated amidst the picturesque valleys and coffee plantations of the Eastern Ghats. It houses the Integrated Tribal Development Agency (ITDA) and historic Modakondamma Ammavari temple.'}
              </p>
              <p style={{ color: 'var(--slate-600)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {lang === 'te'
                  ? 'ఈ గ్రామ సచివాలయ పోర్టల్ ద్వారా పంచాయతీ కార్యదర్శి, వి.ఆర్.ఓ, డిజిటల్ అసిస్టెంట్, ఇంజనీరింగ్ అసిస్టెంట్, ఏఎన్ఎం మరియు మహిళా పోలీసులతో పౌరులు సులభంగా అనుసంధానం కావచ్చు.'
                  : 'Through the Grama Sachivalayam system, 11 dedicated village functionaries—including Panchayat Secretary, Village Revenue Officer, Digital Assistant, Engineering Assistant, ANM, and Energy Assistant—bring single-window citizen services to residents.'}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => onNavigate('contacts')}>
                  <PhoneCall size={16} />
                  <span>{lang === 'te' ? 'సచివాలయ అధికారుల ఫోన్ నంబర్లు' : 'View Sachivalayam Officials'}</span>
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigate('households')}>
                  <Users size={16} />
                  <span>{lang === 'te' ? 'గ్రామ జనాభా గణాంకాలు' : 'Village Demographics'}</span>
                </button>
              </div>
            </div>

            <div>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '4px solid #ffffff' }}>
                <img
                  src="/images/sachivalayam-center.jpg"
                  alt="Paderu Grama Sachivalayam Citizen Service Center"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: 0, insetInline: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '1.25rem', color: '#ffffff' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {lang === 'te' ? 'పాడేరు గ్రామ సచివాలయ భవనం' : 'Paderu Grama Sachivalayam Service Complex'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                    {lang === 'te' ? 'పౌర సేవల కౌంటర్లు & రైతు భరోసా కేంద్రం' : 'Single-Window Citizen Counter & RBK Desk'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Dedicated NTR Bharosa Social Security Pension Feature Section */}
      <section className="section" style={{ backgroundColor: '#fff1f2', borderBottom: '1px solid #fecdd3', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <div className="container">
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.25rem', border: '2px solid #fda4af', boxShadow: 'var(--shadow-lg)' }}>
            <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffe4e6', color: '#be123c', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <Heart size={14} fill="#e11d48" color="#e11d48" />
                  <span>{lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం • సామాజిక భద్రతా పింఛన్లు' : 'Govt of AP • NTR Bharosa Social Security Pensions'}</span>
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#881337', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                  {lang === 'te' ? 'నెలకు ₹4,000 నుండి ₹15,000 వరకు ఇంటి వద్దే పింఛను పంపిణీ' : 'Doorstep Monthly Pension: ₹4,000 to ₹15,000 Every 1st of the Month'}
                </h2>
                <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {lang === 'te'
                    ? 'పాడేరు గ్రామ సచివాలయ పరిధిలోని 1,640 మంది అర్హులైన వృద్ధులు, వితంతువులు, దివ్యాంగులు, చేనేత, కల్లుగీత మరియు డయాలసిస్ రోగులకు ప్రతి నెలా 1వ తేదీనే సచివాలయ సిబ్బంది బయోమెట్రిక్ ద్వారా ఇంటి వద్దే నేరుగా నగదు అందజేస్తారు.'
                    : 'Paderu Grama Sachivalayam delivers transparent doorstep pensions across 8 categories on the 1st of every month via Aadhaar biometric/facial authentication with zero hassle.'}
                </p>

                {/* Amount badges */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#9f1239', fontWeight: 700 }}>{lang === 'te' ? 'వృద్ధాప్య / వితంతు / చేనేత' : 'Old Age / Widow / Weavers'}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#be123c' }}>₹4,000 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ month</span></div>
                  </div>
                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>{lang === 'te' ? 'దివ్యాంగులు (సదరెం 40-79%)' : 'Disabled (SADAREM 40-79%)'}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d4ed8' }}>₹6,000 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ month</span></div>
                  </div>
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>{lang === 'te' ? 'డయాలసిస్ రోగులు (CKD)' : 'Dialysis / CKD Patients'}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d' }}>₹10,000 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ month</span></div>
                  </div>
                  <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#6b21a8', fontWeight: 700 }}>{lang === 'te' ? 'తీవ్ర వైకల్యం (80%+ / మంచానికే పరిమితం)' : 'Severe Bedridden (80%+)'}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#7e22ce' }}>₹15,000 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ month</span></div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate('pension')}
                    style={{ backgroundColor: '#e11d48', borderColor: '#e11d48', fontWeight: 700 }}
                  >
                    <Heart size={16} />
                    <span>{lang === 'te' ? 'పింఛన్ల పూర్తి వివరాలు & అర్హత పరిశీలన' : 'View Schemes & Check Eligibility'}</span>
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => onNavigate('apply', 'pension_scheme')}
                    style={{ color: '#be123c', borderColor: '#fda4af', fontWeight: 700 }}
                  >
                    <FileText size={16} />
                    <span>{lang === 'te' ? 'నూతన పింఛను దరఖాస్తు (Apply Online)' : 'Apply for Pension Online'}</span>
                  </button>
                </div>
              </div>

              {/* Right side quick features list */}
              <div style={{ backgroundColor: '#fff1f2', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid #fecdd3' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#881337', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="#e11d48" />
                  <span>{lang === 'te' ? 'పింఛను ముఖ్య ముఖ్యాంశాలు & నిబంధనలు' : 'Key Highlights & 6-Filter Norms'}</span>
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-800)' }}>
                    <span style={{ color: '#e11d48', fontWeight: 800 }}>✓</span>
                    <span><strong>{lang === 'te' ? '1వ తేదీనే డోర్‌స్టెప్ డెలివరీ:' : 'Doorstep Disbursement on 1st:'}</strong> {lang === 'te' ? 'ఉదయం 6:00 నుంచే బయోమెట్రిక్ లేదా ఐరిస్ లేదా ముఖ గుర్తింపు ద్వారా నగదు అందజేత.' : 'Starting 6:00 AM via biometric/iris/facial recognition.'}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-800)' }}>
                    <span style={{ color: '#e11d48', fontWeight: 800 }}>✓</span>
                    <span><strong>{lang === 'te' ? 'భూమి పరిమితి:' : 'Land Ceiling:'}</strong> {lang === 'te' ? '3 ఎకరాల మాగాణి లేదా 10 ఎకరాల మెట్ట లోపు ఉండాలి (డయాలసిస్ రోగులకు మినహాయింపు).' : '< 3 acres wet land or < 10 acres dry land (Dialysis exempt).'}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-800)' }}>
                    <span style={{ color: '#e11d48', fontWeight: 800 }}>✓</span>
                    <span><strong>{lang === 'te' ? 'విద్యుత్ వినియోగం:' : 'Power Limit:'}</strong> {lang === 'te' ? 'నెలవారీ వినియోగం 300 యూనిట్లకు మించరాదు.' : '< 300 units/month household consumption.'}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-800)' }}>
                    <span style={{ color: '#e11d48', fontWeight: 800 }}>✓</span>
                    <span><strong>{lang === 'te' ? 'వాహన నిబంధన మినహాయింపు:' : 'Vehicle Exception:'}</strong> {lang === 'te' ? 'టాక్సీలు, ఆటోలు మరియు వ్యవసాయ ట్రాక్టర్లకు మినహాయింపు ఉంది.' : 'Taxis, autos, and tractors are permitted.'}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-800)' }}>
                    <span style={{ color: '#e11d48', fontWeight: 800 }}>✓</span>
                    <span><strong>{lang === 'te' ? '21 రోజుల గడువు (SLA):' : '21-Day Statutory SLA:'}</strong> {lang === 'te' ? 'సచివాలయ తనిఖీ మరియు గ్రామసభ ఆడిట్ అనంతరం మంజూరు ఉత్తర్వులు.' : 'Field verification, Gram Sabha social audit, and MPDO sanction.'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Action Cards */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('quick_actions_title')}</h2>
            <p className="section-subtitle">
              {lang === 'te'
                ? 'గ్రామ పారిశుధ్యం, తాగునీరు, విద్యుత్ సమస్యలపై తక్షణమే ఫిర్యాదు చేయండి'
                : 'Rapid citizen access for village infrastructure, utility complaints, and welfare verification'}
            </p>
          </div>

          <div className="grid-5">
            <div className="action-card" onClick={() => onNavigate('pension')} style={{ cursor: 'pointer', borderTop: '4px solid #e11d48' }}>
              <div className="action-icon icon-rose">
                <Heart size={26} />
              </div>
              <div className="action-title">{lang === 'te' ? 'ఎన్టీఆర్ భరోసా పింఛన్లు' : 'NTR Bharosa Pensions'}</div>
              <div className="action-desc">{lang === 'te' ? 'నెలకు ₹4,000 నుండి ₹15,000 వరకు వృద్ధాప్య, వితంతు, దివ్యాంగుల పింఛను సేవలు' : 'Monthly aid ₹4,000 - ₹15,000 for elderly, widows, and divyangjan.'}</div>
              <div style={{ color: '#be123c', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{lang === 'te' ? 'పింఛన్ల పూర్తి వివరాలు' : 'Check Pension Details'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div className="action-card" onClick={() => onNavigate('water')} style={{ cursor: 'pointer' }}>
              <div className="action-icon icon-blue">
                <Droplets size={26} />
              </div>
              <div className="action-title">{t('action_water_title')}</div>
              <div className="action-desc">{t('action_water_desc')}</div>
              <div style={{ color: 'var(--blue-700)', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{lang === 'te' ? 'తాగునీటి ఫిర్యాదు' : 'Report Water Fault'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div className="action-card" onClick={() => onNavigate('electricity')} style={{ cursor: 'pointer' }}>
              <div className="action-icon icon-amber">
                <Zap size={26} />
              </div>
              <div className="action-title">{t('action_elec_title')}</div>
              <div className="action-desc">{t('action_elec_desc')}</div>
              <div style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{lang === 'te' ? 'విద్యుత్ ఫిర్యాదు / 1912' : 'Report Power Issue'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div className="action-card" onClick={() => onNavigate('house-tax')} style={{ cursor: 'pointer' }}>
              <div className="action-icon icon-green">
                <Building size={26} />
              </div>
              <div className="action-title">{t('action_tax_title')}</div>
              <div className="action-desc">{t('action_tax_desc')}</div>
              <div style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{lang === 'te' ? 'ఇంటి పన్ను అసెస్మెంట్' : 'Check Tax Dues'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div className="action-card" onClick={() => onNavigate('services')} style={{ cursor: 'pointer' }}>
              <div className="action-icon icon-red">
                <FileText size={26} />
              </div>
              <div className="action-title">{t('action_welfare_title')}</div>
              <div className="action-desc">{t('action_welfare_desc')}</div>
              <div style={{ color: 'var(--danger-600)', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{lang === 'te' ? 'అర్హతలు & దరఖాస్తు' : 'Browse Schemes'}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Village Notices & Announcements */}
      <section className="section" style={{ backgroundColor: 'var(--slate-100)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('announcements_title')}</h2>
            <p className="section-subtitle">
              {lang === 'te'
                ? 'గ్రామసభ సమావేశాలు, వైద్య శిబిరాలు మరియు పథకాల గడువు సమాచారం'
                : 'Official village gram sabha notifications, health camps, and welfare verification deadlines'}
            </p>
          </div>

          <div className="grid-2">
            {announcements.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-submitted">
                      {item.category}
                    </span>
                    {item.is_pinned === 1 && (
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                        {t('pinned_badge')}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                    {lang === 'te' ? item.title_te : item.title_en}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {lang === 'te' ? item.content_te : item.content_en}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} />
                    <span>{item.publish_date}</span>
                  </div>
                  {item.event_date && (
                    <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      {item.event_date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Emergency & Essential Verified Numbers Section */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ borderLeft: '6px solid var(--danger-600)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <ShieldAlert size={24} style={{ color: 'var(--danger-600)' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {t('emergency_title')}
              </h2>
            </div>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {t('emergency_desc')}
            </p>

            <div className="grid-3">
              <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'పోలీస్ & భద్రత' : 'Police & Security'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.25rem 0' }}>
                  112 / 100
                </div>
                <a href="tel:112" className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }}>
                  <PhoneCall size={14} /> {t('call_now')} 112
                </a>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'వైద్య అత్యవసరం / అంబులెన్స్' : 'Medical Ambulance'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.25rem 0' }}>
                  108 / 104
                </div>
                <a href="tel:108" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                  <HeartPulse size={14} /> {t('call_now')} 108
                </a>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'విద్యుత్ ప్రమాదాలు / APEPDCL' : 'Power Outage Helpline'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.25rem 0' }}>
                  1912 (Toll Free)
                </div>
                <a href="tel:1912" className="btn btn-amber btn-sm" style={{ marginTop: '0.5rem' }}>
                  <Zap size={14} /> {t('call_now')} 1912
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
