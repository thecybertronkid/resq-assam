import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, ShieldAlert, Radio, Send, CheckCircle2, PhoneCall } from 'lucide-react';

export const DisasterAlertsModule: React.FC = () => {
  const { alerts, showToast } = useApp();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const handleTestBroadcast = (alertTitle: string) => {
    showToast(`📱 Simulated Push Notification & SMS sent for: "${alertTitle}"!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100 border border-rose-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            ASDMA REALTIME RIVER GAUGES & METEOROLOGICAL BULLETINS
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Live Disaster Warning Broadcasts</h1>
          <p className="text-xs text-slate-600 font-medium">Real-time alerts for Brahmaputra river discharge, dam releases, and flash landslides.</p>
        </div>

        {/* Multi-channel alert toggles */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs shadow-sm font-bold">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 px-2">
            <input type="checkbox" checked={pushEnabled} onChange={e => setPushEnabled(e.target.checked)} className="text-pink-600 rounded" />
            Push Alerts
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 px-2 border-l border-slate-200">
            <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} className="text-pink-600 rounded" />
            SMS Telemetry
          </label>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map(alt => (
          <div key={alt.id} className="bg-white p-6 rounded-3xl border border-rose-200 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{alt.title}</span>
                    <span className="badge-critical">{alt.severity.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Issued: {alt.issuedAt} • Target District: {alt.district}</p>
                </div>
              </div>

              <button
                onClick={() => handleTestBroadcast(alt.title)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast SMS / Push
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
              {alt.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-semibold">
              {alt.riverLevel && (
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-sky-800">
                  🌊 River Gauge: {alt.riverLevel}
                </div>
              )}
              {alt.damStatus && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800">
                  ⚠️ Dam Status: {alt.damStatus}
                </div>
              )}
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-800 font-bold flex items-center gap-2">
              <span>ACTION REQUIRED: {alt.actionRequired}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
