"use client";

import { useEffect, useState } from "react";
import { createClient } from "@alif/database/client";
import { Check, Trash2, ShieldAlert, Clock, Calendar, User, FileText } from "lucide-react";

export default function ArticlesClient() {
  const supabase = createClient();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*, profiles!articles_author_id_fkey(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const userRes = await supabase.auth.getUser();
    const adminId = userRes.data.user?.id;

    const { error } = await supabase
      .from("articles")
      .update({
        is_approved: true,
        approved_by: adminId,
      })
      .eq("id", id);

    if (error) {
      alert("Error approving article: " + error.message);
    } else {
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? { ...art, is_approved: true } : art))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This action is permanent.")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      alert("Error deleting article: " + error.message);
    } else {
      setArticles((prev) => prev.filter((art) => art.id !== id));
    }
  };

  const filteredArticles = articles.filter((art) =>
    activeTab === "pending" ? !art.is_approved : art.is_approved
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Articles &amp; Blog Review</h1>
          <p className="text-xs text-gray-500 mt-1">Approve or moderate articles submitted by registered members.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "pending"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending Review (
          {articles.filter((art) => !art.is_approved).length}
          )
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "approved"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Live / Approved (
          {articles.filter((art) => art.is_approved).length}
          )
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-gray-500">Loading articles...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-150 p-8 shadow-sm">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredArticles.map((art) => {
            const authorName = (art.profiles as any)?.full_name || "Anonymous Member";
            return (
              <div key={art.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{art.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1.5">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Author: {authorName}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Submitted: {new Date(art.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed border-l-2 border-gray-200 pl-4">
                    {art.content}
                  </p>
                </div>

                <div className="flex md:flex-col items-center justify-end gap-3 shrink-0">
                  {!art.is_approved && (
                    <button
                      onClick={() => handleApprove(art.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors border border-red-200/50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
