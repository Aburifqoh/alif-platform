"use client";

import { useEffect, useState } from "react";
import { createClient } from "@alif/database/client";
import { Plus, Edit2, Trash2, X, ChevronRight, GripVertical, CheckCircle2, XCircle, Mic, Globe, Stethoscope, BookOpen, Calendar, HandHeart, Book, GraduationCap, Award, Users, Target, HeartPulse, Shield, Lightbulb, Users2 } from "lucide-react";
import Link from "next/link";

// Whitelisted Icons map to prevent arbitrary names from crashing
const ICON_MAP: Record<string, React.ElementType> = {
  Mic, Globe, Stethoscope, BookOpen, Calendar, HandHeart, Book, 
  GraduationCap, Award, Users, Target, HeartPulse, Shield, Lightbulb, Users2
};

const CATEGORIES = [
  "Da'wah", 'Outreach', 'Welfare', 'Education', 'Seasonal', 
  'Women', 'Youth', 'Healthcare', 'Community', 'Other'
];

export default function ProgrammesClient() {
  const supabase = createClient();
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "Other",
    icon_name: "BookOpen",
    is_active: true,
    sort_order: 10
  });

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("alif_programmes")
      .select("*")
      .order("sort_order", { ascending: true });
    setProgrammes(data || []);
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingProg(null);
    const maxSort = programmes.length > 0 ? Math.max(...programmes.map(p => p.sort_order)) : 0;
    
    setFormData({
      title: "",
      slug: "",
      description: "",
      category: "Other",
      icon_name: "BookOpen",
      is_active: true,
      sort_order: maxSort + 10
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prog: any) => {
    setEditingProg(prog);
    setFormData({
      title: prog.title,
      slug: prog.slug,
      description: prog.description,
      category: prog.category,
      icon_name: prog.icon_name,
      is_active: prog.is_active,
      sort_order: prog.sort_order
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: val,
      ...(name === 'title' && !editingProg ? { slug: (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;

      const payload = {
        ...formData,
        sort_order: Number(formData.sort_order),
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      if (editingProg) {
        await supabase.from("alif_programmes").update(payload).eq("id", editingProg.id);
      } else {
        (payload as any).created_by = userId;
        await supabase.from("alif_programmes").insert([payload]);
      }
      
      setIsModalOpen(false);
      fetchProgrammes();
    } catch (err) {
      console.error(err);
      alert("Failed to save programme.");
    }
  };

  const toggleActive = async (prog: any) => {
    const newActiveState = !prog.is_active;
    if (!newActiveState && !confirm(`Are you sure you want to deactivate "${prog.title}"? It will no longer appear on the public website.`)) {
      return;
    }
    
    try {
      await supabase
        .from("alif_programmes")
        .update({ is_active: newActiveState, updated_at: new Date().toISOString() })
        .eq("id", prog.id);
      fetchProgrammes();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`CRITICAL WARNING: Are you absolutely sure you want to permanently delete "${title}"? This action cannot be undone. Consider deactivating it instead.`)) {
      await supabase.from("alif_programmes").delete().eq("id", id);
      fetchProgrammes();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117]">
      <header className="bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Programmes Management</h1>
            <p className="text-xs text-gray-400">Manage public programmes and activities</p>
          </div>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus className="w-4 h-4" /> Add Programme
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden shadow-sm">
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading programmes...</div>
          ) : programmes.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              No programmes defined. Click 'Add Programme' to create one.
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {programmes.map((prog) => {
                const IconComp = ICON_MAP[prog.icon_name] || BookOpen;
                
                return (
                  <div key={prog.id} className={`flex gap-6 p-6 items-start transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${!prog.is_active ? 'opacity-60' : ''}`}>
                    <div className="mt-1 cursor-move text-gray-300 dark:text-gray-600 flex-shrink-0">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="w-14 h-14 shrink-0 bg-brand-red/10 text-brand-red dark:bg-brand-red/20 rounded-2xl flex items-center justify-center">
                      <IconComp className="w-7 h-7" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg font-[Outfit] truncate">{prog.title}</h3>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded text-xs font-semibold uppercase tracking-wider">
                          {prog.category}
                        </span>
                        {!prog.is_active && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{prog.description}</p>
                      
                      <div className="flex gap-4 text-xs font-medium text-gray-400">
                        <span>Slug: /{prog.slug}</span>
                        <span>Sort: {prog.sort_order}</span>
                        <span>Updated: {new Date(prog.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <button 
                        onClick={() => toggleActive(prog)} 
                        title={prog.is_active ? "Deactivate" : "Activate"}
                        className={`p-2 rounded-xl transition-colors flex items-center justify-center ${prog.is_active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {prog.is_active ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => openEditModal(prog)} 
                        title="Edit"
                        className="p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-colors flex items-center justify-center"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(prog.id, prog.title)} 
                        title="Permanently Delete"
                        className="p-2 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
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
                {editingProg ? "Edit Programme" : "Create Programme"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unique Slug</label>
                  <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-green font-mono text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon Selection</label>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  {Object.entries(ICON_MAP).map(([name, IconComp]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon_name: name }))}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                        formData.icon_name === name 
                          ? 'bg-brand-red text-white shadow-md' 
                          : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={name}
                    >
                      <IconComp className="w-6 h-6 mb-1" />
                      <span className="text-[10px] truncate w-full text-center opacity-70">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                  <input required type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
                </div>
                
                <div className="flex items-center gap-2 pt-6 border-l border-gray-100 dark:border-gray-800 pl-4">
                  <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green" />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Active on Website</label>
                </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-bold font-[Outfit] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-brand-green text-white hover:bg-brand-green-dark rounded-xl font-bold font-[Outfit] transition-colors shadow-sm">
                  Save Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
