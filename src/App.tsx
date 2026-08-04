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
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  // Detect toast type from emoji prefix
  const isSuccess = toastMessage?.startsWith('✅') || toastMessage?.startsWith('🎉') || toastMessage?.startsWith('🟢') || toastMessage?.startsWith('⛺') || toastMessage?.startsWith('🦺') || toastMessage?.startsWith('🔍');
  const isWarning = toastMessage?.startsWith('⚠️') || toastMessage?.startsWith('💾') || toastMessage?.startsWith('❌');
  const isCritical = toastMessage?.startsWith('🆘') || toastMessage?.startsWith('🚨');

  const toastBg = isCritical
    ? 'bg-rose-600 border-rose-500'
    : isSuccess
    ? 'bg-emerald-700 border-emerald-500'
    : isWarning
    ? 'bg-amber-600 border-amber-500'
    : 'bg-slate-900 border-slate-700';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-pink-400 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Toast Notification — bottom-right, styled by type */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-4 sm:right-6 z-[60] ${toastBg} text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3 max-w-[calc(100vw-2rem)] sm:max-w-sm border animate-fade-in`}
          style={{ boxShadow: isCritical ? '0 0 0 4px rgba(244,63,94,0.2)' : undefined }}
        >
          <div className="shrink-0 mt-0.5">
            {isCritical ? (
              <AlertTriangle className="w-4 h-4 text-rose-200 animate-pulse" />
            ) : isSuccess ? (
              <CheckCircle className="w-4 h-4 text-emerald-200" />
            ) : (
              <Info className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <span className="leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Page Transition Wrapper */}
      <main className="flex-1">
        <div key={activeTab} className="animate-fade-in">
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
        </div>
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
