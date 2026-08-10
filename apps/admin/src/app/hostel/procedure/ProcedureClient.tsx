"use client";

import { useEffect, useState } from "react";
import { createClient } from "@alif/database/client";
import { Plus, Edit2, Trash2, X, ChevronRight, GripVertical } from "lucide-react";
import Link from "next/link";

export default function ProcedureAdminPage() {
  const supabase = createClient();
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    step_number: 1,
    title: "",
    description: "",
    is_active: true,
    sort_order: 10
  });

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("hostel_application_steps")
      .select("*")
      .order("sort_order", { ascending: true });
    setSteps(data || []);
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingStep(null);
    const maxStep = steps.length > 0 ? Math.max(...steps.map(s => s.step_number)) : 0;
    const maxSort = steps.length > 0 ? Math.max(...steps.map(s => s.sort_order)) : 0;
    
    setFormData({
      step_number: maxStep + 1,
      title: "",
      description: "",
      is_active: true,
      sort_order: maxSort + 10
    });
    setIsModalOpen(true);
  };

  const openEditModal = (step: any) => {
    setEditingStep(step);
    setFormData({
      step_number: step.step_number,
      title: step.title,
      description: step.description,
      is_active: step.is_active,
      sort_order: step.sort_order
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        step_number: Number(formData.step_number),
        sort_order: Number(formData.sort_order),
        updated_at: new Date().toISOString()
      };

      if (editingStep) {
        await supabase.from("hostel_application_steps").update(payload).eq("id", editingStep.id);
      } else {
        await supabase.from("hostel_application_steps").insert([payload]);
      }
      
      setIsModalOpen(false);
      fetchSteps();
    } catch (err) {
      console.error(err);
      alert("Failed to save step.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this step? This will remove it from the public page permanently.")) {
      await supabase.from("hostel_application_steps").delete().eq("id", id);
      fetchSteps();
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
            <h1 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Application Procedure</h1>
            <p className="text-xs text-gray-400">Manage the steps shown on the public hostel page</p>
          </div>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus className="w-4 h-4" /> Add Step
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading steps...</div>
          ) : steps.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No procedure steps defined. Click 'Add Step' to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className={`flex gap-4 p-4 rounded-xl border ${!step.is_active ? 'bg-gray-50 border-gray-100 opacity-70 dark:bg-white/5 dark:border-white/5' : 'bg-white border-gray-200 dark:bg-[#161b22] dark:border-gray-700'} items-start transition-all hover:shadow-sm`}>
                  <div className="mt-1 cursor-move text-gray-300 dark:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 shrink-0 bg-brand-green/10 text-brand-green dark:bg-brand-green/20 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step_number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                    <div className="mt-3 flex gap-4 text-xs font-medium">
                      <span className="text-gray-400">Sort: {step.sort_order}</span>
                      <span className={step.is_active ? 'text-green-600' : 'text-gray-400'}>
                        {step.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => openEditModal(step)} className="p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(step.id)} className="p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161b22] rounded-3xl w-full max-w-lg border border-gray-100 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-lg font-bold font-[Outfit] text-gray-900 dark:text-white">
                {editingStep ? "Edit Step" : "Create Step"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Step Number (Display)</label>
                  <input required type="number" name="step_number" value={formData.step_number} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order (Actual Order)</label>
                  <input required type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-green"></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Visible to public (Active)</label>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-green text-white hover:bg-brand-green-dark rounded-xl font-medium transition-colors">
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
