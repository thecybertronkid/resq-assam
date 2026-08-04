import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, ShieldCheck, Phone, Mail, User, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, role, setRole, setActiveTab, showToast } = useApp();

  const [authMethod, setAuthMethod] = useState<'otp' | 'email' | 'google'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const rolesList: { id: UserRole; title: string; desc: string; icon: string; features: string[] }[] = [
    { 
      id: 'citizen', 
      title: 'Citizen / Resident', 
      desc: 'Submit SOS, view nearby shelters, track rescue status', 
      icon: '👤',
      features: ['SOS Emergency Pinning', 'Live Dispatch Stepper', 'Relief Camp Finder', 'Supply Requests']
    },
    { 
      id: 'volunteer', 
      title: 'Registered Volunteer', 
      desc: 'Accept field tasks, share live location, swimmer/medical support', 
      icon: '🦺',
      features: ['Skill Verification', 'Task Assignment Queue', 'Live GPS Telemetry', 'On-Duty Toggle']
    },
    { 
      id: 'ngo', 
      title: 'NGO / Relief Org', 
      desc: 'Manage relief inventory, track item distribution, verify receipts', 
      icon: '📦',
      features: ['Warehouse Stock Audit', 'Proof Photo Upload', '80G E-Receipts', 'Item Dispatch']
    },
    { 
      id: 'rescue', 
      title: 'NDRF / SDRF Rescue Commander', 
      desc: 'Accept missions, assign boat/heli units, update triage status', 
      icon: '🚁',
      features: ['Tactical Triage Queue', 'Boat/Heli Unit Dispatch', 'GPS Navigation', 'Rescue Logs']
    },
    { 
      id: 'admin', 
      title: 'Govt / ASDMA Admin', 
      desc: 'Statewide dashboard, AI duplicate detection, relief camp oversight', 
      icon: '🏛️',
      features: ['AI Duplicate Moderation', 'Volunteer Approvals', 'State CSV Exporter', 'District Inundation']
    }
  ];

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setActiveTab(selectedRole);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
    showToast(`📩 OTP code sent to ${phone}. Enter 1234 to verify.`);
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(false);
    setActiveTab(role);
    const activeRoleTitle = rolesList.find(r => r.id === role)?.title || role;
    showToast(`🔑 Switched session role to [${activeRoleTitle}]. Specialized features & dashboard loaded!`);
  };

  const activeRoleData = rolesList.find(r => r.id === role) || rolesList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-pink-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">Portal Access & Role Switcher</h3>
              <p className="text-xs text-pink-100 font-medium">Select your authorized responder persona to unlock dedicated features</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Role Selection */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">1. Select Persona Role:</label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {rolesList.map(r => {
                const isSelected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-pink-50 border-pink-400 text-pink-900 shadow-sm font-bold ring-2 ring-pink-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{r.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-pink-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dedicated Features Preview Box for Selected Role */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-extrabold uppercase text-pink-700 tracking-wider flex items-center gap-1.5">
              <span>{activeRoleData.icon}</span> Dedicated Features for {activeRoleData.title}:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {activeRoleData.features.map(feat => (
                <div key={feat} className="bg-white p-2 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Authentication Credentials */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">2. Authenticate & Launch Workspace:</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-3 font-bold">
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-1.5 rounded-lg text-xs ${authMethod === 'otp' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-600'}`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 rounded-lg text-xs ${authMethod === 'email' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-600'}`}
              >
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('google')}
                className={`flex-1 py-1.5 rounded-lg text-xs ${authMethod === 'google' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-600'}`}
              >
                Google SSO
              </button>
            </div>

            {authMethod === 'otp' && (
              <form onSubmit={!otpSent ? handleSendOtp : handleVerifyLogin} className="space-y-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Mobile Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 absolute left-3 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98000 00000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Enter 4-Digit OTP Code</label>
                    <input
                      type="text"
                      placeholder="1234"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold tracking-widest text-center text-base"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-2"
                >
                  <span>{!otpSent ? 'Send Verification OTP' : `Launch ${activeRoleData.title} Dashboard`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {authMethod === 'email' && (
              <form onSubmit={handleVerifyLogin} className="space-y-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Government / Registered Email</label>
                  <input
                    type="email"
                    placeholder="responder@resq.gov.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Authenticate & Launch {activeRoleData.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {authMethod === 'google' && (
              <div className="space-y-3 text-center py-2">
                <button
                  onClick={handleVerifyLogin}
                  className="w-full bg-slate-100 text-slate-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 border border-slate-200 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Sign in & Launch {activeRoleData.title}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
