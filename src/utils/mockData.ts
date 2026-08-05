import { IncidentReport, ReliefCamp, Volunteer, NGOInventory, MissingPerson, RoadReport, DisasterAlert, Donation } from '../types';

export const ASSAM_DISTRICTS = [
  'Sivasagar',
  'Charaideo',
  'Jorhat',
  'Golaghat'
];

export const INITIAL_INCIDENTS: IncidentReport[] = [];

export const INITIAL_RELIEF_CAMPS: ReliefCamp[] = [];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'VOL-101',
    userId: 'vol_biren',
    password: 'vol123',
    name: 'Biren Gogoi',
    phone: '+91 98540 12345',
    email: 'biren.gogoi@resq.org',
    district: 'Sivasagar',
    serviceableArea: 'Sub-Div: Sivasagar Sadar • Circle: Amguri • Village/Ward: Disangmukh GP',
    skills: ['swimmer', 'boat_operator', 'doctor'],
    available: true,
    isVerified: true,
    lat: 26.9826,
    lng: 94.6425,
    tasksAssigned: 3
  },
  {
    id: 'VOL-102',
    userId: 'vol_pranjal',
    password: 'vol123',
    name: 'Pranjal Saikia',
    phone: '+91 94350 67890',
    email: 'pranjal.s@resq.org',
    district: 'Jorhat',
    serviceableArea: 'Sub-Div: Jorhat Sadar • Circle: Teok • Village/Ward: Titabor Ward 2',
    skills: ['nurse', 'driver', 'logistics'],
    available: true,
    isVerified: true,
    lat: 26.7509,
    lng: 94.2037,
    tasksAssigned: 5
  }
];

export const INITIAL_NGO_INVENTORIES: NGOInventory[] = [];

export const INITIAL_MISSING_PERSONS: MissingPerson[] = [];

export const INITIAL_ROAD_REPORTS: RoadReport[] = [];

export const INITIAL_ALERTS: DisasterAlert[] = [];

export const INITIAL_DONATIONS: Donation[] = [];
