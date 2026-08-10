import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Clock, AlertCircle, FileText,
  BedDouble, CalendarDays, ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Application Status | ALIF Hostel",
};

const STATUS_STEPS = [
  { key: "pending",      label: "Application Submitted",   desc: "Your application has been received" },
  { key: "under_review", label: "Under Review",            desc: "Hostel manager is reviewing your application" },
  { key: "approved",     label: "Approved",                desc: "Your application has been approved — proceed to payment" },
  { key: "allocated",    label: "Room Allocated",          desc: "A room has been assigned to you" },
];

function getStepIndex(status: string) {
  if (status === "approved" || status === "waitlisted") return 2;
  if (status === "pending") return 0;
  if (status === "under_review") return 1;
  return 0;
}

export default async function ApplicationStatusPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/hostel/application");

  const { data: application } = await supabase
    .from("hostel_applications")
    .select(`
      *,
      allocated_room:rooms(
        room_number, floor, room_type,
        hostel:hostels(name, address)
      )
    `)
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!application) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit] mb-2">No Application Found</h2>
          <p className="text-gray-400 text-sm mb-6">You haven&apos;t submitted a hostel application yet.</p>
          <Link
            href="/portal/hostel/apply"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-red to-brand-red-dark text-white font-semibold rounded-xl text-sm font-[Outfit]"
          >
            Apply Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(application.status);
  const isApproved = application.status === "approved";
  const isRejected = application.status === "rejected";
  const isWaitlisted = application.status === "waitlisted";

  const statusBadge = {
    pending:      { label: "Pending",      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30" },
    under_review: { label: "Under Review", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30" },
    approved:     { label: "Approved ✓",   color: "text-brand-red bg-brand-red-subtle dark:text-brand-red-light dark:bg-brand-red-dark/30" },
    rejected:     { label: "Rejected",     color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30" },
    waitlisted:   { label: "Waitlisted",   color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30" },
    cancelled:    { label: "Cancelled",    color: "text-gray-500 bg-gray-50 dark:bg-gray-900/30" },
  };
  const badge = statusBadge[application.status as keyof typeof statusBadge];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Application Status</h1>
        <p className="text-gray-400 text-sm mt-1">Session {application.session}</p>
      </div>

      {/* Status card */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Application Reference</p>
            <p className="font-mono font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{application.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>
        </div>

        {/* Timeline */}
        {!isRejected && (
          <div className="p-5 sm:p-6">
            <div className="space-y-0">
              {STATUS_STEPS.map((s, i) => {
                const done = i < currentStep;
                const active = i === currentStep && !isRejected;
                return (
                  <div key={s.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${done ? "bg-brand-red text-white" : active ? "bg-brand-red text-white ring-4 ring-emerald-100 dark:ring-emerald-950" : "bg-gray-100 dark:bg-white/8 text-gray-400"}`}>
                        {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 ${done ? "bg-brand-red" : "bg-gray-100 dark:bg-white/8"}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`text-sm font-semibold ${active || done ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{s.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rejected message */}
        {isRejected && (
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">Application Not Approved</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {application.rejection_reason || "Your application was not approved at this time. Please contact the hostel office for more details."}
                </p>
              </div>
            </div>
            <Link
              href="/portal/hostel/apply"
              className="mt-4 inline-flex items-center gap-2 text-sm text-brand-red dark:text-brand-red-light hover:underline font-medium"
            >
              Submit a new application <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Waitlisted */}
        {isWaitlisted && (
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You are on the waitlist. You will be notified when a room becomes available.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Room details (if approved + allocated) */}
      {isApproved && application.allocated_room && (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-brand-red-tint dark:border-brand-red-dark p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-red-subtle dark:bg-brand-red-dark/30 flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-brand-red dark:text-brand-red-light" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Your Allocated Room</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Hostel",      value: (application.allocated_room as any)?.hostel?.name ?? "—" },
              { label: "Room",        value: `Room ${(application.allocated_room as any)?.room_number}, Floor ${(application.allocated_room as any)?.floor}` },
              { label: "Type",        value: (application.allocated_room as any)?.room_type },
              { label: "Address",     value: (application.allocated_room as any)?.hostel?.address ?? "ALIF Campus" },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay now CTA */}
      {isApproved && (
        <div className="bg-gradient-to-br from-brand-red to-brand-red-dark rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white font-[Outfit]">Ready to pay?</p>
            <p className="text-white/60 text-sm">Secure your accommodation by paying the hostel fee.</p>
          </div>
          <Link
            href="/portal/hostel/payments"
            className="flex-shrink-0 px-5 py-2.5 bg-[#d4a017] text-white text-sm font-bold rounded-xl hover:bg-[#b8860b] transition-colors font-[Outfit]"
          >
            Pay Now
          </Link>
        </div>
      )}

      {/* Application details */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-5 sm:p-6">
        <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Application Details</h2>
        <div className="space-y-2">
          {[
            { label: "Session",    value: application.session },
            { label: "Purpose",    value: (application.purpose ?? "").charAt(0).toUpperCase() + (application.purpose ?? "").slice(1) },
            { label: "Room Type",  value: (application.room_type ?? "").charAt(0).toUpperCase() + (application.room_type ?? "").slice(1) },
            { label: "Submitted",  value: new Date(application.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Reviewed",   value: application.reviewed_at ? new Date(application.reviewed_at).toLocaleDateString("en-NG") : "Pending" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-gray-50 dark:border-white/5 pb-2 last:border-0">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
