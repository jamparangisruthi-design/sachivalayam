import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'sachivalayam.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  console.log('Initializing Paderu Sachivalayam SQLite Database...');

  // 1. Users & Roles
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT null,
      password_hash TEXT NOT null,
      full_name TEXT NOT null,
      role TEXT NOT null CHECK(role IN ('Resident', 'Service Staff', 'Department Officer', 'Administrator')),
      phone TEXT,
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Localities / Wards in Paderu
  db.exec(`
    CREATE TABLE IF NOT EXISTS localities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT null,
      name_te TEXT NOT null,
      ward_number INTEGER NOT null,
      description TEXT
    );
  `);

  // 3. Government Services and Schemes
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department TEXT NOT null,
      category TEXT NOT null,
      title_en TEXT NOT null,
      title_te TEXT NOT null,
      description_en TEXT NOT null,
      description_te TEXT NOT null,
      eligibility_en TEXT NOT null,
      eligibility_te TEXT NOT null,
      documents_en TEXT NOT null,
      documents_te TEXT NOT null,
      process_en TEXT NOT null,
      process_te TEXT NOT null,
      responsible_office TEXT NOT null,
      official_link TEXT NOT null,
      last_verified TEXT NOT null
    );
  `);

  // 4. Complaints & Grievance Tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_number TEXT UNIQUE NOT null,
      category TEXT NOT null,
      locality_id INTEGER NOT null,
      landmark TEXT,
      description TEXT NOT null,
      severity TEXT NOT null CHECK(severity IN ('Low', 'Medium', 'High', 'Emergency')),
      citizen_name TEXT NOT null,
      citizen_phone TEXT NOT null,
      photo_url TEXT,
      status TEXT NOT null DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed')),
      assigned_to_user_id INTEGER,
      staff_notes TEXT,
      resolution_notes TEXT,
      resolution_photo TEXT,
      resolution_date DATETIME,
      reopen_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (locality_id) REFERENCES localities(id),
      FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
    );
  `);

  // 5. Complaint Status Updates Timeline
  db.exec(`
    CREATE TABLE IF NOT EXISTS complaint_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER NOT null,
      status TEXT NOT null,
      notes TEXT NOT null,
      updated_by_name TEXT NOT null,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
    );
  `);

  // 6. House Tax Assessments
  db.exec(`
    CREATE TABLE IF NOT EXISTS tax_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_number TEXT UNIQUE NOT null,
      door_number TEXT NOT null,
      owner_name TEXT NOT null,
      masked_owner TEXT NOT null,
      locality_id INTEGER NOT null,
      property_type TEXT NOT null,
      plinth_area_sqft INTEGER NOT null,
      annual_tax INTEGER NOT null,
      arrears INTEGER NOT null DEFAULT 0,
      library_cess INTEGER NOT null DEFAULT 0,
      total_due INTEGER NOT null,
      payment_status TEXT NOT null DEFAULT 'Unpaid' CHECK(payment_status IN ('Paid', 'Unpaid', 'Partial')),
      last_payment_date TEXT,
      FOREIGN KEY (locality_id) REFERENCES localities(id)
    );
  `);

  // 7. Household Records (Restricted staff access)
  db.exec(`
    CREATE TABLE IF NOT EXISTS households (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_code TEXT UNIQUE NOT null,
      locality_id INTEGER NOT null,
      head_name TEXT NOT null,
      masked_head_name TEXT NOT null,
      family_members_count INTEGER NOT null,
      age_group_children INTEGER NOT null DEFAULT 0,
      age_group_working INTEGER NOT null DEFAULT 0,
      age_group_elderly INTEGER NOT null DEFAULT 0,
      ration_card_type TEXT NOT null,
      masked_ration_number TEXT NOT null,
      housing_type TEXT NOT null,
      housing_tenure TEXT NOT null CHECK(housing_tenure IN ('Owned', 'Rented', 'Government Grant')),
      water_connection TEXT NOT null CHECK(water_connection IN ('Individual Tap', 'Community Standpost', 'Borewell', 'Natural Stream')),
      electricity_meter TEXT NOT null CHECK(electricity_meter IN ('Yes', 'No', 'Under Application')),
      has_toilet TEXT NOT null CHECK(has_toilet IN ('Yes', 'Community Facility', 'None')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (locality_id) REFERENCES localities(id)
    );
  `);

  // 8. Maternal and Child Support (Strictly Restricted Health Worker Records)
  db.exec(`
    CREATE TABLE IF NOT EXISTS maternal_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rch_id_masked TEXT UNIQUE NOT null,
      locality_id INTEGER NOT null,
      trimester INTEGER NOT null,
      high_risk_flag INTEGER NOT null DEFAULT 0,
      anm_worker_name TEXT NOT null,
      last_anc_checkup TEXT NOT null,
      next_anc_scheduled TEXT NOT null,
      nutrition_kit_issued INTEGER NOT null DEFAULT 1,
      consent_obtained INTEGER NOT null DEFAULT 1,
      status TEXT NOT null DEFAULT 'Active Follow-up',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (locality_id) REFERENCES localities(id)
    );
  `);

  // 9. Anganwadi Centers
  db.exec(`
    CREATE TABLE IF NOT EXISTS anganwadi_centers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_name_en TEXT NOT null,
      center_name_te TEXT NOT null,
      center_code TEXT UNIQUE NOT null,
      locality_id INTEGER NOT null,
      worker_name TEXT NOT null,
      worker_phone_public TEXT NOT null,
      address_en TEXT NOT null,
      address_te TEXT NOT null,
      operational_hours TEXT NOT null,
      children_enrolled_count INTEGER NOT null DEFAULT 0,
      pregnant_mothers_count INTEGER NOT null DEFAULT 0,
      has_drinking_water INTEGER NOT null DEFAULT 1,
      has_separate_toilet INTEGER NOT null DEFAULT 1,
      last_inspection_date TEXT,
      FOREIGN KEY (locality_id) REFERENCES localities(id)
    );
  `);

  // 10. Public Toilets / Sanitation Facilities
  db.exec(`
    CREATE TABLE IF NOT EXISTS public_toilets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT null,
      name_te TEXT NOT null,
      locality_id INTEGER NOT null,
      landmark_en TEXT NOT null,
      landmark_te TEXT NOT null,
      is_accessible INTEGER NOT null DEFAULT 1,
      has_running_water INTEGER NOT null DEFAULT 1,
      has_sanitary_incinerator INTEGER NOT null DEFAULT 0,
      fee_type TEXT NOT null DEFAULT 'Free' CHECK(fee_type IN ('Free', 'Pay & Use (₹5)')),
      opening_hours TEXT NOT null,
      cleanliness_status TEXT NOT null DEFAULT 'Good' CHECK(cleanliness_status IN ('Clean & Maintained', 'Good', 'Needs Cleaning', 'Under Repair')),
      maintenance_agency TEXT NOT null,
      last_cleaned TEXT,
      FOREIGN KEY (locality_id) REFERENCES localities(id)
    );
  `);

  // 11. Village Announcements & Gram Sabha
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT NOT null,
      title_te TEXT NOT null,
      content_en TEXT NOT null,
      content_te TEXT NOT null,
      category TEXT NOT null CHECK(category IN ('Gram Sabha', 'Health Camp', 'Scheme Deadline', 'Utility Notice', 'Emergency Alert')),
      is_pinned INTEGER NOT null DEFAULT 0,
      publish_date TEXT NOT null,
      event_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. Verified Contacts Directory
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT null CHECK(category IN ('Sachivalayam Staff', 'Village Administration', 'Water & Sanitation', 'Electricity (APEPDCL)', 'Health & Hospital', 'Police & Security', 'Tribal Welfare (ITDA)')),
      name_en TEXT NOT null,
      name_te TEXT NOT null,
      designation_en TEXT NOT null,
      designation_te TEXT NOT null,
      office_phone TEXT NOT null,
      emergency_phone TEXT,
      office_location_en TEXT NOT null,
      office_location_te TEXT NOT null,
      office_hours TEXT NOT null,
      verified_date TEXT NOT null,
      is_verified INTEGER NOT null DEFAULT 1
    );
  `);

  // 13. Audit Logs (Compliance & Privacy Tracking)
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      role TEXT,
      action TEXT NOT null,
      target_entity TEXT NOT null,
      target_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 14. Data Privacy / Correction / Deletion Requests
  db.exec(`
    CREATE TABLE IF NOT EXISTS privacy_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      req_number TEXT UNIQUE NOT null,
      citizen_name TEXT NOT null,
      contact_phone TEXT NOT null,
      request_type TEXT NOT null CHECK(request_type IN ('Information Correction', 'Data Deletion / Removal', 'Consent Revocation', 'Record Access')),
      entity_type TEXT NOT null,
      record_reference TEXT,
      justification TEXT NOT null,
      status TEXT NOT null DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'Approved', 'Rejected')),
      resolution_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 15. External System Integrations Config (Simulated / Configurable)
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_integrations (
      key TEXT PRIMARY KEY,
      name TEXT NOT null,
      status TEXT NOT null CHECK(status IN ('Live Connected', 'Configured (Demo Mode)', 'Disconnected')),
      endpoint_url TEXT,
      description TEXT NOT null,
      last_ping TEXT
    );
  `);

  // 16. Online Citizen Service & Certificate Applications
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_no TEXT UNIQUE NOT null,
      service_type TEXT NOT null,
      service_name_en TEXT NOT null,
      service_name_te TEXT NOT null,
      applicant_name TEXT NOT null,
      applicant_phone TEXT NOT null,
      applicant_aadhaar_masked TEXT,
      locality_id INTEGER NOT null,
      door_number TEXT NOT null,
      form_data TEXT NOT null,
      document_url TEXT,
      status TEXT NOT null DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Verification', 'Field Inspection', 'Approved', 'Rejected')),
      assigned_to_user_id INTEGER,
      staff_notes TEXT,
      rejection_reason TEXT,
      certificate_issued_no TEXT,
      sla_days INTEGER NOT null DEFAULT 7,
      verified_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (locality_id) REFERENCES localities(id),
      FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
    );
  `);

  // 17. Service Application Updates Timeline
  db.exec(`
    CREATE TABLE IF NOT EXISTS application_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT null,
      status TEXT NOT null,
      notes TEXT NOT null,
      updated_by_name TEXT NOT null,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES service_applications(id) ON DELETE CASCADE
    );
  `);

  seedData();
  seedServiceApplications();
}

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('Database already populated. Skipping seed.');
    return;
  }

  console.log('Seeding initial Paderu Sachivalayam records...');

  // Passwords
  const salt = bcrypt.genSaltSync(10);
  const residentHash = bcrypt.hashSync('Resident@123', salt);
  const staffHash = bcrypt.hashSync('Staff@123', salt);
  const officerHash = bcrypt.hashSync('Officer@123', salt);
  const adminHash = bcrypt.hashSync('Admin@123', salt);

  // Users
  const insertUser = db.prepare(`
    INSERT INTO users (username, password_hash, full_name, role, phone, department)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('resident_user', residentHash, 'K. Somanna Dora (నివాసి)', 'Resident', '9848011223', 'Resident Citizen');
  insertUser.run('staff_digital', staffHash, 'M. Lavanya (డిజిటల్ అసిస్టెంట్)', 'Service Staff', '9440123456', 'Paderu Grama Sachivalayam');
  insertUser.run('officer_vro', officerHash, 'V. Satyanarayana (గ్రామ రెవెన్యూ అధికారి)', 'Department Officer', '9849156789', 'Revenue & Land Administration');
  insertUser.run('admin_paderu', adminHash, 'Panchayat Secretary / MPDO Desk (పరిపాలనా అధికారి)', 'Administrator', '08935250100', 'Panchayat Raj & Rural Development');

  // Localities
  const insertLocality = db.prepare(`
    INSERT INTO localities (id, name_en, name_te, ward_number, description)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertLocality.run(1, 'Modakondamma Temple Colony', 'మోదకొండమ్మ ఆలయ ప్రాంతం', 1, 'Near the historic temple shrine, pilgrimage hub and surrounding residential lanes');
  insertLocality.run(2, 'RTC Bus Complex & Shandy Ground', 'ఆర్టీసీ బస్ కాంప్లెక్స్ & సంత మైదానం', 2, 'Commercial heart, weekly tribal market (Santha) area and central bus depot');
  insertLocality.run(3, 'Taluka Revenue Colony & Court Road', 'తాలూకా రెవెన్యూ కాలనీ & కోర్టు రోడ్డు', 3, 'Administrative quarters, MRO office, Civil Court and Sub-Treasury area');
  insertLocality.run(4, 'ITDA Colony & Ashram School Area', 'ఐటీడీఏ కాలనీ & ఆశ్రమ పాఠశాల', 4, 'Integrated Tribal Development Agency campus, staff quarters and tribal educational institutions');
  insertLocality.run(5, 'Area Hospital Road & Old Paderu', 'ఏరియా ఆసుపత్రి రోడ్డు & పాత పాడేరు', 5, 'District Area Hospital vicinity, old settlement lanes, community water tanks');
  insertLocality.run(6, 'Vanjangi Ghat Road & Hill View', 'వంజంగి ఘాట్ రోడ్డు & హిల్ వ్యూ', 6, 'Elevated road towards Vanjangi hills, coffee plantation slopes, newly developed ward');
  insertLocality.run(7, 'Kummariputtu Hamlet', 'కుమ్మరిపుట్టు గ్రామం', 7, 'Traditional artisans and farming settlement, eastern boundary of Paderu panchayat');
  insertLocality.run(8, 'Degree College & Minumuluru Junction', 'డిగ్రీ కళాశాల & మినుములూరు కూడలి', 8, 'Government Degree College campus, coffee research nursery and connecting junction');

  // Services and Schemes
  const insertService = db.prepare(`
    INSERT INTO services (
      department, category, title_en, title_te,
      description_en, description_te,
      eligibility_en, eligibility_te,
      documents_en, documents_te,
      process_en, process_te,
      responsible_office, official_link, last_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertService.run(
    'Social & Tribal Welfare',
    'Pensions',
    'NTR Bharosa / Social Security Pension (YSR Pension Kanuka)',
    'ఎన్టీఆర్ భరోసా / సామాజిక భద్రతా పింఛను పథకం',
    'Monthly financial support of ₹4,000 for Old Age (60+ yrs), Widows, Weavers, Toddy Tappers, Single Women, and ₹6,000 to ₹15,000 for Persons with Disabilities and Chronic Illnesses.',
    'వృద్ధులు (60 సం. పైబడిన), వితంతువులు, చేనేత, కల్లుగీత కార్మికులు, ఒంటరి మహిళలకు నెలకు ₹4,000 మరియు దివ్యాంగులకు ₹6,000 నుండి ₹15,000 వరకు ఆర్థిక సహాయం.',
    'BPL family status, valid Rice Card, age proof, resident of Andhra Pradesh, not drawing government pension or paying income tax.',
    'దారిద్ర్య రేఖకు దిగువన ఉన్నవారు, చెల్లుబాటు అయ్యే రైస్ కార్డ్, వయస్సు ధృవీకరణ, ప్రభుత్వ ఉద్యోగి/ఆదాయపు పన్ను చెల్లింపుదారులు కాకూడదు.',
    'Aadhaar Card, Rice Card, Bank Passbook, Age Proof (Birth/Voter ID), Caste Certificate for Agency Scheduled Tribes.',
    'ఆధార్ కార్డు, రైస్ కార్డు, బ్యాంక్ పాస్‌బుక్, వయస్సు ధృవీకరణ పత్రం, ఏజెన్సీ ఎస్టీ కుల ధృవీకరణ పత్రం.',
    'Submit application at Sachivalayam -> Welfare Assistant field verification -> Gram Sabha social audit -> MPDO approval -> Doorstep delivery via Village Volunteer/Secretary on 1st of every month.',
    'సచివాలయంలో దరఖాస్తు సమర్పణ -> సంక్షేమ సహాయకుడి క్షేత్ర పరిశీలన -> గ్రామసభ ఆడిట్ -> ఎంపీడీవో ఆమోదం -> ప్రతి నెలా 1వ తేదీన ఇంటి వద్దకే పంపిణీ.',
    'Welfare & Education Assistant (WEA), Paderu Sachivalayam',
    'https://sspensions.ap.gov.in',
    'October 2026'
  );

  insertService.run(
    'Civil Supplies',
    'Ration Cards',
    'New Rice Card Application & Member Addition',
    'నూతన రైస్ కార్డ్ దరఖాస్తు & కుటుంబ సభ్యుల చేర్పు',
    'Issue of digital Smart Rice Card for food grain security and subsidized essential commodities through Fair Price Shops (FPS) under Public Distribution System.',
    'ప్రజా పంపిణీ వ్యవస్థ ద్వారా రేషన్ సరుకులు పొందేందుకు డిజిటల్ రైస్ కార్డు మరియు కొత్త సభ్యుల చేర్పు లేదా తొలగింపు సేవలు.',
    'Household monthly income below ₹10,000 in rural areas; landholding below 3 acres wetland or 10 acres dryland; no family member owning a four-wheeler.',
    'గ్రామీణ ప్రాంతాల్లో కుటుంబ నెలవారీ ఆదాయం ₹10,000 లోపు; 3 ఎకరాల మాగాణి లేదా 10 ఎకరాల మెట్ట లోపు భూమి; కుటుంబంలో నాలుగు చక్రాల వాహనం ఉండకూడదు.',
    'Aadhaar cards of all family members, Proof of Residence in Paderu, Birth certificate for newborn members, Electricity bill or house tax receipt.',
    'కుటుంబ సభ్యులందరి ఆధార్ కార్డులు, పాడేరు నివాస ధృవీకరణ, పిల్లల జనన ధృవీకరణ పత్రం, విద్యుత్ బిల్లు లేదా ఇంటి పన్ను రసీదు.',
    'Digital Assistant registers application -> e-KYC biometric verification -> VRO and Civil Supplies Tahsildar approval -> Rice Card printed & delivered.',
    'డిజిటల్ అసిస్టెంట్ వద్ద దరఖాస్తు నమోదు -> బయోమెట్రిక్ ఈ-కేవైసీ -> వి.ఆర్.ఓ మరియు తహశీల్దార్ ఆమోదం -> కార్డు జారీ.',
    'Digital Assistant / Civil Supplies Deputy Tahsildar, Paderu',
    'https://epdsap.ap.gov.in',
    'October 2026'
  );

  insertService.run(
    'Housing & Rural Development',
    'Housing',
    'Pradhan Mantri Awas Yojana - Gramin (PMAY-G) & Tribal Housing',
    'ప్రధాన మంత్రి ఆవాస్ యోజన - గ్రామీణ్ & గిరిజన గృహ నిర్మాణ పథకం',
    'Financial subsidy of ₹1.8 Lakhs to ₹2.5 Lakhs for construction of permanent pucca houses for homeless and kutcha-house tribal families in agency tracts.',
    'నివాస యోగ్యమైన ఇల్లు లేని గిరిజన పేద కుటుంబాలకు పక్కా ఇళ్ళ నిర్మాణానికై ₹1.8 లక్షల నుండి ₹2.5 లక్షల వరకు ప్రభుత్వ సబ్సిడీ మరియు ఉపాధి హామీ అనుసంధానం.',
    'SECC / Housing beneficiary survey list, possession of house site patta or RoFR tribal land title, no existing pucca house.',
    'గ్రామ గృహ నిర్మాణ సర్వే జాబితాలో పేరు, ఇంటి స్థలం పట్టా లేదా అటవీ హక్కుల (RoFR) పత్రం ఉండాలి.',
    'House site title / D-Form patta, Aadhaar cards, Bank Account linked to Aadhaar, MGNREGS Job Card, Geo-tagged site photo.',
    'ఇంటి స్థల పట్టా, ఆధార్ కార్డులు, ఆధార్ లింక్డ్ బ్యాంక్ ఖాతా, ఉపాధి హామీ జాబ్ కార్డు, జియో ట్యాగ్ ఫోటో.',
    'Registration at Sachivalayam -> Engineering Assistant stage-by-stage geo-tagging (Basement, Lintel, Roof, Completion) -> Direct DBT payment to beneficiary account.',
    'సచివాలయంలో నమోదు -> ఇంజనీరింగ్ అసిస్టెంట్ ద్వారా దశలవారీ జియో ట్యాగింగ్ -> నేరుగా లబ్ధిదారుడి ఖాతాకే నగదు జమ.',
    'Engineering Assistant, Paderu Sachivalayam & AP Housing Corporation',
    'https://pmayg.nic.in',
    'October 2026'
  );

  insertService.run(
    'Revenue & Land Administration',
    'Certificates',
    'Integrated Community (Caste), Nativity & Date of Birth Certificate',
    'సమీకృత కుల, నివాస మరియు జనన ధృవీకరణ పత్రం',
    'Official government certificate validating Scheduled Tribe (ST) agency status, native domicile in Paderu agency tract, and date of birth for education and employment.',
    'పాడేరు ఏజెన్సీ ప్రాంతానికి చెందిన షెడ్యూల్డ్ తెగల (ఎస్టీ) కులం, స్థానికత మరియు జనన వివరాలను ధృవీకరించే అధికారిక పత్రం.',
    'Resident citizen residing in Paderu mandal; belongs to declared Scheduled Tribe / Agency community.',
    'పాడేరు మండలంలో శాశ్వత నివాసి; నోటిఫై చేయబడిన గిరిజన లేదా స్థానిక వర్గానికి చెందినవారై ఉండాలి.',
    'Aadhaar Card, Previous caste certificate of parents/relatives, School study certificate (Class 1 to 10), RoFR patta or 1/70 land document.',
    'ఆధార్ కార్డు, తల్లిదండ్రుల కుల ధృవీకరణ, పాఠశాల స్టడీ సర్టిఫికెట్, అటవీ హక్కుల పట్టా లేదా భూమి రికార్డులు.',
    'Apply online at MeeSeva / Sachivalayam -> VRO field inspection -> Revenue Inspector recommendation -> Tahsildar digital signature -> Download digitally signed certificate.',
    'సచివాలయంలో దరఖాస్తు -> వి.ఆర్.ఓ విచారణ -> ఆర్.ఐ సిఫార్సు -> తహశీల్దార్ డిజిటల్ సంతకం -> డౌన్‌లోడ్.',
    'Village Revenue Officer (VRO) & Tahsildar, Paderu',
    'https://meeseva.gov.in',
    'October 2026'
  );

  insertService.run(
    'Health & Family Welfare',
    'Maternal Health',
    'YSR Sampoorna Poshana & PM Matru Vandana Yojana (PMMVY)',
    'వైఎస్సార్ సంపూర్ణ పోషణ & ప్రధానమంత్రి మాతృ వందన యోజన',
    'Supplementary nutritional diet kit, eggs, milk, fortified food, and cash incentive of ₹5,000 in installments to pregnant women and lactating mothers via Anganwadi centers.',
    'గర్భిణులు, బాలింతలకు అంగన్‌వాడీ కేంద్రాల ద్వారా పౌష్టికాహారం, గుడ్లు, పాలు, బలవర్ధక ఆహారం మరియు ₹5,000 నగదు ప్రోత్సాహకం.',
    'Pregnant women registered within 120 days of conception at Village Health Clinic / Anganwadi center.',
    'గర్భం దాల్చిన 120 రోజుల్లోపు అంగన్‌వాడీ కేంద్రం లేదా గ్రామ హెల్త్ క్లినిక్‌లో పేరు నమోదు చేసుకున్న మహిళలు.',
    'Mother-Child Protection (MCP) card, Aadhaar Card of pregnant woman and husband, Bank Passbook, Pregnancy confirmation receipt.',
    'తల్లీ-బిడ్డ రక్షణ (MCP) కార్డు, దంపతుల ఆధార్ కార్డులు, బ్యాంక్ పాస్‌బుక్, గర్భధారణ నిర్ధారణ పత్రం.',
    'Register with local Anganwadi Worker & ANM -> Receive monthly Take-Home Ration & hot cooked meal -> Submit institutional delivery proof for cash grant.',
    'అంగన్‌వాడీ కార్యకర్త & ఏఎన్ఎం వద్ద నమోదు -> నెలవారీ పౌష్టికాహార కిట్ అందుకోవడం -> ఆసుపత్రి కాన్పు తర్వాత నగదు జమ.',
    'Village ANM (Health Secretary) & Anganwadi Worker (CDPO Paderu)',
    'https://wcd.nic.in',
    'October 2026'
  );

  insertService.run(
    'Disability Welfare',
    'Divyangjan',
    'SADAREM Disability Assessment & Assistive Devices',
    'సదరెం (SADAREM) వైకల్య నిర్ధారణ & సహాయక పరికరాలు',
    'Scientific medical assessment for issuance of permanent Disability Certificate, UDID card, free motorized tricycles, hearing aids, and specialized financial assistance.',
    'వైకల్య శాతాన్ని నిర్ధారించి అధికారిక సదరెం సర్టిఫికెట్, ప్రత్యేక పింఛను మరియు ఉచిత వీల్‌చైర్లు, శ్రవణ యంత్రాలు అందించే సేవ.',
    'Persons having benchmark disability of 40% or more (locomotor, visual, hearing, intellectual, mental illness).',
    '40% లేదా అంతకంటే ఎక్కువ వైకల్యం కలిగిన దివ్యాంగులు (శారీరక, దృష్టి, వినికిడి, మేధోపరమైన).',
    'Aadhaar card, 3 passport photographs, previous medical diagnostic reports, Ration card.',
    'ఆధార్ కార్డు, 3 పాస్‌పోర్ట్ సైజు ఫోటోలు, గత వైద్య పరీక్షల నివేదికలు, రేషన్ కార్డు.',
    'Slot booking at Sachivalayam -> Medical Board assessment at Area Hospital Paderu -> Computerized certificate generation -> Collection from Sachivalayam.',
    'సచివాలయంలో స్లాట్ బుకింగ్ -> ఏరియా ఆసుపత్రి పాడేరులో మెడికల్ బోర్డు పరీక్ష -> కంప్యూటరైజ్డ్ సర్టిఫికెట్ జారీ.',
    'Medical Superintendent, Area Hospital Paderu & Welfare Assistant',
    'https://sadarem.ap.gov.in',
    'October 2026'
  );

  insertService.run(
    'Agriculture & Horticulture',
    'Farmer Welfare',
    'Annadata Sukhibhava / PM-KISAN & Free e-Crop Booking',
    'అన్నదాత సుఖీభవ / పీఎం-కిసాన్ & ఉచిత ఈ-క్రాప్ బుకింగ్',
    'Annual direct income support of ₹20,000 for farmers (including RoFR tribal patta holders), crop insurance, input subsidy, and subsidized organic coffee inputs.',
    'గిరిజన RoFR పట్టాదారులతో సహా అర్హులైన రైతులకు ఏటా పంట పెట్టుబడి సాయం, ఉచిత పంటల బీమా మరియు కాఫీ తోటల సహాయక సామాగ్రి.',
    'Owner cultivators, tenant farmers with CCRC cards, and RoFR tribal forest rights landholders in Paderu mandal.',
    'భూమి కలిగిన రైతులు, అటవీ హక్కుల (RoFR) పట్టాదారులు మరియు కౌలు గుర్తింపు కార్డు (CCRC) కలిగిన రైతులు.',
    'RoFR Patta or 1B Pattadar Passbook, Aadhaar card, Active bank account linked with NPCI, e-Crop survey slip.',
    'RoFR పట్టా లేదా 1బి పట్టాదారు పాస్‌బుక్, ఆధార్ కార్డు, ఆధార్ లింక్డ్ బ్యాంక్ ఖాతా, ఈ-క్రాప్ నమోదు రసీదు.',
    'Village Agriculture Assistant visits farm plot -> Digital e-Crop geo-tagging -> Display of social audit list at Rythu Bharosa Kendram (RBK) -> DBT credit.',
    'గ్రామ వ్యవసాయ సహాయకుడి పొలం సందర్శన -> ఈ-క్రాప్ నమోదు -> రైతు భరోసా కేంద్రంలో జాబితా ప్రదర్శన -> ఖాతాలో నగదు జమ.',
    'Village Agriculture Assistant (VAA), RBK Paderu',
    'https://pmkisan.gov.in',
    'October 2026'
  );

  insertService.run(
    'Panchayat Raj & Energy',
    'Utilities',
    'New Domestic Electricity Connection & Streetlight Maintenance',
    'నూతన గృహ విద్యుత్ కనెక్షన్ & వీధి దీపాల నిర్వహణ',
    'Fast-track single-window release of domestic single-phase meter connections under APEPDCL and maintenance of LED village streetlights.',
    'ఏపీఈపీడీసీఎల్ ద్వారా నూతన విద్యుత్ మీటర్ కనెక్షన్ జారీ మరియు గ్రామ వీధి దీపాల నిర్వహణ సేవలు.',
    'Any lawful resident or property owner residing within Paderu Grama Panchayat limits.',
    'పాడేరు గ్రామ పంచాయతీ పరిధిలోని నివాసితులు లేదా ఆస్తి యజమానులు.',
    'House tax receipt or ownership title, Aadhaar Card, Passport size photograph, Neighbor consumer service number.',
    'ఇంటి పన్ను రసీదు, ఆధార్ కార్డు, పాస్‌పోర్ట్ సైజు ఫోటో, సమీప మీటర్ సర్వీస్ నంబర్.',
    'Apply at Sachivalayam or APEPDCL portal -> Energy Assistant site inspection -> Payment of testing fee -> Meter installation within 48 hours.',
    'సచివాలయం లేదా పోర్టల్‌లో దరఖాస్తు -> ఎనర్జీ అసిస్టెంట్ పరిశీలన -> రుసుము చెల్లింపు -> 48 గంటల్లో మీటర్ బిగింపు.',
    'Energy Assistant, Paderu Sachivalayam & APEPDCL Section Office',
    'https://www.apeasternpower.com',
    'October 2026'
  );

  // House Tax Assessments
  const insertTax = db.prepare(`
    INSERT INTO tax_assessments (
      assessment_number, door_number, owner_name, masked_owner, locality_id,
      property_type, plinth_area_sqft, annual_tax, arrears, library_cess, total_due,
      payment_status, last_payment_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTax.run('PAD-TAX-1001', '1-24/A', 'K. Somanna Dora', 'K. S****** Dora', 1, 'RCC Residential (ఆర్సీసీ నివాసం)', 850, 680, 0, 54, 734, 'Paid', '2026-05-12');
  insertTax.run('PAD-TAX-1002', '2-88/B', 'G. Kondalamma', 'G. K*********', 2, 'Commercial Shop (వాణిజ్య దుకాణం)', 420, 1420, 1420, 114, 2954, 'Unpaid', '2025-03-10');
  insertTax.run('PAD-TAX-1003', '3-112', 'P. Ramana Murthy', 'P. R**** Murthy', 3, 'RCC Residential (ఆర్సీసీ నివాసం)', 1100, 880, 0, 70, 950, 'Paid', '2026-06-18');
  insertTax.run('PAD-TAX-1004', '4-45/1', 'V. Appala Narsaiah', 'V. A***** Narsaiah', 4, 'Semi-Pucca (సెమీ పక్కా నివాసం)', 650, 420, 420, 34, 874, 'Unpaid', '2025-04-02');
  insertTax.run('PAD-TAX-1005', '5-09', 'S. Chitti Babu', 'S. C***** Babu', 5, 'Tiled House (పెంకుటిల్లు)', 550, 310, 0, 25, 335, 'Paid', '2026-04-15');
  insertTax.run('PAD-TAX-1006', '6-32/C', 'B. Devamma', 'B. D******', 6, 'RCC Residential (ఆర్సీసీ నివాసం)', 920, 740, 0, 59, 799, 'Paid', '2026-07-20');
  insertTax.run('PAD-TAX-1007', '7-14', 'M. Pandanna Dora', 'M. P******* Dora', 7, 'Traditional Thatched (సాంప్రదాయ గృహం)', 400, 150, 0, 12, 162, 'Paid', '2026-08-05');
  insertTax.run('PAD-TAX-1008', '8-55/A', 'T. Subbalakshmi', 'T. S************', 8, 'RCC Residential (ఆర్సీసీ నివాసం)', 780, 624, 624, 50, 1298, 'Unpaid', '2025-09-14');

  // Sample Complaints
  const insertComplaint = db.prepare(`
    INSERT INTO complaints (
      ref_number, category, locality_id, landmark, description, severity,
      citizen_name, citizen_phone, photo_url, status, assigned_to_user_id,
      staff_notes, resolution_notes, resolution_photo, resolution_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertComplaint.run(
    'PAD-2026-1021',
    'Water Supply',
    1,
    'Opposite Modakondamma Arch, Temple Street',
    'Underground main distribution pipeline ruptured causing heavy water leakage and road submersion.',
    'High',
    'K. Somanna Dora',
    '9848011223',
    '/images/paderu-valley.jpg',
    'In Progress',
    2,
    'Inspected by Engineering Assistant. Plumber team mobilized with replacement 90mm HDPE collar pipe.',
    null,
    null,
    null,
    '2026-10-14 09:30:00'
  );

  insertComplaint.run(
    'PAD-2026-1022',
    'Electricity',
    2,
    'Shandy Ground Weekly Market Lane 3',
    'Streetlight fixture completely burnt out, area is dark during early morning vegetable vendors arrival.',
    'Medium',
    'B. Raju',
    '9440555666',
    null,
    'Resolved',
    2,
    'Energy Assistant visited. Replaced 72W LED luminaire and tested circuit.',
    'New LED fixture installed and verified glowing brightly. Citizen confirmed on site.',
    '/images/sachivalayam-center.jpg',
    '2026-10-15 17:15:00',
    '2026-10-13 14:10:00'
  );

  insertComplaint.run(
    'PAD-2026-1023',
    'Sanitation & Waste',
    5,
    'Area Hospital Approach Road Culvert',
    'Drainage channel clogged with plastic bottles and leaf litter causing stagnant foul water overflow.',
    'High',
    'M. Subbamma',
    '9866123456',
    null,
    'Assigned',
    2,
    'Sanitation supervisor alerted. Desilting vehicle scheduled for tomorrow morning 7:00 AM.',
    null,
    null,
    null,
    '2026-10-15 11:20:00'
  );

  insertComplaint.run(
    'PAD-2026-1024',
    'Water Supply',
    7,
    'Kummariputtu Community Borewell',
    'Handpump handle hinge broke, borewell dry pumping with squeaking sound.',
    'Medium',
    'P. Simhachalam',
    '9490111222',
    null,
    'Submitted',
    null,
    null,
    null,
    null,
    null,
    '2026-10-16 08:45:00'
  );

  // Updates for Complaint 1021 & 1022
  const insertUpdate = db.prepare(`
    INSERT INTO complaint_updates (complaint_id, status, notes, updated_by_name, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUpdate.run(1, 'Submitted', 'Grievance recorded via Paderu Sachivalayam Portal.', 'Citizen Portal System', '2026-10-14 09:30:00');
  insertUpdate.run(1, 'Assigned', 'Assigned to Engineering Assistant M. Lavanya for field inspection.', 'Panchayat Secretary', '2026-10-14 11:15:00');
  insertUpdate.run(1, 'In Progress', 'Excavation completed. Pipeline section isolated; repair welding in progress.', 'M. Lavanya (Engg. Asst)', '2026-10-15 10:00:00');

  insertUpdate.run(2, 'Submitted', 'Grievance recorded for non-functional streetlight.', 'Citizen Portal System', '2026-10-13 14:10:00');
  insertUpdate.run(2, 'Assigned', 'Assigned to Junior Line-man / Energy Assistant.', 'Digital Assistant Desk', '2026-10-13 15:00:00');
  insertUpdate.run(2, 'In Progress', 'Material indent drawn from Panchayat Electrical store.', 'Energy Assistant', '2026-10-14 09:00:00');
  insertUpdate.run(2, 'Resolved', 'LED street light fixture replaced. Working normally.', 'Energy Assistant', '2026-10-15 17:15:00');

  // Sample Households (Staff only, synthetic)
  const insertHousehold = db.prepare(`
    INSERT INTO households (
      household_code, locality_id, head_name, masked_head_name, family_members_count,
      age_group_children, age_group_working, age_group_elderly, ration_card_type,
      masked_ration_number, housing_type, housing_tenure, water_connection, electricity_meter, has_toilet
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertHousehold.run('HH-PAD-001', 1, 'Korra Somanna Dora', 'K**** S****** Dora', 4, 1, 2, 1, 'White Rice Card', 'WAP03******19', 'Pucca (RCC)', 'Owned', 'Individual Tap', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-002', 1, 'Gemmeli Kondalamma', 'G****** K*********', 3, 0, 2, 1, 'White Rice Card', 'WAP03******84', 'Semi-Pucca', 'Owned', 'Community Standpost', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-003', 2, 'Pangi Ramana Murthy', 'P**** R**** Murthy', 5, 2, 2, 1, 'White Rice Card', 'WAP03******42', 'Pucca (RCC)', 'Rented', 'Individual Tap', 'Yes', 'Community Facility');
  insertHousehold.run('HH-PAD-004', 3, 'Vanaparthi Appala Narsaiah', 'V********* A***** Narsaiah', 4, 1, 2, 1, 'White Rice Card', 'WAP03******99', 'Semi-Pucca', 'Owned', 'Community Standpost', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-005', 4, 'Setti Chitti Babu', 'S**** C***** Babu', 3, 1, 2, 0, 'White Rice Card', 'WAP03******11', 'Pucca (RCC)', 'Government Grant', 'Individual Tap', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-006', 5, 'Biddika Devamma', 'B****** D******', 2, 0, 1, 1, 'White Rice Card (Antyodaya)', 'WAP03******75', 'Tiled House', 'Owned', 'Community Standpost', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-007', 6, 'Matsyarasa Pandanna Dora', 'M********* P******* Dora', 6, 2, 3, 1, 'White Rice Card', 'WAP03******33', 'Semi-Pucca', 'Owned', 'Borewell', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-008', 7, 'Thota Subbalakshmi', 'T**** S************', 4, 1, 2, 1, 'White Rice Card', 'WAP03******60', 'Traditional Thatched', 'Owned', 'Natural Stream', 'Under Application', 'Community Facility');
  insertHousehold.run('HH-PAD-009', 8, 'Kimudu Chinnayya Dora', 'K***** C******** Dora', 4, 1, 2, 1, 'White Rice Card', 'WAP03******08', 'Pucca (RCC)', 'Owned', 'Individual Tap', 'Yes', 'Yes');
  insertHousehold.run('HH-PAD-010', 2, 'Gammela Narayana', 'G****** N*******', 3, 0, 2, 1, 'White Rice Card', 'WAP03******55', 'Pucca (RCC)', 'Rented', 'Individual Tap', 'Yes', 'Yes');

  // Maternal Records (Strictly restricted, consent-based, synthetic demo)
  const insertMaternal = db.prepare(`
    INSERT INTO maternal_records (
      rch_id_masked, locality_id, trimester, high_risk_flag, anm_worker_name,
      last_anc_checkup, next_anc_scheduled, nutrition_kit_issued, consent_obtained, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMaternal.run('RCH-2026-***41', 1, 2, 0, 'K. Vijayakumari (ANM-1)', '2026-09-28', '2026-10-28', 1, 1, 'Active Follow-up', 'Normal fetal heart sound, BP stable 118/76. Iron & calcium distributed.');
  insertMaternal.run('RCH-2026-***92', 4, 3, 1, 'M. Sarojini (ANM-2)', '2026-10-04', '2026-10-20', 1, 1, 'High Risk Monitor', 'Mild anemia (Hb 9.2 g/dL). Referred to Area Hospital Gynaecologist. IFA syrup provided.');
  insertMaternal.run('RCH-2026-***58', 5, 1, 0, 'K. Vijayakumari (ANM-1)', '2026-10-10', '2026-11-10', 1, 1, 'Active Follow-up', '1st ANC completed, ultrasound scan recommended at Paderu Area Hospital.');
  insertMaternal.run('RCH-2026-***13', 7, 2, 0, 'B. Parvathi (ANM-3)', '2026-09-18', '2026-10-18', 1, 1, 'Active Follow-up', 'YSR Sampoorna Poshana Take Home Ration collected by family member.');

  // Anganwadi Centers
  const insertAnganwadi = db.prepare(`
    INSERT INTO anganwadi_centers (
      center_name_en, center_name_te, center_code, locality_id, worker_name,
      worker_phone_public, address_en, address_te, operational_hours,
      children_enrolled_count, pregnant_mothers_count, has_drinking_water, has_separate_toilet, last_inspection_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAnganwadi.run(
    'Paderu Center 01 (Temple Ward)',
    'పాడేరు కేంద్రం 01 (ఆలయ వార్డు)',
    'AW-PAD-01',
    1,
    'Smt. V. Annapurna',
    '08935-250101',
    'Near Modakondamma Kalyana Mandapam, Temple Road',
    'మోదకొండమ్మ కళ్యాణ మండపం సమీపంలో, టెంపుల్ రోడ్డు',
    '09:00 AM - 04:00 PM (Mon-Sat)',
    28,
    6,
    1,
    1,
    '2026-10-08'
  );

  insertAnganwadi.run(
    'Paderu Center 02 (RTC Complex)',
    'పాడేరు కేంద్రం 02 (ఆర్టీసీ కాంప్లెక్స్)',
    'AW-PAD-02',
    2,
    'Smt. K. Satyavathi',
    '08935-250102',
    'Behind ZP High School, Market Link Road',
    'జెడ్పీ హైస్కూల్ వెనుక, మార్కెట్ లింక్ రోడ్డు',
    '09:00 AM - 04:00 PM (Mon-Sat)',
    34,
    9,
    1,
    1,
    '2026-10-05'
  );

  insertAnganwadi.run(
    'ITDA Colony Anganwadi Center',
    'ఐటీడీఏ కాలనీ అంగన్‌వాడీ కేంద్రం',
    'AW-PAD-03',
    4,
    'Smt. G. Kamala',
    '08935-250103',
    'ITDA Quarters Sector 2, Near Community Hall',
    'ఐటీడీఏ క్వార్టర్స్ సెక్టార్ 2, కమ్యూనిటీ హాల్ వద్ద',
    '09:00 AM - 04:00 PM (Mon-Sat)',
    31,
    8,
    1,
    1,
    '2026-10-11'
  );

  insertAnganwadi.run(
    'Kummariputtu Mini-Anganwadi Center',
    'కుమ్మరిపుట్టు మినీ అంగన్‌వాడీ కేంద్రం',
    'AW-PAD-04',
    7,
    'Smt. P. Neelaveni',
    '08935-250104',
    'Primary Tribal Welfare School Premises, Kummariputtu',
    'గిరిజన సంక్షేమ ప్రాథమిక పాఠశాల ఆవరణ, కుమ్మరిపుట్టు',
    '09:00 AM - 02:00 PM (Mon-Sat)',
    18,
    4,
    1,
    1,
    '2026-09-30'
  );

  // Public Toilets / Sanitation Facilities
  const insertToilet = db.prepare(`
    INSERT INTO public_toilets (
      name_en, name_te, locality_id, landmark_en, landmark_te,
      is_accessible, has_running_water, has_sanitary_incinerator, fee_type,
      opening_hours, cleanliness_status, maintenance_agency, last_cleaned
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertToilet.run(
    'Weekly Market (Santha) Public Convenience',
    'వారపు సంత ప్రజా శౌచాలయ సముదాయం',
    2,
    'Shandy Ground South Entrance, RTC Bus Complex Gate',
    'సంత మైదానం దక్షిణ ద్వారం, ఆర్టీసీ బస్ కాంప్లెక్స్ గేటు',
    1,
    1,
    1,
    'Pay & Use (₹5)',
    '05:00 AM - 10:00 PM',
    'Clean & Maintained',
    'Paderu Grama Panchayat Sanitation Wing',
    '2026-10-16 07:00 AM'
  );

  insertToilet.run(
    'Modakondamma Temple Pilgrim Toilet Block',
    'మోదకొండమ్మ ఆలయ యాత్రికుల శౌచాలయం',
    1,
    'Adjacent to Pilgrim Cloak Room, Main Temple Ghat Road',
    'యాత్రికుల విశ్రాంతి గదుల పక్కన, ప్రధాన ఘాట్ రోడ్డు',
    1,
    1,
    1,
    'Free',
    '24 Hours Open',
    'Good',
    'Temple Trust & Sachivalayam Joint Cleanliness Committee',
    '2026-10-16 06:30 AM'
  );

  insertToilet.run(
    'Taluka Revenue Office Visitor Restrooms',
    'తాలూకా రెవెన్యూ కార్యాలయ సందర్శకుల మరుగుదొడ్లు',
    3,
    'Behind MRO Office Citizen Waiting Shade',
    'తహశీల్దార్ కార్యాలయం వేచి ఉండే షెడ్ వెనుక భాగం',
    1,
    1,
    0,
    'Free',
    '09:00 AM - 06:00 PM',
    'Good',
    'Paderu Grama Panchayat',
    '2026-10-16 08:00 AM'
  );

  insertToilet.run(
    'Area Hospital Paderu Outpatient Facility',
    'ఏరియా ఆసుపత్రి అవుట్‌పేషెంట్ ప్రజా శౌచాలయం',
    5,
    'Near OP Registration Counter, Hospital Main Gate',
    'ఓపీ రిజిస్ట్రేషన్ కౌంటర్ సమీపంలో, ప్రధాన ద్వారం',
    1,
    1,
    1,
    'Free',
    '24 Hours Open',
    'Clean & Maintained',
    'Hospital Health Sanitation Contractor',
    '2026-10-16 09:00 AM'
  );

  // Announcements
  const insertAnnouncement = db.prepare(`
    INSERT INTO announcements (
      title_en, title_te, content_en, content_te, category, is_pinned, publish_date, event_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAnnouncement.run(
    'Quarterly Gram Sabha Meeting on Rural Development & Jal Jeevan Mission',
    'గ్రామీణ అభివృద్ధి & జల్ జీవన్ మిషన్ పై త్రైమాసిక గ్రామసభ సమావేశం',
    'All village residents, women self-help groups, and ward members are requested to attend the Gram Sabha to review drinking water supply, road repairs, and social audit of pensions.',
    'గ్రామ ప్రజలు, పొదుపు సంఘాల మహిళలు, వార్డు సభ్యులందరూ తాగునీటి సరఫరా, రోడ్ల మరమ్మతులు, పింఛన్ల సామాజిక తనిఖీపై నిర్వహించే గ్రామసభకు హాజరు కావాల్సిందిగా కోరుతున్నాము.',
    'Gram Sabha',
    1,
    '2026-10-15',
    '2026-10-22 at 10:30 AM (Sachivalayam Hall)'
  );

  insertAnnouncement.run(
    'Special SADAREM Disability Medical Assessment Camp at Area Hospital Paderu',
    'ఏరియా ఆసుపత్రి పాడేరులో ప్రత్యేక సదరెం (SADAREM) వైకల్య నిర్ధారణ శిబిరం',
    'Medical board specialist doctors will conduct evaluations for physical, visual, and hearing impairments. Residents can register free slots through Sachivalayam Digital Assistant.',
    'శారీరక, దృష్టి, వినికిడి లోపాలు కలిగిన వారి కోసం ప్రత్యేక మెడికల్ బోర్డు పరీక్షలు నిర్వహించబడును. ఉచిత స్లాట్ల కొరకు సచివాలయంలో సంప్రదించండి.',
    'Health Camp',
    1,
    '2026-10-12',
    '2026-10-28 (Wednesday)'
  );

  insertAnnouncement.run(
    'Deadline for Tribal Post-Matric & Pre-Matric Scholarship Applications',
    'గిరిజన ప్రీ-మెట్రిక్ & పోస్ట్-మెట్రిక్ ఉపకార వేతనాల దరఖాస్తు గడువు',
    'Eligible ST tribal students studying in Class 9-10 and Intermediate/Degree are instructed to complete biometric authentication and submit income/caste proofs before the cut-off date.',
    'పాడేరు మండలంలోని 9-10 తరగతులు మరియు కళాశాల విద్యార్థులు ఆధార్ బయోమెట్రిక్ ధృవీకరణ పూర్తి చేయాల్సిందిగా తెలియజేయడమైనది.',
    'Scheme Deadline',
    0,
    '2026-10-10',
    '2026-10-31'
  );

  insertAnnouncement.run(
    'Scheduled Drinking Water Pipeline Maintenance on Modakondamma Road',
    'మోదకొండమ్మ ఘాట్ రోడ్డు వద్ద తాగునీటి పైప్‌లైన్ మరమ్మతుల నోటీసు',
    'Rural Water Supply (RWSS) engineering wing will carry out valve replacement. Water supply will be regulated for 4 hours between 01:00 PM to 05:00 PM.',
    'తాగునీటి సరఫరా వాల్వ్ మరమ్మతుల కారణంగా మధ్యాహ్నం 1 నుండి సాయంత్రం 5 గంటల వరకు నీటి సరఫరాలో స్వల్ప అంతరాయం కలుగుతుంది. నిల్వ చేసుకోవాల్సిందిగా మనవి.',
    'Utility Notice',
    0,
    '2026-10-14',
    '2026-10-18'
  );

  // Verified Contacts
  const insertContact = db.prepare(`
    INSERT INTO contacts (
      category, name_en, name_te, designation_en, designation_te,
      office_phone, emergency_phone, office_location_en, office_location_te,
      office_hours, verified_date, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertContact.run(
    'Sachivalayam Staff',
    'Paderu Grama Sachivalayam Main Help Desk',
    'పాడేరు గ్రామ సచివాలయ ప్రధాన సహాయ కేంద్రం',
    'Citizen Help Desk & Reception',
    'పౌర సేవల హెల్ప్ డెస్క్ & రిసెప్షన్',
    '08935-250100',
    '112',
    'Sachivalayam Complex, Near Taluka Office, Paderu',
    'సచివాలయ భవనం, తాలూకా కార్యాలయం వద్ద, పాడేరు',
    '10:00 AM - 05:00 PM (Working Days)',
    'October 2026',
    1
  );

  insertContact.run(
    'Sachivalayam Staff',
    'Panchayat Secretary (Grade-V)',
    'పంచాయతీ కార్యదర్శి',
    'Administrative Head of Village Panchayat',
    'గ్రామ పంచాయతీ పరిపాలనా అధికారి',
    '08935-250105',
    null,
    'Chamber 1, Grama Sachivalayam, Paderu',
    'ఛాంబర్ 1, గ్రామ సచివాలయం, పాడేరు',
    '10:00 AM - 05:00 PM',
    'October 2026',
    1
  );

  insertContact.run(
    'Sachivalayam Staff',
    'Village Revenue Officer (VRO Grade-II)',
    'గ్రామ రెవెన్యూ అధికారి (వి.ఆర్.ఓ)',
    'Land Records, Certificates & Mutation',
    'భూమి రికార్డులు, కుల ధృవీకరణ పత్రాలు',
    '08935-250106',
    null,
    'Revenue Section, Sachivalayam, Paderu',
    'రెవెన్యూ విభాగం, సచివాలయం, పాడేరు',
    '10:00 AM - 05:00 PM',
    'October 2026',
    1
  );

  insertContact.run(
    'Sachivalayam Staff',
    'Digital Assistant (DA)',
    'డిజిటల్ అసిస్టెంట్',
    'Computerized Applications & MeeSeva Delivery',
    'కంప్యూటరైజ్డ్ దరఖాస్తులు & మీసేవ సేవలు',
    '08935-250107',
    null,
    'Counter 1 & 2, Sachivalayam, Paderu',
    'కౌంటర్ 1 & 2, సచివాలయం, పాడేరు',
    '10:00 AM - 05:00 PM',
    'October 2026',
    1
  );

  insertContact.run(
    'Sachivalayam Staff',
    'Village Health Clinic (ANM - Aux. Nurse Midwife)',
    'గ్రామ హెల్త్ క్లినిక్ ఏఎన్ఎం',
    'Maternal Care, Immunization & Health Follow-up',
    'తల్లీ బిడ్డ రక్షణ, టీకాలు, ఆరోగ్య సేవలు',
    '08935-250108',
    '104',
    'Village Health Clinic, Hospital Road Ward 5',
    'విలేజ్ హెల్త్ క్లినిక్, ఆసుపత్రి రోడ్డు, వార్డు 5',
    '09:00 AM - 04:00 PM',
    'October 2026',
    1
  );

  insertContact.run(
    'Electricity (APEPDCL)',
    'APEPDCL Paderu Section Office',
    'ఏపీఈపీడీసీఎల్ పాడేరు విద్యుత్ సెక్షన్ కార్యాలయం',
    'Assistant Engineer (Electrical Operations)',
    'సహాయ ఇంజనీర్ (విద్యుత్ సరఫరా విభాగం)',
    '08935-250210',
    '1912 (Toll Free 24x7)',
    'Sub-Station Compound, Cinema Hall Road, Paderu',
    'సబ్ స్టేషన్ ఆవరణ, సినిమా రోడ్డు, పాడేరు',
    '10:00 AM - 05:00 PM (Emergency 24x7)',
    'October 2026',
    1
  );

  insertContact.run(
    'Water & Sanitation',
    'Rural Water Supply (RWSS) Section Office',
    'గ్రామీణ తాగునీటి సరఫరా & పారిశుధ్య విభాగం (RWSS)',
    'Assistant Executive Engineer (RWSS)',
    'తాగునీటి పథకాలు, బోరుబావులు, పారిశుధ్య పర్యవేక్షణ',
    '08935-250340',
    null,
    'Behind MPDO Office, Taluka Road, Paderu',
    'ఎంపీడీవో కార్యాలయం వెనుక, తాలూకా రోడ్డు, పాడేరు',
    '10:00 AM - 05:00 PM',
    'October 2026',
    1
  );

  insertContact.run(
    'Health & Hospital',
    'Area Hospital Paderu (District Hospital ASR)',
    'ఏరియా ఆసుపత్రి పాడేరు (జిల్లా ఆసుపత్రి ఏఎస్ఆర్)',
    'Medical Superintendent & Emergency Casualties',
    'అత్యవసర చికిత్స విభాగం & ఇన్-పేషెంట్ సేవలు',
    '08935-250022',
    '108 (Ambulance 24x7)',
    'Hospital Main Road, Paderu - 531024',
    'ఆసుపత్రి ప్రధాన రహదారి, పాడేరు',
    '24 Hours Emergency Available',
    'October 2026',
    1
  );

  insertContact.run(
    'Police & Security',
    'Paderu Law & Order Police Station',
    'పాడేరు శాంతి భద్రతల పోలీస్ స్టేషన్',
    'Station House Officer (Circle Inspector)',
    'శాంతి భద్రతలు, మహిళా రక్షణ & అత్యవసర స్పందన',
    '08935-250033',
    '112 / 100',
    'Near Court Complex, Main Road, Paderu',
    'కోర్టు కాంప్లెక్స్ సమీపంలో, ప్రధాన రహదారి, పాడేరు',
    '24 Hours Emergency Service',
    'October 2026',
    1
  );

  insertContact.run(
    'Tribal Welfare (ITDA)',
    'Integrated Tribal Development Agency (ITDA) Paderu',
    'సమీకృత గిరిజనాభివృద్ధి సంస్థ (ఐటీడీఏ) పాడేరు',
    'Project Officer & Tribal Grievance Cell',
    'ప్రాజెక్ట్ అధికారి & గిరిజన సమస్యల పరిష్కార విభాగం',
    '08935-251500',
    '1800-425-4567',
    'ITDA Administrative Complex, Paderu - 531024',
    'ఐటీడీఏ పరిపాలనా సముదాయం, పాడేరు',
    '10:00 AM - 05:00 PM (Monday Spandana Cell)',
    'October 2026',
    1
  );

  // External System Integrations
  const insertIntegration = db.prepare(`
    INSERT INTO system_integrations (key, name, status, endpoint_url, description, last_ping)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertIntegration.run(
    'spandana_grievance',
    'AP Spandana Public Grievance Portal',
    'Configured (Demo Mode)',
    'https://spandana.ap.gov.in/api/v2/docket',
    'Central public grievance escalation gateway for Andhra Pradesh state government.',
    '2026-10-16 09:00:00'
  );

  insertIntegration.run(
    'meeseva_gateway',
    'AP MeeSeva Citizen Services Gateway',
    'Configured (Demo Mode)',
    'https://meeseva.ap.gov.in/services/api',
    'Verification and issuance of digitally signed statutory certificates and RoFR land records.',
    '2026-10-16 09:00:00'
  );

  insertIntegration.run(
    'apepdcl_utility',
    'APEPDCL Rural Power Outage Docket System',
    'Configured (Demo Mode)',
    'https://apeasternpower.com/api/outage-report',
    'Automated utility trouble-call sync with Eastern Power Distribution Company 1912 docket.',
    '2026-10-16 09:00:00'
  );

  insertIntegration.run(
    'cdma_tax_portal',
    'Grama Panchayat Property Tax & Asset Register',
    'Configured (Demo Mode)',
    'https://cdma.ap.gov.in/tax/pg-integration',
    'Online house tax assessment demand and settlement gateway.',
    '2026-10-16 09:00:00'
  );

  // Initial Audit Log
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (username, role, action, target_entity, details, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('SYSTEM', 'Administrator', 'INITIALIZE_SYSTEM', 'Database', 'Paderu Sachivalayam database initialized with verified sample data and privacy controls.', '127.0.0.1');

  console.log('Database initialized and seeded successfully.');
}

function seedServiceApplications() {
  const insertApp = db.prepare(`
    INSERT INTO service_applications (
      application_no, service_type, service_name_en, service_name_te,
      applicant_name, applicant_phone, applicant_aadhaar_masked, locality_id, door_number,
      form_data, document_url, status, assigned_to_user_id, staff_notes,
      certificate_issued_no, sla_days, verified_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertUpdate = db.prepare(`
    INSERT INTO application_updates (application_id, status, notes, updated_by_name, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const app1Exists = db.prepare('SELECT id FROM service_applications WHERE application_no = ?').get('APP-2026-3041');
  if (!app1Exists) {
    console.log('Seeding initial service and certificate applications...');

  // Demo Application 1: Integrated Income Certificate (Approved)
  const app1Data = JSON.stringify({
    annual_income: '65000',
    income_source: 'Organic Coffee Farming & Agriculture (కాఫీ తోటల సాగు & వ్యవసాయం)',
    ration_card_number: 'WAP0318920112',
    purpose: 'Jagananna Vidya Deevena & Post-Matric Tribal Scholarship',
    father_or_spouse_name: 'K. Subba Rao Dora',
    land_extent_acres: '1.5 Acres RoFR Patta'
  });

  const app1 = insertApp.run(
    'APP-2026-3041',
    'income_certificate',
    'Integrated Income Certificate',
    'సమగ్ర ఆదాయ ధ్రువీకరణ పత్రం',
    'K. Somanna Dora',
    '9848011223',
    'XXXX-XXXX-4512',
    1,
    '1-24/A',
    app1Data,
    '/uploads/sample-income-proof.pdf',
    'Approved',
    2,
    'Field inspection and RoFR verification completed by Village Revenue Officer. Annual income verified under ₹1,00,000 threshold. Statutory certificate generated.',
    'CERT-AP-PAD-2026-7841',
    7,
    '2026-10-15 16:30:00',
    '2026-10-10 10:00:00',
    '2026-10-15 16:30:00'
  );

  insertUpdate.run(app1.lastInsertRowid, 'Submitted', 'Application submitted with supporting Ration Card proof via Paderu Sachivalayam Portal.', 'Citizen Portal', '2026-10-10 10:00:00');
  insertUpdate.run(app1.lastInsertRowid, 'Under Verification', 'Application accepted by Digital Assistant M. Lavanya. Forwarded to VRO for field enquiry.', 'M. Lavanya (Digital Assistant)', '2026-10-11 11:30:00');
  insertUpdate.run(app1.lastInsertRowid, 'Field Inspection', 'VRO conducted household enquiry at Ward 1, Modakondamma Temple Colony. Coffee yield receipts verified.', 'V. Satyanarayana (VRO)', '2026-10-13 14:00:00');
  insertUpdate.run(app1.lastInsertRowid, 'Approved', 'Income Certificate approved and digitally signed. Certificate ID CERT-AP-PAD-2026-7841 generated.', 'Tahsildar / Panchayat Secretary', '2026-10-15 16:30:00');

  // Demo Application 2: New Tap Water Connection (Field Inspection)
  const app2Data = JSON.stringify({
    connection_type: 'Residential Domestic (గృహావసరాలు)',
    assessment_number: 'PAD-TAX-1003',
    pipeline_distance_meters: '8',
    plinth_area_sqft: '920',
    preferred_route: 'Direct connection from Ward 3 Northern pipeline'
  });

  const app2 = insertApp.run(
    'APP-2026-3085',
    'water_connection',
    'New Tap Water Connection (Jal Jeevan Mission)',
    'నూతన కుళాయి కనెక్షన్ (జల్ జీవన్ మిషన్)',
    'P. Laxmi Bai',
    '9440112233',
    'XXXX-XXXX-8921',
    3,
    '3-45/B',
    app2Data,
    null,
    'Field Inspection',
    2,
    'Site feasibility inspection conducted. Proximity to 90mm main distribution pipe verified. Connection feasible upon fee challan verification.',
    null,
    10,
    null,
    '2026-10-18 09:15:00',
    '2026-10-22 11:45:00'
  );

  insertUpdate.run(app2.lastInsertRowid, 'Submitted', 'New tap connection request submitted along with House Tax Assessment PAD-TAX-1003.', 'Citizen Portal', '2026-10-18 09:15:00');
  insertUpdate.run(app2.lastInsertRowid, 'Under Verification', 'Application scrutinised for tax dues clearance. No arrears detected.', 'Digital Assistant', '2026-10-19 14:00:00');
  insertUpdate.run(app2.lastInsertRowid, 'Field Inspection', 'Engineering Assistant surveyed location. 8m road-crossing pipeline approved; connection estimate prepared.', 'Engineering Assistant (RWSS)', '2026-10-22 11:45:00');

  // Demo Application 3: Integrated Caste Certificate (Under Verification)
  const app3Data = JSON.stringify({
    community_category: 'ST (Scheduled Tribe / అనుసూచిత తెగ)',
    sub_caste: 'Konda Dora (కొండ దొర)',
    father_caste: 'Konda Dora',
    mother_caste: 'Konda Dora',
    purpose: 'APPSC Forest Beat Officer Examination & ITDA Skill Training',
    school_record_attached: 'Yes'
  });

  const app3 = insertApp.run(
    'APP-2026-3120',
    'caste_certificate',
    'Integrated Community & Caste Certificate',
    'సమగ్ర కుల ధ్రువీకరణ పత్రం',
    'G. Ramu',
    '9123456789',
    'XXXX-XXXX-6634',
    2,
    '2-18/1',
    app3Data,
    '/uploads/sample-school-study.pdf',
    'Under Verification',
    3,
    'Verification of 1950 census records and school study certificates initiated by Revenue Staff.',
    null,
    15,
    null,
    '2026-10-24 10:20:00',
    '2026-10-25 09:30:00'
  );

  insertUpdate.run(app3.lastInsertRowid, 'Submitted', 'Application submitted with 1st to 10th study certificate evidence.', 'Citizen Portal', '2026-10-24 10:20:00');
  insertUpdate.run(app3.lastInsertRowid, 'Under Verification', 'Genealogy documentation under scrutiny with Tribal Welfare Department records.', 'V. Satyanarayana (VRO)', '2026-10-25 09:30:00');
  }

  // Demo Application 4: NTR Bharosa Social Security Pension (Field Inspection / Social Audit)
  const pensionExists = db.prepare('SELECT id FROM service_applications WHERE application_no = ?').get('APP-2026-3190');
  if (!pensionExists) {
    const app4Data = JSON.stringify({
      pension_category: 'Old Age Pension (OAP / వృద్ధాప్య పింఛను - ₹4,000/mo)',
      applicant_age: '64',
      applicant_dob: '1962-06-15',
      pension_rice_card: 'WAP0318920112',
      bank_account_number: '30481010045231',
      bank_ifsc: 'SBIN0001854',
      bank_name: 'State Bank of India, Paderu Main Branch',
      land_wetland_acres: '0.0',
      land_dryland_acres: '2.1 Acres (RoFR Patta)',
      monthly_power_units: '68 Units/Month',
      four_wheeler_owned: 'No',
      govt_employee_in_family: 'No'
    });

    const app4 = insertApp.run(
      'APP-2026-3190',
      'pension_scheme',
      'NTR Bharosa Social Security Pension (Old Age)',
      'ఎన్టీఆర్ భరోసా సామాజిక పింఛను (వృద్ధాప్య)',
      'K. Somanna Dora',
      '9848011223',
      'XXXX-XXXX-4512',
      1,
      '1-24/A',
      app4Data,
      '/uploads/sample-pension-proof.pdf',
      'Field Inspection',
      2,
      'Age and 6-filter landholding criteria verified by VRO. Case placed before Ward 1 Gram Sabha for social audit scrutiny.',
      null,
      21,
      null,
      '2026-10-20 10:00:00',
      '2026-10-24 16:30:00'
    );

    insertUpdate.run(app4.lastInsertRowid, 'Submitted', 'Application submitted for NTR Bharosa Old Age Pension (₹4,000/mo) via Citizen Portal.', 'Citizen Portal', '2026-10-20 10:00:00');
    insertUpdate.run(app4.lastInsertRowid, 'Under Verification', 'Application scrutinised against 6-filter civil supplies database and RoFR land records.', 'M. Lavanya (Digital Assistant)', '2026-10-22 11:30:00');
    insertUpdate.run(app4.lastInsertRowid, 'Field Inspection', 'Welfare & Education Assistant (WEA) and VRO conducted household field enquiry. Applicant found physically eligible and residing at 1-24/A.', 'V. Satyanarayana (VRO)', '2026-10-24 16:30:00');
  }

  console.log('Seeded demo service applications successfully.');
}

export default db;


