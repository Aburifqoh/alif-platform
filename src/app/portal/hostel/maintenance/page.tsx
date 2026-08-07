"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Wrench, Plus, Loader2, CheckCircle2,
  AlertCircle, Clock, ChevronRight, X
} from "lucide-react";

interface MaintenanceReq {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  resolved_at: string | null;
}

export default function MaintenancePage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<MaintenanceReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "normal" as MaintenanceReq["priority"],
  });

  const fetchRequests = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("maintenance_requests")
      .select("*")
      .eq("reporter_id", user.id)
      .order("created_at", { ascending: false });
    setRequests((data as MaintenanceReq[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/hostel/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to submit");
      setSuccess(true);
      setForm({ title: "", description: "", priority: "normal" });
      setShowForm(false);
      fetchRequests();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Error submitting request");
    } finally {
      setSubmitting(false);
    }
  };

  const priorityConfig = {
    low:    { label: "Low",    color: "text-gray-500 bg-gray-50 dark:bg-gray-800" },
    normal: { label: "Normal", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30" },
    high:   { label: "High",   color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30" },
    urgent: { label: "Urgent", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30" },
  };

  const statusConfig = {
    open:        { label: "Open",        color: "text-amber-600 dark:text-amber-400", icon: Clock },
    in_progress: { label: "In Progress", color: "text-blue-600 dark:text-blue-400",   icon: Loader2 },
    resolved:    { label: "Resolved",    color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
    closed:      { label: "Closed",      color: "text-gray-400",                      icon: CheckCircle2 },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Maintenance</h1>
          <p className="text-gray-400 text-sm mt-1">Report issues with your room or hostel facilities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0f5132] to-[#166534] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-[Outfit]"
        >
          <Plus className="w-4 h-4" /> Report Issue
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Request submitted! Our team will respond shortly.</p>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">New Maintenance Request</h2>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="e.g. Leaking tap in bathroom"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 focus:border-[#0f5132] dark:focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 focus:border-[#0f5132] dark:focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["low", "normal", "high", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border
                        ${form.priority === p
                          ? priorityConfig[p].color + " border-transparent"
                          : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#0f5132] to-[#166534] text-white text-sm font-semibold rounded-xl disabled:opacity-60 hover:shadow-lg transition-all font-[Outfit]"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Wrench className="w-4 h-4" /> Submit</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-10 text-center">
          <Wrench className="w-10 h-10 mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-gray-400 text-sm">No maintenance requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const s = statusConfig[req.status] ?? statusConfig.open;
            const p = priorityConfig[req.priority] ?? priorityConfig.normal;
            const StatusIcon = s.icon;
            return (
              <div key={req.id} className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color}`}>
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{req.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.color}`}>{p.label}</span>
                        <div className={`flex items-center gap-1 text-xs font-medium ${s.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {s.label}
                        </div>
                      </div>
                    </div>
                    {req.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{req.description}</p>
                    )}
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                      Submitted {new Date(req.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      {req.resolved_at ? ` · Resolved ${new Date(req.resolved_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
