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
      {/* HERO SECTION - Soft Pastel Pink/Sky/Emerald Gradient */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-pink-100/80 bg-gradient-to-br from-pink-50/90 via-sky-50/70 to-emerald-50/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              24x7 STATE DISASTER RESPONSE PLATFORM FOR ASSAM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
              Connecting People. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-emerald-600 to-sky-600">
                Coordinating Rescue.
              </span> <br />
              Saving Lives.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Unified real-time disaster management network connecting citizens in flood-affected districts, NDRF/SDRF rescue teams, volunteers, medical units, and NGOs across Assam.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-pink-500/30 border border-rose-300 flex items-center gap-3 text-sm animate-sos-pulse"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                REPORT EMERGENCY SOS
              </button>

              <button
                onClick={() => { setRole('volunteer'); setActiveTab('volunteer'); }}
                className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold px-6 py-3.5 rounded-2xl border border-emerald-300 shadow-sm flex items-center gap-2 text-sm"
              >
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Join as Volunteer
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className="bg-white hover:bg-purple-50 text-purple-700 font-bold px-5 py-3.5 rounded-2xl border border-purple-300 shadow-sm flex items-center gap-2 text-sm"
              >
                <Heart className="w-5 h-5 text-purple-600 fill-purple-100" />
                Donate Relief
              </button>
            </div>

            {/* Key Assurance Badges */}
            <div className="pt-6 border-t border-pink-200/60 grid grid-cols-3 gap-4 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ASDMA Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Offline SOS Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-600 shrink-0" />
                <span>AI Priority Triage</span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Emergency Visual Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl space-y-5 border border-pink-200 shadow-xl relative overflow-hidden bg-white/90">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-600 animate-pulse" />
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Live Assam Triage Stream</h3>
                </div>
                <span className="text-[11px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold border border-rose-300">
                  REALTIME
                </span>
              </div>

              {/* Sample Live Incidents Preview */}
              <div className="space-y-3">
                {incidents.slice(0, 3).map(inc => (
                  <div key={inc.id} className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {inc.district}
                      </span>
                      <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-1 mb-2 font-medium">{inc.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Status: <strong className="text-emerald-700 uppercase font-bold">{inc.status}</strong></span>
                      <span className="text-pink-600 font-bold">AI Score: {inc.aiVulnerabilityScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold py-2.5 rounded-xl border border-sky-300 text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>View All Incidents on Live Assam Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATS COUNTER GRID - Light Pastel Palette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Active Incidents', count: activeIncidentsCount, color: 'text-rose-600', icon: ShieldAlert, badge: 'High Triage', bg: 'bg-rose-50 border-rose-200' },
            { label: 'People Rescued', count: totalRescuedCount.toLocaleString(), color: 'text-emerald-600', icon: LifeBuoy, badge: 'Statewide', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Active Volunteers', count: activeVolunteersCount, color: 'text-sky-600', icon: Users, badge: 'On Duty', bg: 'bg-sky-50 border-sky-200' },
            { label: 'Relief Camps', count: activeCampsCount, color: 'text-amber-600', icon: Tent, badge: 'Open 24x7', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Avg Response Time', count: '14 Mins', color: 'text-purple-600', icon: Clock, badge: 'NDRF Motorized', bg: 'bg-purple-50 border-purple-200' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`p-5 rounded-2xl space-y-2 border shadow-sm ${stat.bg}`}>
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-600 font-bold border border-slate-200">{stat.badge}</span>
                </div>
                <div className={`text-2xl sm:text-3xl font-heading font-extrabold ${stat.color}`}>
                  {stat.count}
                </div>
                <div className="text-xs text-slate-700 font-semibold">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW THE PLATFORM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">How ResQ Assam Operates</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            A seamless 4-step emergency triage lifecycle bridging citizens and fast rescue units.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: '1. Report SOS', desc: 'Citizen pins GPS location, voice note, & demographic vulnerability count.', color: 'from-rose-500 to-pink-600' },
            { step: '02', title: '2. AI & ASDMA Verification', desc: 'AI filters duplicate reports and scores severity (1-100) for control room triage.', color: 'from-amber-500 to-amber-600' },
            { step: '03', title: '3. Team Dispatch', desc: 'Nearest NDRF/SDRF motorboat or medical unit accepts and navigates to coordinate.', color: 'from-sky-500 to-blue-600' },
            { step: '04', title: '4. Safe Rescue & Shelter', desc: 'Citizens safely evacuated to designated relief camps with live inventory tracking.', color: 'from-emerald-500 to-teal-600' }
          ].map(item => (
            <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-sm`}>
                STEP {item.step}
              </span>
              <h3 className="font-heading font-bold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY DISASTER FEATURE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">AI Duplicate & Severity Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated computer vision and geospatial algorithms prevent duplicate incident clutter and prioritize pregnant women, children, and bedridden elders.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <Tent className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Relief Camp Occupancy Grid</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time capacity tracking across all 31+ Assam districts with amenity filters for clean drinking water, food packets, toilets, and pet shelters.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Verified Volunteer Skill Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly deploys registered swimmers, boat operators, doctors, and drone pilots to nearest flooded villages based on real-time GPS telemetry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
