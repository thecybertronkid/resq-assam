import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Volunteer } from '../../types';
import { 
  UserCheck, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  Activity, 
  Plus, 
  Radio,
  Clock,
  X,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { volunteers, addVolunteer, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [subDivision, setSubDivision] = useState('');
  const [revenueCircle, setRevenueCircle] = useState('');
  const [localArea, setLocalArea] = useState('');
  const [serviceableArea, setServiceableArea] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['swimmer', 'doctor']);
  const [isAvailable, setIsAvailable] = useState(true);

  // Selected Volunteer Modal State
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const skillsList = [
    { id: 'swimmer', label: '🏊 Swimmer & Water Rescue' },
    { id: 'doctor', label: '🩺 Medical Doctor / Trauma' },
    { id: 'nurse', label: '💉 Certified Nurse / Paramedic' },
    { id: 'boat_operator', label: '🚤 Motorboat / Raft Operator' },
    { id: 'driver', label: '🚚 Truck / Ambulance Driver' },
    { id: 'drone_pilot', label: '🚁 Recon Drone Pilot' },
    { id: 'animal_rescue', label: '🐾 Livestock Specialist' },
    { id: 'logistics', label: '📦 Food & Supply Logistics' }
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

    const areaParts = [];
    if (subDivision.trim()) areaParts.push(`Sub-Div: ${subDivision.trim()}`);
    if (revenueCircle.trim()) areaParts.push(`Circle: ${revenueCircle.trim()}`);
    if (localArea.trim()) areaParts.push(`Village/Ward: ${localArea.trim()}`);

    const compiledServiceableArea = areaParts.length > 0 
      ? areaParts.join(' • ') 
      : (serviceableArea || `${district} Central Sector`);

    addVolunteer({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@resq.org`,
      district,
      serviceableArea: compiledServiceableArea,
      skills: selectedSkills as any,
      available: isAvailable
    });
    setName('');
    setPhone('');
    setEmail('');
    setSubDivision('');
    setRevenueCircle('');
    setLocalArea('');
    setServiceableArea('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 border border-emerald-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            STATE VOLUNTEER CORPS & SKILL MATCHING PORTAL
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Join Assam Emergency Volunteer Force</h1>
          <p className="text-xs text-slate-600 font-medium">Register skills, broadcast serviceable area telemetry, and accept local disaster tasks.</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rupam Saikia"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 XXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>
              {/* Detailed Serviceable Operational Area Breakdown */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Serviceable Area Telemetry Breakdown</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Base District *</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    >
                      {ASSAM_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Sub-Division / Tehsil *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sivasagar Sadar, Nazira, Titabor"
                      value={subDivision}
                      onChange={e => setSubDivision(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Revenue Circle / Dev Block *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amguri Circle, Sonari, Teok"
                      value={revenueCircle}
                      onChange={e => setRevenueCircle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Village / Panchayat / Ward *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Disangmukh GP, Ward No. 4, Namti"
                      value={localArea}
                      onChange={e => setLocalArea(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-bold">Select Specialized Rescue Skills:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skillsList.map(sk => (
                    <div
                      key={sk.id}
                      onClick={() => toggleSkill(sk.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer font-semibold transition-all text-[11px] ${
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
                  <span className="font-bold text-slate-900 block">On-Duty Readiness</span>
                  <span className="text-[11px] text-slate-500 font-medium">Broadcast live telemetry for critical dispatch auto-assignment</span>
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
                <Radio className="w-4 h-4" />
                <span>Submit Volunteer Application (Pending Admin Verification)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Active Volunteers Roster */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-slate-900">
              Active Volunteer Roster ({volunteers.length})
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Click card to view details</span>
          </div>

          {volunteers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-2">
              <p className="text-slate-600 font-bold text-xs">No registered volunteers yet.</p>
              <p className="text-[11px] text-slate-400 font-medium">Register above to join the Assam Emergency Volunteer Force!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {volunteers.map(vol => (
                <div
                  key={vol.id}
                  onClick={() => setSelectedVolunteer(vol)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{vol.name}</h3>
                        {vol.isVerified ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Responder
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700" /> Pending Admin Approval
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        📍 {vol.district} {vol.serviceableArea && `• Service Area: ${vol.serviceableArea}`}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${vol.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                      {vol.available ? '🟢 On-Duty' : 'Off-Duty'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {vol.skills.map(sk => (
                      <span key={sk} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                        {sk.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FIX 2: Active Volunteer Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
          <div className="bg-white border border-emerald-200 w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl relative my-6">
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 bg-slate-100 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">
                {selectedVolunteer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">{selectedVolunteer.name}</h3>
                <span className="text-slate-500 text-xs font-semibold">ID: {selectedVolunteer.id}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">District</span>
                  <strong className="text-slate-900">{selectedVolunteer.district}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Tasks Assigned</span>
                  <strong className="text-emerald-700 text-sm">{selectedVolunteer.tasksAssigned} Missions</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Serviceable Location Area:</span>
                <p className="text-slate-900 font-bold">{selectedVolunteer.serviceableArea || `${selectedVolunteer.district} Central Sector`}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Contact Information:</span>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <a href={`tel:${selectedVolunteer.phone}`} className="hover:underline">{selectedVolunteer.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Mail className="w-3.5 h-3.5 text-pink-600" />
                  <span>{selectedVolunteer.email}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">Certified Rescue Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVolunteer.skills.map(sk => (
                    <span key={sk} className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                      ✓ {sk.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {selectedVolunteer.isVerified ? (
                  <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-emerald-900 font-bold text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Credential Verified</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-amber-900 font-bold text-center flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Pending Admin Verification</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
