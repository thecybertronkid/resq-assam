import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { UserSearch, Search, Plus, MapPin, Phone, CheckCircle, Upload, Camera } from 'lucide-react';

export const MissingPersonModule: React.FC = () => {
  const { missingPersons, addMissingPerson, showToast } = useApp();

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
  
  // Real Photo Upload State
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPersons = missingPersons.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.fullName.toLowerCase().includes(search.toLowerCase()) && !p.lastSeenLocation.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setPhotoPreviewUrl(evt.target.result as string);
        showToast(`📸 Attached photo for "${file.name}"!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMissingPerson({
      fullName,
      age,
      gender,
      lastSeenLocation,
      district,
      dateMissing: new Date().toLocaleDateString(),
      photoUrl: photoPreviewUrl,
      status: 'missing',
      reporterName,
      reporterPhone,
      details
    });
    setIsModalOpen(false);
    setFullName('');
    setLastSeenLocation('');
    setDetails('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-pink-50 to-emerald-100 border border-sky-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-sky-800 tracking-wider flex items-center gap-1.5">
            <UserSearch className="w-4 h-4 text-sky-600" />
            DISASTER MISSING PERSONS RECOVERY BULLETIN
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Missing Persons Registry & Search</h1>
          <p className="text-xs text-slate-600 font-medium">Public registry to locate family members separated during flood evacuations.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Report Missing Person
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto">
          {['all', 'missing', 'found_safe', 'hospitalized', 'deceased'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg uppercase whitespace-nowrap ${
                statusFilter === st ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
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
          <div key={person.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden space-y-3 p-4 shadow-sm hover:border-pink-300 transition-all">
            <img src={person.photoUrl} alt={person.fullName} className="w-full h-48 object-cover rounded-2xl border border-slate-100" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-slate-900 text-base">{person.fullName}</h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  person.status === 'missing' ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {person.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{person.gender}, {person.age} years old • {person.district}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700 font-medium">
              <p className="line-clamp-2">{person.details}</p>
              <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200 flex items-center justify-between font-semibold">
                <span>Last seen: {person.lastSeenLocation}</span>
              </div>
            </div>

            <a
              href={`tel:${person.reporterPhone}`}
              className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-sky-200"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              Contact Reporter ({person.reporterName})
            </a>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
          <div className="bg-white border border-pink-200 w-full max-w-lg rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl my-6">
            <h3 className="font-bold text-base">File Missing Person Report</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* FIX 5: Photo Upload Input & Preview */}
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Upload Photo of Missing Person *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <img src={photoPreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-2xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs"
                  >
                    <Upload className="w-4 h-4" /> Upload Photo from Device
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Full Name of Missing Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jibon Kalita"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-slate-700 mb-1 font-bold">Last Seen Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Rohmoria Embankment"
                    value={lastSeenLocation}
                    onChange={e => setLastSeenLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Reporter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={reporterName}
                    onChange={e => setReporterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={reporterPhone}
                    onChange={e => setReporterPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Identification Details & Clothing</label>
                <textarea
                  rows={3}
                  placeholder="Height, birthmarks, last worn clothes, medical conditions..."
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-bold shadow-sm"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
