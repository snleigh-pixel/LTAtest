import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BusStop, LiveBus, ServiceAlert, UserAlarm, BusServiceArrival } from './types/bus';
import {
  SINGAPORE_BUS_STOPS,
  INITIAL_LIVE_BUSES,
  INITIAL_SERVICE_ALERTS,
  calculateArrivalsForStop,
  getDistanceInMeters,
  BUS_ROUTES,
} from './data/singaporeBusData';
import {
  getFavoriteStops,
  toggleFavoriteStop,
  getSavedAlarms,
  saveAlarms,
  getSavedUserLocation,
  saveUserLocation,
  UserSimulatedLocation,
} from './utils/storage';
import { playArrivalChime, sendBrowserNotification } from './utils/audioAlert';
import { TopBar } from './components/TopBar';
import { BusArrivalCard } from './components/BusArrivalCard';
import { BusStopSelector } from './components/BusStopSelector';
import { InteractiveMap } from './components/InteractiveMap';
import { RouteViewerModal } from './components/RouteViewerModal';
import { AlarmSetupModal } from './components/AlarmSetupModal';
import { DelayAlertsModal } from './components/DelayAlertsModal';
import { CommuterTips } from './components/CommuterTips';
import {
  RefreshCw,
  Clock,
  Sparkles,
  MapPin,
  Check,
  AlertCircle,
  Star,
  Bus,
} from 'lucide-react';

export default function App() {
  const [stops] = useState<BusStop[]>(SINGAPORE_BUS_STOPS);
  const [selectedStop, setSelectedStop] = useState<BusStop>(SINGAPORE_BUS_STOPS[0]);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>(INITIAL_LIVE_BUSES);
  const [alerts] = useState<ServiceAlert[]>(INITIAL_SERVICE_ALERTS);
  const [favorites, setFavorites] = useState<string[]>(getFavoriteStops);
  const [alarms, setAlarms] = useState<UserAlarm[]>(getSavedAlarms);
  const [userLocation, setUserLocation] = useState<UserSimulatedLocation>(getSavedUserLocation);
  const [currentView, setCurrentView] = useState<'arrivals' | 'map' | 'alerts' | 'favorites'>('arrivals');

  // Modals & overlays
  const [highlightedServiceNo, setHighlightedServiceNo] = useState<string | null>(null);
  const [inspectingRouteService, setInspectingRouteService] = useState<string | null>(null);
  const [alarmModalService, setAlarmModalService] = useState<string | null>(null);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);

  // Auto-refresh timer state
  const [refreshCountdown, setRefreshCountdown] = useState(15);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date().toLocaleTimeString('en-SG', { hour12: false }));
  const [isLocating, setIsLocating] = useState(false);
  const [apiSource, setApiSource] = useState<'live_lta' | 'simulated'>('simulated');
  const [liveArrivals, setLiveArrivals] = useState<BusServiceArrival[] | null>(null);

  // Active in-app notification toast
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'alarm' | 'delay';
  } | null>(null);

  // Fetch live bus arrivals from serverless endpoint /api/busarrivals
  const fetchLiveArrivals = useCallback(async (stopCode: string) => {
    try {
      const response = await fetch(`/api/busarrivals?BusStopCode=${encodeURIComponent(stopCode)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.Services && Array.isArray(data.Services) && data.Services.length > 0) {
          const parsed: BusServiceArrival[] = data.Services.map((srv: any) => {
            const parseNext = (nb: any, visitNum: number) => {
              if (!nb || !nb.EstimatedArrival) return undefined;
              const etaDate = new Date(nb.EstimatedArrival);
              const diffMs = etaDate.getTime() - Date.now();
              const diffMins = Math.max(0, Math.round(diffMs / 60000));
              return {
                estimatedArrival: diffMins <= 0 ? 'Arr' : `${diffMins}m`,
                estimatedMinutes: diffMins,
                load: (nb.Load || 'SEA') as any,
                feature: (nb.Feature === 'WAB' ? 'WAB' : 'NORM') as any,
                type: (nb.Type || 'SD') as any,
                latitude: nb.Latitude ? parseFloat(nb.Latitude) : undefined,
                longitude: nb.Longitude ? parseFloat(nb.Longitude) : undefined,
                visitNumber: visitNum,
                originCode: nb.OriginCode || '',
                destinationCode: nb.DestinationCode || '',
              };
            };

            const nextBus = parseNext(srv.NextBus, 1) || {
              estimatedArrival: 'Arr',
              estimatedMinutes: 0,
              load: 'SEA' as const,
              feature: 'WAB' as const,
              type: 'SD' as const,
              visitNumber: 1,
              originCode: '',
              destinationCode: '',
            };

            return {
              serviceNo: srv.ServiceNo,
              operator: srv.Operator || 'SBST',
              nextBus,
              nextBus2: parseNext(srv.NextBus2, 2),
              nextBus3: parseNext(srv.NextBus3, 3),
              inDelay: false,
            };
          });

          setLiveArrivals(parsed);
          setApiSource('live_lta');
          return;
        }
      }
      // If 401 (missing key) or empty, fall back to high-fidelity simulation
      setLiveArrivals(null);
      setApiSource('simulated');
    } catch {
      setLiveArrivals(null);
      setApiSource('simulated');
    }
  }, []);

  useEffect(() => {
    fetchLiveArrivals(selectedStop.code);
  }, [selectedStop.code, fetchLiveArrivals]);

  // Calculate arrival board: use live arrivals if available, else simulated LTA calculation
  const arrivals: BusServiceArrival[] = useMemo(() => {
    if (liveArrivals && liveArrivals.length > 0) {
      return liveArrivals;
    }
    return calculateArrivalsForStop(selectedStop.code, liveBuses);
  }, [selectedStop, liveBuses, liveArrivals]);

  // Handle Favorites toggle
  const handleToggleFavorite = (stopCode: string) => {
    const updated = toggleFavoriteStop(stopCode);
    setFavorites(updated);
  };

  // Handle Alarm Addition
  const handleAddAlarm = (alarmData: Omit<UserAlarm, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlarm: UserAlarm = {
      ...alarmData,
      id: `ALARM-${Date.now()}`,
      createdAt: Date.now(),
      triggered: false,
    };
    const updated = [...alarms, newAlarm];
    setAlarms(updated);
    saveAlarms(updated);
  };

  // Handle Alarm Deletion
  const handleDeleteAlarm = (alarmId: string) => {
    const updated = alarms.filter((a) => a.id !== alarmId);
    setAlarms(updated);
    saveAlarms(updated);
  };

  // Handle setting user simulated location
  const handleSetUserLocation = (newLoc: UserSimulatedLocation) => {
    setUserLocation(newLoc);
    saveUserLocation(newLoc);
  };

  // Locate closest bus stop
  const handleLocateMe = () => {
    setIsLocating(true);
    // Find closest stop to current userLocation
    let closestStop = stops[0];
    let minDistance = Infinity;

    stops.forEach((s) => {
      const dist = getDistanceInMeters(userLocation.latitude, userLocation.longitude, s.latitude, s.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closestStop = s;
      }
    });

    setTimeout(() => {
      setSelectedStop(closestStop);
      setIsLocating(false);
      setActiveToast({
        id: `LOC-${Date.now()}`,
        title: 'Nearest Bus Stop Found',
        message: `Located ${closestStop.name} (${minDistance}m away).`,
        type: 'alarm',
      });
    }, 400);
  };

  // Live simulation tick: Move buses slightly along routes and update countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBuses((prevBuses) => {
        return prevBuses.map((bus) => {
          const route = BUS_ROUTES[bus.serviceNo];
          if (!route || route.pathCoordinates.length < 2) return bus;

          const coords = route.pathCoordinates;
          let nextIndex = bus.routeProgressIndex + 1;
          if (nextIndex >= coords.length) {
            nextIndex = 0; // loop route
          }

          const targetCoord = coords[nextIndex];
          // Slight movement step
          const stepRatio = 0.08;
          const newLat = bus.latitude + (targetCoord[0] - bus.latitude) * stepRatio;
          const newLng = bus.longitude + (targetCoord[1] - bus.longitude) * stepRatio;

          // If reached target coordinate, advance progress index
          const distToTarget = Math.sqrt(
            Math.pow(targetCoord[0] - newLat, 2) + Math.pow(targetCoord[1] - newLng, 2)
          );
          const updatedIndex = distToTarget < 0.002 ? nextIndex : bus.routeProgressIndex;

          return {
            ...bus,
            latitude: newLat,
            longitude: newLng,
            routeProgressIndex: updatedIndex,
          };
        });
      });

      // Countdown ticker
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          setLastUpdatedTime(new Date().toLocaleTimeString('en-SG', { hour12: false }));
          return 15;
        }
        return prev - 1;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Alarm checker: Check if any active alarms are triggered by current arrivals
  useEffect(() => {
    alarms.forEach((alarm) => {
      if (alarm.triggered) return;

      const stopArrivals = calculateArrivalsForStop(alarm.stopCode, liveBuses);
      const targetArrival = stopArrivals.find((a) => a.serviceNo === alarm.serviceNo);

      if (targetArrival && targetArrival.nextBus.estimatedMinutes <= alarm.triggerMinutes) {
        // Trigger alarm
        const updated = alarms.map((a) => (a.id === alarm.id ? { ...a, triggered: true } : a));
        setAlarms(updated);
        saveAlarms(updated);

        if (alarm.soundEnabled) {
          playArrivalChime();
        }

        const alertTitle = `Bus ${alarm.serviceNo} is Arriving!`;
        const alertMsg = `Service ${alarm.serviceNo} is ${
          targetArrival.nextBus.estimatedMinutes === 0 ? 'arriving now' : `approaching in ${targetArrival.nextBus.estimatedMinutes} min(s)`
        } at ${alarm.stopName}.`;

        if (alarm.notificationEnabled) {
          sendBrowserNotification(alertTitle, { body: alertMsg });
        }

        setActiveToast({
          id: `TOAST-${Date.now()}`,
          title: alertTitle,
          message: alertMsg,
          type: 'alarm',
        });
      }
    });
  }, [liveBuses, alarms]);

  // Dismiss toast after 7s
  useEffect(() => {
    if (!activeToast) return;
    const t = setTimeout(() => {
      setActiveToast(null);
    }, 7000);
    return () => clearTimeout(t);
  }, [activeToast]);

  // Filtered favorite stops
  const favoriteStopsList = useMemo(() => {
    return stops.filter((s) => favorites.includes(s.code));
  }, [stops, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeAlarmsCount={alarms.filter((a) => !a.triggered).length}
        unreadAlertsCount={alerts.length}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* Floating In-App Arrival Alarm / Delay Notification Toast */}
      {activeToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl animate-bounce-subtle">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{activeToast.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {activeToast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1 text-sm font-mono cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Commuter Live Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current Stop:</span>
              <span className="text-emerald-400 font-mono font-bold">{selectedStop.code}</span>
              <span className="text-slate-100">{selectedStop.name}</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{selectedStop.road}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="text-slate-400">
              Simulated Location: <strong className="text-sky-300">{userLocation.name}</strong>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${apiSource === 'live_lta' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={apiSource === 'live_lta' ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                {apiSource === 'live_lta' ? 'Live LTA DataMall v3' : 'Simulated (LTA_ACCOUNT_KEY pending in /api)'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Updated: {lastUpdatedTime} SGT</span>
            </span>
            <button
              onClick={() => {
                fetchLiveArrivals(selectedStop.code);
                setRefreshCountdown(15);
              }}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
              title="Click to refresh live bus arrivals"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{refreshCountdown}s</span>
            </button>
          </div>
        </div>

        {/* View 1: Live Arrivals Dashboard (Default) */}
        {currentView === 'arrivals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Bus Stop Selector, MRT Line Filter, Search (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white">Singapore Bus Stops</h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {stops.length} Interchanges & Stops
                  </span>
                </div>

                <BusStopSelector
                  stops={stops}
                  selectedStop={selectedStop}
                  onSelectStop={(stop) => {
                    setSelectedStop(stop);
                    setHighlightedServiceNo(null);
                  }}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  userCoords={userLocation}
                />
              </div>

              {/* LTA Indicators Quick Guide */}
              <CommuterTips />
            </div>

            {/* Right Column: Live Arrival Times Board (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>Live Arrival Board</span>
                    <span className="font-mono text-sm px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {arrivals.length} Services
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time LTA DataMall predictions with passenger load & deck type
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDelayModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Delays ({alerts.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setAlarmModalService(selectedStop.services[0] || null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Set Arrival Alarm</span>
                  </button>
                </div>
              </div>

              {/* Bus Arrivals List */}
              {arrivals.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
                  <Bus className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-semibold text-slate-300">
                    No operating bus services scheduled right now
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Please select another Singapore bus stop or interchange from the search list.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {arrivals.map((arr) => {
                    const hasAlarm = alarms.some(
                      (a) => a.stopCode === selectedStop.code && a.serviceNo === arr.serviceNo && !a.triggered
                    );

                    return (
                      <BusArrivalCard
                        key={arr.serviceNo}
                        arrival={arr}
                        hasActiveAlarm={hasAlarm}
                        onSetAlarm={(serviceNo) => setAlarmModalService(serviceNo)}
                        onTrackOnMap={(serviceNo) => {
                          setHighlightedServiceNo(serviceNo);
                          setCurrentView('map');
                        }}
                        onViewRoute={(serviceNo) => setInspectingRouteService(serviceNo)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View 2: Live Radar Map */}
        {currentView === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Singapore Live Bus Radar</span>
                  {highlightedServiceNo && (
                    <span className="font-mono text-sm px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Tracking Bus {highlightedServiceNo}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  High precision interactive road map showing active buses, stops, route polylines, and transit hubs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('arrivals')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  &larr; Return to Timings
                </button>
              </div>
            </div>

            <InteractiveMap
              stops={stops}
              selectedStop={selectedStop}
              onSelectStop={(stop) => {
                setSelectedStop(stop);
              }}
              liveBuses={liveBuses}
              highlightedServiceNo={highlightedServiceNo}
              onSelectService={(serviceNo) => {
                setHighlightedServiceNo(serviceNo);
                if (serviceNo) {
                  setInspectingRouteService(serviceNo);
                }
              }}
              userCoords={userLocation}
              onSetUserLocation={handleSetUserLocation}
            />
          </div>
        )}

        {/* View 3: Delay Alerts Feed */}
        {currentView === 'alerts' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Real-Time Singapore Bus Delays & Traffic Advisories</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {alerts.length} Incidents
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Active congestion, road maintenance, diversions, and bunching alerts along Singapore corridors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono">
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Reported {alert.reportedAt}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                      +{alert.estimatedDelayMinutes} mins Headway Delay
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{alert.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.affectedRoads.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Affected Buses:</span>
                      {alert.services.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setHighlightedServiceNo(s);
                            setCurrentView('map');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono font-bold text-xs border border-slate-700 cursor-pointer"
                        >
                          Bus {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 4: Saved / Favorite Stops */}
        {currentView === 'favorites' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Saved Stops & Daily Commute</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {favoriteStopsList.length} Pinned
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Quick access to your home, office, and frequent bus interchange stops.
                </p>
              </div>
            </div>

            {favoriteStopsList.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
                <Star className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-300">
                  No saved bus stops yet
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the star icon next to any Singapore bus stop to pin it here for quick daily transit checking.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteStopsList.map((stop) => {
                  const dist = getDistanceInMeters(
                    userLocation.latitude,
                    userLocation.longitude,
                    stop.latitude,
                    stop.longitude
                  );
                  const distStr = dist < 1000 ? `${dist}m` : `${(dist / 1000).toFixed(1)}km`;

                  return (
                    <div
                      key={stop.code}
                      onClick={() => {
                        setSelectedStop(stop);
                        setCurrentView('arrivals');
                      }}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {stop.code}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{distStr} away</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                          {stop.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{stop.road}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span>Services: {stop.services.slice(0, 5).join(', ')}{stop.services.length > 5 ? '...' : ''}</span>
                        <span className="text-emerald-400 font-semibold group-hover:underline">View Arrivals &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Route Linear Inspector Modal */}
      {inspectingRouteService && (
        <RouteViewerModal
          serviceNo={inspectingRouteService}
          allStops={stops}
          currentStopCode={selectedStop.code}
          liveBuses={liveBuses}
          onSelectStop={(stop) => {
            setSelectedStop(stop);
            setCurrentView('arrivals');
          }}
          onClose={() => setInspectingRouteService(null)}
        />
      )}

      {/* Alarm Setup Modal */}
      {alarmModalService && (
        <AlarmSetupModal
          stop={selectedStop}
          initialServiceNo={alarmModalService}
          existingAlarms={alarms}
          onAddAlarm={handleAddAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          onClose={() => setAlarmModalService(null)}
        />
      )}

      {/* Delay Alerts Modal */}
      {isDelayModalOpen && (
        <DelayAlertsModal
          alerts={alerts}
          onClose={() => setIsDelayModalOpen(false)}
          onFilterByService={(srv) => {
            setHighlightedServiceNo(srv);
            setCurrentView('map');
          }}
        />
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SG BusRadar</span>
            <span aria-hidden="true">·</span>
            <span>Singapore LTA Real-Time Bus DataMall v3 Frontend</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>SBS Transit</span>
            <span aria-hidden="true">·</span>
            <span>SMRT Buses</span>
            <span aria-hidden="true">·</span>
            <span>Tower Transit</span>
            <span aria-hidden="true">·</span>
            <span>Go-Ahead SG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
