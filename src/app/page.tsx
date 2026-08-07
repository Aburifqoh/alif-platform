"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Users, Home, Mosque, Heart, Award, Globe, Star,
  Calendar, ChevronRight, ArrowRight, Play, MapPin, Clock,
  Zap, Shield, TrendingUp, Gift, Volume2, FileText
} from "lucide-react";

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */
function HeroSection() {
  const [prayerTime, setPrayerTime] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    // Fetch next prayer time from Aladhan API (Nigeria - Abuja, Method 3 - MWL)
    const fetchPrayer = async () => {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Abuja&country=Nigeria&method=3"
        );
        const data = await res.json();
        if (data.code === 200) {
          const timings = data.data.timings;
          const now = new Date();
          const prayers = [
            { name: "Fajr", time: timings.Fajr },
            { name: "Dhuhr", time: timings.Dhuhr },
            { name: "Asr", time: timings.Asr },
            { name: "Maghrib", time: timings.Maghrib },
            { name: "Isha", time: timings.Isha },
          ];
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          const next = prayers.find(({ time }) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m > nowMinutes;
          });
          setPrayerTime(next || prayers[0]);
        }
      } catch {}
    };
    fetchPrayer();
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35]">
      {/* Islamic geometric background */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamicStar" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 5 L47 28 L70 28 L52 43 L59 66 L40 53 L21 66 L28 43 L10 28 L33 28 Z" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicStar)" />
        </svg>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#b8860b]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#15803d]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#b8860b] animate-pulse" />
            بسم الله الرحمن الرحيم
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] font-[Outfit]">
              Al-Ibaanah
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] to-[#f5c842]">
                Islamic
              </span>
              <br />
              Foundation
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
              Propagating authentic Islam upon the Qur'an, Sunnah, and the understanding
              of the Salaf. Serving our community through education, Da'wah, and development.
            </p>
          </div>

          {/* Arabic motto */}
          <div className="py-4 px-6 bg-white/8 border border-white/15 rounded-2xl backdrop-blur-sm">
            <p className="text-2xl text-[#d4a017] font-[Amiri] text-right leading-loose arabic" dir="rtl">
              قُلْ هَٰذِهِ سَبِيلِي أَدْعُو إِلَى اللَّهِ
            </p>
            <p className="mt-1 text-white/60 text-sm text-right">
              "Say: This is my way; I call to Allah" — Qur'an 12:108
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-[Outfit]"
            >
              Join Our Community
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/programs"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm font-[Outfit]"
            >
              <Play className="w-4 h-4" />
              Explore Programs
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { value: "2,000+", label: "Members" },
              { value: "500+", label: "Students" },
              { value: "15+", label: "Years" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[#d4a017] font-[Outfit]">{s.value}</div>
                <div className="text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Prayer Times Card */}
        <div className="hidden lg:block">
          <div className="relative bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl">
            {/* Next Prayer Banner */}
            {prayerTime && (
              <div className="mb-6 p-4 bg-[#b8860b]/20 border border-[#b8860b]/30 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest">Next Prayer</p>
                  <p className="text-white font-bold text-xl font-[Outfit]">{prayerTime.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#d4a017] font-bold text-2xl font-[Outfit]">{prayerTime.time}</p>
                  <p className="text-white/60 text-xs">Abuja, Nigeria</p>
                </div>
              </div>
            )}

            <h3 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BookOpen, label: "Courses", href: "/programs/education", color: "from-emerald-600 to-emerald-700" },
                { icon: Mosque, label: "Mosque", href: "/mosque", color: "from-[#b8860b] to-[#d4a017]" },
                { icon: Calendar, label: "Events", href: "/events", color: "from-blue-600 to-blue-700" },
                { icon: Heart, label: "Donate", href: "/donate", color: "from-rose-600 to-rose-700" },
                { icon: Home, label: "Hostel", href: "/hostel", color: "from-purple-600 to-purple-700" },
                { icon: Users, label: "Members", href: "/register", color: "from-teal-600 to-teal-700" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-3 p-3.5 bg-white/8 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 30C1320 60 1200 70 1080 55C960 40 840 10 720 20C600 30 480 60 360 65C240 70 120 50 0 30L0 80Z" fill="white" className="dark:fill-[#0d1117]" />
        </svg>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MISSION & VISION
───────────────────────────────────────── */
function MissionVision() {
  return (
    <section id="mission" className="py-24 bg-white dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">Our Purpose</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-[Outfit]">
            Mission & Vision
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group p-8 rounded-3xl border border-gray-100 dark:border-white/10 bg-gradient-to-br from-[#f0fdf4] to-white dark:from-emerald-950/30 dark:to-[#161b22] hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f5132] to-[#166534] flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To propagate authentic Islam based on the Qur'an and authentic Sunnah, upon the
              understanding of the Salaf — through education, Da'wah, community development,
              and youth mentorship — serving Muslims across Nigeria and beyond.
            </p>
          </div>
          <div className="group p-8 rounded-3xl border border-gray-100 dark:border-white/10 bg-gradient-to-br from-[#fef9e7] to-white dark:from-yellow-950/20 dark:to-[#161b22] hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#b8860b] to-[#d4a017] flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To be the leading Islamic foundation in Nigeria — a model institution that
              transforms individuals, families, and communities through authentic Islamic
              knowledge, character development, and organized welfare services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   ABOUT ALIF
───────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="py-24 bg-[#faf6ef] dark:bg-[#161b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">About ALIF</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-[Outfit] leading-tight">
            Al-Ibaanah Islamic Foundation
          </h2>
          <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Al-Ibaanah Islamic Foundation (ALIF) is an Islamic organization committed
              to upholding and disseminating authentic Islamic knowledge based on the Qur'an,
              the authentic Sunnah, and the understanding of the Salaf us-Salih.
            </p>
            <p>
              Since our founding, we have grown into a comprehensive institution offering
              Islamic education from Qur'an and Tajweed to Arabic language and advanced
              Islamic sciences. Our hostel facilities provide a nurturing environment for
              students committed to full-time learning.
            </p>
            <p>
              Our Da'wah efforts extend from public lectures and seminars to community
              outreach programs, welfare services, and youth mentorship — serving thousands
              of Muslims across Nigeria.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f5132] text-white font-semibold rounded-full hover:bg-[#166534] transition-colors font-[Outfit]"
            >
              Learn More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: BookOpen, label: "Islamic Education", desc: "Qur'an, Tajweed, Arabic, Aqeedah, Fiqh, Hadith & more", color: "emerald" },
            { icon: Mosque, label: "Mosque Activities", desc: "Daily prayers, Friday Khutbah, Ramadan programs & Eid", color: "gold" },
            { icon: Home, label: "Hostel Management", desc: "Safe, structured accommodation for full-time students", color: "purple" },
            { icon: Heart, label: "Welfare & Outreach", desc: "Emergency aid, scholarships, and community projects", color: "rose" },
            { icon: Users, label: "Community Building", desc: "Membership, committees, and leadership development", color: "blue" },
            { icon: Globe, label: "Da'wah & Media", desc: "Lectures, publications, media center & online content", color: "teal" },
          ].map((item) => (
            <div key={item.label} className="p-5 bg-white dark:bg-[#21262d] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                item.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-950/50 text-[#0f5132] dark:text-emerald-400" :
                item.color === "gold" ? "bg-yellow-100 dark:bg-yellow-950/50 text-[#b8860b] dark:text-yellow-400" :
                item.color === "purple" ? "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" :
                item.color === "rose" ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400" :
                item.color === "blue" ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" :
                "bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400"
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white font-[Outfit] mb-1">{item.label}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   UPCOMING EVENTS
───────────────────────────────────────── */
function UpcomingEvents() {
  const events = [
    {
      title: "Weekly Islamic Studies Circle",
      date: "Every Friday",
      time: "After Jumu'ah",
      location: "ALIF Mosque",
      type: "Regular",
      color: "emerald",
    },
    {
      title: "Tajweed & Qur'an Workshop",
      date: "August 10, 2026",
      time: "9:00 AM – 2:00 PM",
      location: "ALIF Education Centre",
      type: "Workshop",
      color: "gold",
    },
    {
      title: "Annual Da'wah Conference",
      date: "September 5–7, 2026",
      time: "All Day",
      location: "ALIF Auditorium",
      type: "Conference",
      color: "blue",
    },
    {
      title: "Youth Leadership Program",
      date: "August 20–24, 2026",
      time: "8:00 AM – 5:00 PM",
      location: "ALIF Campus",
      type: "Training",
      color: "purple",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">What's Coming</span>
            <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white font-[Outfit]">Upcoming Events</h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[#0f5132] dark:text-emerald-400 font-semibold hover:gap-3 transition-all text-sm"
          >
            View all events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((event) => (
            <div key={event.title} className="group p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#161b22] hover:shadow-lg transition-all hover:-translate-y-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                event.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-950/50 text-[#0f5132] dark:text-emerald-400" :
                event.color === "gold" ? "bg-yellow-100 dark:bg-yellow-950/50 text-[#b8860b] dark:text-yellow-400" :
                event.color === "blue" ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400" :
                "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400"
              }`}>
                {event.type}
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-[Outfit] mb-3 leading-snug">{event.title}</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {event.location}
                </div>
              </div>
              <Link
                href="/events"
                className="mt-4 block text-center px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-[#f0fdf4] dark:hover:bg-emerald-950/30 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0f5132] dark:hover:text-emerald-400 rounded-lg transition-all"
              >
                Register →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROGRAMS / DEPARTMENTS
───────────────────────────────────────── */
function ProgramsSection() {
  const programs = [
    { icon: BookOpen, title: "Islamic Education", desc: "Aqeedah · Fiqh · Hadith · Tafseer · Seerah", href: "/programs/education", color: "from-emerald-600 to-emerald-700" },
    { icon: Volume2, title: "Qur'an & Tajweed", desc: "Recitation · Memorisation · Hifdh · Tajweed rules", href: "/programs/quran", color: "from-teal-600 to-teal-700" },
    { icon: Globe, title: "Arabic Language", desc: "Vocabulary · Grammar · Speaking · Writing", href: "/programs/arabic", color: "from-blue-600 to-blue-700" },
    { icon: Users, title: "Youth Programs", desc: "Mentorship · Leadership · Character development", href: "/programs/youth", color: "from-purple-600 to-purple-700" },
    { icon: Mosque, title: "Da'wah", desc: "Lectures · Outreach · Friday Khutbah · Seminars", href: "/programs/dawah", color: "from-amber-600 to-amber-700" },
    { icon: Heart, title: "Welfare Services", desc: "Emergency aid · Scholarships · Medical support", href: "/welfare", color: "from-rose-600 to-rose-700" },
    { icon: Home, title: "Hostel Management", desc: "Accommodation · Structured life · Discipline", href: "/hostel", color: "from-indigo-600 to-indigo-700" },
    { icon: Award, title: "Competitions", desc: "Qur'an · Tajweed · Arabic · Islamic Quiz", href: "/events/competitions", color: "from-orange-600 to-orange-700" },
  ];

  return (
    <section className="py-24 bg-[#faf6ef] dark:bg-[#161b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-[Outfit]">Our Programs</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive Islamic programs designed to nurture knowledge, character, and community.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((prog) => (
            <Link
              key={prog.title}
              href={prog.href}
              className="group p-6 bg-white dark:bg-[#21262d] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-xl hover:-translate-y-1.5 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <prog.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-[Outfit] mb-2">{prog.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{prog.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[#0f5132] dark:text-emerald-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   STATISTICS
───────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: "2,000+", label: "Active Members", icon: Users },
    { value: "500+", label: "Students Enrolled", icon: BookOpen },
    { value: "15+", label: "Years of Service", icon: Award },
    { value: "100+", label: "Events per Year", icon: Calendar },
    { value: "50+", label: "Scholars & Teachers", icon: Star },
    { value: "₦10M+", label: "Welfare Distributed", icon: Heart },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">By The Numbers</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white font-[Outfit]">
            Our Impact
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white/8 border border-white/15 rounded-2xl backdrop-blur-sm hover:bg-white/12 transition-all">
              <stat.icon className="w-7 h-7 text-[#d4a017] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white font-[Outfit]">{stat.value}</div>
              <div className="text-white/60 text-xs mt-1 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   LATEST ARTICLES
───────────────────────────────────────── */
function LatestArticles() {
  const articles = [
    {
      category: "Aqeedah",
      title: "The Importance of Tawheed in the Life of a Muslim",
      excerpt: "Understanding the foundations of Islamic monotheism and its practical implications in everyday life...",
      date: "July 28, 2026",
      readTime: "5 min read",
    },
    {
      category: "Fiqh",
      title: "Rulings on Zakat al-Fitr: What Every Muslim Should Know",
      excerpt: "A comprehensive guide to Zakat al-Fitr — its obligation, amount, recipients, and proper timing...",
      date: "July 25, 2026",
      readTime: "8 min read",
    },
    {
      category: "Youth",
      title: "Building Righteous Character in the Age of Social Media",
      excerpt: "Practical Islamic guidance for navigating digital spaces while maintaining Islamic values and identity...",
      date: "July 20, 2026",
      readTime: "6 min read",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">Knowledge</span>
            <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white font-[Outfit]">Latest Articles</h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#0f5132] dark:text-emerald-400 font-semibold hover:gap-3 transition-all text-sm"
          >
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article key={art.title} className="group p-6 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#161b22] hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#0f5132] dark:text-emerald-400 mb-4">
                {art.category}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit] mb-3 leading-snug group-hover:text-[#0f5132] dark:group-hover:text-emerald-400 transition-colors">
                {art.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{art.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {art.date}</div>
                <div className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {art.readTime}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────── */
function Testimonials() {
  const testimonials = [
    {
      name: "Ustadh Abdullah Ibrahim",
      role: "Islamic Scholar & Guest Lecturer",
      text: "ALIF has built one of the most structured and authentic Islamic education systems I have encountered in Nigeria. Their commitment to the Salafi methodology is commendable.",
      rating: 5,
    },
    {
      name: "Sister Fatimah Okonkwo",
      role: "Member since 2018",
      text: "Joining ALIF transformed my understanding of Islam. The weekly classes, the warm community, and the welfare support system make this a truly remarkable foundation.",
      rating: 5,
    },
    {
      name: "Brother Musa Al-Amin",
      role: "Hostel Resident & Student",
      text: "Living in the ALIF hostel has been a blessing. The environment is structured for learning, the teachers are qualified, and the brotherhood here is unlike anything else.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-[#faf6ef] dark:bg-[#161b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">Voices</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-[Outfit]">
            What Our Community Says
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="p-7 bg-white dark:bg-[#21262d] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-xl transition-all">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#d4a017] text-[#d4a017]" />
                ))}
              </div>
              <blockquote className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                "{t.text}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f5132] to-[#166534] flex items-center justify-center text-white text-sm font-bold">
                  {t.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white font-[Outfit]">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook up to Supabase newsletter_subscribers table
    setSubmitted(true);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0d1117]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="dots2" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots2)" />
            </svg>
          </div>
          <div className="relative">
            <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">Stay Connected</span>
            <h2 className="mt-3 text-3xl font-bold text-white font-[Outfit]">Join the ALIF Newsletter</h2>
            <p className="mt-3 text-white/70 text-sm">
              Receive Islamic reminders, event updates, lecture announcements, and community news.
            </p>
            {submitted ? (
              <div className="mt-6 p-4 bg-[#d4a017]/20 border border-[#d4a017]/30 rounded-xl text-[#d4a017] font-medium">
                ✓ JazakAllahu khayran! You've been subscribed.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#d4a017] transition-colors backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-white font-semibold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-[Outfit] shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   DONATE CTA
───────────────────────────────────────── */
function DonateCTA() {
  return (
    <section className="py-16 bg-[#faf6ef] dark:bg-[#161b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Heart, title: "General Sadaqah", desc: "Support ALIF's day-to-day operations", color: "from-rose-500 to-rose-600", href: "/donate/sadaqah" },
            { icon: BookOpen, title: "Sponsor a Student", desc: "Fund a student's Islamic education journey", color: "from-[#0f5132] to-[#166534]", href: "/donate/sponsor" },
            { icon: Gift, title: "Zakat & Waqf", desc: "Fulfil your Zakat obligation through ALIF", color: "from-[#b8860b] to-[#d4a017]", href: "/donate/zakat" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start gap-4 p-6 bg-white dark:bg-[#21262d] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-[Outfit] mb-1 group-hover:text-[#0f5132] dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0f5132] dark:text-emerald-400">
                  Donate now <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   HOMEPAGE EXPORT
───────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionVision />
      <AboutSection />
      <ProgramsSection />
      <UpcomingEvents />
      <StatsSection />
      <LatestArticles />
      <Testimonials />
      <DonateCTA />
      <Newsletter />
    </>
  );
}
