import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Users, BookOpen, Globe, Heart, Award, Target, Activity, Stethoscope, HandHeart, Book, GraduationCap, Mic, Building2, MapPin, Mail, Phone, Calendar, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About Al-Ibaanah Islamic Foundation | ALIF",
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

  const objectives = [
    { icon: HeartHandshake, title: "Promotion of Islamic Values", desc: "Teaching the Qur’an, Hadith, and Sunnah with adherence to Salafi methodology, and fostering moral reformation." },
    { icon: HandHeart, title: "Support for Vulnerable Populations", desc: "Supporting orphans, widows, the poor, and other vulnerable groups through sustained social welfare programs." },
    { icon: GraduationCap, title: "Educational Development", desc: "Organizing Arabic-medium Qur’an and Islamic studies classes both physically and online for comprehensive learning." },
    { icon: Building2, title: "Community Development", desc: "Promoting peaceful coexistence, organizing community services, public lectures, khutbahs, and outreach programs." },
    { icon: Globe, title: "Partnerships and Growth", desc: "Collaborating with lawful Islamic and humanitarian organizations for community upliftment and poverty reduction." },
  ];

  const activities = [
    { title: "Da'wah Enlightenment", desc: "Spreading the correct understanding of Islam through continuous lectures and talks.", icon: Mic },
    { title: "General Meeting", desc: "Regular gatherings to foster unity, plan activities, and strengthen community bonds.", icon: Users },
    { title: "Sisters' Circle", desc: "Dedicated educational and spiritual programs specifically designed for Muslim sisters.", icon: Book },
    { title: "Orientation Week", desc: "Welcoming and guiding freshers and new members into the ALIF community.", icon: MapPin },
    { title: "Madrasah", desc: "Structured Islamic education focusing on Arabic, Aqeedah, Fiqh, and more.", icon: BookOpen },
    { title: "Ramadan Programmes", desc: "Tafseer, Iftar gatherings, Qiyam, and special spiritual activities during the blessed month.", icon: Calendar },
    { title: "Public Lectures", desc: "Open lectures featuring scholars to educate the general public on vital Islamic topics.", icon: Mic },
    { title: "Rural Da'wah", desc: "Village outreach programs aimed at teaching Islam and supporting remote communities.", icon: Globe },
    { title: "Halqoh", desc: "Intensive study circles for deep and focused learning of classical Islamic texts.", icon: Book },
    { title: "Tutorial Classes", desc: "Academic support and tutorial classes for students in secular and Islamic studies.", icon: GraduationCap },
    { title: "Qur'an Competition", desc: "Annual quiz and Qur'an memorization competitions to encourage Hifdh and study.", icon: Award },
    { title: "Sec. Sch Da'wah", desc: "Outreach programs designed specifically for secondary school students to build early foundations.", icon: Target },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">About Us</span>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold font-[Outfit] leading-tight">
            Al-Ibaanah Islamic Foundation
          </h1>
          <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive Islamic institution dedicated to propagating authentic Islam 
            and serving the Muslim community through education, Da'wah, and welfare.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/programmes" className="px-8 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-full transition-all font-[Outfit]">
              Explore Our Programmes
            </Link>
            <Link href="/donate" className="px-8 py-3.5 border border-white/20 hover:bg-white/10 text-white font-medium rounded-full transition-all font-[Outfit]">
              Support ALIF
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are & History */}
      <section className="py-20 bg-white dark:bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-red dark:text-brand-red-light text-sm font-semibold uppercase tracking-widest">Who We Are</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white font-[Outfit]">History & Background</h2>
            <div className="mt-5 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Al-Ibaanah Islamic Foundation (ALIF) is a non-governmental, non-political, and non-profit religious organization 
                committed to Islamic da'wah, education, and community development, guided by authentic Islamic sources.
              </p>
              <p>
                Over the years, ALIF has grown into a fully-fledged Islamic institution. We are heavily involved in Qur'an 
                and Islamic education, rural da'wah, medical outreach, welfare support, and youth development. We strive 
                to spread the correct understanding of Islam, revive the Sunnah, serve neglected communities, and uplift lives.
              </p>
            </div>

            <div className="mt-10 grid gap-6">
              <div className="p-6 bg-brand-red-subtle dark:bg-brand-red-dark/10 border-l-4 border-brand-red rounded-r-xl">
                <h3 className="text-lg font-bold text-brand-red dark:text-brand-red-light font-[Outfit] mb-2">Our Vision</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  To be a leading and trusted platform for authentic Islamic education, spiritual growth, and comprehensive community development based on the Qur'an and Sunnah.
                </p>
              </div>
              <div className="p-6 bg-brand-red-subtle dark:bg-brand-red-dark/10 border-l-4 border-brand-red rounded-r-xl">
                <h3 className="text-lg font-bold text-brand-red dark:text-brand-red-light font-[Outfit] mb-2">Our Mission</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  To spread the correct understanding of Islam, revive the Sunnah, serve neglected communities, and uplift lives through Islamic guidance and humanitarian care.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative h-64 rounded-2xl overflow-hidden mb-2">
              <img src="/placeholder-event.jpg" alt="ALIF Community" className="w-full h-full object-cover bg-gray-200 dark:bg-gray-800" />
            </div>
            {[
              { label: "Year Established", value: "2010" },
              { label: "Active Members", value: "2,000+" },
            ].map((s) => (
              <div key={s.label} className="p-6 bg-[#faf6ef] dark:bg-[#161b22] rounded-2xl text-center border border-gray-100 dark:border-white/5">
                <div className="text-3xl font-bold text-brand-red dark:text-brand-red-light font-[Outfit]">{s.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aims & Objectives */}
      <section className="py-20 bg-[#faf6ef] dark:bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-red dark:text-brand-red-light text-sm font-semibold uppercase tracking-widest">Our Focus</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white font-[Outfit]">Aims & Objectives</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The foundational goals that drive all activities at Al-Ibaanah Islamic Foundation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <div key={i} className="bg-white dark:bg-[#0d1117] p-8 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-red/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-brand-red-subtle dark:bg-brand-red-dark/30 text-brand-red flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <obj.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-3">{obj.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Activities */}
      <section className="py-20 bg-white dark:bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-red dark:text-brand-red-light text-sm font-semibold uppercase tracking-widest">What We Do</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white font-[Outfit]">Foundation Activities</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our ongoing programmes and initiatives designed to educate, support, and uplift the Muslim community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.map((act, i) => (
              <div key={i} className="p-5 bg-gray-50 dark:bg-[#161b22] rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-red-subtle dark:bg-brand-red-dark/20 text-brand-red flex items-center justify-center shrink-0">
                    <act.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white font-[Outfit] leading-tight">{act.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{act.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/programmes" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              View All Programmes →
            </Link>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-gradient-to-br from-[#0a3d26] to-[#0f5132] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-[Outfit]">Our Impact</h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              By the grace of Allah, ALIF continues to reach communities and touch lives through our various programs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 border-t border-white/10 pt-12">
            <div className="text-center px-4">
              <div className="text-4xl sm:text-5xl font-bold font-[Outfit] text-[#d4a017] mb-2">—</div>
              <div className="text-sm font-medium uppercase tracking-wider text-white/80">Communities Reached</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl sm:text-5xl font-bold font-[Outfit] text-[#d4a017] mb-2">—</div>
              <div className="text-sm font-medium uppercase tracking-wider text-white/80">Programmes Conducted</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl sm:text-5xl font-bold font-[Outfit] text-[#d4a017] mb-2">—</div>
              <div className="text-sm font-medium uppercase tracking-wider text-white/80">Students Taught</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl sm:text-5xl font-bold font-[Outfit] text-[#d4a017] mb-2">—</div>
              <div className="text-sm font-medium uppercase tracking-wider text-white/80">People Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Governance */}
      <section className="py-20 bg-[#faf6ef] dark:bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-red dark:text-brand-red-light text-sm font-semibold uppercase tracking-widest">Leadership</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white font-[Outfit]">Governance Structure</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our organization is structured to ensure accountability, transparency, and adherence to Islamic principles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#0d1117] p-8 rounded-2xl border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-brand-red dark:text-brand-red-light font-[Outfit] mb-4">Board of Trustees</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Provides legal oversight, strategic direction, and approval of major organizational decisions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                  <span className="font-medium text-gray-900 dark:text-white">Mustapha Luqman Gbolahan</span>
                  <span className="text-xs text-gray-500">(Chairman)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                  <span className="font-medium text-gray-900 dark:text-white">Adeniji Lukman</span>
                  <span className="text-xs text-gray-500">(Secretary)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#0d1117] p-8 rounded-2xl border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-brand-red dark:text-brand-red-light font-[Outfit] mb-4">Executive Council</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Responsible for policy execution, day-to-day management, program coordination, and financial oversight.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-red" /> Director-General</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-red" /> Secretary-General</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-red" /> Financial Secretary</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-red" /> Da’wah & Education Coordinators</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#0d1117] p-8 rounded-2xl border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-brand-red dark:text-brand-red-light font-[Outfit] mb-4">Advisory Council</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Comprised of senior scholars and elders providing Shari’ah guidance and conflict resolution.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                  <span className="font-medium text-gray-900 dark:text-white">Sheikh Dr. Sharaf Gbadebo Raaji</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                  <span className="font-medium text-gray-900 dark:text-white">Sheikh Abdulgaffaar Oniwiridi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Official Information & CTA */}
      <section className="py-20 bg-white dark:bg-[#0d1117]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#faf6ef] dark:bg-[#161b22] rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-white/5 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-6">Official Information</h2>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
              <div className="flex flex-col items-center text-center p-4">
                <Award className="w-8 h-8 text-brand-red mb-3" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Registration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">CAC RC Number:<br/>7913296</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <MapPin className="w-8 h-8 text-brand-red mb-3" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Headquarters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">No. 12, Orisunbare St, Off Egbejila Rd, Asa Dam, Ilorin, Kwara State</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Phone className="w-8 h-8 text-brand-red mb-3" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Contact</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">08100015106<br/>ibaanah.fdn@gmail.com</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Support Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join our growing community and contribute to the mission of authentic Islamic propagation, 
                humanitarian care, and educational excellence.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/donate" className="px-8 py-3.5 bg-gradient-to-r from-brand-red to-brand-red-dark text-white font-semibold rounded-full hover:shadow-lg transition-all font-[Outfit]">
                  Support ALIF
                </Link>
                <Link href="/contact" className="px-8 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
