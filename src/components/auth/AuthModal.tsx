import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, role, setRole, setActiveTab, showToast } = useApp();

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
      title: 'Govt / Admin', 
      desc: 'Statewide dashboard, AI duplicate detection, relief camp oversight', 
      icon: '🏛️',
      features: ['AI Duplicate Moderation', 'Volunteer Approvals', 'State CSV Exporter', 'District Inundation']
    }
  ];

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setActiveTab(selectedRole);
  };

  const handleLaunchWorkspace = () => {
    setIsAuthModalOpen(false);
    setActiveTab(role);
    const activeRoleTitle = rolesList.find(r => r.id === role)?.title || role;
    showToast(`⚡ Switched session persona to [${activeRoleTitle}]. Instant access granted!`);
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
              <h3 className="font-heading font-bold text-white text-base">State Disaster Persona Switcher</h3>
              <p className="text-xs text-pink-100 font-medium">No login required • Direct 1-click access to all emergency modules</p>
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
            <label className="block text-slate-700 font-bold mb-2">Select Active Disaster Response Role:</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
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

          {/* Dedicated Features Preview Box */}
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

          {/* Direct Launch Button */}
          <button
            type="button"
            onClick={handleLaunchWorkspace}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Switch to {activeRoleData.title} Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
