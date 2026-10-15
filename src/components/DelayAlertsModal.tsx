import React, { useState } from 'react';
import { ServiceAlert } from '../types/bus';
import { X, AlertTriangle, Clock, MapPin, Volume2 } from 'lucide-react';
import { playDelayAlertTone } from '../utils/audioAlert';

interface DelayAlertsModalProps {
  alerts: ServiceAlert[];
  onClose: () => void;
  onFilterByService?: (serviceNo: string) => void;
}

export const DelayAlertsModal: React.FC<DelayAlertsModalProps> = ({
  alerts,
  onClose,
  onFilterByService,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'severe' | 'moderate' | 'minor'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: ServiceAlert['severity']) => {
    switch (severity) {
      case 'severe':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'minor':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">LTA Real-Time Delay Advisories</h2>
              <p className="text-xs text-slate-400">
                Singapore Expressway, Arterial Road & Bus Fleet Disruptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playDelayAlertTone()}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Test delay audio tone"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Severity:</span>
            {(['all', 'severe', 'moderate', 'minor'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-slate-200 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            {filteredAlerts.length} Active Advisories
          </span>
        </div>

        {/* Alerts Feed */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No active delay advisories matching this filter.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.reportedAt}</span>
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    +{alert.estimatedDelayMinutes}m Delay
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Affected Roads */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{alert.affectedRoads.join(', ')}</span>
                  </div>

                  {/* Affected Services Buttons */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Affected:</span>
                    {alert.services.map((srv) => (
                      <button
                        key={srv}
                        onClick={() => {
                          if (onFilterByService) {
                            onFilterByService(srv);
                            onClose();
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer"
                        title={`View Service ${srv}`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with LTA Traffic Incident Management System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
