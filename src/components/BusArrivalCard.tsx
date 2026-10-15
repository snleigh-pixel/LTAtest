import React from 'react';
import { BusServiceArrival, LoadStatus, BusType } from '../types/bus';
import { Bell, BellRing, Navigation, AlertTriangle, Accessibility } from 'lucide-react';

interface BusArrivalCardProps {
  arrival: BusServiceArrival;
  hasActiveAlarm: boolean;
  onSetAlarm: (serviceNo: string) => void;
  onTrackOnMap: (serviceNo: string) => void;
  onViewRoute: (serviceNo: string) => void;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  arrival,
  hasActiveAlarm,
  onSetAlarm,
  onTrackOnMap,
  onViewRoute,
}) => {
  const getLoadText = (load: LoadStatus) => {
    switch (load) {
      case 'SEA':
        return { label: 'Seats Avail', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10' };
      case 'SDA':
        return { label: 'Standing', colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10' };
      case 'LSD':
        return { label: 'Crowded', colorClass: 'text-rose-400', bgClass: 'bg-rose-500/10' };
    }
  };

  const getBusTypeLabel = (type: BusType) => {
    switch (type) {
      case 'DD':
        return 'Double Deck';
      case 'BD':
        return 'Bendy';
      case 'SD':
      default:
        return 'Single Deck';
    }
  };

  const nextLoad = getLoadText(arrival.nextBus.load);
  const isImminent = arrival.nextBus.estimatedMinutes <= 1;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 transition-all hover:border-slate-700">
      {/* Top Row: Service Number & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
            {arrival.serviceNo}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{arrival.operator}</span>
            <span aria-hidden="true">·</span>
            <span>{getBusTypeLabel(arrival.nextBus.type)}</span>
            {arrival.nextBus.feature === 'WAB' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-400" title="Wheelchair Accessible">
                  <Accessibility className="w-3.5 h-3.5 text-sky-400" />
                  <span>WAB</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onSetAlarm(arrival.serviceNo)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              hasActiveAlarm
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={hasActiveAlarm ? 'Alarm active for this service' : 'Set arrival alert'}
          >
            {hasActiveAlarm ? <BellRing className="w-4 h-4 text-amber-400 animate-bounce" /> : <Bell className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onTrackOnMap(arrival.serviceNo)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Track live vehicle on radar map"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Radar</span>
          </button>
        </div>
      </div>

      {/* Primary Arrival Timing Display */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        {/* Next Bus */}
        <div className="flex items-center gap-3">
          <div className="text-left">
            <span className="text-xs uppercase tracking-wider text-slate-400 block font-medium">Next Bus</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
                  isImminent ? 'text-emerald-400' : 'text-slate-100'
                }`}
              >
                {arrival.nextBus.estimatedArrival}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${nextLoad.bgClass} ${nextLoad.colorClass}`}>
                {nextLoad.label}
              </span>
            </div>
          </div>
        </div>

        {/* Next Bus 2 & Next Bus 3 */}
        <div className="flex items-center gap-5 sm:gap-6 text-sm">
          {arrival.nextBus2 && (
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-medium">2nd Bus</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-300 font-mono tabular-nums">
                  {arrival.nextBus2.estimatedArrival}
                </span>
                <span className={`text-[10px] font-medium ${getLoadText(arrival.nextBus2.load).colorClass}`}>
                  {getLoadText(arrival.nextBus2.load).label}
                </span>
              </div>
            </div>
          )}

          {arrival.nextBus3 && (
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-medium">3rd Bus</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-400 font-mono tabular-nums">
                  {arrival.nextBus3.estimatedArrival}
                </span>
                <span className={`text-[10px] font-medium ${getLoadText(arrival.nextBus3.load).colorClass}`}>
                  {getLoadText(arrival.nextBus3.load).label}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => onViewRoute(arrival.serviceNo)}
            className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors ml-auto cursor-pointer"
          >
            Route Details &rarr;
          </button>
        </div>
      </div>

      {/* Delay / Disruption Warning Banner if present */}
      {arrival.inDelay && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-200">
              {arrival.delayReason || 'Traffic Headway Delay'}
            </span>
            {arrival.delayMinutes && (
              <span className="ml-2 font-mono tabular-nums text-amber-400">
                (+{arrival.delayMinutes} mins delay)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
