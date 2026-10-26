import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Award,
  Download,
  Printer,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Building,
  Droplets,
  Baby,
  ShieldCheck,
  UserCheck,
  X,
  FileCheck,
  Calendar,
  HelpCircle,
  Phone,
  MapPin,
  FileBadge2,
  Heart
} from 'lucide-react';

export default function OnlineApplicationPage({ initialService = null, onNavigate }) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('apply'); // 'apply' or 'track'
  const [localities, setLocalities] = useState([]);
  const [selectedService, setSelectedService] = useState(initialService || 'income_certificate');

  // Multi-step form state
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // General Applicant Info
  const [applicantName, setApplicantName] = useState(user?.role === 'Resident' ? 'K. Somanna Dora' : '');
  const [applicantPhone, setApplicantPhone] = useState(user?.role === 'Resident' ? '9848011223' : '');
  const [applicantAadhaar, setApplicantAadhaar] = useState('XXXX-XXXX-4512');
  const [localityId, setLocalityId] = useState('1');
  const [doorNumber, setDoorNumber] = useState('1-24/A');
  const [declarationChecked, setDeclarationChecked] = useState(false);

  // Dynamic Service-Specific Form Data
  const [formData, setFormData] = useState({
    // Income
    annual_income: '60000',
    income_source: 'Organic Coffee Farming (కాఫీ తోటల సాగు)',
    ration_card_number: 'WAP0318920112',
    purpose: 'Jagananna Vidya Deevena & Scholarship',
    father_or_spouse_name: 'K. Subba Rao Dora',
    // Caste
    community_category: 'ST (Scheduled Tribe / అనుసూచిత తెగ)',
    sub_caste: 'Konda Dora (కొండ దొర)',
    father_caste: 'Konda Dora',
    mother_caste: 'Konda Dora',
    school_record: 'Paderu High School Study Certificate',
    // Water Connection
    connection_type: 'Residential Domestic (గృహావసరాలు)',
    assessment_number: 'PAD-TAX-1001',
    pipeline_distance_meters: '10',
    // Birth
    child_name: '',
    child_gender: 'Male',
    date_of_birth: '2026-09-15',
    place_of_birth: 'Paderu District Area Hospital',
    mother_name: '',
    father_name: '',
    // Death
    deceased_name: '',
    deceased_gender: 'Male',
    date_of_death: '2026-10-01',
    age_at_death: '68',
    cause_of_death: 'Natural causes / Age related',
    place_of_death: 'Residence, Paderu',
    informant_name: '',
    informant_relation: 'Son / కుమార్తె',
    // NTR Bharosa Pension Fields
    pension_category: 'Old Age Pension (OAP / వృద్ధాప్య పింఛను - ₹4,000/mo)',
    applicant_age: '64',
    applicant_dob: '1962-06-15',
    pension_rice_card: 'WAP0318920112',
    bank_account_number: '30481010045231',
    bank_ifsc: 'SBIN0001854',
    bank_name: 'State Bank of India, Paderu Main Branch',
    sadarem_id: 'SAD-AP-2026-9041',
    widow_death_cert_no: '',
    land_wetland_acres: '0.0',
    land_dryland_acres: '2.1',
    monthly_power_units: '68',
    four_wheeler_owned: 'No',
    govt_employee_in_family: 'No'
  });

  // Tracking State
  const [trackAppNo, setTrackAppNo] = useState('APP-2026-3041');
  const [trackPhone, setTrackPhone] = useState('9848011223');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Digital Certificate Modal State
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => setLocalities(data.localities || []))
      .catch(() => {});
  }, []);

  const serviceCatalog = [
    {
      id: 'pension_scheme',
      name_en: 'NTR Bharosa Social Security Pension',
      name_te: 'ఎన్టీఆర్ భరోసా సామాజిక భద్రతా పింఛను',
      desc_en: 'Monthly financial assistance (₹4,000 - ₹15,000) for elderly, widows, persons with disabilities, weavers, and medical relief.',
      desc_te: 'వృద్ధులు, వితంతువులు, దివ్యాంగులు మరియు చేనేత కార్మికులకు నెలకు ₹4,000 నుండి ₹15,000 వరకు ఆర్థిక భరోసా సహాయం.',
      sla: 21,
      department_en: 'SERP & Rural Development (గ్రామీణాభివృద్ధి & సెర్ప్)',
      icon: Heart,
      fee: 'Free / ఉచితం (Zero Fee)'
    },
    {
      id: 'income_certificate',
      name_en: 'Integrated Income Certificate',
      name_te: 'సమగ్ర ఆదాయ ధ్రువీకరణ పత్రం',
      desc_en: 'Essential for post-matric scholarships, fee reimbursement (Jagananna Vidya Deevena), and social welfare schemes.',
      desc_te: 'స్కాలర్‌షిప్‌లు, విద్యా దీవెన మరియు సంక్షేమ పథకాలకు అవసరమైన అధికారిక ఆదాయ పత్రం.',
      sla: 7,
      department_en: 'Revenue Department (రెవెన్యూ శాఖ)',
      icon: Award,
      fee: '₹35 (Grama Sachivalayam Service Fee)'
    },
    {
      id: 'caste_certificate',
      name_en: 'Integrated Community & Caste Certificate',
      name_te: 'సమగ్ర కుల ధ్రువీకరణ పత్రం',
      desc_en: 'ST, SC, and BC community certificate for educational reservations, ITDA tribal quotas, and government employment.',
      desc_te: 'గిరిజన (ST), SC, BC రిజర్వేషన్లు, ఐటీడీఏ కోటా మరియు ఉద్యోగాలకు కుల ధ్రువీకరణ పత్రం.',
      sla: 15,
      department_en: 'Revenue & Tribal Welfare (రెవెన్యూ & గిరిజన సంక్షేమం)',
      icon: FileBadge2,
      fee: '₹35 (Official Fee)'
    },
    {
      id: 'water_connection',
      name_en: 'New Tap Water Connection',
      name_te: 'నూతన కుళాయి కనెక్షన్ (జల్ జీవన్ మిషన్)',
      desc_en: 'Apply for individual household piped drinking water tap line under Jal Jeevan Mission.',
      desc_te: 'జల్ జీవన్ మిషన్ కింద ప్రతి ఇంటికి సురక్షిత రక్షిత తాగునీటి కుళాయి కనెక్షన్ దరఖాస్తు.',
      sla: 10,
      department_en: 'Rural Water Supply (RWSS / గ్రామీణ తాగునీటి శాఖ)',
      icon: Droplets,
      fee: '₹100 (Inspection & Estimate Fee)'
    },
    {
      id: 'birth_certificate',
      name_en: 'Birth Certificate Registration',
      name_te: 'జనన ధ్రువీకరణ పత్రం (జనన నమోదు)',
      desc_en: 'Official Gram Panchayat birth certificate registration with permanent digital records.',
      desc_te: 'గ్రామ పంచాయతీ అధికారిక జనన నమోదు మరియు డిజిటల్ సంతకం చేసిన జనన పత్రం.',
      sla: 7,
      department_en: 'Panchayat Raj & Health (పంచాయతీ రాజ్ & వైద్య విభాగం)',
      icon: Baby,
      fee: '₹30'
    },
    {
      id: 'death_certificate',
      name_en: 'Death Certificate Registration',
      name_te: 'మరణ ధ్రువీకరణ పత్రం (మరణ నమోదు)',
      desc_en: 'Statutory death registration for family pension claims, insurance settlement, and inheritance.',
      desc_te: 'కుటుంబ పింఛను, జీవిత బీమా మరియు ఆస్తి బదిలీ కొరకు మరణ ధ్రువీకరణ పత్రం.',
      sla: 7,
      department_en: 'Panchayat Raj Department (పంచాయతీ రాజ్ విభాగం)',
      icon: FileText,
      fee: '₹30'
    },
    {
      id: 'residence_certificate',
      name_en: 'Residence / Nativity Certificate',
      name_te: 'నివాస ధ్రువీకరణ పత్రం (స్థానికత)',
      desc_en: 'Proof of continuous residence within Paderu Agency Scheduled Area for educational & local employment quotas.',
      desc_te: 'పాడేరు ఏజెన్సీ పరిధిలో స్థానిక నివాసి అని ధ్రువీకరించే అధికారిక నివాస పత్రం.',
      sla: 7,
      department_en: 'Revenue & ITDA (రెవెన్యూ & ఐటీడీఏ)',
      icon: Building,
      fee: '₹35'
    }
  ];

  const currentServiceMeta = serviceCatalog.find(s => s.id === selectedService) || serviceCatalog[0];

  const handleFieldChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!declarationChecked) {
      setSubmitError(lang === 'te' ? 'దయచేసి నిబంధనలను అంగీకరిస్తూ డిక్లరేషన్ చెక్ చేయండి.' : 'Please confirm the self-declaration checkbox before submitting.');
      return;
    }

    if (!applicantName || !applicantPhone || !localityId || !doorNumber) {
      setSubmitError(lang === 'te' ? 'దయచేసి అన్ని అవసరమైన వివరాలను పూరించండి.' : 'Please provide all required applicant details.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        service_type: selectedService,
        service_name_en: currentServiceMeta.name_en,
        service_name_te: currentServiceMeta.name_te,
        applicant_name: applicantName,
        applicant_phone: applicantPhone,
        applicant_aadhaar_masked: applicantAadhaar,
        locality_id: localityId,
        door_number: doorNumber,
        form_data: formData,
        sla_days: currentServiceMeta.sla
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitSuccess({
        application_no: data.application_no,
        applicant_name: applicantName,
        applicant_phone: data.applicant_phone,
        service_name_en: currentServiceMeta.name_en,
        service_name_te: currentServiceMeta.name_te,
        sla_days: currentServiceMeta.sla,
        submitted_at: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
      setFormStep(1);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!trackAppNo) {
      setTrackError(lang === 'te' ? 'దయచేసి దరఖాస్తు సంఖ్యను నమోదు చేయండి.' : 'Please enter Application Reference Number.');
      return;
    }

    setTrackingLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await fetch('/api/applications/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_no: trackAppNo.trim(),
          applicant_phone: trackPhone.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to locate application.');
      }

      setTrackResult(data);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  const openDigitalCertificate = (app) => {
    setCertificateData(app);
    setShowCertificateModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={13} /> Approved / సర్టిఫికెట్ సిద్ధం</span>;
      case 'Field Inspection':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> Field Inspection / క్షేత్ర పరిశీలన</span>;
      case 'Under Verification':
        return <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> Under Verification / పరిశీలనలో ఉంది</span>;
      case 'Rejected':
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={13} /> Rejected / తిరస్కరించబడింది</span>;
      default:
        return <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> Submitted / స్వీకరించబడింది</span>;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '85vh', paddingBottom: '3.5rem' }}>
      {/* 1. Header Banner */}
      <section style={{ backgroundColor: 'var(--primary-900)', color: '#ffffff', padding: '2.5rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.82rem', marginBottom: '0.85rem', color: '#6ee7b7' }}>
            <FileCheck size={15} />
            <span>{lang === 'te' ? 'ఆంధ్రప్రదేశ్ గ్రామ సచివాలయం • డిజిటల్ సిటిజన్ సర్వీసెస్' : 'Andhra Pradesh Grama Sachivalayam • Digital Citizen Services'}</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            {lang === 'te' ? 'ధ్రువీకరణ పత్రాలు & సేవలకు ఆన్‌లైన్ దరఖాస్తు' : 'Online Citizen Services & Certificate Application'}
          </h1>
          <p style={{ color: 'var(--slate-300)', maxWidth: '750px', fontSize: '1rem', lineHeight: '1.6' }}>
            {lang === 'te'
              ? 'ఆదాయ, కుల, జనన, మరణ మరియు కుళాయి కనెక్షన్ సర్టిఫికెట్ల కోసం ఇంటి నుంచే సులభంగా దరఖాస్తు చేసుకోండి. అక్నాలెడ్జ్‌మెంట్ రశీదు మరియు డిజిటల్ సర్టిఫికెట్ తక్షణమే డౌన్‌లోడ్ చేసుకోండి.'
              : 'Submit statutory certificate and utility connection applications directly to Paderu Grama Sachivalayam with transparent tracking and digital certificate issuance.'}
          </p>

          {/* Tab Navigation Switches */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
            <button
              onClick={() => setActiveTab('apply')}
              style={{
                backgroundColor: activeTab === 'apply' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'apply' ? 'var(--primary-950)' : '#ffffff',
                border: 'none',
                padding: '0.65rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={16} />
              <span>{lang === 'te' ? 'నూతన దరఖాస్తు చేయండి' : 'Apply for New Service'}</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              style={{
                backgroundColor: activeTab === 'track' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'track' ? 'var(--primary-950)' : '#ffffff',
                border: 'none',
                padding: '0.65rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Search size={16} />
              <span>{lang === 'te' ? 'దరఖాస్తు స్థితి & సర్టిఫికెట్ డౌన్‌లోడ్' : 'Track Application & Download'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Content Body */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {activeTab === 'apply' ? (
          <div>
            {/* Step 1: Select Service Catalog */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                {lang === 'te' ? '1. మీకు అవసరమైన సేవను ఎంచుకోండి' : '1. Select the Required Service / Certificate'}
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                {lang === 'te' ? 'సేవను ఎంచుకున్న తరువాత కింద ఉన్న దరఖాస్తు ఫారమ్‌ను పూరించండి.' : 'Select a service below to configure the citizen application form.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {serviceCatalog.map((service) => {
                  const isSelected = selectedService === service.id;
                  const IconComp = service.icon;

                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service.id);
                        setSubmitSuccess(null);
                        setSubmitError('');
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 10px 25px -5px rgba(5, 150, 105, 0.15)' : 'var(--shadow-sm)',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--primary-600)' }}>
                          <CheckCircle2 size={20} />
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                        <div style={{
                          backgroundColor: isSelected ? 'var(--primary-100)' : 'var(--slate-100)',
                          color: isSelected ? 'var(--primary-800)' : 'var(--slate-700)',
                          padding: '0.6rem',
                          borderRadius: 'var(--radius-md)'
                        }}>
                          <IconComp size={22} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                            {lang === 'te' ? service.name_te : service.name_en}
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                            {service.department_en}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: '1.5', marginBottom: '0.85rem' }}>
                        {lang === 'te' ? service.desc_te : service.desc_en}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', borderTop: '1px solid var(--slate-100)', paddingTop: '0.65rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                          <Clock size={13} />
                          {lang === 'te' ? `పరిష్కార గడువు: ${service.sla} రోజులు` : `SLA: ${service.sla} Days`}
                        </span>
                        <span style={{ color: 'var(--slate-500)', fontWeight: 500 }}>
                          {service.fee}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Application Form Container */}
            <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'te' ? 'దరఖాస్తు ఫారమ్ • పాడేరు సచివాలయం' : 'Citizen Application Form • Paderu Sachivalayam'}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {lang === 'te' ? currentServiceMeta.name_te : currentServiceMeta.name_en}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-50)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)', color: 'var(--primary-800)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Clock size={15} />
                  <span>{lang === 'te' ? `ప్రభుత్వ నిర్ణీత గడువు: ${currentServiceMeta.sla} పని దినాలు` : `Citizen Charter SLA: ${currentServiceMeta.sla} Working Days`}</span>
                </div>
              </div>

              {submitError && (
                <div style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess ? (
                /* Application Success Receipt Box */
                <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #86efac', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#14532d', marginBottom: '0.35rem' }}>
                    {lang === 'te' ? 'దరఖాస్తు విజయవంతంగా స్వీకరించబడింది!' : 'Application Successfully Submitted!'}
                  </h3>
                  <p style={{ color: '#166534', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '550px', marginInline: 'auto' }}>
                    {lang === 'te'
                      ? 'మీ దరఖాస్తు గ్రామ సచివాలయ డిజిటల్ రిజిస్టర్‌లో నమోదైంది. సంబంధిత అధికారి పరిశీలన పూర్తి చేసి నిర్ణీత గడువులోగా సర్టిఫికెట్ జారీ చేస్తారు.'
                      : 'Your request has been forwarded to the Village Revenue Officer & Digital Assistant. Retain your Application Reference Number below.'}
                  </p>

                  <div style={{ backgroundColor: '#ffffff', border: '1px dashed #22c55e', borderRadius: 'var(--radius-md)', padding: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>Application Ref No:</span>
                      <strong style={{ color: 'var(--primary-800)', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{submitSuccess.application_no}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Applicant:</span>
                      <span style={{ fontWeight: 600 }}>{submitSuccess.applicant_name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Service:</span>
                      <span style={{ fontWeight: 600 }}>{lang === 'te' ? submitSuccess.service_name_te : submitSuccess.service_name_en}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Submission Date:</span>
                      <span>{submitSuccess.submitted_at}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Expected Resolution:</span>
                      <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>Within {submitSuccess.sla_days} Days</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => window.print()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Printer size={16} />
                      <span>{lang === 'te' ? 'రశీదు ప్రింట్ చేయండి' : 'Print Acknowledgment'}</span>
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setTrackAppNo(submitSuccess.application_no);
                        setTrackPhone(submitSuccess.applicant_phone);
                        setActiveTab('track');
                        handleTrackSubmit();
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Search size={16} />
                      <span>{lang === 'te' ? 'ఇప్పుడే స్థితిని ట్రాక్ చేయండి' : 'Track This Application'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit}>
                  {/* Part A: Applicant Details */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                      <UserCheck size={18} color="var(--primary-700)" />
                      <span>{lang === 'te' ? 'ఎ. దరఖాస్తుదారు ప్రాథమిక వివరాలు' : 'A. Applicant Personal Information'}</span>
                    </h4>

                    <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {lang === 'te' ? 'దరఖాస్తుదారు పూర్తి పేరు *' : 'Full Name of Applicant *'}
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="e.g. K. Somanna Dora"
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {lang === 'te' ? 'మొబైల్ సంఖ్య (10 అంకెలు) *' : '10-Digit Mobile Number *'}
                        </label>
                        <input
                          type="tel"
                          className="form-input"
                          required
                          maxLength="10"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="e.g. 9848011223"
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {lang === 'te' ? 'ఆధార్ సంఖ్య (రక్షిత నమూనా)' : 'Aadhaar (Masked)'}
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={applicantAadhaar}
                          onChange={(e) => setApplicantAadhaar(e.target.value)}
                          placeholder="XXXX-XXXX-4512"
                        />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: '1rem' }}>
                      <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {lang === 'te' ? 'పాడేరు వార్డు / ప్రాంతం *' : 'Locality / Ward in Paderu *'}
                        </label>
                        <select
                          className="form-select"
                          value={localityId}
                          onChange={(e) => setLocalityId(e.target.value)}
                        >
                          {localities.length > 0 ? (
                            localities.map(l => (
                              <option key={l.id} value={l.id}>
                                Ward {l.ward_number}: {lang === 'te' ? l.name_te : l.name_en}
                              </option>
                            ))
                          ) : (
                            <option value="1">Ward 1: Modakondamma Temple Colony</option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {lang === 'te' ? 'ఇంటి నంబరు (డోర్ నంబర్) *' : 'Door / House Number *'}
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={doorNumber}
                          onChange={(e) => setDoorNumber(e.target.value)}
                          placeholder="e.g. 1-24/A or 3-45/B"
                        />
                      </div>
                    </div>
                  </div>

                    {/* Part B: Dynamic Service Fields */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                        <FileText size={18} color="var(--primary-700)" />
                        <span>{lang === 'te' ? `బి. ${currentServiceMeta.name_te} వివరాలు` : `B. Service Specific Parameters`}</span>
                      </h4>

                      {/* 0. NTR Bharosa Social Security Pension Fields */}
                      {selectedService === 'pension_scheme' && (
                        <div>
                          <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#be123c', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                              <Heart size={16} fill="#e11d48" color="#e11d48" />
                              <span>{lang === 'te' ? 'ఎన్టీఆర్ భరోసా సామాజిక పింఛను దరఖాస్తు నిబంధనలు' : 'NTR Bharosa Social Security Pension - Statutory Application'}</span>
                            </div>
                            <p style={{ fontSize: '0.825rem', color: '#881337', margin: 0, lineHeight: '1.5' }}>
                              {lang === 'te'
                                ? 'ఈ దరఖాస్తును సమర్పించిన తర్వాత 21 రోజులలో సచివాలయ సంక్షేమ అసిస్టెంట్ (WEA) & వీఆర్వో వారి క్షేత్రస్థాయి విచారణ, గ్రామసభ ఆడిట్ మరియు ఎంపీడీవో ఆమోదం అనంతరం మంజూరు ఉత్తర్వులు జారీ చేయబడతాయి. ప్రతినెలా 1వ తేదీనే డోర్‌స్టెప్ బయోమెట్రిక్ ద్వారా నగదు అందజేయబడుతుంది.'
                                : 'Upon submission, this application is subject to 21-day statutory verification by WEA and VRO, public display in Gram Sabha social audit, and MPDO final sanction. Doorstep biometric cash delivery commences on 1st of the month.'}
                            </p>
                          </div>

                          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'పింఛను వర్గం (కేటగిరీ) *' : 'Pension Category & Monthly Allowance *'}
                              </label>
                              <select
                                className="form-select"
                                value={formData.pension_category}
                                onChange={(e) => handleFieldChange('pension_category', e.target.value)}
                              >
                                <option value="Old Age Pension (OAP / వృద్ధాప్య పింఛను - ₹4,000/mo)">Old Age Pension (OAP / వృద్ధాప్య పింఛను - ₹4,000/mo [Age: 60+])</option>
                                <option value="Widow Pension (వితంతు పింఛను - ₹4,000/mo)">Widow Pension (వితంతు పింఛను - ₹4,000/mo [Age: 18+])</option>
                                <option value="Persons with Disabilities (దివ్యాంగుల పింఛను - ₹6,000/mo)">Persons with Disabilities / Divyangjan (దివ్యాంగులు - ₹6,000/mo [40-79% SADAREM])</option>
                                <option value="Severe Disability / Bedridden (తీవ్ర వైకల్యం - ₹15,000/mo)">Severe Disability / Bedridden (తీవ్ర వైకల్యం / మంచానికే పరిమితం - ₹15,000/mo [80%+])</option>
                                <option value="Chronic Kidney Disease / Dialysis (డయాలసిస్ రోగులు - ₹10,000/mo)">Chronic Kidney Disease / Dialysis (డయాలసిస్ రోగులు - ₹10,000/mo)</option>
                                <option value="Weavers & Handloom (చేనేత కార్మికుల పింఛను - ₹4,000/mo)">Weavers & Handloom Artisans (చేనేత కార్మికులు - ₹4,000/mo [Age: 50+])</option>
                                <option value="Toddy Tappers (కల్లుగీత కార్మికుల పింఛను - ₹4,000/mo)">Toddy Tappers (కల్లుగీత కార్మికులు - ₹4,000/mo [Age: 50+])</option>
                                <option value="Single Women & Destitute (ఒంటరి మహిళల పింఛను - ₹4,000/mo)">Single Women & Destitute (ఒంటరి మహిళలు - ₹4,000/mo [Age: 35+ Rural])</option>
                                <option value="Dappu Artists (డప్పు కళాకారుల పింఛను - ₹4,000/mo)">Dappu Artists (డప్పు కళాకారులు - ₹4,000/mo [Age: 50+])</option>
                                <option value="Fishermen Pension (మత్స్యకారుల పింఛను - ₹4,000/mo)">Fishermen Pension (మత్స్యకారుల పింఛను - ₹4,000/mo [Age: 50+])</option>
                                <option value="Traditional Artistes (వృద్ధ కళాకారుల పింఛను - ₹4,000/mo)">Traditional Artistes (వృద్ధ కళాకారుల పింఛను - ₹4,000/mo [Age: 50+])</option>
                                <option value="Transgender Persons (ట్రాన్స్‌జెండర్ పింఛను - ₹4,000/mo)">Transgender Persons (ట్రాన్స్‌జెండర్ పింఛను - ₹4,000/mo [Age: 18+])</option>
                              </select>
                            </div>

                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'పుట్టిన తేదీ (DOB) *' : 'Date of Birth *'}
                              </label>
                              <input
                                type="date"
                                className="form-input"
                                required
                                value={formData.applicant_dob}
                                onChange={(e) => handleFieldChange('applicant_dob', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'వయస్సు (సంవత్సరాలు) *' : 'Age of Applicant (Years) *'}
                              </label>
                              <input
                                type="number"
                                className="form-input"
                                required
                                value={formData.applicant_age}
                                onChange={(e) => handleFieldChange('applicant_age', e.target.value)}
                                placeholder="e.g. 64"
                              />
                            </div>

                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'బియ్యం కార్డు (రైస్ కార్డు సంఖ్య) *' : 'Rice Card (White Ration Card) *'}
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                required
                                value={formData.pension_rice_card}
                                onChange={(e) => handleFieldChange('pension_rice_card', e.target.value)}
                                placeholder="e.g. WAP0318920112"
                              />
                            </div>

                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'సదరెం సంఖ్య (దివ్యాంగులైతే)' : 'SADAREM ID (For Divyangjan)'}
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                value={formData.sadarem_id}
                                onChange={(e) => handleFieldChange('sadarem_id', e.target.value)}
                                placeholder="e.g. SAD-AP-2026-9041"
                              />
                            </div>
                          </div>

                          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'బ్యాంకు ఖాతా సంఖ్య *' : 'Bank Account Number *'}
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                required
                                value={formData.bank_account_number}
                                onChange={(e) => handleFieldChange('bank_account_number', e.target.value)}
                                placeholder="e.g. 30481010045231"
                              />
                            </div>

                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'బ్యాంకు IFSC కోడ్ *' : 'Bank IFSC Code *'}
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                required
                                value={formData.bank_ifsc}
                                onChange={(e) => handleFieldChange('bank_ifsc', e.target.value)}
                                placeholder="e.g. SBIN0001854"
                              />
                            </div>

                            <div>
                              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {lang === 'te' ? 'బ్యాంకు & బ్రాంచ్ పేరు' : 'Bank & Branch Name'}
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                value={formData.bank_name}
                                onChange={(e) => handleFieldChange('bank_name', e.target.value)}
                                placeholder="State Bank of India, Paderu"
                              />
                            </div>
                          </div>

                          {/* 6-Filter Parameters Self-Declaration */}
                          <div style={{ backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--slate-200)' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-800)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                              {lang === 'te' ? 'అధికారిక 6-ఫిల్టర్ల అర్హత నిర్ధారణ వివరాలు:' : 'Official 6-Filter Criteria Declarations:'}
                            </div>
                            <div className="grid-4" style={{ gap: '0.75rem' }}>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>{lang === 'te' ? 'మాగాణి భూమి (ఎకరాలు)' : 'Wetland (Acres)'}</label>
                                <input type="number" step="0.1" className="form-input" value={formData.land_wetland_acres} onChange={(e) => handleFieldChange('land_wetland_acres', e.target.value)} />
                              </div>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>{lang === 'te' ? 'మెట్ట భూమి (ఎకరాలు)' : 'Dryland (Acres)'}</label>
                                <input type="number" step="0.1" className="form-input" value={formData.land_dryland_acres} onChange={(e) => handleFieldChange('land_dryland_acres', e.target.value)} />
                              </div>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>{lang === 'te' ? 'నెలవారీ విద్యుత్ (యూనిట్లు)' : 'Monthly Power Units'}</label>
                                <input type="number" className="form-input" value={formData.monthly_power_units} onChange={(e) => handleFieldChange('monthly_power_units', e.target.value)} />
                              </div>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>{lang === 'te' ? '4-చక్రాల కారు ఉందా?' : 'Owns 4-Wheeler?'}</label>
                                <select className="form-select" value={formData.four_wheeler_owned} onChange={(e) => handleFieldChange('four_wheeler_owned', e.target.value)}>
                                  <option value="No">No / లేదు (Eligible)</option>
                                  <option value="Taxi / Tractor Only">Taxi/Tractor Only (Exempt)</option>
                                  <option value="Yes">Yes (Car/SUV)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 1. Income Certificate Fields */}
                      {selectedService === 'income_certificate' && (
                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'వార్షిక కుటుంబ ఆదాయం (రూపాయలలో) *' : 'Annual Household Income (₹) *'}
                          </label>
                          <input
                            type="number"
                            className="form-input"
                            required
                            value={formData.annual_income}
                            onChange={(e) => handleFieldChange('annual_income', e.target.value)}
                            placeholder="e.g. 60000"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'ఆదాయ వనరు *' : 'Primary Source of Income *'}
                          </label>
                          <select
                            className="form-select"
                            value={formData.income_source}
                            onChange={(e) => handleFieldChange('income_source', e.target.value)}
                          >
                            <option value="Organic Coffee Farming (కాఫీ తోటల సాగు)">Organic Coffee & Pepper Farming (కాఫీ & మిరియాల సాగు)</option>
                            <option value="Agricultural Labor (వ్యవసాయ కూలీ)">Agricultural Labor (వ్యవసాయ కూలీ)</option>
                            <option value="Small Business / Shop (చిరు వ్యాపారం)">Small Village Enterprise / Retail (చిరు వ్యాపారం)</option>
                            <option value="Private Employment (ప్రైవేట్ ఉద్యోగం)">Private Sector Employment (ప్రైవేట్ ఉద్యోగం)</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'రేషన్ కార్డు సంఖ్య' : 'Ration Card Number (Rice Card)'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.ration_card_number}
                            onChange={(e) => handleFieldChange('ration_card_number', e.target.value)}
                            placeholder="e.g. WAP0318920112"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'తండ్రి / భర్త పేరు *' : "Father's / Husband's Name *"}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.father_or_spouse_name}
                            onChange={(e) => handleFieldChange('father_or_spouse_name', e.target.value)}
                            placeholder="e.g. K. Subba Rao Dora"
                          />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'సర్టిఫికెట్ అవసరం / ఉద్దేశం *' : 'Purpose of Income Certificate *'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.purpose}
                            onChange={(e) => handleFieldChange('purpose', e.target.value)}
                            placeholder="e.g. Jagananna Vidya Deevena, Tribal Welfare Hostel Admission, Scholarship"
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. Caste Certificate Fields */}
                    {selectedService === 'caste_certificate' && (
                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'కుల వర్గం *' : 'Social Category *'}
                          </label>
                          <select
                            className="form-select"
                            value={formData.community_category}
                            onChange={(e) => handleFieldChange('community_category', e.target.value)}
                          >
                            <option value="ST (Scheduled Tribe / అనుసూచిత తెగ)">ST (Scheduled Tribe / గిరిజన తెగ)</option>
                            <option value="SC (Scheduled Caste / షెడ్యూల్డ్ కులం)">SC (Scheduled Caste / షెడ్యూల్డ్ కులం)</option>
                            <option value="BC (Backward Classes / వెనుకబడిన తరగతి)">BC (Backward Classes / వెనుకబడిన తరగతి)</option>
                            <option value="OC / General">OC / General</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'ఉప-తెగ / ఉప-కులం *' : 'Sub-Tribe / Sub-Caste Name *'}
                          </label>
                          <select
                            className="form-select"
                            value={formData.sub_caste}
                            onChange={(e) => handleFieldChange('sub_caste', e.target.value)}
                          >
                            <option value="Konda Dora (కొండ దొర)">Konda Dora (కొండ దొర)</option>
                            <option value="Bagata (భగత)">Bagata (భగత)</option>
                            <option value="Valmiki (వాల్మీకి)">Valmiki (వాల్మీకి)</option>
                            <option value="Gadaba (గదబ)">Gadaba (గదబ)</option>
                            <option value="Kondh / Porja (కొంధ్ / పోర్జ)">Kondh / Porja (కొంధ్ / పోర్జ)</option>
                            <option value="Other Tribe / Community">Other Tribe / Community</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'తండ్రి కులం' : "Father's Caste"}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.father_caste}
                            onChange={(e) => handleFieldChange('father_caste', e.target.value)}
                          />
                        </div>

                        <div style={{ gridColumn: 'span 3' }}>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'ధ్రువీకరణ పత్రం ఉద్దేశం *' : 'Certificate Requirement / Purpose *'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.purpose}
                            onChange={(e) => handleFieldChange('purpose', e.target.value)}
                            placeholder="e.g. APPSC Recruitment, ITDA Special DSC, University Seat"
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. Tap Water Connection Fields */}
                    {selectedService === 'water_connection' && (
                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'కనెక్షన్ రకం *' : 'Connection Classification *'}
                          </label>
                          <select
                            className="form-select"
                            value={formData.connection_type}
                            onChange={(e) => handleFieldChange('connection_type', e.target.value)}
                          >
                            <option value="Residential Domestic (గృహావసరాలు)">Residential Domestic (గృహావసరాలు - ₹100/mo)</option>
                            <option value="Non-Domestic / Commercial">Non-Domestic / Commercial (వాణిజ్యం - ₹300/mo)</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'ఇంటి పన్ను అసెస్మెంట్ సంఖ్య' : 'House Tax Assessment Number'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.assessment_number}
                            onChange={(e) => handleFieldChange('assessment_number', e.target.value)}
                            placeholder="e.g. PAD-TAX-1001"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'ప్రధాన పైపులైనుకు దూరం (మీటర్లలో)' : 'Distance to Pipeline (Meters)'}
                          </label>
                          <input
                            type="number"
                            className="form-input"
                            value={formData.pipeline_distance_meters}
                            onChange={(e) => handleFieldChange('pipeline_distance_meters', e.target.value)}
                            placeholder="e.g. 10"
                          />
                        </div>
                      </div>
                    )}

                    {/* 4. Birth Registration Fields */}
                    {selectedService === 'birth_certificate' && (
                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'శిశువు పేరు *' : "Child's Full Name *"}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.child_name}
                            onChange={(e) => handleFieldChange('child_name', e.target.value)}
                            placeholder="e.g. K. Sai Kiran"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'లింగం *' : 'Gender *'}
                          </label>
                          <select
                            className="form-select"
                            value={formData.child_gender}
                            onChange={(e) => handleFieldChange('child_gender', e.target.value)}
                          >
                            <option value="Male">Male / బాలుడు</option>
                            <option value="Female">Female / బాలిక</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'జన్మించిన తేదీ *' : 'Date of Birth *'}
                          </label>
                          <input
                            type="date"
                            className="form-input"
                            required
                            value={formData.date_of_birth}
                            onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'తల్లి పూర్తి పేరు *' : "Mother's Full Name *"}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.mother_name}
                            onChange={(e) => handleFieldChange('mother_name', e.target.value)}
                            placeholder="e.g. K. Parvathi"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'తండ్రి పూర్తి పేరు *' : "Father's Full Name *"}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.father_name}
                            onChange={(e) => handleFieldChange('father_name', e.target.value)}
                            placeholder="e.g. K. Somanna Dora"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'జన్మించిన ప్రదేశం *' : 'Hospital / Place of Birth *'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.place_of_birth}
                            onChange={(e) => handleFieldChange('place_of_birth', e.target.value)}
                            placeholder="Paderu District Area Hospital"
                          />
                        </div>
                      </div>
                    )}

                    {/* 5. Death Registration Fields */}
                    {selectedService === 'death_certificate' && (
                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'మరణించిన వారి పేరు *' : 'Full Name of Deceased *'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.deceased_name}
                            onChange={(e) => handleFieldChange('deceased_name', e.target.value)}
                            placeholder="e.g. Late K. Ramanna Dora"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'మరణించిన తేదీ *' : 'Date of Death *'}
                          </label>
                          <input
                            type="date"
                            className="form-input"
                            required
                            value={formData.date_of_death}
                            onChange={(e) => handleFieldChange('date_of_death', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'మరణ సమయంలో వయస్సు' : 'Age at Death'}
                          </label>
                          <input
                            type="number"
                            className="form-input"
                            value={formData.age_at_death}
                            onChange={(e) => handleFieldChange('age_at_death', e.target.value)}
                            placeholder="e.g. 68"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'మరణానికి కారణం' : 'Cause of Death'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.cause_of_death}
                            onChange={(e) => handleFieldChange('cause_of_death', e.target.value)}
                            placeholder="Natural causes / Age related"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'సమాచారం ఇచ్చిన వారి పేరు' : "Informant's Name"}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.informant_name}
                            onChange={(e) => handleFieldChange('informant_name', e.target.value)}
                            placeholder="e.g. K. Somanna Dora"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'సంబంధం (రిలేషన్)' : 'Relationship to Deceased'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.informant_relation}
                            onChange={(e) => handleFieldChange('informant_relation', e.target.value)}
                            placeholder="Son / Daughter / Spouse"
                          />
                        </div>
                      </div>
                    )}

                    {/* 6. Residence Certificate Fields */}
                    {selectedService === 'residence_certificate' && (
                      <div className="grid-3" style={{ gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'పాడేరులో నివసిస్తున్న కాలం (సంవత్సరాలు) *' : 'Duration of Stay in Paderu (Years) *'}
                          </label>
                          <input
                            type="number"
                            className="form-input"
                            required
                            defaultValue="22"
                            placeholder="e.g. 15"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'విద్యుత్ మీటర్ సర్వీస్ సంఖ్య' : 'Electricity Service Consumer No.'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 1124-5002-91"
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {lang === 'te' ? 'సర్టిఫికెట్ ఉద్దేశం *' : 'Purpose *'}
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            defaultValue="Local Agency Scheduled Area Residential Proof"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part C: Declaration & Submit */}
                  <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={declarationChecked}
                        onChange={(e) => setDeclarationChecked(e.target.checked)}
                        style={{ marginTop: '0.2rem', width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: '1.5' }}>
                        <strong>{lang === 'te' ? 'స్వీయ ధ్రువీకరణ డిక్లరేషన్:' : 'Citizen Self-Declaration:'}</strong>{' '}
                        {lang === 'te'
                          ? 'ఈ దరఖాస్తులో నేను అందించిన వివరాలన్నీ నా పరిజ్ఞానం మేరకు పూర్తిగా సత్యమైనవని ధ్రువీకరిస్తున్నాను. ఏదైనా తప్పుడు సమాచారం ఉన్నట్లయితే చట్టపరమైన చర్యలకు బాధ్యుడను అవుతాను.'
                          : 'I hereby declare that all particulars furnished above are true and correct to the best of my knowledge and belief. I agree to field verification by the Village Revenue Officer / Sachivalayam staff.'}
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setApplicantName('');
                        setSubmitError('');
                      }}
                    >
                      {lang === 'te' ? 'క్లియర్ చేయండి' : 'Reset Form'}
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{ minWidth: '180px' }}
                    >
                      {submitting ? (
                        <span>{lang === 'te' ? 'సమర్పిస్తోంది...' : 'Submitting...'}</span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle2 size={16} />
                          {lang === 'te' ? 'దరఖాస్తు సమర్పించండి' : 'Submit Application'}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Tab 2: Track Status & Digital Certificate View */
          <div>
            <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                  {lang === 'te' ? 'దరఖాస్తు స్థితి పరిశీలన & డిజిటల్ సర్టిఫికెట్' : 'Two-Factor Application Tracking & Certificate Download'}
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                  {lang === 'te'
                    ? 'గోప్యతా రక్షణ కొరకు దరఖాస్తు సంఖ్యతో పాటు నమోదిత 10-అంకెల మొబైల్ సంఖ్యను నమోదు చేయండి.'
                    : 'To protect citizen privacy, two-factor authentication (Application Ref + Mobile Number) is enforced.'}
                </p>
              </div>

              {/* Demo Pre-fill Chips for quick tester evaluation */}
              <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                  {lang === 'te' ? 'నమూనా పరీక్ష కోసం క్లిక్ చేయండి:' : 'Quick Demo Test Cases:'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setTrackAppNo('APP-2026-3041');
                    setTrackPhone('9848011223');
                  }}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  APP-2026-3041 (Income - Approved & Ready)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrackAppNo('APP-2026-3085');
                    setTrackPhone('9440112233');
                  }}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  APP-2026-3085 (Water - Field Inspection)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrackAppNo('APP-2026-3120');
                    setTrackPhone('9123456789');
                  }}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  APP-2026-3120 (Caste - Under Verification)
                </button>
              </div>

              <form onSubmit={handleTrackSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto', gap: '1rem', alignItems: 'flex-end' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {lang === 'te' ? 'దరఖాస్తు సంఖ్య (Application No) *' : 'Application Reference Number *'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={trackAppNo}
                    onChange={(e) => setTrackAppNo(e.target.value)}
                    placeholder="e.g. APP-2026-3041"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {lang === 'te' ? 'నమోదిత మొబైల్ సంఖ్య *' : 'Registered 10-Digit Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    maxLength="10"
                    value={trackPhone}
                    onChange={(e) => setTrackPhone(e.target.value)}
                    placeholder="e.g. 9848011223"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={trackingLoading}
                  style={{ minWidth: '150px' }}
                >
                  {trackingLoading ? (
                    <span>{lang === 'te' ? 'వెతుకుతోంది...' : 'Searching...'}</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Search size={16} />
                      {lang === 'te' ? 'పరిశీలించండి' : 'Track Status'}
                    </span>
                  )}
                </button>
              </form>

              {trackError && (
                <div style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <AlertCircle size={18} />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Tracking Result View */}
            {trackResult && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-lg)' }}>
                {/* Status Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        {trackResult.application.application_no}
                      </h3>
                      {getStatusBadge(trackResult.application.status)}
                    </div>
                    <div style={{ color: 'var(--slate-600)', fontSize: '0.95rem', fontWeight: 600 }}>
                      {lang === 'te' ? trackResult.application.service_name_te : trackResult.application.service_name_en}
                    </div>
                  </div>

                  {trackResult.application.status === 'Approved' && trackResult.application.certificate_issued_no && (
                    <button
                      className="btn btn-primary"
                      onClick={() => openDigitalCertificate(trackResult.application)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#059669' }}
                    >
                      <Award size={18} />
                      <span>{lang === 'te' ? 'డిజిటల్ సర్టిఫికెట్ చూడండి & ముద్రించండి' : 'View & Print Digital Certificate'}</span>
                    </button>
                  )}
                </div>

                {/* Stepper Progress Bar */}
                <div style={{ margin: '1.5rem 0 2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', position: 'relative' }}>
                    {/* Connecting line */}
                    <div style={{
                      position: 'absolute',
                      top: '18px',
                      left: '12%',
                      right: '12%',
                      height: '3px',
                      backgroundColor: 'var(--slate-200)',
                      zIndex: 1
                    }} />

                    {/* Step 1: Submitted */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 700 }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>1. Submitted</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>దరఖాస్తు స్వీకరణ</div>
                    </div>

                    {/* Step 2: Under Verification */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: ['Under Verification', 'Field Inspection', 'Approved'].includes(trackResult.application.status) ? 'var(--primary-600)' : 'var(--slate-300)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.5rem',
                        fontWeight: 700
                      }}>
                        {['Field Inspection', 'Approved'].includes(trackResult.application.status) ? <CheckCircle2 size={20} /> : 2}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>2. Verification</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>వి.ఆర్.ఓ పరిశీలన</div>
                    </div>

                    {/* Step 3: Field Inspection */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: ['Field Inspection', 'Approved'].includes(trackResult.application.status) ? 'var(--primary-600)' : 'var(--slate-300)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.5rem',
                        fontWeight: 700
                      }}>
                        {trackResult.application.status === 'Approved' ? <CheckCircle2 size={20} /> : 3}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>3. Field Enquiry</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>క్షేత్ర విచారణ</div>
                    </div>

                    {/* Step 4: Approved & Certificate */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: trackResult.application.status === 'Approved' ? '#059669' : trackResult.application.status === 'Rejected' ? '#dc2626' : 'var(--slate-300)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.5rem',
                        fontWeight: 700
                      }}>
                        {trackResult.application.status === 'Approved' ? <Award size={20} /> : 4}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {trackResult.application.status === 'Rejected' ? 'Rejected' : '4. Certificate Ready'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>సర్టిఫికెట్ జారీ</div>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
                      {lang === 'te' ? 'దరఖాస్తుదారు వివరాలు' : 'Applicant Metadata'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div><span style={{ color: 'var(--slate-500)' }}>Applicant:</span> <strong>{trackResult.application.applicant_name}</strong></div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Phone:</span> {trackResult.application.applicant_phone}</div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Ward / Locality:</span> Ward {trackResult.application.ward_number} - {lang === 'te' ? trackResult.application.locality_name_te : trackResult.application.locality_name_en}</div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Door No:</span> {trackResult.application.door_number}</div>
                      {trackResult.application.assigned_staff_name && (
                        <div><span style={{ color: 'var(--slate-500)' }}>Assigned Staff:</span> <strong style={{ color: 'var(--primary-700)' }}>{trackResult.application.assigned_staff_name}</strong></div>
                      )}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
                      {lang === 'te' ? 'సేవా పారామితులు' : 'Service Parameters Recorded'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                      {trackResult.application.form_data_parsed && Object.entries(trackResult.application.form_data_parsed).map(([key, value]) => (
                        <div key={key}>
                          <span style={{ color: 'var(--slate-500)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</span>{' '}
                          <strong>{String(value)}</strong>
                        </div>
                      ))}
                      {trackResult.application.staff_notes && (
                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--slate-200)', paddingTop: '0.5rem' }}>
                          <span style={{ color: 'var(--slate-500)' }}>Staff Inspection Notes:</span>
                          <p style={{ color: 'var(--slate-700)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                            "{trackResult.application.staff_notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Log */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={17} />
                    <span>{lang === 'te' ? 'పరిశీలన కాలక్రమం (టైమ్‌లైన్)' : 'Official Processing Timeline & Action Log'}</span>
                  </h4>

                  <div style={{ borderLeft: '2px solid var(--primary-300)', paddingLeft: '1.25rem', marginLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {trackResult.updates.map((update, index) => (
                      <div key={update.id} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          left: '-1.75rem',
                          top: '2px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: index === trackResult.updates.length - 1 ? 'var(--primary-600)' : 'var(--slate-400)',
                          border: '2px solid #ffffff'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>{update.status}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{update.created_at}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                          {update.notes}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                          Action by: {update.updated_by_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Official Digital Certificate Modal (Printable) */}
      {showCertificateModal && certificateData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '750px',
              width: '100%',
              padding: '2.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '6px double #065f46',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'var(--slate-100)',
                border: 'none',
                borderRadius: '50%',
                padding: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Official Certificate Design */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #065f46', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46', letterSpacing: '1px', textTransform: 'uppercase' }}>
                GOVERNMENT OF ANDHRA PRADESH • ఆంధ్రప్రదేశ్ ప్రభుత్వం
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-700)', marginTop: '0.2rem' }}>
                PACHAYAT RAJ & REVENUE DEPARTMENT • గ్రామ సచివాలయం, పాడేరు
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Alluri Sitharama Raju District (అల్లూరి సీతారామరాజు జిల్లా)
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#064e3b', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {certificateData.service_name_en}
              </h2>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#047857' }}>
                ({certificateData.service_name_te})
              </div>
            </div>

            {/* Certificate Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '1.5rem', backgroundColor: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ color: 'var(--slate-500)' }}>Certificate No:</span>{' '}
                <strong style={{ color: '#065f46' }}>{certificateData.certificate_issued_no}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)' }}>Application Ref:</span>{' '}
                <strong>{certificateData.application_no}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)' }}>Date of Issue:</span>{' '}
                <strong>{certificateData.verified_at ? certificateData.verified_at.split(' ')[0] : '2026-10-15'}</strong>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div style={{ fontSize: '0.92rem', lineHeight: '1.8', color: 'var(--slate-800)', marginBottom: '2rem', textAlign: 'justify' }}>
              <p style={{ marginBottom: '1rem' }}>
                This is to certify that <strong>{certificateData.applicant_name}</strong>, resident of Door No. <strong>{certificateData.door_number}</strong>,{' '}
                Ward No. <strong>{certificateData.ward_number}</strong> ({certificateData.locality_name_en}), Paderu Grama Sachivalayam, Paderu Mandal, Alluri Sitharama Raju District, Andhra Pradesh, has been verified in field enquiry and official Sachivalayam records.
              </p>

              {certificateData.form_data_parsed && (
                <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '0.5rem' }}>Certified Particulars:</div>
                  <div className="grid-2" style={{ gap: '0.5rem', fontSize: '0.85rem' }}>
                    {Object.entries(certificateData.form_data_parsed).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: 'var(--slate-500)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}:</span> <strong>{String(v)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p>
                The validity of this certificate has been registered on the AP Grama Sachivalayam statutory database and is valid for all official, welfare, and educational purposes.
              </p>
            </div>

            {/* Signature & Seal Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--slate-200)', paddingTop: '1.5rem' }}>
              <div style={{ textAlign: 'center', width: '120px' }}>
                {/* Simulated Verifiable QR Code */}
                <div style={{ width: '85px', height: '85px', backgroundColor: '#f1f5f9', border: '2px solid #065f46', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#065f46' }}>AP GOVT</div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--slate-600)' }}>VERIFIED QR</div>
                  <div style={{ fontSize: '0.5rem', color: 'var(--slate-400)' }}>PAD-2026</div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--slate-500)' }}>Scan to verify on AP Meeseva Portal</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#065f46', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                  DIGITALLY SIGNED
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                  Date: {certificateData.verified_at || '2026-10-15 16:30'} IST
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.5rem' }}>
                  Tahsildar / Panchayat Secretary
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  Paderu Mandal, ASR District
                </div>
              </div>
            </div>

            {/* Print and Close Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#059669' }}
              >
                <Printer size={16} />
                <span>Print Official Certificate</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowCertificateModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
