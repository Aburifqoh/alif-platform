"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Edit, Trash2, Power, PowerOff, Mic, Camera, Speaker, MonitorSmartphone, Building2, Heart, HandCoins } from "lucide-react";
import { createClient } from "@alif/database/client";

const ICONS: Record<string, React.ElementType> = {
  Mic, Camera, Speaker, MonitorSmartphone, Building2, Heart, HandCoins
};

export default function CampaignsClient() {
  const supabase = createClient();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    description: "",
    icon_name: "Heart",
    goal_amount: "",
    is_active: true,
    sort_order: 10
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("alif_campaigns")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    
    setCampaigns(data || []);
    setLoading(false);
  };

  const handleOpenModal = (campaign?: any) => {
    if (campaign) {
      setFormData({
        id: campaign.id,
        title: campaign.title,
        slug: campaign.slug,
        description: campaign.description,
        icon_name: campaign.icon_name,
        goal_amount: campaign.goal_amount ? campaign.goal_amount.toString() : "",
        is_active: campaign.is_active,
        sort_order: campaign.sort_order
      });
    } else {
      setFormData({
        id: "",
        title: "",
        slug: "",
        description: "",
        icon_name: "Heart",
        goal_amount: "",
        is_active: true,
        sort_order: 10
      });
    }
    setIsModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!formData.id) {
      // Auto-generate slug only for new campaigns
      setFormData({ ...formData, title, slug: generateSlug(title) });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      icon_name: formData.icon_name,
      goal_amount: formData.goal_amount ? parseInt(formData.goal_amount, 10) : null,
      is_active: formData.is_active,
      sort_order: formData.sort_order,
      updated_at: new Date().toISOString()
    };

    let error = null;

    if (formData.id) {
      const res = await supabase.from("alif_campaigns").update(payload).eq("id", formData.id);
      error = res.error;
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const res = await supabase.from("alif_campaigns").insert({
        ...payload,
        created_by: userData.user?.id,
        updated_by: userData.user?.id
      });
      error = res.error;
    }

    setSaving(false);
    if (error) {
      alert(`Error saving campaign: ${error.message}`);
    } else {
      setIsModalOpen(false);
      fetchCampaigns();
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("alif_campaigns").update({ is_active: !currentStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    // Check if there are transactions associated
    const { count } = await supabase.from("alif_transactions").select("*", { count: 'exact', head: true }).eq("campaign_id", id);
    
    if (count && count > 0) {
      alert("Cannot delete this campaign because it has associated donation transactions. Please deactivate/archive it instead.");
      return;
    }

    if (confirm("Are you sure you want to permanently delete this campaign? This action cannot be undone.")) {
      const { error } = await supabase.from("alif_campaigns").delete().eq("id", id);
      if (error) alert(`Error deleting campaign: ${error.message}`);
      else fetchCampaigns();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Donation Campaigns</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-900">Active & Archived Campaigns</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="py-12 flex justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No campaigns found.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b">
                <tr>
                  <th className="px-6 py-3">Campaign / Need</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Goal</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => {
                  const Icon = ICONS[camp.icon_name] || Heart;
                  return (
                    <tr key={camp.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{camp.title}</div>
                            <div className="text-xs text-gray-500 font-normal">{camp.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-semibold ${camp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                           {camp.is_active ? 'Active' : 'Archived'}
                         </span>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {camp.goal_amount ? `₦${camp.goal_amount.toLocaleString()}` : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleToggleActive(camp.id, camp.is_active)} className="p-2 text-gray-400 hover:text-blue-600 mr-2" title={camp.is_active ? "Archive Campaign" : "Activate Campaign"}>
                          {camp.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleOpenModal(camp)} className="p-2 text-gray-400 hover:text-blue-600 mr-2" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(camp.id)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">{formData.id ? "Edit Campaign" : "Create Campaign"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Purpose)</label>
                <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (₦) (Optional)</label>
                  <input type="number" min="0" value={formData.goal_amount} onChange={e => setFormData({...formData, goal_amount: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input required type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value, 10)})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.keys(ICONS).map(iconName => {
                    const IconComp = ICONS[iconName];
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData({...formData, icon_name: iconName})}
                        className={`p-3 rounded-lg flex justify-center items-center border transition-all ${formData.icon_name === iconName ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        title={iconName}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="is_active" className="text-sm text-gray-700">Campaign is Active (Visible to public)</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
