import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Users, BookOpen, Calendar, Heart, Home, Bell,
  Award, TrendingUp, ChevronRight, LogOut, Building2
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Dashboard",
  description: "Your ALIF member dashboard",
};

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/portal");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Member";
  const membershipId = profile?.membership_id || "ALIF-PENDING";

  const quickLinks = [
    { icon: BookOpen,   label: "My Courses",     href: "/portal/courses",       color: "from-emerald-600 to-emerald-700" },
    { icon: Calendar,   label: "My Events",      href: "/portal/events",        color: "from-blue-600 to-blue-700" },
    { icon: Building2,  label: "Hostel",          href: "/portal/hostel",        color: "from-teal-600 to-teal-700" },
    { icon: Heart,      label: "Donations",      href: "/portal/donations",     color: "from-rose-600 to-rose-700" },
    { icon: Award,      label: "Certificates",   href: "/portal/certificates",  color: "from-amber-600 to-amber-700" },
    { icon: Bell,       label: "Notifications",  href: "/portal/notifications", color: "from-purple-600 to-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117]">
      {/* Portal Header */}
      <header className="bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-white/8 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f5132] to-[#166534] flex items-center justify-center">
              <span className="text-white font-bold text-sm font-[Outfit]">ا</span>
            </div>
            <span className="font-bold text-[#0f5132] dark:text-emerald-400 font-[Outfit] hidden sm:block">ALIF Portal</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/portal/notifications" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f5132] to-[#166534] flex items-center justify-center text-white text-xs font-bold">
              {displayName[0].toUpperCase()}
            </div>
            <span className="font-medium hidden sm:block">{displayName}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="p1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 2L23 12L33 12L25 18L28 28L20 22L12 28L15 18L7 12L17 12Z" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#p1)" />
            </svg>
          </div>
          <div className="relative">
            <p className="text-white/60 text-sm mb-1">السلام عليكم ورحمة الله وبركاته</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-[Outfit]">
              Welcome back, {displayName}
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Membership ID: <span className="text-[#d4a017] font-semibold font-mono">{membershipId}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/portal/membership"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a017] text-white text-sm font-semibold rounded-full hover:bg-[#b8860b] transition-colors font-[Outfit]"
              >
                <Award className="w-4 h-4" /> View Membership Card
              </Link>
              <Link
                href="/portal/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex flex-col items-center gap-3 p-5 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Courses Enrolled", value: "—", icon: BookOpen, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" },
            { label: "Events Attended", value: "—", icon: Calendar, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" },
            { label: "Total Donated", value: "₦0", icon: Heart, color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming events placeholder */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit]">Upcoming Events</h2>
            <Link href="/events" className="text-sm text-[#0f5132] dark:text-emerald-400 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No upcoming events registered</p>
            <Link href="/events" className="mt-3 inline-block text-sm text-[#0f5132] dark:text-emerald-400 hover:underline">
              Browse events →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
