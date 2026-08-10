"use client";

import { useState, useEffect } from "react";
import { createClient } from "@alif/database/client";
import { Plus, Loader2, DollarSign } from "lucide-react";
import Link from "next/link";

export default function DonationsDashboardClient() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Stats
  const [totalCollected, setTotalCollected] = useState(0);
  const [activeCampaignsCount, setActiveCampaignsCount] = useState(0);
  const [recentDonorsCount, setRecentDonorsCount] = useState(0);

  const [formData, setFormData] = useState({
    donor_name: "",
    amount: "",
    status: "completed", // offline banks are usually logged as completed directly
    payment_method: "bank_transfer",
    reference: "",
    campaign_id: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Transactions
    const { data: txData } = await supabase
      .from("alif_transactions")
      .select("*, alif_campaigns(title)")
      .order("created_at", { ascending: false });
      
    // Fetch Campaigns for dropdown
    const { data: campData } = await supabase
      .from("alif_campaigns")
      .select("id, title, is_active");

    const txs = txData || [];
    const camps = campData || [];

    setTransactions(txs);
    setCampaigns(camps);

    // Calculate Stats
    const completedTxs = txs.filter(t => t.status === "completed");
    const total = completedTxs.reduce((sum, t) => sum + Number(t.amount), 0);
    setTotalCollected(total);

    const activeCamps = camps.filter(c => c.is_active).length;
    setActiveCampaignsCount(activeCamps);
    
    const uniqueDonors = new Set(completedTxs.map(t => t.donor_name)).size;
    setRecentDonorsCount(uniqueDonors);

    setLoading(false);
  };

  const handleOpenModal = () => {
    setFormData({
      donor_name: "",
      amount: "",
      status: "completed",
      payment_method: "bank_transfer",
      reference: "",
      campaign_id: ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();

    const payload = {
      donor_name: formData.donor_name || "Anonymous",
      amount: parseInt(formData.amount, 10),
      status: formData.status,
      payment_method: formData.payment_method,
      reference: formData.reference || `MANUAL-${Date.now()}`,
      campaign_id: formData.campaign_id ? formData.campaign_id : null,
      logged_by: userData.user?.id
    };

    const { error } = await supabase.from("alif_transactions").insert(payload);

    setSaving(false);
    if (error) {
      alert(`Error logging donation: ${error.message}`);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Donations Overview</h1>
        <div className="flex gap-3">
          <Link href="/donations/campaigns" className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Manage Campaigns
          </Link>
          <button onClick={handleOpenModal} className="flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
            <Plus className="w-4 h-4" /> Log Donation
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Collected</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">₦{totalCollected.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{activeCampaignsCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Unique Donors</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{recentDonorsCount}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="py-12 flex justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No transactions recorded yet.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Donor</th>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{tx.donor_name}</td>
                    <td className="px-6 py-4">{tx.alif_campaigns?.title || <span className="text-gray-400 italic">General Donation</span>}</td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{tx.payment_method.replace('_', ' ')}</span>
                      {tx.reference && <div className="text-xs text-gray-400">{tx.reference}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        tx.status === 'refunded' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                      ₦{Number(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Log Offline Donation</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name (Optional)</label>
                <input type="text" placeholder="e.g. Abdullah Ibn Mas'ud" value={formData.donor_name} onChange={e => setFormData({...formData, donor_name: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <p className="text-xs text-gray-500 mt-1">Leave blank for 'Anonymous'</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₦</span>
                  </div>
                  <input required type="number" min="1" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign / Need</label>
                <select value={formData.campaign_id} onChange={e => setFormData({...formData, campaign_id: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">-- General Donation (Unallocated) --</option>
                  {campaigns.filter(c => c.is_active).map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Ref (Optional)</label>
                  <input type="text" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Log Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
