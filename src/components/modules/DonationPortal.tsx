import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSAM_DISTRICTS } from '../../utils/mockData';
import { Heart, CreditCard, Package, CheckCircle, Download, Sparkles, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DonationPortal: React.FC = () => {
  const { makeDonation, donations } = useApp();

  const [donorType, setDonorType] = useState<'money' | 'goods'>('money');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [itemType, setItemType] = useState('Water Purifier Kits');
  const [itemQuantity, setItemQuantity] = useState('100 Units');
  const [district, setDistrict] = useState(ASSAM_DISTRICTS[0]);

  const [receiptData, setReceiptData] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !phone) return;

    const donPayload = {
      donorName,
      email,
      phone,
      amount: donorType === 'money' ? amount : undefined,
      itemType: donorType === 'goods' ? itemType : undefined,
      itemQuantity: donorType === 'goods' ? itemQuantity : undefined,
      district,
      paymentMethod: donorType === 'money' ? 'UPI / NetBanking' : 'In-Kind Logistics Drop'
    };

    makeDonation(donPayload);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setReceiptData({
      receiptNo: `RSQ-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      donorName,
      amount: donorType === 'money' ? amount : undefined,
      itemType: donorType === 'goods' ? itemType : undefined,
      itemQuantity: donorType === 'goods' ? itemQuantity : undefined,
      district,
      timestamp: new Date().toLocaleString()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-purple-950/60 border border-purple-800/80 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-purple-400 tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
            100% TAX-EXEMPT AUDITED RELIEF FUND & GOODS DONATION PORTAL
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white">Support Assam Disaster Relief Operations</h1>
          <p className="text-xs text-purple-200">Directly fund rescue motorboats, dry ration kits, water purifiers, and animal fodder.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Donation Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setDonorType('money')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold ${donorType === 'money' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                💳 Monetary Donation (80G Tax Exempt)
              </button>
              <button
                type="button"
                onClick={() => setDonorType('goods')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold ${donorType === 'goods' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                📦 Physical Goods Donation
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Donor Name / Org *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 XXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {donorType === 'money' ? (
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Select Relief Contribution Amount:</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[1000, 2500, 5000, 10000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`py-2 rounded-xl border font-bold ${amount === val ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-300 border-slate-800'}`}
                      >
                        ₹{val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Item Type</label>
                    <select
                      value={itemType}
                      onChange={e => setItemType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option>Water Purifier Kits</option>
                      <option>Dry Food Packets</option>
                      <option>Mosquito Nets & Blankets</option>
                      <option>Essential Medicines & First Aid</option>
                      <option>Rescue Inflatable Motorboats</option>
                      <option>Cattle Feed & Animal Fodder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Quantity</label>
                    <input
                      type="text"
                      placeholder="e.g. 250 Units"
                      value={itemQuantity}
                      onChange={e => setItemQuantity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target District Allocation:</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Statewide">Statewide Priority Allocation (ASDMA Recommended)</option>
                  {ASSAM_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-purple-600/30 text-sm flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                Complete Donation & Generate Receipt
              </button>
            </form>
          </div>
        </div>

        {/* Receipt / Transparent Impact Stream */}
        <div className="lg:col-span-5 space-y-6">
          {receiptData ? (
            <div className="bg-slate-900 p-6 rounded-3xl border border-purple-500 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> OFFICIAL E-RECEIPT GENERATED
                </span>
                <span className="text-xs text-purple-400 font-bold">{receiptData.receiptNo}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>Donor: <strong className="text-white">{receiptData.donorName}</strong></p>
                <p>Target Allocation: <strong className="text-white">{receiptData.district}</strong></p>
                {receiptData.amount ? (
                  <p className="text-lg font-bold text-emerald-400">Total Contribution: ₹{receiptData.amount.toLocaleString()}</p>
                ) : (
                  <p className="text-sm font-bold text-purple-400">Goods Contributed: {receiptData.itemQuantity} ({receiptData.itemType})</p>
                )}
                <p className="text-[11px] text-slate-500">Date: {receiptData.timestamp} • 80G Tax Exempt Certificate attached.</p>
              </div>

              <button
                onClick={() => {
                  const receiptText = `======================================================\nRESQ ASSAM — OFFICIAL DISASTER RELIEF E-RECEIPT\n======================================================\nReceipt No: ${receiptData.receiptNo}\nDonor: ${receiptData.donorName}\nTarget District: ${receiptData.district}\nContribution: ${receiptData.amount ? 'INR ' + receiptData.amount.toLocaleString() : receiptData.itemQuantity + ' (' + receiptData.itemType + ')'}\nDate: ${receiptData.timestamp}\nStatus: VERIFIED & AUDITED (Section 80G Tax Exempt)\nIssued By: Assam State Disaster Management Authority (ASDMA)\n======================================================`;
                  const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `Receipt_${receiptData.receiptNo}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Official Receipt (.txt/.pdf)
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-white font-bold text-sm">Transparent Impact Guarantee</h3>
              <p className="text-xs text-slate-400">
                100% of contributed funds and goods are mapped to active relief camps and NDRF motorboat units with downloadable receipts.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
