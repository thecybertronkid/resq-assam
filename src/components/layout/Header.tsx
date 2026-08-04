import React, { useState } from 'react';
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
  BarChart3,
  ChevronDown,
  Wifi
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
    isOnline,
    telemetry
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badgeColor: string }> = {
    citizen: { title: 'Citizen Mode', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
    volunteer: { title: 'Volunteer Portal', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ngo: { title: 'NGO Hub', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
    rescue: { title: 'Rescue Command', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
    admin: { title: 'Govt Admin', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' }
  };

  // Ultra-clean 4 Primary Nav Tabs
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: ShieldAlert },
    { id: 'map', label: 'Live Map', icon: Map },
    { 
      id: role === 'citizen' ? 'citizen' : role === 'rescue' ? 'rescue' : role === 'volunteer' ? 'volunteer' : role === 'ngo' ? 'ngo' : 'admin', 
      label: 'Dashboard', 
      icon: UserCheck 
    },
    { id: 'camps', label: 'Relief Camps', icon: Tent }
  ];

  // Secondary Navigation Dropdown Items
  const secondaryNavItems = [
    { id: 'donations', label: 'Donate Relief', icon: Heart },
    { id: 'public', label: 'State Analytics', icon: BarChart3 },
    { id: 'missing', label: 'Missing Persons', icon: UserSearch },
    { id: 'roads', label: 'Road Status', icon: Navigation },
    { id: 'medical', label: 'Hospitals & ICUs', icon: Hospital },
    { id: 'alerts', label: 'Disaster Alerts', icon: Bell }
  ];

  const isSecondaryActive = secondaryNavItems.some(item => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Telemetry Alert Ticker Bar with Live Sync Badge */}
      <div className="bg-rose-50 text-rose-900 text-xs h-8 px-4 flex items-center justify-between overflow-hidden border-b border-rose-200/80">
        <div className="flex items-center gap-2 font-bold text-rose-700 shrink-0 mr-4 z-10 bg-rose-50 pr-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="tracking-wide uppercase text-[11px]">ASDMA & AXOM RELIEF SYNC:</span>
        </div>

        {/* Ticker Text */}
        <div className="animate-ticker-smooth text-rose-900 flex gap-8 font-medium text-[11px] whitespace-nowrap">
          {telemetry.activeRiverGauges.map(g => (
            <span key={g.station} className="font-bold">
              🌊 {g.station}: {g.waterLevelMeter}m (Danger: {g.dangerLevelMeter}m) — <span className="text-rose-600 uppercase font-extrabold">{g.trend}</span>
            </span>
          ))}
          <span>Axom Relief Helpline: +91 361 2237011 | ASDMA State Control: 1070 / 1077 | 108 Ambulance</span>
        </div>

        {/* Live Sync Badge moved into top bar to eliminate header clutter */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-extrabold shrink-0 border border-emerald-200 ml-3 z-10">
          <Wifi className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>Synced {telemetry.lastSyncedAt}</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-sky-400 p-0.5 shadow-xs group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-base tracking-tight text-slate-900">
                ResQ <span className="text-rose-500">Assam</span>
              </span>
              <span className="bg-rose-50 text-rose-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200 uppercase">
                ASDMA
              </span>
            </div>
          </div>

          {/* Clean 4-Tab Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMoreDropdownOpen(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* "More Modules" Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all duration-200 ${
                  isSecondaryActive || moreDropdownOpen
                    ? 'bg-pink-50 text-pink-700 border border-pink-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-pink-600' : 'text-slate-400'}`} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 min-w-[180px] animate-fade-in"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {secondaryNavItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMoreDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                          isActive ? 'bg-pink-50 text-pink-700 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-pink-600'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-pink-600' : 'text-slate-400'}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* AI Copilot Drawer Trigger */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden xl:inline">AI Copilot</span>
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="p-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase font-bold">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[120px]">
                <button onClick={() => setLanguage('en')} className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600">English</button>
                <button onClick={() => setLanguage('as')} className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600">অসমীয়া (Assamese)</button>
                <button onClick={() => setLanguage('hi')} className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600">हिंदी (Hindi)</button>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold border items-center gap-1.5 transition-all ${roleLabels[role].badgeColor}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{roleLabels[role].title}</span>
            </button>

            {/* Emergency SOS Trigger Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 border border-rose-300 animate-sos-pulse transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS EMERGENCY</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Active Role:</span>
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${roleLabels[role].badgeColor}`}
            >
              {roleLabels[role].title} (Switch)
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[...primaryNavItems, ...secondaryNavItems].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-left transition-colors ${
                    isActive ? 'bg-pink-50 text-pink-700 border border-pink-200 font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
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
