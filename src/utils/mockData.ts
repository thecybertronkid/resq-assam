import { IncidentReport, ReliefCamp, Volunteer, NGOInventory, MissingPerson, RoadReport, DisasterAlert, Donation } from '../types';

export const ASSAM_DISTRICTS = [
  'Kamrup Metropolitan',
  'Kamrup Rural',
  'Cachar',
  'Dibrugarh',
  'Jorhat',
  'Lakhimpur',
  'Dhemaji',
  'Barpeta',
  'Nagaon',
  'Morigaon',
  'Tinsukia',
  'Golaghat',
  'Sonitpur',
  'Nalbari',
  'Chirang',
  'Dhubri',
  'Karimganj',
  'Hailakandi',
  'Bongaigaon',
  'Sivasagar',
  'Goalpara',
  'Baksa',
  'Udalguri',
  'Darrang',
  'Biswanath',
  'Hojai',
  'Majuli',
  'South Salmara-Mankachar',
  'West Karbi Anglong',
  'Karbi Anglong',
  'Dima Hasao'
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'SOS-8921',
    reporterName: 'Biren Gogoi',
    reporterPhone: '+91 98640 12345',
    lat: 26.1445,
    lng: 91.7362,
    district: 'Kamrup Metropolitan',
    village: 'Chandrapur Village',
    landmark: 'Near Chandrapur High School',
    disasterType: 'flood',
    severity: 'critical',
    demographics: {
      adults: 3,
      children: 4,
      elderly: 2,
      disabled: 1,
      pregnant: 1,
      animals: 5
    },
    needs: {
      food: true,
      water: true,
      medicine: true,
      boat: true,
      evacuation: true,
      livestock: true
    },
    description: 'Brahmaputra water entered rooftop level. 11 people trapped on terrace including a pregnant woman and 2 bedridden elders. Water level rising fast.',
    photos: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80'
    ],
    timestamp: '10 mins ago',
    status: 'rescuing',
    assignedTeamId: 'NDRF-TEAM-01',
    assignedTeamName: '1st Bn NDRF Patgaon (Boat Unit 3)',
    aiVulnerabilityScore: 96,
    rescueNotes: 'Boat Unit 3 deployed from Chandrapur Ghat. Rescue ongoing.'
  },
  {
    id: 'SOS-8922',
    reporterName: 'Sunita Das',
    reporterPhone: '+91 94350 98765',
    lat: 27.4728,
    lng: 94.9120,
    district: 'Dibrugarh',
    village: 'Rohmoria Panchayat',
    landmark: 'Near Embankment Breach Point',
    disasterType: 'erosion',
    severity: 'critical',
    demographics: {
      adults: 5,
      children: 3,
      elderly: 1,
      disabled: 0,
      pregnant: 0,
      animals: 12
    },
    needs: {
      food: true,
      water: true,
      medicine: false,
      boat: true,
      evacuation: true,
      livestock: true
    },
    description: 'Riverbank erosion collapsed 3 houses. Need immediate evacuation boat for families and livestock stranded on mud bank.',
    photos: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
    ],
    timestamp: '25 mins ago',
    status: 'en_route',
    assignedTeamId: 'SDRF-DIB-02',
    assignedTeamName: 'Dibrugarh SDRF Deep Rescue Unit',
    aiVulnerabilityScore: 88
  },
  {
    id: 'SOS-8923',
    reporterName: 'Anil Paul',
    reporterPhone: '+91 97061 55432',
    lat: 24.8333,
    lng: 92.7789,
    district: 'Cachar',
    village: 'Tarapur Colony',
    landmark: 'Behind Tarapur Railway Station',
    disasterType: 'flood',
    severity: 'high',
    demographics: {
      adults: 4,
      children: 2,
      elderly: 2,
      disabled: 1,
      pregnant: 0,
      animals: 2
    },
    needs: {
      food: true,
      water: true,
      medicine: true,
      boat: false,
      evacuation: false,
      livestock: false
    },
    description: 'Waterlogged house with 4 feet standing water. Need insulin supply for diabetic elderly and dry baby milk formula.',
    photos: [],
    timestamp: '45 mins ago',
    status: 'accepted',
    assignedTeamId: 'VOL-CACHAR-05',
    assignedTeamName: 'Silchar Medical Relief Corps',
    aiVulnerabilityScore: 82
  },
  {
    id: 'SOS-8924',
    reporterName: 'Jatin Deka',
    reporterPhone: '+91 99541 33211',
    lat: 26.6852,
    lng: 92.8360,
    district: 'Lakhimpur',
    village: 'Bihpuria Ward 4',
    landmark: 'Subansiri river embankment km 14',
    disasterType: 'landslide',
    severity: 'high',
    demographics: {
      adults: 2,
      children: 1,
      elderly: 0,
      disabled: 0,
      pregnant: 0,
      animals: 0
    },
    needs: {
      food: false,
      water: false,
      medicine: false,
      boat: false,
      evacuation: true,
      livestock: false
    },
    description: 'Mudslide partially blocked house entrance. Road connection cut off.',
    photos: [],
    timestamp: '1 hour ago',
    status: 'pending',
    aiVulnerabilityScore: 68
  }
];

export const INITIAL_RELIEF_CAMPS: ReliefCamp[] = [
  {
    id: 'CAMP-01',
    name: 'Guwahati Commerce College Shelter',
    district: 'Kamrup Metropolitan',
    lat: 26.1820,
    lng: 91.7780,
    capacity: 1200,
    currentOccupancy: 840,
    food: true,
    water: true,
    medical: true,
    toilets: true,
    charging: true,
    womenFriendly: true,
    childFriendly: true,
    petFriendly: true,
    contactPhone: '+91 361 2234001',
    inCharge: 'Dr. Mukul Hazarika (ADC)'
  },
  {
    id: 'CAMP-02',
    name: 'Dibrugarh Indoor Stadium Complex',
    district: 'Dibrugarh',
    lat: 27.4780,
    lng: 94.9080,
    capacity: 1500,
    currentOccupancy: 1120,
    food: true,
    water: true,
    medical: true,
    toilets: true,
    charging: true,
    womenFriendly: true,
    childFriendly: true,
    petFriendly: false,
    contactPhone: '+91 373 2321900',
    inCharge: 'Pranjal Dutta (CO)'
  },
  {
    id: 'CAMP-03',
    name: 'Silchar Circuit House Safe Zone',
    district: 'Cachar',
    lat: 24.8250,
    lng: 92.8000,
    capacity: 900,
    currentOccupancy: 750,
    food: true,
    water: true,
    medical: true,
    toilets: true,
    charging: false,
    womenFriendly: true,
    childFriendly: true,
    petFriendly: true,
    contactPhone: '+91 3842 245100',
    inCharge: 'Debolina Roy (Circle Officer)'
  },
  {
    id: 'CAMP-04',
    name: 'Barpeta Higher Secondary School Camp',
    district: 'Barpeta',
    lat: 26.3200,
    lng: 91.0000,
    capacity: 2000,
    currentOccupancy: 1680,
    food: true,
    water: true,
    medical: true,
    toilets: true,
    charging: true,
    womenFriendly: true,
    childFriendly: true,
    petFriendly: true,
    contactPhone: '+91 3665 252200',
    inCharge: 'Hitesh Baishya'
  }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'VOL-101',
    name: 'Rupam Saikia',
    phone: '+91 98540 11223',
    email: 'rupam.saikia@gmail.com',
    district: 'Kamrup Metropolitan',
    skills: ['swimmer', 'boat_operator'],
    available: true,
    isVerified: true,
    lat: 26.1500,
    lng: 91.7400,
    tasksAssigned: 4
  },
  {
    id: 'VOL-102',
    name: 'Dr. Preeti Sharma',
    phone: '+91 94351 44556',
    email: 'dr.preeti@gmch.gov.in',
    district: 'Kamrup Metropolitan',
    skills: ['doctor'],
    available: true,
    isVerified: true,
    lat: 26.1600,
    lng: 91.7700,
    tasksAssigned: 12
  },
  {
    id: 'VOL-103',
    name: 'Manish Borah',
    phone: '+91 97060 77889',
    email: 'm.borah@gmail.com',
    district: 'Dibrugarh',
    skills: ['drone_pilot', 'logistics'],
    available: true,
    isVerified: true,
    lat: 27.4700,
    lng: 94.9100,
    tasksAssigned: 7
  },
  {
    id: 'VOL-104',
    name: 'Dr. Kaushik Nath (Vet)',
    phone: '+91 98642 99001',
    email: 'kaushik.vet@gmail.com',
    district: 'Golaghat',
    skills: ['animal_rescue', 'doctor'],
    available: true,
    isVerified: true,
    lat: 26.5100,
    lng: 93.9600,
    tasksAssigned: 9
  }
];

export const INITIAL_NGO_INVENTORIES: NGOInventory[] = [
  {
    id: 'NGO-01',
    ngoName: 'Assam Floods Relief Foundation (AFRF)',
    district: 'Kamrup Metropolitan',
    contactPhone: '+91 98640 55000',
    items: {
      foodPacks: 15400,
      waterLitres: 45000,
      medicines: 2500,
      blankets: 3200,
      mosquitoNets: 4800,
      animalFeedKg: 12000
    },
    lastUpdated: '15 mins ago',
    distributionCount: 8900
  },
  {
    id: 'NGO-02',
    ngoName: 'Barak Valley Relief Society',
    district: 'Cachar',
    contactPhone: '+91 3842 220011',
    items: {
      foodPacks: 8200,
      waterLitres: 28000,
      medicines: 1200,
      blankets: 1800,
      mosquitoNets: 2100,
      animalFeedKg: 5000
    },
    lastUpdated: '1 hour ago',
    distributionCount: 4300
  }
];

export const INITIAL_MISSING_PERSONS: MissingPerson[] = [
  {
    id: 'MIS-401',
    fullName: 'Jibon Kalita',
    age: 68,
    gender: 'Male',
    lastSeenLocation: 'Near Sukreswar Temple Ghat, Guwahati',
    district: 'Kamrup Metropolitan',
    dateMissing: '2026-08-03',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'missing',
    reporterName: 'Anup Kalita (Son)',
    reporterPhone: '+91 98640 77112',
    details: 'Wearing white kurta pajama. Hard of hearing. Separated during sudden water rush at ghat.'
  },
  {
    id: 'MIS-402',
    fullName: 'Pooja Baruah',
    age: 14,
    gender: 'Female',
    lastSeenLocation: 'Bihpuria High School Relief Camp',
    district: 'Lakhimpur',
    dateMissing: '2026-08-02',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    status: 'found_safe',
    reporterName: 'Hemanta Baruah',
    reporterPhone: '+91 94350 11998',
    details: 'FOUND SAFE at North Lakhimpur Civil Hospital Medical Ward.'
  }
];

export const INITIAL_ROAD_REPORTS: RoadReport[] = [
  {
    id: 'RD-101',
    roadName: 'Guwahati - Shillong Road (GS Road near Khanapara)',
    district: 'Kamrup Metropolitan',
    lat: 26.1150,
    lng: 91.8020,
    status: 'waterlogged',
    details: '3 feet waist-high standing water. Light vehicles cannot pass. Rescue trucks passing slowly.',
    reportedAt: '30 mins ago',
    reportedBy: 'Traffic Control Room'
  },
  {
    id: 'RD-102',
    roadName: 'National Highway 37 (Jorhat to Dibrugarh stretch)',
    district: 'Golaghat',
    lat: 26.5200,
    lng: 93.9700,
    status: 'bridge_collapse',
    details: 'Culvert bridge submerged and damaged by overflow of Dhansiri river. Traffic diverted via Golaghat bypass.',
    reportedAt: '2 hours ago',
    reportedBy: 'PWD Assam'
  },
  {
    id: 'RD-103',
    roadName: 'Haflong - Silchar Hill Highway',
    district: 'Dima Hasao',
    lat: 25.1800,
    lng: 93.0200,
    status: 'landslide',
    details: 'Major mudslide blocked both lanes. JCB excavators deployed. Clearing expected by evening.',
    reportedAt: '3 hours ago',
    reportedBy: 'Dima Hasao Disaster Cell'
  }
];

export const INITIAL_ALERTS: DisasterAlert[] = [
  {
    id: 'ALT-901',
    title: 'RED ALERT: Brahmaputra River Above Danger Level in Guwahati & Dibrugarh',
    type: 'flood',
    riverLevel: '49.88m (Danger Mark: 49.68m) - RISING',
    damStatus: 'Kurichhu Dam discharge 1,200 cumecc',
    severity: 'critical',
    district: 'Kamrup Metropolitan',
    issuedAt: 'Just now',
    description: 'Brahmaputra and Kopili rivers are flowing 0.5m above danger level. Low-lying areas in Guwahati, Morigaon, and Barpeta issued mandatory evacuation advisory.',
    actionRequired: 'Move immediately to elevated relief shelters or RCC school buildings.'
  },
  {
    id: 'ALT-902',
    title: 'ORANGE ALERT: Subansiri Hydroelectric Dam Controlled Discharge Warning',
    type: 'flood',
    damStatus: 'Subansiri Lower Hydro Spillway Gates 2 & 3 opened',
    severity: 'high',
    district: 'Lakhimpur',
    issuedAt: '40 mins ago',
    description: 'Discharge rate increased by 800 cusecs due to heavy catchment rainfall in Arunachal Pradesh. Dhemaji and Lakhimpur riverbanks on high alert.',
    actionRequired: 'Move riverine cattle and fishing boats away from embankments.'
  },
  {
    id: 'ALT-903',
    title: 'FLASH LANDSLIDE WARNING: Dima Hasao & Karbi Anglong Hills',
    type: 'landslide',
    severity: 'high',
    district: 'Dima Hasao',
    issuedAt: '1 hour ago',
    description: 'Extremely heavy continuous rainfall (140mm in 6h) triggering mudslides on hill slopes.',
    actionRequired: 'Avoid night travel on hill highways.'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'DON-5501',
    donorName: 'Rahul Sengupta',
    email: 'rahul.s@gmail.com',
    phone: '+91 98300 12345',
    amount: 10000,
    district: 'Kamrup Metropolitan',
    timestamp: '2 hours ago',
    receiptNo: 'RSQ-2026-90412',
    paymentMethod: 'UPI (GooglePay)'
  },
  {
    id: 'DON-5502',
    donorName: 'Tech Assam Welfare Club',
    email: 'contact@techassam.org',
    phone: '+91 94350 44332',
    itemType: 'Water Purifier Kits',
    itemQuantity: '250 Units',
    district: 'Cachar',
    timestamp: '4 hours ago',
    receiptNo: 'RSQ-2026-90413',
    paymentMethod: 'In-Kind Item Donation'
  }
];
