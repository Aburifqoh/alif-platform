"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CreditCard, CheckCircle2, Clock, AlertCircle,
  Download, Loader2, Receipt
} from "lucide-react";

interface Fee {
  id: string;
  amount: number;
  period: string;
  fee_type: string;
  status: string;
  due_date: string | null;
  paid_date: string | null;
  paystack_ref: string | null;
  notes: string | null;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        currency: string;
        metadata: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export default function PaymentsPage() {
  const supabase = createClient();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchFees = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email ?? "");
    const { data } = await supabase
      .from("hostel_fees")
      .select("*")
      .eq("resident_id", user.id)
      .order("created_at", { ascending: false });
    setFees(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  // Load Paystack inline script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayNow = async (fee: Fee) => {
    setError(null);
    setPaying(fee.id);
    try {
      // Initialize payment
      const res = await fetch("/api/hostel/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee_id: fee.id, email: userEmail }),
      });
      const { reference, amount } = await res.json();
      if (!res.ok) throw new Error("Failed to initialize payment");

      // Open Paystack popup
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: userEmail,
        amount: Math.round(amount * 100), // kobo
        ref: reference,
        currency: "NGN",
        metadata: { fee_id: fee.id },
        callback: async (response) => {
          // Verify
          const vRes = await fetch(`/api/hostel/payments/verify?reference=${response.reference}`);
          const vData = await vRes.json();
          if (vData.success) {
            setSuccessMsg(`Payment of ₦${fee.amount.toLocaleString()} verified successfully!`);
            fetchFees();
          } else {
            setError("Payment verification failed. Please contact support.");
          }
          setPaying(null);
        },
        onClose: () => setPaying(null),
      });
      handler.openIframe();
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Payment failed");
      setPaying(null);
    }
  };

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    unpaid:  { label: "Unpaid",  color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30", icon: Clock },
    paid:    { label: "Paid",    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30", icon: CheckCircle2 },
    partial: { label: "Partial", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30", icon: AlertCircle },
    waived:  { label: "Waived",  color: "text-gray-500 bg-gray-50 dark:bg-gray-900/30", icon: CheckCircle2 },
  };

  const totalPaid = fees.filter(f => f.status === "paid").reduce((s, f) => s + Number(f.amount), 0);
  const totalDue  = fees.filter(f => f.status === "unpaid" || f.status === "partial").reduce((s, f) => s + Number(f.amount), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Payments</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your hostel fee payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#0f5132] to-[#166534] rounded-2xl p-5">
          <p className="text-white/60 text-xs mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-white font-[Outfit]">₦{totalPaid.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl p-5 ${totalDue > 0 ? "bg-amber-500" : "bg-gray-100 dark:bg-[#161b22]"}`}>
          <p className={`text-xs mb-1 ${totalDue > 0 ? "text-white/70" : "text-gray-400"}`}>Amount Due</p>
          <p className={`text-2xl font-bold font-[Outfit] ${totalDue > 0 ? "text-white" : "text-gray-900 dark:text-white"}`}>
            ₦{totalDue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMsg}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Fee list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-10 text-center">
          <Receipt className="w-10 h-10 mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-gray-400 text-sm">No payment records yet.</p>
          <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Fees will appear here once your application is approved.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fees.map((fee) => {
            const s = statusConfig[fee.status] ?? statusConfig.unpaid;
            const StatusIcon = s.icon;
            const isPaying = paying === fee.id;
            return (
              <div
                key={fee.id}
                className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {fee.fee_type?.replace("_", " ")}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.color}`}>{s.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {fee.period}
                    {fee.due_date ? ` · Due ${new Date(fee.due_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                    {fee.paid_date ? ` · Paid ${new Date(fee.paid_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit]">
                    ₦{Number(fee.amount).toLocaleString()}
                  </p>
                  {fee.status === "paid" ? (
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Receipt
                    </button>
                  ) : (fee.status === "unpaid" || fee.status === "partial") && (
                    <button
                      onClick={() => handlePayNow(fee)}
                      disabled={!!paying}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0f5132] to-[#166534] text-white text-xs font-bold hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all font-[Outfit]"
                    >
                      {isPaying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bank transfer info */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm font-[Outfit] mb-3">Bank Transfer (Alternative)</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: "Bank",    value: "First Bank of Nigeria" },
            { label: "Account", value: "2085 1234 567" },
            { label: "Name",    value: "Al-Ibaanah Islamic Foundation" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
              <span className="text-gray-400">{label}</span>
              <span className="font-semibold text-gray-900 dark:text-white font-mono">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          After transfer, send your teller/screenshot to the hostel office WhatsApp for manual confirmation.
        </p>
      </div>
    </div>
  );
}
