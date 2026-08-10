import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2, BedDouble, CreditCard, Wrench,
  CheckCircle2, Clock, AlertCircle, ChevronRight,
  CalendarDays, Shield, FileText
} from "lucide-react";

export const metadata = {
  title: "Hostel Dashboard | ALIF",
  description: "Manage your hostel accommodation at Al-Ibaanah Islamic Foundation",
};

export default async function HostelDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/hostel");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, gender")
    .eq("id", user.id)
    .single();

  // Get active room allocation
  const { data: allocation } = await supabase
    .from("room_allocations")
    .select(`
      *,
      room:rooms(room_number, floor, room_type, monthly_fee, hostel:hostels(name, address))
    `)
    .eq("resident_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  // Get latest application
  const { data: application } = await supabase
    .from("hostel_applications")
    .select("*")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get unpaid fees
  const { data: unpaidFees } = await supabase
    .from("hostel_fees")
    .select("*")
    .eq("resident_id", user.id)
    .eq("status", "unpaid")
    .order("due_date", { ascending: true });

  // Get open maintenance requests
  const { data: openMaintenance } = await supabase
    .from("maintenance_requests")
    .select("id, title, priority, status, created_at")
    .eq("reporter_id", user.id)
    .in("status", ["open", "in_progress"])
    .order("created_at", { ascending: false })
    .limit(3);

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Resident";
  const totalDue = (unpaidFees ?? []).reduce((sum, f) => sum + Number(f.amount), 0);
  const isResident = !!allocation;

  const statusConfig = {
    pending:      { label: "Pending Review",  color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30",     icon: Clock },
    under_review: { label: "Under Review",    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30",         icon: FileText },
    approved:     { label: "Approved",        color: "text-brand-red bg-brand-red-subtle dark:text-brand-red-light dark:bg-brand-red-dark/30", icon: CheckCircle2 },
    rejected:     { label: "Rejected",        color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30",             icon: AlertCircle },
    waitlisted:   { label: "Waitlisted",      color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30", icon: Clock },
    cancelled:    { label: "Cancelled",       color: "text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/30",         icon: AlertCircle },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hp1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 5 L35 20 L50 20 L38 29 L43 44 L30 35 L17 44 L22 29 L10 20 L25 20Z" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hp1)"/>
          </svg>
        </div>
        <div className="relative">
          <p className="text-white/50 text-xs mb-1 font-[Amiri]">بسم الله الرحمن الرحيم</p>
          <h1 className="text-2xl font-bold text-white font-[Outfit]">
            السلام عليكم، {displayName}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {isResident ? "Welcome to your hostel dashboard" : "Apply for accommodation at ALIF Hostel"}
          </p>
          {!isResident && !application && (
            <Link
              href="/portal/hostel/apply"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4a017] text-white text-sm font-semibold rounded-full hover:bg-[#b8860b] transition-colors font-[Outfit]"
            >
              Apply for Accommodation <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Application status (if no allocation yet) */}
      {!isResident && application && (() => {
        const s = statusConfig[application.status as keyof typeof statusConfig];
        const StatusIcon = s?.icon ?? Clock;
        return (
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s?.color}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Application {application.session}</p>
              <p className="text-xs text-gray-400">
                Submitted {new Date(application.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s?.color}`}>{s?.label}</span>
            <Link href="/portal/hostel/application" className="text-sm text-brand-red dark:text-brand-red-light flex items-center gap-1 flex-shrink-0">
              View <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      })()}

      {/* Room card (if allocated) */}
      {isResident && allocation?.room && (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red-subtle dark:bg-brand-red-dark/30 flex items-center justify-center">
                  <BedDouble className="w-5 h-5 text-brand-red dark:text-brand-red-light" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">
                    {(allocation.room as any).hostel?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Room {(allocation.room as any).room_number} · Floor {(allocation.room as any).floor} · {(allocation.room as any).room_type}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-brand-red-subtle dark:bg-brand-red-dark/30 text-brand-red-dark dark:text-brand-red-light text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Monthly Fee", value: `₦${Number((allocation.room as any).monthly_fee).toLocaleString()}` },
                { label: "Move-in Date", value: new Date(allocation.move_in_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) },
                { label: "Address", value: (allocation.room as any).hostel?.address || "ALIF Campus" },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <div className="text-xs text-gray-400 mb-0.5">{stat.label}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit]">
              ₦{totalDue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Amount Due</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit]">
              {openMaintenance?.length ?? 0}
            </div>
            <div className="text-xs text-gray-400">Open Requests</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-red-subtle dark:bg-brand-red-dark/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-red dark:text-brand-red-light" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit]">
              {isResident ? "Active" : "None"}
            </div>
            <div className="text-xs text-gray-400">Accommodation</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Unpaid fees */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Pending Payments</h2>
            <Link href="/portal/hostel/payments" className="text-sm text-brand-red dark:text-brand-red-light flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {(unpaidFees ?? []).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-brand-red-light dark:text-brand-red-dark" />
              <p className="text-sm text-gray-400">All payments up to date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unpaidFees!.slice(0, 3).map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {fee.fee_type?.replace("_", " ")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fee.period} · Due {fee.due_date ? new Date(fee.due_date).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400">₦{Number(fee.amount).toLocaleString()}</p>
                    <Link href="/portal/hostel/payments" className="text-xs text-brand-red dark:text-brand-red-light hover:underline">
                      Pay now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance requests */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Maintenance</h2>
            <Link href="/portal/hostel/maintenance" className="text-sm text-brand-red dark:text-brand-red-light flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {(openMaintenance ?? []).length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="w-10 h-10 mx-auto mb-2 text-gray-200 dark:text-gray-700" />
              <p className="text-sm text-gray-400">No open maintenance requests</p>
              <Link href="/portal/hostel/maintenance" className="mt-2 inline-block text-sm text-brand-red dark:text-brand-red-light hover:underline">
                Submit a request →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {openMaintenance!.map((req) => {
                const priorityColor: Record<string, string> = {
                  low: "text-gray-500 bg-gray-50 dark:bg-gray-800",
                  normal: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
                  high: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
                  urgent: "text-red-600 bg-red-50 dark:bg-red-950/30",
                };
                return (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${priorityColor[req.priority]}`}>
                      {req.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{req.title}</p>
                      <p className="text-xs text-gray-400 capitalize">{req.status?.replace("_", " ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: CalendarDays, label: "Apply / Renew", href: "/portal/hostel/apply", color: "from-brand-red to-brand-red-dark" },
          { icon: CreditCard,   label: "Make Payment",  href: "/portal/hostel/payments", color: "from-amber-500 to-amber-600" },
          { icon: Wrench,       label: "Report Issue",  href: "/portal/hostel/maintenance", color: "from-blue-600 to-blue-700" },
          { icon: Shield,       label: "Add Visitor",   href: "/portal/hostel/visitors", color: "from-purple-600 to-purple-700" },
        ].map(action => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex flex-col items-center gap-3 p-5 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
