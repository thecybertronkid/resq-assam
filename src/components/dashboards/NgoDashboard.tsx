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
      {/* Top Banner - Soft Purple/Pink Gradient */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-sky-100 border border-purple-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-800 tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-purple-600" />
            NGO RELIEF SUPPLY INVENTORY & DONATION AUDIT
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">{selectedNgo.ngoName}</h1>
          <p className="text-xs text-slate-600 font-medium">District: {selectedNgo.district} • Contact: {selectedNgo.contactPhone} • Last Sync: {selectedNgo.lastUpdated}</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-purple-200 shadow-sm text-right">
          <span className="text-xs text-purple-800 font-bold block">Total Distributions</span>
          <span className="text-2xl font-heading font-extrabold text-slate-900">{selectedNgo.distributionCount.toLocaleString()} Packs</span>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Food Packets', count: selectedNgo.items.foodPacks, key: 'foodPacks', icon: '🍞', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Water (Litres)', count: selectedNgo.items.waterLitres, key: 'waterLitres', icon: '💧', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
          { label: 'Medicine Kits', count: selectedNgo.items.medicines, key: 'medicines', icon: '💊', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
          { label: 'Blankets', count: selectedNgo.items.blankets, key: 'blankets', icon: '🛌', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
          { label: 'Mosquito Nets', count: selectedNgo.items.mosquitoNets, key: 'mosquitoNets', icon: '🦟', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Cattle Feed (Kg)', count: selectedNgo.items.animalFeedKg, key: 'animalFeedKg', icon: '🌾', color: 'text-yellow-800', bg: 'bg-yellow-50 border-yellow-200' }
        ].map(item => (
          <div key={item.key} className={`p-4 rounded-3xl border shadow-sm space-y-2 ${item.bg}`}>
            <div className="text-2xl">{item.icon}</div>
            <div className={`text-xl font-heading font-extrabold ${item.color}`}>
              {item.count.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-700 font-bold">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Log Distribution Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Log Field Distribution & Proof Upload
            </h2>

            <form onSubmit={handleLogDistribution} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Relief Item Category:</label>
                <select
                  value={distributeItem}
                  onChange={e => setDistributeItem(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
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
                <label className="block text-slate-700 mb-1 font-bold">Quantity Distributed:</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={distributeQty}
                  onChange={e => setDistributeQty(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-extrabold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Upload Photo Proof of Distribution:</label>
                <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 p-6 rounded-2xl text-center space-y-2 cursor-pointer hover:border-purple-400">
                  <Upload className="w-6 h-6 text-purple-600 mx-auto" />
                  <span className="text-slate-900 font-bold block">Drop Distribution Photo Here</span>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG up to 10MB</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl shadow-md shadow-purple-500/20 text-xs"
              >
                Log Distribution & Update Warehouse Stock
              </button>
            </form>
          </div>
        </div>

        {/* Transparent Donation Ledger */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Financial & Item Donations</span>
            <span className="text-xs text-purple-700 font-bold">100% Audit Ready</span>
          </h2>

          <div className="space-y-3">
            {donations.map(don => (
              <div key={don.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{don.donorName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{don.timestamp} • Receipt: <strong className="text-purple-700">{don.receiptNo}</strong></p>
                  </div>
                  <div className="text-right">
                    {don.amount ? (
                      <span className="text-sm font-extrabold text-emerald-700">₹{don.amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-xs font-bold text-sky-700">{don.itemQuantity} ({don.itemType})</span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 flex justify-between font-medium">
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
