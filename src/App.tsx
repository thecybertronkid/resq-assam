import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LiveIncidentMap } from './components/map/LiveIncidentMap';
import { CitizenDashboard } from './components/dashboards/CitizenDashboard';
import { RescueDashboard } from './components/dashboards/RescueDashboard';
import { VolunteerDashboard } from './components/dashboards/VolunteerDashboard';
import { NgoDashboard } from './components/dashboards/NgoDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { ReliefCampsModule } from './components/modules/ReliefCampsModule';
import { MissingPersonModule } from './components/modules/MissingPersonModule';
import { RoadStatusModule } from './components/modules/RoadStatusModule';
import { MedicalModule } from './components/modules/MedicalModule';
import { DisasterAlertsModule } from './components/modules/DisasterAlertsModule';
import { DonationPortal } from './components/modules/DonationPortal';
import { PublicAnalytics } from './components/modules/PublicAnalytics';
import { SosModal } from './components/sos/SosModal';
import { AuthModal } from './components/auth/AuthModal';
import { AiAssistantDrawer } from './components/common/AiAssistantDrawer';
import { Bell } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-500 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <Bell className="w-4 h-4 text-blue-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && <LandingPage />}
        {activeTab === 'map' && <LiveIncidentMap />}
        {activeTab === 'citizen' && <CitizenDashboard />}
        {activeTab === 'rescue' && <RescueDashboard />}
        {activeTab === 'volunteer' && <VolunteerDashboard />}
        {activeTab === 'ngo' && <NgoDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'camps' && <ReliefCampsModule />}
        {activeTab === 'missing' && <MissingPersonModule />}
        {activeTab === 'roads' && <RoadStatusModule />}
        {activeTab === 'medical' && <MedicalModule />}
        {activeTab === 'alerts' && <DisasterAlertsModule />}
        {activeTab === 'donations' && <DonationPortal />}
        {activeTab === 'public' && <PublicAnalytics />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <SosModal />
      <AuthModal />
      <AiAssistantDrawer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
