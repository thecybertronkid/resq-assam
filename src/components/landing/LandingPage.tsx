import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  LifeBuoy, 
  Tent, 
  MapPin, 
  ArrowRight, 
  Activity, 
  CheckCircle, 
  Heart, 
  Clock, 
  Sparkles,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  Radio,
  Navigation,
  FileSpreadsheet
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { incidents, camps, volunteers, setIsSosModalOpen, setActiveTab, setRole } = useApp();

  const activeIncidentsCount = incidents.filter(i => i.status !== 'completed').length;
  const totalRescuedCount = 4280 + incidents.filter(i => i.status === 'completed').length * 8;
  const activeVolunteersCount = volunteers.length * 45 + 120;
  const activeCampsCount = camps.length;

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 sm:pb-20 animate-fade-in">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-br from-pink-50/70 via-sky-50/50 to-emerald-50/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] sm:text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              24x7 STATE DISASTER RESPONSE PLATFORM FOR ASSAM
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Connecting People. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-600 to-sky-600">
                Coordinating Rescue.
              </span> <br />
              Saving Lives.
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
              Unified real-time disaster management network connecting citizens in flood-affected districts, NDRF/SDRF rescue teams, volunteers, medical units, and NGOs across Assam.
            </p>

            {/* Responsive Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="touch-tile w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-md shadow-pink-500/20 border border-rose-300 flex items-center justify-center gap-2.5 text-sm animate-sos-pulse transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                REPORT EMERGENCY SOS
              </button>

              <button
                onClick={() => { setRole('volunteer'); setActiveTab('volunteer'); }}
                className="touch-tile w-full sm:w-auto bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs flex items-center justify-center gap-2 text-sm transition-all"
              >
                <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
                Join as Volunteer
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className="touch-tile w-full sm:w-auto bg-white hover:bg-purple-50 text-purple-800 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-purple-300 shadow-2xs flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Heart className="w-4.5 h-4.5 text-purple-600" />
                Donate Relief
              </button>
            </div>

            {/* Key Assurance Badges */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>State Verified</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Offline SOS Queue</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>AI Priority Triage</span>
              </div>
            </div>
          </div>

          {/* Right Column - Live Telemetry Stream */}
          <div className="lg:col-span-5">
            <div className="glass-card-premium p-5 sm:p-6 space-y-4 sm:space-y-5 rounded-3xl relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Live Brahmaputra Stream</h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  REAL-TIME ACTIVE
                </span>
              </div>

              {/* Animated Gauges */}
              <div className="space-y-3">
                <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Guwahati Station (Brahmaputra)</span>
                    <span className="font-extrabold text-rose-600">49.80 m (Rising)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-600 h-full w-[88%] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block">Danger Mark: 49.68 m (0.12m above danger level)</span>
                </div>

                <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Nematighat Station (Jorhat)</span>
                    <span className="font-extrabold text-amber-600">86.20 m (Stable)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[72%] rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block">Danger Mark: 85.54 m</span>
                </div>
              </div>

              {/* Action Link to Live Map */}
              <button
                onClick={() => setActiveTab('map')}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>Open Statewide Interactive Live Radar Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 STATS COUNTER CARDS WITH FLOAT ANIMATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-clean p-5 sm:p-6 space-y-2 animate-float">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Dispatches</span>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-rose-600">{activeIncidentsCount}</div>
            <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
              Priority SOS Queue
            </span>
          </div>

          <div className="card-clean p-5 sm:p-6 space-y-2 animate-float" style={{ animationDelay: '0.2s' }}>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Rescued Citizens</span>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-sky-600">{totalRescuedCount.toLocaleString()}</div>
            <span className="text-[11px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200 inline-block">
              NDRF & SDRF Combined
            </span>
          </div>

          <div className="card-clean p-5 sm:p-6 space-y-2 animate-float" style={{ animationDelay: '0.4s' }}>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Verified Volunteers</span>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-emerald-600">{activeVolunteersCount}</div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
              Statewide Roster Active
            </span>
          </div>

          <div className="card-clean p-5 sm:p-6 space-y-2 animate-float" style={{ animationDelay: '0.6s' }}>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Relief Camps Active</span>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-purple-600">{activeCampsCount}</div>
            <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
              Food & Medical Bays
            </span>
          </div>
        </div>
      </section>

      {/* DISASTER MODULE QUICK NAVIGATION TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">Disaster Command Modules</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Click any module tile for instant access to specialized rescue tools.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { id: 'map', title: 'Live Map', icon: MapPin, color: 'bg-rose-50 text-rose-700 border-rose-200' },
            { id: 'camps', title: 'Relief Camps', icon: Tent, color: 'bg-sky-50 text-sky-700 border-sky-200' },
            { id: 'volunteer', title: 'Volunteers', icon: UserCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { id: 'ngo', title: 'Relief Warehouse', icon: LifeBuoy, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { id: 'missing', title: 'Missing Persons', icon: Users, color: 'bg-pink-50 text-pink-700 border-pink-200' },
            { id: 'donations', title: 'Donate Relief', icon: Heart, color: 'bg-amber-50 text-amber-800 border-amber-200' }
          ].map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`touch-tile card-clean p-4 flex flex-col items-center justify-center text-center space-y-2 border hover:border-pink-300 transition-all ${mod.color}`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-bold text-xs">{mod.title}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
