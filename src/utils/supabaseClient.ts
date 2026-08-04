import { IncidentReport, ReliefCamp, Volunteer, NGOInventory, MissingPerson, RoadReport, DisasterAlert, Donation } from '../types';

export const SUPABASE_URL = 'https://obzvgpvvkjdhlsuqlbxf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ienZncHZ2a2pkaGxzdXFsYnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MzQzNzQsImV4cCI6MjEwMTQxMDM3NH0._o-NI3GjIOzjF0SbZC9doqhk0pJjmEwsgOlorxUeJsg';
export const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ienZncHZ2a2pkaGxzdXFsYnhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTgzNDM3NCwiZXhwIjoyMTAxNDEwMzc0fQ.kIAXtNxO7RFsm_kjml8floqbnK8Sve7FisOBYjWRzgY';

/**
 * Direct REST Supabase Client Engine for ResQ Assam
 * Synchronizes emergency telemetry directly with Supabase PostgreSQL cloud database.
 */
class SupabaseClient {
  private url: string = SUPABASE_URL;
  private key: string = SUPABASE_ANON_KEY;

  private getHeaders() {
    return {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // Insert or Upsert Item into Supabase Table
  async upsertTable<T>(table: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (err) {
      console.warn(`Supabase upsert warning for table ${table}:`, err);
      return false;
    }
  }

  // Fetch All Items from Supabase Table
  async fetchTable<T>(table: string): Promise<T[]> {
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}?select=*`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        return data as T[];
      }
      return [];
    } catch (err) {
      console.warn(`Supabase fetch warning for table ${table}:`, err);
      return [];
    }
  }

  // Helper Mappers for ResQ Assam Tables
  async syncIncident(incident: IncidentReport) {
    return this.upsertTable('incidents', {
      id: incident.id,
      reporter_name: incident.reporterName,
      reporter_phone: incident.reporterPhone,
      lat: incident.lat,
      lng: incident.lng,
      district: incident.district,
      village: incident.village,
      landmark: incident.landmark,
      disaster_type: incident.disasterType,
      severity: incident.severity,
      demographics: incident.demographics,
      needs: incident.needs,
      description: incident.description,
      status: incident.status,
      ai_vulnerability_score: incident.aiVulnerabilityScore,
      is_ai_duplicate: incident.isAiDuplicate || false,
      assigned_team_id: incident.assignedTeamId,
      assigned_team_name: incident.assignedTeamName,
      photos: incident.photos,
      voice_note_url: incident.voiceNoteUrl,
      rescue_photo_proof: incident.rescuePhotoProof
    });
  }

  async syncVolunteer(vol: Volunteer) {
    return this.upsertTable('volunteers', {
      id: vol.id,
      name: vol.name,
      phone: vol.phone,
      email: vol.email,
      district: vol.district,
      serviceable_area: vol.serviceableArea,
      skills: vol.skills,
      available: vol.available,
      is_verified: vol.isVerified,
      tasks_assigned: vol.tasksAssigned
    });
  }

  async syncDonation(don: Donation) {
    return this.upsertTable('donations', {
      id: don.id,
      receipt_no: don.receiptNo,
      donor_name: don.donorName,
      email: don.email,
      phone: don.phone,
      amount: don.amount,
      item_type: don.itemType,
      item_quantity: don.itemQuantity,
      district: don.district,
      payment_method: 'Razorpay Live'
    });
  }
}

export const supabaseClient = new SupabaseClient();
