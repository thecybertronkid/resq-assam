import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Volunteer, IncidentReport } from '../../types';
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
  ShieldAlert,
  Crosshair,
  Compass,
  Package,
  Sparkles,
  RefreshCw,
  Send,
  Check,
  AlertTriangle,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { volunteers, addVolunteer, verifyVolunteer, updateVolunteerLocation, incidents, updateIncidentStatus, showToast } = useApp();

  const [activePortalTab, setActivePortalTab] = useState<'roster' | 'verified_portal'>('verified_portal');

  // Form State
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

  // GPS Location State in Form
  const [lat, setLat] = useState<number>(26.9826);
  const [lng, setLng] = useState<number>(94.6425);
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  // Selected Volunteer Modal State
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  // Verified Persona State
  const verifiedVolunteers = volunteers.filter(v => v.isVerified);
  const [activeVerifiedVolId, setActiveVerifiedVolId] = useState<string>('');

  useEffect(() => {
    if (verifiedVolunteers.length > 0 && !activeVerifiedVolId) {
      setActiveVerifiedVolId(verifiedVolunteers[0].id);
    }
  }, [verifiedVolunteers]);

  const activeVerifiedVol = volunteers.find(v => v.id === activeVerifiedVolId) || verifiedVolunteers[0] || volunteers[0];

  // GPS updater for responder
  const [responderLat, setResponderLat] = useState<number>(activeVerifiedVol?.lat || 26.9826);
  const [responderLng, setResponderLng] = useState<number>(activeVerifiedVol?.lng || 94.6425);

  useEffect(() => {
    if (activeVerifiedVol) {
      setResponderLat(activeVerifiedVol.lat || 26.9826);
      setResponderLng(activeVerifiedVol.lng || 94.6425);
    }
  }, [activeVerifiedVolId, activeVerifiedVol?.lat, activeVerifiedVol?.lng]);

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

  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocation not supported by browser. Using district default.');
      return;
    }
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLng(Number(pos.coords.longitude.toFixed(4)));
        setIsFetchingGps(false);
        showToast(`📍 Fetched Live GPS: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
      },
      () => {
        setIsFetchingGps(false);
        showToast('⚠️ GPS permission denied. Coordinates set to district center.');
      },
      { timeout: 8000 }
    );
  };

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
      available: isAvailable,
      lat,
      lng
    });
    setName('');
    setPhone('');
    setEmail('');
    setSubDivision('');
    setRevenueCircle('');
    setLocalArea('');
    setServiceableArea('');
  };

  // Local missions for active responder
  const localMissions = incidents.filter(i => 
    i.district === (activeVerifiedVol?.district || 'Sivasagar') && i.status !== 'completed'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 border border-emerald-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            STATE VOLUNTEER CORPS & VERIFIED RESPONDER PORTAL
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Assam Emergency Volunteer Network</h1>
          <p className="text-xs text-slate-600 font-medium">Register live GPS telemetry, accept local emergency missions, and access verified responder tools.</p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur p-1.5 rounded-2xl border border-emerald-300 shadow-xs">
          <button
            onClick={() => setActivePortalTab('verified_portal')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activePortalTab === 'verified_portal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Verified Responder Portal</span>
            {verifiedVolunteers.length > 0 && (
              <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {verifiedVolunteers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActivePortalTab('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activePortalTab === 'roster'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>Volunteer Form & Roster ({volunteers.length})</span>
          </button>
        </div>
      </div>

      {/* VERIFIED RESPONDER PORTAL VIEW */}
      {activePortalTab === 'verified_portal' && (
        <div className="space-y-6">
          {/* Active Verified Responder Identity & Telemetry Bar */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-extrabold text-xl">
                  🦺
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-heading font-extrabold text-white">
                      {activeVerifiedVol?.name || 'Verified Emergency Responder'}
                    </h2>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> VERIFIED RESPONDER BADGE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    ID: <strong className="text-slate-200">{activeVerifiedVol?.id}</strong> • Base District: <strong className="text-emerald-400">{activeVerifiedVol?.district}</strong>
                  </p>
                </div>
              </div>

              {/* Verified Persona Switcher Dropdown */}
              {verifiedVolunteers.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Switch Verified Profile:</span>
                  <select
                    value={activeVerifiedVolId}
                    onChange={e => setActiveVerifiedVolId(e.target.value)}
                    className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {verifiedVolunteers.map(v => (
                      <option key={v.id} value={v.id}>
                        🦺 {v.name} ({v.district})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Serviceable Location & Live GPS Telemetry Broadcaster */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Assigned Serviceable Location:</span>
                <p className="text-sm font-extrabold text-white">
                  {activeVerifiedVol?.serviceableArea || `${activeVerifiedVol?.district} Sector`}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeVerifiedVol?.skills?.map(sk => (
                    <span key={sk} className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                      ✓ {sk.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* GPS Position Broadcaster */}
              <div className="lg:col-span-6 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                    Live Map Rescuer GPS Broadcaster:
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    🟢 Live on Map
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-bold">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={responderLat}
                      onChange={e => setResponderLat(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-bold">Longitude (°E)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={responderLng}
                      onChange={e => setResponderLng(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => updateVolunteerLocation(activeVerifiedVol.id, responderLat, responderLng)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Update Live GPS Marker on Live Incident Map
                </button>
              </div>
            </div>
          </div>

          {/* Local Active Emergency Tasks Board */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                  Active Emergency SOS Tasks ({activeVerifiedVol?.district} Sector)
                </h2>
                <span className="text-xs text-slate-500 font-semibold">{localMissions.length} Pending Evacuations</span>
              </div>

              {localMissions.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-slate-900 text-sm">All Local SOS Tasks Resolved!</h3>
                  <p className="text-xs text-slate-500">No active unassigned emergencies in {activeVerifiedVol?.district} district right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {localMissions.map(mission => (
                    <div key={mission.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-400 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {mission.disasterType.toUpperCase()}
                            </span>
                            <span className={`badge-${mission.severity}`}>{mission.severity.toUpperCase()}</span>
                          </div>
                          <h3 className="font-heading font-bold text-base text-slate-900 mt-1">
                            📍 {mission.village} ({mission.landmark})
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-2 py-1 rounded-xl border border-pink-200 block">
                            AI Score: {mission.aiVulnerabilityScore}/100
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{mission.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                        {mission.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>👥 Adults: <strong>{mission.demographics.adults}</strong></div>
                        <div>👶 Children: <strong>{mission.demographics.children}</strong></div>
                        <div>👵 Elderly: <strong>{mission.demographics.elderly}</strong></div>
                        <div>🤰 Pregnant: <strong>{mission.demographics.pregnant}</strong></div>
                        <div>♿ Disabled: <strong>{mission.demographics.disabled}</strong></div>
                        <div>📞 Contact: <strong>{mission.reporterPhone}</strong></div>
                      </div>

                      {/* Action Buttons for Verified Responder */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => updateIncidentStatus(mission.id, 'rescuing', activeVerifiedVol.id, activeVerifiedVol.name)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          Accept & Deploy to Scene
                        </button>

                        <a
                          href={`tel:${mission.reporterPhone}`}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
                        >
                          <Phone className="w-4 h-4" />
                          Call Victim
                        </a>

                        <button
                          onClick={() => updateIncidentStatus(mission.id, 'completed', activeVerifiedVol.id, activeVerifiedVol.name)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Responder Tactical Tools Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Emergency Radio Escalation Panel */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  Verified Radio Dispatch & Escalation
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Direct encrypted radio line for verified field responders to alert NDRF commanders or request immediate motorized boat squads.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => showToast(`🚨 EMERGENCY RADIO ALERT: Motorized Boat Squad requested at ${activeVerifiedVol?.serviceableArea} by ${activeVerifiedVol?.name}!`)}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Request Emergency Motorboat Reinforcement
                  </button>

                  <button
                    onClick={() => showToast(`📦 RELIEF SUPPLY REQUISITION: 200 Medical Trauma Kits dispatched to ${activeVerifiedVol?.district}!`)}
                    className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4 text-purple-600" />
                    Requisition Emergency Field Trauma Kits
                  </button>
                </div>
              </div>

              {/* Field Triage Summary Counter */}
              <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-5 rounded-3xl space-y-3 shadow-lg">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Field Mission Counter</span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-heading font-extrabold text-white">{activeVerifiedVol?.tasksAssigned || 0}</span>
                    <span className="text-xs text-slate-300 block font-medium">Missions Completed</span>
                  </div>
                  <Award className="w-10 h-10 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-medium">
                  Official badge verified for direct auto-assignment of critical dispatches in {activeVerifiedVol?.district}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION FORM & ROSTER TAB */}
      {activePortalTab === 'roster' && (
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

                {/* GPS Coordinates Section */}
                <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Crosshair className="w-4 h-4 text-sky-600" />
                      Active GPS Coordinates (Plotted on Live Rescuer Map)
                    </span>
                    <button
                      type="button"
                      onClick={handleFetchGps}
                      disabled={isFetchingGps}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isFetchingGps ? 'animate-spin' : ''}`} />
                      {isFetchingGps ? 'Fetching...' : 'Fetch Live GPS'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">Latitude (°N)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={lat}
                        onChange={e => setLat(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">Longitude (°E)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={lng}
                        onChange={e => setLng(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
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
      )}

      {/* Active Volunteer Details Modal */}
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

                {selectedVolunteer.lat && selectedVolunteer.lng && (
                  <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-200 text-sky-900 font-bold flex items-center justify-between">
                    <span>📍 Map GPS: {selectedVolunteer.lat}° N, {selectedVolunteer.lng}° E</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedVolunteer.lat},${selectedVolunteer.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-sky-700 bg-white px-2 py-1 rounded border border-sky-300 hover:underline flex items-center gap-1"
                    >
                      Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

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
