import { IncidentReport, Demographics, DisasterType } from '../types';

/**
 * Calculates distance in kilometers between two lat/lng coordinates (Haversine formula)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * AI Duplicate Report Detection:
 * Flags if an incoming report is within 0.5 km of an existing active incident
 * or shares the same village + disaster type.
 */
export function detectDuplicateIncident(
  newReport: Partial<IncidentReport>,
  existingIncidents: IncidentReport[]
): { isDuplicate: boolean; matchedIncidentId?: string; confidenceScore: number } {
  if (!newReport.lat || !newReport.lng) return { isDuplicate: false, confidenceScore: 0 };

  for (const incident of existingIncidents) {
    if (incident.status === 'completed') continue;

    const distanceKm = calculateDistanceKm(newReport.lat, newReport.lng, incident.lat, incident.lng);
    const sameVillage = newReport.village?.toLowerCase() === incident.village.toLowerCase();
    const sameDisaster = newReport.disasterType === incident.disasterType;

    if (distanceKm < 0.5 || (sameVillage && sameDisaster)) {
      const confidenceScore = distanceKm < 0.2 ? 94 : 82;
      return {
        isDuplicate: true,
        matchedIncidentId: incident.id,
        confidenceScore
      };
    }
  }

  return { isDuplicate: false, confidenceScore: 0 };
}

/**
 * AI Severity & Vulnerability Scoring Algorithm:
 * Returns score 1 to 100 based on demography weightage (children, elderly, disabled, pregnant, animals),
 * disaster type, and critical needs (boat, medical evacuation).
 */
export function calculateAiVulnerabilityScore(
  disasterType: DisasterType,
  demographics: Demographics,
  needs: IncidentReport['needs']
): number {
  let score = 25; // baseline

  // Demographics weighting
  score += demographics.children * 8;
  score += demographics.elderly * 10;
  score += demographics.disabled * 15;
  score += demographics.pregnant * 18;
  score += demographics.animals * 3;
  score += demographics.adults * 2;

  // Critical needs weighting
  if (needs.boat) score += 15;
  if (needs.evacuation) score += 12;
  if (needs.medicine) score += 10;

  // Disaster severity factor
  if (disasterType === 'flood') score += 10;
  if (disasterType === 'landslide') score += 15;
  if (disasterType === 'earthquake') score += 20;

  return Math.min(100, Math.max(1, Math.round(score)));
}

/**
 * AI Image Analysis Simulation:
 * Simulates computer vision detection for flood water depth & road obstruction.
 */
export function simulateAiImageAnalysis(imageUrl: string): {
  waterDepthFeet: number;
  obstacleType: string;
  structuralRiskScore: number;
  confidence: number;
} {
  // Deterministic mock analysis based on URL string length
  const hash = imageUrl.length;
  const waterDepthFeet = ((hash % 5) + 2) + Math.round((hash % 10) / 10 * 10) / 10;
  const obstacles = ['Tree Log Obstruction', 'Bridge Submersion', 'Mudslide Washout', 'Power Cable Hazard', 'Submerged Vehicle'];
  const obstacleType = obstacles[hash % obstacles.length];
  const structuralRiskScore = Math.min(98, 65 + (hash % 30));
  const confidence = 89 + (hash % 9);

  return {
    waterDepthFeet,
    obstacleType,
    structuralRiskScore,
    confidence
  };
}

/**
 * Multilingual Dictionary (Assamese, Hindi, English)
 */
export const TRANSLATION_DICTIONARY: Record<string, { en: string; as: string; hi: string }> = {
  'Emergency SOS': {
    en: 'Emergency SOS',
    as: 'জৰুৰীকালীন এচ-অ-এচ',
    hi: 'आपातकालीन एसओएस'
  },
  'Report Emergency': {
    en: 'Report Emergency',
    as: 'জৰুৰীকালীন ঘটনা জনাওক',
    hi: 'आपातकाल दर्ज करें'
  },
  'Live Assam Disaster Map': {
    en: 'Live Assam Disaster Map',
    as: 'অসম দুৰ্যোগৰ লাইভ মানচিত্ৰ',
    hi: 'असम आपदा लाइव मानचित्र'
  },
  'People Rescued': {
    en: 'People Rescued',
    as: 'উদ্ধাৰ কৰা লোক',
    hi: 'सुरक्षित बचाए गए लोग'
  },
  'Active Incidents': {
    en: 'Active Incidents',
    as: 'সক্ৰিয় ঘটনা',
    hi: 'सक्रिय घटनाएं'
  },
  'Relief Camps': {
    en: 'Relief Camps',
    as: 'ত্রাণ শিৱিৰ',
    hi: 'राहत शिविर'
  },
  'Volunteers Active': {
    en: 'Volunteers Active',
    as: 'সক্ৰিয় স্বেচ্ছাসেৱক',
    hi: 'सक्रिय स्वयंसेवक'
  },
  'Join as Volunteer': {
    en: 'Join as Volunteer',
    as: 'স্বেচ্ছাসেৱক হিচাপে যোগদান কৰক',
    hi: 'स्वयंसेवक के रूप में जुड़ें'
  },
  'Donate Relief': {
    en: 'Donate Relief',
    as: 'ত্রাণ দান কৰক',
    hi: 'राहत दान करें'
  }
};
