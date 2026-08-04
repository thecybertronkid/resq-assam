import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { DisasterAlert } from '../../types';
import { Bell, ShieldAlert, Radio, Send, CheckCircle2, PhoneCall, Plus } from 'lucide-react';

export const DisasterAlertsModule: React.FC = () => {
  const { alerts, showToast } = useApp();

  const [localAlerts, setLocalAlerts] = useState<DisasterAlert[]>(alerts);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('critical');
  const [description, setDescription] = useState('');
  const [actionRequired, setActionRequired] = useState('');

  const handleTestBroadcast = (alertTitle: string) => {
    showToast(`📱 Simulated Push Notification & SMS sent for: "${alertTitle}"!`);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    const newAlert: DisasterAlert = {
      id: `ALT-${Date.now()}`,
      title,
      type: 'flood',
      severity,
      district,
      description,
      issuedAt: new Date().toLocaleTimeString(),
      actionRequired: actionRequired || 'Evacuate immediately to higher ground'
    };
    setLocalAlerts([newAlert, ...localAlerts]);
    setIsModalOpen(false);
    showToast(`🚨 Warning Bulletin "${title}" issued to ${district}! Push & SMS broadcast initiated.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100 border border-rose-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            STATE REALTIME RIVER GAUGES & METEOROLOGICAL BULLETINS
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Live Disaster Warning Broadcasts</h1>
          <p className="text-xs text-slate-600 font-medium">Real-time alerts for Brahmaputra river discharge, dam releases, and flash landslides.</p>
        </div>

        {/* Multi-channel alert toggles & Issue Alert Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Issue Alert Bulletin
          </button>

          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs shadow-sm font-bold">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 px-2">
              <input type="checkbox" checked={pushEnabled} onChange={e => setPushEnabled(e.target.checked)} className="text-pink-600 rounded" />
              Push
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 px-2 border-l border-slate-200">
              <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} className="text-pink-600 rounded" />
              SMS
            </label>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {localAlerts.map(alt => (
          <div key={alt.id} className="bg-white p-6 rounded-3xl border border-rose-200 space-y-4 shadow-sm hover:border-pink-300 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
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
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0"
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

      {/* Modal to Issue Alert Bulletin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl my-6">
            <h3 className="font-bold text-base">Issue State Disaster Warning Bulletin</h3>
            <form onSubmit={handleCreateAlert} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Alert Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Flood Warning: Subansiri Dam Release"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Target District</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  >
                    {ASSAM_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Severity Level</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-rose-700 font-bold"
                  >
                    <option value="critical">🚨 CRITICAL</option>
                    <option value="high">⚠️ HIGH</option>
                    <option value="medium">🔷 MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Alert Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe expected water level rise, affected villages, evacuation instructions..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Required Action Directive</label>
                <input
                  type="text"
                  placeholder="e.g. Evacuate immediately to higher ground / Designated Shelters"
                  value={actionRequired}
                  onChange={e => setActionRequired(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl font-bold shadow-sm"
                >
                  Issue Bulletin
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
