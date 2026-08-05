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
  ExternalLink,
  Lock,
  Key
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const {
    volunteers,
    addVolunteer,
    verifyVolunteer,
    updateVolunteerLocation,
    incidents,
    updateIncidentStatus,
    authenticatedRole,
    authenticatedVolunteerId,
    setIsAuthModalOpen,
    showToast
  } = useApp();

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

  const [isDetectingResponderGps, setIsDetectingResponderGps] = useState(false);

  const handleDetectResponderGps = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocation not supported by browser. Enter coordinates manually.');
      return;
    }
    setIsDetectingResponderGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(4));
        const newLng = Number(pos.coords.longitude.toFixed(4));
        setResponderLat(newLat);
        setResponderLng(newLng);
        setIsDetectingResponderGps(false);
        if (activeVerifiedVol) {
          updateVolunteerLocation(activeVerifiedVol.id, newLat, newLng);
        }
        showToast(`📍 Auto-detected Live GPS: (${newLat}, ${newLng})! Plotted on Live Map.`);
      },
      () => {
        setIsDetectingResponderGps(false);
        showToast('⚠️ GPS permission denied or timed out. Enter coordinates manually.');
      },
      { timeout: 8000 }
    );
  };

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

  // Auto-generate Volunteer ID: VOL-(FIRST 4 LETTERS OF DIST)-(SEQ STARTING 0001)
  const distPrefix = (district.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'SIVA').toUpperCase();
  const districtVolunteersCount = volunteers.filter(v => v.district.toLowerCase() === district.toLowerCase() || (v.id && v.id.includes(distPrefix))).length;
  const autoGenVolunteerId = `VOL-${distPrefix}-${String(districtVolunteersCount + 1).padStart(4, '0')}`;

  const [regPassword, setRegPassword] = useState('');

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

    const chosenPassword = regPassword || 'vol123';

    addVolunteer({
      id: autoGenVolunteerId,
      userId: autoGenVolunteerId,
      password: chosenPassword,
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

    showToast(`🎉 Volunteer Registered! Your Auto-Assigned User ID: "${autoGenVolunteerId}" | Password: "${chosenPassword}"`);
    setName('');
    setPhone('');
    setEmail('');
    setRegPassword('');
    setSubDivision('');
    setRevenueCircle('');
    setLocalArea('');
    setServiceableArea('');
  };

  // Check if current user has permission to access the Verified Responder Portal
  const canAccessVerifiedPortal =
    authenticatedRole === 'admin' ||
    authenticatedRole === 'rescue' ||
    authenticatedRole === 'ngo' ||
    (authenticatedRole === 'volunteer' && authenticatedVolunteerId);

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
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${activePortalTab === 'verified_portal'
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
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${activePortalTab === 'roster'
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
        canAccessVerifiedPortal ? (
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
                        onChange={e => setResponderLat(parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-bold">Longitude (°E)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={responderLng}
                        onChange={e => setResponderLng(parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDetectResponderGps}
                      disabled={isDetectingResponderGps}
                      className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isDetectingResponderGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingResponderGps ? 'Detecting...' : 'Detect My Live GPS'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (activeVerifiedVol) {
                          updateVolunteerLocation(activeVerifiedVol.id, responderLat, responderLng);
                        }
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Broadcast Live GPS</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Task Queue & Mission Dispatch Board */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Mission Task Queue Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500" />
                    Active Emergency Missions in {activeVerifiedVol?.district} ({localMissions.length})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Auto-Triage Priority Filter</span>
                </div>

                {localMissions.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">No Pending Rescue Missions</h4>
                    <p className="text-xs text-slate-500 font-medium">All reported emergency SOS dispatches in {activeVerifiedVol?.district} are currently resolved or assigned.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {localMissions.map(mission => (
                      <div key={mission.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded border border-rose-300 uppercase tracking-wider">
                              SOS ID: {mission.id} • {mission.disasterType}
                            </span>
                            <h4 className="font-heading font-extrabold text-sm text-slate-900 mt-1">
                              {mission.village}, {mission.district}
                            </h4>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">{mission.description}</p>
                          </div>
                          <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                            AI Score: {mission.aiVulnerabilityScore}
                          </span>
                        </div>

                        {/* Needs Chips */}
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(mission.needs).filter(([_, val]) => val).map(([key]) => (
                            <span key={key} className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                              Need: {key}
                            </span>
                          ))}
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                          <span className="text-slate-500">Status: <strong className="text-slate-800 uppercase">{mission.status.replace('_', ' ')}</strong></span>

                          {(mission.status === 'submitted' || mission.status === 'verified') && (
                            <button
                              onClick={() => updateIncidentStatus(mission.id, 'accepted', activeVerifiedVol?.id, activeVerifiedVol?.name)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-4 h-4" /> Accept Rescue Mission
                            </button>
                          )}

                          {(mission.status === 'accepted' || mission.status === 'en_route' || mission.status === 'rescuing') && (
                            <button
                              onClick={() => updateIncidentStatus(mission.id, 'completed', activeVerifiedVol?.id, activeVerifiedVol?.name, 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80')}
                              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                            >
                              <ShieldCheck className="w-4 h-4" /> Mark Mission Resolved
                            </button>
                          )}

                          {mission.status === 'completed' && (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-emerald-600" /> Resolved by {mission.assignedTeamName}
                            </span>
                          )}
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
                      <div className="text-3xl font-extrabold text-white">{activeVerifiedVol?.tasksAssigned || 3}</div>
                      <span className="text-xs text-slate-300 font-medium">Completed Rescue Tasks</span>
                    </div>
                    <Award className="w-10 h-10 text-emerald-400 opacity-80" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium border-t border-slate-800 pt-2">
                    Certified Level-1 Disaster Responder • Verified by Assam State Disaster Authority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* LOCKED RESPONDER PORTAL GATE CARD */
          <div className="bg-white border border-rose-200 p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-5 max-w-2xl mx-auto my-8 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🔒
            </div>
            <div className="space-y-2">
              <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-rose-300">
                RESTRICTED FIELD RESPONDER PORTAL
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                Verified Responder Portal is Locked
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
                This operational mission view is locked and can only be accessed by authenticated field volunteers, NDRF/SDRF rescue commanders, and state admins.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium max-w-md mx-auto space-y-1.5 text-left">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-600" /> Credentials to Access Portal:
              </div>
              <div>• <strong>Registered Volunteer:</strong> Use your auto-generated ID (e.g. <code>VOL-SIVA-0001</code>) & Password</div>
              {/* <div>• <strong>NDRF Rescue Passcode:</strong> <code>ndrf2026</code></div> */}
              {/* <div>• <strong>Admin Master Passcode:</strong> <code>admin123</code></div> */}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Authenticate & Access Verified Portal</span>
              </button>

              <button
                onClick={() => setActivePortalTab('roster')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl text-xs transition-all"
              >
                Open Volunteer Registration Form
              </button>
            </div>
          </div>
        )
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

                {/* Account Credentials & Auto-Generated ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                  <div>
                    <label className="block text-slate-800 mb-1 font-bold">Auto-Assigned Volunteer ID (Default)</label>
                    <div className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-extrabold font-mono flex items-center justify-between shadow-xs">
                      <span>{autoGenVolunteerId}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-300">Default</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-800 mb-1 font-bold">Set Account Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Create secret password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
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
                        placeholder="e.g. Sivasagar Sadar, Nazira, Titabor"
                        value={subDivision}
                        onChange={e => setSubDivision(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">Revenue Circle / Dev Block *</label>
                      <input
                        type="text"
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
                        placeholder="e.g. Disangmukh GP, Ward No. 4, Namti"
                        value={localArea}
                        onChange={e => setLocalArea(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* GPS Telemetry Coordinates */}
                <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Crosshair className="w-4 h-4 text-sky-600" /> Active GPS Coordinates (Plotted on Live Rescuer Map)
                    </span>
                    <button
                      type="button"
                      onClick={handleFetchGps}
                      disabled={isFetchingGps}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-3 py-1 rounded-xl text-[10px] flex items-center gap-1 shadow-sm"
                    >
                      <Navigation className={`w-3 h-3 ${isFetchingGps ? 'animate-spin' : ''}`} />
                      <span>{isFetchingGps ? 'Fetching...' : 'Fetch Live GPS'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">Latitude (°N)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={e => setLat(parseFloat(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">Longitude (°E)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lng}
                        onChange={e => setLng(parseFloat(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Rescue Skills Checklist */}
                <div>
                  <label className="block text-slate-900 mb-2 font-bold">Select Specialized Rescue Skills:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {skillsList.map(sk => {
                      const isSelected = selectedSkills.includes(sk.id);
                      return (
                        <div
                          key={sk.id}
                          onClick={() => toggleSkill(sk.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer font-bold text-xs transition-all flex items-center justify-between ${isSelected
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300'
                            }`}
                        >
                          <span>{sk.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* On-Duty Switch */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">On-Duty Readiness</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Broadcast live telemetry for critical dispatch auto-assignment</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${isAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                  >
                    <span>{isAvailable ? '🟢 ON-DUTY READY' : '⚪ OFF-DUTY'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Submit Volunteer Application (Pending Admin Verification)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Volunteer Roster Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
                State Active Volunteer Roster ({volunteers.length})
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
                Live Telemetry Active
              </span>
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {volunteers.map(vol => (
                <div
                  key={vol.id}
                  onClick={() => setSelectedVolunteer(vol)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {vol.name}
                        </h4>
                        {vol.isVerified ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Responder
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                        ID: <strong className="text-slate-800">{vol.id}</strong> • Base: <strong>{vol.district}</strong>
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${vol.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                      {vol.available ? '🟢 On-Duty' : '⚪ Off-Duty'}
                    </span>
                  </div>

                  {vol.serviceableArea && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200 font-medium">
                      📍 Serviceable Area: {vol.serviceableArea}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {vol.skills.map(sk => (
                      <span key={sk} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                        {sk.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VOLUNTEER DETAIL MODAL */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-6">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  🦺
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-white text-base">{selectedVolunteer.name}</h3>
                  <p className="text-xs text-slate-400">ID: {selectedVolunteer.id} • Base District: {selectedVolunteer.district}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Serviceable Area Telemetry:</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedVolunteer.serviceableArea || `${selectedVolunteer.district} Central Sector`}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-bold">Phone Number</span>
                  <span className="text-slate-900 font-bold">{selectedVolunteer.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-bold">Email Address</span>
                  <span className="text-slate-900 font-bold">{selectedVolunteer.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Verified Rescue Skills:</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVolunteer.skills.map(sk => (
                    <span key={sk} className="bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-xl border border-emerald-200">
                      ✓ {sk.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVolunteer(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl"
                >
                  Close Profile Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
