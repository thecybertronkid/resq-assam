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
  Upload
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { ngos, updateNgoStock, donations, showToast } = useApp();

  // Fallback default NGO warehouse if empty
  const defaultNgo: NGOInventory = {
    id: 'NGO-DEFAULT',
    ngoName: 'ResQ Assam State Central Relief Warehouse',
    district: 'Sivasagar',
    contactPhone: '+91 361 2237011',
    items: {
      foodPacks: 12000,
      waterLitres: 45000,
      medicines: 1800,
      blankets: 6500,
      mosquitoNets: 3200,
      animalFeedKg: 4000
    },
    lastUpdated: new Date().toLocaleTimeString(),
    distributionCount: 42
  };

  const selectedNgo = ngos.length > 0 ? ngos[0] : defaultNgo;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-sky-100 border border-purple-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-800 tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-purple-600" />
            NGO RELIEF SUPPLY INVENTORY & DONATION AUDIT
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">{selectedNgo.ngoName}</h1>
          <p className="text-xs text-slate-600 font-medium">District: {selectedNgo.district} • Contact: {selectedNgo.contactPhone} • Last Sync: {selectedNgo.lastUpdated}</p>
        </div>

        <button
          onClick={() => showToast('📦 Verified NGO Warehouse Registration Portal Opened!')}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Register NGO Warehouse
        </button>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'foodPacks', label: 'Food Ration Packets', val: selectedNgo.items.foodPacks, icon: Package, color: 'text-amber-600' },
          { key: 'waterLitres', label: 'Drinking Water (L)', val: selectedNgo.items.waterLitres, icon: Droplet, color: 'text-sky-600' },
          { key: 'medicines', label: 'First Aid & Med Kits', val: selectedNgo.items.medicines, icon: Pill, color: 'text-rose-600' },
          { key: 'blankets', label: 'Woolen Blankets', val: selectedNgo.items.blankets, icon: ShieldCheck, color: 'text-purple-600' },
          { key: 'mosquitoNets', label: 'Mosquito Nets', val: selectedNgo.items.mosquitoNets, icon: FileText, color: 'text-emerald-600' },
          { key: 'animalFeedKg', label: 'Cattle Feed (Kg)', val: selectedNgo.items.animalFeedKg, icon: Plus, color: 'text-pink-600' }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <Icon className={`w-5 h-5 ${item.color}`} />
              <div className="text-xl font-heading font-extrabold text-slate-900">{item.val.toLocaleString()}</div>
              <div className="text-[11px] text-slate-500 font-bold">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Distribution Logger & Proof Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Log Relief Supply Dispatch & Distribution Proof
          </h3>

          <form onSubmit={handleLogDistribution} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Select Relief Item Category</label>
              <select
                value={distributeItem}
                onChange={e => setDistributeItem(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="foodPacks">Food Ration Packets</option>
                <option value="waterLitres">Drinking Water (Liters)</option>
                <option value="medicines">Medical & Anti-Snake Kits</option>
                <option value="blankets">Woolen Blankets</option>
                <option value="mosquitoNets">Mosquito Nets</option>
                <option value="animalFeedKg">Cattle Feed (Kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Quantity Dispatched</label>
              <input
                type="number"
                value={distributeQty}
                onChange={e => setDistributeQty(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl shadow-md text-xs"
            >
              Confirm Dispatch & Update Warehouse Balance →
            </button>
          </form>
        </div>

        {/* Live Verified Donation Ledger */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Verified Relief Donations Ledger
          </h3>

          {donations.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <p className="text-slate-600 font-bold text-xs">No donations recorded yet.</p>
              <p className="text-[11px] text-slate-400 font-medium">Donations submitted via the Relief Gateway will appear here dynamically.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {donations.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900">{d.donorName} ({d.district})</h4>
                    <p className="text-[10px] text-slate-500">Txn: {d.receiptNo} • {d.timestamp}</p>
                  </div>
                  <span className="text-emerald-700 font-extrabold text-sm bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    {d.amount ? `₹${d.amount.toLocaleString()}` : `${d.itemType} (${d.itemQuantity})`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
