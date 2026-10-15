import React, { useState } from 'react';
import { BusStop, UserAlarm } from '../types/bus';
import { X, Bell, Volume2, BellRing, Trash2, Check } from 'lucide-react';
import { playArrivalChime, requestNotificationPermission } from '../utils/audioAlert';

interface AlarmSetupModalProps {
  stop: BusStop;
  initialServiceNo?: string;
  existingAlarms: UserAlarm[];
  onAddAlarm: (alarm: Omit<UserAlarm, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlarm: (alarmId: string) => void;
  onClose: () => void;
}

export const AlarmSetupModal: React.FC<AlarmSetupModalProps> = ({
  stop,
  initialServiceNo,
  existingAlarms,
  onAddAlarm,
  onDeleteAlarm,
  onClose,
}) => {
  const [selectedService, setSelectedService] = useState(
    initialServiceNo || (stop.services.length > 0 ? stop.services[0] : '')
  );
  const [triggerMinutes, setTriggerMinutes] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    if (notificationEnabled) {
      await requestNotificationPermission();
    }

    onAddAlarm({
      stopCode: stop.code,
      stopName: stop.name,
      serviceNo: selectedService,
      triggerMinutes,
      soundEnabled,
      notificationEnabled,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleTestChime = () => {
    playArrivalChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bus Arrival Alarm</h2>
              <p className="text-xs text-slate-400">
                Stop {stop.code} · {stop.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Select Bus Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Bus Service
            </label>
            <div className="grid grid-cols-4 gap-2">
              {stop.services.map((srv) => (
                <button
                  key={srv}
                  type="button"
                  onClick={() => setSelectedService(srv)}
                  className={`py-2 px-3 rounded-xl font-mono text-sm font-bold border transition-all cursor-pointer ${
                    selectedService === srv
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {srv}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Lead Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Notify Me Before Arrival
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTriggerMinutes(mins)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    triggerMinutes === mins
                      ? 'bg-slate-100 text-slate-950 border-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {mins === 0 ? 'Upon Arr' : `${mins} min${mins > 1 ? 's' : ''}`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              We will trigger an alert when Bus <strong className="text-amber-400">{selectedService}</strong> is within{' '}
              <strong className="text-white">{triggerMinutes} mins</strong> of Stop {stop.code}.
            </p>
          </div>

          {/* Alert Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-slate-200">Play Audio Transit Chime</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-medium text-slate-200">System / Browser Push Notification</span>
              </div>
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleTestChime}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
            >
              Test Arrival Chime Audio &rarr;
            </button>
          </div>

          {/* Active Alarms List */}
          {existingAlarms.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Active Alarms ({existingAlarms.length})
              </div>
              <div className="space-y-2">
                {existingAlarms.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">Bus {a.serviceNo}</span>
                        <span className="text-slate-300">at Stop {a.stopCode}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        Trigger at &le; {a.triggerMinutes} mins
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteAlarm(a.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                      title="Remove alarm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Alarm Set!</span>
              </>
            ) : (
              <span>Set Alert for Bus {selectedService}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
