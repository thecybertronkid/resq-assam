import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { analyzeDisasterPhotoAsync, FullDisasterAnalysis } from '../../utils/aiEngine';
import { AiVisionAnalysisModal } from '../common/AiVisionAnalysisModal';
import { Navigation, Plus, AlertTriangle, CheckCircle, MapPin, Upload, Sparkles, Eye, ShieldAlert } from 'lucide-react';

export const RoadStatusModule: React.FC = () => {
  const { roadReports, addRoadReport, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadName, setRoadName] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [status, setStatus] = useState<any>('waterlogged');
  const [details, setDetails] = useState('');

  // AI Photo Telemetrics State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fullAiAnalysis, setFullAiAnalysis] = useState<FullDisasterAnalysis | null>(null);
  const [selectedAnalysisModal, setSelectedAnalysisModal] = useState<FullDisasterAnalysis | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('⚠️ Image file size exceeds 25 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      if (evt.target?.result) {
        const previewUrl = evt.target.result as string;
        setPhotoPreview(previewUrl);
        setIsAnalyzingPhoto(true);

        try {
          // Run 20-module AI Disaster Vision Engine
          const analysisResult = await analyzeDisasterPhotoAsync(file, previewUrl);
          setFullAiAnalysis(analysisResult);
          setIsAnalyzingPhoto(false);

          const depth = analysisResult.analysis.water_depth.estimate;
          const priority = analysisResult.analysis.rescue_priority.rescue_priority_label;
          const acc = analysisResult.analysis.road_accessibility.accessibility_status;

          setDetails(prev => `[AI Vision Report]: Depth ${depth} • Accessibility: ${acc} • Priority: ${priority}. ${prev}`);
          showToast(`⚡ AI Vision Analysis Complete: Est. Depth ${depth} | Priority: ${priority}!`);
        } catch {
          setIsAnalyzingPhoto(false);
          showToast('⚠️ AI Vision analysis fallback executed.');
        }
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
      reportedBy: 'Field AI Responder',
      lat: 26.9826 + (Math.random() - 0.5) * 0.2,
      lng: 94.6425 + (Math.random() - 0.5) * 0.2,
      photoUrl: photoPreview || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      telemetrics: fullAiAnalysis ? {
        waterDepthFeet: parseFloat(fullAiAnalysis.analysis.water_depth.estimate.split('–')[0]) * 3.28084 || 3.5,
        waterDepthMeters: parseFloat(fullAiAnalysis.analysis.water_depth.estimate.split('–')[0]) || 1.1,
        obstacleType: fullAiAnalysis.analysis.road_accessibility.accessibility_status,
        structuralRiskScore: fullAiAnalysis.analysis.severity.severity_score,
        recommendedEquipment: fullAiAnalysis.dashboard_cards.find(c => c.title.includes('Recommendation'))?.value || 'Motorboat',
        confidence: Math.round(fullAiAnalysis.analysis.severity.confidence * 100),
        submersionSeverity: fullAiAnalysis.analysis.rescue_priority.rescue_priority_label === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
      } : undefined
    });
    setIsModalOpen(false);
    setRoadName('');
    setDetails('');
    setPhotoPreview(null);
    setFullAiAnalysis(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100 border border-purple-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-800 tracking-wider flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-purple-600" />
            AI COMPUTER VISION HAZARD & ROAD ACCESSIBILITY TELEMETRICS
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Road Blockage & Flood Hazard Portal</h1>
          <p className="text-xs text-slate-600 font-medium">Upload field photos for automated 20-module AI depth estimation, debris, and accessibility telemetry.</p>
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
                <span>🌊 Est. Depth: <strong>{rd.telemetrics.waterDepthMeters}m ({rd.telemetrics.waterDepthFeet}ft)</strong></span>
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
            <div className="bg-white border border-purple-200 w-full max-w-lg rounded-3xl p-6 space-y-4 text-xs text-slate-900 shadow-2xl my-6">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Report Road Hazard (AI 20-Module Computer Vision Analysis)
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* AI Photo Telemetrics Upload */}
                <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-3">
                  <label className="block text-slate-900 font-extrabold flex items-center justify-between">
                    <span>Upload Road / Flood Photo (JPG, PNG, WEBP max 25MB):</span>
                    <span className="text-[10px] text-purple-700 font-bold">Auto 20-Module AI Analysis</span>
                  </label>
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
                    disabled={isAnalyzingPhoto}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Upload className={`w-4 h-4 ${isAnalyzingPhoto ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzingPhoto ? 'Analyzing with 20 AI Vision Modules...' : 'Upload Field Photo for AI Analysis'}</span>
                  </button>

                  {photoPreview && (
                    <div className="space-y-3 pt-2">
                      <img src={photoPreview} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-xl border border-purple-200" />

                      {fullAiAnalysis && (
                        <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-purple-900">
                            <span>✨ AI Disaster Vision Report Generated:</span>
                            <button
                              type="button"
                              onClick={() => setSelectedAnalysisModal(fullAiAnalysis)}
                              className="text-purple-700 underline hover:text-purple-900 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Full 20-Module Overlay Modal
                            </button>
                          </div>
                          
                          {/* 6 Dashboard Cards Preview */}
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                            {fullAiAnalysis.dashboard_cards.map((c, i) => (
                              <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <span className="text-slate-500 block text-[9px] uppercase">{c.title}</span>
                                <span className="text-slate-900">{c.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Road / Highway Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NH-37 near Khanapara"
                    value={roadName}
                    onChange={e => setRoadName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
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
                    <label className="block text-slate-700 mb-1 font-bold">Obstacle Type</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    >
                      <option value="waterlogged">🌊 Waterlogged / Standing Water</option>
                      <option value="mudslide">⛰️ Mudslide / Landslide Blockage</option>
                      <option value="bridge_damaged">🌉 Bridge Washout / Embankment Damage</option>
                      <option value="debris">🪵 Tree & Debris Roadblock</option>
                      <option value="cleared">✅ Cleared / Passable</option>
                    </select>
                  </div>
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
                    Log Obstacle Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AI Vision Full 20-Module Detailed Analysis Modal */}
      {selectedAnalysisModal && (
        <AiVisionAnalysisModal
          analysis={selectedAnalysisModal}
          onClose={() => setSelectedAnalysisModal(null)}
          photoUrl={photoPreview || undefined}
        />
      )}
    </div>
  );
};
