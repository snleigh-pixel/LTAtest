import { BusStop, ServiceAlert, LiveBus, BusServiceArrival, LoadStatus, BusType } from '../types/bus';

// Major Singapore Bus Stops with authentic 5-digit LTA codes, coordinates, and MRT connections
export const SINGAPORE_BUS_STOPS: BusStop[] = [
  // Orchard & Somerset Corridor
  {
    code: '09048',
    name: 'Orchard Stn / Tangs',
    road: 'Orchard Rd',
    latitude: 1.3045,
    longitude: 103.8329,
    mrtInterchange: { name: 'Orchard', lines: ['NSL', 'TEL'] },
    services: ['7', '14', '65', '106', '174', '190', '502'],
  },
  {
    code: '09022',
    name: 'Lucky Plaza / ION Orchard',
    road: 'Orchard Rd',
    latitude: 1.3039,
    longitude: 103.8344,
    mrtInterchange: { name: 'Orchard', lines: ['NSL', 'TEL'] },
    services: ['7', '14', '65', '106', '174', '190'],
  },
  {
    code: '08138',
    name: 'Somerset Stn / 313@Somerset',
    road: 'Orchard Rd',
    latitude: 1.3009,
    longitude: 103.8385,
    mrtInterchange: { name: 'Somerset', lines: ['NSL'] },
    services: ['7', '14', '65', '106', '174', '190', '502'],
  },
  {
    code: '08057',
    name: 'Dhoby Ghaut Stn Exit B',
    road: 'Orchard Rd',
    latitude: 1.2988,
    longitude: 103.8456,
    mrtInterchange: { name: 'Dhoby Ghaut', lines: ['NSL', 'NEL', 'CCL'] },
    services: ['7', '14', '65', '106', '166', '174', '190'],
  },

  // Bugis & Central Civic District
  {
    code: '01112',
    name: 'Bugis Stn Exit A / Bugis Junction',
    road: 'Victoria St',
    latitude: 1.3005,
    longitude: 103.8561,
    mrtInterchange: { name: 'Bugis', lines: ['EWL', 'DTL'] },
    services: ['12', '33', '130', '133', '145', '197', '851'],
  },
  {
    code: '01012',
    name: 'Hotel Grand Pacific / Bras Basah',
    road: 'Victoria St',
    latitude: 1.2974,
    longitude: 103.8524,
    mrtInterchange: { name: 'Bras Basah', lines: ['CCL'] },
    services: ['12', '33', '130', '133', '145', '197', '851'],
  },
  {
    code: '04168',
    name: 'Fullerton Sq / Raffles Place',
    road: 'Battery Rd',
    latitude: 1.2859,
    longitude: 103.8526,
    mrtInterchange: { name: 'Raffles Place', lines: ['NSL', 'EWL'] },
    services: ['10', '57', '70', '100', '107', '196', '130'],
  },
  {
    code: '02049',
    name: 'Marina Bay Sands Hotel / Tower 3',
    road: 'Bayfront Ave',
    latitude: 1.2825,
    longitude: 103.8592,
    mrtInterchange: { name: 'Bayfront', lines: ['DTL', 'CCL'] },
    services: ['97', '106', '133', '502', '518'],
  },

  // Chinatown & Outram
  {
    code: '05013',
    name: 'Chinatown Stn Exit E',
    road: 'Eu Tong Sen St',
    latitude: 1.2842,
    longitude: 103.8441,
    mrtInterchange: { name: 'Chinatown', lines: ['NEL', 'DTL'] },
    services: ['51', '61', '143', '147', '166', '190', '851'],
  },
  {
    code: '05019',
    name: 'People\'s Park Ctr',
    road: 'Eu Tong Sen St',
    latitude: 1.2863,
    longitude: 103.8457,
    mrtInterchange: { name: 'Chinatown', lines: ['NEL', 'DTL'] },
    services: ['51', '61', '143', '147', '166', '190', '851'],
  },

  // Jurong East (West Hub)
  {
    code: '28009',
    name: 'Jurong East Bus Interchange',
    road: 'Jurong Gateway Rd',
    latitude: 1.3332,
    longitude: 103.7423,
    mrtInterchange: { name: 'Jurong East', lines: ['NSL', 'EWL'] },
    services: ['51', '52', '66', '97', '105', '143', '197', '334', '502'],
  },
  {
    code: '28201',
    name: 'Opp Westgate / JEM',
    road: 'Boon Lay Way',
    latitude: 1.3347,
    longitude: 103.7439,
    mrtInterchange: { name: 'Jurong East', lines: ['NSL', 'EWL'] },
    services: ['52', '105', '188', '502', '990'],
  },

  // Clementi & Buona Vista
  {
    code: '17009',
    name: 'Clementi Bus Interchange',
    road: 'Clementi Ave 3',
    latitude: 1.3152,
    longitude: 103.7651,
    mrtInterchange: { name: 'Clementi', lines: ['EWL'] },
    services: ['14', '52', '106', '147', '166', '196', '285'],
  },
  {
    code: '11119',
    name: 'Buona Vista Stn Exit C',
    road: 'North Buona Vista Rd',
    latitude: 1.3073,
    longitude: 103.7904,
    mrtInterchange: { name: 'Buona Vista', lines: ['EWL', 'CCL'] },
    services: ['14', '74', '95', '106', '196', '200'],
  },

  // Tampines (East Hub)
  {
    code: '75009',
    name: 'Tampines Bus Interchange',
    road: 'Tampines Ave 4',
    latitude: 1.3533,
    longitude: 103.9452,
    mrtInterchange: { name: 'Tampines', lines: ['EWL', 'DTL'] },
    services: ['10', '19', '23', '29', '38', '65', '67', '293'],
  },
  {
    code: '84009',
    name: 'Bedok Bus Interchange',
    road: 'Bedok North Ave 1',
    latitude: 1.3236,
    longitude: 103.9298,
    mrtInterchange: { name: 'Bedok', lines: ['EWL'] },
    services: ['7', '14', '30', '35', '60', '66', '69', '168'],
  },
  {
    code: '83139',
    name: 'Opp Blk 22 / Marine Crescent',
    road: 'Marine Parade Rd',
    latitude: 1.3038,
    longitude: 103.9085,
    mrtInterchange: { name: 'Marine Terrace', lines: ['TEL'] },
    services: ['13', '16', '31', '36', '43', '48', '55', '135', '196', '197'],
  },

  // Bishan & Ang Mo Kio (Central North Hubs)
  {
    code: '54009',
    name: 'Bishan Bus Interchange / Junction 8',
    road: 'Bishan St 13',
    latitude: 1.3508,
    longitude: 103.8491,
    mrtInterchange: { name: 'Bishan', lines: ['NSL', 'CCL'] },
    services: ['52', '53', '54', '55', '56', '57', '58', '59'],
  },
  {
    code: '54261',
    name: 'Ang Mo Kio Bus Interchange / AMK Hub',
    road: 'Ang Mo Kio Ave 8',
    latitude: 1.3698,
    longitude: 103.8485,
    mrtInterchange: { name: 'Ang Mo Kio', lines: ['NSL'] },
    services: ['22', '24', '25', '73', '86', '130', '133', '136', '166'],
  },

  // Woodlands (North Hub)
  {
    code: '46008',
    name: 'Woodlands Integrated Transport Hub',
    road: 'Woodlands Sq',
    latitude: 1.4368,
    longitude: 103.7865,
    mrtInterchange: { name: 'Woodlands', lines: ['NSL', 'TEL'] },
    services: ['168', '178', '187', '856', '900', '903', '960', '969'],
  },
  {
    code: '80169',
    name: 'Paya Lebar Stn Exit B',
    road: 'Paya Lebar Rd',
    latitude: 1.3182,
    longitude: 103.8924,
    mrtInterchange: { name: 'Paya Lebar', lines: ['EWL', 'CCL'] },
    services: ['24', '28', '43', '70', '76', '134', '135'],
  },
  {
    code: '14141',
    name: 'HarbourFront Stn / VivoCity',
    road: 'Telok Blangah Rd',
    latitude: 1.2654,
    longitude: 103.8219,
    mrtInterchange: { name: 'HarbourFront', lines: ['NEL', 'CCL'] },
    services: ['10', '30', '57', '65', '97', '100', '131', '143', '166'],
  }
];

// Service routes with realistic sequential bus stops and waypoints
export interface ServiceRoute {
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  origin: string;
  destination: string;
  stops: string[]; // List of stop codes in order
  pathCoordinates: [number, number][]; // lat, lng points along the roads
}

export const BUS_ROUTES: Record<string, ServiceRoute> = {
  '190': {
    serviceNo: '190',
    operator: 'SMRT',
    origin: 'Choa Chu Kang Int',
    destination: 'New Bridge Rd Ter',
    stops: ['09048', '09022', '08138', '08057', '05019', '05013'],
    pathCoordinates: [
      [1.312, 103.825],
      [1.308, 103.830],
      [1.3045, 103.8329], // Orchard Stn
      [1.3039, 103.8344], // Lucky Plaza
      [1.3009, 103.8385], // Somerset
      [1.2988, 103.8456], // Dhoby Ghaut
      [1.2912, 103.8450],
      [1.2863, 103.8457], // People's Park
      [1.2842, 103.8441], // Chinatown
    ],
  },
  '65': {
    serviceNo: '65',
    operator: 'SBST',
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    stops: ['75009', '80169', '08057', '08138', '09048', '14141'],
    pathCoordinates: [
      [1.3533, 103.9452], // Tampines
      [1.335, 103.918],
      [1.3182, 103.8924], // Paya Lebar
      [1.310, 103.865],
      [1.2988, 103.8456], // Dhoby Ghaut
      [1.3009, 103.8385], // Somerset
      [1.3045, 103.8329], // Orchard
      [1.295, 103.828],
      [1.280, 103.824],
      [1.2654, 103.8219], // HarbourFront
    ],
  },
  '106': {
    serviceNo: '106',
    operator: 'TTS',
    origin: 'Bukit Batok Int',
    destination: 'Shenton Way Ter',
    stops: ['17009', '11119', '09048', '09022', '08138', '08057', '02049'],
    pathCoordinates: [
      [1.3152, 103.7651], // Clementi
      [1.310, 103.778],
      [1.3073, 103.7904], // Buona Vista
      [1.306, 103.815],
      [1.3045, 103.8329], // Orchard
      [1.3039, 103.8344], // Lucky Plaza
      [1.3009, 103.8385], // Somerset
      [1.2988, 103.8456], // Dhoby Ghaut
      [1.288, 103.855],
      [1.2825, 103.8592], // Marina Bay Sands
    ],
  },
  '14': {
    serviceNo: '14',
    operator: 'SBST',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    stops: ['84009', '08057', '08138', '09048', '11119', '17009'],
    pathCoordinates: [
      [1.3236, 103.9298], // Bedok
      [1.310, 103.880],
      [1.2988, 103.8456], // Dhoby Ghaut
      [1.3009, 103.8385], // Somerset
      [1.3045, 103.8329], // Orchard
      [1.3073, 103.7904], // Buona Vista
      [1.3152, 103.7651], // Clementi
    ],
  },
  '7': {
    serviceNo: '7',
    operator: 'SBST',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    stops: ['84009', '01112', '08057', '08138', '09048', '17009'],
    pathCoordinates: [
      [1.3236, 103.9298], // Bedok
      [1.309, 103.885],
      [1.3005, 103.8561], // Bugis
      [1.2988, 103.8456], // Dhoby Ghaut
      [1.3009, 103.8385], // Somerset
      [1.3045, 103.8329], // Orchard
      [1.3152, 103.7651], // Clementi
    ],
  },
  '166': {
    serviceNo: '166',
    operator: 'SBST',
    origin: 'Ang Mo Kio Int',
    destination: 'Clementi Int',
    stops: ['54261', '08057', '05019', '05013', '14141', '17009'],
    pathCoordinates: [
      [1.3698, 103.8485], // AMK
      [1.335, 103.848],
      [1.2988, 103.8456], // Dhoby Ghaut
      [1.2863, 103.8457], // People's Park
      [1.2842, 103.8441], // Chinatown
      [1.2654, 103.8219], // HarbourFront
      [1.3152, 103.7651], // Clementi
    ],
  },
  '502': {
    serviceNo: '502',
    operator: 'SBST',
    origin: 'Pioneer Stn',
    destination: 'Marina Ctr Ter',
    stops: ['28009', '28201', '09048', '08138', '02049'],
    pathCoordinates: [
      [1.3332, 103.7423], // Jurong East
      [1.3347, 103.7439], // Westgate
      [1.325, 103.790],
      [1.3045, 103.8329], // Orchard
      [1.3009, 103.8385], // Somerset
      [1.2825, 103.8592], // Marina Bay Sands
    ],
  },
  '143': {
    serviceNo: '143',
    operator: 'TTS',
    origin: 'Toa Payoh Int',
    destination: 'Jurong East Int',
    stops: ['05019', '05013', '14141', '28009'],
    pathCoordinates: [
      [1.333, 103.850],
      [1.2863, 103.8457], // People's Park
      [1.2842, 103.8441], // Chinatown
      [1.2654, 103.8219], // HarbourFront
      [1.295, 103.780],
      [1.3332, 103.7423], // Jurong East
    ],
  },
  '851': {
    serviceNo: '851',
    operator: 'SMRT',
    origin: 'Yishun Int',
    destination: 'Bukit Merah Int',
    stops: ['01112', '01012', '05019', '05013'],
    pathCoordinates: [
      [1.350, 103.850],
      [1.3005, 103.8561], // Bugis
      [1.2974, 103.8524], // Bras Basah
      [1.2863, 103.8457], // People's Park
      [1.2842, 103.8441], // Chinatown
      [1.281, 103.820],
    ],
  },
  '10': {
    serviceNo: '10',
    operator: 'SBST',
    origin: 'Tampines Int',
    destination: 'Kent Ridge Ter',
    stops: ['75009', '04168', '14141'],
    pathCoordinates: [
      [1.3533, 103.9452], // Tampines
      [1.320, 103.900],
      [1.2859, 103.8526], // Fullerton / Raffles Place
      [1.2654, 103.8219], // HarbourFront
      [1.292, 103.775],
    ],
  },
};

// Initial simulated active buses running on Singapore roads
export const INITIAL_LIVE_BUSES: LiveBus[] = [
  {
    id: 'BUS-190-01',
    serviceNo: '190',
    operator: 'SMRT',
    latitude: 1.3062,
    longitude: 103.8315,
    heading: 135,
    speedKmH: 34,
    type: 'DD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '09048',
    nextStopCode: '09022',
    targetStopCode: '09048',
    destination: 'New Bridge Rd Ter',
    routeProgressIndex: 2,
  },
  {
    id: 'BUS-190-02',
    serviceNo: '190',
    operator: 'SMRT',
    latitude: 1.3022,
    longitude: 103.8368,
    heading: 140,
    speedKmH: 26,
    type: 'BD',
    load: 'SDA',
    feature: 'WAB',
    currentStopCode: '08138',
    nextStopCode: '08057',
    targetStopCode: '08138',
    destination: 'New Bridge Rd Ter',
    routeProgressIndex: 4,
  },
  {
    id: 'BUS-65-01',
    serviceNo: '65',
    operator: 'SBST',
    latitude: 1.3025,
    longitude: 103.8355,
    heading: 138,
    speedKmH: 18,
    type: 'DD',
    load: 'LSD',
    feature: 'WAB',
    currentStopCode: '08138',
    nextStopCode: '08057',
    targetStopCode: '09048',
    destination: 'HarbourFront Int',
    routeProgressIndex: 5,
  },
  {
    id: 'BUS-65-02',
    serviceNo: '65',
    operator: 'SBST',
    latitude: 1.3268,
    longitude: 103.9050,
    heading: 220,
    speedKmH: 42,
    type: 'SD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '80169',
    nextStopCode: '08057',
    targetStopCode: '80169',
    destination: 'HarbourFront Int',
    routeProgressIndex: 2,
  },
  {
    id: 'BUS-106-01',
    serviceNo: '106',
    operator: 'TTS',
    latitude: 1.3055,
    longitude: 103.8320,
    heading: 130,
    speedKmH: 29,
    type: 'DD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '09048',
    nextStopCode: '09022',
    targetStopCode: '09048',
    destination: 'Shenton Way Ter',
    routeProgressIndex: 4,
  },
  {
    id: 'BUS-106-02',
    serviceNo: '106',
    operator: 'TTS',
    latitude: 1.2850,
    longitude: 103.8570,
    heading: 155,
    speedKmH: 31,
    type: 'SD',
    load: 'SDA',
    feature: 'WAB',
    currentStopCode: '02049',
    nextStopCode: '02049',
    targetStopCode: '02049',
    destination: 'Shenton Way Ter',
    routeProgressIndex: 9,
  },
  {
    id: 'BUS-14-01',
    serviceNo: '14',
    operator: 'SBST',
    latitude: 1.3015,
    longitude: 103.8375,
    heading: 315,
    speedKmH: 30,
    type: 'DD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '08138',
    nextStopCode: '09048',
    targetStopCode: '09048',
    destination: 'Clementi Int',
    routeProgressIndex: 3,
  },
  {
    id: 'BUS-7-01',
    serviceNo: '7',
    operator: 'SBST',
    latitude: 1.2995,
    longitude: 103.8490,
    heading: 260,
    speedKmH: 22,
    type: 'SD',
    load: 'SDA',
    feature: 'WAB',
    currentStopCode: '08057',
    nextStopCode: '08138',
    targetStopCode: '08057',
    destination: 'Clementi Int',
    routeProgressIndex: 3,
  },
  {
    id: 'BUS-502-01',
    serviceNo: '502',
    operator: 'SBST',
    latitude: 1.3340,
    longitude: 103.7430,
    heading: 110,
    speedKmH: 45,
    type: 'SD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '28009',
    nextStopCode: '28201',
    targetStopCode: '28009',
    destination: 'Marina Ctr Ter',
    routeProgressIndex: 0,
  },
  {
    id: 'BUS-166-01',
    serviceNo: '166',
    operator: 'SBST',
    latitude: 1.2855,
    longitude: 103.8450,
    heading: 195,
    speedKmH: 20,
    type: 'DD',
    load: 'LSD',
    feature: 'WAB',
    currentStopCode: '05019',
    nextStopCode: '05013',
    targetStopCode: '05013',
    destination: 'Clementi Int',
    routeProgressIndex: 3,
  },
  {
    id: 'BUS-143-01',
    serviceNo: '143',
    operator: 'TTS',
    latitude: 1.2858,
    longitude: 103.8452,
    heading: 200,
    speedKmH: 24,
    type: 'DD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '05013',
    nextStopCode: '14141',
    targetStopCode: '05013',
    destination: 'Jurong East Int',
    routeProgressIndex: 2,
  },
  {
    id: 'BUS-851-01',
    serviceNo: '851',
    operator: 'SMRT',
    latitude: 1.2985,
    longitude: 103.8540,
    heading: 215,
    speedKmH: 28,
    type: 'SD',
    load: 'SDA',
    feature: 'WAB',
    currentStopCode: '01012',
    nextStopCode: '05019',
    targetStopCode: '01012',
    destination: 'Bukit Merah Int',
    routeProgressIndex: 2,
  },
  {
    id: 'BUS-10-01',
    serviceNo: '10',
    operator: 'SBST',
    latitude: 1.2870,
    longitude: 103.8530,
    heading: 180,
    speedKmH: 35,
    type: 'DD',
    load: 'SEA',
    feature: 'WAB',
    currentStopCode: '04168',
    nextStopCode: '14141',
    targetStopCode: '04168',
    destination: 'Kent Ridge Ter',
    routeProgressIndex: 2,
  }
];

// Active LTA traffic & bus delay alerts
export const INITIAL_SERVICE_ALERTS: ServiceAlert[] = [
  {
    id: 'ALT-CTE-2026-01',
    services: ['190', '857', '960'],
    severity: 'moderate',
    category: 'congestion',
    title: 'CTE Southbound Congestion towards City',
    description: 'Heavy traffic volume from Moulmein flyover towards Havelock Rd. Buses experiencing 8 to 14 minute headway delays.',
    affectedRoads: ['Central Expressway (CTE)', 'Clemenceau Ave'],
    reportedAt: '10 mins ago',
    estimatedDelayMinutes: 11,
  },
  {
    id: 'ALT-ORC-2026-02',
    services: ['7', '14', '65', '106', '174'],
    severity: 'minor',
    category: 'congestion',
    title: 'Orchard Road Shopping District Slow Traffic',
    description: 'Dense vehicular movement between Paterson Hill and Somerset Road. Bus arrival times adjusted.',
    affectedRoads: ['Orchard Rd', 'Paterson Rd', 'Grange Rd'],
    reportedAt: '18 mins ago',
    estimatedDelayMinutes: 5,
  },
  {
    id: 'ALT-PIE-2026-03',
    services: ['502', '52', '188'],
    severity: 'severe',
    category: 'diversion',
    title: 'PIE Eastbound Lane Closure near Clementi Ave 6',
    description: 'Accident cleanup causing temporary diversion and substantial queue. Commuters advised to expect delays.',
    affectedRoads: ['Pan Island Expressway (PIE)', 'Clementi Ave 6'],
    reportedAt: '25 mins ago',
    estimatedDelayMinutes: 18,
  },
  {
    id: 'ALT-BUN-2026-04',
    services: ['65'],
    severity: 'minor',
    category: 'bunching',
    title: 'Bus Bunching Warning for Service 65',
    description: 'Two consecutive buses are operating within 2 minutes of each other along Paya Lebar corridor.',
    affectedRoads: ['Paya Lebar Rd', 'Geylang East'],
    reportedAt: '5 mins ago',
    estimatedDelayMinutes: 3,
  }
];

// Helper to calculate realistic arrival timings for a bus stop based on simulated buses and schedule baseline
export function calculateArrivalsForStop(
  stopCode: string,
  liveBuses: LiveBus[],
  timeOffsetSeconds: number = 0
): BusServiceArrival[] {
  const stop = SINGAPORE_BUS_STOPS.find(s => s.code === stopCode);
  if (!stop) return [];

  const results: BusServiceArrival[] = [];

  for (const serviceNo of stop.services) {
    const route = BUS_ROUTES[serviceNo];
    const operator = route ? route.operator : (['SBST', 'SMRT', 'TTS', 'GAS'][Math.floor(serviceNo.charCodeAt(0) % 4)] as any);

    // Look for live bus on this route
    const matchingLiveBus = liveBuses.find(b => b.serviceNo === serviceNo);
    const alert = INITIAL_SERVICE_ALERTS.find(a => a.services.includes(serviceNo));

    // Base estimated arrival calculation
    let nextBusMinutes = 2;
    let nextBus2Minutes = 9;
    let nextBus3Minutes = 17;

    if (matchingLiveBus) {
      // Calculate approximate distance between bus and stop
      const dLat = matchingLiveBus.latitude - stop.latitude;
      const dLng = matchingLiveBus.longitude - stop.longitude;
      const distKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111; // ~111km per degree
      const approxMins = Math.max(0, Math.round((distKm / 28) * 60) - Math.floor(timeOffsetSeconds / 60));
      nextBusMinutes = approxMins;
      nextBus2Minutes = nextBusMinutes + 7 + (parseInt(serviceNo, 10) % 4);
      nextBus3Minutes = nextBus2Minutes + 8 + (parseInt(serviceNo, 10) % 5);
    } else {
      // Deterministic schedule formula based on serviceNo & stopCode
      const hash = (serviceNo.charCodeAt(0) * 17 + stopCode.charCodeAt(2) * 13) % 11;
      nextBusMinutes = Math.max(0, (hash % 6) - Math.floor(timeOffsetSeconds / 60));
      nextBus2Minutes = nextBusMinutes + 6 + (hash % 5);
      nextBus3Minutes = nextBus2Minutes + 7 + (hash % 7);
    }

    // Apply delay if active alert exists
    if (alert && alert.severity !== 'minor') {
      nextBusMinutes += alert.estimatedDelayMinutes > 10 ? 4 : 2;
      nextBus2Minutes += alert.estimatedDelayMinutes;
    }

    const loads: LoadStatus[] = ['SEA', 'SDA', 'LSD'];
    const types: BusType[] = ['SD', 'DD', 'BD'];

    const nextBusLoad: LoadStatus = matchingLiveBus ? matchingLiveBus.load : loads[(serviceNo.length + stopCode.length) % 3];
    const nextBusType: BusType = matchingLiveBus ? matchingLiveBus.type : types[(serviceNo.length + 1) % 3];

    results.push({
      serviceNo,
      operator,
      inDelay: Boolean(alert),
      delayMinutes: alert ? alert.estimatedDelayMinutes : undefined,
      delayReason: alert ? alert.title : undefined,
      nextBus: {
        estimatedArrival: nextBusMinutes === 0 ? 'Arr' : `${nextBusMinutes}m`,
        estimatedMinutes: nextBusMinutes,
        load: nextBusLoad,
        feature: 'WAB',
        type: nextBusType,
        latitude: matchingLiveBus?.latitude,
        longitude: matchingLiveBus?.longitude,
        visitNumber: 1,
        originCode: route?.stops[0] || '09048',
        destinationCode: route?.stops[route.stops.length - 1] || '04168',
      },
      nextBus2: {
        estimatedArrival: `${nextBus2Minutes}m`,
        estimatedMinutes: nextBus2Minutes,
        load: loads[(nextBusMinutes + 1) % 3],
        feature: 'WAB',
        type: types[(nextBusMinutes + 2) % 3],
        visitNumber: 1,
        originCode: route?.stops[0] || '09048',
        destinationCode: route?.stops[route.stops.length - 1] || '04168',
      },
      nextBus3: {
        estimatedArrival: `${nextBus3Minutes}m`,
        estimatedMinutes: nextBus3Minutes,
        load: loads[(nextBus2Minutes + 1) % 3],
        feature: 'WAB',
        type: types[(nextBus2Minutes) % 3],
        visitNumber: 1,
        originCode: route?.stops[0] || '09048',
        destinationCode: route?.stops[route.stops.length - 1] || '04168',
      },
    });
  }

  // Sort by next bus arrival time ascending
  return results.sort((a, b) => a.nextBus.estimatedMinutes - b.nextBus.estimatedMinutes);
}

// Distance helper in meters
export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
