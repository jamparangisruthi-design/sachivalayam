import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CreditCard,
  UserPlus,
  UserMinus,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function RationCardsPage({ onNavigate }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('guide');
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    // Sample tracking response for Rice Card request
    setTrackResult({
      app_number: trackInput.toUpperCase(),
      request_type: 'Newborn Child Member Addition',
      head_name: 'K. S****** Dora',
      masked_card: 'WAP03******19',
      locality: 'Modakondamma Temple Ward (Ward 1)',
      submission_date: '2026-10-04',
      status: 'Under VRO Verification',
      current_stage: 'Field Inspection Completed by Digital Assistant. Awaiting Revenue Inspector sign-off.',
      estimated_completion: 'Within 5 Working Days',
      fps_shop_no: 'FPS-034 (Paderu Main Market)'
    });
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <CreditCard size={16} />
            {lang === 'te' ? 'పౌర సరఫరాల శాఖ (సివిల్ సప్లైస్)' : 'Department of Civil Supplies'}
          </div>
          <h1 className="section-title">
            {lang === 'te' ? 'పాడేరు స్మార్ట్ రైస్ కార్డు సేవలు' : 'Smart Rice Card Services & Member Management'}
          </h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {lang === 'te'
              ? 'నూతన రైస్ కార్డ్ దరఖాస్తులు, కుటుంబ సభ్యుల చేర్పు, తొలగింపు మరియు ప్రజా పంపిణీ సరుకుల సమాచారం'
              : 'End-to-end guidance for new smart rice cards, member additions, split cards, and e-KYC authentication.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            {lang === 'te' ? 'సేవల మార్గదర్శి & అర్హతలు' : 'Schemes & Eligibility Guide'}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            {lang === 'te' ? 'దరఖాస్తు స్థితి పరిశీలన' : 'Track Application Status'}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'grievance' ? 'active' : ''}`}
            onClick={() => setActiveTab('grievance')}
          >
            {lang === 'te' ? 'రేషన్ డీలర్ సమస్యలపై ఫిర్యాదు' : 'PDS Grievances & FPS Issues'}
          </button>
        </div>

        {activeTab === 'guide' && (
          <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
            {/* Guide Card */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                  {lang === 'te' ? 'స్మార్ట్ రైస్ కార్డ్ అర్హత నిబంధనలు' : 'Rice Card Eligibility Criteria'}
                </h2>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.8' }}>
                  <li>
                    <strong>Income Limit:</strong> Monthly household income must be below ₹10,000 for rural areas.
                  </li>
                  <li>
                    <strong>Land Holding:</strong> Less than 3 acres of wetland or less than 10 acres of dryland (including RoFR tribal patta).
                  </li>
                  <li>
                    <strong>Vehicles:</strong> No family member should own a four-wheeler (except registered commercial auto/taxi).
                  </li>
                  <li>
                    <strong>Electricity Consumption:</strong> Monthly power consumption below 300 units for domestic dwelling.
                  </li>
                  <li>
                    <strong>Government Employment:</strong> No family member should be a permanent government employee or pensioner.
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {lang === 'te' ? 'కుటుంబ సభ్యుల చేర్పు విధానం (Member Addition)' : 'How to Add a New Family Member'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: '1.6' }}>
                  For newborn babies or newly married daughters-in-law, visit Paderu Sachivalayam Digital Assistant with:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                  <div>• Child's Official Birth Certificate from Panchayat</div>
                  <div>• Aadhaar Enrollment Slip or Aadhaar Card of child</div>
                  <div>• Mother and Father's active Rice Card and biometric e-KYC</div>
                  <div>• Turnaround Time: 15 Working Days for card updation</div>
                </div>
              </div>
            </div>

            {/* Official Link Card */}
            <div>
              <div className="card" style={{ backgroundColor: 'var(--slate-50)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--primary-700)' }} />
                  <span>{lang === 'te' ? 'అధికారిక ఈ-పీడీఎస్ పోర్టల్' : 'Official AP e-PDS Portal'}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  Official verification, e-KYC authentication status, and FPS monthly stock balance can be checked on the Andhra Pradesh Civil Supplies state server.
                </p>
                <a
                  href="https://epdsap.ap.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-block"
                >
                  <span>Visit AP e-PDS Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {lang === 'te' ? 'పాడేరు రేషన్ పంపిణీ వివరాలు' : 'Monthly Distribution Dates'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
                  Subsidized Fortified Rice, Ragi, Sugar, and Red Gram Dahl are distributed through Fair Price Shops between the 1st and 15th of every month. Mobile Delivery Units (MDVs) visit designated tribal hamlets on scheduled dates.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              {lang === 'te' ? 'రైస్ కార్డ్ దరఖాస్తు స్థితి పరిశీలన' : 'Track Submitted Rice Card Request'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              {lang === 'te'
                ? 'సచివాలయంలో దరఖాస్తు చేసిన రసీదు సంఖ్యను నమోదు చేయండి'
                : 'Enter your Sachivalayam application number (e.g. AP-RC-2026-8812)'}
            </p>

            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AP-RC-2026-8812 or WAP031122"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                <Search size={16} />
                <span>Track</span>
              </button>
            </form>

            {trackResult && (
              <div className="animate-fade-in" style={{ padding: '1.25rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--primary-200)', paddingBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Application No:</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)' }}>{trackResult.app_number}</div>
                  </div>
                  <span className="badge badge-assigned">{trackResult.status}</span>
                </div>

                <div style={{ fontSize: '0.875rem', lineHeight: '1.8' }}>
                  <div><strong>Service:</strong> {trackResult.request_type}</div>
                  <div><strong>Head of Family:</strong> {trackResult.head_name}</div>
                  <div><strong>Masked Rice Card:</strong> <code>{trackResult.masked_card}</code></div>
                  <div><strong>Assigned FPS Shop:</strong> {trackResult.fps_shop_no}</div>
                  <div><strong>Current Stage:</strong> {trackResult.current_stage}</div>
                  <div><strong>Estimated Completion:</strong> {trackResult.estimated_completion}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'grievance' && (
          <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              {lang === 'te' ? 'రేషన్ పంపిణీ సమస్యలపై ఫిర్యాదు' : 'PDS Public Grievance Submission'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Report issues regarding non-distribution of rations, ePoS biometric fingerprint failure, or dealer overcharging.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => onNavigate('complaints')}
            >
              <span>{lang === 'te' ? 'ఫిర్యాదుల విభాగానికి వెళ్ళండి' : 'Open Complaints & Grievance Portal'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
