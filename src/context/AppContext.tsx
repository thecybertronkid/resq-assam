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
import { getOfflineSosQueue, clearOfflineSosQueue, saveSosToOfflineQueue } from '../utils/offlineSync';
import { detectDuplicateIncident, calculateAiVulnerabilityScore } from '../utils/aiEngine';
import { AsdmaSyncEngine, LiveTelemetryStatus, AXOM_RELIEF_EMERGENCY_DATA } from '../utils/asdmaSyncEngine';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: 'en' | 'as' | 'hi';
  setLanguage: (lang: 'en' | 'as' | 'hi') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  incidents: IncidentReport[];
  camps: ReliefCamp[];
  volunteers: Volunteer[];
  ngos: NGOInventory[];
  missingPersons: MissingPerson[];
  roadReports: RoadReport[];
  alerts: DisasterAlert[];
  donations: Donation[];
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isOnline: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Live Telemetry Sync
  telemetry: LiveTelemetryStatus;
  
  // Handlers
  submitSosReport: (report: Partial<IncidentReport>) => void;
  updateIncidentStatus: (id: string, status: IncidentReport['status'], teamId?: string, teamName?: string, notes?: string, photo?: string) => void;
  registerVolunteer: (vol: Partial<Volunteer>) => void;
  reportMissingPerson: (person: Partial<MissingPerson>) => void;
  reportRoadObstacle: (road: Partial<RoadReport>) => void;
  makeDonation: (donation: Partial<Donation>) => void;
  addCamp: (camp: Partial<ReliefCamp>) => void;
  updateNgoStock: (ngoId: string, itemKey: keyof NGOInventory['items'], count: number) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('citizen');
  const [language, setLanguage] = useState<'en' | 'as' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States
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

  useEffect(() => {
    const unsubscribe = AsdmaSyncEngine.getInstance().subscribe((newTelemetry) => {
      setTelemetry(newTelemetry);
    });

    const handleOnline = () => {
      setIsOnline(true);
      showToast('🟢 Back Online! Synchronizing offline emergency reports with ASDMA & Axom Relief servers...');
      const queue = getOfflineSosQueue();
      if (queue.length > 0) {
        queue.forEach(qReport => {
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

    const fullReport: IncidentReport = {
      id,
      reporterName: report.reporterName || 'Anonymous Citizen',
      reporterPhone: report.reporterPhone || '+91 9800000000',
      lat: report.lat || 26.1445,
      lng: report.lng || 91.7362,
      district: report.district || 'Kamrup Metropolitan',
      village: report.village || 'Guwahati Sector',
      landmark: report.landmark || '',
      disasterType: dType,
      severity: report.severity || 'critical',
      demographics: dDemo,
      needs: dNeeds,
      description: report.description || 'Emergency assistance needed.',
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
      photos: report.photos || [],
      voiceNoteUrl: report.voiceNoteUrl,
      aiVulnerabilityScore: calculateAiVulnerabilityScore(dType, dDemo, dNeeds),
      aiDuplicateFlag: dupCheck.isDuplicate
    };

    if (!isOnline) {
      saveSosToOfflineQueue(fullReport);
      showToast(`💾 Offline Mode: Report ${id} stored in local IndexedDB. Will sync when back online.`);
    } else {
      setIncidents(prev => [fullReport, ...prev]);
      showToast(`🆘 SOS Report ${id} submitted! Transmitted to ASDMA & NDRF Patgaon Control Room.`);
    }
  };

  const updateIncidentStatus = (
    id: string, 
    status: IncidentReport['status'], 
    teamId?: string, 
    teamName?: string, 
    notes?: string, 
    photo?: string
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status,
          assignedTeamId: teamId || inc.assignedTeamId,
          assignedTeamName: teamName || inc.assignedTeamName,
          rescueNotes: notes || inc.rescueNotes,
          rescuePhoto: photo || inc.rescuePhoto
        };
      }
      return inc;
    }));
    showToast(`🚁 Mission ${id} updated to status: ${status.toUpperCase()} (${teamName || 'NDRF Unit'})`);
  };

  const registerVolunteer = (vol: Partial<Volunteer>) => {
    const newVol: Volunteer = {
      id: `VOL-${Math.floor(100 + Math.random() * 900)}`,
      name: vol.name || 'Volunteer',
      phone: vol.phone || '+91 9800000000',
      email: vol.email || '',
      district: vol.district || 'Kamrup Metropolitan',
      skills: vol.skills || ['swimmer'],
      available: vol.available ?? true,
      isVerified: true,
      lat: 26.15,
      lng: 91.74,
      tasksAssigned: 0
    };
    setVolunteers(prev => [newVol, ...prev]);
    showToast(`🦺 Registered ${newVol.name} into State Volunteer Corps! ASDMA Badge Verified.`);
  };

  const reportMissingPerson = (person: Partial<MissingPerson>) => {
    const newPerson: MissingPerson = {
      id: `MP-${Math.floor(100 + Math.random() * 900)}`,
      fullName: person.fullName || 'Unknown',
      age: person.age || 30,
      gender: person.gender || 'Male',
      lastSeenLocation: person.lastSeenLocation || 'Embankment',
      district: person.district || 'Kamrup Metropolitan',
      dateMissing: person.dateMissing || new Date().toISOString().split('T')[0],
      reporterName: person.reporterName || 'Family Member',
      reporterPhone: person.reporterPhone || '+91 9800000000',
      photoUrl: person.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      status: 'missing',
      details: person.details || ''
    };
    setMissingPersons(prev => [newPerson, ...prev]);
    showToast(`🔍 Published missing person bulletin for ${newPerson.fullName}. Broadcast to rescue units.`);
  };

  const reportRoadObstacle = (road: Partial<RoadReport>) => {
    const newRoad: RoadReport = {
      id: `RD-${Math.floor(100 + Math.random() * 900)}`,
      roadName: road.roadName || 'Highway Stretch',
      district: road.district || 'Kamrup Metropolitan',
      status: road.status || 'waterlogged',
      lat: road.lat || 26.15,
      lng: road.lng || 91.75,
      details: road.details || 'Submerged under flood water',
      reportedBy: 'Citizen Telemetry',
      reportedAt: new Date().toLocaleTimeString()
    };
    setRoadReports(prev => [newRoad, ...prev]);
    showToast(`🚧 Logged road hazard on ${newRoad.roadName}. Highlighted on Live Assam Map.`);
  };

  const makeDonation = (donation: Partial<Donation>) => {
    const newDonation: Donation = {
      id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
      donorName: donation.donorName || 'Generous Donor',
      email: donation.email || '',
      phone: donation.phone || '+91 9800000000',
      amount: donation.amount,
      itemType: donation.itemType,
      itemQuantity: donation.itemQuantity,
      district: donation.district || 'Statewide',
      timestamp: new Date().toLocaleString(),
      receiptNo: `RSQ-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      paymentMethod: donation.paymentMethod || 'UPI / NetBanking'
    };
    setDonations(prev => [newDonation, ...prev]);
    showToast(`❤️ Thank you! Donation of ${newDonation.amount ? '₹' + newDonation.amount.toLocaleString() : newDonation.itemQuantity} received. E-Receipt ${newDonation.receiptNo} ready.`);
  };

  const addCamp = (camp: Partial<ReliefCamp>) => {
    const newCamp: ReliefCamp = {
      id: `CAMP-${Math.floor(10 + Math.random() * 90)}`,
      name: camp.name || 'New Relief Shelter',
      district: camp.district || 'Kamrup Metropolitan',
      capacity: camp.capacity || 500,
      currentOccupancy: camp.currentOccupancy || 0,
      lat: camp.lat || 26.18,
      lng: camp.lng || 91.76,
      food: true,
      water: true,
      medical: true,
      toilets: true,
      charging: true,
      womenFriendly: true,
      childFriendly: true,
      contactPhone: camp.contactPhone || '+91 361 200000',
      inCharge: camp.inCharge || 'District CO',
      petFriendly: true
    };
    setCamps(prev => [newCamp, ...prev]);
    showToast(`⛺ Registered new relief camp: ${newCamp.name}. Live occupancy monitoring active.`);
  };

  const updateNgoStock = (ngoId: string, itemKey: keyof NGOInventory['items'], count: number) => {
    setNgos(prev => prev.map(ngo => {
      if (ngo.id === ngoId) {
        return {
          ...ngo,
          items: { ...ngo.items, [itemKey]: count },
          lastUpdated: new Date().toLocaleTimeString()
        };
      }
      return ngo;
    }));
  };

  const t = (key: string) => key;

  return (
    <AppContext.Provider value={{
      role, setRole,
      language, setLanguage,
      activeTab, setActiveTab,
      incidents, camps, volunteers, ngos, missingPersons, roadReports, alerts, donations,
      isSosModalOpen, setIsSosModalOpen,
      isAuthModalOpen, setIsAuthModalOpen,
      isAiDrawerOpen, setIsAiDrawerOpen,
      isOnline, toastMessage, showToast,
      telemetry,
      submitSosReport,
      updateIncidentStatus,
      registerVolunteer,
      reportMissingPerson,
      reportRoadObstacle,
      makeDonation,
      addCamp,
      updateNgoStock,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
