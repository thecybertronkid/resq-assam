import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NGOInventory } from '../../types';
import { 
  Package, 
  Droplet, 
  Pill, 
  ShieldCheck, 
  FileText, 
  Plus, 
  DollarSign, 
  ArrowUpRight,
  Upload
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { ngos, updateNgoStock, donations, showToast } = useApp();
  const selectedNgo = ngos[0];

  const [distributeItem, setDistributeItem] = useState<keyof NGOInventory['items']>('foodPacks');
  const [distributeQty, setDistributeQty] = useState(500);

  const handleLogDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNgo) return;
    const currentStock = selectedNgo.items[distributeItem];
    const newStock = Math.max(0, currentStock - distributeQty);
    updateNgoStock(selectedNgo.id, distributeItem, newStock);
    showToast(`📦 Logged distribution of ${distributeQty} units of ${distributeItem}. Updated stock: ${newStock}`);
  };

  if (!selectedNgo) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-purple-950/60 border border-purple-800/80 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-400 tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-purple-400" />
            NGO RELIEF SUPPLY INVENTORY & DONATION AUDIT
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">{selectedNgo.ngoName}</h1>
          <p className="text-xs text-purple-200">District: {selectedNgo.district} • Contact: {selectedNgo.contactPhone} • Last Sync: {selectedNgo.lastUpdated}</p>
        </div>

        <div className="bg-purple-900/40 p-3 rounded-2xl border border-purple-700/50 text-right">
          <span className="text-xs text-purple-300 font-semibold block">Total Distributions</span>
          <span className="text-2xl font-heading font-extrabold text-white">{selectedNgo.distributionCount.toLocaleString()} Packs</span>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Food Packets', count: selectedNgo.items.foodPacks, key: 'foodPacks', icon: '🍞', color: 'text-amber-400' },
          { label: 'Water (Litres)', count: selectedNgo.items.waterLitres, key: 'waterLitres', icon: '💧', color: 'text-blue-400' },
          { label: 'Medicine Kits', count: selectedNgo.items.medicines, key: 'medicines', icon: '💊', color: 'text-red-400' },
          { label: 'Blankets', count: selectedNgo.items.blankets, key: 'blankets', icon: '🛌', color: 'text-purple-400' },
          { label: 'Mosquito Nets', count: selectedNgo.items.mosquitoNets, key: 'mosquitoNets', icon: '🦟', color: 'text-emerald-400' },
          { label: 'Cattle Feed (Kg)', count: selectedNgo.items.animalFeedKg, key: 'animalFeedKg', icon: '🌾', color: 'text-yellow-400' }
        ].map(item => (
          <div key={item.key} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-2xl">{item.icon}</div>
            <div className={`text-xl font-heading font-extrabold ${item.color}`}>
              {item.count.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Log Distribution Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Log Field Distribution & Proof Upload
            </h2>

            <form onSubmit={handleLogDistribution} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Relief Item Category:</label>
                <select
                  value={distributeItem}
                  onChange={e => setDistributeItem(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="foodPacks">Food Packets</option>
                  <option value="waterLitres">Drinking Water (Litres)</option>
                  <option value="medicines">Essential Medicine Kits</option>
                  <option value="blankets">Blankets</option>
                  <option value="mosquitoNets">Mosquito Nets</option>
                  <option value="animalFeedKg">Cattle Feed (Kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Quantity Distributed:</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={distributeQty}
                  onChange={e => setDistributeQty(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Upload Photo Proof of Distribution:</label>
                <div className="border-2 border-dashed border-slate-800 bg-slate-950 p-6 rounded-2xl text-center space-y-2 cursor-pointer hover:border-purple-500">
                  <Upload className="w-6 h-6 text-purple-400 mx-auto" />
                  <span className="text-slate-300 font-semibold block">Drop Distribution Photo Here</span>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG up to 10MB</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-purple-600/30"
              >
                Log Distribution & Update Warehouse Stock
              </button>
            </form>
          </div>
        </div>

        {/* Transparent Donation Ledger */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Verified Financial & Item Donations</span>
            <span className="text-xs text-purple-400 font-bold">100% Audit Ready</span>
          </h2>

          <div className="space-y-3">
            {donations.map(don => (
              <div key={don.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{don.donorName}</h3>
                    <p className="text-xs text-slate-400">{don.timestamp} • Receipt: <strong className="text-purple-400">{don.receiptNo}</strong></p>
                  </div>
                  <div className="text-right">
                    {don.amount ? (
                      <span className="text-sm font-extrabold text-emerald-400">₹{don.amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-xs font-bold text-blue-400">{don.itemQuantity} ({don.itemType})</span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between">
                  <span>Method: {don.paymentMethod}</span>
                  <span>Target: {don.district}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
