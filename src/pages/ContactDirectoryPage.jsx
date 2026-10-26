import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Filter,
  Search,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ContactDirectoryPage() {
  const { lang, t } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, [selectedCat]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let url = '/api/contacts?';
      if (selectedCat !== 'All') url += `category=${encodeURIComponent(selectedCat)}&`;

      const res = await fetch(url);
      const data = await res.json();
      setContacts(data.contacts || []);
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      c.name_en.toLowerCase().includes(term) ||
      c.name_te.includes(term) ||
      c.designation_en.toLowerCase().includes(term) ||
      c.office_location_en.toLowerCase().includes(term) ||
      c.office_phone.includes(term)
    );
  });

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <PhoneCall size={16} />
            {lang === 'te' ? 'అధికారిక కార్యాలయ సంప్రదింపులు' : 'Public Administration Directory'}
          </div>
          <h1 className="section-title">{t('contacts_title')}</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {t('contacts_desc')}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder={lang === 'te' ? 'అధికారి పేరు, హోదా లేదా శాఖను వెతకండి...' : 'Search by official name, designation, department, or location...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)', marginRight: '0.25rem' }}>
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} />
              Category:
            </span>
            <button
              type="button"
              className={`badge ${selectedCat === 'All' ? 'badge-resolved' : 'badge-closed'}`}
              style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={() => setSelectedCat('All')}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`badge ${selectedCat === cat ? 'badge-resolved' : 'badge-closed'}`}
                style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <AlertCircle size={36} style={{ color: 'var(--slate-400)', margin: '0 auto 1rem' }} />
            <h3>No matching contacts found</h3>
          </div>
        ) : (
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {filteredContacts.map(contact => (
              <div key={contact.id} className="card" style={{ borderLeft: '4px solid var(--primary-600)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-submitted">{contact.category}</span>
                    <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>
                      <ShieldCheck size={12} />
                      {contact.is_verified ? t('verified_badge') : t('unverified_badge')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                    {lang === 'te' ? contact.name_te : contact.name_en}
                  </h3>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-800)', marginBottom: '0.75rem' }}>
                    {lang === 'te' ? contact.designation_te : contact.designation_en}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} style={{ color: 'var(--slate-400)' }} />
                      <span>{lang === 'te' ? contact.office_location_te : contact.office_location_en}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={15} style={{ color: 'var(--slate-400)' }} />
                      <span>{contact.office_hours}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Last Verified: <strong>{contact.verified_date}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {contact.emergency_phone && (
                      <a href={`tel:${contact.emergency_phone.replace(/\D/g, '')}`} className="btn btn-danger btn-sm">
                        <PhoneCall size={13} />
                        <span>{contact.emergency_phone}</span>
                      </a>
                    )}
                    <a href={`tel:${contact.office_phone.replace(/\D/g, '')}`} className="btn btn-primary btn-sm">
                      <PhoneCall size={13} />
                      <span>{contact.office_phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
