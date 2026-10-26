import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  RotateCcw,
  Upload,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export default function ComplaintsPage() {
  const { lang, t } = useLanguage();
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState('track'); // 'submit' or 'track'
  const [localities, setLocalities] = useState([]);

  // Submit Form
  const [formData, setFormData] = useState({
    category: 'Water Supply',
    locality_id: '1',
    landmark: '',
    description: '',
    severity: 'Medium',
    citizen_name: '',
    citizen_phone: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Track Form
  const [trackRef, setTrackRef] = useState('PAD-2026-1021');
  const [trackPhone, setTrackPhone] = useState('9848011223');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Reopen State
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);
  const [reopenMsg, setReopenMsg] = useState('');

  useEffect(() => {
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => setLocalities(data.localities || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('locality_id', formData.locality_id);
      data.append('landmark', formData.landmark);
      data.append('description', formData.description);
      data.append('severity', formData.severity);
      data.append('citizen_name', formData.citizen_name);
      data.append('citizen_phone', formData.citizen_phone);
      if (photoFile) data.append('photo', photoFile);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit grievance.');
      setSubmitSuccess(result);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!trackRef.trim()) return;

    setTrackingLoading(true);
    setTrackError('');
    setTrackResult(null);
    setReopenMsg('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/complaints/track', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref_number: trackRef.trim(),
          citizen_phone: trackPhone.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify grievance.');
      setTrackResult(data);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!trackResult) return;
    setReopening(true);
    setReopenMsg('');
    try {
      const res = await fetch(`/api/complaints/${trackResult.complaint.id}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reopenReason,
          citizen_phone: trackPhone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reopen complaint.');
      setReopenMsg(data.message);
      setReopenReason('');
      handleTrack();
    } catch (err) {
      setReopenMsg(`Error: ${err.message}`);
    } finally {
      setReopening(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Submitted': return 'badge-submitted';
      case 'Assigned': return 'badge-assigned';
      case 'In Progress': return 'badge-in-progress';
      case 'Resolved': return 'badge-resolved';
      case 'Closed': return 'badge-closed';
      default: return 'badge-submitted';
    }
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <ShieldAlert size={16} />
            {lang === 'te' ? 'ప్రజా సమస్యల పరిష్కార విభాగం' : 'Public Grievance Redressal System'}
          </div>
          <h1 className="section-title">
            {lang === 'te' ? 'గ్రామ సమస్యల నమోదు & ట్రాకింగ్' : 'Village Grievances & Request Tracking'}
          </h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {lang === 'te'
              ? 'తాగునీరు, విద్యుత్, పారిశుధ్యం, రోడ్లు మరియు ఇతర సేవలపై ఫిర్యాదు చేసి పారదర్శకంగా పురోగతిని తెలుసుకోండి'
              : 'Submit village complaints and securely track field inspections, technician assignment, and proof of resolution.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={15} style={{ display: 'inline', marginRight: 5 }} />
            {t('track_title')}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <ShieldAlert size={15} style={{ display: 'inline', marginRight: 5 }} />
            {t('complaint_form_title')}
          </button>
        </div>

        {/* 1. Track Complaint View */}
        {activeTab === 'track' && (
          <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
            {/* Left: Two-Factor Verification Tracking Form */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem', borderTop: '4px solid var(--primary-600)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {t('track_title')}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                  {t('track_desc')}
                </p>

                <form onSubmit={handleTrack}>
                  <div className="form-group">
                    <label className="form-label">{t('input_ref')} <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. PAD-2026-1021"
                      value={trackRef}
                      onChange={(e) => setTrackRef(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('input_phone')} <span className="required">*</span></label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="10 digit mobile used when submitting"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      required
                    />
                    <div className="form-helper">
                      Two-factor verification protects citizen privacy from unauthorized enumeration.
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={trackingLoading}>
                    <Search size={16} />
                    <span>{trackingLoading ? 'Verifying...' : t('btn_track')}</span>
                  </button>
                </form>

                <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Sample complaints for testing:{' '}
                  <button type="button" style={{ color: 'var(--blue-700)', textDecoration: 'underline' }} onClick={() => { setTrackRef('PAD-2026-1021'); setTrackPhone('9848011223'); }}>
                    PAD-2026-1021 (Water)
                  </button>
                  ,{' '}
                  <button type="button" style={{ color: 'var(--blue-700)', textDecoration: 'underline' }} onClick={() => { setTrackRef('PAD-2026-1022'); setTrackPhone('9440555666'); }}>
                    PAD-2026-1022 (Resolved)
                  </button>
                </div>

                {trackError && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    {trackError}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Detailed Tracking Timeline & Evidence */}
            <div>
              {trackResult ? (
                <div className="card animate-fade-in" style={{ border: '2px solid var(--primary-600)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Reference ID:</span>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                        {trackResult.complaint.ref_number}
                      </h3>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(trackResult.complaint.status)}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                      {trackResult.complaint.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                    <div><strong>Category:</strong> {trackResult.complaint.category}</div>
                    <div><strong>Locality:</strong> {trackResult.complaint.locality_name_en} (Ward {trackResult.complaint.ward_number})</div>
                    <div><strong>Landmark:</strong> {trackResult.complaint.landmark}</div>
                    <div><strong>Description:</strong> {trackResult.complaint.description}</div>
                    <div><strong>Submitted by:</strong> {trackResult.complaint.citizen_name} ({trackResult.complaint.citizen_phone})</div>
                    <div><strong>Assigned Official:</strong> {trackResult.complaint.assigned_staff_name || 'Grama Sachivalayam Desk'}</div>
                  </div>

                  {/* Resolution Proof & Notes */}
                  {trackResult.complaint.status === 'Resolved' && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', marginBottom: '1.5rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} />
                        <span>Resolution Details:</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: '0.75rem' }}>
                        {trackResult.complaint.resolution_notes || 'Issue has been inspected and resolved on site.'}
                      </p>
                      {trackResult.complaint.resolution_photo && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Resolution Photo Evidence:</div>
                          <img
                            src={trackResult.complaint.resolution_photo}
                            alt="Resolution Evidence"
                            style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline Stepper */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                    {t('timeline_title')}:
                  </h4>
                  <div className="timeline">
                    {trackResult.updates.map((upd) => (
                      <div key={upd.id} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-header">
                          <span className="timeline-status">{upd.status}</span>
                          <span className="timeline-time">{upd.created_at}</span>
                        </div>
                        <div className="timeline-body">{upd.notes}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                          Updated by: {upd.updated_by_name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reopen Option */}
                  {['Resolved', 'Closed'].includes(trackResult.complaint.status) && (
                    <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                        {lang === 'te' ? 'సమస్య ఇంకా పరిష్కారం కాలేదా?' : 'Unsatisfied with the Resolution?'}
                      </h5>
                      {reopenMsg && (
                        <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                          {reopenMsg}
                        </div>
                      )}
                      <form onSubmit={handleReopen} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="State reason why issue is not resolved..."
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          required
                        />
                        <button type="submit" className="btn btn-secondary btn-sm" disabled={reopening}>
                          <RotateCcw size={14} />
                          <span>{reopening ? 'Reopening...' : t('btn_reopen')}</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--slate-50)' }}>
                  <Clock size={36} style={{ color: 'var(--slate-400)', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                    Track Your Grievance Online
                  </h3>
                  <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                    Enter your Reference Number on the left to view stage-by-stage inspection notes, field staff actions, and photo evidence.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Submit Complaint View */}
        {activeTab === 'submit' && (
          <div className="card" style={{ maxWidth: '720px', margin: '0 auto', borderTop: '4px solid var(--primary-600)' }}>
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={56} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {lang === 'te' ? 'ఫిర్యాదు విజయవంతంగా నమోదైనది!' : 'Grievance Submitted Successfully!'}
                </h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  A confirmation SMS has been queued for your mobile number. The assigned Sachivalayam department will inspect the site.
                </p>

                <div style={{ padding: '1.25rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-100)', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-800)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Tracking Reference Number
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0.25rem 0' }}>
                    {submitSuccess.ref_number}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary btn-block" onClick={() => setSubmitSuccess(null)}>
                    Submit Another Grievance
                  </button>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      setTrackRef(submitSuccess.ref_number);
                      setTrackPhone(submitSuccess.phone);
                      setActiveTab('track');
                      setSubmitSuccess(null);
                      handleTrack();
                    }}
                  >
                    Track Progress Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {t('complaint_form_title')}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                  {t('complaint_form_desc')}
                </p>

                {submitError && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {submitError}
                  </div>
                )}

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('field_category')} <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Water Supply">Drinking Water Supply (తాగునీటి సరఫరా)</option>
                      <option value="Electricity">Electricity & Power Outage (విద్యుత్ సరఫరా)</option>
                      <option value="Streetlights">Streetlight Not Glowing (వీధి దీపాల నిర్వహణ)</option>
                      <option value="Sanitation & Waste">Sanitation & Garbage Dumping (పారిశుధ్యం)</option>
                      <option value="Drainage">Open Drainage Clogging (మురుగు కాలువలు)</option>
                      <option value="Roads & Potholes">Roads & Potholes (రహదారుల మరమ్మతులు)</option>
                      <option value="Public Toilets">Public Toilets Maintenance (శౌచాలయాలు)</option>
                      <option value="Pension & Welfare">Pension & Welfare Grievance (సంక్షేమ పథకాలు)</option>
                      <option value="Other Village Issue">Other Village Infrastructure (ఇతర సమస్య)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('field_locality')} <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.locality_id}
                      onChange={(e) => setFormData({ ...formData, locality_id: e.target.value })}
                    >
                      {localities.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          Ward {loc.ward_number}: {lang === 'te' ? loc.name_te : loc.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('field_landmark')} <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g. Near Modakondamma Kalyana Mandapam"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('field_severity')}</label>
                    <select
                      className="form-select"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="Emergency">Emergency (Immediate Risk)</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('field_description')} <span className="required">*</span></label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide specific details about the issue to aid the inspection team..."
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('field_name')} <span className="required">*</span></label>
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
                    <label className="form-label">{t('field_phone')} <span className="required">*</span></label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.citizen_phone}
                      onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
                      placeholder="10 digit mobile"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('field_photo')}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                  />
                  <div className="form-helper">
                    Max size: 5 MB. Optional photo helps field staff diagnose issues before site visit.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                  style={{ marginTop: '1rem' }}
                >
                  <ShieldAlert size={16} />
                  <span>{submitting ? t('submitting') : t('btn_submit')}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
