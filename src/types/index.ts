export type UserRole = 'citizen' | 'rescue' | 'volunteer' | 'ngo' | 'admin';

export type DisasterType = 'flood' | 'landslide' | 'erosion' | 'storm' | 'earthquake' | 'other';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'submitted' | 'verified' | 'accepted' | 'en_route' | 'rescuing' | 'completed' | 'cancelled';

export interface Demographics {
  adults: number;
  children: number;
  elderly: number;
  disabled: number;
  pregnant: number;
  animals: number;
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  lat: number;
  lng: number;
  district: string;
  village: string;
  landmark: string;
  disasterType: DisasterType;
  severity: IncidentSeverity;
  demographics: Demographics;
  needs: {
    food: boolean;
    water: boolean;
    medicine: boolean;
    boat: boolean;
    evacuation: boolean;
    livestock: boolean;
  };
  description: string;
  voiceNoteUrl?: string;
  photos: string[];
  status: IncidentStatus;
  aiVulnerabilityScore: number; // 1 - 100
  isAiDuplicate?: boolean;
  duplicateMatchedId?: string;
  createdAt: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  rescuePhotoProof?: string;
}

export interface ReliefCamp {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  contactPhone: string;
  amenities: {
    foodWater: boolean;
    medicalBay: boolean;
    womenChildSafe: boolean;
    petFriendly: boolean;
    powerBackup: boolean;
  };
  inCharge: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  serviceableArea?: string;
  skills: ('swimmer' | 'doctor' | 'nurse' | 'boat_operator' | 'driver' | 'drone_pilot' | 'animal_rescue' | 'logistics')[];
  available: boolean;
  isVerified: boolean;
  lat?: number;
  lng?: number;
  idProofUrl?: string;
  tasksAssigned: number;
}

export interface NGOInventory {
  id: string;
  ngoName: string;
  district: string;
  contactPhone: string;
  items: {
    foodPacks: number;
    waterLitres: number;
    medicines: number;
    blankets: number;
    mosquitoNets: number;
    animalFeedKg: number;
  };
  lastUpdated: string;
  distributionCount: number;
}

export interface MissingPerson {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastSeenLocation: string;
  district: string;
  dateMissing: string;
  photoUrl: string;
  status: 'missing' | 'found_safe' | 'hospitalized' | 'deceased';
  reporterName: string;
  reporterPhone: string;
  details: string;
}

export interface RoadReport {
  id: string;
  roadName: string;
  district: string;
  lat: number;
  lng: number;
  status: 'open' | 'waterlogged' | 'tree_fallen' | 'bridge_collapse' | 'landslide' | 'boat_required' | 'closed';
  details: string;
  reportedAt: string;
  reportedBy: string;
  photoUrl?: string;
  telemetrics?: {
    waterDepthFeet: number;
    waterDepthMeters: number;
    obstacleType: string;
    structuralRiskScore: number;
  };
}

export interface DisasterAlert {
  id: string;
  title: string;
  type: DisasterType;
  riverLevel?: string;
  damStatus?: string;
  severity: IncidentSeverity;
  district: string;
  issuedAt: string;
  description: string;
  actionRequired: string;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount?: number;
  itemType?: string;
  itemQuantity?: string;
  district: string;
  timestamp: string;
  receiptNo: string;
}
