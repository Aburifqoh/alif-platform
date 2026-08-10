"use client";
import Link from "next/link";
import { Mosque, BookOpen, Users, Heart, Globe, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = {
  Programs: [
    { label: "Islamic Education", href: "/programs/education" },
    { label: "Qur'an & Tajweed", href: "/programs/quran" },
    { label: "Arabic Language", href: "/programs/arabic" },
    { label: "Youth Programs", href: "/programs/youth" },
    { label: "Da'wah", href: "/programs/dawah" },
  ],
  Services: [
    { label: "Hostel Management", href: "/hostel" },
    { label: "Welfare Support", href: "/welfare" },
    { label: "Events & Conferences", href: "/events" },
    { label: "Mosque Services", href: "/mosque" },
    { label: "Media Center", href: "/media" },
  ],
  "Get Involved": [
    { label: "Become a Member", href: "/register" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
    { label: "Sponsor a Student", href: "/donate/sponsor" },
    { label: "Partner With Us", href: "/contact" },
  ],
  Organization: [
    { label: "About ALIF", href: "/about" },
    { label: "Leadership", href: "/about#leadership" },
    { label: "Departments", href: "/about#departments" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a3d26] text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl font-[Outfit]">ا</span>
              </div>
              <div>
                <div className="text-base font-bold text-white font-[Outfit]">Al-Ibaanah</div>
                <div className="text-[10px] text-white/50 tracking-widest uppercase">Islamic Foundation</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Propagating authentic Islam upon the Qur'an and Sunnah, upon the understanding of the Salaf.
            </p>
            <div className="space-y-2.5 text-sm text-white/60">
              <a href="mailto:info@alif.ng" className="flex items-center gap-2 hover:text-[#d4a017] transition-colors">
                <Mail className="w-4 h-4 shrink-0" /> info@alif.ng
              </a>
              <a href="tel:+2348000000000" className="flex items-center gap-2 hover:text-[#d4a017] transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> +234 800 000 0000
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Al-Ibaanah Complex, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-[#d4a017] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick action cards */}
        <div className="mt-12 pt-10 border-t border-white/10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Heart, label: "Donate Now", desc: "Support our mission", href: "/donate", color: "from-rose-500 to-rose-600" },
            { icon: BookOpen, label: "Enroll in a Course", desc: "Begin your Islamic education", href: "/programs", color: "from-[#166534] to-[#15803d]" },
            { icon: Users, label: "Join as Member", desc: "Be part of the community", href: "/register", color: "from-[#b8860b] to-[#d4a017]" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-4 p-4 bg-white/6 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white font-[Outfit]">{item.label}</div>
                <div className="text-xs text-white/50">{item.desc}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {year} Al-Ibaanah Islamic Foundation. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Use</Link>
            <Link href="/sitemap.xml" className="hover:text-white/60 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
