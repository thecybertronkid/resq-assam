import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Phone, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsSosModalOpen, setRole } = useApp();

  const handleNav = (action: () => void) => {
    action();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-lg text-slate-900">ResQ Assam</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Statewide unified disaster rescue, volunteer coordination, and emergency response infrastructure for Assam State Disaster Management Authority (ASDMA).
          </p>
          <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg inline-flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ASDMA Data Sync Engine Online
          </div>
        </div>

        {/* Emergency Hotlines */}
        <div className="space-y-3">
          <h4 className="text-slate-900 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-rose-500" />
            24x7 Emergency Helplines
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>State Disaster Control (ASDMA):</span>
              <a href="tel:1070" className="text-rose-600 font-bold hover:underline">1070 / 1077</a>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>NDRF 1st Bn Patgaon:</span>
              <a href="tel:03612840284" className="text-sky-600 font-bold hover:underline">0361-2840284</a>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>SDRF Guwahati Control:</span>
              <a href="tel:9435010000" className="text-sky-600 font-bold hover:underline">94350 10000</a>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span>National Emergency Number:</span>
              <a href="tel:112" className="text-emerald-600 font-bold hover:underline">112</a>
            </li>
            <li className="flex justify-between">
              <span>Medical Ambulance Service:</span>
              <a href="tel:108" className="text-emerald-600 font-bold hover:underline">108</a>
            </li>
          </ul>
        </div>

        {/* Interactive Disaster Modules Links */}
        <div className="space-y-3">
          <h4 className="text-slate-900 text-xs font-extrabold uppercase tracking-wider">Disaster Modules</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>
              <button
                onClick={() => handleNav(() => setIsSosModalOpen(true))}
                className="hover:text-pink-600 font-semibold transition-colors text-left flex items-center gap-1.5"
              >
                <span className="text-pink-500 font-bold">›</span> Submit Emergency SOS Report
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav(() => setActiveTab('map'))}
                className="hover:text-pink-600 font-semibold transition-colors text-left flex items-center gap-1.5"
              >
                <span className="text-pink-500 font-bold">›</span> Live Brahmaputra Water Levels & Map
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav(() => setActiveTab('camps'))}
                className="hover:text-pink-600 font-semibold transition-colors text-left flex items-center gap-1.5"
              >
                <span className="text-pink-500 font-bold">›</span> Relief Camp Occupancy Tracker
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav(() => setActiveTab('missing'))}
                className="hover:text-pink-600 font-semibold transition-colors text-left flex items-center gap-1.5"
              >
                <span className="text-pink-500 font-bold">›</span> Missing Persons Database & Search
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav(() => { setRole('volunteer'); setActiveTab('volunteer'); })}
                className="hover:text-pink-600 font-semibold transition-colors text-left flex items-center gap-1.5"
              >
                <span className="text-pink-500 font-bold">›</span> Register as Swimmer / Medical Volunteer
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav(() => setActiveTab('donations'))}
                className="hover:text-pink-600 font-semibold transition-colors text-left flex items-center gap-1.5"
              >
                <span className="text-pink-500 font-bold">›</span> Tax-Exempt Relief Fund Donations
              </button>
            </li>
          </ul>
        </div>

        {/* ASDMA & Government Partners */}
        <div className="space-y-3">
          <h4 className="text-slate-900 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-500" />
            Nodal Agencies
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Operated in collaboration with Govt of Assam, Revenue & Disaster Management Dept, NDRF, SDRF, Indian Army Eastern Command, and Indian Red Cross Society Assam.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-medium">
            © 2026 ResQ Assam. Designed for emergency preparedness and fast rescue.
          </div>
        </div>
      </div>
    </footer>
  );
};
