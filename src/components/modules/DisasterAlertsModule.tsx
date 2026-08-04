import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, ShieldAlert, Radio, Send, CheckCircle2, PhoneCall } from 'lucide-react';

export const DisasterAlertsModule: React.FC = () => {
  const { alerts, showToast } = useApp();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleTestBroadcast = (alertTitle: string) => {
    showToast(`📱 Simulated Push Notification & SMS sent for: "${alertTitle}"!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-red-950/60 border border-red-800/80 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-red-400 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            ASDMA REALTIME RIVER GAUGES & METEOROLOGICAL BULLETINS
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Live Disaster Warning Broadcasts</h1>
          <p className="text-xs text-red-200">Real-time alerts for Brahmaputra river discharge, dam releases, and flash landslides.</p>
        </div>

        {/* Multi-channel alert toggles */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-semibold px-2">
            <input type="checkbox" checked={pushEnabled} onChange={e => setPushEnabled(e.target.checked)} />
            Push Alerts
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-semibold px-2 border-l border-slate-800">
            <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} />
            SMS Telemetry
          </label>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map(alt => (
          <div key={alt.id} className="bg-slate-900 p-6 rounded-3xl border border-red-900/60 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">{alt.title}</span>
                    <span className="badge-critical">{alt.severity.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-400">Issued: {alt.issuedAt} • Target District: {alt.district}</p>
                </div>
              </div>

              <button
                onClick={() => handleTestBroadcast(alt.title)}
                className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast SMS / Push
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              {alt.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {alt.riverLevel && (
                <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-800/40 text-blue-300 font-semibold">
                  🌊 River Gauge: {alt.riverLevel}
                </div>
              )}
              {alt.damStatus && (
                <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-800/40 text-amber-300 font-semibold">
                  ⚠️ Dam Status: {alt.damStatus}
                </div>
              )}
            </div>

            <div className="bg-red-950/40 p-3 rounded-xl border border-red-800/40 text-xs text-red-300 font-bold flex items-center gap-2">
              <span>ACTION REQUIRED: {alt.actionRequired}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
