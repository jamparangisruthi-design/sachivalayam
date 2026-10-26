import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Building,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Printer,
  FileText,
  DollarSign,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';

export default function HouseTaxPage() {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('PAD-TAX-1001');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Correction Form State
  const [correctionForm, setCorrectionForm] = useState({
    name: '',
    phone: '',
    assessment_no: '',
    correction_type: 'Area Correction',
    details: ''
  });
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setAssessment(null);
    try {
      const res = await fetch('/api/house-tax/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to find assessment.');
      }
      setAssessment(data.assessment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!assessment) return;
    setSimulating(true);
    try {
      const res = await fetch('/api/house-tax/simulate-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_number: assessment.assessment_number })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment simulation failed.');
      }
      setReceipt(data.receipt);
      // Refresh current assessment state
      handleSearch();
    } catch (err) {
      alert(err.message);
    } finally {
      setSimulating(false);
    }
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    setCorrectionSuccess(true);
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Building size={16} />
            {lang === 'te' ? 'గ్రామ పంచాయతీ ఆస్తి పన్నుల విభాగం' : 'Panchayat Property Tax Wing'}
          </div>
          <h1 className="section-title">{t('tax_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('tax_desc')}
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gap: '2rem' }}>
          {/* Left Column: Assessment Search & Demand Card */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', borderTop: '4px solid var(--primary-600)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {t('tax_lookup_title')}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                {lang === 'te'
                  ? 'మీ అసెస్మెంట్ నంబర్ లేదా డోర్ నంబర్ నమోదు చేసి పన్ను బకాయిలు తనిఖీ చేయండి'
                  : 'Enter your assessment number (e.g. PAD-TAX-1001) or Door No. (e.g. 1-24/A)'}
              </p>

              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('tax_lookup_input')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Search size={16} />
                  <span>{lang === 'te' ? 'వెతకండి' : 'Search'}</span>
                </button>
              </form>

              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                {lang === 'te' ? 'నమూనా నంబర్లు:' : 'Sample assessment numbers:'}{' '}
                <button
                  type="button"
                  style={{ color: 'var(--blue-700)', textDecoration: 'underline' }}
                  onClick={() => setSearchQuery('PAD-TAX-1001')}
                >
                  PAD-TAX-1001
                </button>
                ,{' '}
                <button
                  type="button"
                  style={{ color: 'var(--blue-700)', textDecoration: 'underline' }}
                  onClick={() => setSearchQuery('PAD-TAX-1002')}
                >
                  PAD-TAX-1002
                </button>
                ,{' '}
                <button
                  type="button"
                  style={{ color: 'var(--blue-700)', textDecoration: 'underline' }}
                  onClick={() => setSearchQuery('PAD-TAX-1004')}
                >
                  PAD-TAX-1004
                </button>
              </div>

              {error && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}
            </div>

            {/* Assessment Result Card */}
            {assessment && (
              <div className="card animate-fade-in" style={{ border: '2px solid var(--primary-600)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Assessment No:</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                      {assessment.assessment_number}
                    </h3>
                  </div>
                  <div>
                    <span className={`badge ${assessment.payment_status === 'Paid' ? 'badge-resolved' : 'badge-assigned'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                      {assessment.payment_status === 'Paid' ? t('tax_status_paid') : t('tax_status_unpaid')}
                    </span>
                  </div>
                </div>

                <table style={{ width: '100%', fontSize: '0.9rem', lineHeight: '2', marginBottom: '1.25rem' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>Door Number:</td>
                      <td><strong>{assessment.door_number}</strong></td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>Owner Name (Privacy Masked):</td>
                      <td><strong>{assessment.owner_name}</strong></td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>Locality / Ward:</td>
                      <td>{lang === 'te' ? assessment.locality_name_te : assessment.locality_name_en} (Ward {assessment.ward_number})</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>Property Classification:</td>
                      <td>{assessment.property_type}</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>Plinth Area:</td>
                      <td>{assessment.plinth_area_sqft} sq. ft.</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>{t('tax_annual')}:</td>
                      <td>₹{assessment.annual_tax}</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>{t('tax_arrears')}:</td>
                      <td>₹{assessment.arrears}</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--slate-600)' }}>{t('tax_library')}:</td>
                      <td>₹{assessment.library_cess}</td>
                    </tr>
                    <tr style={{ borderTop: '2px solid var(--slate-300)', fontSize: '1.1rem' }}>
                      <td style={{ fontWeight: 800, color: 'var(--slate-900)', paddingTop: '0.5rem' }}>
                        {t('tax_total')}:
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary-700)', paddingTop: '0.5rem' }}>
                        ₹{assessment.total_due}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Payment Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {assessment.payment_status !== 'Paid' ? (
                    <>
                      <a
                        href="https://cdma.ap.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-block"
                      >
                        <ExternalLink size={16} />
                        <span>{t('btn_pay_official')}</span>
                      </a>

                      <button
                        type="button"
                        className="btn btn-primary btn-block"
                        onClick={handleSimulatePayment}
                        disabled={simulating}
                      >
                        <DollarSign size={16} />
                        <span>{simulating ? 'Simulating...' : t('btn_simulate_pay')}</span>
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
                      <CheckCircle2 size={24} style={{ color: 'var(--primary-700)', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>
                        {lang === 'te' ? 'ఈ ఆర్థిక సంవత్సరానికి పన్ను చెల్లింపు పూర్తయింది!' : 'Property Tax is Fully Paid for Current Financial Year!'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                        Last Payment Date: {assessment.last_payment_date}
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '0.75rem' }}
                        onClick={() => setReceipt({
                          receipt_number: `RCP-PAD-${assessment.assessment_number.slice(-4)}`,
                          assessment_number: assessment.assessment_number,
                          door_number: assessment.door_number,
                          masked_owner: assessment.owner_name,
                          amount_paid: assessment.annual_tax + assessment.library_cess,
                          payment_date: assessment.last_payment_date || '2026-05-12',
                          payment_mode: 'Online (CDMA AP Portal)',
                          grama_panchayat: 'Paderu Grama Sachivalayam, ASR District',
                          official_verification_notice: 'Verified Property Tax Payment Record'
                        })}
                      >
                        <Printer size={14} />
                        <span>{lang === 'te' ? 'రసీదు పునఃప్రింట్' : 'View / Print Tax Receipt'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Assessment Rules & Grievance / Correction */}
          <div>
            {/* Rules Card */}
            <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--slate-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                <HelpCircle size={18} style={{ color: 'var(--primary-700)' }} />
                <span>{lang === 'te' ? 'ఇంటి పన్ను లెక్కింపు నిబంధనలు' : 'Assessment & Calculation Rules'}</span>
              </div>

              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.7' }}>
                <li>
                  <strong>{lang === 'te' ? 'నిర్మాణ రకాలు:' : 'Building Classes:'}</strong> RCC (₹0.80/sq.ft), Tiled (₹0.55/sq.ft), Semi-pucca (₹0.65/sq.ft), Commercial (₹3.40/sq.ft).
                </li>
                <li>
                  <strong>{lang === 'te' ? 'గ్రంథాలయ సెస్:' : 'Library Cess:'}</strong> 8% surcharge on base annual property tax credited to District Library Authority.
                </li>
                <li>
                  <strong>{lang === 'te' ? 'చెల్లింపు గడువు:' : 'Rebate Period:'}</strong> 5% early bird rebate for full payment made before April 30 of each fiscal year.
                </li>
                <li>
                  <strong>{lang === 'te' ? 'రక్షణ విధానం:' : 'Notice:'}</strong> Real online payments must be completed via official CDMA Andhra Pradesh portals.
                </li>
              </ul>
            </div>

            {/* Assessment Correction Request */}
            <div className="card">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'ఇంటి పన్ను అసెస్మెంట్ సవరణ దరఖాస్తు' : 'Apply for Assessment Correction / Revision'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                {lang === 'te'
                  ? 'వైశాల్యం సరిదిద్దడం, పేరు మార్పు లేదా కేటగిరీ మార్పు కోసం దరఖాస్తు చేయండి'
                  : 'Submit a grievance for floor area revision, ownership name update, or commercial-to-residential reclassification'}
              </p>

              {correctionSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
                  <CheckCircle2 size={36} style={{ color: 'var(--primary-700)', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 800, color: 'var(--primary-900)' }}>
                    {lang === 'te' ? 'సవరణ దరఖాస్తు నమోదైనది!' : 'Correction Request Submitted!'}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                    {lang === 'te'
                      ? 'పంచాయతీ కార్యదర్శి క్షేత్ర పరిశీలన నిర్వహించి 7 పని దినములలో పరిష్కరిస్తారు.'
                      : 'Panchayat Secretary will inspect the site and update records within 7 working days.'}
                  </p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setCorrectionSuccess(false)}>
                    {lang === 'te' ? 'మరొక దరఖాస్తు' : 'Submit Another'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCorrectionSubmit}>
                  <div className="form-group">
                    <label className="form-label">{lang === 'te' ? 'మీ పేరు' : 'Applicant Name'}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={correctionForm.name}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, name: e.target.value })}
                      placeholder="e.g. K. Somanna Dora"
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">{lang === 'te' ? 'అసెస్మెంట్ నంబర్' : 'Assessment No.'}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={correctionForm.assessment_no}
                        onChange={(e) => setCorrectionForm({ ...correctionForm, assessment_no: e.target.value })}
                        placeholder="e.g. PAD-TAX-1001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang === 'te' ? 'మొబైల్ నంబర్' : 'Phone Number'}</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={correctionForm.phone}
                        onChange={(e) => setCorrectionForm({ ...correctionForm, phone: e.target.value })}
                        placeholder="10 digits"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang === 'te' ? 'సవరణ రకం' : 'Correction Type'}</label>
                    <select
                      className="form-select"
                      value={correctionForm.correction_type}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, correction_type: e.target.value })}
                    >
                      <option value="Area Correction">Plinth Area Correction (వైశాల్యం సవరణ)</option>
                      <option value="Ownership Name">Ownership Name Mutation (యాజమాన్య పేరు మార్పు)</option>
                      <option value="Classification Change">Commercial to Residential (నిర్మాణ రకం మార్పు)</option>
                      <option value="Arrears Dispute">Arrears Dispute (గత బకాయిల పరిష్కారం)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang === 'te' ? 'పూర్తి వివరణ' : 'Specific Grievance Details'}</label>
                    <textarea
                      className="form-textarea"
                      value={correctionForm.details}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, details: e.target.value })}
                      placeholder="State current discrepancy and supporting documents held..."
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    <Send size={16} />
                    <span>{lang === 'te' ? 'సవరణ దరఖాస్తు పంపండి' : 'Submit Correction Grievance'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certified Receipt Modal */}
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
}
