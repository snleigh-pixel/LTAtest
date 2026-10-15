import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusStop, LiveBus } from '../types/bus';
import { BUS_ROUTES } from '../data/singaporeBusData';
import { Compass, Locate, Bus as BusIcon, RefreshCw } from 'lucide-react';

interface InteractiveMapProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  liveBuses: LiveBus[];
  highlightedServiceNo: string | null;
  onSelectService: (serviceNo: string | null) => void;
  userCoords: { latitude: number; longitude: number; name: string };
  onSetUserLocation: (coords: { latitude: number; longitude: number; name: string }) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  liveBuses,
  highlightedServiceNo,
  onSelectService,
  userCoords,
  onSetUserLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const stopMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const busMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedStop.latitude, selectedStop.longitude],
        zoom: 15,
        zoomControl: true,
      });

      // Dark Matter CartoDB tiles for high contrast Singapore night transit view
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO &copy; LTA DataMall',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      stopMarkersLayerRef.current = L.layerGroup().addTo(map);
      busMarkersLayerRef.current = L.layerGroup().addTo(map);
      routePolylineLayerRef.current = L.layerGroup().addTo(map);
      userMarkerLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup if needed on unmount
    };
  }, []);

  // Update stops markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = stopMarkersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    stops.forEach((stop) => {
      const isSelected = stop.code === selectedStop.code;

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -100%);
            cursor: pointer;
          ">
            <div style="
              background: ${isSelected ? '#10b981' : '#1e293b'};
              color: ${isSelected ? '#020617' : '#e2e8f0'};
              border: 2px solid ${isSelected ? '#ffffff' : '#475569'};
              padding: 2px 6px;
              border-radius: 6px;
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
              white-space: nowrap;
            ">
              ${stop.code}
            </div>
            <div style="
              width: 2px;
              height: 6px;
              background: ${isSelected ? '#10b981' : '#475569'};
            "></div>
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${isSelected ? '#10b981' : '#475569'};
              box-shadow: 0 0 8px ${isSelected ? '#10b981' : 'transparent'};
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon });

      marker.on('click', () => {
        onSelectStop(stop);
      });

      marker.bindPopup(`
        <div style="padding: 4px;">
          <div style="font-size: 11px; font-weight: 700; color: #10b981; font-family: monospace;">STOP ${stop.code}</div>
          <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-top: 2px;">${stop.name}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">${stop.road}</div>
          <div style="font-size: 11px; color: #cbd5e1; margin-top: 6px; padding-top: 4px; border-top: 1px solid #334155;">
            Services: <strong>${stop.services.join(', ')}</strong>
          </div>
        </div>
      `);

      layer.addLayer(marker);
    });
  }, [stops, selectedStop, onSelectStop]);

  // Update live bus markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = busMarkersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    liveBuses.forEach((bus) => {
      const isHighlighted = highlightedServiceNo === bus.serviceNo;
      const isServingCurrentStop = selectedStop.services.includes(bus.serviceNo);

      const loadColor =
        bus.load === 'SEA' ? '#10b981' : bus.load === 'SDA' ? '#f59e0b' : '#f43f5e';

      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: ${isHighlighted ? 999 : 500};
          ">
            <div style="
              background: ${isHighlighted ? '#f59e0b' : isServingCurrentStop ? '#059669' : '#0f172a'};
              color: #ffffff;
              border: 2px solid ${loadColor};
              border-radius: 9999px;
              padding: 2px 7px;
              font-family: monospace;
              font-size: 12px;
              font-weight: 800;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              display: flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
              transform: ${isHighlighted ? 'scale(1.25)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              <span>🚌 ${bus.serviceNo}</span>
              <span style="
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: ${loadColor};
              "></span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([bus.latitude, bus.longitude], { icon: busIcon });

      marker.on('click', () => {
        onSelectService(bus.serviceNo);
      });

      marker.bindPopup(`
        <div style="padding: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px; font-weight: 800; color: #10b981; font-family: monospace;">Bus ${bus.serviceNo}</span>
            <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">${bus.operator}</span>
          </div>
          <div style="font-size: 12px; color: #f1f5f9; margin-top: 4px;">To: ${bus.destination}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
            Speed: <strong style="color: #38bdf8;">${bus.speedKmH} km/h</strong> · Type: <strong>${bus.type}</strong> (${bus.load})
          </div>
        </div>
      `);

      layer.addLayer(marker);
    });
  }, [liveBuses, highlightedServiceNo, selectedStop, onSelectService]);

  // Update Route Polyline if highlightedServiceNo is set
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = routePolylineLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (highlightedServiceNo && BUS_ROUTES[highlightedServiceNo]) {
      const route = BUS_ROUTES[highlightedServiceNo];
      const polyline = L.polyline(route.pathCoordinates, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      });
      layer.addLayer(polyline);
    }
  }, [highlightedServiceNo]);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = userMarkerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(56, 189, 248, 0.35);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #38bdf8;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px #38bdf8;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon });
    marker.bindTooltip(`You are here: ${userCoords.name}`, { permanent: false, direction: 'top' });
    layer.addLayer(marker);
  }, [userCoords]);

  // Center on selected stop when it changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([selectedStop.latitude, selectedStop.longitude], 15, {
        duration: 1.2,
      });
    }
  }, [selectedStop]);

  // Quick Transit Hub jump handlers
  const hubs = [
    { name: 'Orchard', lat: 1.3045, lng: 103.8329 },
    { name: 'Marina Bay', lat: 1.2825, lng: 103.8592 },
    { name: 'Bugis / CBD', lat: 1.3005, lng: 103.8561 },
    { name: 'Jurong East', lat: 1.3332, lng: 103.7423 },
    { name: 'Tampines', lat: 1.3533, lng: 103.9452 },
    { name: 'Woodlands', lat: 1.4368, lng: 103.7865 },
  ];

  const handleJumpToHub = (hub: { name: string; lat: number; lng: number }) => {
    onSetUserLocation({
      name: `${hub.name} Hub`,
      latitude: hub.lat,
      longitude: hub.lng,
    });
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([hub.lat, hub.lng], 15, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Map HUD: Hub Jumps & Controls */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Transit Hub Quick Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Transit Hubs:</span>
          </span>
          {hubs.map((hub) => (
            <button
              key={hub.name}
              onClick={() => handleJumpToHub(hub)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            >
              {hub.name}
            </button>
          ))}
        </div>

        {/* Status indicator and Recenter */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {highlightedServiceNo && (
            <button
              onClick={() => onSelectService(null)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Route {highlightedServiceNo}</span>
              <span className="text-amber-400 text-xs">&times;</span>
            </button>
          )}

          <button
            onClick={() => {
              const map = mapInstanceRef.current;
              if (map) {
                map.flyTo([selectedStop.latitude, selectedStop.longitude], 16, { duration: 0.8 });
              }
            }}
            className="p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-emerald-400 border border-slate-800 shadow-md backdrop-blur-md transition-colors cursor-pointer"
            title="Recenter on current bus stop"
          >
            <Locate className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leaflet DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-300 pointer-events-none hidden sm:block">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <BusIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Singapore Bus Radar</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Seats Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Standing
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Crowded
          </span>
        </div>
      </div>
    </div>
  );
};
