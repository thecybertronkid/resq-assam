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
  PhoneCall,
  BarChart3
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
    citizen: { title: 'Citizen Mode', badgeColor: 'bg-sky-100 text-sky-700 border-sky-300' },
    volunteer: { title: 'Volunteer Portal', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    ngo: { title: 'NGO Relief Hub', badgeColor: 'bg-purple-100 text-purple-700 border-purple-300' },
    rescue: { title: 'Rescue Command', badgeColor: 'bg-rose-100 text-rose-700 border-rose-300' },
    admin: { title: 'Govt Admin', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' }
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
    { id: 'donations', label: 'Donate', icon: Heart },
    { id: 'public', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100/80 shadow-sm">
      {/* Real-time Soft Pink Ticker Bar */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 text-rose-900 text-xs py-1.5 px-4 flex items-center overflow-hidden border-b border-pink-200">
        <div className="flex items-center gap-2 font-bold text-rose-700 shrink-0 mr-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
          </span>
          STATE DISASTER BULLETIN:
        </div>
        <div className="animate-ticker text-rose-900 flex gap-8 font-medium">
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-sky-400 p-0.5 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-emerald-600 to-sky-600">
                  ResQ <span className="text-rose-500">Assam</span>
                </span>
                <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-pink-200 uppercase">
                  ASDMA Sync
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-pink-100/80 text-pink-700 border border-pink-300 shadow-sm' 
                      : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50'
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
              className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Open AI Disaster Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 min-w-[120px]">
                <button onClick={() => setLanguage('en')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600">English</button>
                <button onClick={() => setLanguage('as')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600">অসমীয়া (Assamese)</button>
                <button onClick={() => setLanguage('hi')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600">हिंदी (Hindi)</button>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${roleLabels[role].badgeColor}`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{roleLabels[role].title}</span>
              </button>
            </div>

            {/* Emergency SOS Trigger Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-pink-500/25 border border-rose-300 animate-sos-pulse"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>SOS EMERGENCY</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-pink-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-pink-100 px-4 pt-2 pb-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500">Current Role:</span>
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className={`px-2 py-1 rounded text-xs font-semibold border ${roleLabels[role].badgeColor}`}
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
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-left ${
                    activeTab === item.id ? 'bg-pink-100 text-pink-700 border border-pink-300' : 'text-slate-700 hover:bg-slate-100'
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
