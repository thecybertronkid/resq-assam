import React, { useState, useEffect } from 'react';
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
  Menu, 
  X,
  PhoneCall,
  BarChart3,
  ChevronDown,
  Wifi,
  Package,
  Radio,
  Building,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    authenticatedRole,
    logoutRole,
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
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      title: 'Rescue Commanders', 
      dashLabel: 'Tactical Triage',
      dashTab: 'rescue',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      ctaLabel: 'DEPLOY BOAT UNIT',
      ctaIcon: ShieldAlert,
      ctaAction: () => { setActiveTab('rescue'); showToast('🚁 Tactical Rescue Command Queue Opened!'); }
    },
    admin: { 
      title: 'Admin War Room', 
      dashLabel: 'Admin Command Center',
      dashTab: 'admin',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      ctaLabel: 'STATEWIDE ALERT',
      ctaIcon: Building,
      ctaAction: () => { setActiveTab('admin'); showToast('🏛️ Statewide Emergency Broadcast Panel Loaded!'); }
    }
  };

  const currentRoleCfg = roleConfigs[role];

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
  const unreadAlerts = alerts.filter(a => a.severity === 'critical').length;

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-slate-200/60 border-b border-slate-200/90' 
        : 'bg-white/95 backdrop-blur-lg border-b border-slate-200/70'
    }`}>
      {/* Top Telemetry Alert Ticker Bar */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white text-xs h-7 sm:h-8 px-2 sm:px-4 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-1.5 font-extrabold text-rose-100 shrink-0 mr-2 sm:mr-4 z-10 bg-transparent pr-1 text-[10px] sm:text-xs uppercase tracking-wide">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>DISASTER LIVE:</span>
        </div>

        <div className="overflow-hidden flex-1">
          <div className="animate-ticker-smooth text-white/90 flex gap-8 font-medium text-[10px] sm:text-[11px] whitespace-nowrap">
            {telemetry.activeRiverGauges.map(g => (
              <span key={g.station} className="font-semibold">
                🌊 {g.station}: <strong>{g.waterLevelMeter}m</strong> — <span className="font-extrabold uppercase">{g.trend}</span>
              </span>
            ))}
            <span className="font-medium">📞 State Disaster Helpline: 1070 / 1077 &nbsp;|&nbsp; NDRF Patgaon: 0361-2840284 &nbsp;|&nbsp; Ambulance: 108</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-extrabold shrink-0 border border-white/20 ml-2 z-10">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>{telemetry.lastSyncedAt}</span>
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
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-sky-400 p-0.5 shadow-md shadow-pink-500/20 group-hover:scale-105 group-hover:shadow-pink-500/30 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                ResQ <span className="text-rose-500">Assam</span>
              </span>
              <span className="bg-rose-50 text-rose-700 text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-rose-200 uppercase tracking-wider">
                ASSAM
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMoreDropdownOpen(false); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* "More Modules" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all duration-200 ${
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
                  className="absolute right-0 top-full mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50 min-w-[200px] animate-fade-in"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {secondaryNavItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMoreDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                          isActive ? 'bg-pink-50 text-pink-700 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-pink-600'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-pink-500' : 'text-slate-400'}`} />
                        {item.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-pink-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* AI Copilot Trigger — hidden on mobile header, available in mobile drawer */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="hidden sm:flex p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold items-center gap-1.5 transition-all shadow-2xs hover:shadow-sky-200/50 hover:scale-[1.03]"
              title="AI Emergency Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden xl:inline">AI Copilot</span>
            </button>

            {/* Alerts Bell */}
            <button
              onClick={() => setActiveTab('alerts')}
              className="relative p-1.5 sm:p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all hover:scale-[1.03]"
              title="Disaster Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Language Switcher — hidden on mobile header, available in mobile drawer */}
            <div className="relative group hidden sm:block">
              <button className="p-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase font-bold text-[11px] sm:text-xs">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block bg-white border border-slate-200/80 rounded-xl shadow-xl shadow-slate-200/50 py-1 z-50 min-w-[150px] animate-fade-in">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'as', label: 'অসমীয়া (Assamese)' },
                  { code: 'hi', label: 'हिंदी (Hindi)' }
                ].map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)} 
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-pink-50 hover:text-pink-600 transition-colors ${language === lang.code ? 'text-pink-600 font-bold bg-pink-50/60' : 'text-slate-700'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Switcher & Auth Pill */}
            {authenticatedRole !== 'citizen' ? (
              <button
                onClick={() => setShowLogoutConfirmModal(true)}
                className="hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-extrabold border bg-rose-50 text-rose-800 border-rose-300 items-center gap-1.5 transition-all hover:bg-rose-100 shadow-2xs"
                title="Log Out Session & Return to Citizen Mode"
              >
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">{currentRoleCfg.title} (Logout)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-bold border items-center gap-1.5 transition-all hover:scale-[1.03] ${currentRoleCfg.badgeColor}`}
                title="Authenticate Password-Protected Role Access"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{currentRoleCfg.title}</span>
              </button>
            )}

            {/* Dynamic Role Action CTA Button */}
            <button
              onClick={currentRoleCfg.ctaAction}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-2 sm:px-3.5 py-1.5 rounded-xl text-[10px] sm:text-xs flex items-center gap-1 shadow-md shadow-pink-500/25 border border-rose-300/50 animate-sos-pulse transition-all shrink-0"
            >
              <CtaIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{currentRoleCfg.ctaLabel}</span>
              <span className="inline sm:hidden font-extrabold uppercase text-[10px]">SOS</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen 
                ? <X className="w-5 h-5" /> 
                : <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer — full-screen slide-down */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto shadow-xl">
          
          {/* Active Role Banner with Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/80 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${currentRoleCfg.badgeColor}`}>
                {currentRoleCfg.title}
              </div>
            </div>
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="text-xs font-bold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              Switch Persona
            </button>
          </div>

          {/* SOS Action Button */}
          <button
            onClick={() => { setIsSosModalOpen(true); setMobileMenuOpen(false); }}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md shadow-pink-500/20 animate-sos-pulse"
          >
            <PhoneCall className="w-5 h-5" />
            REPORT EMERGENCY SOS
          </button>

          {/* Primary Navigation Grid */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Main Navigation</span>
            <div className="grid grid-cols-2 gap-2">
              {primaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`touch-tile p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left transition-all ${
                      isActive ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Modules Grid */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Disaster Modules</span>
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`touch-tile p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all ${
                      isActive 
                        ? 'bg-pink-50 text-pink-700 border border-pink-300 font-bold' 
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-pink-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Switcher Row */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Language</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'as', label: 'অসমীয়া' },
                { code: 'hi', label: 'हिंदी' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`touch-tile py-2 rounded-xl text-xs font-bold border transition-all ${
                    language === lang.code 
                      ? 'bg-pink-50 text-pink-700 border-pink-300' 
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Copilot Button */}
          <button
            onClick={() => { setIsAiDrawerOpen(true); setMobileMenuOpen(false); }}
            className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 font-extrabold border border-sky-200 py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            Open ResQ AI Emergency Copilot
          </button>
        </div>
      )}
    </header>

    {/* LOGOUT CONFIRMATION MODAL - Viewport Centered */}
    {showLogoutConfirmModal && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md min-h-screen overflow-y-auto">
        <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900 animate-in fade-in zoom-in-95 my-auto">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-bold text-lg">
                🔒
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base">Confirm Session Logout</h3>
                <p className="text-[11px] text-slate-500 font-medium">Switch session back to Public Citizen Mode</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirmModal(false)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-700 font-medium leading-relaxed bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200">
            Are you sure you want to log out of your <strong>{currentRoleCfg.title}</strong> session? You will lose active session controls and return to Public Citizen Mode.
          </p>

          <div className="flex gap-2.5 pt-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setShowLogoutConfirmModal(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                logoutRole();
                setShowLogoutConfirmModal(false);
              }}
              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm Logout</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};
