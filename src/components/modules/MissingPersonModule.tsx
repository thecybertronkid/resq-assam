import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { UserSearch, Search, Plus, MapPin, Phone, CheckCircle } from 'lucide-react';

export const MissingPersonModule: React.FC = () => {
  const { missingPersons, reportMissingPerson, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [details, setDetails] = useState('');

  const filteredPersons = missingPersons.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.fullName.toLowerCase().includes(search.toLowerCase()) && !p.lastSeenLocation.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMissingPerson({
      fullName,
      age,
      gender,
      lastSeenLocation,
      district,
      reporterName,
      reporterPhone,
      details,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider flex items-center gap-1.5">
            <UserSearch className="w-4 h-4 text-blue-400" />
            DISASTER MISSING PERSONS RECOVERY BULLETIN
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Missing Persons Registry & Search</h1>
          <p className="text-xs text-slate-400">Public registry to locate family members separated during flood evacuations.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Report Missing Person
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          {['all', 'missing', 'found_safe', 'hospitalized', 'deceased'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg uppercase ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPersons.map(person => (
          <div key={person.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden space-y-3 p-4">
            <img src={person.photoUrl} alt={person.fullName} className="w-full h-48 object-cover rounded-2xl" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white text-base">{person.fullName}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  person.status === 'missing' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {person.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">{person.gender}, {person.age} years old • {person.district}</p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
              <p className="line-clamp-2">{person.details}</p>
              <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
                <span>Last seen: {person.lastSeenLocation}</span>
              </div>
            </div>

            <a
              href={`tel:${person.reporterPhone}`}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Contact Reporter ({person.reporterName})
            </a>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 text-xs text-white">
            <h3 className="font-bold text-base">File Missing Person Report</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name of Missing Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jibon Kalita"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">District</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {ASSAM_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Last Seen Location & Clothes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sukreswar Temple Ghat wearing white kurta"
                  value={lastSeenLocation}
                  onChange={e => setLastSeenLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Your Name (Reporter)</label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={e => setReporterName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Your Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={e => setReporterPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-xl font-bold"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
