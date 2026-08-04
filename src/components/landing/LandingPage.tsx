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
  const { incidents, camps, volunteers, setIsSosModalOpen, setActiveTab, setIsAuthModalOpen, setRole } = useApp();

  const activeIncidentsCount = incidents.filter(i => i.status !== 'completed').length;
  const totalRescuedCount = 4280 + incidents.filter(i => i.status === 'completed').length * 8;
  const activeVolunteersCount = volunteers.length * 45 + 120;
  const activeCampsCount = camps.length;

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              24x7 STATE DISASTER RESPONSE PLATFORM FOR ASSAM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight">
              Connecting People. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400">
                Coordinating Rescue.
              </span> <br />
              Saving Lives.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Unified real-time disaster management network connecting citizens in flood-affected districts, NDRF/SDRF rescue teams, volunteers, medical units, and NGOs across Assam.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-2xl shadow-red-600/40 border border-red-400 flex items-center gap-3 text-sm animate-sos-pulse"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                REPORT EMERGENCY SOS
              </button>

              <button
                onClick={() => { setRole('volunteer'); setActiveTab('volunteer'); }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl border border-slate-700 flex items-center gap-2 text-sm"
              >
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Join as Volunteer
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-semibold px-5 py-3.5 rounded-2xl border border-slate-800 flex items-center gap-2 text-sm"
              >
                <Heart className="w-5 h-5 text-purple-400" />
                Donate Relief
              </button>
            </div>

            {/* Key Assurance Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ASDMA Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Offline SOS Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>AI Priority Triage</span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Emergency Visual Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl space-y-5 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="font-heading font-bold text-white text-sm">Live Assam Triage Stream</h3>
                </div>
                <span className="text-[11px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold border border-red-800">
                  REALTIME
                </span>
              </div>

              {/* Sample Live Incidents Preview */}
              <div className="space-y-3">
                {incidents.slice(0, 3).map(inc => (
                  <div key={inc.id} className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 hover:border-blue-500/40 transition-all">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {inc.district}
                      </span>
                      <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 mb-2">{inc.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Status: <strong className="text-emerald-400 uppercase">{inc.status}</strong></span>
                      <span className="text-amber-400 font-semibold">AI Score: {inc.aiVulnerabilityScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold py-2.5 rounded-xl border border-blue-500/40 text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>View All Incidents on Live Assam Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATS COUNTER GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Active Incidents', count: activeIncidentsCount, color: 'text-red-500', icon: ShieldAlert, badge: 'High Triage' },
            { label: 'People Rescued', count: totalRescuedCount.toLocaleString(), color: 'text-emerald-400', icon: LifeBuoy, badge: 'Statewide' },
            { label: 'Active Volunteers', count: activeVolunteersCount, color: 'text-blue-400', icon: Users, badge: 'On Duty' },
            { label: 'Relief Camps', count: activeCampsCount, color: 'text-amber-400', icon: Tent, badge: 'Open 24x7' },
            { label: 'Avg Response Time', count: '14 Mins', color: 'text-purple-400', icon: Clock, badge: 'NDRF Motorized' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card p-5 rounded-2xl space-y-2 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-semibold">{stat.badge}</span>
                </div>
                <div className={`text-2xl sm:text-3xl font-heading font-extrabold ${stat.color}`}>
                  {stat.count}
                </div>
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW THE PLATFORM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">How ResQ Assam Operates</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A seamless 4-step emergency triage lifecycle bridging citizens and fast rescue units.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: '1. Report SOS', desc: 'Citizen pins GPS location, voice note, & demographic vulnerability count.', color: 'from-red-600 to-red-800' },
            { step: '02', title: '2. AI & ASDMA Verification', desc: 'AI filters duplicate reports and scores severity (1-100) for control room triage.', color: 'from-amber-600 to-amber-800' },
            { step: '03', title: '3. Team Dispatch', desc: 'Nearest NDRF/SDRF motorboat or medical unit accepts and navigates to coordinate.', color: 'from-blue-600 to-blue-800' },
            { step: '04', title: '4. Safe Rescue & Shelter', desc: 'Citizens safely evacuated to designated relief camps with live inventory tracking.', color: 'from-emerald-600 to-emerald-800' }
          ].map(item => (
            <div key={item.step} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                STEP {item.step}
              </span>
              <h3 className="font-heading font-bold text-base text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY DISASTER FEATURE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">AI Duplicate & Severity Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated computer vision and geospatial algorithms prevent duplicate incident clutter and prioritize pregnant women, children, and bedridden elders.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Tent className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Relief Camp Occupancy Grid</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time capacity tracking across all 31+ Assam districts with amenity filters for clean drinking water, food packets, toilets, and pet shelters.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Verified Volunteer Skill Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly deploys registered swimmers, boat operators, doctors, and drone pilots to nearest flooded villages based on real-time GPS telemetry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
