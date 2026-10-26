import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import DemoBanner from './components/DemoBanner';
import EmergencyBar from './components/EmergencyBar';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import PrivacyModal from './components/PrivacyModal';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import HouseTaxPage from './pages/HouseTaxPage';
import WaterSupplyPage from './pages/WaterSupplyPage';
import ElectricityPage from './pages/ElectricityPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ContactDirectoryPage from './pages/ContactDirectoryPage';
import HouseholdRecordsPage from './pages/HouseholdRecordsPage';
import RationCardsPage from './pages/RationCardsPage';
import HousingPage from './pages/HousingPage';
import AnganwadiPage from './pages/AnganwadiPage';
import MaternalSupportPage from './pages/MaternalSupportPage';
import PensionServicesPage from './pages/PensionServicesPage';
import DisabilityWelfarePage from './pages/DisabilityWelfarePage';
import SanitationPage from './pages/SanitationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import OnlineApplicationPage from './pages/OnlineApplicationPage';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedServiceToApply, setSelectedServiceToApply] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const handleNavigate = (tabId, serviceParam = null) => {
    if (serviceParam) {
      setSelectedServiceToApply(serviceParam);
    }
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onOpenLogin={() => setLoginModalOpen(true)} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'apply':
        return <OnlineApplicationPage initialService={selectedServiceToApply} onNavigate={handleNavigate} />;
      case 'house-tax':
        return <HouseTaxPage />;
      case 'water':
        return <WaterSupplyPage onNavigate={handleNavigate} />;
      case 'electricity':
        return <ElectricityPage onNavigate={handleNavigate} />;
      case 'complaints':
        return <ComplaintsPage />;
      case 'contacts':
        return <ContactDirectoryPage />;
      case 'households':
        return <HouseholdRecordsPage onOpenLogin={() => setLoginModalOpen(true)} />;
      case 'ration':
        return <RationCardsPage onNavigate={handleNavigate} />;
      case 'housing':
        return <HousingPage />;
      case 'anganwadi':
        return <AnganwadiPage onOpenLogin={() => setLoginModalOpen(true)} />;
      case 'maternal':
        return <MaternalSupportPage onOpenLogin={() => setLoginModalOpen(true)} />;
      case 'pension':
        return <PensionServicesPage onNavigate={handleNavigate} />;
      case 'disability':
        return <DisabilityWelfarePage />;
      case 'sanitation':
        return <SanitationPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <AdminDashboardPage onOpenLogin={() => setLoginModalOpen(true)} onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage onOpenPrivacyModal={() => setPrivacyModalOpen(true)} />;
      default:
        return <HomePage onNavigate={handleNavigate} onOpenLogin={() => setLoginModalOpen(true)} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Demonstration Portal Banner */}
      <DemoBanner />

      {/* 2. Rapid Emergency Click-to-Call Strip */}
      <EmergencyBar />

      {/* 3. Main Header with Navigation, Accessibility Controls, and Language Switch */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* 4. Active Page Content */}
      <main style={{ flexGrow: 1 }} id="main-content" role="main">
        {renderCurrentPage()}
      </main>

      {/* 5. Footer with verified AP state links, privacy policy, and disclaimers */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* 6. Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
