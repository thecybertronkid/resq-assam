import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Volunteer, IncidentReport, ReliefCamp, NGOInventory, MissingPerson, RoadReport } from '../../types';
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
  X,
  Activity,
  Tent,
  Package,
  Heart,
  RefreshCcw,
  Check,
  Plus,
  CheckSquare,
  Compass,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    incidents, 
    volunteers, 
    camps, 
    ngos,
    missingPersons,
    roadReports,
    donations,
    updateIncidentStatus,
    deleteIncident,
    verifyVolunteer, 
    deleteVolunteer, 
    updateCampOccupancy,
    deleteCamp,
    updateMissingPersonStatus,
    deleteMissingPerson,
    updateRoadReportStatus,
    deleteRoadReport,
    resetPlatformData,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'volunteers' | 'incidents' | 'camps' | 'ngos' | 'missing' | 'roads' | 'heatmap'>('volunteers');

  // Search & Filters
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [missingSearch, setMissingSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState<string>('ALL');

  // Deletion modal states
  const [volToDelete, setVolToDelete] = useState<Volunteer | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<IncidentReport | null>(null);
  const [campToDelete, setCampToDelete] = useState<ReliefCamp | null>(null);
  const [missingToDelete, setMissingToDelete] = useState<MissingPerson | null>(null);
  const [roadToDelete, setRoadToDelete] = useState<RoadReport | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const duplicateIncidents = incidents.filter(i => i.isAiDuplicate);
  const activeIncidents = incidents.filter(i => i.status !== 'completed' && i.status !== 'cancelled');
  const resolvedIncidents = incidents.filter(i => i.status === 'completed');
  const totalDonationsAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

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

  // Incident filtering
  const filteredIncidents = incidents.filter(i => {
    const matchesDistrict = selectedDistrict === 'ALL' || i.district === selectedDistrict;
    const matchesSeverity = incidentSeverityFilter === 'ALL' || i.severity === incidentSeverityFilter;
    return matchesDistrict && matchesSeverity;
  });

  // Missing Person filtering
  const filteredMissing = missingPersons.filter(m => {
    const matchesSearch = 
      m.fullName.toLowerCase().includes(missingSearch.toLowerCase()) ||
      m.lastSeenLocation.toLowerCase().includes(missingSearch.toLowerCase()) ||
      m.reporterName.toLowerCase().includes(missingSearch.toLowerCase());
    const matchesDistrict = selectedDistrict === 'ALL' || m.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  // Road Report filtering
  const filteredRoads = roadReports.filter(r => {
    const matchesDistrict = selectedDistrict === 'ALL' || r.district === selectedDistrict;
    return matchesDistrict;
  });

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
      {/* Supreme Command Header */}
      <div className="bg-gradient-to-r from-amber-100 via-pink-50 to-emerald-100 border border-amber-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
            SUPREME STATE DISASTER COMMAND CENTER • ASSAM
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Supreme Admin War Room</h1>
          <p className="text-xs text-slate-600 font-medium">Supreme operational control body: Manage dispatches, verify/delete volunteers, missing persons & road hazards moderation.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportStatewideReport}
            className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            title="Reset platform data cleanly to start fresh"
          >
            <RefreshCcw className="w-4 h-4 text-rose-600" />
            Reset Data Fresh
          </button>
        </div>
      </div>

      {/* Supreme KPI Telemetry Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">Total SOS Logged</span>
          <div className="text-2xl font-extrabold text-slate-900">{incidents.length}</div>
          <span className="text-[10px] text-rose-600 font-bold block">{activeIncidents.length} Active • {resolvedIncidents.length} Done</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">Volunteer Force</span>
          <div className="text-2xl font-extrabold text-slate-900">{volunteers.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold block">{volunteers.filter(v => v.isVerified).length} Verified Rescuers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">Relief Camps</span>
          <div className="text-2xl font-extrabold text-slate-900">{camps.length}</div>
          <span className="text-[10px] text-purple-600 font-bold block">{camps.reduce((acc, c) => acc + c.currentOccupancy, 0)} Evacuees</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">NGO Hubs</span>
          <div className="text-2xl font-extrabold text-slate-900">{ngos.length}</div>
          <span className="text-[10px] text-sky-600 font-bold block">Relief Inventories Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">Missing / Hazards</span>
          <div className="text-2xl font-extrabold text-slate-900">{missingPersons.length + roadReports.length}</div>
          <span className="text-[10px] text-amber-600 font-bold block">{missingPersons.length} Missing • {roadReports.length} Blocked Roads</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">Relief Funds</span>
          <div className="text-2xl font-extrabold text-emerald-700">₹{totalDonationsAmount.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold block">{donations.length} 80G Contributions</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'volunteers' ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Volunteer Corps ({volunteers.length})
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'incidents' ? 'text-rose-600 border-b-2 border-rose-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Emergency Dispatches ({incidents.length})
        </button>

        <button
          onClick={() => setActiveTab('missing')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'missing' ? 'text-indigo-600 border-b-2 border-indigo-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          Missing Persons ({missingPersons.length})
        </button>

        <button
          onClick={() => setActiveTab('roads')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'roads' ? 'text-amber-600 border-b-2 border-amber-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          Road Hazards ({roadReports.length})
        </button>

        <button
          onClick={() => setActiveTab('camps')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'camps' ? 'text-purple-600 border-b-2 border-purple-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tent className="w-4 h-4" />
          Relief Camps ({camps.length})
        </button>

        <button
          onClick={() => setActiveTab('ngos')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'ngos' ? 'text-sky-600 border-b-2 border-sky-500 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          NGO Warehouses ({ngos.length})
        </button>

        <button
          onClick={() => setActiveTab('heatmap')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'heatmap' ? 'text-slate-900 border-b-2 border-slate-900 font-extrabold text-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          District Radar
        </button>
      </div>

      {/* TAB 1: VOLUNTEER MANAGEMENT & DELETION */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
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

          {filteredVolunteers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No Volunteers Registered</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                The volunteer roster is completely fresh. Once citizens apply or register on the platform, their records will appear here for Admin verification and management.
              </p>
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!v.isVerified ? (
                      <button
                        onClick={() => verifyVolunteer(v.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify Credential
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                      </span>
                    )}

                    <button
                      onClick={() => setVolToDelete(v)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
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

      {/* TAB 2: EMERGENCY INCIDENTS & DISPATCH CONTROL */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-extrabold text-slate-900">Filter Dispatches by District & Severity:</span>
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
                value={incidentSeverityFilter}
                onChange={e => setIncidentSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="ALL">All Severities</option>
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Activity className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No Emergency Dispatches Logged</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                The incident queue is completely clean and fresh. When citizens submit emergency SOS calls, dispatches will appear here for Admin command triage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIncidents.map(inc => (
                <div key={inc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 hover:border-rose-300 transition-all">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-extrabold text-slate-900">{inc.id}</span>
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-rose-300 uppercase">
                        {inc.disasterType}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                        inc.severity === 'critical' ? 'bg-rose-600 text-white border-rose-700' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{inc.village}, {inc.district}</h4>
                    <p className="text-xs text-slate-600 font-medium">{inc.description}</p>
                    <span className="text-[11px] text-slate-500 block font-semibold">
                      Reporter: {inc.reporterName} ({inc.reporterPhone}) • AI Score: <strong>{inc.aiVulnerabilityScore}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateIncidentStatus(inc.id, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve
                    </button>

                    <button
                      onClick={() => setIncidentToDelete(inc)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MISSING PERSONS COMMAND */}
      {activeTab === 'missing' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search missing person name, last seen location, reporter..."
                value={missingSearch}
                onChange={e => setMissingSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

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
          </div>

          {filteredMissing.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No Missing Person Reports</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                The missing persons registry is completely clean. Reports filed by citizens will appear here for status management & verification.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMissing.map(m => (
                <div key={m.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-start justify-between gap-4 hover:border-indigo-300 transition-all">
                  <div className="flex items-start gap-4">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.fullName} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-extrabold text-xl shrink-0">
                        👤
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-base">{m.fullName}</h4>
                        <span className="text-xs font-semibold text-slate-500">({m.age} yrs • {m.gender})</span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                          ID: {m.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">
                        Last Seen: <strong>{m.lastSeenLocation}</strong> ({m.district}) • Date: <strong>{m.dateMissing}</strong>
                      </p>
                      <p className="text-xs text-slate-600 font-medium">{m.details}</p>
                      <span className="text-[11px] text-slate-500 block font-semibold">
                        Reporter: {m.reporterName} ({m.reporterPhone})
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase">Status:</span>
                      <select
                        value={m.status}
                        onChange={e => updateMissingPersonStatus(m.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="missing">🔴 Missing</option>
                        <option value="found_safe">🟢 Found Safe</option>
                        <option value="hospitalized">🟡 Hospitalized</option>
                        <option value="deceased">⚫ Deceased</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setMissingToDelete(m)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ROAD HAZARDS COMMAND */}
      {activeTab === 'roads' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-extrabold text-slate-900">Filter Road Hazards by Base District:</span>
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
          </div>

          {filteredRoads.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No Road Hazard Reports</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Road status reports are completely clean. Blocked highways or bridge collapsed reports will appear here for status updates and deletion.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRoads.map(r => (
                <div key={r.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-start justify-between gap-4 hover:border-amber-300 transition-all">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-base">{r.roadName}</h4>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                        ID: {r.id}
                      </span>
                      <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {r.district}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{r.details}</p>

                    {r.telemetrics && (
                      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-[11px] text-slate-700 font-semibold flex flex-wrap gap-3">
                        <span>Depth: <strong>{r.telemetrics.waterDepthMeters} m ({r.telemetrics.waterDepthFeet} ft)</strong></span>
                        <span>Obstacle: <strong>{r.telemetrics.obstacleType}</strong></span>
                        <span>Structural Risk: <strong className="text-rose-600">{r.telemetrics.structuralRiskScore}/100</strong></span>
                      </div>
                    )}

                    <span className="text-[11px] text-slate-500 block font-semibold">
                      Reported by: {r.reportedBy} at {r.reportedAt}
                    </span>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase">Road Condition:</span>
                      <select
                        value={r.status}
                        onChange={e => updateRoadReportStatus(r.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value="open">🟢 Open / Passable</option>
                        <option value="waterlogged">🌊 Waterlogged</option>
                        <option value="tree_fallen">🪵 Fallen Tree / Obstacle</option>
                        <option value="landslide">⛰️ Landslide Hazard</option>
                        <option value="bridge_collapse">💥 Bridge Structural Collapse</option>
                        <option value="boat_required">🚤 Motorboat Squad Only</option>
                        <option value="closed">🔴 Road Closed</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setRoadToDelete(r)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RELIEF CAMPS */}
      {activeTab === 'camps' && (
        <div className="space-y-4">
          {camps.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Tent className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No Active Relief Camps</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Relief camps list is completely fresh. Add new relief camps in the Relief Camps module to start managing evacuee shelter capacities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camps.map(camp => (
                <div key={camp.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{camp.district}</span>
                      <h4 className="font-bold text-slate-900 text-base">{camp.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">GPS: ({camp.lat}, {camp.lng})</p>
                    </div>
                    <button
                      onClick={() => setCampToDelete(camp)}
                      className="text-rose-600 hover:text-rose-800 p-1.5 rounded-xl hover:bg-rose-50 border border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center text-xs font-semibold">
                    <span>Occupancy: <strong>{camp.currentOccupancy} / {camp.capacity}</strong></span>
                    <span className="text-emerald-700 font-bold">In-Charge: {camp.inCharge}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: NGO WAREHOUSES */}
      {activeTab === 'ngos' && (
        <div className="space-y-4">
          {ngos.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No Registered NGO Warehouses</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                NGO relief inventory list is fresh. Register NGO hubs in the NGO module to track food packs, water bottles, and trauma kits.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ngos.map(ngo => (
                <div key={ngo.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{ngo.district}</span>
                    <h4 className="font-bold text-slate-900 text-base">{ngo.ngoName}</h4>
                    <p className="text-xs text-slate-600 font-medium">Contact: {ngo.contactPhone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">🍲 Food Packs: <strong>{ngo.items.foodPacks}</strong></div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">💧 Water Litres: <strong>{ngo.items.waterLitres} L</strong></div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">🩺 Medicines: <strong>{ngo.items.medicines}</strong></div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">🛌 Blankets: <strong>{ngo.items.blankets}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: DISTRICT TRIAGE RADAR */}
      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASSAM_DISTRICTS.map((dist) => {
            const incCount = incidents.filter(inc => inc.district === dist).length;
            const campCount = camps.filter(c => c.district === dist).length;
            const volCount = volunteers.filter(v => v.district === dist).length;
            return (
              <div key={dist} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">{dist} District</h4>
                  <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-extrabold border border-rose-300">
                    {incCount} Active SOS Logged
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-700 font-semibold text-center">
                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Open Camps</span>
                    <strong className="text-sm text-purple-700">{campCount}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Rescuers</span>
                    <strong className="text-sm text-emerald-700">{volCount}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Status</span>
                    <strong className="text-xs text-sky-700">ACTIVE RADAR</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DELETE VOLUNTEER MODAL */}
      {volToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 my-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" /> Confirm Volunteer Deletion
              </h3>
              <button onClick={() => setVolToDelete(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-700 font-medium">Delete volunteer record for <strong>"{volToDelete.name}"</strong> ({volToDelete.id})?</p>
            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setVolToDelete(null)} className="flex-1 bg-slate-100 py-3 rounded-xl">Cancel</button>
              <button type="button" onClick={() => { deleteVolunteer(volToDelete.id); setVolToDelete(null); }} className="flex-1 bg-rose-600 text-white py-3 rounded-xl">Delete Volunteer</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE INCIDENT MODAL */}
      {incidentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 my-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" /> Confirm Incident Deletion
              </h3>
              <button onClick={() => setIncidentToDelete(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-700 font-medium">Delete emergency SOS dispatch <strong>"{incidentToDelete.id}"</strong> from <strong>{incidentToDelete.village}</strong>?</p>
            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setIncidentToDelete(null)} className="flex-1 bg-slate-100 py-3 rounded-xl">Cancel</button>
              <button type="button" onClick={() => { deleteIncident(incidentToDelete.id); setIncidentToDelete(null); }} className="flex-1 bg-rose-600 text-white py-3 rounded-xl">Delete Incident</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MISSING PERSON MODAL */}
      {missingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 my-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" /> Confirm Missing Person Deletion
              </h3>
              <button onClick={() => setMissingToDelete(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-700 font-medium">Remove missing person report for <strong>"{missingToDelete.fullName}"</strong> ({missingToDelete.id})?</p>
            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setMissingToDelete(null)} className="flex-1 bg-slate-100 py-3 rounded-xl">Cancel</button>
              <button type="button" onClick={() => { deleteMissingPerson(missingToDelete.id); setMissingToDelete(null); }} className="flex-1 bg-rose-600 text-white py-3 rounded-xl">Delete Record</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ROAD HAZARD MODAL */}
      {roadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 my-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" /> Confirm Road Report Deletion
              </h3>
              <button onClick={() => setRoadToDelete(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-700 font-medium">Delete road hazard report for <strong>"{roadToDelete.roadName}"</strong> ({roadToDelete.id})?</p>
            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setRoadToDelete(null)} className="flex-1 bg-slate-100 py-3 rounded-xl">Cancel</button>
              <button type="button" onClick={() => { deleteRoadReport(roadToDelete.id); setRoadToDelete(null); }} className="flex-1 bg-rose-600 text-white py-3 rounded-xl">Delete Report</button>
            </div>
          </div>
        </div>
      )}

      {/* MASTER RESET CONFIRMATION MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border border-rose-300 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 my-6">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">Master Platform Data Reset</h3>
                <p className="text-xs text-slate-500">Purge all live records cleanly to start 100% fresh</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-rose-50 p-3 rounded-2xl border border-rose-200">
              ⚠️ This will clear all submitted SOS dispatches, registered volunteers, relief camps, NGO stocks, missing persons, and road hazard reports from local and IndexedDB storage.
            </p>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setShowResetConfirmModal(false)} className="flex-1 bg-slate-100 py-3 rounded-xl">Cancel</button>
              <button type="button" onClick={() => { resetPlatformData(); setShowResetConfirmModal(false); }} className="flex-1 bg-rose-600 text-white py-3 rounded-xl">Confirm Master Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
