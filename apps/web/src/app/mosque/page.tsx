import React from "react";
import { Clock, MapPin, Users, Heart, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mosque Affairs | ALIF",
  description: "Learn about Al-Ibaanah Islamic Foundation Mosque, daily prayer times, Jumu'ah schedules, weekly Halaqat, and community events.",
};

export default function MosquePage() {
  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-charcoal via-[#24465B] to-brand-blue-dark text-white">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mosquePattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mosquePattern)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-[Outfit] tracking-tight">ALIF Mosque</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            A sanctuary for worship, spiritual growth, and community bonding established upon the Qur'an and Sunnah.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Prayer times */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <Clock className="w-5 h-5 text-[#b8860b]" />
              <h2 className="font-bold text-lg font-[Outfit]">Daily Prayers</h2>
            </div>

            <div className="space-y-4">
              <PrayerTimeRow name="Fajr" time="05:15 AM" iqamah="05:30 AM" />
              <PrayerTimeRow name="Dhuhr" time="12:45 PM" iqamah="01:00 PM" />
              <PrayerTimeRow name="Asr" time="04:10 PM" iqamah="04:25 PM" />
              <PrayerTimeRow name="Maghrib" time="06:50 PM" iqamah="06:55 PM" />
              <PrayerTimeRow name="Isha" time="08:05 PM" iqamah="08:20 PM" />
              <PrayerTimeRow name="Jumu'ah" time="01:00 PM" iqamah="01:30 PM" isJumuah={true} />
            </div>

            <div className="text-[10px] text-gray-400 text-center italic mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
              * Iqamah times are subject to seasonal changes. Nigeria (Abuja / West Africa Time).
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-[#b8860b] to-[#d4a017] text-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg font-[Outfit]">Imam &amp; Administration</h3>
            <div className="space-y-2 text-sm text-white/95">
              <p><strong>Chief Imam:</strong> Dr. Mustapha Luqman</p>
              <p><strong>Deputy Imam:</strong> Ustadh Muhammad Salih</p>
              <p><strong>Address:</strong> ALIF Centre, plot 245, Islamic Area, Abuja, Nigeria</p>
            </div>
          </div>
        </div>

        {/* Right column: Programs and Outreach */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mosque Activities */}
          <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold font-[Outfit] border-b pb-3 border-gray-100 dark:border-white/5">Weekly Halaqat &amp; Programs</h2>
            
            <div className="space-y-6">
              <ActivityRow 
                title="Tafseer of the Qur'an" 
                instructor="Dr. Mustapha Luqman" 
                time="Saturdays, after Maghrib to Isha" 
                description="A systematic analysis of the Qur'an based on classical and authentic exegeses." 
              />
              <ActivityRow 
                title="Riyadus Saliheen (Hadith)" 
                instructor="Ustadh Muhammad Salih" 
                time="Sundays, after Asr" 
                description="Study of the prophetic traditions dealing with character, morals, and worship." 
              />
              <ActivityRow 
                title="Arabic Language for Beginners" 
                instructor="Ustadh Abu Bakr" 
                time="Fridays, after Isha" 
                description="Introductory classes in grammar, morphology, and conversational Arabic." 
              />
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-[Outfit] text-gray-800 dark:text-gray-200">Mosque Guidelines &amp; Etiquette</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Ensure phones are switched off or placed on silent before entering the prayer hall.</li>
              <li>Dress modestly in accordance with Islamic guidelines.</li>
              <li>Keep the ablution (Wudu) areas clean and conserve water.</li>
              <li>Parents are kindly requested to supervise their children at all times.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrayerTimeRow({ name, time, iqamah, isJumuah = false }: { name: string; time: string; iqamah: string; isJumuah?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${isJumuah ? 'bg-[#b8860b]/5 border border-[#b8860b]/20 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
      <div className="flex gap-4 text-xs font-[Outfit]">
        <div className="text-right">
          <span className="block text-[10px] text-gray-400 uppercase">Adhan</span>
          <span className="text-gray-800 dark:text-gray-200">{time}</span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-gray-400 uppercase">Iqamah</span>
          <span className="text-[#b8860b] dark:text-[#d4a017] font-semibold">{iqamah}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ title, instructor, time, description }: { title: string; instructor: string; time: string; description: string }) {
  return (
    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg font-[Outfit]">{title}</h4>
        <span className="text-xs px-3 py-1 bg-[#b8860b]/10 text-[#b8860b] dark:text-[#d4a017] rounded-full font-medium">{time}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Instructor:</strong> {instructor}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
    </div>
  );
}
