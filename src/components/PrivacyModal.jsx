import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    citizen_name: '',
    contact_phone: '',
    request_type: 'Information Correction',
    entity_type: 'Household Demographics',
    record_reference: '',
    justification: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/privacy/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      citizen_name: '',
      contact_phone: '',
      request_type: 'Information Correction',
      entity_type: 'Household Demographics',
      record_reference: '',
      justification: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '580px' }}>
        <button className="modal-close-btn" onClick={handleReset} aria-label="Close dialog">
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--blue-100)',
              color: 'var(--blue-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h2 id="privacy-modal-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {lang === 'te' ? 'పౌరుల సమాచార గోప్యత & సవరణ దరఖాస్తు' : 'Citizen Data Privacy & Correction Request'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            {lang === 'te'
              ? 'మీ వ్యక్తిగత రికార్డులలో మార్పులు, తొలగింపు లేదా అనుమతి ఉపసంహరణ కొరకు దరఖాస్తు చేసుకోండి'
              : 'Submit a request to correct errors, request record removal, or revoke consent under AP Data Governance'}
          </p>
        </div>

        {result ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              {lang === 'te' ? 'గోప్యతా దరఖాస్తు నమోదైనది!' : 'Privacy Request Recorded Successfully!'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              {result.message}
            </p>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Request Tracking ID:</span>{' '}
              <strong style={{ fontSize: '1.1rem', color: 'var(--blue-800)' }}>{result.req_number}</strong>
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleReset}>
                {lang === 'te' ? 'పూర్తయింది' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  {lang === 'te' ? 'మీ పూర్తి పేరు' : 'Full Name'} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.citizen_name}
                  onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                  placeholder="e.g. K. Somanna"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {lang === 'te' ? 'సంప్రదింపు మొబైల్' : 'Mobile Phone'} <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="10 digit number"
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  {lang === 'te' ? 'దరఖాస్తు రకం' : 'Request Type'}
                </label>
                <select
                  className="form-select"
                  value={formData.request_type}
                  onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                >
                  <option value="Information Correction">Information Correction (సవరణ)</option>
                  <option value="Data Deletion / Removal">Data Deletion / Removal (తొలగింపు)</option>
                  <option value="Consent Revocation">Consent Revocation (అనుమతి రద్దు)</option>
                  <option value="Record Access">Record Access Inquiry (రికార్డు పరిశీలన)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {lang === 'te' ? 'రికార్డు కేటగిరీ' : 'Record Category'}
                </label>
                <select
                  className="form-select"
                  value={formData.entity_type}
                  onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })}
                >
                  <option value="Household Demographics">Household Demographics</option>
                  <option value="Grievance Record">Grievance / Complaint Record</option>
                  <option value="House Tax Assessment">House Tax Record</option>
                  <option value="Other Village Register">Other Village Register</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {lang === 'te' ? 'సంబంధిత రికార్డు సంఖ్య (ఐచ్ఛికం)' : 'Record Reference ID (Optional)'}
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.record_reference}
                onChange={(e) => setFormData({ ...formData, record_reference: e.target.value })}
                placeholder="e.g. Household Code, Assessment No., or Complaint No."
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {lang === 'te' ? 'సవరణ లేదా తొలగింపుకు కారణం' : 'Detailed Justification / Correction Needed'} <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Explain what needs to be corrected, deleted, or updated..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleReset}>
                {lang === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
              </button>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Submitting...' : (lang === 'te' ? 'దరఖాస్తు సమర్పించండి' : 'Submit Privacy Request')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
