export type LoadStatus = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
export type FeatureType = 'WAB' | 'NORM'; // Wheelchair Accessible Bus

export interface NextBusArrival {
  estimatedArrival: string; // ISO string or relative time
  estimatedMinutes: number; // e.g. 0 for Arr, 3, 7
  load: LoadStatus;
  feature: FeatureType;
  type: BusType;
  latitude?: number;
  longitude?: number;
  visitNumber: number;
  originCode: string;
  destinationCode: string;
}

export interface BusServiceArrival {
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS'; // SBS Transit, SMRT, Tower Transit, Go-Ahead Singapore
  nextBus: NextBusArrival;
  nextBus2?: NextBusArrival;
  nextBus3?: NextBusArrival;
  inDelay?: boolean;
  delayMinutes?: number;
  delayReason?: string;
}

export interface BusStop {
  code: string; // 5-digit code e.g. "09048"
  name: string; // e.g. "Orchard Stn/Lucky Plaza"
  road: string; // e.g. "Orchard Rd"
  latitude: number;
  longitude: number;
  mrtInterchange?: {
    name: string;
    lines: Array<'NSL' | 'EWL' | 'NEL' | 'CCL' | 'DTL' | 'TEL'>;
  };
  services: string[]; // List of services calling here
}

export interface LiveBus {
  id: string;
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  latitude: number;
  longitude: number;
  heading: number; // in degrees
  speedKmH: number;
  type: BusType;
  load: LoadStatus;
  feature: FeatureType;
  currentStopCode: string;
  nextStopCode: string;
  targetStopCode?: string;
  destination: string;
  routeProgressIndex: number; // index along route coordinates
}

export interface ServiceAlert {
  id: string;
  services: string[];
  severity: 'minor' | 'moderate' | 'severe';
  category: 'congestion' | 'breakdown' | 'diversion' | 'weather' | 'bunching';
  title: string;
  description: string;
  affectedRoads: string[];
  reportedAt: string;
  estimatedDelayMinutes: number;
}

export interface UserAlarm {
  id: string;
  stopCode: string;
  stopName: string;
  serviceNo: string;
  triggerMinutes: number; // notify when <= this minutes
  soundEnabled: boolean;
  notificationEnabled: boolean;
  triggered: boolean;
  createdAt: number;
}
