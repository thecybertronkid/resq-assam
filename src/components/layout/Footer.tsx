import React from 'react';
import { ShieldAlert, Phone, ExternalLink, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-lg text-white">ResQ Assam</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Statewide unified disaster rescue, volunteer coordination, and emergency response infrastructure for Assam State Disaster Management Authority (ASDMA).
          </p>
          <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-lg inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ASDMA Data Sync Engine Online
          </div>
        </div>

        {/* Emergency Hotlines */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-red-500" />
            24x7 Emergency Helplines
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between border-b border-slate-900 pb-1">
              <span>State Disaster Control (ASDMA):</span>
              <a href="tel:1070" className="text-red-400 font-bold hover:underline">1070 / 1077</a>
            </li>
            <li className="flex justify-between border-b border-slate-900 pb-1">
              <span>NDRF 1st Bn Patgaon:</span>
              <a href="tel:03612840284" className="text-blue-400 font-bold hover:underline">0361-2840284</a>
            </li>
            <li className="flex justify-between border-b border-slate-900 pb-1">
              <span>SDRF Guwahati Control:</span>
              <a href="tel:9435010000" className="text-blue-400 font-bold hover:underline">94350 10000</a>
            </li>
            <li className="flex justify-between border-b border-slate-900 pb-1">
              <span>National Emergency Number:</span>
              <a href="tel:112" className="text-emerald-400 font-bold hover:underline">112</a>
            </li>
            <li className="flex justify-between">
              <span>Medical Ambulance Service:</span>
              <a href="tel:108" className="text-emerald-400 font-bold hover:underline">108</a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Disaster Modules</h4>
          <ul className="space-y-1.5 text-xs">
            <li><a href="#sos" className="hover:text-white transition-colors">Submit Emergency SOS Report</a></li>
            <li><a href="#map" className="hover:text-white transition-colors">Live Brahmaputra Water Levels & Map</a></li>
            <li><a href="#camps" className="hover:text-white transition-colors">Relief Camp Occupancy Tracker</a></li>
            <li><a href="#missing" className="hover:text-white transition-colors">Missing Persons Database & Search</a></li>
            <li><a href="#volunteer" className="hover:text-white transition-colors">Register as Swimmer / Medical Volunteer</a></li>
            <li><a href="#donate" className="hover:text-white transition-colors">Tax-Exempt Relief Fund Donations</a></li>
          </ul>
        </div>

        {/* ASDMA & Government Partners */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
            Nodal Agencies
          </h4>
          <p className="text-xs text-slate-400">
            Operated in collaboration with Govt of Assam, Revenue & Disaster Management Dept, NDRF, SDRF, Indian Army Eastern Command, and Indian Red Cross Society Assam.
          </p>
          <div className="pt-2 text-[11px] text-slate-500">
            © 2026 ResQ Assam. Designed for emergency preparedness and fast rescue.
          </div>
        </div>
      </div>
    </footer>
  );
};
