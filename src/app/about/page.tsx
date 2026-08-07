import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Users, BookOpen, Globe, Heart, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About ALIF",
  description: "Learn about Al-Ibaanah Islamic Foundation — our mission, vision, history, and leadership.",
};

export default function AboutPage() {
  const values = [
    { icon: BookOpen, title: "Authentic Knowledge", desc: "We base all our work on the Qur'an, authentic Sunnah, and understanding of the Salaf." },
    { icon: Users, title: "Community First", desc: "Serving thousands of Muslims through education, welfare, and organized community activities." },
    { icon: Globe, title: "Continuous Da'wah", desc: "Spreading the message of Islam through lectures, media, outreach, and community projects." },
    { icon: Heart, title: "Welfare & Compassion", desc: "Supporting those in need through emergency aid, scholarships, medical assistance, and more." },
    { icon: Award, title: "Excellence", desc: "Maintaining high standards in every area — from education quality to organizational management." },
    { icon: CheckCircle, title: "Accountability", desc: "Transparent governance with proper audit trails, public reporting, and member accountability." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">About Us</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-[Outfit] leading-tight">
            Al-Ibaanah Islamic Foundation
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive Islamic institution dedicated to propagating authentic Islam
            and serving the Muslim community through education, Da'wah, and welfare.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white dark:bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">Our Story</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white font-[Outfit]">History & Background</h2>
            <div className="mt-5 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Al-Ibaanah Islamic Foundation (ALIF) was established with a singular vision:
                to provide a trusted platform for authentic Islamic education and community development.
              </p>
              <p>
                Over the years, ALIF has grown from a small study circle into a fully-fledged
                Islamic institution offering formal courses in Qur'an, Tajweed, Arabic, Aqeedah,
                Fiqh, Hadith, and Tafseer, alongside hostel facilities for residential students.
              </p>
              <p>
                Today, ALIF serves thousands of Muslims across Nigeria through its education
                programs, Da'wah activities, welfare services, mosque management, events,
                and community development initiatives.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Year Established", value: "2010" },
              { label: "Active Members", value: "2,000+" },
              { label: "Students Enrolled", value: "500+" },
              { label: "Qualified Teachers", value: "50+" },
            ].map((s) => (
              <div key={s.label} className="p-6 bg-[#faf6ef] dark:bg-[#161b22] rounded-2xl text-center">
                <div className="text-3xl font-bold text-[#0f5132] dark:text-emerald-400 font-[Outfit]">{s.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#faf6ef] dark:bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0f5132] dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest">What We Stand For</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white font-[Outfit]">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 bg-white dark:bg-[#21262d] rounded-2xl border border-gray-100 dark:border-white/8 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#0f5132] dark:text-emerald-400 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-[Outfit] mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white dark:bg-[#0d1117]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Be Part of ALIF</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join our growing community and contribute to the mission of authentic Islamic propagation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="px-8 py-3.5 bg-gradient-to-r from-[#0f5132] to-[#166534] text-white font-semibold rounded-full hover:shadow-lg transition-all font-[Outfit]">
              Become a Member
            </Link>
            <Link href="/contact" className="px-8 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
