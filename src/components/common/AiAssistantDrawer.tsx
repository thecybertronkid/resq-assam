import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateAiImageAnalysis } from '../../utils/aiEngine';
import { Sparkles, X, Mic, Globe, Image as ImageIcon, CheckCircle, ShieldAlert, Bot } from 'lucide-react';

export const AiAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, language, setLanguage, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'translate' | 'image' | 'voice'>('translate');
  const [inputText, setInputText] = useState('Brahmaputra water level rising fast near Chandrapur. Evacuation boat needed urgently.');
  const [translatedText, setTranslatedText] = useState('চান্দপুৰৰ ওচৰত ব্ৰহ্মপুত্ৰৰ পানীৰ স্তৰ দ্ৰুতগতিত বৃদ্ধি পাইছে। জৰুৰীভাৱে উচ্ছেদৰ নৌকাৰ প্ৰয়োজন।');

  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80');
  const [imageAnalysis, setImageAnalysis] = useState<any | null>(null);

  const [speechText, setSpeechText] = useState('');
  const [isListening, setIsListening] = useState(false);

  if (!isAiDrawerOpen) return null;

  const handleTranslate = () => {
    if (language === 'en') {
      setTranslatedText('চান্দপুৰৰ ওচৰত ব্ৰহ্মপুত্ৰৰ পানীৰ স্তৰ দ্ৰুতগতিত বৃদ্ধি পাইছে। জৰুৰীভাৱে উচ্ছেদৰ নৌকাৰ প্ৰয়োজন।');
    } else {
      setTranslatedText('Brahmaputra river level rising fast near Chandrapur. Need evacuation boat urgently.');
    }
    showToast(`🤖 AI Translated message between English & Assamese!`);
  };

  const handleAnalyzeImage = () => {
    const result = simulateAiImageAnalysis(imageUrl);
    setImageAnalysis(result);
    showToast(`📸 AI Computer Vision analyzed flood depth: ${result.waterDepthFeet} ft!`);
  };

  const handleSpeechToText = () => {
    setIsListening(true);
    setTimeout(() => {
      setSpeechText('SOS Emergency: 4 elderly persons trapped in roof near Rohmoria embankment.');
      setIsListening(false);
      showToast(`🎙️ Voice-to-Text converted speech into structured report!`);
    }, 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/95 backdrop-blur-2xl border-l border-pink-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-xs text-slate-900">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
              <Bot className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-slate-900 text-base">ResQ AI Emergency Copilot</h3>
              <p className="text-[11px] text-sky-700 font-bold">ASDMA Neural Intelligence Toolkit</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-4 font-bold">
          <button
            onClick={() => setActiveTab('translate')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'translate' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <Globe className="w-3.5 h-3.5" /> Translate
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'image' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Computer Vision
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'voice' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <Mic className="w-3.5 h-3.5" /> Speech AI
          </button>
        </div>

        {/* TAB 1: TRANSLATE */}
        {activeTab === 'translate' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Input Message (English / Assamese / Hindi):</label>
              <textarea
                rows={3}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>

            <button
              onClick={handleTranslate}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Instant Auto-Translation
            </button>

            {translatedText && (
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 space-y-1">
                <span className="text-[10px] text-sky-800 font-bold uppercase">AI Translation Result:</span>
                <p className="text-slate-900 font-bold">{translatedText}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IMAGE ANALYSIS */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-slate-700 font-bold">Flood & Road Obstacle Photo:</label>
              <img src={imageUrl} alt="Analysis sample" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
            </div>

            <button
              onClick={handleAnalyzeImage}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Run Flood Depth & Obstacle Detector
            </button>

            {imageAnalysis && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-600">Detected Water Depth:</span>
                  <strong className="text-sky-700 font-bold">{imageAnalysis.waterDepthFeet} Feet</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Road Obstacle:</span>
                  <strong className="text-amber-800 font-bold">{imageAnalysis.obstacleType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Structural Risk Score:</span>
                  <strong className="text-rose-700 font-bold">{imageAnalysis.structuralRiskScore}%</strong>
                </div>
                <div className="text-[10px] text-emerald-700 text-right font-bold">Confidence: {imageAnalysis.confidence}%</div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VOICE-TO-TEXT */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <p className="text-slate-600 font-medium">
              Click below to speak in Assamese, Hindi, or English to auto-populate emergency reports.
            </p>

            <button
              onClick={handleSpeechToText}
              disabled={isListening}
              className={`w-full py-3 rounded-xl font-extrabold text-white flex items-center justify-center gap-2 shadow-sm ${
                isListening ? 'bg-rose-600 animate-pulse' : 'bg-pink-600 hover:bg-pink-500'
              }`}
            >
              <Mic className="w-4 h-4" />
              {isListening ? 'Listening to voice stream...' : 'Start Voice-to-Text Telemetry'}
            </button>

            {speechText && (
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 space-y-1">
                <span className="text-[10px] text-pink-800 font-bold uppercase">Transcribed Report:</span>
                <p className="text-slate-900 font-bold">{speechText}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
        ResQ AI Engine powered by ASDMA Geospatial Analytics.
      </div>
    </div>
  );
};
