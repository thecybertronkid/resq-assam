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
  Sparkles
} from 'lucide-react';

export const RescueDashboard: React.FC = () => {
  const { incidents, updateIncidentStatus, showToast } = useApp();

  const [sortBy, setSortBy] = useState<'ai' | 'severity' | 'time'>('ai');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

  const [assignedUnitName, setAssignedUnitName] = useState('1st Bn NDRF Patgaon (Boat Unit 3)');
  const [rescueNotes, setRescueNotes] = useState('');
  const [rescuePhotoUrl, setRescuePhotoUrl] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80');

  // Sorting logic
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
      'NDRF-BN-01',
      assignedUnitName,
      rescueNotes,
      rescuePhotoUrl
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({ ...selectedIncident, status: newStatus, rescueNotes, assignedTeamName: assignedUnitName });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-red-950/60 border border-red-800/80 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-red-400 tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            NDRF / SDRF TACTICAL RESCUE COMMAND
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Statewide Incident Triage Queue</h1>
          <p className="text-xs text-red-200">Dispatch motorized boats, helicopters, and medical units based on AI vulnerability scoring.</p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold px-2">Sort Triage:</span>
          <button
            onClick={() => setSortBy('ai')}
            className={`px-3 py-1 rounded-lg font-bold ${sortBy === 'ai' ? 'bg-red-600 text-white' : 'text-slate-300'}`}
          >
            🔥 AI Vulnerability Rank
          </button>
          <button
            onClick={() => setSortBy('severity')}
            className={`px-3 py-1 rounded-lg font-bold ${sortBy === 'severity' ? 'bg-red-600 text-white' : 'text-slate-300'}`}
          >
            🚨 Emergency Level
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Incident List Column */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
            Incoming Dispatches ({sortedIncidents.length})
          </h2>

          <div className="space-y-3">
            {sortedIncidents.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-base">{inc.id}</span>
                        <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                        {inc.aiDuplicateFlag && (
                          <span className="bg-amber-950 text-amber-400 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-800">
                            ⚠️ AI Duplicate Flag
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">{inc.district} — {inc.village}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800/80">
                        AI Score: {inc.aiVulnerabilityScore}/100
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block mt-1">
                        Status: <strong className="text-emerald-400">{inc.status}</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    {inc.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mt-3">
                    <span>👶 {inc.demographics.children} kids | 👵 {inc.demographics.elderly} elderly | 🤰 {inc.demographics.pregnant} pregnant</span>
                    <span className="text-blue-400 font-semibold">Click to Manage →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tactical Mission Command Inspector */}
        <div className="lg:col-span-6 space-y-6">
          {selectedIncident ? (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-heading font-extrabold text-white text-lg flex items-center gap-2">
                    Mission Control: {selectedIncident.id}
                  </h3>
                  <p className="text-xs text-slate-400">Reporter: {selectedIncident.reporterName} ({selectedIncident.reporterPhone})</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedIncident.lat},${selectedIncident.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> GPS Nav
                </a>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-semibold">Update Mission Status:</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    { id: 'accepted', label: '1. Accept Mission' },
                    { id: 'en_route', label: '2. Team En Route' },
                    { id: 'rescuing', label: '3. Rescue Active' },
                    { id: 'completed', label: '4. Rescue Complete' },
                    { id: 'unable', label: '✕ Unable to Reach' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => handleUpdateStatus(selectedIncident.id, st.id as any)}
                      className={`py-2 px-2 rounded-xl border text-center transition-all ${
                        selectedIncident.status === st.id
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Ground Unit */}
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-semibold">Assign Responder Unit:</label>
                <select
                  value={assignedUnitName}
                  onChange={e => setAssignedUnitName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                >
                  <option>1st Bn NDRF Patgaon (Boat Unit 3)</option>
                  <option>SDRF Guwahati Deep Rescue Team</option>
                  <option>Silchar SDRF Riverine Battalion</option>
                  <option>Indian Army Eastern Command Heli Unit 2</option>
                  <option>Civil Defence Quick Response Team</option>
                </select>
              </div>

              {/* Tactical Notes & Proof Upload */}
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-semibold">Rescue Log Notes & Photo Proof:</label>
                <textarea
                  rows={3}
                  placeholder="Record rescue log, medical condition of evacuees, camp destination..."
                  value={rescueNotes}
                  onChange={e => setRescueNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Target Coordinates: {selectedIncident.lat}, {selectedIncident.lng}</span>
                <button
                  onClick={() => handleUpdateStatus(selectedIncident.id, selectedIncident.status)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Save Mission Logs
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center text-slate-400 space-y-3">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-white font-bold text-base">Select an Incident from Queue</h3>
              <p className="text-xs max-w-xs mx-auto">Click any incoming SOS report on the left to accept mission, assign rescue boats, and update live triage logs.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
