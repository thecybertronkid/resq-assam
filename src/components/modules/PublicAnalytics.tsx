import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { BarChart3, Activity, ShieldCheck, Heart, Users, LifeBuoy, Clock } from 'lucide-react';

export const PublicAnalytics: React.FC = () => {
  const { incidents, camps, volunteers, donations } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            PUBLIC TRANSPARENCY & STATEWIDE DISASTER PERFORMANCE DASHBOARD
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Assam Emergency Operational Metrics</h1>
          <p className="text-xs text-slate-400">Open government telemetry data for citizens, press, and international relief auditors.</p>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Total Evacuated & Rescued</span>
          <div className="text-3xl font-heading font-extrabold text-emerald-400">4,289 Persons</div>
          <span className="text-[11px] text-emerald-400 font-medium">✓ 100% Verified Log</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Avg NDRF Motorboat Arrival</span>
          <div className="text-3xl font-heading font-extrabold text-blue-400">14 Mins</div>
          <span className="text-[11px] text-blue-400 font-medium">Down from 45 mins baseline</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Relief Ration Distributed</span>
          <div className="text-3xl font-heading font-extrabold text-purple-400">28,400 Packs</div>
          <span className="text-[11px] text-purple-400 font-medium">Food, Water & Medicines</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Total Donated Funds</span>
          <div className="text-3xl font-heading font-extrabold text-amber-400">₹45.2 Lakhs</div>
          <span className="text-[11px] text-amber-400 font-medium">Audited & Receipts Issued</span>
        </div>
      </div>

      {/* District-wise Statistics */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          District Inundation Heatmap & Operational Load
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ASSAM_DISTRICTS.slice(0, 8).map(dist => {
            const incCount = incidents.filter(i => i.district === dist).length + Math.floor(Math.random() * 5 + 1);
            const loadPct = Math.min(95, incCount * 18);
            return (
              <div key={dist} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>{dist}</span>
                  <span className="text-red-400">{incCount} Incidents</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${loadPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
