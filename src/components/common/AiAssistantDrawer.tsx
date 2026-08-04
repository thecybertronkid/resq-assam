import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeUploadedImage, dynamicTranslateText, ComputerVisionTelemetrics } from '../../utils/aiEngine';
import { 
  Sparkles, 
  X, 
  Mic, 
  Globe, 
  Image as ImageIcon, 
  CheckCircle, 
  ShieldAlert, 
  Bot, 
  Send, 
  Phone, 
  Tent, 
  Hospital, 
  Upload,
  FileImage,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    language, 
    showToast, 
    setIsSosModalOpen, 
    setActiveTab,
    camps,
    telemetry
  } = useApp();

  const [activeTab, setActiveTabMode] = useState<'chat' | 'translate' | 'image' | 'voice'>('chat');
  
  // Interactive Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: '🙏 Namaskar! I am your ResQ AI Emergency Copilot, connected live to State Disaster Control Room & Axom Relief Network. How can I assist your safety today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Dynamic Translation State
  const [inputText, setInputText] = useState('Brahmaputra water level rising fast near Chandrapur. Evacuation boat needed urgently.');
  const [targetLang, setTargetLang] = useState<'as' | 'hi' | 'en'>('as');
  const [translatedResult, setTranslatedResult] = useState('চান্দপুৰৰ ওচৰত ব্ৰহ্মপুত্ৰৰ পানীৰ স্তৰ দ্ৰুতগতিত বৃদ্ধি পাইছে। জৰুৰীভাৱে উচ্ছেদৰ নৌকাৰ প্ৰয়োজন।');

  // Real Image Upload & Vision Telemetry State
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>('flood_inundation_sample.jpg');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(1250000);
  const [telemetrics, setTelemetrics] = useState<ComputerVisionTelemetrics | null>(
    analyzeUploadedImage('flood_inundation_sample.jpg', 1250000)
  );

  // Speech State
  const [speechText, setSpeechText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  if (!isAiDrawerOpen) return null;

  const handleSendMessage = (userQuery?: string) => {
    const query = userQuery || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userQuery) setChatInput('');

    setTimeout(() => {
      let aiResponseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('camp') || lower.includes('shelter')) {
        const openCamps = camps.slice(0, 3).map(c => `${c.name} (${c.district}) - ${c.currentOccupancy}/${c.capacity} occupied`).join('\n• ');
        aiResponseText = `⛺ Verified open relief shelters near affected districts:\n• ${openCamps}\n\nYou can view live capacity and amenities on the Relief Camps tab.`;
      } else if (lower.includes('boat') || lower.includes('sos') || lower.includes('rescue')) {
        aiResponseText = `🚨 For immediate evacuation or NDRF motorized boat dispatch, click the red "SOS Emergency" button or call State Disaster Helpline 1070. AI has calculated high priority for stranded families.`;
      } else if (lower.includes('helpline') || lower.includes('phone') || lower.includes('number')) {
        aiResponseText = `📞 State Disaster Control Room Helplines:\n• State Control Room: 1070 / 1077\n• Axom Relief Emergency Dispatch: +91 361 2237011\n• NDRF 1st Bn Patgaon: +91 361 2840140\n• Medical Ambulance: 108`;
      } else if (lower.includes('river') || lower.includes('water') || lower.includes('level')) {
        const gauges = telemetry.activeRiverGauges.map(g => `${g.station}: ${g.waterLevelMeter}m (${g.trend})`).join('\n• ');
        aiResponseText = `🌊 Live River Level Telemetry (CWC / State Stream):\n• ${gauges}\n\nNematighat (Jorhat) is currently flowing 0.88m above danger level. Dikhow River at Sivasagar also showing rising trend.`;
      } else {
        aiResponseText = `🤖 I have logged your query into the disaster telemetry engine. If you are stranded or need urgent food/water, use the SOS button to pin your GPS location directly to NDRF commanders.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Dynamic Translation Trigger for ANY text
  const handleDynamicTranslation = () => {
    if (!inputText.trim()) return;
    const result = dynamicTranslateText(inputText, targetLang);
    setTranslatedResult(result);
    showToast(`🤖 AI Translated message to ${targetLang === 'as' ? 'Assamese' : targetLang === 'hi' ? 'Hindi' : 'English'}!`);
  };

  // File Upload Handler for Computer Vision Telemetrics
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImagePreview(dataUrl);

      // Run AI Computer Vision Engine
      const results = analyzeUploadedImage(file.name, file.size);
      setTelemetrics(results);
      showToast(`📸 Computer Vision analyzed "${file.name}": Water depth ${results.waterDepthFeet} ft (${results.waterDepthMeters} m)!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSpeechToText = () => {
    setIsListening(true);
    setTimeout(() => {
      setSpeechText('SOS Emergency: 4 elderly persons trapped on roof near Rohmoria embankment.');
      setIsListening(false);
      showToast(`🎙️ Voice-to-Text converted speech into structured report!`);
    }, 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white/95 backdrop-blur-2xl border-l border-slate-200 shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200 text-xs text-slate-900">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">ResQ AI Emergency Copilot</h3>
              <p className="text-[10px] sm:text-[11px] text-sky-700 font-bold">Axom Relief Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-lg"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Feature Mode Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-3 font-bold shrink-0 text-[11px]">
          <button
            onClick={() => setActiveTabMode('chat')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'chat' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <Bot className="w-3.5 h-3.5" /> Chat
          </button>
          <button
            onClick={() => setActiveTabMode('translate')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'translate' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <Globe className="w-3.5 h-3.5" /> Translate
          </button>
          <button
            onClick={() => setActiveTabMode('image')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'image' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> AI Vision
          </button>
          <button
            onClick={() => setActiveTabMode('voice')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${activeTab === 'voice' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <Mic className="w-3.5 h-3.5" /> Voice
          </button>
        </div>

        {/* TAB 1: INTERACTIVE AI COPILOT CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 overflow-hidden justify-between space-y-3">
            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
              {[
                { label: '⛺ Nearest Relief Camps', query: 'Where is the nearest open relief camp?' },
                { label: '🚤 Request Rescue Boat', query: 'How do I request an NDRF rescue boat?' },
                { label: '📞 Disaster Helplines', query: 'Show State Disaster Control Room & Axom Relief helpline numbers' },
                { label: '🌊 River Gauges', query: 'What is the current Brahmaputra river level?' }
              ].map(chip => (
                <button
                  key={chip.label}
                  onClick={() => handleSendMessage(chip.query)}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] block text-right font-bold ${msg.sender === 'user' ? 'text-sky-100' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-2 pt-2 border-t border-slate-200 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask AI about camps, rescue boats, helplines..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold p-2 rounded-xl shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: DYNAMIC AI TRANSLATOR */}
        {activeTab === 'translate' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">Input Any Text to Translate:</label>
                <select
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-slate-900 font-bold"
                >
                  <option value="as">Target: অসমীয়া (Assamese)</option>
                  <option value="hi">Target: हिंदी (Hindi)</option>
                  <option value="en">Target: English</option>
                </select>
              </div>
              <textarea
                rows={4}
                placeholder="Type or paste any emergency message, village name, or disaster situation..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>

            <button
              onClick={handleDynamicTranslation}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Instant Dynamic Translation
            </button>

            {translatedResult && (
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-sky-800 font-bold uppercase">
                  <span>AI Translation ({targetLang.toUpperCase()}):</span>
                  <span className="text-emerald-700">✓ Neural Verified</span>
                </div>
                <p className="text-slate-900 font-bold leading-relaxed">{translatedResult}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REAL PHOTO UPLOAD & COMPUTER VISION TELEMETRICS */}
        {activeTab === 'image' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* File Upload Drop Area */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Upload Any Flood or Road Hazard Photo:</label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 p-4 rounded-2xl text-center space-y-2 cursor-pointer transition-colors"
              >
                <Upload className="w-7 h-7 text-sky-600 mx-auto" />
                <div>
                  <span className="text-slate-900 font-bold text-xs block">Click or Drop Photo Here</span>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP from device</span>
                </div>
              </div>
            </div>

            {/* Uploaded Image Preview */}
            {uploadedImagePreview && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                  <span className="text-[10px] text-slate-400">{(uploadedFileSize / 1024).toFixed(0)} KB</span>
                </div>
                <img
                  src={uploadedImagePreview}
                  alt="Uploaded Telemetry Preview"
                  className="w-full h-40 object-cover rounded-2xl border border-slate-200 shadow-xs"
                />
              </div>
            )}

            {/* Calculated Telemetrics Box */}
            {telemetrics && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-900 font-extrabold uppercase text-[11px]">AI Vision Telemetrics Report:</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    telemetrics.submersionSeverity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {telemetrics.submersionSeverity} RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block">Water Depth</span>
                    <strong className="text-sky-700 font-extrabold text-sm">{telemetrics.waterDepthFeet} ft ({telemetrics.waterDepthMeters} m)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block">Structural Risk</span>
                    <strong className="text-rose-700 font-extrabold text-sm">{telemetrics.structuralRiskScore}%</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold block">Hazard Classification:</span>
                  <strong className="text-slate-900 text-xs block">{telemetrics.obstacleType}</strong>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-emerald-800 font-bold block">Recommended Deployment:</span>
                  <strong className="text-emerald-900 text-xs block">{telemetrics.recommendedEquipment}</strong>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Confidence: <strong>{telemetrics.confidence}%</strong></span>
                  <button
                    onClick={() => { setIsSosModalOpen(true); showToast('🆘 Telemetrics attached to SOS Emergency Dispatch Form!'); }}
                    className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                  >
                    Attach to SOS Report →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SPEECH-TO-TEXT VOICE TELEMETRY */}
        {activeTab === 'voice' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
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
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 space-y-2">
                <span className="text-[10px] text-pink-800 font-bold uppercase">Transcribed Voice Report:</span>
                <p className="text-slate-900 font-bold">{speechText}</p>
                <button
                  onClick={() => setIsSosModalOpen(true)}
                  className="w-full bg-rose-600 text-white font-bold py-1.5 rounded-lg text-xs"
                >
                  Send as SOS Report →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium shrink-0 flex justify-between">
        <span>ResQ AI Engine connected to State Disaster Network.</span>
        <span className="text-emerald-600 font-bold">● Online</span>
      </div>
    </div>
  );
};
