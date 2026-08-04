import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, ShieldCheck, Phone, Mail, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, role, setRole, showToast } = useApp();

  const [authMethod, setAuthMethod] = useState<'otp' | 'email' | 'google'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const rolesList: { id: UserRole; title: string; desc: string; icon: string }[] = [
    { id: 'citizen', title: 'Citizen / Resident', desc: 'Submit SOS, view nearby shelters, track rescue status', icon: '👤' },
    { id: 'volunteer', title: 'Registered Volunteer', desc: 'Accept field tasks, share live location, swimmer/medical support', icon: '🦺' },
    { id: 'ngo', title: 'NGO / Relief Org', desc: 'Manage relief inventory, track item distribution, verify receipts', icon: '📦' },
    { id: 'rescue', title: 'NDRF / SDRF Rescue Commander', desc: 'Accept missions, assign boat/heli units, update triage status', icon: '🚁' },
    { id: 'admin', title: 'Govt / ASDMA Admin', desc: 'Statewide dashboard, AI duplicate detection, relief camp oversight', icon: '🏛️' }
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
    showToast(`📩 OTP code sent to ${phone}. Enter 1234 to verify.`);
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(false);
    showToast(`🔑 Switched session role to ${role.toUpperCase()}. Welcome!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">Portal Access & Role Switcher</h3>
              <p className="text-xs text-slate-400">Select your authorized responder role to proceed</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-200">
          {/* Role Selection */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">1. Select Persona Role:</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {rolesList.map(r => (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    role === r.id
                      ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{r.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{r.title}</h4>
                      <p className="text-[11px] text-slate-400">{r.desc}</p>
                    </div>
                  </div>
                  {role === r.id && <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Authentication Method Tabs */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">2. Authentication Credentials:</label>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${authMethod === 'otp' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${authMethod === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('google')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${authMethod === 'google' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Google SSO
              </button>
            </div>

            {authMethod === 'otp' && (
              <form onSubmit={!otpSent ? handleSendOtp : handleVerifyLogin} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 absolute left-3 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+91 98000 00000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-slate-400 mb-1">Enter 4-Digit OTP Code</label>
                    <input
                      type="text"
                      placeholder="1234"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold tracking-widest text-center text-base"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  {!otpSent ? 'Send Verification OTP' : 'Verify & Launch Dashboard'}
                </button>
              </form>
            )}

            {authMethod === 'email' && (
              <form onSubmit={handleVerifyLogin} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Government / Registered Email</label>
                  <input
                    type="email"
                    placeholder="responder@resq.gov.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Authenticate & Login
                </button>
              </form>
            )}

            {authMethod === 'google' && (
              <div className="space-y-3 text-center py-2">
                <p className="text-slate-400 text-xs">Sign in with authorized Google Workspace account:</p>
                <button
                  onClick={handleVerifyLogin}
                  className="w-full bg-white text-slate-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Sign in with Google One-Tap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
