import React from 'react';
import { useApp } from '../../context/AppContext';
import { AXOM_RELIEF_EMERGENCY_DATA } from '../../utils/asdmaSyncEngine';
import { BarChart3, Activity, ShieldCheck, Heart, Users, LifeBuoy, Clock, ExternalLink, Phone, Wifi, Radio } from 'lucide-react';

export const PublicAnalytics: React.FC = () => {
  const { incidents, camps, volunteers, donations, telemetry } = useApp();

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeIncidentsCount = incidents.filter(i => i.status !== 'completed').length;
  const completedRescuesCount = incidents.filter(i => i.status === 'completed').length;
  const verifiedVolunteersCount = volunteers.filter(v => v.isVerified).length;
  const totalCampOccupancy = camps.reduce((sum, c) => sum + c.currentOccupancy, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Sync Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-pink-50 to-emerald-100 border border-sky-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold text-sky-800 tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              ASDMA & AXOM RELIEF NETWORK LIVE SYNC ACTIVE
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
              Synced at {telemetry.lastSyncedAt}
            </span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Statewide Disaster Telemetry & Operational Analytics</h1>
          <p className="text-xs text-slate-600 font-medium">Real-time river level gauges, rescue response metrics, and emergency helpline network.</p>
        </div>

        <a
          href="https://www.axomrelief.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Axom Relief Network (axomrelief.com)
        </a>
      </div>

      {/* Top 4 Key Dynamic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold block">Statewide Affected Population</span>
          <div className="text-3xl font-heading font-extrabold text-emerald-700">{telemetry.totalAffectedPopulation.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-700 font-bold">✓ Synced with ASDMA War Room</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold block">Active Incidents / Rescues</span>
          <div className="text-3xl font-heading font-extrabold text-sky-700">{activeIncidentsCount} / {completedRescuesCount} Done</div>
          <span className="text-[11px] text-sky-700 font-bold">{verifiedVolunteersCount} Verified Volunteers Active</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold block">Relief Camp Occupancy</span>
          <div className="text-3xl font-heading font-extrabold text-purple-700">{totalCampOccupancy} People</div>
          <span className="text-[11px] text-purple-700 font-bold">Across {camps.length} Registered Camps</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold block">Total Donated Relief Funds</span>
          <div className="text-3xl font-heading font-extrabold text-pink-700">₹{totalDonated.toLocaleString()}</div>
          <span className="text-[11px] text-pink-700 font-bold">Audited & 80G Receipts Issued</span>
        </div>
      </div>

      {/* Real-time River Level Gauges Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600 animate-pulse" />
            Live River Level Gauges Telemetry (CWC / ASDMA Stream)
          </h2>
          <span className="text-xs text-slate-500 font-semibold">Auto-refreshing every 15s</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {telemetry.activeRiverGauges.map(g => {
            const isDanger = g.waterLevelMeter >= g.dangerLevelMeter;
            return (
              <div key={g.station} className={`p-4 rounded-2xl border space-y-2 ${isDanger ? 'bg-rose-50/80 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{g.station}</h4>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${isDanger ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {g.trend}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xl font-extrabold text-slate-900">{g.waterLevelMeter} m</span>
                  <span className="text-xs text-slate-500 font-medium">Danger Mark: <strong className="text-rose-700">{g.dangerLevelMeter} m</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Axom Relief & State Helpline Network Directory */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
        <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-600" />
          Axom Relief Network Emergency Helplines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AXOM_RELIEF_EMERGENCY_DATA.stateHelplines.map(h => (
            <div key={h.phone} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">{h.label}</h4>
                <span className="text-sm font-extrabold text-emerald-700">{h.phone}</span>
              </div>
              <a
                href={`tel:${h.phone}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
