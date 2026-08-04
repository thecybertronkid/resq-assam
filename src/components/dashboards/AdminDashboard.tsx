import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
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
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { incidents, volunteers, camps, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'duplicates' | 'volunteers' | 'heatmap'>('duplicates');

  const duplicateIncidents = incidents.filter(i => i.aiDuplicateFlag);

  const handleApproveVolunteer = (volId: string) => {
    showToast(`✅ Approved Volunteer ${volId} for deployment!`);
  };

  const handleExportStatewideReport = () => {
    showToast(`📄 Generated Statewide ASDMA Disaster Report CSV for 31 districts!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-amber-950/60 border border-amber-800/80 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            ASDMA STATEWIDE EMERGENCY COMMAND & AI MODERATION
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Government Admin War Room</h1>
          <p className="text-xs text-amber-200">AI duplicate detection, volunteer approvals, relief camp oversight, and CSV report export.</p>
        </div>

        <button
          onClick={handleExportStatewideReport}
          className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 text-xs flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export ASDMA Statewide CSV Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 flex items-center gap-2 ${
            activeTab === 'duplicates' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Duplicate Flag Queue ({duplicateIncidents.length})
        </button>
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`pb-3 flex items-center gap-2 ${
            activeTab === 'volunteers' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          Volunteer Approvals ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`pb-3 flex items-center gap-2 ${
            activeTab === 'heatmap' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          District Inundation Breakdown
        </button>
      </div>

      {/* TAB 1: AI DUPLICATE MODERATION */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Our geospatial AI engine cross-references GPS radius (&lt;500m) and village keywords to highlight potential duplicate user reports.
          </p>

          {duplicateIncidents.length === 0 ? (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
              ✓ No active duplicate incidents flagged by AI right now.
            </div>
          ) : (
            <div className="space-y-3">
              {duplicateIncidents.map(inc => (
                <div key={inc.id} className="bg-slate-900 p-5 rounded-2xl border border-amber-900/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{inc.id}</span>
                      <span className="bg-amber-950 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-800">
                        88% Duplicate Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1">{inc.district} • {inc.village}</p>
                    <p className="text-xs text-slate-400 mt-1">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Merged duplicate report ${inc.id} into primary incident!`)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Merge Duplicate
                    </button>
                    <button
                      onClick={() => showToast(`Approved report ${inc.id} as unique emergency!`)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg text-xs"
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

      {/* TAB 2: VOLUNTEER APPROVALS */}
      {activeTab === 'volunteers' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {volunteers.map(v => (
              <div key={v.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{v.name}</h4>
                  <p className="text-xs text-slate-400">{v.district} • Skills: {v.skills.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveVolunteer(v.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Approve Badge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISTRICT BREAKDOWN */}
      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ASSAM_DISTRICTS.slice(0, 12).map((dist, i) => {
            const incCount = incidents.filter(inc => inc.district === dist).length;
            const campCount = camps.filter(c => c.district === dist).length;
            return (
              <div key={dist} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-xs">{dist}</h4>
                  <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold">
                    {incCount} Incidents
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                  <span>Relief Camps: <strong>{campCount} Open</strong></span>
                  <span className="text-emerald-400 font-semibold">Triage Active</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
