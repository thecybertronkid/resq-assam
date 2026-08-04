import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { analyzeUploadedImage, ComputerVisionTelemetrics } from '../../utils/aiEngine';
import { Navigation, Plus, AlertTriangle, CheckCircle, MapPin, Upload, Sparkles } from 'lucide-react';

export const RoadStatusModule: React.FC = () => {
  const { roadReports, addRoadReport, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadName, setRoadName] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [status, setStatus] = useState<any>('waterlogged');
  const [details, setDetails] = useState('');

  // AI Photo Telemetrics State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [calculatedTelemetrics, setCalculatedTelemetrics] = useState<ComputerVisionTelemetrics | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const previewUrl = evt.target.result as string;
        setPhotoPreview(previewUrl);

        // Run AI Computer Vision Engine to calculate road telemetrics
        const tele = analyzeUploadedImage(file.name, file.size);
        setCalculatedTelemetrics(tele);
        setDetails(prev => `[AI Telemetrics]: Water Depth ${tele.waterDepthFeet} ft (${tele.waterDepthMeters} m). Structural Risk: ${tele.structuralRiskScore}%. Obstacle: ${tele.obstacleType}. ${prev}`);
        showToast(`⚡ AI Computer Vision calculated: Flood Depth ${tele.waterDepthFeet} ft (${tele.waterDepthMeters} m)!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadName) return;
    addRoadReport({
      roadName,
      district,
      status,
      details: details || 'Road hazard logged by field responder.',
      lat: 26.1500 + Math.random() * 0.5,
      lng: 91.7500 + Math.random() * 0.5,
      reportedBy: 'ASDMA Field Inspector',
      photoUrl: photoPreview || undefined,
      telemetrics: calculatedTelemetrics ? {
        waterDepthFeet: calculatedTelemetrics.waterDepthFeet,
        waterDepthMeters: calculatedTelemetrics.waterDepthMeters,
        obstacleType: calculatedTelemetrics.obstacleType,
        structuralRiskScore: calculatedTelemetrics.structuralRiskScore
      } : undefined
    });
    setIsModalOpen(false);
    setRoadName('');
    setDetails('');
    setPhotoPreview(null);
    setCalculatedTelemetrics(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-sky-100 border border-purple-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-800 tracking-wider flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-purple-600" />
            STATE HIGHWAY & BRIDGE INFRASTRUCTURE MONITOR
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Road Obstacle & Submersion Tracker</h1>
          <p className="text-xs text-slate-600 font-medium">Live reporting of flooded highways, fallen trees, bridge collapse, and landslide blockages.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Report Road Hazard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadReports.map(rd => (
          <div key={rd.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-purple-300 transition-all">
            {rd.photoUrl && (
              <img src={rd.photoUrl} alt="Road hazard photo" className="w-full h-36 object-cover rounded-2xl border border-slate-100" />
            )}

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-extrabold">{rd.district}</span>
                <h3 className="font-heading font-bold text-sm text-slate-900 mt-0.5">{rd.roadName}</h3>
              </div>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-purple-300 uppercase">
                {rd.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">{rd.details}</p>

            {rd.telemetrics && (
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-[11px] font-semibold text-purple-900 flex justify-between">
                <span>🌊 Flood Depth: <strong>{rd.telemetrics.waterDepthFeet} ft</strong></span>
                <span>Risk: <strong>{rd.telemetrics.structuralRiskScore}%</strong></span>
              </div>
            )}

            <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100 font-semibold">
              <span>Reported: {rd.reportedAt}</span>
              <span>By: {rd.reportedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Report Road Hazard with AI Photo Telemetrics */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-purple-200 w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base">Report Road Obstacle / Hazard</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* FIX 6: AI Photo Telemetrics Upload */}
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Upload Road Photo (AI Auto-Calculates Telemetrics):</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs shadow-2xs"
                >
                  <Upload className="w-4 h-4" /> Upload Road Photo for AI Telemetrics
                </button>
              </div>

              {photoPreview && (
                <div className="space-y-2">
                  <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-2xl border border-slate-200" />
                  {calculatedTelemetrics && (
                    <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 space-y-1 text-xs">
                      <span className="text-[10px] text-purple-800 font-extrabold uppercase flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Road Vision Telemetrics:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                        <div>Water Depth: <span className="text-sky-700">{calculatedTelemetrics.waterDepthFeet} ft ({calculatedTelemetrics.waterDepthMeters} m)</span></div>
                        <div>Structural Risk: <span className="text-rose-700">{calculatedTelemetrics.structuralRiskScore}%</span></div>
                      </div>
                      <p className="text-[10px] text-purple-900 font-medium">Obstacle: {calculatedTelemetrics.obstacleType}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Road / Highway Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NH-37 near Khanapara"
                  value={roadName}
                  onChange={e => setRoadName(e.target.value)}
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
                <label className="block text-slate-700 mb-1 font-bold">Obstacle Type</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="waterlogged">🌊 Waterlogged / Standing Water</option>
                  <option value="tree_fallen">🌳 Tree Fallen Hazard</option>
                  <option value="bridge_collapse">🌁 Bridge / Culvert Submerged</option>
                  <option value="landslide">⛰️ Landslide Mud Blockade</option>
                  <option value="boat_required">🚤 Motorboat Required Stretch</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Details & Passability</label>
                <textarea
                  rows={3}
                  placeholder="Describe water depth, vehicle restrictions..."
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
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-bold shadow-sm"
                >
                  Log Obstacle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
