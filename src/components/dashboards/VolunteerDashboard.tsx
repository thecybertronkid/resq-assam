import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { 
  UserCheck, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  Activity, 
  Plus, 
  Radio
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { volunteers, registerVolunteer, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['swimmer', 'doctor']);
  const [isAvailable, setIsAvailable] = useState(true);

  const skillsList = [
    { id: 'swimmer', label: '🏊 Expert Swimmer & Deep Water Rescue' },
    { id: 'doctor', label: '🩺 Medical Doctor / Trauma Specialist' },
    { id: 'nurse', label: '💉 Certified Nurse / Paramedic' },
    { id: 'boat_operator', label: '🚤 Motorboat / Raft Operator' },
    { id: 'driver', label: 'Truck / Ambulance Driver' },
    { id: 'drone_pilot', label: '🚁 Aerial Recon Drone Pilot' },
    { id: 'animal_rescue', label: '🐾 Livestock & Wildlife Specialist' },
    { id: 'logistics', label: '📦 Food & Supply Logistics Manager' }
  ];

  const toggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    registerVolunteer({
      name,
      phone,
      email,
      district,
      skills: selectedSkills as any,
      available: isAvailable
    });
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner - Pastel Green Gradient */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 border border-emerald-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            STATE VOLUNTEER CORPS & SKILL MATCHING PORTAL
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Join Assam Emergency Volunteer Force</h1>
          <p className="text-xs text-slate-600 font-medium">Register skills, broadcast live GPS location, and accept local flood relief tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Volunteer Registration Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Register as Certified Emergency Volunteer
            </h2>

            <form onSubmit={handleRegister} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rupam Saikia"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 XXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">District *</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  >
                    {ASSAM_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-bold">Select Specialized Skills:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skillsList.map(sk => (
                    <div
                      key={sk.id}
                      onClick={() => toggleSkill(sk.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer font-semibold transition-all ${
                        selectedSkills.includes(sk.id)
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {sk.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Availability Status</span>
                  <span className="text-[11px] text-slate-500 font-medium">Broadcast readiness for emergency tasks</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                    isAvailable ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isAvailable ? '🟢 ON-DUTY READY' : '⚪ OFF-DUTY'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                Submit Verification & Join Corps
              </button>
            </form>
          </div>
        </div>

        {/* Active Volunteers Roster */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Active Volunteers ({volunteers.length})</span>
            <span className="text-xs text-emerald-700 font-bold">ASDMA Verified</span>
          </h2>

          <div className="space-y-3">
            {volunteers.map(v => (
              <div key={v.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-extrabold text-emerald-700 text-sm">
                      {v.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        {v.name}
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{v.district} • Ph: {v.phone}</p>
                    </div>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                    Tasks Done: {v.tasksAssigned}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {v.skills.map(sk => (
                    <span key={sk} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 uppercase font-bold">
                      {sk.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
