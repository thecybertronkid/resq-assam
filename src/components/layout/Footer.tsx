import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Phone, HeartHandshake, Layers, ExternalLink, Wifi, CheckCircle2, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsSosModalOpen, setRole } = useApp();

  const handleNav = (action: () => void) => {
    action();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Organized 4-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Column 1: Platform Info */}
          <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-sm">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-base">ResQ Assam</h3>
                  <span className="text-[10px] text-rose-700 font-extrabold uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Assam Relief</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unified disaster rescue, volunteer coordination, and emergency telemetry platform serving the people of Assam.
              </p>
            </div>

            <div className="pt-2">
              <div className="bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-2 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>Disaster Telemetry Engine Online</span>
              </div>
            </div>
          </div>

          {/* Column 2: Emergency Helplines */}
          <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Phone className="w-4 h-4 text-rose-600 shrink-0" />
              <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                24x7 Emergency Helplines
              </h4>
            </div>

            <ul className="space-y-2 text-xs font-semibold">
              <li className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-700 text-[11px]">State Disaster Control Room:</span>
                <a href="tel:1070" className="text-rose-600 font-extrabold hover:underline bg-rose-50 px-2 py-0.5 rounded border border-rose-200">1070 / 1077</a>
              </li>
              <li className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-700 text-[11px]">NDRF 1st Bn Patgaon:</span>
                <a href="tel:03612840284" className="text-sky-700 font-bold hover:underline bg-sky-50 px-2 py-0.5 rounded border border-sky-200">0361-2840284</a>
              </li>
              <li className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-700 text-[11px]">SDRF Jorhat Control:</span>
                <a href="tel:9435010000" className="text-sky-700 font-bold hover:underline bg-sky-50 px-2 py-0.5 rounded border border-sky-200">94350 10000</a>
              </li>
              <li className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-700 text-[11px]">Medical Ambulance:</span>
                <a href="tel:108" className="text-emerald-700 font-bold hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">108</a>
              </li>
              <li className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-700 text-[11px]">National Emergency:</span>
                <a href="tel:112" className="text-emerald-700 font-bold hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">112</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Disaster Modules Links */}
          <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Layers className="w-4 h-4 text-pink-600 shrink-0" />
              <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Disaster Modules
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs">
              {[
                { label: 'Submit Emergency SOS Report', action: () => setIsSosModalOpen(true) },
                { label: 'Live Brahmaputra River Map', action: () => setActiveTab('map') },
                { label: 'Relief Camp Occupancy Tracker', action: () => setActiveTab('camps') },
                { label: 'Missing Persons Registry', action: () => setActiveTab('missing') },
                { label: 'Register as Swimmer / Doctor', action: () => { setRole('volunteer'); setActiveTab('volunteer'); } },
                { label: 'Tax-Exempt Relief Donations (80G)', action: () => setActiveTab('donations') }
              ].map(m => (
                <li key={m.label}>
                  <button
                    onClick={() => handleNav(m.action)}
                    className="w-full text-left p-2 rounded-xl bg-white hover:bg-pink-50 border border-slate-200/80 hover:border-pink-300 text-slate-700 hover:text-pink-700 font-semibold transition-all flex items-center justify-between group shadow-2xs text-[11px]"
                  >
                    <span>{m.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Nodal Agencies & Governance */}
          <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-3xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <HeartHandshake className="w-4 h-4 text-purple-600 shrink-0" />
                <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Nodal Agencies
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Operated in collaboration with Govt of Assam, Revenue & Disaster Management Dept, NDRF 1st Bn, SDRF Assam, Indian Army Eastern Command, and Indian Red Cross Society Assam.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <a
                href="https://www.axomrelief.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 font-bold p-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                Axom Relief Network (axomrelief.com)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span>© 2026 ResQ Assam. All rights reserved.</span>
            <span>•</span>
            <span>© 2026 ResQ Assam. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600">
            <button onClick={() => handleNav(() => setActiveTab('public'))} className="hover:text-pink-600">State Analytics</button>
            <span>•</span>
            <button onClick={() => handleNav(() => setActiveTab('alerts'))} className="hover:text-pink-600">Disaster Alerts</button>
            <span>•</span>
            <button onClick={() => handleNav(() => setActiveTab('roads'))} className="hover:text-pink-600">Road Hazards</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
