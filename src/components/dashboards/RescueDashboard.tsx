import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentReport } from '../../types';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  CheckCircle, 
  ExternalLink, 
  Upload, 
  Users, 
  Filter, 
  Compass, 
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const RescueDashboard: React.FC = () => {
  const { incidents, volunteers, updateIncidentStatus, showToast } = useApp();

  const [sortBy, setSortBy] = useState<'ai' | 'severity' | 'time'>('ai');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

  // Active free verified volunteers list
  const activeVerifiedVolunteers = volunteers.filter(v => v.isVerified && v.available);

  const [assignedUnitName, setAssignedUnitName] = useState(
    activeVerifiedVolunteers.length > 0 
      ? `${activeVerifiedVolunteers[0].name} (${activeVerifiedVolunteers[0].skills.join(', ')})`
      : 'NDRF Motorized Deep Rescue Boat Unit 3'
  );
  const [rescueNotes, setRescueNotes] = useState('');
  const [rescuePhotoUrl, setRescuePhotoUrl] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80');

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortBy === 'ai') return b.aiVulnerabilityScore - a.aiVulnerabilityScore;
    if (sortBy === 'severity') {
      const rank = { critical: 4, high: 3, medium: 2, low: 1 };
      return rank[b.severity] - rank[a.severity];
    }
    return 0;
  });

  const handleUpdateStatus = (id: string, newStatus: IncidentReport['status']) => {
    updateIncidentStatus(
      id,
      newStatus,
      'VOL-DISPATCH-01',
      assignedUnitName,
      rescuePhotoUrl
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({ ...selectedIncident, status: newStatus, assignedTeamName: assignedUnitName });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 border border-rose-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            NDRF / SDRF TACTICAL RESCUE COMMAND & VOLUNTEER DISPATCH
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Statewide Incident Triage Queue</h1>
          <p className="text-xs text-slate-600 font-medium">Assign verified active volunteers, motorized boats, and medical units based on AI vulnerability scoring.</p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 text-xs shadow-sm font-bold">
          <span className="text-slate-500 font-semibold px-2">Sort Triage:</span>
          <button
            onClick={() => setSortBy('ai')}
            className={`px-3 py-1 rounded-lg ${sortBy === 'ai' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-700'}`}
          >
            🔥 AI Vulnerability Rank
          </button>
          <button
            onClick={() => setSortBy('severity')}
            className={`px-3 py-1 rounded-lg ${sortBy === 'severity' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-700'}`}
          >
            🚨 Emergency Level
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Incident List Column */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider">
            Incoming Dispatches ({sortedIncidents.length})
          </h2>

          {sortedIncidents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-2">
              <p className="text-slate-600 font-bold text-xs">No active incident dispatches in queue.</p>
              <p className="text-[11px] text-slate-400 font-medium">Incoming citizen emergency SOS submissions will populate here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedIncidents.map(inc => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-pink-400 shadow-md ring-2 ring-pink-100'
                        : 'bg-white border-slate-200 hover:border-pink-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">{inc.id}</span>
                          <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                          {inc.isAiDuplicate && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-300">
                              ⚠️ AI Duplicate Flag
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-semibold mt-1">{inc.district} — {inc.village}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-pink-700 bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-300">
                          AI Score: {inc.aiVulnerabilityScore}/100
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block mt-1">
                          Status: <strong className="text-emerald-700 font-bold">{inc.status}</strong>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-2 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-3">
                      <span>👶 {inc.demographics.children} kids | 👵 {inc.demographics.elderly} elderly | 🤰 {inc.demographics.pregnant} pregnant</span>
                      <span className="text-sky-600 font-bold">Click to Manage →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tactical Mission Command Inspector */}
        <div className="lg:col-span-6 space-y-6">
          {selectedIncident ? (
            <div className="bg-white p-6 rounded-3xl border border-pink-200 shadow-md space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    Mission Control: {selectedIncident.id}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Reporter: {selectedIncident.reporterName} ({selectedIncident.reporterPhone})</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedIncident.lat},${selectedIncident.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> GPS Nav
                </a>
              </div>

              {/* FIX 4: Active Free Verified Volunteers Selection Dropdown */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Assign Active Verified Volunteer / Responder Unit:
                  </label>

                  {activeVerifiedVolunteers.length > 0 ? (
                    <select
                      value={assignedUnitName}
                      onChange={e => setAssignedUnitName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs"
                    >
                      {activeVerifiedVolunteers.map(vol => (
                        <option key={vol.id} value={`${vol.name} (${vol.skills.join(', ')})`}>
                          🦺 {vol.name} — {vol.skills.join(', ')} ({vol.district})
                        </option>
                      ))}
                      <option value="NDRF 1st Bn Patgaon Deep Motorboat Squad">🚤 NDRF 1st Bn Patgaon Deep Motorboat Squad</option>
                      <option value="SDRF Jorhat Aquatic Rescue Unit">🚣 SDRF Jorhat Aquatic Rescue Unit</option>
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-bold">
                        ⚠️ No active verified volunteers available. Select official NDRF/SDRF unit:
                      </div>
                      <select
                        value={assignedUnitName}
                        onChange={e => setAssignedUnitName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs"
                      >
                        <option value="NDRF 1st Bn Patgaon Deep Motorboat Squad">🚤 NDRF 1st Bn Patgaon Deep Motorboat Squad</option>
                        <option value="SDRF Jorhat Aquatic Rescue Unit">🚣 SDRF Jorhat Aquatic Rescue Unit</option>
                        <option value="SDRF Sivasagar Flood Response Team">🚣 SDRF Sivasagar Flood Response Team</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Incident Location & Landmark:</span>
                  <p className="text-slate-900 font-bold">{selectedIncident.village} ({selectedIncident.landmark})</p>
                  <p className="text-slate-600 font-medium text-[11px]">{selectedIncident.description}</p>
                </div>

                {/* Status Update Buttons */}
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Update Mission Lifecycle Status:</span>
                  <div className="grid grid-cols-2 gap-2 font-bold">
                    <button
                      onClick={() => handleUpdateStatus(selectedIncident.id, 'accepted')}
                      className="bg-sky-600 hover:bg-sky-500 text-white py-2 rounded-xl text-xs"
                    >
                      Accept Mission
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedIncident.id, 'en_route')}
                      className="bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-xl text-xs"
                    >
                      En Route
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedIncident.id, 'rescuing')}
                      className="bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-xl text-xs"
                    >
                      Rescue Active
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedIncident.id, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-2">
              <p className="text-slate-600 font-bold text-xs">Select an incident from the triage queue to dispatch volunteers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
