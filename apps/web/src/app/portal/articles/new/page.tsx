"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@alif/database/client";
import { ArrowLeft, BookOpen, Send, CheckCircle2 } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userRes = await supabase.auth.getUser();
      const user = userRes.data.user;

      if (!user) {
        throw new Error("You must be logged in to submit an article.");
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);

      const { error: insertError } = await supabase
        .from("articles")
        .insert({
          title,
          slug,
          content,
          author_id: user.id,
          is_approved: false, // requires admin approval
        });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#161b22] rounded-3xl border border-gray-100 dark:border-white/10 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#b8860b]/10 text-[#b8860b] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-[Outfit] text-gray-900 dark:text-white">Article Submitted!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your article has been successfully submitted and is pending review and approval by the admins.
          </p>
          <Link
            href="/articles"
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#b8860b] text-white font-semibold rounded-xl hover:shadow-lg transition-all font-[Outfit] text-sm"
          >
            Go to Articles Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel &amp; Return
        </Link>

        <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-[Outfit]">Write a New Article</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Share beneficial knowledge. All submissions must be approved by the admin team before appearing in the public feed.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. The Importance of Sincerity (Ikhlas) in Worship"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                placeholder="Write your article content here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none resize-none text-sm font-serif leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#b8860b] hover:bg-[#b8860b]/90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all font-[Outfit] text-sm disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Approval"} <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
