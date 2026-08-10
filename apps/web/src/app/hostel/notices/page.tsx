import { createClient } from "@alif/database/server";
import { AlertTriangle, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Hostel Notices | ALIF",
  description: "Official notices and announcements for ALIF Hostel accommodation.",
};

export default async function NoticesPage() {
  const supabase = await createClient();

  // Fetch all published notices
  const { data: notices } = await supabase
    .from("hostel_notices")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const now = new Date();
  
  // Categorize active and archived
  const activeNotices = (notices || []).filter(
    (n) => !n.expires_at || new Date(n.expires_at) > now
  ).sort((a, b) => {
    const pWeight = { urgent: 3, important: 2, normal: 1 };
    const wA = pWeight[a.priority as keyof typeof pWeight] || 0;
    const wB = pWeight[b.priority as keyof typeof pWeight] || 0;
    return wB - wA;
  });

  const archivedNotices = (notices || []).filter(
    (n) => n.expires_at && new Date(n.expires_at) <= now
  );

  return (
    <div className="bg-[#faf6ef] dark:bg-[#0d1117] min-h-screen pb-20 pt-24 lg:pt-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link href="/hostel" className="text-sm text-brand-green hover:underline mb-4 inline-block font-medium">
            ← Back to Hostel Page
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-[Outfit] text-gray-900 dark:text-white">Hostel Notices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Official updates, guidelines, and announcements.</p>
        </div>

        {/* Current Notices */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-[Outfit] text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-brand-green" />
            Current Notices
          </h2>
          
          {activeNotices.length === 0 ? (
            <div className="bg-white dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
              <p className="text-gray-500 dark:text-gray-400">No current hostel notices at this time.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeNotices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/hostel/notices/${notice.slug}`}
                  className={`block p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
                    notice.priority === 'urgent'
                      ? 'bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30 shadow-sm shadow-red-100 dark:shadow-none'
                      : 'bg-white dark:bg-[#161b22] border-gray-100 dark:border-white/5 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      notice.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      notice.priority === 'important' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                      'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                    }`}>
                      {notice.notice_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notice.published_at || notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className={`font-bold font-[Outfit] text-lg mb-2 ${
                    notice.priority === 'urgent' ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
                  }`}>
                    {notice.title}
                  </h3>
                  <p className={`line-clamp-2 text-sm ${
                    notice.priority === 'urgent' ? 'text-red-700 dark:text-red-300/80' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {notice.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Archived Notices */}
        {archivedNotices.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-[Outfit] text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gray-400" />
              Archived Notices
            </h2>
            <div className="bg-white dark:bg-[#161b22] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {archivedNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    href={`/hostel/notices/${notice.slug}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {notice.notice_type}
                        </span>
                        <span className="text-xs text-gray-400">&bull;</span>
                        <span className="text-xs text-gray-400">
                          {new Date(notice.published_at || notice.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                        {notice.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 hidden sm:block" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
