import { IncidentReport, ReliefCamp, Volunteer, NGOInventory, MissingPerson, RoadReport, DisasterAlert, Donation } from '../types';

const DB_NAME = 'ResQAssamDB';
const DB_VERSION = 1;

/**
 * Native IndexedDB Service for ResQ Assam Platform
 * Provides persistent local database storage across browser sessions and reloads.
 */
class DatabaseService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Incidents store
        if (!db.objectStoreNames.contains('incidents')) {
          const store = db.createObjectStore('incidents', { keyPath: 'id' });
          store.createIndex('district', 'district', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('severity', 'severity', { unique: false });
        }

        // Relief Camps store
        if (!db.objectStoreNames.contains('camps')) {
          const store = db.createObjectStore('camps', { keyPath: 'id' });
          store.createIndex('district', 'district', { unique: false });
        }

        // Volunteers store
        if (!db.objectStoreNames.contains('volunteers')) {
          const store = db.createObjectStore('volunteers', { keyPath: 'id' });
          store.createIndex('district', 'district', { unique: false });
          store.createIndex('isVerified', 'isVerified', { unique: false });
        }

        // NGO Inventories store
        if (!db.objectStoreNames.contains('ngos')) {
          db.createObjectStore('ngos', { keyPath: 'id' });
        }

        // Missing Persons store
        if (!db.objectStoreNames.contains('missingPersons')) {
          const store = db.createObjectStore('missingPersons', { keyPath: 'id' });
          store.createIndex('district', 'district', { unique: false });
        }

        // Road Reports store
        if (!db.objectStoreNames.contains('roadReports')) {
          const store = db.createObjectStore('roadReports', { keyPath: 'id' });
          store.createIndex('district', 'district', { unique: false });
        }

        // Disaster Alerts store
        if (!db.objectStoreNames.contains('alerts')) {
          db.createObjectStore('alerts', { keyPath: 'id' });
        }

        // Donations store
        if (!db.objectStoreNames.contains('donations')) {
          const store = db.createObjectStore('donations', { keyPath: 'id' });
          store.createIndex('receiptNo', 'receiptNo', { unique: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // Generic Save / Put
  async saveItem<T>(storeName: string, item: T): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`DB Save error in ${storeName}:`, err);
    }
  }

  // Generic Get All
  async getAllItems<T>(storeName: string): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`DB GetAll error in ${storeName}:`, err);
      return [];
    }
  }

  // Incidents CRUD
  async saveIncident(incident: IncidentReport): Promise<void> {
    return this.saveItem('incidents', incident);
  }
  async getIncidents(): Promise<IncidentReport[]> {
    return this.getAllItems<IncidentReport>('incidents');
  }

  // Relief Camps CRUD
  async saveCamp(camp: ReliefCamp): Promise<void> {
    return this.saveItem('camps', camp);
  }
  async getCamps(): Promise<ReliefCamp[]> {
    return this.getAllItems<ReliefCamp>('camps');
  }

  // Volunteers CRUD
  async saveVolunteer(vol: Volunteer): Promise<void> {
    return this.saveItem('volunteers', vol);
  }
  async getVolunteers(): Promise<Volunteer[]> {
    return this.getAllItems<Volunteer>('volunteers');
  }

  // NGO Inventories CRUD
  async saveNGO(ngo: NGOInventory): Promise<void> {
    return this.saveItem('ngos', ngo);
  }
  async getNGOs(): Promise<NGOInventory[]> {
    return this.getAllItems<NGOInventory>('ngos');
  }

  // Missing Persons CRUD
  async saveMissingPerson(person: MissingPerson): Promise<void> {
    return this.saveItem('missingPersons', person);
  }
  async getMissingPersons(): Promise<MissingPerson[]> {
    return this.getAllItems<MissingPerson>('missingPersons');
  }

  // Road Reports CRUD
  async saveRoadReport(report: RoadReport): Promise<void> {
    return this.saveItem('roadReports', report);
  }
  async getRoadReports(): Promise<RoadReport[]> {
    return this.getAllItems<RoadReport>('roadReports');
  }

  // Disaster Alerts CRUD
  async saveAlert(alert: DisasterAlert): Promise<void> {
    return this.saveItem('alerts', alert);
  }
  async getAlerts(): Promise<DisasterAlert[]> {
    return this.getAllItems<DisasterAlert>('alerts');
  }

  // Donations CRUD
  async saveDonation(donation: Donation): Promise<void> {
    return this.saveItem('donations', donation);
  }
  async getDonations(): Promise<Donation[]> {
    return this.getAllItems<Donation>('donations');
  }
}

export const dbService = new DatabaseService();
