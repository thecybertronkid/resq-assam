import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Volunteer } from '../../types';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Users, 
  BarChart3, 
  Download, 
  Filter, 
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  ShieldCheck,
  Clock,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Key,
  Phone,
  MapPin,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { incidents, volunteers, camps, verifyVolunteer, deleteVolunteer, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'duplicates' | 'volunteers' | 'heatmap'>('volunteers');
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  // Deletion modal state
  const [volToDelete, setVolToDelete] = useState<Volunteer | null>(null);

  const duplicateIncidents = incidents.filter(i => i.isAiDuplicate);

  // Volunteer filtering
  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      (v.userId && v.userId.toLowerCase().includes(volunteerSearch.toLowerCase())) ||
      v.phone.includes(volunteerSearch) ||
      (v.serviceableArea && v.serviceableArea.toLowerCase().includes(volunteerSearch.toLowerCase()));

    const matchesDistrict = selectedDistrict === 'ALL' || v.district === selectedDistrict;

    const matchesStatus = 
      selectedStatusFilter === 'ALL' ? true :
      selectedStatusFilter === 'VERIFIED' ? v.isVerified :
      !v.isVerified;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const handleApproveVolunteer = (volId: string) => {
    verifyVolunteer(volId);
  };

  const handleDeleteVolunteerConfirm = () => {
    if (!volToDelete) return;
    deleteVolunteer(volToDelete.id);
    setVolToDelete(null);
  };

  const handleExportStatewideReport = () => {
    const headers = ['Incident ID', 'District', 'Village', 'Disaster Type', 'Severity', 'AI Score', 'Status', 'Children', 'Elderly', 'Pregnant'];
    const rows = incidents.map(i => [
      i.id,
      `"${i.district}"`,
      `"${i.village}"`,
      i.disasterType,
      i.severity,
      i.aiVulnerabilityScore,
      i.status,
      i.demographics.children,
      i.demographics.elderly,
      i.demographics.pregnant
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Statewide_Disaster_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📄 Downloaded Statewide Disaster CSV Report (${incidents.length} incidents logged)!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 via-pink-50 to-emerald-100 border border-amber-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
            STATEWIDE EMERGENCY COMMAND & AI MODERATION
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Government Admin War Room</h1>
          <p className="text-xs text-slate-600 font-medium">Manage & delete volunteers, verify credentials, resolve AI duplicate flags, and export CSV reports.</p>
        </div>

        <button
          onClick={handleExportStatewideReport}
          className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 text-xs flex items-center gap-2 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Statewide Disaster CSV Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'volunteers' ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Volunteer Management & Approvals ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'duplicates' ? 'text-pink-600 border-b-2 border-pink-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Duplicate Flags ({duplicateIncidents.length})
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'heatmap' ? 'text-sky-600 border-b-2 border-sky-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          District Triage Overview
        </button>
      </div>

      {/* TAB 1: VOLUNTEER MANAGEMENT & DELETION */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          {/* Volunteer Telemetry Summary Counter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase">Total Registered Volunteers</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{volunteers.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase">Active Verified Rescuers</span>
                <div className="text-2xl font-extrabold text-emerald-900 mt-0.5">{volunteers.filter(v => v.isVerified).length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-800 font-extrabold uppercase">Pending Verification</span>
                <div className="text-2xl font-extrabold text-amber-900 mt-0.5">{volunteers.filter(v => !v.isVerified).length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filters & Search Controls */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search volunteer by name, User ID, phone or area..."
                value={volunteerSearch}
                onChange={e => setVolunteerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="ALL">All Active Districts</option>
                {ASSAM_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="ALL">All Verification Statuses</option>
                <option value="VERIFIED">✅ Verified Only</option>
                <option value="PENDING">⏳ Pending Only</option>
              </select>
            </div>
          </div>

          {/* Volunteer Roster Table / Card List */}
          {filteredVolunteers.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center text-slate-600 text-xs font-semibold">
              No volunteers match the current search or filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVolunteers.map(v => (
                <div key={v.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 hover:border-emerald-300 transition-all">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-sm">{v.name}</h4>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                        ID: {v.id}
                      </span>
                      {v.userId && (
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold flex items-center gap-1">
                          <Key className="w-2.5 h-2.5" /> User: {v.userId}
                        </span>
                      )}
                      {v.isVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Responder
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" /> Pending Approval
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> <strong>{v.district}</strong></span>
                      {v.serviceableArea && <span className="text-slate-500">• {v.serviceableArea}</span>}
                      <span className="flex items-center gap-1 text-slate-600"><Phone className="w-3.5 h-3.5 text-sky-600" /> {v.phone}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {v.skills.map(sk => (
                        <span key={sk} className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200">
                          {sk.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                      {v.tasksAssigned > 0 && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-purple-300">
                          Missions Completed: {v.tasksAssigned}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!v.isVerified ? (
                      <button
                        onClick={() => handleApproveVolunteer(v.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify Credential
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                      </span>
                    )}

                    {/* Delete Volunteer Button */}
                    <button
                      onClick={() => setVolToDelete(v)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      title={`Delete volunteer record for ${v.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI DUPLICATE FLAGS */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            AI Computer Vision & NLP Engine flags duplicate emergency submissions from identical GPS locations within 30 minutes.
          </p>

          {duplicateIncidents.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center text-slate-600 text-xs font-semibold">
              ✅ No duplicate emergency flags in queue. All incoming SOS calls are unique.
            </div>
          ) : (
            <div className="space-y-3">
              {duplicateIncidents.map(inc => (
                <div key={inc.id} className="bg-white p-4 rounded-3xl border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-300">
                        AI Duplicate Cluster {inc.duplicateMatchedId ? `#${inc.duplicateMatchedId}` : ''}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{inc.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{inc.village}, {inc.district}</h4>
                    <p className="text-xs text-slate-600">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Merged duplicate report ${inc.id} into primary cluster!`)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs"
                    >
                      Merge Duplicate
                    </button>
                    <button
                      onClick={() => showToast(`Approved report ${inc.id} as unique emergency!`)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-200"
                    >
                      Dismiss Flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DISTRICT BREAKDOWN */}
      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ASSAM_DISTRICTS.map((dist) => {
            const incCount = incidents.filter(inc => inc.district === dist).length;
            const campCount = camps.filter(c => c.district === dist).length;
            const volCount = volunteers.filter(v => v.district === dist).length;
            return (
              <div key={dist} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-xs">{dist}</h4>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-300">
                    {incCount} Incidents
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-100 font-medium">
                  <span>Relief Camps: <strong>{campCount} Open</strong></span>
                  <span className="text-emerald-700 font-bold">{volCount} Rescuers Active</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DELETE VOLUNTEER CONFIRMATION MODAL */}
      {volToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 animate-in fade-in zoom-in-95 my-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                Confirm Volunteer Deletion
              </h3>
              <button
                onClick={() => setVolToDelete(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Are you sure you want to permanently delete volunteer record for <strong>"{volToDelete.name}"</strong> ({volToDelete.id}) from <strong>{volToDelete.district}</strong>?
            </p>

            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-[11px] text-rose-800 font-semibold space-y-1">
              <div>• User ID: <strong>{volToDelete.userId || 'N/A'}</strong></div>
              <div>• Phone: <strong>{volToDelete.phone}</strong></div>
              <div>• Serviceable Area: <strong>{volToDelete.serviceableArea || volToDelete.district}</strong></div>
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setVolToDelete(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteVolunteerConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Volunteer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
