"use client";

import { useEffect, useState } from "react";
import { createClient } from "@alif/database/client";
import { Plus, Edit2, Trash2, X, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function NoticesAdminPage() {
  const supabase = createClient();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    notice_type: "general",
    priority: "normal",
    status: "draft",
    expires_at: ""
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("hostel_notices")
      .select("*")
      .order("created_at", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      notice_type: "general",
      priority: "normal",
      status: "draft",
      expires_at: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      slug: notice.slug,
      content: notice.content,
      notice_type: notice.notice_type,
      priority: notice.priority,
      status: notice.status,
      expires_at: notice.expires_at ? new Date(notice.expires_at).toISOString().split('T')[0] : ""
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title if it's a new notice and we're editing title
      ...(name === 'title' && !editingNotice ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;

      const payload = {
        ...formData,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      if (formData.status === 'published' && (!editingNotice || editingNotice.status !== 'published')) {
        (payload as any).published_at = new Date().toISOString();
      }

      if (editingNotice) {
        await supabase.from("hostel_notices").update(payload).eq("id", editingNotice.id);
      } else {
        (payload as any).created_by = userId;
        await supabase.from("hostel_notices").insert([payload]);
      }
      
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      alert("Failed to save notice.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this notice? This action cannot be undone. Consider archiving instead.")) {
      await supabase.from("hostel_notices").delete().eq("id", id);
      fetchNotices();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117]">
      <header className="bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/hostel" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Notices Management</h1>
            <p className="text-xs text-gray-400">Manage hostel announcements and notices</p>
          </div>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus className="w-4 h-4" /> New Notice
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading notices...</div>
          ) : notices.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No notices found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <th className="px-5 py-3 text-left">Title & Type</th>
                    <th className="px-5 py-3 text-left">Priority</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Expires</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {notices.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{n.title}</p>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{n.notice_type}</span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          n.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          n.priority === 'important' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {n.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          n.status === 'published' ? 'bg-green-100 text-green-700' :
                          n.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {n.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {n.expires_at ? new Date(n.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {n.status === 'published' && (
                            <a href={`/hostel/notices/${n.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-500">
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => openEditModal(n)} className="p-2 text-gray-400 hover:text-brand-green">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(n.id)} className="p-2 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#161b22] rounded-3xl w-full max-w-2xl border border-gray-100 dark:border-white/10 shadow-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-lg font-bold font-[Outfit] text-gray-900 dark:text-white">
                {editingNotice ? "Edit Notice" : "Create Notice"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-green font-mono text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notice Type</label>
                  <select name="notice_type" value={formData.notice_type} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {["general", "urgent", "fee", "deadline", "renovation", "application", "retention", "room", "important"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea required name="content" value={formData.content} onChange={handleChange} rows={6} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" placeholder="Notice body content..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date (Optional)</label>
                  <input type="date" name="expires_at" value={formData.expires_at} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-green text-white hover:bg-brand-green-dark rounded-xl font-medium transition-colors">
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
