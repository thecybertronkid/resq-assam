import React from 'react';
import { Hospital, Phone, Ambulance, HeartPulse, Pill, CheckCircle } from 'lucide-react';

export const MedicalModule: React.FC = () => {
  const hospitals = [
    {
      name: 'Gauhati Medical College & Hospital (GMCH)',
      district: 'Kamrup Metropolitan',
      phone: '0361 2529457',
      icuBeds: 45,
      bloodStock: 'A+, O+, B+, AB+ Available',
      ambulanceUnit: '108 Boat Ambulance 4 Units Active'
    },
    {
      name: 'Assam Medical College & Hospital (AMCH)',
      district: 'Dibrugarh',
      phone: '0373 2300080',
      icuBeds: 28,
      bloodStock: 'O-, A+, B+ Stocked',
      ambulanceUnit: 'Water Trauma Unit 2'
    },
    {
      name: 'Silchar Medical College & Hospital (SMCH)',
      district: 'Cachar',
      phone: '03842 240294',
      icuBeds: 20,
      bloodStock: 'Emergency Blood Bank 24x7',
      ambulanceUnit: 'Flood Disaster Ambulance Flight 1'
    },
    {
      name: 'Jorhat Medical College & Hospital (JMCH)',
      district: 'Jorhat',
      phone: '0376 2370012',
      icuBeds: 18,
      bloodStock: 'Platelets & Plasma Ready',
      ambulanceUnit: '108 Road Unit'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-red-400 tracking-wider flex items-center gap-1.5">
            <Hospital className="w-4 h-4 text-red-400" />
            24x7 DISASTER MEDICAL CELL & BLOOD BANK DIRECTORY
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Emergency Hospitals, ICUs & Water Ambulances</h1>
          <p className="text-xs text-slate-400">Live availability of trauma care beds, snake venom anti-serum, and flood medical boats.</p>
        </div>

        <a
          href="tel:108"
          className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/40 text-xs flex items-center gap-2 animate-pulse"
        >
          <Ambulance className="w-4 h-4" />
          Call 108 Medical Dispatch
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map(h => (
          <div key={h.name} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-red-400 font-extrabold uppercase bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  {h.district}
                </span>
                <h3 className="font-heading font-bold text-base text-white mt-1">{h.name}</h3>
              </div>
              <a
                href={`tel:${h.phone}`}
                className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Available ICU Beds</span>
                <strong className="text-emerald-400 text-sm font-bold">{h.icuBeds} Beds</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Blood Bank</span>
                <strong className="text-blue-400 text-xs font-semibold">{h.bloodStock}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Ambulance Unit</span>
                <strong className="text-purple-400 text-xs font-semibold">{h.ambulanceUnit}</strong>
              </div>
            </div>

            <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Anti-Snake Venom & Water-borne Disease Kits Stocked</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
