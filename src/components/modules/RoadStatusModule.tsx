import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Navigation, Plus, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

export const RoadStatusModule: React.FC = () => {
  const { roadReports, reportRoadObstacle } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadName, setRoadName] = useState('');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);
  const [status, setStatus] = useState<any>('waterlogged');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportRoadObstacle({
      roadName,
      district,
      status,
      details,
      lat: 26.1500,
      lng: 91.7500
    });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-400 tracking-wider flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-purple-400" />
            STATE HIGHWAY & BRIDGE INFRASTRUCTURE MONITOR
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Road Obstacle & Submersion Tracker</h1>
          <p className="text-xs text-slate-400">Live reporting of flooded highways, fallen trees, bridge collapse, and landslide blockages.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Report Road Hazard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadReports.map(rd => (
          <div key={rd.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">{rd.district}</span>
                <h3 className="font-heading font-bold text-sm text-white mt-0.5">{rd.roadName}</h3>
              </div>
              <span className="bg-purple-950 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-800 uppercase">
                {rd.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">{rd.details}</p>

            <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-800">
              <span>Reported: {rd.reportedAt}</span>
              <span>By: {rd.reportedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 text-xs text-white">
            <h3 className="font-bold text-base">Report Road Obstacle / Hazard</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Road / Highway Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NH-37 near Khanapara"
                  value={roadName}
                  onChange={e => setRoadName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">District</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {ASSAM_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Obstacle Type</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="waterlogged">🌊 Waterlogged / Standing Water</option>
                  <option value="tree_fallen">🌳 Tree Fallen Hazard</option>
                  <option value="bridge_collapse">🌁 Bridge / Culvert Submerged</option>
                  <option value="landslide">⛰️ Landslide Mud Blockade</option>
                  <option value="boat_required">🚤 Motorboat Required Stretch</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Details & Passability</label>
                <textarea
                  rows={3}
                  placeholder="Describe water depth, vehicle restrictions..."
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded-xl font-bold"
                >
                  Log Obstacle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
