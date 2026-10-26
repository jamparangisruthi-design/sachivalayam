import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  ExternalLink,
  CheckCircle,
  FileText,
  UserCheck,
  Building,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  Heart
} from 'lucide-react';

export default function ServicesPage({ onNavigate }) {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [selectedDept]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = '/api/services?';
      if (selectedDept !== 'All') url += `department=${encodeURIComponent(selectedDept)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      const data = await res.json();
      setServices(data.services || []);
      if (data.departments) setDepartments(data.departments);
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <FileText size={16} />
            {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రజా సంక్షేమ పథకాలు' : 'Andhra Pradesh Citizen Schemes'}
          </div>
          <h1 className="section-title">{t('services_title')}</h1>
          <p className="section-subtitle" style={{ margin: '0' }}>
            {t('services_desc')}
          </p>
        </div>

        {/* Search & Department Filters */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              <span>{lang === 'te' ? 'వెతకండి' : 'Search'}</span>
            </button>
          </form>

          {/* Department Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)', marginRight: '0.25rem' }}>
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} />
              {t('filter_dept')}:
            </span>
            <button
              type="button"
              className={`badge ${selectedDept === 'All' ? 'badge-resolved' : 'badge-closed'}`}
              style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={() => setSelectedDept('All')}
            >
              {lang === 'te' ? 'అన్ని శాఖలు' : 'All Departments'}
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                className={`badge ${selectedDept === dept ? 'badge-resolved' : 'badge-closed'}`}
                style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-500)' }}>
            <div className="spinner" style={{ marginBottom: '1rem' }} />
            <p>{lang === 'te' ? 'పథకాల వివరాలు లోడ్ అవుతున్నాయి...' : 'Loading verified schemes...'}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <AlertCircle size={40} style={{ color: 'var(--slate-400)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
              {lang === 'te' ? 'ఎటువంటి పథకాలు కనుగొనబడలేదు' : 'No matching schemes found'}
            </h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              {lang === 'te' ? 'దయచేసి వేరొక పదం లేదా శాఖను ఎంచుకోండి.' : 'Please adjust your search keywords or clear department filters.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {services.map((svc) => {
              const isExpanded = expandedId === svc.id;

              return (
                <div key={svc.id} className="card" style={{ padding: '1.5rem', borderLeft: '5px solid var(--primary-600)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-submitted">{svc.department}</span>
                      <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
                        {svc.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      <ShieldCheck size={14} style={{ color: 'var(--primary-600)' }} />
                      <span>{t('last_verified_label')}: <strong>{svc.last_verified}</strong></span>
                    </div>
                  </div>

                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                    {lang === 'te' ? svc.title_te : svc.title_en}
                  </h2>

                  <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {lang === 'te' ? svc.description_te : svc.description_en}
                  </p>

                  {/* Expandable Deep Information */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Eligibility */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                          <UserCheck size={16} style={{ color: 'var(--primary-700)' }} />
                          <span>{t('eligibility_label')}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                          {lang === 'te' ? svc.eligibility_te : svc.eligibility_en}
                        </p>
                      </div>

                      {/* Documents Checklist */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                          <CheckCircle size={16} style={{ color: 'var(--blue-700)' }} />
                          <span>{t('documents_label')}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                          {lang === 'te' ? svc.documents_te : svc.documents_en}
                        </p>
                      </div>

                      {/* Application Process */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                          <FileText size={16} style={{ color: 'var(--accent-amber)' }} />
                          <span>{t('process_label')}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                          {lang === 'te' ? svc.process_te : svc.process_en}
                        </p>
                      </div>

                      {/* Responsible Official */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)', padding: '0.5rem 0' }}>
                        <Building size={16} style={{ color: 'var(--slate-400)' }} />
                        <span>{t('responsible_label')}: <strong>{svc.responsible_office}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--slate-200)', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleExpand(svc.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={16} />
                          <span>{lang === 'te' ? 'వివరాలు తగ్గించండి' : 'Show Less'}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          <span>{lang === 'te' ? 'అర్హతలు & పత్రాల వివరాలు చూడండి' : 'View Eligibility & Documents'}</span>
                        </>
                      )}
                    </button>

                      <a
                      href={svc.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <span>{t('official_link_label')}</span>
                      <ExternalLink size={14} />
                    </a>

                    {onNavigate && svc.category === 'Pensions' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onNavigate('pension')}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#be123c', borderColor: '#fda4af' }}
                        >
                          <Heart size={14} color="#e11d48" />
                          <span>{lang === 'te' ? 'పింఛను పూర్తి వివరాలు & ట్రాకింగ్' : 'Full Pension Details & Tracker'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => onNavigate('apply', 'pension_scheme')}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#e11d48', borderColor: '#e11d48' }}
                        >
                          <FileText size={14} />
                          <span>{lang === 'te' ? 'ఆన్‌లైన్ పింఛను దరఖాస్తు' : 'Apply for Pension'}</span>
                        </button>
                      </div>
                    ) : onNavigate && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onNavigate('apply')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#059669' }}
                      >
                        <FileText size={14} />
                        <span>{lang === 'te' ? 'సచివాలయం ద్వారా దరఖాస్తు' : 'Apply Online'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
