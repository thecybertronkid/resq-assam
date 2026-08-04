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
  Wifi,
  Package,
  Radio,
  Building
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
    telemetry,
    showToast
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Dynamic Role Configs
  const roleConfigs: Record<UserRole, { 
    title: string; 
    dashLabel: string;
    dashTab: string;
    badgeColor: string; 
    ctaLabel: string;
    ctaIcon: any;
    ctaAction: () => void;
  }> = {
    citizen: { 
      title: 'Citizen Mode', 
      dashLabel: 'My Dispatches',
      dashTab: 'citizen',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      ctaLabel: 'SOS EMERGENCY',
      ctaIcon: PhoneCall,
      ctaAction: () => setIsSosModalOpen(true)
    },
    volunteer: { 
      title: 'Volunteer Portal', 
      dashLabel: 'Volunteer Corps',
      dashTab: 'volunteer',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      ctaLabel: 'RADIO CHECK-IN',
      ctaIcon: Radio,
      ctaAction: () => { setActiveTab('volunteer'); showToast('🦺 Volunteer GPS & Telemetry Check-In Broadcast Sent!'); }
    },
    ngo: { 
      title: 'NGO Hub', 
      dashLabel: 'Relief Inventory',
      dashTab: 'ngo',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      ctaLabel: 'DISPATCH SUPPLIES',
      ctaIcon: Package,
      ctaAction: () => { setActiveTab('ngo'); showToast('📦 NGO Relief Supply Warehouse Form Opened!'); }
    },
    rescue: { 
      title: 'Rescue Command', 
      dashLabel: 'Tactical Triage',
      dashTab: 'rescue',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      ctaLabel: 'DEPLOY BOAT UNIT',
      ctaIcon: ShieldAlert,
      ctaAction: () => { setActiveTab('rescue'); showToast('🚁 Tactical Rescue Command Queue Opened!'); }
    },
    admin: { 
      title: 'Govt Admin', 
      dashLabel: 'ASDMA War Room',
      dashTab: 'admin',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      ctaLabel: 'STATEWIDE ALERT',
      ctaIcon: Building,
      ctaAction: () => { setActiveTab('admin'); showToast('🏛️ ASDMA Statewide Emergency Broadcast Panel Loaded!'); }
    }
  };

  const currentRoleCfg = roleConfigs[role];

  // Dynamic Nav Items tailored to active role
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: ShieldAlert },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: currentRoleCfg.dashTab, label: currentRoleCfg.dashLabel, icon: UserCheck },
    { id: 'camps', label: 'Relief Camps', icon: Tent }
  ];

  const secondaryNavItems = [
    { id: 'donations', label: 'Donate Relief', icon: Heart },
    { id: 'public', label: 'State Analytics', icon: BarChart3 },
    { id: 'missing', label: 'Missing Persons', icon: UserSearch },
    { id: 'roads', label: 'Road Status', icon: Navigation },
    { id: 'medical', label: 'Hospitals & ICUs', icon: Hospital },
    { id: 'alerts', label: 'Disaster Alerts', icon: Bell }
  ];

  const isSecondaryActive = secondaryNavItems.some(item => item.id === activeTab);
  const CtaIcon = currentRoleCfg.ctaIcon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Telemetry Alert Ticker Bar */}
      <div className="bg-rose-50 text-rose-900 text-xs h-7 sm:h-8 px-2 sm:px-4 flex items-center justify-between overflow-hidden border-b border-rose-200/80">
        <div className="flex items-center gap-1.5 font-bold text-rose-700 shrink-0 mr-2 sm:mr-4 z-10 bg-rose-50 pr-1 text-[10px] sm:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="tracking-wide uppercase font-extrabold">ASDMA SYNC:</span>
        </div>

        {/* Scrolling Ticker */}
        <div className="animate-ticker-smooth text-rose-900 flex gap-6 font-medium text-[10px] sm:text-[11px] whitespace-nowrap">
          {telemetry.activeRiverGauges.map(g => (
            <span key={g.station} className="font-bold">
              🌊 {g.station}: {g.waterLevelMeter}m — <span className="text-rose-600 uppercase font-extrabold">{g.trend}</span>
            </span>
          ))}
          <span>Axom Relief Helpline: +91 361 2237011 | ASDMA State: 1070 / 1077</span>
        </div>

        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-extrabold shrink-0 border border-emerald-200 ml-2 z-10">
          <Wifi className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>Synced {telemetry.lastSyncedAt}</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-sky-400 p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-500" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                ResQ <span className="text-rose-500">Assam</span>
              </span>
              <span className="bg-rose-50 text-rose-700 text-[8px] sm:text-[9px] font-extrabold px-1 py-0.5 rounded border border-rose-200 uppercase">
                ASDMA
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMoreDropdownOpen(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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

            {/* "More Modules" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isSecondaryActive || moreDropdownOpen
                    ? 'bg-pink-50 text-pink-700 border border-pink-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180 text-pink-600' : 'text-slate-400'}`} />
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* AI Copilot Trigger */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title="AI Emergency Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden xl:inline">AI Copilot</span>
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="p-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase font-bold text-[11px] sm:text-xs">{language}</span>
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
              className={`hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-bold border items-center gap-1.5 transition-all ${currentRoleCfg.badgeColor}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{currentRoleCfg.title}</span>
            </button>

            {/* Dynamic Role Action Button */}
            <button
              onClick={currentRoleCfg.ctaAction}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 border border-rose-300 animate-sos-pulse transition-all"
            >
              <CtaIcon className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">{currentRoleCfg.ctaLabel}</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Touch Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* Active Role Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Persona:</span>
              <span className="text-xs font-extrabold text-slate-900">{currentRoleCfg.title}</span>
            </div>
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${currentRoleCfg.badgeColor}`}
            >
              Switch Role
            </button>
          </div>

          {/* Primary Mobile Touch Grid */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Main Navigation:</span>
            <div className="grid grid-cols-2 gap-2">
              {primaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left transition-all ${
                      isActive ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialized Modules Grid */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Specialized Disaster Modules:</span>
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all ${
                      isActive ? 'bg-pink-50 text-pink-700 border border-pink-300 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-pink-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
