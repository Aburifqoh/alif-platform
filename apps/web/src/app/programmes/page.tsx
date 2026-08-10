import type { Metadata } from "next";
import Link from "next/link";
import { Mic, BookOpen, Calendar, Globe, Stethoscope, HandHeart, Users, Award, Book, GraduationCap, MapPin, Target, CircleHelp, HeartPulse, Shield, Lightbulb, Users2 } from "lucide-react";
import { createClient } from "@alif/database/server";

export const metadata: Metadata = {
  title: "Programmes & Activities | ALIF",
  description: "Explore the various Islamic, educational, and welfare programmes organized by Al-Ibaanah Islamic Foundation.",
};

// Whitelisted Icons map with a fallback
const ICON_MAP: Record<string, React.ElementType> = {
  Mic, Globe, Stethoscope, BookOpen, Calendar, HandHeart, Book, 
  GraduationCap, Award, Users, Target, HeartPulse, Shield, Lightbulb, Users2
};

// Next.js: opt out of static rendering if you want to pull fresh data
export const dynamic = "force-dynamic";

export default async function ProgrammesPage() {
  const supabase = await createClient();
  
  // Fetch only active programmes, ordered by sort_order
  const { data: programmes } = await supabase
    .from("alif_programmes")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const activeProgrammes = programmes || [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">Our Activities</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-[Outfit] leading-tight">
            ALIF Programmes
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the diverse range of educational, spiritual, and humanitarian initiatives we undertake to serve the Ummah.
          </p>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProgrammes.map((prog) => {
              const IconComp = ICON_MAP[prog.icon_name] || CircleHelp;

              return (
                <div key={prog.id} className="flex flex-col bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-xl transition-all group">
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-red/5 flex items-center justify-center">
                       <IconComp className="w-16 h-16 text-brand-red opacity-50 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-black/70 backdrop-blur text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white rounded-full shadow-sm">
                        {prog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-3 group-hover:text-brand-red dark:group-hover:text-brand-red-light transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                      {prog.description}
                    </p>
                    <Link href={`/donate?cause=${prog.slug}`} className="text-sm font-semibold text-brand-red dark:text-brand-red-light flex items-center gap-1 hover:gap-2 transition-all">
                      Support this programme <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {activeProgrammes.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                No programmes are currently active. Please check back later.
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#faf6ef] dark:bg-[#161b22] border-t border-gray-100 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-4">Want to participate?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Our programmes are open to all Muslims. Register to become a member and start attending our study circles, or volunteer for our outreach programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="px-8 py-3.5 bg-gradient-to-r from-brand-red to-brand-red-dark text-white font-semibold rounded-full hover:shadow-lg transition-all font-[Outfit]">
              Become a Member
            </Link>
            <Link href="/gallery" className="px-8 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
