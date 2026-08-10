import React from "react";
import { createClient } from "@alif/database/server";
import { BookOpen, User, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles & Publications | ALIF",
  description: "Read beneficial Islamic articles, reminders, and educational write-ups published by members of Al-Ibaanah Islamic Foundation.",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const supabase = await createClient();

  // Fetch approved articles
  const { data: articles } = await supabase
    .from("articles")
    .select("*, profiles!articles_author_id_fkey(full_name)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const articleList = articles || [];

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-charcoal via-[#24465B] to-brand-blue-dark text-white">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="articlesPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#articlesPattern)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-[Outfit] tracking-tight">Articles &amp; Reminders</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Knowledge is light. Read articles and journals on Creed, Jurisprudence, and general reminders submitted by our community.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <h2 className="text-2xl font-bold font-[Outfit]">Latest Publications</h2>
          <Link
            href="/portal/articles/new"
            className="px-5 py-2.5 bg-[#b8860b] hover:bg-[#b8860b]/90 text-white text-xs font-semibold rounded-xl transition-all font-[Outfit]"
          >
            Write an Article
          </Link>
        </div>

        {articleList.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No articles published yet.</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to submit a beneficial article in the member portal!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articleList.map((article) => {
              const authorName = (article.profiles as any)?.full_name || "Anonymous Member";
              return (
                <div key={article.id} className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full">
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg font-[Outfit] text-gray-900 dark:text-white line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-4 leading-relaxed">
                        {article.content}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {authorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#b8860b] dark:text-[#d4a017] hover:underline"
                      >
                        Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
