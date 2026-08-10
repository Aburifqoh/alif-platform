import { createClient } from "@alif/database/server";
import { AlertTriangle, Calendar, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: notice } = await supabase
    .from("hostel_notices")
    .select("title, content")
    .eq("slug", params.slug)
    .single();

  if (!notice) {
    return { title: "Notice Not Found | ALIF" };
  }

  return {
    title: `${notice.title} | ALIF Hostel Notices`,
    description: notice.content.substring(0, 160),
  };
}

export default async function NoticeDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: notice } = await supabase
    .from("hostel_notices")
    .select("*, author:profiles!created_by(full_name)")
    .eq("slug", params.slug)
    .single();

  if (!notice) {
    notFound();
  }

  const isExpired = notice.expires_at && new Date(notice.expires_at) <= new Date();

  return (
    <div className="bg-[#faf6ef] dark:bg-[#0d1117] min-h-screen pb-20 pt-24 lg:pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/hostel/notices" className="inline-flex items-center gap-2 text-sm text-brand-green hover:underline mb-8 font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to Notices
        </Link>

        {isExpired && (
          <div className="mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">This notice has expired</p>
              <p className="text-xs text-gray-500">It is kept for archival purposes and may no longer be applicable.</p>
            </div>
          </div>
        )}

        <article className="bg-white dark:bg-[#161b22] p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          <header className="mb-8 border-b border-gray-100 dark:border-white/5 pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                notice.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                notice.priority === 'important' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
              }`}>
                {notice.notice_type}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(notice.published_at || notice.created_at).toLocaleDateString("en-NG", {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-bold font-[Outfit] leading-tight ${
              notice.priority === 'urgent' ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
            }`}>
              {notice.title}
            </h1>
            
            {notice.author?.full_name && (
              <p className="text-sm text-gray-500 mt-4">
                Posted by <span className="font-medium text-gray-700 dark:text-gray-300">{notice.author.full_name}</span>
              </p>
            )}
          </header>
          
          {/* We use whitespace-pre-wrap to respect newlines in standard text since we might not have a rich text editor yet */}
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {notice.content}
          </div>
        </article>
      </div>
    </div>
  );
}
