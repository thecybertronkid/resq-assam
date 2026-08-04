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
  AlertTriangle
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
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-br from-pink-50/70 via-sky-50/50 to-emerald-50/60">
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
                className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-md shadow-pink-500/20 border border-rose-300 flex items-center justify-center gap-2.5 text-sm animate-sos-pulse hover:scale-[1.02] transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                REPORT EMERGENCY SOS
              </button>

              <button
                onClick={() => { setRole('volunteer'); setActiveTab('volunteer'); }}
                className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs flex items-center justify-center gap-2 text-sm transition-all"
              >
                <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
                Join as Volunteer
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className="w-full sm:w-auto bg-white hover:bg-purple-50 text-purple-800 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-purple-300 shadow-2xs flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Heart className="w-4.5 h-4.5 text-purple-600" />
                Donate Relief
              </button>
            </div>

            {/* Key Assurance Badges */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ASDMA Verified</span>
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

          {/* Right Column - Live Stream */}
          <div className="lg:col-span-5">
            <div className="card-clean p-4 sm:p-6 space-y-4 sm:space-y-5 bg-white border border-slate-200/90 shadow-lg relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Live Assam Triage Stream</h3>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-bold border border-rose-200">
                  REALTIME
                </span>
              </div>

              {/* Sample Incidents List */}
              <div className="space-y-3">
                {incidents.slice(0, 3).map(inc => (
                  <div key={inc.id} className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 hover:border-pink-300 transition-all">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {inc.district}
                      </span>
                      <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mb-2 font-medium">{inc.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 font-medium">
                      <span>Status: <strong className="text-emerald-700 font-bold uppercase">{inc.status}</strong></span>
                      <span className="text-pink-600 font-bold">AI Score: {inc.aiVulnerabilityScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold py-2.5 rounded-xl border border-sky-200 text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <span>View All Incidents on Live Assam Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATS COUNTER GRID - Responsive 2 Columns on Mobile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: 'Active Incidents', count: activeIncidentsCount, color: 'text-rose-600', icon: ShieldAlert, badge: 'High Triage', bg: 'hover:border-rose-300' },
            { label: 'People Rescued', count: totalRescuedCount.toLocaleString(), color: 'text-emerald-600', icon: LifeBuoy, badge: 'Statewide', bg: 'hover:border-emerald-300' },
            { label: 'Active Volunteers', count: activeVolunteersCount, color: 'text-sky-600', icon: Users, badge: 'On Duty', bg: 'hover:border-sky-300' },
            { label: 'Relief Camps', count: activeCampsCount, color: 'text-amber-600', icon: Tent, badge: 'Open 24x7', bg: 'hover:border-amber-300' },
            { label: 'Avg Response Time', count: '14 Mins', color: 'text-purple-600', icon: Clock, badge: 'NDRF Motorized', bg: 'hover:border-purple-300' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`card-clean p-4 sm:p-5 space-y-1.5 sm:space-y-2 border border-slate-200 bg-white ${stat.bg}`}>
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                  <span className="text-[9px] sm:text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-600 font-bold border border-slate-200">{stat.badge}</span>
                </div>
                <div className={`text-xl sm:text-3xl font-heading font-extrabold ${stat.color}`}>
                  {stat.count}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-bold">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW THE PLATFORM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-heading font-extrabold text-slate-900">How ResQ Assam Operates</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            A seamless 4-step emergency triage lifecycle bridging citizens and fast rescue units.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { step: '01', title: '1. Report SOS', desc: 'Citizen pins GPS location, voice note, & demographic vulnerability count.', color: 'from-rose-500 to-pink-600' },
            { step: '02', title: '2. AI & ASDMA Verification', desc: 'AI filters duplicate reports and scores severity (1-100) for control room triage.', color: 'from-amber-500 to-amber-600' },
            { step: '03', title: '3. Team Dispatch', desc: 'Nearest NDRF/SDRF motorboat or medical unit accepts and navigates to coordinate.', color: 'from-sky-500 to-blue-600' },
            { step: '04', title: '4. Safe Rescue & Shelter', desc: 'Citizens safely evacuated to designated relief camps with live inventory tracking.', color: 'from-emerald-500 to-teal-600' }
          ].map(item => (
            <div key={item.step} className="card-clean p-5 sm:p-6 bg-white space-y-3">
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-2xs inline-block`}>
                STEP {item.step}
              </span>
              <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY DISASTER FEATURE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">AI Duplicate & Severity Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Automated computer vision and geospatial algorithms prevent duplicate incident clutter and prioritize pregnant women, children, and bedridden elders.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Tent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">Relief Camp Occupancy Grid</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Real-time capacity tracking across all 31+ Assam districts with amenity filters for clean drinking water, food packets, toilets, and pet shelters.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">Verified Volunteer Skill Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Instantly deploys registered swimmers, boat operators, doctors, and drone pilots to nearest flooded villages based on real-time GPS telemetry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
