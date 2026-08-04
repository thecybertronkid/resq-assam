import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Tent, MapPin, Phone, Users, Check, X, Search, Plus } from 'lucide-react';

export const ReliefCampsModule: React.FC = () => {
  const { camps, addCamp, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [name, setName] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [capacity, setCapacity] = useState(1000);
  const [contactPhone, setContactPhone] = useState('+91 361 200000');
  const [inCharge, setInCharge] = useState('Circle Officer');

  const filteredCamps = camps.filter(c => {
    if (districtFilter !== 'all' && c.district !== districtFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddCamp = (e: React.FormEvent) => {
    e.preventDefault();
    addCamp({
      id: `CAMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      district,
      lat: 26.1445 + Math.random() * 0.4,
      lng: 91.7362 + Math.random() * 0.4,
      capacity,
      currentOccupancy: 0,
      contactPhone,
      inCharge,
      amenities: {
        foodWater: true,
        medicalBay: true,
        womenChildSafe: true,
        petFriendly: true,
        powerBackup: true
      }
    });
    setIsAddOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 border border-emerald-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider flex items-center gap-1.5">
            <Tent className="w-4 h-4 text-emerald-600" />
            STATEWIDE RELIEF CAMP & SHELTER DIRECTORY
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Verified Government & Community Relief Camps</h1>
          <p className="text-xs text-slate-600 font-medium">Live capacity monitoring, water/food availability, and pet-friendly facility indicators.</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Register New Relief Camp
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search camp by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium"
          />
        </div>

        <select
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
        >
          <option value="all">All Assam Districts</option>
          {ASSAM_DISTRICTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Camp Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCamps.map(camp => {
          const occPct = Math.round((camp.currentOccupancy / camp.capacity) * 100);
          return (
            <div key={camp.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 hover:border-pink-300 hover:shadow-md transition-all shadow-sm">
              <div>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                  {camp.district}
                </span>
                <h3 className="font-heading font-extrabold text-base text-slate-900 mt-1">{camp.name}</h3>
                <p className="text-xs text-slate-500 font-medium">In-Charge: {camp.inCharge} • Ph: {camp.contactPhone}</p>
              </div>

              {/* Occupancy Progress */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-700">Camp Occupancy</span>
                  <span className={occPct > 85 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {camp.currentOccupancy} / {camp.capacity} ({occPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${occPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
              </div>

              {/* Facility Badges Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800">✓ Food & Water</div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800">✓ Medical Bay</div>
                <div className="bg-pink-50 p-2 rounded-xl border border-pink-200 text-pink-800">✓ Women & Child Safe</div>
                <div className="bg-purple-50 p-2 rounded-xl border border-purple-200 text-purple-800">
                  {camp.amenities?.petFriendly ? '✓ Pet Shelter' : '✕ No Pets'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Camp Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-pink-200 w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl">
            <h3 className="font-bold text-base">Register New Emergency Relief Shelter</h3>
            <form onSubmit={handleAddCamp} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Camp / Building Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sivasagar Town High School Shelter"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">District</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                >
                  {ASSAM_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Max Capacity (Persons)</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={e => setCapacity(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl font-bold shadow-sm"
                >
                  Register Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
