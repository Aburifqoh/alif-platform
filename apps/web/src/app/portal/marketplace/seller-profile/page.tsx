"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@alif/database/client";
import { useRouter } from "next/navigation";
import { Store, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function SellerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    business_name: "",
    business_desc: "",
    whatsapp_number: "",
    location_state: "",
    location_city: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/portal/marketplace/seller-profile");
        return;
      }

      const { data, error } = await supabase
        .from("marketplace_seller_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData({
          business_name: data.business_name || "",
          business_desc: data.business_desc || "",
          whatsapp_number: data.whatsapp_number || "",
          location_state: data.location_state || "",
          location_city: data.location_city || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!formData.business_name || !formData.whatsapp_number) {
      setError("Business name and WhatsApp number are required.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        id: user.id,
        business_name: formData.business_name,
        business_desc: formData.business_desc,
        whatsapp_number: formData.whatsapp_number,
        location_state: formData.location_state,
        location_city: formData.location_city,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("marketplace_seller_profiles")
        .upsert(payload);

      if (upsertError) throw upsertError;

      setSuccess("Profile saved successfully!");
      setProfile({ ...profile, ...payload });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto flex justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Seller Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your ALIF marketplace storefront details.</p>
      </div>

      {profile?.is_verified && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Verified Seller</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Your profile has been verified by the ALIF admin team. You can post items directly to the marketplace.
            </p>
          </div>
        </div>
      )}
      
      {profile && !profile?.is_verified && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-300">Unverified Seller</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Your items will require admin approval before they appear in the marketplace. Fill out your profile completely to request verification.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/8 rounded-2xl p-6 shadow-sm">
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business or Store Name *
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all dark:text-white"
                placeholder="e.g. Halal Foods Ltd"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Description
            </label>
            <textarea
              value={formData.business_desc}
              onChange={(e) => setFormData({ ...formData, business_desc: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all dark:text-white"
              placeholder="What do you sell?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              WhatsApp Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all dark:text-white"
                placeholder="+2348000000000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Buyers will contact you via this number.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.location_state}
                  onChange={(e) => setFormData({ ...formData, location_state: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all dark:text-white"
                  placeholder="e.g. Lagos"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City / Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all dark:text-white"
                  placeholder="e.g. Yaba"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : profile ? "Update Profile" : "Create Seller Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
