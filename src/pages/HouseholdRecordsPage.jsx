import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  PlusCircle,
  Download,
  AlertTriangle,
  Home,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export default function HouseholdRecordsPage({ onOpenLogin }) {
  const { lang } = useLanguage();
  const { user, token, hasRole } = useAuth();

  const isStaff = hasRole(['Service Staff', 'Department Officer', 'Administrator']);
  const [households, setHouseholds] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [selectedRation, setSelectedRation] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // New Survey Form Modal
  const [isAdding, setIsAdding] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    locality_id: '1',
    head_name: '',
    family_members_count: 4,
    ration_card_type: 'White Rice Card',
    ration_number: '19',
    housing_type: 'Pucca (RCC)',
    housing_tenure: 'Owned',
    water_connection: 'Individual Tap',
    electricity_meter: 'Yes',
    has_toilet: 'Yes'
  });
  const [surveyMsg, setSurveyMsg] = useState('');

  // Export Justification Modal
  const [isExporting, setIsExporting] = useState(false);
  const [exportJustification, setExportJustification] = useState('');
  const [exportMsg, setExportMsg] = useState('');

  useEffect(() => {
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => setLocalities(data.localities || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isStaff && token) {
      fetchHouseholds();
    }
  }, [isStaff, token, selectedLocality, selectedRation]);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      let url = '/api/staff/households?';
      if (selectedLocality !== 'All') url += `locality_id=${selectedLocality}&`;
      if (selectedRation !== 'All') url += `ration_type=${encodeURIComponent(selectedRation)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setHouseholds(data.households || []);
      }
    } catch (err) {
      console.error('Failed to load households:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSurvey = async (e) => {
    e.preventDefault();
    setSurveyMsg('');
    try {
      const res = await fetch('/api/staff/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSurvey)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add survey.');
      setSurveyMsg(`Survey recorded: ${data.household_code}`);
      fetchHouseholds();
      setTimeout(() => {
        setIsAdding(false);
        setSurveyMsg('');
      }, 1500);
    } catch (err) {
      setSurveyMsg(`Error: ${err.message}`);
    }
  };

  const handleExportData = async (e) => {
    e.preventDefault();
    setExportMsg('');
    try {
      const res = await fetch('/api/admin/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          dataset: 'Household_Survey_Demographics',
          justification: exportJustification
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Export request denied.');
      setExportMsg(data.message);
      setTimeout(() => {
        setIsExporting(false);
        setExportMsg('');
        setExportJustification('');
      }, 2000);
    } catch (err) {
      setExportMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="section animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Users size={16} />
            {lang === 'te' ? 'జనాభా & కుటుంబాల సర్వే రికార్డులు' : 'Village Demographics & Household Registry'}
          </div>
          <h1 className="section-title">
            {lang === 'te' ? 'పాడేరు జనాభా & కుటుంబ గణాంకాలు' : 'Paderu Population & Household Records'}
          </h1>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {lang === 'te'
              ? 'ప్రజల గోప్యతను సంరక్షిస్తూ సమగ్ర గణాంకాలు. వ్యక్తిగత కుటుంబ రికార్డులు కేవలం సచివాలయ ఉద్యోగులకే అందుబాటులో ఉంటాయి.'
              : 'Privacy-protected aggregate demographics with strictly authorized role-based access for village survey administration.'}
          </p>
        </div>

        {/* Small Groups Privacy Notice Banner */}
        <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={22} style={{ color: 'var(--primary-700)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--primary-900)', lineHeight: '1.5' }}>
            <strong>{lang === 'te' ? 'గోప్యతా రక్షణ నిబంధన:' : 'Privacy Protection Guarantee:'}</strong>{' '}
            {lang === 'te'
              ? 'వ్యక్తులు మరియు కుటుంబాల గుర్తింపు బయటపడకుండా ఉండేందుకు 10 కంటే తక్కువ మంది ఉన్న జనాభా ఉపవర్గాల వివరాలు పబ్లిక్ వీక్షణలో దాచబడతాయి. పూర్తి రికార్డులు అధికారిక లాగిన్ ద్వారా మాత్రమే చూడవచ్చు.'
              : 'Public demographic counts are aggregated. Small demographic groups (< 10 individuals) are suppressed to prevent re-identification. Identifiable family details and location coordinates are never exposed to the public.'}
          </div>
        </div>

        {/* Public Aggregates Section */}
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              {lang === 'te' ? 'మొత్తం సర్వే చేసిన కుటుంబాలు' : 'Surveyed Households (Sample)'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0.35rem 0' }}>
              4,820
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Across 8 Grama Panchayat Wards
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--blue-700)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              {lang === 'te' ? 'తాగునీటి కనెక్షన్ల శాతం (FHTC)' : 'Piped Water Coverage'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-800)', margin: '0.35rem 0' }}>
              94.8%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Individual Tap & Standpost coverage
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              {lang === 'te' ? 'గ్రామ విద్యుదీకరణ రేటు' : 'Electrification Rate'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#92400e', margin: '0.35rem 0' }}>
              98.2%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Domestic single-phase metered connections
            </div>
          </div>
        </div>

        {/* Demographic Brackets Breakdown */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
            {lang === 'te' ? 'వయో సమూహాలు & గృహ వర్గీకరణ (గ్రామ పంచాయతీ సగటు)' : 'Demographic Age Brackets & Housing Tenure'}
          </h2>

          <div className="grid-2" style={{ gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.75rem' }}>
                Age Group Distribution:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Children (0-14 years):</span>
                    <strong>27.4%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '27.4%', height: '100%', backgroundColor: 'var(--blue-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Working Age Population (15-59 years):</span>
                    <strong>61.2%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '61.2%', height: '100%', backgroundColor: 'var(--primary-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Senior Citizens (60+ years):</span>
                    <strong>11.4%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '11.4%', height: '100%', backgroundColor: 'var(--accent-amber)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.75rem' }}>
                Housing Tenure & Sanitation:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Owned Pucca / Traditional Houses:</span>
                    <strong>88.5%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '88.5%', height: '100%', backgroundColor: 'var(--primary-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Rented Commercial / Residential:</span>
                    <strong>8.2%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '8.2%', height: '100%', backgroundColor: 'var(--blue-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Government Grant Housing (PMAY / RoFR):</span>
                    <strong>3.3%</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '3.3%', height: '100%', backgroundColor: 'var(--accent-amber)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESTRICTED SECTION: Authorized Staff & Officer View */}
        <div className="card" style={{ border: '2px solid var(--slate-300)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Lock size={22} style={{ color: isStaff ? 'var(--primary-700)' : 'var(--slate-400)' }} />
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {lang === 'te' ? 'అధికారిక సిబ్బంది కుటుంబాల రిజిస్టర్' : 'Restricted Staff Household Registry'}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Requires Role: Service Staff, Department Officer, or Administrator
                </div>
              </div>
            </div>

            {isStaff ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setIsExporting(true)}>
                  <Download size={14} />
                  <span>{lang === 'te' ? 'ఎక్స్‌పోర్ట్ డేటా' : 'Export Register'}</span>
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
                  <PlusCircle size={14} />
                  <span>{lang === 'te' ? 'నూతన సర్వే నమోదు' : 'Add Survey Record'}</span>
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onOpenLogin}>
                <Lock size={14} />
                <span>{lang === 'te' ? 'సిబ్బంది లాగిన్ అవ్వండి' : 'Sign in as Staff to View'}</span>
              </button>
            )}
          </div>

          {!isStaff ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--slate-300)' }}>
              <Lock size={40} style={{ color: 'var(--slate-400)', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                {lang === 'te' ? 'వ్యక్తిగత కుటుంబాల రికార్డులు రక్షించబడ్డాయి' : 'Detailed Household Records are Restricted'}
              </h3>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '520px', margin: '0.5rem auto 1.5rem' }}>
                {lang === 'te'
                  ? 'ఆంధ్రప్రదేశ్ డేటా గవర్నెన్స్ నిబంధనల ప్రకారం, కుటుంబ పెద్దల పేర్లు మరియు రేషన్ వివరాలు కేవలం ధృవీకరించబడిన ఉద్యోగులకు మాత్రమే ప్రదర్శించబడతాయి.'
                  : 'In compliance with Andhra Pradesh Data Governance, personal family registers and door-to-door survey data are accessible exclusively to authorized village functionaries.'}
              </p>
              <button className="btn btn-primary" onClick={onOpenLogin}>
                {lang === 'te' ? 'డెమో స్టాఫ్ ఖాతాలోకి ప్రవేశించండి' : 'Quick Demo Sign In (Staff Role)'}
              </button>
            </div>
          ) : (
            <div>
              {/* Staff Filter Bar */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ flexGrow: 1, minWidth: '220px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search Household Code or Head Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                >
                  <option value="All">All Localities</option>
                  {localities.map(loc => (
                    <option key={loc.id} value={loc.id}>Ward {loc.ward_number}: {loc.name_en}</option>
                  ))}
                </select>

                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={selectedRation}
                  onChange={(e) => setSelectedRation(e.target.value)}
                >
                  <option value="All">All Ration Types</option>
                  <option value="White Rice Card">White Rice Card</option>
                  <option value="White Rice Card (Antyodaya)">Antyodaya Anna Yojana</option>
                </select>

                <button type="button" className="btn btn-secondary btn-sm" onClick={fetchHouseholds}>
                  <Search size={14} />
                  <span>Filter</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Locality</th>
                      <th>Head of Household</th>
                      <th>Members</th>
                      <th>Ration Card (Masked)</th>
                      <th>Housing & Tenure</th>
                      <th>Water Connection</th>
                      <th>Power</th>
                      <th>Toilet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {households.map(hh => (
                      <tr key={hh.id}>
                        <td><strong>{hh.household_code}</strong></td>
                        <td>{hh.locality_name_en}</td>
                        <td>{hh.head_name}</td>
                        <td>{hh.family_members_count}</td>
                        <td><code>{hh.masked_ration_number}</code></td>
                        <td>
                          <div>{hh.housing_type}</div>
                          <span className="badge badge-submitted" style={{ fontSize: '0.65rem' }}>{hh.housing_tenure}</span>
                        </td>
                        <td>{hh.water_connection}</td>
                        <td>{hh.electricity_meter}</td>
                        <td>{hh.has_toilet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Displaying {households.length} surveyed household records.</span>
                <span>Session User: {user?.username} ({user?.role}) • All queries audit logged</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Survey Modal */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '580px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Add Household Survey Record
            </h3>

            {surveyMsg && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                {surveyMsg}
              </div>
            )}

            <form onSubmit={handleAddSurvey}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Locality / Ward</label>
                  <select
                    className="form-select"
                    value={newSurvey.locality_id}
                    onChange={(e) => setNewSurvey({ ...newSurvey, locality_id: e.target.value })}
                  >
                    {localities.map(loc => (
                      <option key={loc.id} value={loc.id}>Ward {loc.ward_number}: {loc.name_en}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Family Head Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newSurvey.head_name}
                    onChange={(e) => setNewSurvey({ ...newSurvey, head_name: e.target.value })}
                    placeholder="e.g. Korra Somanna Dora"
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Total Family Members</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={newSurvey.family_members_count}
                    onChange={(e) => setNewSurvey({ ...newSurvey, family_members_count: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ration Card Last 2 Digits</label>
                  <input
                    type="text"
                    maxLength="2"
                    className="form-input"
                    value={newSurvey.ration_number}
                    onChange={(e) => setNewSurvey({ ...newSurvey, ration_number: e.target.value })}
                    placeholder="e.g. 42"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Housing Type</label>
                  <select
                    className="form-select"
                    value={newSurvey.housing_type}
                    onChange={(e) => setNewSurvey({ ...newSurvey, housing_type: e.target.value })}
                  >
                    <option value="Pucca (RCC)">Pucca (RCC)</option>
                    <option value="Semi-Pucca">Semi-Pucca</option>
                    <option value="Tiled House">Tiled House</option>
                    <option value="Traditional Thatched">Traditional Thatched</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Housing Tenure</label>
                  <select
                    className="form-select"
                    value={newSurvey.housing_tenure}
                    onChange={(e) => setNewSurvey({ ...newSurvey, housing_tenure: e.target.value })}
                  >
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                    <option value="Government Grant">Government Grant</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Water Source</label>
                  <select
                    className="form-select"
                    value={newSurvey.water_connection}
                    onChange={(e) => setNewSurvey({ ...newSurvey, water_connection: e.target.value })}
                  >
                    <option value="Individual Tap">Individual Tap</option>
                    <option value="Community Standpost">Community Standpost</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Natural Stream">Natural Stream</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Electricity Meter</label>
                  <select
                    className="form-select"
                    value={newSurvey.electricity_meter}
                    onChange={(e) => setNewSurvey({ ...newSurvey, electricity_meter: e.target.value })}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Under Application">Under Application</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Toilet Facility</label>
                  <select
                    className="form-select"
                    value={newSurvey.has_toilet}
                    onChange={(e) => setNewSurvey({ ...newSurvey, has_toilet: e.target.value })}
                  >
                    <option value="Yes">Yes (Individual)</option>
                    <option value="Community Facility">Community Facility</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => setIsAdding(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block">
                  Save Survey Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Justification Modal */}
      {isExporting && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Authorized Data Export
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              Under the Data Protection Policy, exporting household records requires an official justification of at least 10 characters, which is logged to the system audit records.
            </p>

            {exportMsg && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                {exportMsg}
              </div>
            )}

            <form onSubmit={handleExportData}>
              <div className="form-group">
                <label className="form-label">Official Purpose / Justification <span className="required">*</span></label>
                <textarea
                  className="form-textarea"
                  value={exportJustification}
                  onChange={(e) => setExportJustification(e.target.value)}
                  placeholder="e.g. Gram Sabha review for drinking water pipeline planning..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => setIsExporting(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block">
                  Authorize & Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
