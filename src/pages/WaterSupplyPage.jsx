import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Droplets,
  AlertTriangle,
  Upload,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function WaterSupplyPage({ onNavigate }) {
  const { lang, t } = useLanguage();
  const [localities, setLocalities] = useState([]);
  const [formData, setFormData] = useState({
    category: 'Water Supply',
    sub_category: 'Pipeline Leakage',
    locality_id: '1',
    landmark: '',
    description: '',
    severity: 'High',
    citizen_name: '',
    citizen_phone: '',
    map_landmark: 'Temple Road Distribution Valve'
  });
  const [photoFile, setPhotoFile] = useState(null);
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
      data.append('category', 'Water Supply');
      data.append('locality_id', formData.locality_id);
      data.append('landmark', `${formData.sub_category} - ${formData.landmark} (${formData.map_landmark})`);
      data.append('description', formData.description);
      data.append('severity', formData.severity);
      data.append('citizen_name', formData.citizen_name);
      data.append('citizen_phone', formData.citizen_phone);
      if (photoFile) {
        data.append('photo', photoFile);
      }

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
      category: 'Water Supply',
      sub_category: 'Pipeline Leakage',
      locality_id: '1',
      landmark: '',
      description: '',
      severity: 'High',
      citizen_name: '',
      citizen_phone: '',
      map_landmark: 'Temple Road Distribution Valve'
    });
    setPhotoFile(null);
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Droplets size={16} />
            {lang === 'te' ? 'గ్రామీణ తాగునీటి సరఫరా విభాగం (RWSS)' : 'Rural Water Supply & Sanitation'}
          </div>
          <h1 className="section-title">{t('water_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('water_desc')}
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gap: '2rem' }}>
          {/* Left Column: Complaint Form or Success Ticket */}
          <div className="card" style={{ borderTop: '4px solid var(--blue-700)' }}>
            {successResult ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={54} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {lang === 'te' ? 'తాగునీటి ఫిర్యాదు విజయవంతంగా నమోదైనది!' : 'Water Grievance Submitted Successfully!'}
                </h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {lang === 'te'
                    ? 'మీ ఫిర్యాదు సంబంధిత ఇంజనీరింగ్ అసిస్టెంట్ మరియు RWSS విభాగానికి పంపబడింది.'
                    : 'Your grievance has been assigned to the Engineering Assistant for urgent field inspection.'}
                </p>

                <div style={{ padding: '1.25rem', backgroundColor: 'var(--blue-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--blue-100)', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--blue-800)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {lang === 'te' ? 'ఫిర్యాదు ట్రాకింగ్ సంఖ్య' : 'Your Complaint Reference Number'}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue-900)', margin: '0.35rem 0' }}>
                    {successResult.ref_number}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {lang === 'te'
                      ? 'ఈ నంబర్ ద్వారా మీరు ఫిర్యాదు పురోగతిని తెలుసుకోవచ్చు'
                      : 'Save this reference number to track resolution progress'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary btn-block" onClick={handleReset}>
                    {lang === 'te' ? 'మరొక సమస్య నమోదు' : 'Log Another Issue'}
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
                  {lang === 'te' ? 'తాగునీటి సమస్యపై తక్షణ ఫిర్యాదు' : 'Report Drinking Water Problem'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                  {lang === 'te'
                    ? 'పైప్‌లైన్ పగలడం, మోటారు పాడవడం లేదా కలుషిత నీటిపై వెంటనే తెలియజేయండి'
                    : 'Report leakages, handpump failures, or contaminated water for fast dispatch'}
                </p>

                {error && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమస్య స్వభావం' : 'Issue Category'} <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.sub_category}
                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  >
                    <option value="No Water Supply">No Water Supply (తాగునీటి సరఫరా నిలిచిపోవడం)</option>
                    <option value="Pipeline Leakage">Pipeline Burst / Heavy Leakage (పైప్‌లైన్ పగలడం / లీకేజ్)</option>
                    <option value="Contaminated Water">Contaminated / Turbid Water (కలుషిత / మట్టి నీరు)</option>
                    <option value="Borewell Breakdown">Handpump / Borewell Breakdown (చేతిపంపు మరమ్మతు)</option>
                    <option value="Motor Burnout">Motor Pump Burnout (పంప్ మోటారు కాలిపోవడం)</option>
                    <option value="Tank Cleaning">Overhead Tank Cleaning (నీటి ట్యాంక్ శుభ్రత)</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'te' ? 'ప్రాంతం / వార్డు' : 'Locality / Ward in Paderu'} <span className="required">*</span>
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
                      {lang === 'te' ? 'తీవ్రత' : 'Severity'}
                    </label>
                    <select
                      className="form-select"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="Emergency">Emergency (తీవ్ర అత్యవసరం - తాగునీరు లేదు)</option>
                      <option value="High">High (అధిక తీవ్రత)</option>
                      <option value="Medium">Medium (సాధారణ)</option>
                      <option value="Low">Low (స్వల్ప సమస్య)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమీప ఆనవాలు / వీధి పేరు' : 'Street Address / Specific Landmark'} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder={lang === 'te' ? 'ఉదా: టెంపుల్ ఆర్చ్ ఎదురుగా, హౌస్ నం 1-24 వద్ద' : 'e.g. Opposite Modakondamma Arch, Door No 1-24'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమస్య వివరణ' : 'Detailed Description'} <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={lang === 'te' ? 'నీటి లీకేజీ లేదా సమస్య ఎంతకాలంగా ఉంది, ఎన్ని ఇళ్ళకు అంతరాయం కలుగుతుందో తెలపండి...' : 'Provide details on duration of disruption and number of affected households...'}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'te' ? 'మీ పేరు' : 'Your Name'} <span className="required">*</span>
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
                      {lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number'} <span className="required">*</span>
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

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'te' ? 'సమస్య ఫోటో (ఐచ్ఛికం)' : 'Attach Photo of Fault / Leakage (Optional)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                  />
                  <div className="form-helper">
                    {lang === 'te' ? 'గరిష్ట పరిమాణం: 5 MB (JPG, PNG, WebP)' : 'Max size 5 MB. Helps maintenance technicians bring right pipe size.'}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                  style={{ marginTop: '1.25rem' }}
                >
                  <Droplets size={16} />
                  <span>{loading ? 'Submitting...' : (lang === 'te' ? 'తాగునీటి ఫిర్యాదు నమోదు చేయండి' : 'Submit Water Grievance')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Infrastructure Details & RWSS Contact */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--blue-50)', border: '1px solid var(--blue-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-900)', marginBottom: '0.75rem' }}>
                <Clock size={18} style={{ color: 'var(--blue-700)' }} />
                <span>{lang === 'te' ? 'పాడేరు తాగునీటి సరఫరా వేళలు' : 'Water Supply Schedule in Paderu'}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                {lang === 'te'
                  ? 'జల్ జీవన్ మిషన్ ద్వారా పాడేరు పంచాయతీలోని 8 వార్డులకు ఉదయం 06:00 నుండి 08:30 వరకు మరియు సాయంత్రం 05:00 నుండి 07:00 వరకు రక్షిత తాగునీరు సరఫరా చేయబడుతుంది.'
                  : 'Protected piped drinking water is supplied twice daily from 06:00 AM to 08:30 AM and 05:00 PM to 07:00 PM across all 8 panchayat wards.'}
              </p>

              <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-100)', fontSize: '0.85rem' }}>
                <strong>{lang === 'te' ? 'ఆర్డబ్ల్యూఎస్ఎస్ సెక్షన్ కార్యాలయం:' : 'RWSS Section Contact:'}</strong>
                <div style={{ marginTop: '0.25rem', color: 'var(--slate-700)' }}>
                  AEE (Rural Water Supply), Behind MPDO Office, Taluka Road
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <a href="tel:08935250340" className="btn btn-secondary btn-sm">
                    <PhoneCall size={14} /> 08935-250340
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'నీటి నాణ్యత మరియు క్లోరినేషన్' : 'Water Quality & Chlorination Testing'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                {lang === 'te'
                  ? 'ప్రతి శనివారం అన్ని మంచినీటి ట్యాంకులలో క్లోరినేషన్ మరియు ఫ్లోరైడ్ పరీక్షలు నిర్వహించబడతాయి. మట్టి లేదా రంగుమారిన నీరు వస్తే వెంటనే ఫిర్యాదు చేయండి.'
                  : 'Residual chlorine testing and bacteriological tests are performed weekly. Turbid or odorous water should be reported immediately for filter backwashing.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>94.8% Functional Household Tap Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
