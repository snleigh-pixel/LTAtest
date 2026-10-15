import React from 'react';
import { Radio, Bell, MapPin } from 'lucide-react';

interface TopBarProps {
  currentView: 'arrivals' | 'map' | 'alerts' | 'favorites';
  onSelectView: (view: 'arrivals' | 'map' | 'alerts' | 'favorites') => void;
  activeAlarmsCount: number;
  unreadAlertsCount: number;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onSelectView,
  unreadAlertsCount,
  onLocateMe,
  isLocating,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <button
            onClick={() => onSelectView('arrivals')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap block">
              SG BusRadar
            </span>
          </button>
        </div>

        {/* Zone 2: 4 Clean Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectView('arrivals')}
            className={`whitespace-nowrap pb-1 border-b-2 transition-colors cursor-pointer ${
              currentView === 'arrivals'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Arrivals
          </button>
          <button
            onClick={() => onSelectView('map')}
            className={`whitespace-nowrap pb-1 border-b-2 transition-colors cursor-pointer ${
              currentView === 'map'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Radar Map
          </button>
          <button
            onClick={() => onSelectView('alerts')}
            className={`whitespace-nowrap pb-1 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'alerts'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Delay Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            )}
          </button>
          <button
            onClick={() => onSelectView('favorites')}
            className={`whitespace-nowrap pb-1 border-b-2 transition-colors cursor-pointer ${
              currentView === 'favorites'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Saved Stops
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 transition-all shadow-sm shadow-emerald-500/20 whitespace-nowrap cursor-pointer disabled:opacity-50"
            title="Scan for nearest Singapore bus stops"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav Bar (Ensures thumb ergonomics on mobile viewport) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/95 py-2 px-2 text-xs">
        <button
          onClick={() => onSelectView('arrivals')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            currentView === 'arrivals' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Arrivals
        </button>
        <button
          onClick={() => onSelectView('map')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            currentView === 'map' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Radar Map
        </button>
        <button
          onClick={() => onSelectView('alerts')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
            currentView === 'alerts' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts {unreadAlertsCount > 0 ? `(${unreadAlertsCount})` : ''}</span>
        </button>
        <button
          onClick={() => onSelectView('favorites')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            currentView === 'favorites' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Saved
        </button>
      </div>
    </header>
  );
};
