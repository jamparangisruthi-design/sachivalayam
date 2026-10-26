import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Baby,
  Building2,
  Clock,
  PhoneCall,
  ShieldCheck,
  Lock,
  HeartPulse,
  Apple,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function AnganwadiPage({ onOpenLogin }) {
  const { lang, t } = useLanguage();
  const { user, hasRole } = useAuth();
  const isStaff = hasRole(['Service Staff', 'Department Officer', 'Administrator']);

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/anganwadi/public')
      .then(res => res.json())
      .then(data => {
        setCenters(data.centers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Baby size={16} />
            {lang === 'te' ? 'మహిళా & శిశు సంక్షేమ శాఖ' : 'Women & Child Development (ICDS)'}
          </div>
          <h1 className="section-title">{t('anganwadi_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('anganwadi_desc')}
          </p>
        </div>

        {/* Nutrition Programs Banner */}
        <div className="card" style={{ marginBottom: '2.5rem', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
            {lang === 'te' ? 'వైఎస్సార్ సంపూర్ణ పోషణ & ప్రీ-స్కూల్ సేవలు' : 'Nutrition & Early Childhood Services Provided'}
          </h2>

          <div className="grid-3" style={{ gap: '1.25rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '0.35rem' }}>
                <Apple size={16} />
                <span>Take-Home Ration (THR)</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                Monthly distribution of Fortified Balamrutham powder, boiled eggs (25 per month), and milk for children aged 6 months to 3 years.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--blue-800)', marginBottom: '0.35rem' }}>
                <BookOpen size={16} />
                <span>Pre-School Education</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                Activity-based foundational literacy and play education for children aged 3 to 6 years, along with freshly cooked hot nutritious lunch.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#92400e', marginBottom: '0.35rem' }}>
                <HeartPulse size={16} />
                <span>Health & Immunization</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                Monthly Village Health & Nutrition Day (VHND) immunization, growth monitoring with infantometers, and Vitamin A supplementation.
              </p>
            </div>
          </div>
        </div>

        {/* Public Anganwadi Centers Directory */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
          {lang === 'te' ? 'పాడేరు మండల అంగన్‌వాడీ కేంద్రాల జాబితా' : 'Verified Anganwadi Centers in Paderu'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>Loading centers...</div>
        ) : (
          <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {centers.map(center => (
              <div key={center.id} className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {lang === 'te' ? center.center_name_te : center.center_name_en}
                  </h3>
                  <span className="badge badge-submitted">{center.center_code}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building2 size={15} style={{ color: 'var(--slate-400)' }} />
                    <span>{lang === 'te' ? center.address_te : center.address_en}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} style={{ color: 'var(--slate-400)' }} />
                    <span>{center.operational_hours}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Baby size={15} style={{ color: 'var(--slate-400)' }} />
                    <span>Anganwadi Worker: <strong>{center.worker_name}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Drinking Water: {center.has_drinking_water ? '✓ Yes' : 'No'} • Toilet: {center.has_separate_toilet ? '✓ Yes' : 'No'}
                  </div>

                  <a href={`tel:${center.worker_phone_public}`} className="btn btn-secondary btn-sm">
                    <PhoneCall size={13} />
                    <span>Call Center ({center.worker_phone_public})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Strict Child Privacy Notice */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.85rem', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--primary-700)', flexShrink: 0 }} />
          <div>
            <strong>Child Rights & Privacy Protection Notice:</strong> In accordance with child welfare and privacy standards, individual children's names, dates of birth, attendance logs, and diagnostic health information are strictly confidential and are NEVER published on public web portals.
          </div>
        </div>
      </div>
    </div>
  );
}
