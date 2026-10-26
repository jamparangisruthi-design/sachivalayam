import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Accessibility,
  Droplets,
  Building,
  ArrowRight
} from 'lucide-react';

export default function SanitationPage({ onNavigate }) {
  const { lang, t } = useLanguage();
  const [toilets, setToilets] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grievance form
  const [formData, setFormData] = useState({
    category: 'Sanitation & Waste',
    sub_category: 'Blocked Public Toilet',
    locality_id: '2',
    landmark: 'Weekly Market Shandy Ground Complex',
    description: '',
    severity: 'High',
    citizen_name: '',
    citizen_phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/toilets').then(res => res.json()).catch(() => ({ toilets: [] })),
      fetch('/api/localities').then(res => res.json()).catch(() => ({ localities: [] }))
    ]).then(([toiletsData, locData]) => {
      setToilets(toiletsData.toilets || []);
      setLocalities(locData.localities || []);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const data = new FormData();
      data.append('category', 'Sanitation & Waste');
      data.append('locality_id', formData.locality_id);
      data.append('landmark', `${formData.sub_category} - ${formData.landmark}`);
      data.append('description', formData.description);
      data.append('severity', formData.severity);
      data.append('citizen_name', formData.citizen_name);
      data.append('citizen_phone', formData.citizen_phone);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit grievance.');
      setSuccessResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            {lang === 'te' ? 'గ్రామ పారిశుధ్యం & స్వచ్ఛభారత్' : 'Village Sanitation & Public Facilities'}
          </div>
          <h1 className="section-title">{t('sanitation_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('sanitation_desc')}
          </p>
        </div>

        {/* Public Toilets Directory */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
          {lang === 'te' ? 'పాడేరు ప్రజా శౌచాలయాల జాబితా & నిర్వహణ స్థితి' : 'Public Toilets Directory & Cleanliness Status'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>Loading sanitation facilities...</div>
        ) : (
          <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
            {toilets.map(toilet => (
              <div key={toilet.id} className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {lang === 'te' ? toilet.name_te : toilet.name_en}
                  </h3>
                  <span className={`badge ${toilet.cleanliness_status.includes('Clean') ? 'badge-resolved' : 'badge-assigned'}`}>
                    {toilet.cleanliness_status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} style={{ color: 'var(--slate-400)' }} />
                    <span>{lang === 'te' ? toilet.landmark_te : toilet.landmark_en}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} style={{ color: 'var(--slate-400)' }} />
                    <span>Opening Hours: <strong>{toilet.opening_hours}</strong> ({toilet.fee_type})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building size={15} style={{ color: 'var(--slate-400)' }} />
                    <span>Maintained by: {toilet.maintenance_agency}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: toilet.is_accessible ? 'var(--primary-700)' : 'var(--slate-400)' }}>
                    <Accessibility size={15} />
                    <span>{toilet.is_accessible ? 'Wheelchair Ramp' : 'No Ramp'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: toilet.has_running_water ? 'var(--blue-700)' : 'var(--danger-600)' }}>
                    <Droplets size={15} />
                    <span>{toilet.has_running_water ? 'Running Water 24x7' : 'Water Issue'}</span>
                  </div>

                  <div style={{ marginLeft: 'auto', color: 'var(--slate-400)' }}>
                    Last cleaned: {toilet.last_cleaned}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Sanitation Grievance Form */}
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', borderTop: '4px solid var(--primary-600)' }}>
          {successResult ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle2 size={54} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'పారిశుధ్య ఫిర్యాదు నమోదైనది!' : 'Sanitation Grievance Logged!'}
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Dispatched to the Panchayat Sanitation Supervisor. Cleanliness staff notified.
              </p>
              <div style={{ padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Tracking ID:</span>{' '}
                <strong style={{ fontSize: '1.3rem', color: 'var(--primary-900)' }}>{successResult.ref_number}</strong>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => setSuccessResult(null)}>
                  Log Another Cleanliness Issue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'పారిశుధ్యం & శౌచాలయ సమస్యలపై ఫిర్యాదు' : 'Report Toilet or Sanitation Maintenance Issue'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                Report dirty public toilets, drainage overflows, or garbage dumping for swift village cleaning.
              </p>

              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{lang === 'te' ? 'సమస్య విభాగం' : 'Issue Category'} <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={formData.sub_category}
                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  >
                    <option value="Blocked Public Toilet">Blocked Public Toilet (మరుగుదొడ్డి జామ్ అవ్వడం)</option>
                    <option value="Running Water Shortage">No Running Water in Toilet (నీటి కొరత)</option>
                    <option value="Drainage Overflow">Open Drainage Overflow (కాలువ పొంగిపొర్లడం)</option>
                    <option value="Garbage Pile Up">Garbage Waste Pile Up (చెత్త కుప్పలు పేరుకుపోవడం)</option>
                    <option value="Damaged Doors or Taps">Damaged Doors / Broken Taps (ద్వారాలు / కుళాయిలు పాడవడం)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'te' ? 'ప్రాంతం / వార్డు' : 'Locality / Ward'} <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={formData.locality_id}
                    onChange={(e) => setFormData({ ...formData, locality_id: e.target.value })}
                  >
                    {localities.map(loc => (
                      <option key={loc.id} value={loc.id}>Ward {loc.ward_number}: {loc.name_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'te' ? 'నిర్దిష్ట స్థలం / ఆనవాలు' : 'Specific Location / Landmark'} <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Weekly Market South Gate public toilet block"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'te' ? 'సమస్య వివరాలు' : 'Description of Maintenance Issue'} <span className="required">*</span></label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="State exact issue (water shortage, choked drain, broken lock, etc.)..."
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{lang === 'te' ? 'మీ పేరు' : 'Citizen Name'} <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.citizen_name}
                    onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                    placeholder="e.g. M. Subbamma"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Phone'} <span className="required">*</span></label>
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
                className="btn btn-primary btn-block"
                disabled={submitting}
                style={{ marginTop: '0.75rem' }}
              >
                <span>{submitting ? 'Submitting...' : (lang === 'te' ? 'పారిశుధ్య ఫిర్యాదు సమర్పించండి' : 'Submit Sanitation Grievance')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
