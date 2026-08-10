import React from "react";
import { createClient } from "@alif/database/server";
import { User, Calendar, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, content")
    .eq("slug", slug)
    .single();

  if (!article) return { title: "Article Not Found | ALIF" };

  return {
    title: `${article.title} | ALIF`,
    description: article.content.substring(0, 160),
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*, profiles!articles_author_id_fkey(full_name)")
    .eq("slug", slug)
    .single();

  if (!article) notFound();

  const authorName = (article.profiles as any)?.full_name || "Anonymous Member";

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Article Body */}
        <article className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-4 border-b border-gray-100 dark:border-white/5 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-[Outfit] text-gray-900 dark:text-white leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-[#b8860b]" /> Written by {authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#b8860b]" /> Published on {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-serif">
            {article.content}
          </div>
        </article>
      </div>
    </div>
  );
}
