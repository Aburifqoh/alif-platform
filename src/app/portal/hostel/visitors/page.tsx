"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users, Plus, Loader2, CheckCircle2,
  AlertCircle, Clock, X, Phone, LogOut
} from "lucide-react";

interface VisitorLog {
  id: string;
  visitor_name: string;
  visitor_phone: string | null;
  purpose: string | null;
  check_in: string;
  check_out: string | null;
}

export default function VisitorsPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hostelId, setHostelId] = useState<string | null>(null);

  const [form, setForm] = useState({
    visitor_name: "",
    visitor_phone: "",
    purpose: "",
  });

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get hostel ID from room allocation
    const { data: alloc } = await supabase
      .from("room_allocations")
      .select("room:rooms(hostel_id)")
      .eq("resident_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const room = alloc?.room;
    const hid: string | null = room && !Array.isArray(room) && "hostel_id" in room
      ? (room as { hostel_id: string }).hostel_id
      : null;
    setHostelId(hid);

    const { data } = await supabase
      .from("visitor_logs")
      .select("*")
      .eq("resident_id", user.id)
      .order("check_in", { ascending: false })
      .limit(50);
    setLogs((data as VisitorLog[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostelId) {
      setError("You need an active room allocation to log visitors.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error: insertError } = await supabase.from("visitor_logs").insert({
        hostel_id: hostelId,
        resident_id: user.id,
        visitor_name: form.visitor_name,
        visitor_phone: form.visitor_phone || null,
        purpose: form.purpose || null,
      });
      if (insertError) throw insertError;
      setSuccess(true);
      setForm({ visitor_name: "", visitor_phone: "", purpose: "" });
      setShowForm(false);
      fetchData();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Failed to log visitor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async (id: string) => {
    await supabase
      .from("visitor_logs")
      .update({ check_out: new Date().toISOString() })
      .eq("id", id);
    fetchData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Visitor Log</h1>
          <p className="text-gray-400 text-sm mt-1">Register expected visitors to the hostel</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0f5132] to-[#166534] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-[Outfit]"
        >
          <Plus className="w-4 h-4" /> Log Visitor
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Visitor logged successfully!</p>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Log a Visitor</h2>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { field: "visitor_name",  label: "Visitor Full Name", placeholder: "e.g. Aisha Musa",       required: true, type: "text" },
                { field: "visitor_phone", label: "Phone Number",       placeholder: "e.g. 08012345678",       required: false, type: "tel" },
                { field: "purpose",       label: "Purpose of Visit",   placeholder: "e.g. Family visit, Study", required: false, type: "text" },
              ].map(({ field, label, placeholder, required, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))}
                    required={required}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 focus:border-[#0f5132] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#0f5132] to-[#166534] text-white text-sm font-semibold rounded-xl disabled:opacity-60 hover:shadow-lg transition-all font-[Outfit]">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Users className="w-4 h-4" /> Log Visitor</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitor logs */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-10 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-gray-400 text-sm">No visitors logged yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const isActive = !log.check_out;
            return (
              <div key={log.id} className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-gray-50 dark:bg-white/5"}`}>
                    <Users className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.visitor_name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" : "text-gray-400 bg-gray-50 dark:bg-white/5"}`}>
                        {isActive ? "Checked In" : "Checked Out"}
                      </span>
                    </div>
                    {log.visitor_phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Phone className="w-3 h-3" /> {log.visitor_phone}
                      </div>
                    )}
                    {log.purpose && <p className="text-xs text-gray-400 mt-0.5">{log.purpose}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-300 dark:text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        In: {new Date(log.check_in).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {log.check_out && (
                        <span className="flex items-center gap-1">
                          <LogOut className="w-3 h-3" />
                          Out: {new Date(log.check_out).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <button
                      onClick={() => handleCheckout(log.id)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-500 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Check Out
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
