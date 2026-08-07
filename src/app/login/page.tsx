"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, Lock, LogIn, Globe } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/portal");
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f5132] to-[#166534] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl font-[Outfit]">ا</span>
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-[#0f5132] dark:text-emerald-400 font-[Outfit]">Al-Ibaanah</div>
              <div className="text-[10px] text-gray-500 tracking-widest uppercase">Islamic Foundation</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Welcome back</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">Sign in to your ALIF account</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/10 p-8 shadow-lg">
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-6"
          >
            <Globe className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#161b22] px-3 text-gray-400">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 focus:border-[#0f5132] dark:focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#0f5132] dark:text-emerald-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 focus:border-[#0f5132] dark:focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#0f5132] to-[#166534] text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all font-[Outfit]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#0f5132] dark:text-emerald-400 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
