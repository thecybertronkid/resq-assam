import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  Tent, 
  Hospital, 
  Navigation, 
  Plus,
  Mic,
  AlertTriangle,
  Send
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { incidents, camps, roadReports, setIsSosModalOpen, showToast } = useApp();

  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('Kamrup Metropolitan');
  const [supplyRequest, setSupplyRequest] = useState('');

  const myIncidents = incidents.filter(i => i.district === selectedDistrictFilter || i.reporterName.includes('Biren') || i.reporterName.includes('Sunita'));
  const nearbyCamps = camps.filter(c => c.district === selectedDistrictFilter);
  const nearbyRoads = roadReports.filter(r => r.district === selectedDistrictFilter);

  const handleSupplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyRequest) return;
    showToast(`📦 Relief supply request "${supplyRequest}" logged for ${selectedDistrictFilter}! Dispatching to nearest NGO.`);
    setSupplyRequest('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner - Soft Sky/Pink Gradient */}
      <div className="bg-gradient-to-r from-sky-100 via-pink-50 to-emerald-100 border border-pink-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-sky-700 tracking-wider">CITIZEN DISASTER PORTAL</span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">My Emergency Tracker & Nearby Shelters</h1>
          <p className="text-xs text-slate-600 font-medium">Track active SOS dispatches and find verified safe locations in your district.</p>
        </div>
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-pink-500/20 text-xs flex items-center gap-2 animate-sos-pulse border border-rose-300"
        >
          <ShieldAlert className="w-4 h-4" />
          Submit New SOS Emergency
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - My SOS Status Tracker */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h2 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Active SOS Incident Timeline
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Showing reports for: {selectedDistrictFilter}</span>
          </div>

          {myIncidents.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-slate-900 font-bold text-sm">No Active SOS Incidents Logged</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                If you or your family are stranded or in danger due to floods, click below to pin your GPS location.
              </p>
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 shadow-sm"
              >
                Pin SOS Emergency
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myIncidents.map(inc => (
                <div key={inc.id} className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{inc.id}</span>
                        <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                        <span className="text-xs text-slate-500">• {inc.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold mt-1">{inc.village} ({inc.landmark})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-700 font-bold uppercase bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">{inc.description}</p>

                  {/* Status Timeline Stepper */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">Rescue Progress Lifecycle:</span>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {[
                        { step: 'pending', label: 'Submitted' },
                        { step: 'accepted', label: 'Verified' },
                        { step: 'en_route', label: 'En Route' },
                        { step: 'rescuing', label: 'Rescue Active' },
                        { step: 'completed', label: 'Completed' }
                      ].map((s) => {
                        const isCurrent = inc.status === s.step;
                        return (
                          <div key={s.step} className="space-y-1">
                            <div className={`h-2 rounded-full ${isCurrent ? 'bg-pink-500 animate-pulse' : 'bg-slate-200'}`} />
                            <span className={`text-[10px] ${isCurrent ? 'text-pink-600 font-bold' : 'text-slate-400'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {inc.assignedTeamName && (
                    <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-sky-900 flex items-center justify-between font-medium">
                      <span>Assigned Unit: <strong>{inc.assignedTeamName}</strong></span>
                      <a href="tel:1070" className="bg-sky-600 text-white px-2.5 py-1 rounded font-bold text-[11px] flex items-center gap-1 shadow-sm">
                        <Phone className="w-3 h-3" /> Contact Unit
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Request Relief Supplies Form */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Request Food, Water, Medicine, or Animal Feed
            </h3>
            <form onSubmit={handleSupplySubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Need 50 drinking water pouches & baby formula for 4 families"
                value={supplyRequest}
                onChange={e => setSupplyRequest(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Nearby Shelters & Blocked Roads */}
        <div className="lg:col-span-5 space-y-6">
          {/* Nearby Relief Camps */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tent className="w-4 h-4 text-emerald-600" />
                Nearby Relief Shelters ({nearbyCamps.length})
              </h3>
            </div>

            <div className="space-y-3">
              {nearbyCamps.map(camp => (
                <div key={camp.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{camp.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{camp.district} • Ph: {camp.contactPhone}</p>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      {camp.currentOccupancy} / {camp.capacity}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-semibold">
                    <span className="bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">✓ Food</span>
                    <span className="bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">✓ Medical</span>
                    <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded border border-pink-200">✓ Women/Child Safe</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Roads in District */}
          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-600" />
              Blocked Roads & Hazards
            </h3>

            <div className="space-y-2">
              {nearbyRoads.map(rd => (
                <div key={rd.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{rd.roadName}</span>
                    <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 uppercase font-bold text-[10px]">{rd.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{rd.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
