import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

export const CommuterTips: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs text-slate-300 space-y-3">
      <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
        <Info className="w-4 h-4 text-emerald-400" />
        <span>LTA Singapore Commuter Standard Indicators</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Load Status */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="font-semibold text-slate-200 mb-1">Bus Occupancy (Load)</div>
          <ul className="space-y-1 text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span><strong className="text-emerald-300 font-mono">SEA</strong>: Seats Available</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span><strong className="text-amber-300 font-mono">SDA</strong>: Standing Available</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span><strong className="text-rose-300 font-mono">LSD</strong>: Limited Standing (Crowded)</span>
            </li>
          </ul>
        </div>

        {/* Bus Deck Types */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="font-semibold text-slate-200 mb-1">Vehicle Specifications</div>
          <ul className="space-y-1 text-slate-400">
            <li><strong className="text-slate-200 font-mono">SD</strong>: Single Deck (Standard 35-40 cap)</li>
            <li><strong className="text-slate-200 font-mono">DD</strong>: Double Deck (High Capacity 90+ cap)</li>
            <li><strong className="text-slate-200 font-mono">BD</strong>: Bendy / Articulated bus</li>
            <li><strong className="text-sky-300 font-mono">WAB</strong>: Wheelchair Accessible ramp</li>
          </ul>
        </div>

        {/* Singapore Travel Notes */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="font-semibold text-slate-200 mb-1">Transit Tips & SimplyGo</div>
          <p className="text-slate-400 leading-relaxed">
            Bus arrival forecasts update in real-time. SimplyGo contactless credit cards, debit cards, and Apple/Google Pay are accepted on all SMRT, SBS Transit, Tower Transit, and Go-Ahead services.
          </p>
        </div>
      </div>
    </div>
  );
};
