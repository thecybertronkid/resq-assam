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
    link.setAttribute('download', `ASDMA_Statewide_Disaster_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📄 Downloaded ASDMA Statewide Disaster CSV Report (${incidents.length} incidents logged)!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header - Amber/Pink Gradient */}
      <div className="bg-gradient-to-r from-amber-100 via-pink-50 to-emerald-100 border border-amber-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
            ASDMA STATEWIDE EMERGENCY COMMAND & AI MODERATION
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Government Admin War Room</h1>
          <p className="text-xs text-slate-600 font-medium">AI duplicate detection, volunteer approvals, relief camp oversight, and CSV report export.</p>
        </div>

        <button
          onClick={handleExportStatewideReport}
          className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 text-xs flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export ASDMA Statewide CSV Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 flex items-center gap-2 ${
            activeTab === 'duplicates' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Duplicate Flag Queue ({duplicateIncidents.length})
        </button>
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`pb-3 flex items-center gap-2 ${
            activeTab === 'volunteers' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          Volunteer Approvals ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`pb-3 flex items-center gap-2 ${
            activeTab === 'heatmap' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          District Inundation Breakdown
        </button>
      </div>

      {/* TAB 1: AI DUPLICATE MODERATION */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Our geospatial AI engine cross-references GPS radius (&lt;500m) and village keywords to highlight potential duplicate user reports.
          </p>

          {duplicateIncidents.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center text-slate-600 text-xs font-semibold">
              ✓ No active duplicate incidents flagged by AI right now.
            </div>
          ) : (
            <div className="space-y-3">
              {duplicateIncidents.map(inc => (
                <div key={inc.id} className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{inc.id}</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                        88% Duplicate Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-bold mt-1">{inc.district} • {inc.village}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Merged duplicate report ${inc.id} into primary incident!`)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs"
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

      {/* TAB 2: VOLUNTEER APPROVALS */}
      {activeTab === 'volunteers' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {volunteers.map(v => (
              <div key={v.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">{v.district} • Skills: {v.skills.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveVolunteer(v.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs"
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
              <div key={dist} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-xs">{dist}</h4>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-300">
                    {incCount} Incidents
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-100 font-medium">
                  <span>Relief Camps: <strong>{campCount} Open</strong></span>
                  <span className="text-emerald-700 font-bold">Triage Active</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
