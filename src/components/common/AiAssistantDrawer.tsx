import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateAiImageAnalysis } from '../../utils/aiEngine';
import { AXOM_RELIEF_EMERGENCY_DATA } from '../../utils/asdmaSyncEngine';
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
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionKey?: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    language, 
    setLanguage, 
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
      text: '🙏 Namaskar! I am your ResQ AI Emergency Copilot, connected live to ASDMA War Room & Axom Relief Network. How can I assist your safety today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Translation State
  const [inputText, setInputText] = useState('Brahmaputra water level rising fast near Chandrapur. Evacuation boat needed urgently.');
  const [translatedText, setTranslatedText] = useState('চান্দপুৰৰ ওচৰত ব্ৰহ্মপুত্ৰৰ পানীৰ স্তৰ দ্ৰুতগতিত বৃদ্ধি পাইছে। জৰুৰীভাৱে উচ্ছেদৰ নৌকাৰ প্ৰয়োজন।');

  // Image Analysis State
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80');
  const [imageAnalysis, setImageAnalysis] = useState<any | null>(null);

  // Speech State
  const [speechText, setSpeechText] = useState('');
  const [isListening, setIsListening] = useState(false);

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

    // Generate intelligent AI Response based on query keywords
    setTimeout(() => {
      let aiResponseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('camp') || lower.includes('shelter') || lower.includes('stay')) {
        const openCamps = camps.slice(0, 3).map(c => `${c.name} (${c.district}) - ${c.currentOccupancy}/${c.capacity} occupied`).join('\n• ');
        aiResponseText = `⛺ Verified open relief shelters near affected districts:\n• ${openCamps}\n\nYou can view live capacity and amenities on the Relief Camps tab.`;
      } else if (lower.includes('boat') || lower.includes('sos') || lower.includes('rescue') || lower.includes('evac')) {
        aiResponseText = `🚨 For immediate evacuation or NDRF motorized boat dispatch, click the red "SOS Emergency" button or call ASDMA 1070. AI has calculated high priority for stranded families.`;
      } else if (lower.includes('helpline') || lower.includes('phone') || lower.includes('number') || lower.includes('contact')) {
        aiResponseText = `📞 ASDMA & Axom Relief Network Helplines:\n• ASDMA State Control Room: 1070 / 1077\n• Axom Relief Emergency Dispatch: +91 361 2237011\n• NDRF 1st Bn Patgaon: +91 361 2840140\n• Medical Ambulance: 108`;
      } else if (lower.includes('river') || lower.includes('water') || lower.includes('level') || lower.includes('gauge')) {
        const gauges = telemetry.activeRiverGauges.map(g => `${g.station}: ${g.waterLevelMeter}m (${g.trend})`).join('\n• ');
        aiResponseText = `🌊 Live River Level Telemetry (CWC / ASDMA Stream):\n• ${gauges}\n\nBrahmaputra in Guwahati is currently flowing 0.44m above danger level.`;
      } else if (lower.includes('volunteer') || lower.includes('join') || lower.includes('swim')) {
        aiResponseText = `🦺 You can register in the Assam Volunteer Corps by selecting "Volunteer Portal" in the role switcher. We verify swimmers, doctors, boat operators, and drone pilots.`;
      } else {
        aiResponseText = `🤖 I have logged your query into the ASDMA disaster telemetry engine. If you are stranded or need urgent food/water, use the SOS button to pin your GPS location directly to NDRF commanders.`;
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
              <p className="text-[10px] sm:text-[11px] text-sky-700 font-bold">ASDMA & Axom Relief Intelligence</p>
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
            <Bot className="w-3.5 h-3.5" /> Copilot Chat
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
            <ImageIcon className="w-3.5 h-3.5" /> Vision
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
                { label: '📞 ASDMA Helplines', query: 'Show ASDMA & Axom Relief helpline numbers' },
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

        {/* TAB 2: TRANSLATE */}
        {activeTab === 'translate' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
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
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Instant Auto-Translation
            </button>

            {translatedText && (
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 space-y-1">
                <span className="text-[10px] text-sky-800 font-bold uppercase">AI Translation Result:</span>
                <p className="text-slate-900 font-bold leading-relaxed">{translatedText}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMAGE VISION ANALYSIS */}
        {activeTab === 'image' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label className="block text-slate-700 font-bold">Flood & Road Obstacle Photo:</label>
              <img src={imageUrl} alt="Analysis sample" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
            </div>

            <button
              onClick={handleAnalyzeImage}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
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
        <span>ResQ AI Engine connected to ASDMA.</span>
        <span className="text-emerald-600 font-bold">● Online</span>
      </div>
    </div>
  );
};
