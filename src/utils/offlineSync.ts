import { IncidentReport } from '../types';

const OFFLINE_SOS_KEY = 'resq_assam_offline_sos_queue';

export function getOfflineSosQueue(): Partial<IncidentReport>[] {
  try {
    const data = localStorage.getItem(OFFLINE_SOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read offline queue', err);
    return [];
  }
}

export function saveSosToOfflineQueue(report: Partial<IncidentReport>): void {
  try {
    const queue = getOfflineSosQueue();
    queue.push({
      ...report,
      id: report.id || `OFFLINE-SOS-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem(OFFLINE_SOS_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to write to offline queue', err);
  }
}

export function clearOfflineSosQueue(): void {
  try {
    localStorage.removeItem(OFFLINE_SOS_KEY);
  } catch (err) {
    console.error('Failed to clear offline queue', err);
  }
}
