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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-xs text-slate-200">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-white text-base">ResQ AI Emergency Copilot</h3>
              <p className="text-[11px] text-indigo-300">ASDMA Neural Intelligence Toolkit</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="text-slate-400 hover:text-white bg-slate-900 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 mb-4 font-semibold">
          <button
            onClick={() => setActiveTab('translate')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'translate' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            <Globe className="w-3.5 h-3.5" /> Translate
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Computer Vision
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'voice' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            <Mic className="w-3.5 h-3.5" /> Speech AI
          </button>
        </div>

        {/* TAB 1: TRANSLATE */}
        {activeTab === 'translate' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Input Message (English / Assamese / Hindi):</label>
              <textarea
                rows={3}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleTranslate}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Instant Auto-Translation
            </button>

            {translatedText && (
              <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/40 space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase">AI Translation Result:</span>
                <p className="text-white font-medium">{translatedText}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IMAGE ANALYSIS */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-slate-400 font-semibold">Flood & Road Obstacle Photo:</label>
              <img src={imageUrl} alt="Analysis sample" className="w-full h-36 object-cover rounded-xl border border-slate-800" />
            </div>

            <button
              onClick={handleAnalyzeImage}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Run Flood Depth & Obstacle Detector
            </button>

            {imageAnalysis && (
              <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Detected Water Depth:</span>
                  <strong className="text-blue-400">{imageAnalysis.waterDepthFeet} Feet</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Road Obstacle:</span>
                  <strong className="text-amber-400">{imageAnalysis.obstacleType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Structural Risk Score:</span>
                  <strong className="text-red-400">{imageAnalysis.structuralRiskScore}%</strong>
                </div>
                <div className="text-[10px] text-emerald-400 text-right">Confidence: {imageAnalysis.confidence}%</div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VOICE-TO-TEXT */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <p className="text-slate-400">
              Click below to speak in Assamese, Hindi, or English to auto-populate emergency reports.
            </p>

            <button
              onClick={handleSpeechToText}
              disabled={isListening}
              className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                isListening ? 'bg-red-600 animate-pulse' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              <Mic className="w-4 h-4" />
              {isListening ? 'Listening to voice stream...' : 'Start Voice-to-Text Telemetry'}
            </button>

            {speechText && (
              <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/40 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase">Transcribed Report:</span>
                <p className="text-white font-medium">{speechText}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
        ResQ AI Engine powered by ASDMA Geospatial Analytics.
      </div>
    </div>
  );
};
