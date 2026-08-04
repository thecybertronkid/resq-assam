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

  // Entities
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [camps, setCamps] = useState<ReliefCamp[]>(INITIAL_RELIEF_CAMPS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [ngos, setNgos] = useState<NGOInventory[]>(INITIAL_NGO_INVENTORIES);
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>(INITIAL_MISSING_PERSONS);
  const [roadReports, setRoadReports] = useState<RoadReport[]>(INITIAL_ROAD_REPORTS);
  const [alerts, setAlerts] = useState<DisasterAlert[]>(INITIAL_ALERTS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);

  // Network listener & auto offline sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('🌐 Internet reconnected! Syncing offline SOS reports...');
      syncOfflineReports();
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('⚠️ Network connection lost. Offline emergency mode active.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [incidents]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const syncOfflineReports = () => {
    const queue = getOfflineSosQueue();
    if (queue.length > 0) {
      queue.forEach(q => {
        const fullReport: IncidentReport = {
          id: q.id || `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
          reporterName: q.reporterName || 'Anonymous Citizen',
          reporterPhone: q.reporterPhone || '+91 98000 00000',
          lat: q.lat || 26.1445,
          lng: q.lng || 91.7362,
          district: q.district || 'Kamrup Metropolitan',
          village: q.village || 'Unknown Village',
          landmark: q.landmark || 'None',
          disasterType: q.disasterType || 'flood',
          severity: q.severity || 'high',
          demographics: q.demographics || { adults: 1, children: 0, elderly: 0, disabled: 0, pregnant: 0, animals: 0 },
          needs: q.needs || { food: true, water: true, medicine: false, boat: false, evacuation: false, livestock: false },
          description: q.description || 'Offline SOS auto-synced',
          photos: q.photos || [],
          timestamp: 'Just now (Synced)',
          status: 'pending',
          aiVulnerabilityScore: calculateAiVulnerabilityScore(
            q.disasterType || 'flood',
            q.demographics || { adults: 1, children: 0, elderly: 0, disabled: 0, pregnant: 0, animals: 0 },
            q.needs || { food: true, water: true, medicine: false, boat: false, evacuation: false, livestock: false }
          )
        };
        setIncidents(prev => [fullReport, ...prev]);
      });
      clearOfflineSosQueue();
      showToast(`✅ Successfully synced ${queue.length} offline report(s) to live database!`);
    }
  };

  const submitSosReport = (report: Partial<IncidentReport>) => {
    if (!isOnline) {
      saveSosToOfflineQueue(report);
      showToast('📡 Saved SOS Report locally. Will automatically dispatch when internet restores!');
      return;
    }

    const aiCheck = detectDuplicateIncident(report, incidents);
    const vulScore = calculateAiVulnerabilityScore(
      report.disasterType || 'flood',
      report.demographics || { adults: 1, children: 0, elderly: 0, disabled: 0, pregnant: 0, animals: 0 },
      report.needs || { food: true, water: true, medicine: false, boat: false, evacuation: false, livestock: false }
    );

    const newSos: IncidentReport = {
      id: `SOS-${Math.floor(8930 + Math.random() * 1000)}`,
      reporterName: report.reporterName || 'Citizen',
      reporterPhone: report.reporterPhone || '+91 98640 00000',
      lat: report.lat || 26.1445,
      lng: report.lng || 91.7362,
      district: report.district || 'Kamrup Metropolitan',
      village: report.village || 'Guwahati Ward',
      landmark: report.landmark || '',
      disasterType: report.disasterType || 'flood',
      severity: report.severity || 'high',
      demographics: report.demographics || { adults: 1, children: 0, elderly: 0, disabled: 0, pregnant: 0, animals: 0 },
      needs: report.needs || { food: true, water: true, medicine: true, boat: false, evacuation: true, livestock: false },
      description: report.description || 'Emergency assistance requested.',
      photos: report.photos || [],
      voiceNoteUrl: report.voiceNoteUrl,
      timestamp: 'Just now',
      status: 'pending',
      aiDuplicateFlag: aiCheck.isDuplicate,
      aiVulnerabilityScore: vulScore
    };

    setIncidents(prev => [newSos, ...prev]);
    showToast(
      aiCheck.isDuplicate
        ? `⚠️ SOS Submitted! Note: AI flagged potential duplicate of ${aiCheck.matchedIncidentId} (${aiCheck.confidenceScore}% confidence).`
        : `🚨 Emergency SOS dispatched! Dispatched to NDRF/SDRF control room. AI Priority Score: ${vulScore}/100.`
    );
  };

  const updateIncidentStatus = (
    id: string,
    status: IncidentReport['status'],
    teamId?: string,
    teamName?: string,
    notes?: string,
    photo?: string
  ) => {
    setIncidents(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            assignedTeamId: teamId || item.assignedTeamId,
            assignedTeamName: teamName || item.assignedTeamName,
            rescueNotes: notes || item.rescueNotes,
            rescuePhoto: photo || item.rescuePhoto
          };
        }
        return item;
      })
    );
    showToast(`Status updated for ${id} → ${status.toUpperCase()}`);
  };

  const registerVolunteer = (vol: Partial<Volunteer>) => {
    const newVol: Volunteer = {
      id: `VOL-${Math.floor(200 + Math.random() * 800)}`,
      name: vol.name || 'Volunteer',
      phone: vol.phone || '',
      email: vol.email || '',
      district: vol.district || 'Kamrup Metropolitan',
      skills: vol.skills || ['logistics'],
      available: true,
      isVerified: true,
      tasksAssigned: 0
    };
    setVolunteers(prev => [newVol, ...prev]);
    showToast(`🎉 Volunteer ${newVol.name} registered and verified!`);
  };

  const reportMissingPerson = (person: Partial<MissingPerson>) => {
    const newPerson: MissingPerson = {
      id: `MIS-${Math.floor(500 + Math.random() * 500)}`,
      fullName: person.fullName || 'Unknown',
      age: person.age || 25,
      gender: person.gender || 'Male',
      lastSeenLocation: person.lastSeenLocation || 'Unknown',
      district: person.district || 'Kamrup Metropolitan',
      dateMissing: person.dateMissing || new Date().toISOString().split('T')[0],
      photoUrl: person.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'missing',
      reporterName: person.reporterName || 'Citizen',
      reporterPhone: person.reporterPhone || '',
      details: person.details || ''
    };
    setMissingPersons(prev => [newPerson, ...prev]);
    showToast(`🚨 Missing person bulletin published for ${newPerson.fullName}`);
  };

  const reportRoadObstacle = (road: Partial<RoadReport>) => {
    const newRoad: RoadReport = {
      id: `RD-${Math.floor(300 + Math.random() * 700)}`,
      roadName: road.roadName || 'State Highway',
      district: road.district || 'Kamrup Metropolitan',
      lat: road.lat || 26.1500,
      lng: road.lng || 91.7500,
      status: road.status || 'waterlogged',
      details: road.details || 'Obstacle reported',
      reportedAt: 'Just now',
      reportedBy: road.reportedBy || 'Citizen'
    };
    setRoadReports(prev => [newRoad, ...prev]);
    showToast(`🚦 Road status alert logged for ${newRoad.roadName}`);
  };

  const makeDonation = (don: Partial<Donation>) => {
    const newDon: Donation = {
      id: `DON-${Math.floor(6000 + Math.random() * 3000)}`,
      donorName: don.donorName || 'Generous Donor',
      email: don.email || 'donor@resq.gov.in',
      phone: don.phone || '+91 98000 00000',
      amount: don.amount,
      itemType: don.itemType,
      itemQuantity: don.itemQuantity,
      district: don.district || 'Statewide',
      timestamp: 'Just now',
      receiptNo: `RSQ-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      paymentMethod: don.paymentMethod || 'UPI Instant'
    };
    setDonations(prev => [newDon, ...prev]);
    showToast(`❤️ Thank you! Donation receipt generated: ${newDon.receiptNo}`);
  };

  const addCamp = (camp: Partial<ReliefCamp>) => {
    const newCamp: ReliefCamp = {
      id: `CAMP-${Math.floor(10 + Math.random() * 90)}`,
      name: camp.name || 'New Relief Shelter',
      district: camp.district || 'Kamrup Metropolitan',
      lat: camp.lat || 26.1700,
      lng: camp.lng || 91.7600,
      capacity: camp.capacity || 500,
      currentOccupancy: camp.currentOccupancy || 0,
      food: camp.food ?? true,
      water: camp.water ?? true,
      medical: camp.medical ?? true,
      toilets: camp.toilets ?? true,
      charging: camp.charging ?? true,
      womenFriendly: camp.womenFriendly ?? true,
      childFriendly: camp.childFriendly ?? true,
      petFriendly: camp.petFriendly ?? true,
      contactPhone: camp.contactPhone || '+91 361 2000000',
      inCharge: camp.inCharge || 'District Authority'
    };
    setCamps(prev => [newCamp, ...prev]);
    showToast(`⛺ Relief Camp ${newCamp.name} registered!`);
  };

  const updateNgoStock = (ngoId: string, itemKey: keyof NGOInventory['items'], count: number) => {
    setNgos(prev =>
      prev.map(item => {
        if (item.id === ngoId) {
          return {
            ...item,
            items: {
              ...item.items,
              [itemKey]: count
            },
            lastUpdated: 'Just now'
          };
        }
        return item;
      })
    );
    showToast(`📦 Relief inventory updated!`);
  };

  // Translation helper
  const t = (textKey: string): string => {
    return textKey;
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
        incidents,
        camps,
        volunteers,
        ngos,
        missingPersons,
        roadReports,
        alerts,
        donations,
        isSosModalOpen,
        setIsSosModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isOnline,
        toastMessage,
        showToast,
        submitSosReport,
        updateIncidentStatus,
        registerVolunteer,
        reportMissingPerson,
        reportRoadObstacle,
        makeDonation,
        addCamp,
        updateNgoStock,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
