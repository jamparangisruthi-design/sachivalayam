import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  CheckCircle2,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function HousingPage() {
  const { lang, t } = useLanguage();
  const [searchId, setSearchId] = useState('PMAY-PAD-042');
  const [beneficiary, setBeneficiary] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    // Sample housing stage data
    setBeneficiary({
      beneficiary_id: searchId.toUpperCase(),
      name: 'M. P******* Dora',
      locality: 'Vanjangi Ghat Road (Ward 6)',
      scheme: 'PMAY-Gramin (Tribal Special Housing)',
      sanctioned_amount: '₹2,50,000 (DBT + MGNREGS 90 person-days)',
      site_patta: 'RoFR Tribal Forest Rights Title No. 412/2022',
      current_stage: 3,
      stages: [
        { stage: 1, name: 'Site Geo-tagging & Registration', status: 'Completed', date: '2026-03-10' },
        { stage: 2, name: 'Basement Level (Plinth)', status: 'Completed (₹60,000 Disbursed)', date: '2026-05-18' },
        { stage: 3, name: 'Lintel Level', status: 'In Progress (Inspected by Engg. Assistant)', date: '2026-09-22' },
        { stage: 4, name: 'Roof Casting Level', status: 'Pending Completion of Lintel', date: 'Estimated Nov 2026' },
        { stage: 5, name: 'Finishing, Paint & Total Subsidy Settlement', status: 'Pending', date: '-' }
      ]
    });
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Home size={16} />
            {lang === 'te' ? 'గ్రామీణ గృహ నిర్మాణ సంస్థ' : 'AP State Housing Corporation'}
          </div>
          <h1 className="section-title">
            {lang === 'te' ? 'పాడేరు పక్కా గృహ నిర్మాణ పథకాలు' : 'Paderu Housing Schemes & Subsidy Tracker'}
          </h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {lang === 'te'
              ? 'ప్రధాన మంత్రి ఆవాస్ యోజన - గ్రామీణ్ (PMAY-G) మరియు గిరిజన గృహ నిర్మాణ సహాయక పథకాలు'
              : 'Verified rural housing programs, document checklists, and stage-by-stage construction subsidy tracking.'}
          </p>
        </div>

        <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left Column: Beneficiary Stage Tracker */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', borderTop: '4px solid var(--primary-600)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'లబ్ధిదారుల గృహ నిర్మాణ దశల పరిశీలన' : 'Track Construction Stage & Subsidy'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                {lang === 'te'
                  ? 'మీ గృహ నిర్మాణ మంజూరు నంబర్ నమోదు చేసి దశలవారీ పురోగతి మరియు నగదు జమ వివరాలు చూడండి'
                  : 'Enter your housing sanction code (e.g. PMAY-PAD-042) to track geo-tagging and subsidy release'}
              </p>

              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PMAY-PAD-042"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Search size={16} />
                  <span>Track</span>
                </button>
              </form>
            </div>

            {beneficiary && (
              <div className="card animate-fade-in" style={{ border: '2px solid var(--primary-600)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Sanction Code:</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>{beneficiary.beneficiary_id}</h3>
                  </div>
                  <span className="badge badge-in-progress">Stage 3 / 5 In Progress</span>
                </div>

                <div style={{ fontSize: '0.875rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  <div><strong>Beneficiary:</strong> {beneficiary.name}</div>
                  <div><strong>Scheme:</strong> {beneficiary.scheme}</div>
                  <div><strong>Locality:</strong> {beneficiary.locality}</div>
                  <div><strong>Land Title:</strong> {beneficiary.site_patta}</div>
                  <div><strong>Total Sanctioned Value:</strong> <span style={{ color: 'var(--primary-700)', fontWeight: 800 }}>{beneficiary.sanctioned_amount}</span></div>
                </div>

                {/* Construction Stepper */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                  Construction Progress Stepper:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {beneficiary.stages.map((stg) => {
                    const isPassed = stg.stage < beneficiary.current_stage;
                    const isCurrent = stg.stage === beneficiary.current_stage;

                    return (
                      <div
                        key={stg.stage}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isCurrent ? 'var(--primary-50)' : isPassed ? 'var(--slate-50)' : '#ffffff',
                          border: isCurrent ? '1px solid var(--primary-300)' : '1px solid var(--slate-200)'
                        }}
                      >
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: isPassed ? 'var(--primary-600)' : isCurrent ? 'var(--accent-amber)' : 'var(--slate-300)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            flexShrink: 0
                          }}
                        >
                          {isPassed ? '✓' : stg.stage}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: isCurrent ? 800 : 600, color: 'var(--slate-900)' }}>
                            {stg.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: isCurrent ? 'var(--primary-800)' : 'var(--slate-500)' }}>
                            {stg.status} • {stg.date}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Housing Guidelines & Document Checklist */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                {lang === 'te' ? 'కావలసిన ధృవీకరణ పత్రాలు (Checklist)' : 'Required Documents Checklist'}
              </h2>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.8' }}>
                <li>D-Form Patta, Possession Certificate, or RoFR Tribal Land Title</li>
                <li>Aadhaar Cards of Husband and Wife (seeded with Bank Account)</li>
                <li>Active Bank Passbook with IFSC code for Direct Benefit Transfer (DBT)</li>
                <li>MGNREGS Job Card for wage component (90 days of unskilled labor)</li>
                <li>White Smart Rice Card proving Below Poverty Line (BPL) status</li>
                <li>Geo-tagged site photograph verified by Village Engineering Assistant</li>
              </ul>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--slate-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                <ExternalLink size={16} style={{ color: 'var(--primary-700)' }} />
                <span>Verified National Portal</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
                Access official circulars, beneficiary lists, and geo-tagged images on the Ministry of Rural Development portal.
              </p>
              <a
                href="https://pmayg.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-block"
              >
                <span>Visit PMAY-Gramin Official Portal</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
