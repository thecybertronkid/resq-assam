import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital as HospitalIcon, Phone, Ambulance, HeartPulse, Pill, CheckCircle, Plus } from 'lucide-react';

export const MedicalModule: React.FC = () => {
  const { showToast } = useApp();

  const [hospitals, setHospitals] = useState([
    {
      id: 'HOSP-1',
      name: 'Gauhati Medical College & Hospital (GMCH)',
      district: 'Kamrup Metropolitan',
      phone: '0361 2529457',
      icuBeds: 45,
      bloodStock: 'A+, O+, B+, AB+ Available',
      ambulanceUnit: '108 Boat Ambulance 4 Units Active'
    },
    {
      id: 'HOSP-2',
      name: 'Assam Medical College & Hospital (AMCH)',
      district: 'Dibrugarh',
      phone: '0373 2300080',
      icuBeds: 28,
      bloodStock: 'O-, A+, B+ Stocked',
      ambulanceUnit: 'Water Trauma Unit 2'
    },
    {
      id: 'HOSP-3',
      name: 'Silchar Medical College & Hospital (SMCH)',
      district: 'Cachar',
      phone: '03842 240294',
      icuBeds: 20,
      bloodStock: 'Emergency Blood Bank 24x7',
      ambulanceUnit: 'Flood Disaster Ambulance Flight 1'
    },
    {
      id: 'HOSP-4',
      name: 'Jorhat Medical College & Hospital (JMCH)',
      district: 'Jorhat',
      phone: '0376 2370012',
      icuBeds: 18,
      bloodStock: 'Platelets & Plasma Ready',
      ambulanceUnit: '108 Road Unit'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Kamrup Metropolitan');
  const [phone, setPhone] = useState('+91 361 200000');
  const [icuBeds, setIcuBeds] = useState(15);
  const [bloodStock, setBloodStock] = useState('O+, A+ Stocked');
  const [ambulanceUnit, setAmbulanceUnit] = useState('108 Water Ambulance Unit');

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newHosp = {
      id: `HOSP-${Date.now()}`,
      name,
      district,
      phone,
      icuBeds,
      bloodStock,
      ambulanceUnit
    };
    setHospitals([newHosp, ...hospitals]);
    setIsModalOpen(false);
    showToast(`🏥 Registered hospital ${name} with ${icuBeds} ICU beds into State Medical Directory!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-emerald-100 border border-rose-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider flex items-center gap-1.5">
            <HospitalIcon className="w-4 h-4 text-rose-600" />
            24x7 DISASTER MEDICAL CELL & BLOOD BANK DIRECTORY
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Emergency Hospitals, ICUs & Water Ambulances</h1>
          <p className="text-xs text-slate-600 font-medium">Live availability of trauma care beds, snake venom anti-serum, and flood medical boats.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-rose-50 text-rose-700 font-extrabold px-4 py-2.5 rounded-xl border border-rose-200 text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Register Hospital
          </button>
          <a
            href="tel:108"
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-rose-500/20 text-xs flex items-center gap-2 animate-pulse"
          >
            <Ambulance className="w-4 h-4" />
            Call 108 Dispatch
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map(h => (
          <div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-pink-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-rose-800 font-extrabold uppercase bg-rose-100 px-2.5 py-0.5 rounded border border-rose-200">
                  {h.district}
                </span>
                <h3 className="font-heading font-bold text-base text-slate-900 mt-1">{h.name}</h3>
              </div>
              <a
                href={`tel:${h.phone}`}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-semibold">
                <span className="text-[10px] text-slate-500 block">Available ICU Beds</span>
                <strong className="text-emerald-700 text-sm font-bold">{h.icuBeds} Beds</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-semibold">
                <span className="text-[10px] text-slate-500 block">Blood Bank</span>
                <strong className="text-sky-700 text-xs">{h.bloodStock}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-semibold">
                <span className="text-[10px] text-slate-500 block">Ambulance Unit</span>
                <strong className="text-purple-700 text-xs">{h.ambulanceUnit}</strong>
              </div>
            </div>

            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Anti-Snake Venom & Water-borne Disease Kits Stocked</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Add Hospital */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl">
            <h3 className="font-bold text-base">Register Emergency Hospital / Medical Facility</h3>
            <form onSubmit={handleAddHospital} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tezpur District Civil Hospital"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">ICU Beds Available</label>
                  <input
                    type="number"
                    value={icuBeds}
                    onChange={e => setIcuBeds(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Helpline Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl font-bold shadow-sm"
                >
                  Register Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
