import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Lock, Key, User, Info, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, role, authenticateRole, setActiveTab, showToast } = useApp();

  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>(role || 'citizen');
  const [password, setPassword] = useState('');
  const [volunteerUserId, setVolunteerUserId] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const rolesList: { id: UserRole; title: string; desc: string; icon: string; requiresPass: boolean; demoHint: string }[] = [
    { 
      id: 'citizen', 
      title: 'Citizen / Resident', 
      desc: 'Submit SOS, view nearby shelters, track rescue status, register as volunteer', 
      icon: '👤',
      requiresPass: false,
      demoHint: 'Publicly Accessible • No password required'
    },
    { 
      id: 'volunteer', 
      title: 'Registered Volunteer', 
      desc: 'Access private volunteer portal, accept field tasks, update live GPS telemetry', 
      icon: '🦺',
      requiresPass: true,
      demoHint: 'Enter your Volunteer ID & Password'
    },
    { 
      id: 'ngo', 
      title: 'NGO / Relief Org', 
      desc: 'Manage relief inventory, track item distribution, generate 80G e-receipts', 
      icon: '📦',
      requiresPass: true,
      demoHint: 'Enter Authorized NGO Passcode'
    },
    { 
      id: 'rescue', 
      title: 'Rescue Commanders', 
      desc: 'Monitor all roles, accept tactical missions, assign boat/heli units', 
      icon: '🚁',
      requiresPass: true,
      demoHint: 'Enter Authorized Rescue Passcode'
    },
    { 
      id: 'admin', 
      title: 'Admin War Room', 
      desc: 'Statewide command, AI duplicate moderation, volunteer approvals, CSV exports', 
      icon: '🏛️',
      requiresPass: true,
      demoHint: 'Enter Master Admin Passcode'
    }
  ];

  const activeRoleData = rolesList.find(r => r.id === selectedTargetRole) || rolesList[0];

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (selectedTargetRole === 'citizen') {
      authenticateRole('citizen');
      setIsAuthModalOpen(false);
      setActiveTab('citizen');
      return;
    }

    const success = authenticateRole(selectedTargetRole, password, volunteerUserId);
    if (success) {
      setIsAuthModalOpen(false);
      setActiveTab(selectedTargetRole);
      setPassword('');
      setVolunteerUserId('');
    } else {
      setAuthError('Authentication failed. Check credentials and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md min-h-screen overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 my-auto">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-white text-base">Role Authorization & Security Gate</h3>
              <p className="text-xs text-slate-400 font-medium">Password Protected Portal Access Control</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAuthenticate} className="p-6 space-y-5 text-xs text-slate-700">
          {/* Role Selection */}
          <div>
            <label className="block text-slate-900 font-extrabold mb-2">Select Target Response Role:</label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {rolesList.map(r => {
                const isSelected = selectedTargetRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => { setSelectedTargetRole(r.id); setAuthError(null); }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs font-bold ring-2 ring-emerald-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                          {r.requiresPass ? (
                            <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-amber-300 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5 text-amber-700" /> Protected
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-300">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{r.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credentials Form Section */}
          {activeRoleData.requiresPass ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-slate-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-emerald-600" />
                  Security Authorization Required for {activeRoleData.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{activeRoleData.demoHint}</span>
              </div>

              {selectedTargetRole === 'volunteer' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Volunteer User ID or Email *</label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 absolute left-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. vol_biren or biren.gogoi@resq.org"
                        value={volunteerUserId}
                        onChange={e => setVolunteerUserId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Password *</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Enter your volunteer password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Role Access Passcode *</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder={`Enter passcode for ${activeRoleData.title}`}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200 text-emerald-950 font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Public Citizen Mode and Volunteer Registration Form are open to all without password.</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Access {activeRoleData.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {selectedTargetRole === 'volunteer' && (
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setActiveTab('volunteer');
                  showToast('🦺 Volunteer Registration Form opened. Sign up and create your credentials!');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs"
              >
                Not registered yet? Click here to fill Volunteer Application Form
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
