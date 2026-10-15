import React from 'react';
import { BusStop, LiveBus } from '../types/bus';
import { BUS_ROUTES } from '../data/singaporeBusData';
import { X, Navigation, CheckCircle2, ChevronRight } from 'lucide-react';

interface RouteViewerModalProps {
  serviceNo: string;
  allStops: BusStop[];
  currentStopCode: string;
  liveBuses: LiveBus[];
  onSelectStop: (stop: BusStop) => void;
  onClose: () => void;
}

export const RouteViewerModal: React.FC<RouteViewerModalProps> = ({
  serviceNo,
  allStops,
  currentStopCode,
  liveBuses,
  onSelectStop,
  onClose,
}) => {
  const route = BUS_ROUTES[serviceNo];

  // Map route stops to full BusStop objects
  const routeStops = (route?.stops || []).map((code, index) => {
    const found = allStops.find(s => s.code === code);
    return {
      index,
      code,
      name: found?.name || `Stop ${code}`,
      road: found?.road || 'Singapore',
      stopObj: found,
    };
  });

  const matchingBuses = liveBuses.filter(b => b.serviceNo === serviceNo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {serviceNo}
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                {route ? `${route.origin} → ${route.destination}` : `Service ${serviceNo}`}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{route?.operator || 'LTA Transit'}</span>
                <span aria-hidden="true">·</span>
                <span>{routeStops.length} stops in route</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">{matchingBuses.length} active buses</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Linear Stop List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs text-slate-400 mb-2">
            Click any stop to view live arrival board for that location:
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {routeStops.map((item, idx) => {
              const isCurrent = item.code === currentStopCode;
              const busHere = matchingBuses.find(b => b.currentStopCode === item.code || b.nextStopCode === item.code);

              return (
                <div
                  key={item.code}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    if (item.stopObj) {
                      onSelectStop(item.stopObj);
                      onClose();
                    }
                  }}
                >
                  {/* Waypoint Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 border-white text-slate-950 shadow-md shadow-emerald-500/50 scale-110'
                        : busHere
                        ? 'bg-amber-500 border-amber-300 text-slate-950'
                        : 'bg-slate-900 border-slate-700 text-slate-500 group-hover:border-slate-500'
                    }`}
                  >
                    {isCurrent ? (
                      <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    ) : (
                      <span className="text-[9px] font-bold font-mono">{idx + 1}</span>
                    )}
                  </div>

                  {/* Stop Details Card */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 group-hover:bg-slate-800/40 group-hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">
                            {item.code}
                          </span>
                          <span className="text-sm font-semibold truncate text-slate-100">
                            {item.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{item.road}</p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                    </div>

                    {/* Live bus badge if bus is near here */}
                    {busHere && (
                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Navigation className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Bus in transit ({busHere.speedKmH} km/h)</span>
                        </span>
                        <span className="font-mono text-[11px] text-amber-400">
                          {busHere.load === 'SEA' ? 'Seats Available' : 'Crowded'} · {busHere.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Singapore LTA Scheduled Route</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
