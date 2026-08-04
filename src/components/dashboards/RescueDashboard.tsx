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
      {/* Top Banner - Soft Rose/Pink Gradient */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 border border-rose-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            NDRF / SDRF TACTICAL RESCUE COMMAND
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Statewide Incident Triage Queue</h1>
          <p className="text-xs text-slate-600 font-medium">Dispatch motorized boats, helicopters, and medical units based on AI vulnerability scoring.</p>
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
                        {inc.aiDuplicateFlag && (
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

              {/* Status Update Buttons */}
              <div className="space-y-2">
                <label className="block text-slate-700 text-xs font-bold">Update Mission Status:</label>
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
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Ground Unit */}
              <div className="space-y-2">
                <label className="block text-slate-700 text-xs font-bold">Assign Responder Unit:</label>
                <select
                  value={assignedUnitName}
                  onChange={e => setAssignedUnitName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
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
                <label className="block text-slate-700 text-xs font-bold">Rescue Log Notes & Photo Proof:</label>
                <textarea
                  rows={3}
                  placeholder="Record rescue log, medical condition of evacuees, camp destination..."
                  value={rescueNotes}
                  onChange={e => setRescueNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Target Coordinates: {selectedIncident.lat}, {selectedIncident.lng}</span>
                <button
                  onClick={() => handleUpdateStatus(selectedIncident.id, selectedIncident.status)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl shadow-sm"
                >
                  Save Mission Logs
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center text-slate-500 space-y-3">
              <Compass className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-slate-900 font-bold text-base">Select an Incident from Queue</h3>
              <p className="text-xs max-w-xs mx-auto">Click any incoming SOS report on the left to accept mission, assign rescue boats, and update live triage logs.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
