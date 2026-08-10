import { createClient } from "@alif/database/server";
import { redirect } from "next/navigation";
import {
  ClipboardList, CheckCircle2, Clock, X,
  AlertCircle, Users, BedDouble, ChevronRight
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Hostel Admin | ALIF",
  description: "Manage hostel applications and residents",
};

export default async function HostelAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/portal/admin/hostel");

  // Check role
  const { data: roles } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id);

  const roleNames = (roles ?? []).map((r: { roles: { name: string } | { name: string }[] | null }) => {
    const role = r.roles;
    if (Array.isArray(role)) return role.map(x => x.name);
    return role?.name;
  }).flat();

  const hasAccess = roleNames.some((r) => ["admin", "super_admin", "hostel_manager"].includes(r as string));
  if (!hasAccess) redirect("/portal");

  // Fetch all applications
  const { data: applications } = await supabase
    .from("hostel_applications")
    .select(`
      *,
      applicant:profiles(full_name, phone, gender, membership_id)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  // Stats
  const pending   = (applications ?? []).filter(a => a.status === "pending").length;
  const approved  = (applications ?? []).filter(a => a.status === "approved").length;
  const rejected  = (applications ?? []).filter(a => a.status === "rejected").length;
  const review    = (applications ?? []).filter(a => a.status === "under_review").length;

  // Available rooms count
  const { count: availableRooms } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("is_available", true);

  const statusBadge: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending:      { label: "Pending",      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30",   icon: Clock },
    under_review: { label: "Under Review", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30",       icon: ClipboardList },
    approved:     { label: "Approved",     color: "text-brand-red bg-brand-red-subtle dark:text-brand-red-light dark:bg-brand-red-dark/30", icon: CheckCircle2 },
    rejected:     { label: "Rejected",     color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30",           icon: X },
    waitlisted:   { label: "Waitlisted",   color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30", icon: Clock },
    cancelled:    { label: "Cancelled",    color: "text-gray-400 bg-gray-50 dark:bg-gray-900/30",                          icon: AlertCircle },
  };

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117]">
      <header className="bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/portal" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Hostel Management</h1>
            <p className="text-xs text-gray-400">Applications & Resident Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/portal/admin/hostel/rooms"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <BedDouble className="w-4 h-4" /> Manage Rooms
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Pending",      value: pending,             color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
            { label: "Under Review", value: review,              color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
            { label: "Approved",     value: approved,            color: "text-brand-red bg-brand-red-subtle dark:bg-brand-red-dark/30" },
            { label: "Rejected",     value: rejected,            color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
            { label: "Rooms Free",   value: availableRooms ?? 0, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-4 text-center">
              <div className={`text-2xl font-bold font-[Outfit] ${color.split(" ")[0]}`}>{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Applications table */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Applications</h2>
            <span className="text-xs text-gray-400">{(applications ?? []).length} total</span>
          </div>

          {(applications ?? []).length === 0 ? (
            <div className="p-10 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-200 dark:text-gray-700" />
              <p className="text-gray-400 text-sm">No applications yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <th className="px-5 py-3 text-left">Applicant</th>
                    <th className="px-5 py-3 text-left">Session</th>
                    <th className="px-5 py-3 text-left">Room Type</th>
                    <th className="px-5 py-3 text-left">Purpose</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(applications ?? []).map((app) => {
                    const badge = statusBadge[app.status] ?? statusBadge.pending;
                    const StatusIcon = badge.icon;
                    const applicant = app.applicant as { full_name: string; phone: string; gender: string; membership_id: string } | null;
                    return (
                      <tr key={app.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(applicant?.full_name ?? "?")[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{applicant?.full_name ?? "Unknown"}</p>
                              <p className="text-xs text-gray-400 font-mono">{applicant?.membership_id ?? "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{app.session}</td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">{app.room_type}</td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">{app.purpose}</td>
                        <td className="px-5 py-4 text-xs text-gray-400">
                          {new Date(app.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                            <StatusIcon className="w-3 h-3" /> {badge.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <HostelAdminActions applicationId={app.id} currentStatus={app.status} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline server action buttons component
function HostelAdminActions({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  if (currentStatus === "approved" || currentStatus === "rejected" || currentStatus === "cancelled") return null;

  return (
    <>
      {currentStatus === "pending" && (
        <form action={`/api/hostel/admin/review`} method="POST" className="inline">
          <input type="hidden" name="id" value={applicationId} />
          <input type="hidden" name="status" value="under_review" />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
          >
            Review
          </button>
        </form>
      )}
      <Link
        href={`/portal/admin/hostel/application/${applicationId}`}
        className="px-3 py-1.5 rounded-lg bg-brand-red-subtle dark:bg-brand-red-dark/30 text-brand-red dark:text-brand-red-light text-xs font-semibold hover:bg-brand-red-tint transition-colors"
      >
        Manage
      </Link>
    </>
  );
}
