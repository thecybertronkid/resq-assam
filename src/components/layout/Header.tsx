import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Map, 
  UserCheck, 
  Heart, 
  Tent, 
  UserSearch, 
  Navigation, 
  Hospital, 
  Bell, 
  Sparkles, 
  Globe, 
  LogIn, 
  Menu, 
  X,
  PhoneCall
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    activeTab, 
    setActiveTab, 
    setIsSosModalOpen, 
    setIsAuthModalOpen,
    setIsAiDrawerOpen,
    alerts,
    isOnline
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const latestAlert = alerts[0];

  const roleLabels: Record<UserRole, { title: string; badgeColor: string }> = {
    citizen: { title: 'Citizen Mode', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    volunteer: { title: 'Volunteer Portal', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    ngo: { title: 'NGO Relief Hub', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    rescue: { title: 'Rescue Command', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    admin: { title: 'Govt Admin', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: ShieldAlert },
    { id: 'map', label: 'Live Incident Map', icon: Map },
    { 
      id: role === 'citizen' ? 'citizen' : role === 'rescue' ? 'rescue' : role === 'volunteer' ? 'volunteer' : role === 'ngo' ? 'ngo' : 'admin', 
      label: 'My Dashboard', 
      icon: UserCheck 
    },
    { id: 'camps', label: 'Relief Camps', icon: Tent },
    { id: 'missing', label: 'Missing Persons', icon: UserSearch },
    { id: 'roads', label: 'Road Status', icon: Navigation },
    { id: 'medical', label: 'Hospitals', icon: Hospital },
    { id: 'alerts', label: 'Disaster Alerts', icon: Bell },
    { id: 'donations', label: 'Donate', icon: Heart }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
      {/* Real-time Ticker Bar */}
      <div className="bg-red-950/90 text-red-200 text-xs py-1.5 px-4 flex items-center overflow-hidden border-b border-red-900/50">
        <div className="flex items-center gap-2 font-semibold text-red-400 shrink-0 mr-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          STATE DISASTER BULLETIN:
        </div>
        <div className="animate-ticker text-red-100 flex gap-8 font-medium">
          <span>{latestAlert ? `${latestAlert.title} — ${latestAlert.riverLevel || latestAlert.description}` : 'Brahmaputra flowing 0.5m above danger level in Guwahati.'}</span>
          <span>SDRF & 1st Bn NDRF deployed in 14 affected districts. Emergency Control Room Helpline: 1070 / 1077.</span>
          <span>{!isOnline && '⚠️ OFFLINE MODE ACTIVE: SOS reports will be stored locally and auto-dispatched upon network restore.'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  ResQ <span className="text-red-500">Assam</span>
                </span>
                <span className="bg-red-950/80 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-800/50 uppercase">
                  ASDMA Sync
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Unified Emergency & Rescue Network
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* AI Copilot Drawer Trigger */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Open AI Disaster Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 min-w-[100px]">
                <button onClick={() => setLanguage('en')} className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800">English</button>
                <button onClick={() => setLanguage('as')} className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800">অসমীয়া (Assamese)</button>
                <button onClick={() => setLanguage('hi')} className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800">हिंदी (Hindi)</button>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${roleLabels[role].badgeColor}`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{roleLabels[role].title}</span>
              </button>
            </div>

            {/* Emergency SOS Trigger Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/40 border border-red-500/50 animate-sos-pulse"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>SOS EMERGENCY</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Current Role:</span>
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className={`px-2 py-1 rounded text-xs font-medium border ${roleLabels[role].badgeColor}`}
            >
              {roleLabels[role].title} (Switch)
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center gap-2 text-left ${
                    activeTab === item.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
