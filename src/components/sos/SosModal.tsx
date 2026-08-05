import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { DisasterType } from '../../types';
import { 
  X, 
  MapPin, 
  Mic, 
  MicOff, 
  Camera, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  AlertOctagon,
  CheckCircle,
  WifiOff,
  Trash2
} from 'lucide-react';

export const SosModal: React.FC = () => {
  const { isSosModalOpen, setIsSosModalOpen, submitSosReport, isOnline, showToast } = useApp();

  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [village, setVillage] = useState('');
  const [landmark, setLandmark] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('critical');

  // Demographics
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [elderly, setElderly] = useState(0);
  const [disabled, setDisabled] = useState(0);
  const [pregnant, setPregnant] = useState(0);
  const [animals, setAnimals] = useState(0);

  // Needs
  const [needs, setNeeds] = useState({
    food: true,
    water: true,
    medicine: false,
    boat: true,
    evacuation: true,
    livestock: false
  });

  const [description, setDescription] = useState('');
  const [lat, setLat] = useState<number>(26.1445);
  const [lng, setLng] = useState<number>(91.7362);
  const [geoLocating, setGeoLocating] = useState(false);

  // Voice Note Recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isSosModalOpen) return null;

  const handleDetectGps = () => {
    setGeoLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setGeoLocating(false);
        },
        (err) => {
          setGeoLocating(false);
        }
      );
    } else {
      setGeoLocating(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSosReport({
      reporterName,
      reporterPhone,
      lat,
      lng,
      district,
      village,
      landmark,
      disasterType,
      severity,
      demographics: { adults, children, elderly, disabled, pregnant, animals },
      needs,
      description,
      voiceNoteUrl: audioUrl || undefined,
      photos: [
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
      ]
    });
    setIsSosModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-pink-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg flex items-center gap-2">
                STATE EMERGENCY SOS REPORT
                {!isOnline && (
                  <span className="bg-amber-300 text-amber-950 text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Offline Queue
                  </span>
                )}
              </h2>
              <p className="text-xs text-pink-100 font-medium">Dispatches directly to NDRF & SDRF Emergency Control</p>
            </div>
          </div>
          <button
            onClick={() => setIsSosModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          {/* Reporter Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Reporter Name *</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Mobile Phone (OTP/Callback) *</label>
              <input
                type="tel"
                required
                placeholder="+91 98640 XXXXX"
                value={reporterPhone}
                onChange={e => setReporterPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Location & District */}
          <div className="space-y-3 bg-sky-50/60 p-4 rounded-2xl border border-sky-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                Incident Location & GPS Pin
              </span>
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={geoLocating}
                className="bg-white hover:bg-sky-100 text-sky-700 border border-sky-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                {geoLocating ? 'Detecting GPS...' : '🎯 Detect My GPS Location'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">District *</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                >
                  {ASSAM_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Village / Ward *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chandrapur Village"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Landmark / House No.</label>
                <input
                  type="text"
                  placeholder="Near High School Embankment"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-600 flex items-center gap-4">
              <span>Coordinates: <strong className="text-slate-900">{lat.toFixed(4)}, {lng.toFixed(4)}</strong></span>
              <span className="text-emerald-700 font-semibold">✓ Accurate within 10 meters</span>
            </div>
          </div>

          {/* Disaster Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Disaster Type *</label>
              <select
                value={disasterType}
                onChange={e => setDisasterType(e.target.value as DisasterType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              >
                <option value="flood">🌊 Flash Flood / Brahmaputra Inundation</option>
                <option value="landslide">⛰️ Landslide / Mudslide</option>
                <option value="erosion">🧱 River Bank Erosion</option>
                <option value="storm">⛈️ Cyclone / Severe Storm</option>
                <option value="earthquake">🏚️ Earthquake Damage</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Urgency Level *</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-rose-700 font-bold"
              >
                <option value="critical">🚨 CRITICAL (Imminent Threat to Life / Rooftop Stranded)</option>
                <option value="high">⚠️ HIGH (Waterlogging in house / Supply needed)</option>
                <option value="medium">🔷 MEDIUM (Relief Camp transport required)</option>
                <option value="low">🟢 LOW (Inquiry / Non-urgent)</option>
              </select>
            </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-200 space-y-3">
            <span className="font-bold text-pink-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-pink-600" />
              Stranded Persons Count (Used for AI Priority Calculation)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
              {[
                { label: 'Adults', val: adults, set: setAdults },
                { label: 'Children', val: children, set: setChildren },
                { label: 'Elderly', val: elderly, set: setElderly },
                { label: 'Disabled', val: disabled, set: setDisabled },
                { label: 'Pregnant', val: pregnant, set: setPregnant },
                { label: 'Pets/Cattle', val: animals, set: setAnimals }
              ].map(item => (
                <div key={item.label} className="bg-white p-2 rounded-xl border border-pink-200 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">{item.label}</span>
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" onClick={() => item.set(Math.max(0, item.val - 1))} className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700">-</button>
                    <span className="font-bold text-slate-900 text-sm">{item.val}</span>
                    <button type="button" onClick={() => item.set(item.val + 1)} className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Assistance Needed */}
          <div>
            <label className="block text-slate-700 mb-2 font-bold">Immediate Assistance Needed:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'boat', label: '🚤 Rescue Boat / Heli Evacuation' },
                { key: 'evacuation', label: '🚑 Medical Emergency Evacuation' },
                { key: 'food', label: '🍞 Dry Food Packets' },
                { key: 'water', label: '💧 Clean Drinking Water' },
                { key: 'medicine', label: '💊 Essential Medicines' },
                { key: 'livestock', label: '🌾 Cattle / Animal Shelter Aid' }
              ].map(n => (
                <label key={n.key} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:border-pink-300 font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={(needs as any)[n.key]}
                    onChange={e => setNeeds({ ...needs, [n.key]: e.target.checked })}
                    className="rounded text-pink-600 focus:ring-0"
                  />
                  <span>{n.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Voice SOS Note */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-emerald-600" />
                Voice SOS Note (Optional audio report)
              </span>
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Mic className="w-3.5 h-3.5" /> Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-pulse"
                >
                  <MicOff className="w-3.5 h-3.5" /> Stop & Save Note
                </button>
              )}
            </div>
            {audioUrl && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                  <span>✓ Voice recording captured. Preview:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioUrl(null);
                      audioChunksRef.current = [];
                      if (mediaRecorderRef.current) {
                        mediaRecorderRef.current = null;
                      }
                      showToast('🗑️ Captured Voice SOS Note deleted!');
                    }}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1 font-extrabold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Voice Note</span>
                  </button>
                </div>
                <audio src={audioUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Situation Details & Special Notes</label>
            <textarea
              rows={3}
              placeholder="Describe current water level, access difficulties, medical conditions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-pink-500 font-medium"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <p className="text-[11px] text-slate-500 font-medium">
              * By submitting, your GPS and details are transmitted to the 24x7 State Disaster Control Room.
            </p>
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-xl shadow-pink-500/30 border border-rose-300 text-sm flex items-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" />
              DISPATCH SOS REPORT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
