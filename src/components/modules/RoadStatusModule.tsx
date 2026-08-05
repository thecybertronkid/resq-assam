import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { analyzeDisasterPhotoAsync, FullDisasterAnalysis } from '../../utils/aiEngine';
import { getAiTrainingState, trainModelOnSample, ModelTrainingState } from '../../utils/aiSelfTrainingEngine';
import { AiVisionAnalysisModal } from '../common/AiVisionAnalysisModal';
import { 
  Navigation, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Upload, 
  Sparkles, 
  Eye, 
  ShieldAlert,
  Brain,
  Zap,
  Activity,
  Award,
  RefreshCw,
  Compass,
  Check
} from 'lucide-react';

export const RoadStatusModule: React.FC = () => {
  const { roadReports, addRoadReport, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadName, setRoadName] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [status, setStatus] = useState<any>('waterlogged');
  const [details, setDetails] = useState('');

  // AI Self-Training State
  const [trainingState, setTrainingState] = useState<ModelTrainingState>(getAiTrainingState());

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
          // Run 20-module AI Disaster Vision Engine with self-training weights
          const analysisResult = await analyzeDisasterPhotoAsync(file, previewUrl);
          setFullAiAnalysis(analysisResult);
          setIsAnalyzingPhoto(false);

          // Train model on new sample
          const updatedState = trainModelOnSample('road_hazard', true);
          setTrainingState(updatedState);

          const depth = analysisResult.analysis.water_depth.estimate;
          const priority = analysisResult.analysis.rescue_priority.rescue_priority_label;
          const acc = analysisResult.analysis.road_accessibility.accessibility_status;

          setDetails(prev => `[AI Vision Telemetry]: Est. Depth ${depth} • Passability: ${acc} • Priority: ${priority}. ${prev}`);
          showToast(`⚡ AI Vision Analysis Complete: Est. Depth ${depth} | Model Trained to ${updatedState.accuracyRate}% Accuracy!`);
        } catch {
          setIsAnalyzingPhoto(false);
          showToast('⚠️ AI Vision analysis fallback executed.');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerSelfTraining = (sampleName: string) => {
    const newState = trainModelOnSample(sampleName, true);
    setTrainingState(newState);
    showToast(`🤖 AI Model Self-Trained! Datasets: ${newState.samplesTrained} | Model Accuracy: ${newState.accuracyRate}%`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadName) return;
    addRoadReport({
      roadName,
      district,
      status,
      details: details || 'Road hazard logged by field responder.',
      reportedBy: 'Field AI Vision Responder',
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
            <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
            AI COMPUTER VISION HAZARD & SELF-TRAINING TELEMETRICS ENGINE
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">Road Blockage & Flood Hazard Portal</h1>
          <p className="text-xs text-slate-600 font-medium">Upload field photos for automated 20-module AI depth estimation, debris detection, and adaptive self-training analytics.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Report Road Hazard
          </button>
        </div>
      </div>

      {/* AI Self-Training Telemetry Counter Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-extrabold text-xl shrink-0">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-white">
                ResQ Self-Training Computer Vision Neural Engine
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                🟢 Online Adaptive Learning Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Continuously trains on real field hazard photos, pixel color histograms & validated ground-truth depth telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold">MODEL ACCURACY</span>
            <strong className="text-emerald-400 text-base font-mono">{trainingState.accuracyRate}%</strong>
          </div>

          <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold">DATASETS TRAINED</span>
            <strong className="text-purple-300 text-base font-mono">{trainingState.samplesTrained.toLocaleString()} Samples</strong>
          </div>

          <button
            onClick={() => handleTriggerSelfTraining('road_hazard_recalibration')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Train & Re-Calibrate Engine</span>
          </button>
        </div>
      </div>

      {/* Road Hazard Cards Grid */}
      {roadReports.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-sm">No Road Hazard Reports</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            No road hazard reports currently logged. Click "Report Road Hazard" to upload a field photo and run the AI Computer Vision Engine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadReports.map(rd => (
            <div key={rd.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-purple-300 transition-all">
              {rd.photoUrl && (
                <img src={rd.photoUrl} alt="Road hazard photo" className="w-full h-40 object-cover rounded-2xl border border-slate-100" />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2.5 py-0.5 rounded uppercase border border-purple-300">
                    {rd.district}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{rd.roadName}</h3>
                  <p className="text-xs text-slate-600 font-medium">{rd.details}</p>
                </div>
              </div>

              {/* Telemetrics summary box */}
              {rd.telemetrics && (
                <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-200 space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>Est. Water Depth:</span>
                    <strong className="text-purple-700">{rd.telemetrics.waterDepthMeters} m ({rd.telemetrics.waterDepthFeet} ft)</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Obstacle / Status:</span>
                    <strong className="text-slate-800">{rd.telemetrics.obstacleType}</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Structural Risk:</span>
                    <strong className="text-rose-600">{rd.telemetrics.structuralRiskScore}/100</strong>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
                <button
                  onClick={async () => {
                    if (fullAiAnalysis) {
                      setSelectedAnalysisModal(fullAiAnalysis);
                    } else {
                      // Generate dynamic vision telemetrics
                      const file = new File(['mock'], 'road.jpg', { type: 'image/jpeg' });
                      const res = await analyzeDisasterPhotoAsync(file, rd.photoUrl);
                      setSelectedAnalysisModal(res);
                    }
                  }}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>View 20-Module AI Vision Telemetry</span>
                </button>

                <button
                  onClick={() => handleTriggerSelfTraining(`road_${rd.id}`)}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-all"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Validate AI Report & Train Engine</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REPORT ROAD HAZARD FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm min-h-screen overflow-y-auto">
          <div className="bg-white border border-purple-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-5 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">Report Road Hazard with AI Vision</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Road / Highway Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NH-37 Near Amguri Town, Titabor Sector"
                  value={roadName}
                  onChange={e => setRoadName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">District *</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                  >
                    {ASSAM_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Road Condition *</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                  >
                    <option value="waterlogged">🌊 Waterlogged</option>
                    <option value="tree_fallen">🪵 Fallen Tree</option>
                    <option value="landslide">⛰️ Landslide Hazard</option>
                    <option value="bridge_collapse">💥 Bridge Collapse</option>
                    <option value="boat_required">🚤 Motorboat Only</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload & AI Vision Trigger */}
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI Computer Vision Field Photo Telemetrics
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Attach Field Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {isAnalyzingPhoto && (
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Running 20-module computer vision depth & hazard analysis...</span>
                  </div>
                )}

                {photoPreview && (
                  <div className="space-y-2">
                    <img src={photoPreview} alt="Field preview" className="w-full h-36 object-cover rounded-xl border border-purple-200" />
                    {fullAiAnalysis && (
                      <div className="bg-white p-3 rounded-xl border border-purple-200 text-[11px] text-slate-700 font-semibold space-y-1">
                        <div>Est. Water Depth: <strong className="text-purple-700">{fullAiAnalysis.analysis.water_depth.estimate}</strong></div>
                        <div>Accessibility: <strong className="text-slate-900">{fullAiAnalysis.analysis.road_accessibility.accessibility_status}</strong></div>
                        <div>Structural Risk: <strong className="text-rose-600">{fullAiAnalysis.analysis.severity.severity_score}/100</strong></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Additional Observations</label>
                <textarea
                  rows={2}
                  placeholder="Notes on current water level, alternative routes..."
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md shadow-purple-500/20"
              >
                Publish Road Hazard Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI VISION ANALYSIS FULL MODAL */}
      {selectedAnalysisModal && (
        <AiVisionAnalysisModal
          analysis={selectedAnalysisModal}
          onClose={() => setSelectedAnalysisModal(null)}
          photoUrl={selectedAnalysisModal.overlay_image_base64}
        />
      )}
    </div>
  );
};
