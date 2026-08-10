"use client";

import { useState } from "react";
import { createClient } from "@alif/database/client";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    hostel_name: initialData.hostel_name || "",
    session_name: initialData.session_name || "",
    hostel_fee: initialData.hostel_fee || 0,
    currency: initialData.currency || "NGN",
    application_open: initialData.application_open || false,
    application_deadline: initialData.application_deadline ? new Date(initialData.application_deadline).toISOString().split('T')[0] : "",
    retention_open: initialData.retention_open || false,
    retention_deadline: initialData.retention_deadline ? new Date(initialData.retention_deadline).toISOString().split('T')[0] : "",
    new_application_form_url: initialData.new_application_form_url || "",
    retention_form_url: initialData.retention_form_url || "",
    hostel_address: initialData.hostel_address || "",
    contact_phone_1: initialData.contact_phone_1 || "",
    contact_phone_2: initialData.contact_phone_2 || "",
    contact_phone_3: initialData.contact_phone_3 || "",
    general_information: initialData.general_information || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;

      const payload = {
        ...formData,
        application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString() : null,
        retention_deadline: formData.retention_deadline ? new Date(formData.retention_deadline).toISOString() : null,
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      let error;
      if (initialData.id) {
        const res = await supabase.from("hostel_settings").update(payload).eq("id", initialData.id);
        error = res.error;
      } else {
        const res = await supabase.from("hostel_settings").insert([payload]);
        error = res.error;
      }

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {/* General Information */}
      <section>
        <h2 className="text-lg font-bold font-[Outfit] text-gray-900 dark:text-white mb-4 border-b pb-2">General Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostel Name</label>
            <input type="text" name="hostel_name" value={formData.hostel_name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session Name</label>
            <input type="text" name="session_name" value={formData.session_name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostel Fee</label>
            <input type="number" min="0" name="hostel_fee" value={formData.hostel_fee} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
            <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
        </div>
      </section>

      {/* Applications & Google Forms */}
      <section>
        <h2 className="text-lg font-bold font-[Outfit] text-gray-900 dark:text-white mb-4 border-b pb-2">Applications & URLs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="application_open" checked={formData.application_open} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Applications Open</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="retention_open" checked={formData.retention_open} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Retention Open</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Application Deadline</label>
            <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retention Deadline</label>
            <input type="date" name="retention_deadline" value={formData.retention_deadline} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Application Form URL</label>
            <input type="url" name="new_application_form_url" value={formData.new_application_form_url} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" placeholder="https://docs.google.com/forms/..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retention Form URL</label>
            <input type="url" name="retention_form_url" value={formData.retention_form_url} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" placeholder="https://docs.google.com/forms/..." />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <h2 className="text-lg font-bold font-[Outfit] text-gray-900 dark:text-white mb-4 border-b pb-2">Contact & Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostel Address</label>
            <textarea name="hostel_address" value={formData.hostel_address} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone 1</label>
            <input type="tel" name="contact_phone_1" value={formData.contact_phone_1} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone 2</label>
            <input type="tel" name="contact_phone_2" value={formData.contact_phone_2} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
          </div>
        </div>
      </section>
      
      {/* General Notes */}
      <section>
        <h2 className="text-lg font-bold font-[Outfit] text-gray-900 dark:text-white mb-4 border-b pb-2">Additional Information</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">General Information text</label>
          <textarea name="general_information" value={formData.general_information} onChange={handleChange} rows={5} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl font-bold font-[Outfit] transition-all shadow-md shadow-brand-green/20 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
          <Save className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
