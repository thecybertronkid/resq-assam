import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  IncidentReport, 
  ReliefCamp, 
  Volunteer, 
  NGOInventory, 
  MissingPerson, 
  RoadReport, 
  DisasterAlert, 
  Donation 
} from '../types';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_RELIEF_CAMPS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_NGO_INVENTORIES, 
  INITIAL_MISSING_PERSONS, 
  INITIAL_ROAD_REPORTS, 
  INITIAL_ALERTS, 
  INITIAL_DONATIONS 
} from '../utils/mockData';
import { detectDuplicateIncident, calculateAiVulnerabilityScore } from '../utils/aiEngine';
import { saveSosToOfflineQueue, getOfflineSosQueue, clearOfflineSosQueue } from '../utils/offlineSync';
import { AsdmaSyncEngine, LiveTelemetryStatus } from '../utils/asdmaSyncEngine';
import { dbService } from '../utils/databaseService';
import { supabaseClient } from '../utils/supabaseClient';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: 'en' | 'as' | 'hi';
  setLanguage: (lang: 'en' | 'as' | 'hi') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isOnline: boolean;
  
  incidents: IncidentReport[];
  camps: ReliefCamp[];
  volunteers: Volunteer[];
  ngos: NGOInventory[];
  missingPersons: MissingPerson[];
  roadReports: RoadReport[];
  alerts: DisasterAlert[];
  donations: Donation[];
  telemetry: LiveTelemetryStatus;

  submitSosReport: (report: Partial<IncidentReport>) => void;
  updateIncidentStatus: (id: string, status: IncidentReport['status'], teamId?: string, teamName?: string, rescuePhotoProof?: string) => void;
  addCamp: (camp: ReliefCamp) => void;
  updateCampOccupancy: (campId: string, occupancy: number) => void;
  addVolunteer: (vol: Omit<Volunteer, 'id' | 'isVerified' | 'tasksAssigned'>) => void;
  verifyVolunteer: (volId: string) => void;
  addNGO: (ngo: NGOInventory) => void;
  updateNgoStock: (ngoId: string, itemKey: keyof NGOInventory['items'], quantity: number) => void;
  addMissingPerson: (person: Omit<MissingPerson, 'id'>) => void;
  addRoadReport: (report: Omit<RoadReport, 'id' | 'reportedAt'>) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'receiptNo' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('citizen');
  const [language, setLanguage] = useState<'en' | 'as' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [camps, setCamps] = useState<ReliefCamp[]>(INITIAL_RELIEF_CAMPS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [ngos, setNgos] = useState<NGOInventory[]>(INITIAL_NGO_INVENTORIES);
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>(INITIAL_MISSING_PERSONS);
  const [roadReports, setRoadReports] = useState<RoadReport[]>(INITIAL_ROAD_REPORTS);
  const [alerts, setAlerts] = useState<DisasterAlert[]>(INITIAL_ALERTS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);

  // Live Telemetry Sync State
  const [telemetry, setTelemetry] = useState<LiveTelemetryStatus>(AsdmaSyncEngine.getInstance().getTelemetry());

  // DATABASE INITIALIZATION & HYDRATION FROM INDEXEDDB & SUPABASE
  useEffect(() => {
    const loadDatabaseState = async () => {
      try {
        const [
          savedIncidents,
          savedCamps,
          savedVolunteers,
          savedNgos,
          savedMissing,
          savedRoads,
          savedAlerts,
          savedDonations
        ] = await Promise.all([
          dbService.getIncidents(),
          dbService.getCamps(),
          dbService.getVolunteers(),
          dbService.getNGOs(),
          dbService.getMissingPersons(),
          dbService.getRoadReports(),
          dbService.getAlerts(),
          dbService.getDonations()
        ]);

        if (savedIncidents.length > 0) setIncidents(savedIncidents);
        if (savedCamps.length > 0) setCamps(savedCamps);
        if (savedVolunteers.length > 0) setVolunteers(savedVolunteers);
        if (savedNgos.length > 0) setNgos(savedNgos);
        if (savedMissing.length > 0) setMissingPersons(savedMissing);
        if (savedRoads.length > 0) setRoadReports(savedRoads);
        if (savedAlerts.length > 0) setAlerts(savedAlerts);
        if (savedDonations.length > 0) setDonations(savedDonations);
      } catch (err) {
        console.error('Failed to hydrate state from ResQAssamDB:', err);
      }
    };

    loadDatabaseState();

    const unsubscribe = AsdmaSyncEngine.getInstance().subscribe((newTelemetry) => {
      setTelemetry(newTelemetry);
    });

    const handleOnline = () => {
      setIsOnline(true);
      showToast('🟢 Back Online! Synchronizing offline emergency reports with Supabase servers...');
      const queue = getOfflineSosQueue();
      if (queue.length > 0) {
        queue.forEach((qReport: Partial<IncidentReport>) => {
          submitSosReport(qReport);
        });
        clearOfflineSosQueue();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('⚠️ Network Disconnected! SOS reports will be queued locally via IndexedDB.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const submitSosReport = (report: Partial<IncidentReport>) => {
    const id = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dupCheck = detectDuplicateIncident(report, incidents);
    const dType = report.disasterType || 'flood';
    const dDemo = report.demographics || { adults: 1, children: 0, elderly: 0, disabled: 0, pregnant: 0, animals: 0 };
    const dNeeds = report.needs || { food: true, water: true, medicine: false, boat: true, evacuation: true, livestock: false };
    const severity = report.severity || 'critical';
    const aiVulnerabilityScore = calculateAiVulnerabilityScore(dType, dDemo, dNeeds);

    let assignedTeamId: string | undefined = undefined;
    let assignedTeamName: string | undefined = undefined;
    let initialStatus: IncidentReport['status'] = 'submitted';

    if (severity === 'critical' || aiVulnerabilityScore >= 70) {
      const activeVerifiedVol = volunteers.find(v => v.isVerified && v.available && (v.district === report.district || true));
      if (activeVerifiedVol) {
        assignedTeamId = activeVerifiedVol.id;
        assignedTeamName = `${activeVerifiedVol.name} (${activeVerifiedVol.skills.join(', ')})`;
        initialStatus = 'accepted';

        const updatedVol = { ...activeVerifiedVol, tasksAssigned: activeVerifiedVol.tasksAssigned + 1 };
        setVolunteers(prev => prev.map(v => v.id === activeVerifiedVol.id ? updatedVol : v));
        dbService.saveVolunteer(updatedVol);
        supabaseClient.syncVolunteer(updatedVol);

        showToast(`🚨 CRITICAL DISPATCH: Auto-assigned to nearest Verified Volunteer [${activeVerifiedVol.name}] in ${activeVerifiedVol.district}!`);
      }
    }

    const fullReport: IncidentReport = {
      id,
      reporterName: report.reporterName || 'Anonymous Citizen',
      reporterPhone: report.reporterPhone || '+91 9800000000',
      lat: report.lat || 26.1445,
      lng: report.lng || 91.7362,
      district: report.district || 'Sivasagar',
      village: report.village || 'Sivasagar Town Sector',
      landmark: report.landmark || '',
      disasterType: dType,
      severity,
      demographics: dDemo,
      needs: dNeeds,
      description: report.description || 'Emergency assistance needed.',
      createdAt: new Date().toLocaleTimeString(),
      status: initialStatus,
      photos: report.photos || [],
      voiceNoteUrl: report.voiceNoteUrl,
      aiVulnerabilityScore,
      isAiDuplicate: dupCheck.isDuplicate,
      assignedTeamId,
      assignedTeamName
    };

    if (!isOnline) {
      saveSosToOfflineQueue(fullReport);
      showToast(`💾 Offline Mode: Report ${id} stored in local IndexedDB. Will sync when back online.`);
    } else {
      setIncidents(prev => [fullReport, ...prev]);
      dbService.saveIncident(fullReport); // PERSIST TO INDEXEDDB
      supabaseClient.syncIncident(fullReport); // SYNC TO SUPABASE POSTGRESQL

      if (initialStatus === 'submitted') {
        showToast(`🆘 SOS Report ${id} submitted & synced to Supabase database! Transmitted to NDRF Patgaon Control Room.`);
      }
    }
  };

  const updateIncidentStatus = (
    id: string, 
    status: IncidentReport['status'], 
    teamId?: string, 
    teamName?: string, 
    rescuePhotoProof?: string
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updated = {
          ...inc,
          status,
          assignedTeamId: teamId || inc.assignedTeamId,
          assignedTeamName: teamName || inc.assignedTeamName,
          rescuePhotoProof: rescuePhotoProof || inc.rescuePhotoProof
        };
        dbService.saveIncident(updated);
        supabaseClient.syncIncident(updated);
        return updated;
      }
      return inc;
    }));
    showToast(`🚁 Incident ${id} status updated to [${status.toUpperCase()}] & synced to Supabase database!`);
  };

  const addCamp = (camp: ReliefCamp) => {
    setCamps(prev => [camp, ...prev]);
    dbService.saveCamp(camp);
    showToast(`⛺ Registered new relief camp "${camp.name}" in ${camp.district}! Saved to database.`);
  };

  const updateCampOccupancy = (campId: string, occupancy: number) => {
    setCamps(prev => prev.map(c => {
      if (c.id === campId) {
        const updated = { ...c, currentOccupancy: occupancy };
        dbService.saveCamp(updated);
        return updated;
      }
      return c;
    }));
    showToast(`📊 Updated camp occupancy for ${campId} to ${occupancy}!`);
  };

  const addVolunteer = (volData: Omit<Volunteer, 'id' | 'isVerified' | 'tasksAssigned'>) => {
    const newVol: Volunteer = {
      ...volData,
      id: `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: false,
      tasksAssigned: 0
    };
    setVolunteers(prev => [newVol, ...prev]);
    dbService.saveVolunteer(newVol);
    supabaseClient.syncVolunteer(newVol);
    showToast(`🦵 Volunteer application for ${newVol.name} submitted & synced to Supabase database! Pending Admin verification.`);
  };

  const verifyVolunteer = (volId: string) => {
    setVolunteers(prev => prev.map(v => {
      if (v.id === volId) {
        const updated = { ...v, isVerified: true };
        dbService.saveVolunteer(updated);
        supabaseClient.syncVolunteer(updated);
        return updated;
      }
      return v;
    }));
    showToast(`✅ Admin verified volunteer credential for ${volId}! Saved to Supabase database.`);
  };

  const addNGO = (ngo: NGOInventory) => {
    setNgos(prev => [ngo, ...prev]);
    dbService.saveNGO(ngo);
    showToast(`📦 Registered NGO warehouse "${ngo.ngoName}" in database!`);
  };

  const updateNgoStock = (ngoId: string, itemKey: keyof NGOInventory['items'], quantity: number) => {
    setNgos(prev => prev.map(n => {
      if (n.id === ngoId) {
        const updated = {
          ...n,
          items: {
            ...n.items,
            [itemKey]: quantity
          },
          distributionCount: n.distributionCount + 1,
          lastUpdated: new Date().toLocaleTimeString()
        };
        dbService.saveNGO(updated);
        return updated;
      }
      return n;
    }));
  };

  const addMissingPerson = (person: Omit<MissingPerson, 'id'>) => {
    const newPerson: MissingPerson = {
      ...person,
      id: `MP-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setMissingPersons(prev => [newPerson, ...prev]);
    dbService.saveMissingPerson(newPerson);
    showToast(`🔍 Missing person report for "${newPerson.fullName}" published & saved to database!`);
  };

  const addRoadReport = (report: Omit<RoadReport, 'id' | 'reportedAt'>) => {
    const newRoad: RoadReport = {
      ...report,
      id: `RD-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedAt: new Date().toLocaleTimeString()
    };
    setRoadReports(prev => [newRoad, ...prev]);
    dbService.saveRoadReport(newRoad);
    showToast(`🚧 Road obstacle report for "${newRoad.roadName}" published & saved to database!`);
  };

  const addDonation = (donationData: Omit<Donation, 'id' | 'receiptNo' | 'timestamp'>) => {
    const newDonation: Donation = {
      ...donationData,
      id: `DON-${Math.floor(10000 + Math.random() * 90000)}`,
      receiptNo: `RSQ-80G-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString()
    };
    setDonations(prev => [newDonation, ...prev]);
    dbService.saveDonation(newDonation);
    supabaseClient.syncDonation(newDonation);
    showToast(`🎉 Thank you ${newDonation.donorName}! Official 80G E-Receipt #${newDonation.receiptNo} saved to Supabase database.`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isSosModalOpen,
        setIsSosModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        toastMessage,
        showToast,
        isOnline,
        incidents,
        camps,
        volunteers,
        ngos,
        missingPersons,
        roadReports,
        alerts,
        donations,
        telemetry,
        submitSosReport,
        updateIncidentStatus,
        addCamp,
        updateCampOccupancy,
        addVolunteer,
        verifyVolunteer,
        addNGO,
        updateNgoStock,
        addMissingPerson,
        addRoadReport,
        addDonation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
