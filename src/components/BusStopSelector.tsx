import React, { useState, useMemo } from 'react';
import { BusStop } from '../types/bus';
import { Search, Star, MapPin, X, ArrowUpDown } from 'lucide-react';
import { getDistanceInMeters } from '../data/singaporeBusData';

interface BusStopSelectorProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  userCoords: { latitude: number; longitude: number };
}

export const BusStopSelector: React.FC<BusStopSelectorProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  favorites,
  onToggleFavorite,
  userCoords,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lineFilter, setLineFilter] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState(true);

  // Compute stops with distance
  const stopsWithDist = useMemo(() => {
    return stops.map(stop => {
      const dist = getDistanceInMeters(
        userCoords.latitude,
        userCoords.longitude,
        stop.latitude,
        stop.longitude
      );
      return { ...stop, distanceMeters: dist };
    });
  }, [stops, userCoords]);

  // Filtered and sorted stops
  const filteredStops = useMemo(() => {
    let result = stopsWithDist.filter(stop => {
      // MRT line filter
      if (lineFilter && !stop.mrtInterchange?.lines.includes(lineFilter as any)) {
        return false;
      }

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const codeMatch = stop.code.toLowerCase().includes(q);
      const nameMatch = stop.name.toLowerCase().includes(q);
      const roadMatch = stop.road.toLowerCase().includes(q);
      const serviceMatch = stop.services.some(s => s.toLowerCase() === q || s.toLowerCase().startsWith(q));
      const mrtMatch = stop.mrtInterchange?.name.toLowerCase().includes(q);

      return codeMatch || nameMatch || roadMatch || serviceMatch || mrtMatch;
    });

    if (sortByDistance) {
      result.sort((a, b) => a.distanceMeters - b.distanceMeters);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [stopsWithDist, searchQuery, lineFilter, sortByDistance]);

  const mrtLines = [
    { code: 'NSL', label: 'North-South', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { code: 'EWL', label: 'East-West', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { code: 'DTL', label: 'Downtown', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { code: 'CCL', label: 'Circle', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { code: 'TEL', label: 'Thomson-EC', color: 'bg-amber-700/20 text-amber-500 border-amber-700/30' },
    { code: 'NEL', label: 'North-East', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bus stop, 5-digit code, road, or service (e.g. 190, 09048, Orchard)..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* MRT Line Filters & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">MRT Lines:</span>
          {mrtLines.map(line => (
            <button
              key={line.code}
              onClick={() => setLineFilter(lineFilter === line.code ? null : line.code)}
              className={`px-2 py-1 rounded-md border text-xs font-semibold cursor-pointer transition-all ${
                lineFilter === line.code
                  ? 'bg-slate-200 text-slate-950 border-white'
                  : `${line.color} hover:bg-slate-800`
              }`}
            >
              {line.code}
            </button>
          ))}
          {lineFilter && (
            <button
              onClick={() => setLineFilter(null)}
              className="text-slate-400 hover:text-white underline text-xs ml-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={() => setSortByDistance(!sortByDistance)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer ml-auto"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>{sortByDistance ? 'Nearest First' : 'A-Z Sorted'}</span>
        </button>
      </div>

      {/* Quick Selectable Stop Grid / List */}
      <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 border border-slate-800/80 rounded-xl p-1.5 bg-slate-950/60">
        {filteredStops.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No Singapore bus stops found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredStops.map(stop => {
            const isSelected = stop.code === selectedStop.code;
            const isFavorite = favorites.includes(stop.code);
            const distLabel = stop.distanceMeters < 1000 ? `${stop.distanceMeters}m` : `${(stop.distanceMeters / 1000).toFixed(1)}km`;

            return (
              <div
                key={stop.code}
                onClick={() => onSelectStop(stop)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {stop.code}
                    </span>
                    <span className="text-sm font-semibold truncate text-slate-100">
                      {stop.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 truncate">
                    <span>{stop.road}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono">{distLabel}</span>
                    {stop.mrtInterchange && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-sky-300">{stop.mrtInterchange.name} MRT</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(stop.code);
                    }}
                    className={`p-1.5 rounded-md hover:bg-slate-700/60 transition-colors cursor-pointer ${
                      isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Star this stop'}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Active Selected Stop Header Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
              Stop {selectedStop.code}
            </span>
            <span className="text-base font-bold text-white">
              {selectedStop.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{selectedStop.road}</span>
            {selectedStop.mrtInterchange && (
              <>
                <span aria-hidden="true">·</span>
                <span>Interchange: {selectedStop.mrtInterchange.lines.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(selectedStop.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              favorites.includes(selectedStop.code)
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favorites.includes(selectedStop.code) ? 'fill-amber-400' : ''}`} />
            <span>{favorites.includes(selectedStop.code) ? 'Saved' : 'Save Stop'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
