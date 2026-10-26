import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Zap,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

export default function ElectricityPage({ onNavigate }) {
  const { lang, t } = useLanguage();
  const [localities, setLocalities] = useState([]);
  const [formData, setFormData] = useState({
    sub_category: 'Streetlight Not Glowing',
    locality_id: '1',
    landmark: '',
    description: '',
    severity: 'Medium',
    citizen_name: '',
    citizen_phone: '',
    pole_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => setLocalities(data.localities || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('category', 'Electricity');
      data.append('locality_id', formData.locality_id);
      data.append('landmark', `${formData.sub_category} - ${formData.landmark} (Pole: ${formData.pole_number || 'N/A'})`);
      data.append('description', formData.description);
      data.append('severity', formData.severity);
      data.append('citizen_name', formData.citizen_name);
      data.append('citizen_phone', formData.citizen_phone);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit grievance.');
      }
      setSuccessResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setFormData({
      sub_category: 'Streetlight Not Glowing',
      locality_id: '1',
      landmark: '',
      description: '',
      severity: 'Medium',
      citizen_name: '',
      citizen_phone: '',
      pole_number: ''
    });
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Zap size={16} />
            {lang === 'te' ? 'విద్యుత్ & వీధి దీపాల సేవలు' : 'Electricity & Village Lighting'}
          </div>
          <h1 className="section-title">{t('elec_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('elec_desc')}
          </p>
        </div>

        {/* Critical Distinction Notice: Official Discom vs Sachivalayam Portal */}
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '2px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}
        >
          <Info size={24} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e', marginBottom: '0.35rem' }}>
              {lang === 'te'
                ? 'ముఖ్యమైన అధికారిక సమాచారం – యుటిలిటీ & పోర్టల్ తేడా'
                : 'Notice: Portal Coordination vs. Official Utility System'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              {t('elec_utility_notice')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="tel:1912" className="btn btn-amber btn-sm">
                <PhoneCall size={14} />
                <span>APEPDCL Toll-Free: <strong>1912</strong> (24x7)</span>
              </a>
              <a
                href="https://www.apeasternpower.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <span>APEPDCL Consumer Portal</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gap: '2rem' }}>
          {/* Left Column: Reporting Form */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-amber)' }}>
            {successResult ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={54} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {lang === 'te' ? 'విద్యుత్ ఫిర్యాదు నమోదైనది!' : 'Electricity Issue Recorded!'}
                </h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {lang === 'te'
                    ? 'గ్రామ సచివాలయ ఎనర్జీ అసిస్టెంట్ మరియు లైన్‌మెన్ పరిశీలన కొరకు కేటాయించబడింది.'
                    : 'Dispatched to Sachivalayam Energy Assistant and APEPDCL line staff for repair.'}
                </p>

                <div style={{ padding: '1.25rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#92400e', textTransform: 'uppercase', fontWeight: 700 }}>
                    {lang === 'te' ? 'ఫిర్యాదు రిఫరెన్స్ సంఖ్య' : 'Reference Number'}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#78350f', margin: '0.35rem 0' }}>
                    {successResult.ref_number}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary btn-block" onClick={handleReset}>
                    {lang === 'te' ? 'మరొక సమస్య నమోదు' : 'Log Another'}
                  </button>
                  <button className="btn btn-primary btn-block" onClick={() => onNavigate('complaints')}>
                    <span>{t('btn_track_status')}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {lang === 'te' ? 'వీధి దీపం లేదా విద్యుత్ సమస్య నమోదు' : 'Report Streetlight or Village Power Fault'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                  {lang === 'te'
                    ? 'వీధి దీపాలు వెలగకపోవడం, స్తంభం దెబ్బతినడం లేదా కేబుల్ లూజుగా ఉండటంపై తెలపండి'
                    : 'Log issues for LED streetlight repair, pole replacement, or dangling wire hazard'}
                </p>

                {error && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమస్య విభాగం' : 'Issue Category'} <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.sub_category}
                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  >
                    <option value="Streetlight Not Glowing">Streetlight Fixture Burnt / Not Glowing (వీధి దీపం వెలగడం లేదు)</option>
                    <option value="Damaged Pole">Damaged / Leaning Electric Pole (స్తంభం వంగిపోవడం / పగలడం)</option>
                    <option value="Loose Overhead Wire">Dangling / Loose Overhead Cable (తీగలు వేలాడడం - ప్రమాదం)</option>
                    <option value="Local Area Outage">Local Area Outage / Phase Problem (సింగిల్ ఫేస్ సమస్య)</option>
                    <option value="Transformer Sparking">Transformer Sparking / Oil Leak (ట్రాన్స్‌ఫార్మర్ స్పార్క్)</option>
                    <option value="New Connection Delay">New Meter Connection Delay (కొత్త మీటర్ జాప్యం)</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'te' ? 'పాడేరు ప్రాంతం / వార్డు' : 'Locality / Ward'} <span className="required">*</span>
                    </label>
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

                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'te' ? 'విద్యుత్ స్తంభం సంఖ్య (ఐచ్ఛికం)' : 'Pole Number (If visible on pole)'}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.pole_number}
                      onChange={(e) => setFormData({ ...formData, pole_number: e.target.value })}
                      placeholder="e.g. P-42 or AP-109"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమీప ఆనవాలు / స్థలం' : 'Street Location & Landmark'} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder={lang === 'te' ? 'ఉదా: సంత మైదానం లైన్ 3, బస్ కాంప్లెక్స్ వెనుక' : 'e.g. Shandy Ground Lane 3, Behind RTC Complex'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమస్య వివరణ' : 'Issue Description'} <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={lang === 'te' ? 'ఎంత కాలంగా సమస్య ఉంది, ప్రమాదం ఏదైనా ఉందా వివరించండి...' : 'Describe the power or lighting issue in detail...'}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'te' ? 'మీ పేరు' : 'Citizen Name'} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.citizen_name}
                      onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                      placeholder="e.g. B. Raju"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Phone'} <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.citizen_phone}
                      onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
                      placeholder="10 digit number"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-amber btn-block"
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
                >
                  <Zap size={16} />
                  <span>{loading ? 'Submitting...' : (lang === 'te' ? 'విద్యుత్ ఫిర్యాదు సమర్పించండి' : 'Submit Electricity Complaint')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Responsible Provider Info */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                {lang === 'te' ? 'బాధ్యత గల విద్యుత్ సంస్థ వివరాలు' : 'Responsible Utility Provider'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong>APEPDCL</strong> (Eastern Power Distribution Company of AP Ltd) supplies electricity to Paderu and surrounding agency hamlets through the 33/11 kV Paderu Sub-Station.
              </p>

              <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--slate-800)', fontSize: '0.9rem' }}>
                  APEPDCL Paderu Section Office
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                  Sub-Station Compound, Cinema Hall Road, Paderu
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <a href="tel:08935250210" className="btn btn-secondary btn-sm">
                    <PhoneCall size={14} /> 08935-250210
                  </a>
                  <a href="tel:1912" className="btn btn-amber btn-sm">
                    <Zap size={14} /> Dial 1912
                  </a>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', lineHeight: '1.5' }}>
                <strong>High Voltage Hazard Warning:</strong> Never approach snapped electric wires or sparking transformers. Call 1912 immediately and keep villagers at a safe distance of at least 10 meters.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
