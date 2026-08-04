import { IncidentReport, ReliefCamp, DisasterAlert, NGOInventory } from '../types';

export interface LiveTelemetryStatus {
  lastSyncedAt: string;
  asdmaServerStatus: 'ONLINE' | 'SYNCING' | 'OFFLINE';
  axomReliefStatus: 'CONNECTED' | 'DISCONNECTED';
  activeRiverGauges: {
    station: string;
    waterLevelMeter: number;
    dangerLevelMeter: number;
    trend: 'RISING' | 'STABLE' | 'FALLING';
  }[];
  totalAffectedPopulation: number;
  activeDisasterCount: number;
}

export const AXOM_RELIEF_EMERGENCY_DATA = {
  platformName: "Axom Relief Network (Axom Stands Together)",
  websiteUrl: "https://www.axomrelief.com/",
  stateHelplines: [
    { label: "ASDMA State Control Room", phone: "1070" },
    { label: "District Control Room Helpline", phone: "1077" },
    { label: "Axom Relief Emergency Dispatch", phone: "+91 361 2237011" },
    { label: "NDRF 1st Bn Patgaon Control", phone: "+91 361 2840140" },
    { label: "Assam 108 Emergency Ambulance", phone: "108" }
  ],
  verifiedDistrictsCovered: [
    "Kamrup Metropolitan", "Dibrugarh", "Cachar", "Barpeta", 
    "Darrang", "Dhemaji", "Dhubri", "Jorhat", "Lakhimpur", 
    "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia"
  ]
};

// Initial live river telemetry gauges
export const INITIAL_RIVER_GAUGES = [
  { station: 'Guwahati (Brahmaputra)', waterLevelMeter: 50.12, dangerLevelMeter: 49.68, trend: 'RISING' as const },
  { station: 'Dibrugarh (Brahmaputra)', waterLevelMeter: 106.10, dangerLevelMeter: 105.70, trend: 'RISING' as const },
  { station: 'Silchar (Barak River)', waterLevelMeter: 20.35, dangerLevelMeter: 19.83, trend: 'STABLE' as const },
  { station: 'Nematighat (Jorhat)', waterLevelMeter: 86.42, dangerLevelMeter: 85.54, trend: 'RISING' as const },
  { station: 'Tezpur (Sonitpur)', waterLevelMeter: 65.80, dangerLevelMeter: 65.23, trend: 'FALLING' as const }
];

// Live ASDMA Live Sync Simulator
export class AsdmaSyncEngine {
  private static instance: AsdmaSyncEngine;
  private listeners: ((telemetry: LiveTelemetryStatus) => void)[] = [];
  private currentTelemetry: LiveTelemetryStatus;
  private intervalId: any = null;

  private constructor() {
    this.currentTelemetry = {
      lastSyncedAt: new Date().toLocaleTimeString(),
      asdmaServerStatus: 'ONLINE',
      axomReliefStatus: 'CONNECTED',
      activeRiverGauges: INITIAL_RIVER_GAUGES,
      totalAffectedPopulation: 241580,
      activeDisasterCount: 14
    };

    this.startLiveSync();
  }

  public static getInstance(): AsdmaSyncEngine {
    if (!AsdmaSyncEngine.instance) {
      AsdmaSyncEngine.instance = new AsdmaSyncEngine();
    }
    return AsdmaSyncEngine.instance;
  }

  public subscribe(callback: (telemetry: LiveTelemetryStatus) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentTelemetry);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public getTelemetry(): LiveTelemetryStatus {
    return this.currentTelemetry;
  }

  private startLiveSync() {
    if (this.intervalId) return;

    // Simulate live WebSocket/REST sync every 15 seconds from ASDMA + Axom Relief
    this.intervalId = setInterval(() => {
      // Small real-time fluctuations
      const deltaPopulation = Math.floor(Math.random() * 20) - 5;
      const updatedGauges = this.currentTelemetry.activeRiverGauges.map(g => {
        const delta = (Math.random() * 0.04 - 0.02);
        const newLevel = parseFloat((g.waterLevelMeter + delta).toFixed(2));
        return {
          ...g,
          waterLevelMeter: newLevel,
          trend: delta > 0 ? ('RISING' as const) : delta < 0 ? ('FALLING' as const) : ('STABLE' as const)
        };
      });

      this.currentTelemetry = {
        ...this.currentTelemetry,
        lastSyncedAt: new Date().toLocaleTimeString(),
        totalAffectedPopulation: Math.max(200000, this.currentTelemetry.totalAffectedPopulation + deltaPopulation),
        activeRiverGauges: updatedGauges
      };

      this.notifyListeners();
    }, 15000);
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.currentTelemetry));
  }
}
