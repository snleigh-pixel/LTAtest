import { UserAlarm } from '../types/bus';

const FAVORITES_KEY = 'sg_bus_favorites';
const ALARMS_KEY = 'sg_bus_alarms';
const USER_LOC_KEY = 'sg_bus_user_loc';

export function getFavoriteStops(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return ['09048', '08138']; // Default to Orchard & Somerset
    return JSON.parse(raw);
  } catch {
    return ['09048', '08138'];
  }
}

export function saveFavoriteStops(stops: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(stops));
  } catch (err) {
    console.error('Failed to save favorites', err);
  }
}

export function toggleFavoriteStop(stopCode: string): string[] {
  const current = getFavoriteStops();
  const exists = current.includes(stopCode);
  const updated = exists ? current.filter(c => c !== stopCode) : [...current, stopCode];
  saveFavoriteStops(updated);
  return updated;
}

export function getSavedAlarms(): UserAlarm[] {
  try {
    const raw = localStorage.getItem(ALARMS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAlarms(alarms: UserAlarm[]): void {
  try {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
  } catch (err) {
    console.error('Failed to save alarms', err);
  }
}

export interface UserSimulatedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export function getSavedUserLocation(): UserSimulatedLocation {
  try {
    const raw = localStorage.getItem(USER_LOC_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  // Default to Orchard Road hub
  return {
    name: 'Orchard Road (Near Lucky Plaza)',
    latitude: 1.3040,
    longitude: 103.8335,
  };
}

export function saveUserLocation(loc: UserSimulatedLocation): void {
  try {
    localStorage.setItem(USER_LOC_KEY, JSON.stringify(loc));
  } catch (err) {
    console.error('Failed to save user loc', err);
  }
}
