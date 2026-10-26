import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  AlertTriangle,
  ShieldAlert,
  PhoneCall,
  Calendar,
  Lock,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function MaternalSupportPage({ onOpenLogin }) {
  const { lang, t } = useLanguage();
  const { user, token, hasRole } = useAuth();
  const isHealthStaff = hasRole(['Department Officer', 'Administrator', 'Service Staff']);

  const [records, setRecords] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newCheckup, setNewCheckup] = useState({
    locality_id: '1',
    trimester: 2,
    high_risk_flag: false,
    anm_worker_name: 'K. Vijayakumari (ANM-1)',
    last_anc_checkup: new Date().toISOString().split('T')[0],
    next_anc_scheduled: '',
    nutrition_kit_issued: true,
    consent_obtained: true,
    notes: 'Routine ANC visit completed. Vital signs stable.'
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => setLocalities(data.localities || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isHealthStaff && token) {
      fetchRecords();
    }
  }, [isHealthStaff, token]);

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch('/api/staff/maternal', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to load maternal records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleAddCheckup = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/staff/maternal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCheckup)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record checkup.');
      setMsg(`Success: ${data.rch_id_masked} follow-up scheduled.`);
      fetchRecords();
      setTimeout(() => {
        setIsAdding(false);
        setMsg('');
      }, 1500);
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-600)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <HeartPulse size={16} />
            {lang === 'te' ? 'మాతృ & శిశు సంక్షేమ సేవలు' : 'Maternal & Child Health Services'}
          </div>
          <h1 className="section-title">{t('maternal_title')}</h1>
        </div>

        {/* CRITICAL MEDICAL DISCLAIMER BANNER */}
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}
        >
          <ShieldAlert size={26} style={{ color: 'var(--danger-600)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.35rem' }}>
              {lang === 'te' ? 'అత్యవసర వైద్య గమనిక – తక్షణ స్పందన' : 'Critical Medical & Emergency Care Notice'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#7f1d1d', lineHeight: '1.6', marginBottom: '0.85rem' }}>
              {t('maternal_warning')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="tel:108" className="btn btn-danger btn-sm">
                <PhoneCall size={14} />
                <span>Call 108 (24x7 Ambulance)</span>
              </a>
              <a href="tel:08935250022" className="btn btn-secondary btn-sm">
                <span>Area Hospital Paderu: 08935-250022</span>
              </a>
              <a href="tel:102" className="btn btn-secondary btn-sm">
                <span>Thalli Bidda Express: 102</span>
              </a>
            </div>
          </div>
        </div>

        {/* Public ANC Care Calendar & Schemes */}
        <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                {lang === 'te' ? 'గర్భిణీ స్త్రీల సంరక్షణ క్యాలెండర్ (ANC Schedule)' : 'Antenatal Care (ANC) Checkup Schedule'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <strong>1st Trimester (1st - 12th Week):</strong>
                  <div>Registration at Village Health Clinic, Mother-Child Protection (MCP) card issue, RCH ID generation, ultrasound scan, Folic acid tablets.</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <strong>2nd Trimester (14th - 26th Week):</strong>
                  <div>2nd & 3rd ANC checkup, Tetanus (Td) immunization, Iron-Folic Acid (IFA) tablets, Calcium supplementation, Balamrutham nutrition kit.</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <strong>3rd Trimester (28th - 40th Week):</strong>
                  <div>4th ANC checkup, hemoglobin monitoring, blood pressure check, institutional delivery birth planning, 102/108 ambulance booking.</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ backgroundColor: 'var(--slate-50)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                {lang === 'te' ? 'ఆర్థిక సహాయ పథకాలు' : 'Government Financial Support Schemes'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: '1.6' }}>
                <div>
                  <strong>PM Matru Vandana Yojana (PMMVY):</strong> Direct benefit transfer of ₹5,000 in two installments directly into the mother's Aadhaar-linked bank account upon institutional delivery.
                </div>
                <div>
                  <strong>YSR Sampoorna Poshana:</strong> Monthly nutrition kit containing 3 kg Balamrutham powder, 25 eggs, 5 liters pasteurized milk, 1 kg chana, and 500g jaggery.
                </div>
                <div>
                  <strong>Dr. YSR Aarogya Asara:</strong> Post-delivery wage loss assistance of ₹5,000 for normal delivery and ₹5,000 for caesarean delivery.
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'పాడేరు ఆరోగ్య సచివాలయ సంప్రదింపులు' : 'Paderu Health Officials'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
                Village Health Clinic ANM and ASHA workers conduct weekly home visits across all 8 wards.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-800)' }}>
                Village Health Clinic: <strong>08935-250108</strong> (10:00 AM - 05:00 PM)
              </div>
            </div>
          </div>
        </div>

        {/* RESTRICTED MODULE: Authorized Health Workers Follow-Up Register */}
        <div className="card" style={{ border: '2px solid var(--slate-300)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Lock size={22} style={{ color: isHealthStaff ? 'var(--primary-700)' : 'var(--slate-400)' }} />
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {lang === 'te' ? 'ఆరోగ్య కార్యకర్తల అనుసరణ రిజిస్టర్ (అధికారిక లాగిన్)' : 'Restricted Health Worker Maternal Follow-Up Registry'}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Accessible only by ANM, Health Secretary, Medical Officer, and Administrator
                </div>
              </div>
            </div>

            {isHealthStaff ? (
              <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
                <PlusCircle size={14} />
                <span>Log Checkup Follow-Up</span>
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onOpenLogin}>
                <Lock size={14} />
                <span>Staff Sign In</span>
              </button>
            )}
          </div>

          {!isHealthStaff ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
              <Lock size={36} style={{ color: 'var(--slate-400)', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                Maternal Health Records are Strictly Confidential
              </h3>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '520px', margin: '0.5rem auto' }}>
                To safeguard maternal privacy, individual pregnancy records, high-risk flags, and diagnostic checkups are accessible strictly with citizen consent to authorized public health officials.
              </p>
            </div>
          ) : (
            <div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Masked RCH ID</th>
                      <th>Locality</th>
                      <th>Trimester</th>
                      <th>Risk Status</th>
                      <th>Assigned ANM</th>
                      <th>Last Checkup</th>
                      <th>Next Scheduled</th>
                      <th>Consent</th>
                      <th>Clinical Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(rec => (
                      <tr key={rec.id}>
                        <td><code>{rec.rch_id_masked}</code></td>
                        <td>{rec.locality_name_en}</td>
                        <td>Trimester {rec.trimester}</td>
                        <td>
                          {rec.high_risk_flag === 1 ? (
                            <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>High Risk</span>
                          ) : (
                            <span className="badge badge-resolved">Normal</span>
                          )}
                        </td>
                        <td>{rec.anm_worker_name}</td>
                        <td>{rec.last_anc_checkup}</td>
                        <td><strong>{rec.next_anc_scheduled}</strong></td>
                        <td>{rec.consent_obtained ? '✓ Confirmed' : 'Pending'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>{rec.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Follow-Up Modal */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '540px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Log Consent-Based Maternal Checkup
            </h3>

            {msg && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleAddCheckup}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Locality / Ward</label>
                  <select
                    className="form-select"
                    value={newCheckup.locality_id}
                    onChange={(e) => setNewCheckup({ ...newCheckup, locality_id: e.target.value })}
                  >
                    {localities.map(loc => (
                      <option key={loc.id} value={loc.id}>Ward {loc.ward_number}: {loc.name_en}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trimester Stage</label>
                  <select
                    className="form-select"
                    value={newCheckup.trimester}
                    onChange={(e) => setNewCheckup({ ...newCheckup, trimester: e.target.value })}
                  >
                    <option value={1}>1st Trimester (1-12 wks)</option>
                    <option value={2}>2nd Trimester (13-28 wks)</option>
                    <option value={3}>3rd Trimester (29-40 wks)</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Last Checkup Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newCheckup.last_anc_checkup}
                    onChange={(e) => setNewCheckup({ ...newCheckup, last_anc_checkup: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Next Scheduled Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newCheckup.next_anc_scheduled}
                    onChange={(e) => setNewCheckup({ ...newCheckup, next_anc_scheduled: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Clinical / Inspection Notes</label>
                <textarea
                  className="form-textarea"
                  value={newCheckup.notes}
                  onChange={(e) => setNewCheckup({ ...newCheckup, notes: e.target.value })}
                  placeholder="Record BP, Hb count, fetal heart sound, ultrasound status..."
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-800)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newCheckup.consent_obtained}
                    onChange={(e) => setNewCheckup({ ...newCheckup, consent_obtained: e.target.checked })}
                    required
                  />
                  <span>
                    <strong>Informed Citizen Consent Confirmed:</strong> Beneficiary consented to confidential health worker follow-up.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => setIsAdding(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block">
                  Record Follow-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
