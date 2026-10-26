import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Globe,
  Sun,
  Type,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Building,
  Droplets,
  Zap,
  FileText,
  PhoneCall,
  LayoutDashboard,
  Home,
  CheckCircle2,
  Award,
  Lock,
  Heart
} from 'lucide-react';

export default function Header({ currentTab, onNavigate, onOpenLogin }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout, demoLogin } = useAuth();
  const { highContrast, toggleHighContrast, fontSize, cycleFontSize } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleTabClick = (tabId) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    setDemoDropdownOpen(false);
  };

  const moreServices = [
    { id: 'ration', label_en: 'Ration Cards (Civil Supplies)', label_te: 'రేషన్ కార్డులు (సివిల్ సప్లైస్)' },
    { id: 'housing', label_en: 'Housing Assistance (PMAY-G)', label_te: 'గృహ నిర్మాణం (పీఎంఏవై-జి)' },
    { id: 'pension', label_en: 'Pension Services (NTR Bharosa)', label_te: 'సామాజిక పింఛన్లు (ఎన్టీఆర్ భరోసా)' },
    { id: 'maternal', label_en: 'Maternal & Child Support', label_te: 'గర్భిణులు & శిశు సంరక్షణ' },
    { id: 'anganwadi', label_en: 'Anganwadi & Nutrition Centers', label_te: 'అంగన్‌వాడీ & పోషకాహార కేంద్రాలు' },
    { id: 'disability', label_en: 'Persons with Disabilities (Divyangjan)', label_te: 'దివ్యాంగుల సంక్షేమం (సదరెం)' },
    { id: 'sanitation', label_en: 'Sanitation & Public Toilets', label_te: 'పారిశుధ్యం & ప్రజా శౌచాలయాలు' },
    { id: 'households', label_en: 'Population & Household Records', label_te: 'జనాభా & కుటుంబాల సర్వే' },
    { id: 'privacy', label_en: 'Privacy Policy & Citizen Rights', label_te: 'గోప్యతా విధానం & పౌరుల హక్కులు' },
  ];

  return (
    <header className="portal-header" role="banner">
      {/* 1. Accessibility Top Bar */}
      <div className="accessibility-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
              {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం • పాడేరు సచివాలయం' : 'Govt of Andhra Pradesh • Paderu Grama Sachivalayam'}
            </span>
          </div>

          <div className="accessibility-controls">
            {/* Font Size Button */}
            <button
              className="a11y-btn"
              onClick={cycleFontSize}
              title="Adjust Font Size (Normal, Large, Extra Large)"
              aria-label="Adjust Font Size"
            >
              <Type size={13} />
              <span>{fontSize.toUpperCase()}</span>
            </button>

            {/* Contrast Toggle */}
            <button
              className="a11y-btn"
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast Mode"
            >
              <Sun size={13} />
              <span>{highContrast ? t('contrast_high') : t('contrast_normal')}</span>
            </button>

            {/* Language Switcher */}
            <button
              className="lang-switch-btn"
              onClick={toggleLanguage}
              title="Switch language between Telugu and English"
              aria-label="Switch Language"
            >
              <Globe size={14} />
              <span>{t('lang_toggle')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Brand & Header Actions */}
      <div className="container">
        <div className="header-top">
          <div
            className="header-brand"
            onClick={() => handleTabClick('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="header-logo-icon" aria-hidden="true">
              పా
            </div>
            <div className="header-titles">
              <h1>{t('portal_title')}</h1>
              <p>{t('portal_subtitle')} • {t('district_name')}</p>
            </div>
          </div>

          <div className="header-actions">
            {/* Demo Role Switcher Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoDropdownOpen(prev => !prev)}
                title="Change active demo role"
                style={{ fontSize: '0.8rem', fontWeight: 600, gap: '0.3rem' }}
              >
                <ShieldCheck size={14} style={{ color: 'var(--primary-700)' }} />
                <span>{user ? user.role : 'Demo Switcher'}</span>
                <ChevronDown size={12} />
              </button>

              {demoDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.25rem',
                    background: '#ffffff',
                    boxShadow: 'var(--shadow-xl)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    zIndex: 250,
                    minWidth: '220px',
                    padding: '0.5rem 0'
                  }}
                >
                  <div style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', borderBottom: '1px solid var(--slate-100)' }}>
                    SWITCH ACTIVE USER ROLE:
                  </div>
                  {['Resident', 'Service Staff', 'Department Officer', 'Administrator'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleDemoSwitch(role)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: user?.role === role ? 'var(--primary-700)' : 'var(--slate-800)',
                        backgroundColor: user?.role === role ? 'var(--primary-50)' : 'transparent',
                        fontWeight: user?.role === role ? 700 : 500
                      }}
                    >
                      <span>{role}</span>
                      {user?.role === role && <CheckCircle2 size={14} style={{ color: 'var(--primary-700)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={onOpenLogin}
                  title="Switch User / Sign In"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.4rem 0.65rem' }}
                >
                  <User size={13} />
                  <span>{lang === 'te' ? 'లాగిన్ మార్పు' : 'Switch Login'}</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={logout}
                  title="Sign Out"
                  style={{ padding: '0.4rem 0.65rem' }}
                >
                  <LogOut size={13} />
                  <span style={{ fontSize: '0.8rem' }}>{t('logout_btn')}</span>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenLogin}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.45rem 0.9rem',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)'
                }}
              >
                <Lock size={15} />
                <span>{lang === 'te' ? 'లాగిన్ (Sign In)' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="portal-nav" aria-label="Main Navigation">
        <div className="container">
          <ul className="nav-list">
            <li>
              <button
                className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => handleTabClick('home')}
              >
                <Home size={15} />
                <span>{t('nav_home')}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'services' ? 'active' : ''}`}
                onClick={() => handleTabClick('services')}
              >
                <FileText size={15} />
                <span>{t('nav_services')}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'apply' ? 'active' : ''}`}
                onClick={() => handleTabClick('apply')}
                style={{ position: 'relative' }}
              >
                <Award size={15} />
                <span>{lang === 'te' ? 'ఆన్‌లైన్ దరఖాస్తు' : 'Apply Online'}</span>
                <span style={{
                  fontSize: '0.6rem',
                  padding: '0.1rem 0.35rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  marginLeft: '0.25rem'
                }}>NEW</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'pension' ? 'active' : ''}`}
                onClick={() => handleTabClick('pension')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Heart size={15} style={{ color: currentTab === 'pension' ? '#ffffff' : '#fb7185' }} />
                <span>{lang === 'te' ? 'పింఛన్లు' : 'Pensions'}</span>
                <span style={{
                  fontSize: '0.6rem',
                  padding: '0.1rem 0.35rem',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  marginLeft: '0.2rem'
                }}>NTR</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'complaints' ? 'active' : ''}`}
                onClick={() => handleTabClick('complaints')}
              >
                <ShieldCheck size={15} />
                <span>{t('nav_complaints')}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'house-tax' ? 'active' : ''}`}
                onClick={() => handleTabClick('house-tax')}
              >
                <Building size={15} />
                <span>{t('nav_house_tax')}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'water' ? 'active' : ''}`}
                onClick={() => handleTabClick('water')}
              >
                <Droplets size={15} />
                <span>{t('nav_water')}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'electricity' ? 'active' : ''}`}
                onClick={() => handleTabClick('electricity')}
              >
                <Zap size={15} />
                <span>{t('nav_electricity')}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentTab === 'contacts' ? 'active' : ''}`}
                onClick={() => handleTabClick('contacts')}
              >
                <PhoneCall size={15} />
                <span>{t('nav_contacts')}</span>
              </button>
            </li>

            {/* More Services Dropdown */}
            <li style={{ position: 'relative' }}>
              <button
                className={`nav-link ${moreServices.some(s => s.id === currentTab) ? 'active' : ''}`}
                onClick={() => setMoreDropdownOpen(prev => !prev)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>{t('nav_more')}</span>
                <ChevronDown size={14} />
              </button>

              {moreDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#ffffff',
                    minWidth: '280px',
                    boxShadow: 'var(--shadow-xl)',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    zIndex: 250,
                    padding: '0.5rem 0'
                  }}
                >
                  {moreServices.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabClick(item.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: currentTab === item.id ? 'var(--primary-700)' : 'var(--slate-800)',
                        backgroundColor: currentTab === item.id ? 'var(--primary-50)' : 'transparent',
                        fontWeight: currentTab === item.id ? 700 : 500,
                        borderBottom: '1px solid var(--slate-100)'
                      }}
                    >
                      {lang === 'te' ? item.label_te : item.label_en}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Staff / Admin Dashboard */}
            <li>
              <button
                className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabClick('dashboard')}
                style={{ color: '#fed7aa' }}
              >
                <LayoutDashboard size={15} />
                <span>{t('nav_dashboard')}</span>
                <span className="nav-link-badge">
                  {user ? user.role.split(' ')[0] : 'Demo'}
                </span>
              </button>
            </li>

            {/* Direct Login Button in Nav Bar */}
            <li>
              <button
                className="nav-link"
                onClick={onOpenLogin}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  marginLeft: '0.4rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Lock size={14} />
                <span>{user ? (lang === 'te' ? 'లాగిన్ మార్పు' : 'Switch Login') : (lang === 'te' ? 'లాగిన్ (Sign In)' : 'Sign In')}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 300,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              padding: '1.5rem',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                {t('portal_title')}
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.25rem' }}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Auth Button */}
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-200)' }}>
              {user ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-block btn-sm" onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}>
                    <User size={14} /> {lang === 'te' ? 'లాగిన్ ఖాతా మార్పు' : 'Switch Login'}
                  </button>
                  <button className="btn btn-secondary btn-block btn-sm" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    <LogOut size={14} /> {t('logout_btn')}
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                  <Lock size={16} />
                  <span>{lang === 'te' ? 'సచివాలయ ఉద్యోగుల లాగిన్ (Sign In)' : 'Sign In (Staff & Residents)'}</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('home')}>
                <Home size={16} /> {t('nav_home')}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('services')}>
                <FileText size={16} /> {t('nav_services')}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start', color: 'var(--primary-800)', fontWeight: 700 }} onClick={() => handleTabClick('apply')}>
                <Award size={16} /> {lang === 'te' ? 'ఆన్‌లైన్ దరఖాస్తు (సర్టిఫికెట్లు)' : 'Apply Online (Certificates)'}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start', color: '#be123c', fontWeight: 700 }} onClick={() => handleTabClick('pension')}>
                <Heart size={16} style={{ color: '#e11d48' }} /> {lang === 'te' ? 'సామాజిక పింఛన్లు (NTR భరోసా)' : 'Pensions (NTR Bharosa)'}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('complaints')}>
                <ShieldCheck size={16} /> {t('nav_complaints')}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('house-tax')}>
                <Building size={16} /> {t('nav_house_tax')}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('water')}>
                <Droplets size={16} /> {t('nav_water')}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('electricity')}>
                <Zap size={16} /> {t('nav_electricity')}
              </button>
              <button className="btn btn-secondary btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('contacts')}>
                <PhoneCall size={16} /> {t('nav_contacts')}
              </button>
              <button className="btn btn-amber btn-block" style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('dashboard')}>
                <LayoutDashboard size={16} /> {t('nav_dashboard')} ({user ? user.role : 'Demo Staff'})
              </button>

              <div style={{ margin: '1rem 0 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                {t('nav_more').toUpperCase()}:
              </div>
              {moreServices.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                    color: currentTab === item.id ? 'var(--primary-700)' : 'var(--slate-700)',
                    fontWeight: currentTab === item.id ? 700 : 500
                  }}
                >
                  • {lang === 'te' ? item.label_te : item.label_en}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
