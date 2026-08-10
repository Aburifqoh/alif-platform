"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@alif/database/client";
import { useRouter } from "next/navigation";
import { Upload, Plus, Store, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    price: "",
    is_negotiable: false,
    condition: "new",
    location_state: "",
    location_city: "",
    fulfillment: "both",
    image_url: "",
  });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is a seller
      const { data: seller } = await supabase
        .from("marketplace_seller_profiles")
        .select("id, status")
        .eq("id", user.id)
        .single();

      if (!seller || seller.status !== "active") {
        router.push("/portal/marketplace/seller-profile");
        return;
      }

      setSellerId(seller.id);

      // Load categories
      const { data: cats } = await supabase
        .from("marketplace_categories")
        .select("*")
        .order("name");
      if (cats) setCategories(cats);

      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);
      const images = formData.image_url ? [formData.image_url] : [];

      const { error: insertError } = await supabase
        .from("marketplace_listings")
        .insert({
          seller_id: sellerId,
          category_id: formData.category_id || null,
          title: formData.title,
          slug,
          description: formData.description,
          price: parseFloat(formData.price),
          is_negotiable: formData.is_negotiable,
          condition: formData.condition,
          location_state: formData.location_state,
          location_city: formData.location_city,
          fulfillment: formData.fulfillment,
          images,
          status: "pending_review",
        });

      if (insertError) throw insertError;

      router.push("/portal/marketplace?success=submitted");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/portal/marketplace"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[Outfit]">Create Listing</h1>
          <p className="text-sm text-gray-500">Sell an item or service to the ALIF community.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-brand-cream border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-red-tint flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Moderation Notice</h3>
              <p className="text-sm text-gray-600 mt-1">
                To maintain a safe and halal environment, all new listings must be reviewed and approved by an Admin before they appear on the marketplace. This usually takes 1-2 hours.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Listing Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Authentic Madinah Dates (1kg)"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price (₦) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                placeholder="e.g. 5000"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe what you are selling in detail..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red bg-white"
              >
                <option value="new">New</option>
                <option value="used_like_new">Used - Like New</option>
                <option value="used_good">Used - Good</option>
                <option value="used_fair">Used - Fair</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fulfillment</label>
              <select
                name="fulfillment"
                value={formData.fulfillment}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red bg-white"
              >
                <option value="both">Delivery or Pickup</option>
                <option value="delivery">Delivery Only</option>
                <option value="pickup">Pickup Only</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">State *</label>
              <input
                type="text"
                name="location_state"
                required
                placeholder="e.g. FCT"
                value={formData.location_state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City / Area *</label>
              <input
                type="text"
                name="location_city"
                required
                placeholder="e.g. Wuse 2"
                value={formData.location_city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image URL (Optional)</label>
            <input
              type="url"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red"
            />
            <p className="text-xs text-gray-500">For now, paste a direct link to an image. Native upload coming soon.</p>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_negotiable"
              name="is_negotiable"
              checked={formData.is_negotiable}
              onChange={handleChange}
              className="w-4 h-4 text-brand-red rounded border-gray-300 focus:ring-brand-red"
            />
            <label htmlFor="is_negotiable" className="text-sm text-gray-700 font-medium">
              Price is negotiable
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-red text-white font-medium rounded-xl hover:bg-brand-red-dark disabled:opacity-50 transition-colors shadow-sm"
            >
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
