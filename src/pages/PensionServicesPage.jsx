import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Building,
  UserCheck,
  AlertCircle,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  PhoneCall,
  HelpCircle,
  Calculator,
  Award,
  Sparkles,
  Download
} from 'lucide-react';

export default function PensionServicesPage({ onNavigate }) {
  const { lang, t } = useLanguage();

  // Tabs: 'categories', 'checker', 'tracking', 'guidelines'
  const [activeTab, setActiveTab] = useState('categories');

  // Search State
  const [searchPensionId, setSearchPensionId] = useState('PEN-PAD-108');
  const [pensionResult, setPensionResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Interactive Eligibility Checker State
  const [checkerAge, setCheckerAge] = useState(62);
  const [checkerCategory, setCheckerCategory] = useState('oap');
  const [checkerLand, setCheckerLand] = useState('under_3'); // 'under_3', 'over_3'
  const [checkerPower, setCheckerPower] = useState('under_300'); // 'under_300', 'over_300'
  const [checkerVehicle, setCheckerVehicle] = useState('no'); // 'no', 'yes'
  const [checkerGovtEmp, setCheckerGovtEmp] = useState('no'); // 'no', 'yes'
  const [calcResult, setCalcResult] = useState(null);

  const pensionCategories = [
    {
      id: 'oap',
      name_en: 'Old Age Pension (OAP)',
      name_te: 'వృద్ధాప్య పింఛను (ఓఏపీ)',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '60+ Years',
      icon: Users,
      badge: 'Most Popular',
      desc_en: 'Monthly financial assistance for elderly citizens living below poverty line without regular income or family support.',
      desc_te: 'దారిద్య్రరేఖకు దిగువన ఉన్న 60 ఏళ్లు పైబడిన వృద్ధులకు గౌరవప్రదమైన జీవనం కోసం అందించే నెలవారీ భరోసా సహాయం.',
      eligibility_en: 'Age 60 years or above; White Ration Card; No family member in permanent government employment.',
      eligibility_te: '60 సంవత్సరాలు నిండి ఉండాలి; బియ్యం కార్డు కలిగి ఉండాలి; కుటుంబంలో ప్రభుత్వ ఉద్యోగులు ఉండరాదు.'
    },
    {
      id: 'widow',
      name_en: 'Widow Pension',
      name_te: 'వితంతు పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '18+ Years',
      icon: Heart,
      badge: 'Essential Welfare',
      desc_en: 'Sustenance pension for destitute widows to assist with children education and household security.',
      desc_te: 'భర్తను కోల్పోయి నిస్సహాయ స్థితిలో ఉన్న మహిళలకు గౌరవప్రదమైన జీవనం కొరకు అందించే నెలవారీ పింఛను.',
      eligibility_en: 'Age 18+; Husband Death Certificate issued by Panchayat/Municipality; White Ration Card.',
      eligibility_te: '18 ఏళ్లు పైబడి ఉండాలి; అధికారిక భర్త మరణ ధ్రువీకరణ పత్రం సమర్పించాలి; బియ్యం కార్డు తప్పనిసరి.'
    },
    {
      id: 'disability',
      name_en: 'Persons with Disabilities (Divyangjan)',
      name_te: 'దివ్యాంగుల పింఛను (సదరెం)',
      amount: '₹6,000 - ₹15,000',
      frequency: 'per month / నెలకు',
      age: 'No Age Limit',
      icon: Award,
      badge: 'Enhanced Scale',
      desc_en: 'Enhanced sustenance: ₹6,000/month for benchmark disability (40%–79%), and ₹15,000/month for severe (80%+) or bedridden individuals.',
      desc_te: '40% నుండి 79% వరకు వైకల్యం ఉన్నవారికి నెలకు ₹6,000, తీవ్రమైన వైకల్యం (80%+) లేదా మంచానికే పరిమితమైన వారికి నెలకు ₹15,000.',
      eligibility_en: 'Valid SADAREM medical board assessment certificate showing 40% or higher benchmark disability.',
      eligibility_te: 'వైద్య మండలి (సదరెం) ద్వారా జారీ చేసిన కనీసం 40% లేదా అంతకంటే ఎక్కువ వైకల్య ధ్రువీకరణ పత్రం.'
    },
    {
      id: 'weavers',
      name_en: 'Weavers & Handloom Artisans',
      name_te: 'చేనేత కార్మికుల పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '50+ Years',
      icon: Sparkles,
      badge: 'Artisan Support',
      desc_en: 'Support for traditional handloom workers and weavers registered with authorized cooperative societies.',
      desc_te: 'చేనేత సహకార సంఘాలలో నమోదైన సంప్రదాయ చేనేత వృత్తి కళాకారులకు 50 ఏళ్లు నిండిన తర్వాత అందించే పింఛను.',
      eligibility_en: 'Age 50+; Registered member of primary weavers cooperative society; Handloom worker proof.',
      eligibility_te: '50 ఏళ్లు నిండి ఉండాలి; చేనేత సహకార సంఘంలో సభ్యత్వం ధ్రువీకరణ పత్రం కలిగి ఉండాలి.'
    },
    {
      id: 'tappers',
      name_en: 'Toddy Tappers Pension',
      name_te: 'కల్లుగీత కార్మికుల పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '50+ Years',
      icon: Building,
      badge: 'Traditional Occupation',
      desc_en: 'Livelihood support for traditional toddy tapper artisans registered with cooperative societies.',
      desc_te: 'కల్లుగీత సహకార సంఘంలో నమోదైన సంప్రదాయ కల్లుగీత కార్మికులకు వయస్సు 50 ఏళ్లు దాటిన పిమ్మట పింఛను.',
      eligibility_en: 'Age 50+; Toddy Tappers Cooperative Society (TTCS) member card; Prohibition & Excise verification.',
      eligibility_te: '50 ఏళ్లు నిండి ఉండాలి; ప్రొహిబిషన్ & ఎక్సైజ్ శాఖ లేదా సహకార సంఘం గుర్తింపు కార్డు.'
    },
    {
      id: 'single_women',
      name_en: 'Single Women & Destitute',
      name_te: 'ఒంటరి మహిళల పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '35+ Years (Rural)',
      icon: UserCheck,
      badge: 'Social Empowerment',
      desc_en: 'Security for separated/deserted women or unmarried women aged 35+ in rural and tribal agency areas without male earning members.',
      desc_te: 'గ్రామీణ, ఏజెన్సీ ప్రాంతాలలో వివాహం కాకుండా 35 ఏళ్లు పైబడిన లేదా భర్త విడిచిపెట్టిన ఒంటరి మహిళలకు నెలవారీ సహాయం.',
      eligibility_en: 'Age 35+ in rural area; Living separately for >1 year; Panchayat Secretary & VRO inquiry report.',
      eligibility_te: 'గ్రామీణ ప్రాంతంలో 35 ఏళ్లు దాటి ఉండాలి; ఒక సంవత్సరానికి పైగా వేరుగా నివసిస్తున్నట్లు తనిఖీ నివేదిక.'
    },
    {
      id: 'ckd_dialysis',
      name_en: 'Chronic Kidney Disease (CKD / Dialysis)',
      name_te: 'దీర్ఘకాలిక మూత్రపిండ వ్యాధిగ్రస్తులు (డయాలసిస్)',
      amount: '₹10,000',
      frequency: 'per month / నెలకు',
      age: 'All Ages',
      icon: Heart,
      badge: 'Special Medical Grant',
      desc_en: 'Monthly medical relief pension for kidney failure patients undergoing regular hemodialysis or peritoneal dialysis.',
      desc_te: 'ప్రభుత్వ లేదా నెట్‌వర్క్ ఆసుపత్రులలో రెగ్యులర్ డయాలసిస్ చికిత్స పొందుతున్న మూత్రపిండ రోగులకు అత్యవసర ఆర్థిక సహాయం.',
      eligibility_en: 'Government / Aarogyasri Network Nephrologist dialysis registry record; Bi-annual medical validation.',
      eligibility_te: 'ఆరోగ్యశ్రీ నెట్‌వర్క్ ఆసుపత్రి నెఫ్రాలజిస్ట్ జారీ చేసిన డయాలసిస్ రికార్డు మరియు వైద్య నివేదిక.'
    },
    {
      id: 'dappu_artists',
      name_en: 'Dappu Artists & Folk Performers',
      name_te: 'డప్పు కళాకారులు & జానపద కళాకారులు',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '50+ Years',
      icon: Award,
      badge: 'Tribal & Cultural',
      desc_en: 'Honoring and supporting traditional Dalit and tribal Dappu percussion folk musicians in agency hill villages.',
      desc_te: 'పాడేరు మరియు ఏజెన్సీ ప్రాంతాల్లోని సంప్రదాయ డప్పు కళాకారులకు గౌరవభృతిగా నెలకు ₹4,000 పింఛను సహాయం.',
      eligibility_en: 'Age 50+; Cultural Department / ITDA recommendation; Registered Dappu artist certificate.',
      eligibility_te: '50 ఏళ్లు నిండి ఉండాలి; సాంస్కృతిక శాఖ లేదా ఐటీడీఏ ద్వారా ధ్రువీకరించబడిన డప్పు కళాకారుల కార్డు.'
    },
    {
      id: 'severe_disability',
      name_en: 'Severe Disability & Bedridden (80%+ SADAREM)',
      name_te: 'తీవ్ర వైకల్యం & మంచానికే పరిమితమైన వారు (80%+)',
      amount: '₹15,000',
      frequency: 'per month / నెలకు',
      age: 'No Age Limit',
      icon: Award,
      badge: 'Highest Welfare Scale',
      desc_en: 'Enhanced monthly pension of ₹15,000 for individuals with severe locomotive disability (80%+), muscular dystrophy, severe cerebral palsy, or bedridden condition.',
      desc_te: 'తీవ్రమైన అంగవైకల్యం (80%+), కండరాల క్షీణత (మస్క్యులర్ డిస్ట్రోఫీ), లేదా పూర్తిగా మంచానికే పరిమితమైన బాధితులకు నెలకు ₹15,000 గరిష్ట పింఛను సహాయం.',
      eligibility_en: 'SADAREM Medical Board Certificate showing 80% or greater disability with home caregiver recommendation.',
      eligibility_te: 'సదరెం మెడికల్ బోర్డు ద్వారా జారీ చేసిన కనీసం 80% లేదా అంతకంటే ఎక్కువ వైకల్య ధ్రువీకరణ పత్రం.'
    },
    {
      id: 'fishermen',
      name_en: 'Fishermen & Coastal Labourers',
      name_te: 'మత్స్యకారుల పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '50+ Years',
      icon: Award,
      badge: 'Livelihood Security',
      desc_en: 'Monthly pension for traditional inland and marine fishermen who have attained 50 years of age and hold active fisheries membership.',
      desc_te: 'చేపల వేట మరియు మత్స్యకార సహకార సంఘాలలో నమోదైన సంప్రదాయ మత్స్యకారులకు 50 ఏళ్లు నిండిన తర్వాత అందించే నెలవారీ పింఛను.',
      eligibility_en: 'Age 50+; Registered member of primary Fishermen Cooperative Society; White Ration Card.',
      eligibility_te: '50 సంవత్సరాలు నిండి ఉండాలి; మత్స్యశాఖ గుర్తింపు కార్డు లేదా సహకార సంఘం సభ్యత్వం కలిగి ఉండాలి.'
    },
    {
      id: 'transgender',
      name_en: 'Transgender Persons (Hijra)',
      name_te: 'ట్రాన్స్‌జెండర్ వ్యక్తుల పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '18+ Years',
      icon: UserCheck,
      badge: 'Inclusion & Dignity',
      desc_en: 'Social security and dignity assistance for transgender community members with registered transgender identity cards.',
      desc_te: 'లింగమార్పిడి వ్యక్తులకు సామాజిక భద్రత మరియు గౌరవప్రదమైన జీవనం కోసం అందించే నెలవారీ ఆర్థిక సహాయం.',
      eligibility_en: 'Age 18+; Transgender Certificate issued by District Magistrate / Social Welfare Department; White Ration Card.',
      eligibility_te: '18 ఏళ్లు పైబడి ఉండాలి; జిల్లా కలెక్టర్ / సంక్షేమ శాఖ జారీ చేసిన అధికారిక ట్రాన్స్‌జెండర్ గుర్తింపు పత్రం.'
    },
    {
      id: 'artistes',
      name_en: 'Traditional Folk Artistes & Musicians',
      name_te: 'వృద్ధ జానపద కళాకారుల పింఛను',
      amount: '₹4,000',
      frequency: 'per month / నెలకు',
      age: '50+ Years',
      icon: Sparkles,
      badge: 'Culture & Heritage',
      desc_en: 'Sustenance pension for aged folk artists, drama actors, instrumentalists, and tribal dance performers.',
      desc_te: 'సంప్రదాయ నాటక, జానపద, గిరిజన కళారూపాలను ప్రదర్శించే వృద్ధ కళాకారులను ఆదుకోవడానికి అందించే గౌరవ పింఛను.',
      eligibility_en: 'Age 50+; Certificate from Department of Language & Culture; Proof of 20+ years of active artistic performance.',
      eligibility_te: '50 ఏళ్లు నిండి ఉండాలి; భాషా సాంస్కృతిక శాఖ లేదా ఐటీడీఏ ద్వారా ధ్రువీకరించబడిన కళాకారుల రికార్డు.'
    }
  ];

  // Verified sample demo records in Paderu
  const samplePensionRecords = {
    'PEN-PAD-108': {
      pension_id: 'PEN-PAD-108',
      beneficiary_name: 'K. Somanna Dora (సోమన్న దొర)',
      gender: 'Male / పురుషుడు',
      age: 64,
      ward: 'Ward 1: Modakondamma Temple Colony',
      door_no: '1-24/A',
      category: 'Old Age Pension (OAP / వృద్ధాప్య పింఛను)',
      monthly_amount: '₹4,000',
      status: 'Active & Verified (పంపిణీ పూర్తయింది)',
      disbursement_mode: 'Doorstep Biometric / Facial Authentication (గ్రామ సచివాలయ సెక్రటరీ)',
      delivering_official: 'M. Lavanya (డిజిటల్ అసిస్టెంట్) - 9440123456',
      last_disbursement: '01-October-2026 (Delivered ₹4,000)',
      social_audit_status: 'Approved in Ward 1 Gram Sabha Social Audit',
      disbursement_history: [
        { month: 'October 2026', amount: '₹4,000', date: '01-10-2026', status: 'Delivered (Biometric Verified)' },
        { month: 'September 2026', amount: '₹4,000', date: '01-09-2026', status: 'Delivered (Biometric Verified)' },
        { month: 'August 2026', amount: '₹4,000', date: '01-08-2026', status: 'Delivered (Biometric Verified)' }
      ]
    },
    'PEN-PAD-204': {
      pension_id: 'PEN-PAD-204',
      beneficiary_name: 'M. Devamma (దేవమ్మ)',
      gender: 'Female / స్త్రీ',
      age: 48,
      ward: 'Ward 2: Old Bus Stand Road',
      door_no: '2-14/1',
      category: 'Widow Pension (వితంతు పింఛను)',
      monthly_amount: '₹4,000',
      status: 'Active & Verified (పంపిణీ పూర్తయింది)',
      disbursement_mode: 'Doorstep Facial Authentication via IRIS Scanner',
      delivering_official: 'V. Satyanarayana (VRO Desk)',
      last_disbursement: '01-October-2026 (Delivered ₹4,000)',
      social_audit_status: 'Approved in Ward 2 Social Audit Register',
      disbursement_history: [
        { month: 'October 2026', amount: '₹4,000', date: '01-10-2026', status: 'Delivered (Facial Scan Verified)' },
        { month: 'September 2026', amount: '₹4,000', date: '01-09-2026', status: 'Delivered (Facial Scan Verified)' },
        { month: 'August 2026', amount: '₹4,000', date: '01-08-2026', status: 'Delivered (Facial Scan Verified)' }
      ]
    },
    'PEN-PAD-312': {
      pension_id: 'PEN-PAD-312',
      beneficiary_name: 'P. Appala Raju (అప్పల రాజు)',
      gender: 'Male / పురుషుడు',
      age: 32,
      ward: 'Ward 3: Taluka Office Road',
      door_no: '3-52/B',
      category: 'Persons with Disabilities (దివ్యాంగుల పింఛను - 65% SADAREM)',
      monthly_amount: '₹6,000',
      status: 'Active & Verified (పంపిణీ పూర్తయింది)',
      disbursement_mode: 'Doorstep Delivery with Home Visit',
      delivering_official: 'Welfare & Education Assistant (WEA)',
      last_disbursement: '01-October-2026 (Delivered ₹6,000)',
      social_audit_status: 'SADAREM Cert Verified at Paderu Area Hospital',
      disbursement_history: [
        { month: 'October 2026', amount: '₹6,000', date: '01-10-2026', status: 'Delivered ₹6,000' },
        { month: 'September 2026', amount: '₹6,000', date: '01-09-2026', status: 'Delivered ₹6,000' },
        { month: 'August 2026', amount: '₹6,000', date: '01-08-2026', status: 'Delivered ₹6,000' }
      ]
    },
    'PEN-PAD-405': {
      pension_id: 'PEN-PAD-405',
      beneficiary_name: 'G. Chinnayya (చిన్నయ్య)',
      gender: 'Male / పురుషుడు',
      age: 55,
      ward: 'Ward 4: Weekly Market Area',
      door_no: '4-18',
      category: 'Chronic Kidney Disease (CKD Dialysis / డయాలసిస్)',
      monthly_amount: '₹10,000',
      status: 'Active Medical Grant',
      disbursement_mode: 'Direct Bank Transfer / Sachivalayam Doorstep DBT',
      delivering_official: 'Health ANM & Sachivalayam Secretary',
      last_disbursement: '01-October-2026 (Delivered ₹10,000)',
      social_audit_status: 'Aarogyasri Nephrology Registry Verified',
      disbursement_history: [
        { month: 'October 2026', amount: '₹10,000', date: '01-10-2026', status: 'Disbursed ₹10,000' },
        { month: 'September 2026', amount: '₹10,000', date: '01-09-2026', status: 'Disbursed ₹10,000' }
      ]
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    setPensionResult(null);

    const query = searchPensionId.trim().toUpperCase();
    if (!query) {
      setSearchError(lang === 'te' ? 'దయచేసి పింఛను సంఖ్యను నమోదు చేయండి.' : 'Please enter a Pension ID.');
      return;
    }

    if (samplePensionRecords[query]) {
      setPensionResult(samplePensionRecords[query]);
    } else {
      // Synthetic realistic fallback for any entered ID
      setPensionResult({
        pension_id: query,
        beneficiary_name: 'K. S********* (Privacy Masked)',
        gender: 'Resident Citizen',
        age: 62,
        ward: 'Paderu Grama Sachivalayam Ward 1',
        door_no: '1-**/**',
        category: 'Old Age Pension (OAP / వృద్ధాప్య పింఛను)',
        monthly_amount: '₹4,000',
        status: 'Active & Verified',
        disbursement_mode: 'Doorstep Biometric / Facial Authentication',
        delivering_official: 'Paderu Village Secretariat Functionary',
        last_disbursement: '01-October-2026 (Delivered ₹4,000)',
        social_audit_status: 'Approved in Gram Sabha Social Audit',
        disbursement_history: [
          { month: 'October 2026', amount: '₹4,000', date: '01-10-2026', status: 'Delivered (Biometric)' },
          { month: 'September 2026', amount: '₹4,000', date: '01-09-2026', status: 'Delivered (Biometric)' }
        ]
      });
    }
  };

  const handleCalculateEligibility = (e) => {
    e.preventDefault();

    let eligible = true;
    let reasons = [];
    let eligibleAmount = '₹4,000';
    let schemeName = 'Old Age Pension (OAP)';

    // Land Check
    if (checkerLand === 'over_3') {
      eligible = false;
      reasons.push(lang === 'te' ? 'భూమి పరిమితి నిబంధన (3 ఎకరాల మాగాణి లేదా 10 ఎకరాల మెట్ట మించరాదు)' : 'Landholding exceeds 3 acres wetland / 10 acres dryland ceiling.');
    }

    // Power Check
    if (checkerPower === 'over_300') {
      eligible = false;
      reasons.push(lang === 'te' ? 'నెలవారీ విద్యుత్ వినియోగం 300 యూనిట్లకు మించరాదు' : 'Electricity consumption exceeds 300 units/month.');
    }

    // Vehicle Check
    if (checkerVehicle === 'yes') {
      eligible = false;
      reasons.push(lang === 'te' ? 'కుటుంబంలో నాలుగు చక్రాల వాహనం (కారు) ఉండరాదు' : 'Four-wheeler ownership in family.');
    }

    // Govt Employee Check
    if (checkerGovtEmp === 'yes') {
      eligible = false;
      reasons.push(lang === 'te' ? 'కుటుంబంలో ప్రభుత్వ ఉద్యోగులు లేదా పెన్షనర్లు ఉండరాదు' : 'Permanent government employee or pensioner in family.');
    }

    // Age / Category Specific
    if (checkerCategory === 'oap') {
      schemeName = lang === 'te' ? 'వృద్ధాప్య పింఛను (OAP)' : 'Old Age Pension (OAP)';
      eligibleAmount = '₹4,000 / month';
      if (checkerAge < 60) {
        eligible = false;
        reasons.push(lang === 'te' ? 'వృద్ధాప్య పింఛనుకు కనీస వయస్సు 60 సంవత్సరాలు నిండి ఉండాలి' : 'Qualifying age for OAP is 60+ years.');
      }
    } else if (checkerCategory === 'widow') {
      schemeName = lang === 'te' ? 'వితంతు పింఛను' : 'Widow Pension';
      eligibleAmount = '₹4,000 / month';
      if (checkerAge < 18) {
        eligible = false;
        reasons.push(lang === 'te' ? 'కనీస వయస్సు 18 సంవత్సరాలు నిండి ఉండాలి' : 'Qualifying age is 18+ years.');
      }
    } else if (checkerCategory === 'disability') {
      schemeName = lang === 'te' ? 'దివ్యాంగుల పింఛను (సదరెం)' : 'Disability Pension (SADAREM)';
      eligibleAmount = '₹6,000 - ₹15,000 / month';
    } else if (checkerCategory === 'ckd') {
      schemeName = lang === 'te' ? 'డయాలసిస్ రోగుల పింఛను' : 'Chronic Kidney Disease / Dialysis';
      eligibleAmount = '₹10,000 / month';
    } else if (checkerCategory === 'single_women') {
      schemeName = lang === 'te' ? 'ఒంటరి మహిళల పింఛను' : 'Single Women Pension';
      eligibleAmount = '₹4,000 / month';
      if (checkerAge < 35) {
        eligible = false;
        reasons.push(lang === 'te' ? 'గ్రామీణ ప్రాంతంలో కనీస వయస్సు 35 ఏళ్లు ఉండాలి' : 'Qualifying age for rural single women is 35+ years.');
      }
    }

    setCalcResult({
      isEligible: eligible,
      reasons,
      schemeName,
      eligibleAmount
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '85vh', paddingBottom: '3.5rem' }}>
      {/* 1. Header Banner */}
      <section style={{ backgroundColor: 'var(--primary-900)', color: '#ffffff', padding: '2.5rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.82rem', marginBottom: '0.85rem', color: '#6ee7b7' }}>
            <Heart size={15} />
            <span>{lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం • ఎన్టీఆర్ భరోసా సామాజిక పింఛన్లు' : 'Govt of Andhra Pradesh • NTR Bharosa Social Security Pensions'}</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            {lang === 'te' ? 'పాడేరు సచివాలయం – సామాజిక భద్రతా పింఛన్ల వివరాలు' : 'Social Security Pensions & Welfare Assistance'}
          </h1>
          <p style={{ color: 'var(--slate-300)', maxWidth: '780px', fontSize: '1rem', lineHeight: '1.6' }}>
            {lang === 'te'
              ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం అమలు చేస్తున్న ఎన్టీఆర్ భరోసా పథకం కింద నెలకు ₹4,000 నుండి ₹15,000 వరకు ప్రతి నెలా 1వ తేదీనే ఇంటి వద్దే పింఛను పంపిణీ చేయబడుతుంది. అన్ని వర్గాల అర్హతలు, నిబంధనలు మరియు పంపిణీ స్థితిని ఇక్కడ పరిశీలించండి.'
              : 'Complete transparent directory of Andhra Pradesh NTR Bharosa Social Pensions with doorstep biometric disbursement on the 1st of every month, eligibility checker, and disbursement records.'}
          </p>

          {/* Tab Navigation Switches */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('categories')}
              style={{
                backgroundColor: activeTab === 'categories' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'categories' ? 'var(--primary-950)' : '#ffffff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <Award size={16} />
              <span>{lang === 'te' ? 'పింఛను వర్గాలు & స్కేల్' : 'Pension Schemes (8 Categories)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              style={{
                backgroundColor: activeTab === 'checker' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'checker' ? 'var(--primary-950)' : '#ffffff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <Calculator size={16} />
              <span>{lang === 'te' ? 'అర్హత నిర్ధారణ కాలిక్యులేటర్' : 'Eligibility Checker'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              style={{
                backgroundColor: activeTab === 'tracking' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'tracking' ? 'var(--primary-950)' : '#ffffff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <Search size={16} />
              <span>{lang === 'te' ? 'పింఛను స్థితి & పంపిణీ వివరాలు' : 'Check Pension Status'}</span>
            </button>

            <button
              onClick={() => setActiveTab('guidelines')}
              style={{
                backgroundColor: activeTab === 'guidelines' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'guidelines' ? 'var(--primary-950)' : '#ffffff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={16} />
              <span>{lang === 'te' ? 'అర్హత నిబంధనలు & దరఖాస్తు' : '6-Filter Criteria & Process'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Content Body */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {/* TAB 1: ALL PENSION CATEGORIES & MONTHLY AMOUNTS */}
        {activeTab === 'categories' && (
          <div>
            {/* Highlights Banner */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'పాడేరు పంచాయతీ పింఛన్ల గణాంకాలు' : 'Paderu Panchayat Social Welfare Base'}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  {lang === 'te' ? '1,640 మంది లబ్ధిదారులకు ప్రతి నెలా 1వ తేదీన ఇంటి వద్దే నగదు పంపిణీ' : '1,640 Enrolled Beneficiaries across 8 Wards • Doorstep Biometric Delivery'}
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  {lang === 'te'
                    ? 'గ్రామ సచివాలయ వెల్ఫేర్ అసిస్టెంట్ మరియు సిబ్బంది ఆధ్వర్యంలో బయోమెట్రిక్ / ఐరిస్ ద్వారా పారదర్శకంగా పంపిణీ జరుగుతుంది.'
                    : 'Disbursements are executed via handheld biometric tablets and facial authentication under strict Gram Sabha social audit.'}
                </p>
              </div>

              {onNavigate && (
                <button
                  className="btn btn-primary"
                  onClick={() => onNavigate('apply', 'pension_scheme')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e11d48', borderColor: '#e11d48', padding: '0.75rem 1.4rem' }}
                >
                  <Heart size={16} fill="#ffffff" />
                  <span>{lang === 'te' ? 'నూతన పింఛనుకు దరఖాస్తు' : 'Apply for New Pension'}</span>
                </button>
              )}
            </div>

            {/* Categories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {pensionCategories.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--slate-200)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      borderTop: '4px solid var(--primary-600)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                            <IconComp size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                              {lang === 'te' ? item.name_te : item.name_en}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                              Age: <strong>{item.age}</strong>
                            </span>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Scale Amount */}
                      <div style={{ backgroundColor: '#f0fdf4', border: '1px dashed #86efac', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', margin: '0.75rem 0', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#047857' }}>{item.amount}</span>
                        <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>{item.frequency}</span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5', marginBottom: '1rem' }}>
                        {lang === 'te' ? item.desc_te : item.desc_en}
                      </p>

                      <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-100)', fontSize: '0.8rem' }}>
                        <strong style={{ color: 'var(--slate-700)' }}>{lang === 'te' ? 'అర్హత నిబంధన:' : 'Key Eligibility:'}</strong>{' '}
                        <span style={{ color: 'var(--slate-600)' }}>{lang === 'te' ? item.eligibility_te : item.eligibility_en}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setCheckerCategory(item.id);
                          setActiveTab('checker');
                        }}
                      >
                        {lang === 'te' ? 'అర్హత లెక్కించండి' : 'Check Eligibility'}
                      </button>

                      {onNavigate && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onNavigate('apply', 'pension_scheme')}
                          style={{ backgroundColor: '#e11d48', borderColor: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <FileText size={13} />
                          <span>{lang === 'te' ? 'ఆన్‌లైన్ దరఖాస్తు' : 'Apply Online'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE ELIGIBILITY CHECKER */}
        {activeTab === 'checker' && (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Calculator size={28} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {lang === 'te' ? 'ఎన్టీఆర్ భరోసా పింఛను అర్హత నిర్ధారణ సాధనం' : 'NTR Bharosa Pension Eligibility Checker'}
                </h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {lang === 'te'
                    ? 'మీ వయస్సు, వర్గం మరియు కుటుంబ ఆస్తుల వివరాలను నమోదు చేసి తక్షణమే పింఛను అర్హతను తెలుసుకోండి.'
                    : 'Check your eligibility according to official Andhra Pradesh Grama Sachivalayam 6-filter welfare norms.'}
                </p>
              </div>

              <form onSubmit={handleCalculateEligibility}>
                <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {lang === 'te' ? 'పింఛను వర్గం (Category) *' : 'Pension Category *'}
                    </label>
                    <select
                      className="form-select"
                      value={checkerCategory}
                      onChange={(e) => setCheckerCategory(e.target.value)}
                    >
                      <option value="oap">Old Age Pension (వృద్ధాప్య పింఛను - 60+)</option>
                      <option value="widow">Widow Pension (వితంతు పింఛను - 18+)</option>
                      <option value="disability">Persons with Disabilities (దివ్యాంగులు - సదరెం 40%+)</option>
                      <option value="single_women">Single Women (ఒంటరి మహిళలు - 35+)</option>
                      <option value="ckd">Dialysis / Chronic Kidney Disease (డయాలసిస్)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {lang === 'te' ? 'దరఖాస్తుదారు వయస్సు (సంవత్సరాలు) *' : 'Applicant Age (Years) *'}
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      min="1"
                      max="115"
                      value={checkerAge}
                      onChange={(e) => setCheckerAge(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {lang === 'te' ? 'కుటుంబ వ్యవసాయ భూమి పరిమితి *' : 'Family Agricultural Landholding *'}
                    </label>
                    <select
                      className="form-select"
                      value={checkerLand}
                      onChange={(e) => setCheckerLand(e.target.value)}
                    >
                      <option value="under_3">Below 3.00 Acres Wetland or 10.00 Acres Dryland (నిబంధనల లోపు)</option>
                      <option value="over_3">More than 3.00 Acres Wetland / 10 Acres Dryland (పరిమితికి మించి)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {lang === 'te' ? 'నెలవారీ గృహ విద్యుత్ వినియోగం *' : 'Monthly Domestic Electricity Units *'}
                    </label>
                    <select
                      className="form-select"
                      value={checkerPower}
                      onChange={(e) => setCheckerPower(e.target.value)}
                    >
                      <option value="under_300">Under 300 Units / Month (300 యూనిట్లకు లోపు)</option>
                      <option value="over_300">More than 300 Units / Month (300 యూనిట్లకు పైబడి)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {lang === 'te' ? 'నాలుగు చక్రాల వాహనం (కారు) ఉందా? *' : 'Four-Wheeler Ownership in Family *'}
                    </label>
                    <select
                      className="form-select"
                      value={checkerVehicle}
                      onChange={(e) => setCheckerVehicle(e.target.value)}
                    >
                      <option value="no">No Four-Wheeler (వాహనం లేదు - టాక్సీ/ఆటో మినహాయింపు)</option>
                      <option value="yes">Yes, Family owns four-wheeler (సొంత కారు ఉంది)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {lang === 'te' ? 'కుటుంబంలో ప్రభుత్వ ఉద్యోగులు / పెన్షనర్లు ఉన్నారా? *' : 'Govt Employees / Pensioners in Family *'}
                    </label>
                    <select
                      className="form-select"
                      value={checkerGovtEmp}
                      onChange={(e) => setCheckerGovtEmp(e.target.value)}
                    >
                      <option value="no">No Government Employee in Family (ఎవరూ లేరు)</option>
                      <option value="yes">Yes, Family has Govt Employee (ప్రభుత్వ ఉద్యోగి ఉన్నారు)</option>
                    </select>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button type="submit" className="btn btn-primary" style={{ minWidth: '220px', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                    <Calculator size={18} />
                    <span>{lang === 'te' ? 'అర్హతను లెక్కించండి' : 'Check Pension Eligibility'}</span>
                  </button>
                </div>
              </form>

              {/* Calculator Outcome Box */}
              {calcResult && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: calcResult.isEligible ? '#f0fdf4' : '#fef2f2', border: `2px solid ${calcResult.isEligible ? '#86efac' : '#fca5a5'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {calcResult.isEligible ? (
                      <CheckCircle2 size={28} style={{ color: '#16a34a', flexShrink: 0 }} />
                    ) : (
                      <AlertCircle size={28} style={{ color: '#dc2626', flexShrink: 0 }} />
                    )}

                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: calcResult.isEligible ? '#14532d' : '#7f1d1d' }}>
                        {calcResult.isEligible
                          ? (lang === 'te' ? 'అభినందనలు! మీరు పింఛనుకు అర్హులు.' : 'Eligible for NTR Bharosa Pension!')
                          : (lang === 'te' ? 'పింఛను నిబంధనల ప్రకారం అనర్హత' : 'Ineligible based on Six-Step Welfare Filters')}
                      </h3>
                      {calcResult.isEligible && (
                        <div style={{ fontSize: '0.95rem', color: '#15803d', fontWeight: 700 }}>
                          {calcResult.schemeName}: <span style={{ fontSize: '1.2rem', color: '#047857' }}>{calcResult.eligibleAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!calcResult.isEligible && (
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid #fecaca', paddingTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.35rem' }}>
                        {lang === 'te' ? 'అనర్హతకు కారణాలు:' : 'Ineligibility Criteria Flagged:'}
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#b91c1c', lineHeight: '1.6' }}>
                        {calcResult.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {calcResult.isEligible && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #bbf7d0', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>
                        {lang === 'te'
                          ? 'మీరు మీ బియ్యం కార్డు, ఆధార్ కార్డు మరియు వయస్సు ధ్రువీకరణతో సచివాలయంలో దరఖాస్తు చేసుకోవచ్చు.'
                          : 'You can submit your application at Paderu Grama Sachivalayam or apply online below.'}
                      </p>

                      {onNavigate && (
                        <button
                          className="btn btn-primary"
                          onClick={() => onNavigate('apply')}
                          style={{ backgroundColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <FileText size={15} />
                          <span>{lang === 'te' ? 'ఇప్పుడే దరఖాస్తు చేయండి' : 'Apply Online Now'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PENSION STATUS & DISBURSEMENT TRACKING */}
        {activeTab === 'tracking' && (
          <div>
            <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                {lang === 'te' ? 'పింఛను లబ్ధిదారుల చెల్లింపు స్థితి పరిశీలన' : 'Search Pension Disbursement & Biometric Delivery Records'}
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {lang === 'te'
                  ? 'మీ పింఛను ఐడీ (Pension ID) ను నమోదు చేసి తాజా పంపిణీ వివరాలు మరియు గ్రామ సచివాలయ ధ్రువీకరణను చూడండి.'
                  : 'Enter your Pension ID (e.g. PEN-PAD-108) to inspect monthly payment delivery, delivering agent contact, and biometric logs.'}
              </p>

              {/* Quick sample chips */}
              <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                  {lang === 'te' ? 'నమూనా రికార్డులను ప్రయత్నించండి:' : 'Quick Demo Records in Paderu:'}
                </span>

                <button
                  type="button"
                  onClick={() => setSearchPensionId('PEN-PAD-108')}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  PEN-PAD-108 (Old Age Pension - ₹4,000)
                </button>

                <button
                  type="button"
                  onClick={() => setSearchPensionId('PEN-PAD-204')}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  PEN-PAD-204 (Widow Pension - ₹4,000)
                </button>

                <button
                  type="button"
                  onClick={() => setSearchPensionId('PEN-PAD-312')}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  PEN-PAD-312 (Disability SADAREM - ₹6,000)
                </button>

                <button
                  type="button"
                  onClick={() => setSearchPensionId('PEN-PAD-405')}
                  style={{ backgroundColor: '#ffffff', border: '1px solid var(--primary-300)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary-800)', fontWeight: 600 }}
                >
                  PEN-PAD-405 (Dialysis Medical - ₹10,000)
                </button>
              </div>

              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '580px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PEN-PAD-108"
                  value={searchPensionId}
                  onChange={(e) => setSearchPensionId(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ minWidth: '130px' }}>
                  <Search size={16} />
                  <span>{lang === 'te' ? 'శోధించండి' : 'Search'}</span>
                </button>
              </form>

              {searchError && (
                <div style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', fontSize: '0.85rem' }}>
                  {searchError}
                </div>
              )}
            </div>

            {/* Tracking Result Card */}
            {pensionResult && (
              <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Pension Registration ID:
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-900)' }}>
                      {pensionResult.pension_id}
                    </h3>
                    <div style={{ fontSize: '1rem', color: 'var(--slate-700)', fontWeight: 700 }}>
                      {pensionResult.category}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                      <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                      {pensionResult.status}
                    </span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-700)', marginTop: '0.35rem' }}>
                      {pensionResult.monthly_amount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-500)' }}>/ month</span>
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
                      Beneficiary Particulars (Privacy Protected):
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div><span style={{ color: 'var(--slate-500)' }}>Beneficiary Name:</span> <strong>{pensionResult.beneficiary_name}</strong></div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Age / Gender:</span> {pensionResult.age} Years • {pensionResult.gender}</div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Ward / Locality:</span> {pensionResult.ward}</div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Door No:</span> {pensionResult.door_no}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
                      Disbursement & Social Audit Verification:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div><span style={{ color: 'var(--slate-500)' }}>Disbursement Mode:</span> <strong>{pensionResult.disbursement_mode}</strong></div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Delivering Official:</span> <strong style={{ color: 'var(--primary-700)' }}>{pensionResult.delivering_official}</strong></div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Social Audit:</span> {pensionResult.social_audit_status}</div>
                      <div><span style={{ color: 'var(--slate-500)' }}>Latest Delivery:</span> <strong style={{ color: '#16a34a' }}>{pensionResult.last_disbursement}</strong></div>
                    </div>
                  </div>
                </div>

                {/* 3-Month Payment History Table */}
                {pensionResult.disbursement_history && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                      Recent Monthly Disbursement Logs:
                    </h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Disbursement Month</th>
                            <th>Amount Paid</th>
                            <th>Date Delivered</th>
                            <th>Biometric / IRIS Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pensionResult.disbursement_history.map((h, i) => (
                            <tr key={i}>
                              <td><strong>{h.month}</strong></td>
                              <td><span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{h.amount}</span></td>
                              <td>{h.date}</td>
                              <td>
                                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                                  <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} />
                                  {h.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 6-FILTER CRITERIA & ENROLLMENT GUIDELINES */}
        {activeTab === 'guidelines' && (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-700)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <ShieldCheck size={18} />
                <span>Andhra Pradesh Social Welfare Guidelines</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                {lang === 'te' ? 'అర్హత కొరకు ప్రభుత్వ ఆరు నిబంధనలు (6-Filter Norms)' : 'Official Six-Step Welfare Eligibility Filter'}
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                To ensure transparent, corruption-free assistance reaches the poorest families, the AP Government enforces 6 objective criteria verified through the Sachivalayam database.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      Total Family Landholding Ceiling
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.2rem 0 0' }}>
                      Family should possess less than 3.00 Acres of wetland (మాగాణి) OR less than 10.00 Acres of dryland (మెట్ట). In tribal Agency areas like Paderu, RoFR forest rights patta lands are verified.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      Monthly Electricity Consumption Under 300 Units
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.2rem 0 0' }}>
                      Domestic electricity consumption of the household should be less than 300 units per month on average across the past 6 months.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      No Four-Wheeler in Family
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.2rem 0 0' }}>
                      No family member should own a personal four-wheeler vehicle (Tractors, commercial Auto-rickshaws, and registered Taxis for livelihood are exempt).
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    4
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      No Government Employees or Pensioners in Household
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.2rem 0 0' }}>
                      No member in the family (as per Rice Card) should be a permanent government employee, public sector worker, or drawing a statutory civil pension.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    5
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      Municipal Plinth Area Limit
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.2rem 0 0' }}>
                      Residential property plinth area in municipal or urban limits should be less than 1,000 sq.ft.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    6
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      Monthly Household Income Ceiling
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.2rem 0 0' }}>
                      Rural / Agency household income should be less than ₹10,000 per month (₹1,20,000 per annum).
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div style={{ borderTop: '2px solid var(--slate-200)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
                  {lang === 'te' ? 'దరఖాస్తుకు అవసరమైన పత్రాల జాబితా' : 'Required Documents Checklist'}
                </h3>

                <div className="grid-2" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>Aadhaar Card (Applicant & Family)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>White Ration Card (Rice Card / BPL Proof)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>Age Proof (Birth Cert / Voter ID / 10th Memo)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>Bank Account / Post Office Passbook copy</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>Spouse Death Certificate (for Widow Pension)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>SADAREM Certificate 40%+ (for Disability)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://sspensions.ap.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ExternalLink size={15} />
                  <span>Official AP SSPensions Portal</span>
                </a>

                {onNavigate && (
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate('apply', 'pension_scheme')}
                    style={{ backgroundColor: '#e11d48', borderColor: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Heart size={15} fill="#ffffff" />
                    <span>{lang === 'te' ? 'సచివాలయం ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు' : 'Apply for Pension via Sachivalayam'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
