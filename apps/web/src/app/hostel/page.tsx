import { createClient } from "@alif/database/server";
import {
  Calendar, CheckCircle2, ChevronRight, Home, Info, AlertTriangle, FileText, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Hostel Accommodation | ALIF",
  description: "Sky Villa & Al-Abraar Hostels accommodation details, application procedures, and requirements.",
};

export default async function HostelPage() {
  const supabase = await createClient();

  // Fetch settings
  const { data: settings } = await supabase
    .from("hostel_settings")
    .select("*")
    .limit(1)
    .single();

  // Fetch notices (current active)
  const { data: notices } = await supabase
    .from("hostel_notices")
    .select("*")
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  const sortedNotices = (notices || []).sort((a, b) => {
    const pWeight = { urgent: 3, important: 2, normal: 1 };
    const wA = pWeight[a.priority as keyof typeof pWeight] || 0;
    const wB = pWeight[b.priority as keyof typeof pWeight] || 0;
    return wB - wA;
  });

  // Fetch procedure
  const { data: steps } = await supabase
    .from("hostel_application_steps")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const fee = settings?.hostel_fee || 0;
  const currency = settings?.currency || "NGN";
  const formattedFee = new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(fee);

  const newAppOpen = settings?.application_open;
  const retOpen = settings?.retention_open;

  return (
    <div className="bg-[#faf6ef] dark:bg-[#0d1117] min-h-screen pb-20 pt-24 lg:pt-32">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green dark:bg-brand-green/20 dark:text-brand-green-light text-sm font-semibold mb-6">
          <Home className="w-4 h-4" />
          <span>ALIF Hostel Accommodation</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[Outfit] text-gray-900 dark:text-white mb-6">
          Sky Villa & Al-Abraar Hostels
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Premium Islamic accommodation providing a conducive environment for learning, spiritual growth, and brotherhood/sisterhood.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {newAppOpen && settings?.new_application_form_url ? (
            <a
              href={settings.new_application_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-2xl font-bold font-[Outfit] transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-brand-green/20"
            >
              Apply as New Applicant <ChevronRight className="w-5 h-5" />
            </a>
          ) : (
            <div className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold font-[Outfit] w-full sm:w-auto cursor-not-allowed">
              Applications Closed
            </div>
          )}

          {retOpen && settings?.retention_form_url ? (
            <a
              href={settings.retention_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white dark:bg-[#161b22] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold font-[Outfit] transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
            >
              Submit Retention Request <ChevronRight className="w-5 h-5" />
            </a>
          ) : null}
        </div>
      </section>

      {/* Notices */}
      {sortedNotices.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-[Outfit] text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-brand-green" />
              Important Notices
            </h2>
            <Link href="/hostel/notices" className="text-sm font-medium text-brand-green hover:underline">
              View All
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedNotices.slice(0, 4).map((notice) => (
              <Link
                key={notice.id}
                href={`/hostel/notices/${notice.slug}`}
                className={`block p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
                  notice.priority === 'urgent'
                    ? 'bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30 shadow-sm shadow-red-100 dark:shadow-none'
                    : 'bg-white dark:bg-[#161b22] border-gray-100 dark:border-white/5 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    notice.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                    notice.priority === 'important' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                    'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                  }`}>
                    {notice.notice_type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(notice.published_at || notice.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className={`font-bold font-[Outfit] text-lg mb-2 ${
                  notice.priority === 'urgent' ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
                }`}>
                  {notice.title}
                </h3>
                <p className={`line-clamp-2 text-sm ${
                  notice.priority === 'urgent' ? 'text-red-700 dark:text-red-300/80' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {notice.content}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Info Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-6">
              <span className="text-xl font-bold font-serif">₦</span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Hostel Fee (Session {settings?.session_name})</h3>
            <div className="text-3xl font-bold font-[Outfit] text-gray-900 dark:text-white">{formattedFee}</div>
          </div>
          
          <div className="bg-white dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Application Deadline</h3>
            <div className="text-xl font-bold font-[Outfit] text-gray-900 dark:text-white">
              {settings?.application_deadline ? new Date(settings.application_deadline).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "To be announced"}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Retention Deadline</h3>
            <div className="text-xl font-bold font-[Outfit] text-gray-900 dark:text-white">
              {settings?.retention_deadline ? new Date(settings.retention_deadline).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "To be announced"}
            </div>
          </div>
        </div>
      </section>

      {/* Application Procedure */}
      {steps && steps.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-[Outfit] text-gray-900 dark:text-white mb-4">Application Procedure</h2>
            <p className="text-gray-600 dark:text-gray-400">Follow these steps carefully to complete your hostel application.</p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-green/0 before:via-brand-green/20 before:to-brand-green/0">
            {steps.map((step: any, index: number) => (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#faf6ef] dark:border-[#0d1117] bg-white dark:bg-[#161b22] text-brand-green shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold font-[Outfit] text-lg">
                  {step.step_number}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 shadow-sm transition-all hover:shadow-md hover:border-brand-green/30">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 font-[Outfit]">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Requirements & Contacts */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-brand-green-subtle/50 dark:bg-brand-green-dark/10 p-8 rounded-3xl border border-brand-green/10">
            <h3 className="font-bold font-[Outfit] text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-green" />
              Important Information
            </h3>
            <ul className="space-y-4">
              {[
                "Application does not guarantee admission.",
                "Interview and screening may be required.",
                "Payment must not be made without official approval or instructions.",
                "Payment alone does not guarantee room allocation.",
                "Payment must be officially verified before allocation.",
                "Applicants must comply strictly with all ALIF hostel rules."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            {settings?.general_information && (
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap pt-6 border-t border-brand-green/10">
                {settings.general_information}
              </p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5">
            <h3 className="font-bold font-[Outfit] text-xl text-gray-900 dark:text-white mb-6">Contact & Enquiries</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hostel Address</p>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                  {settings?.hostel_address || "ALIF Headquarters,\nAsa Dam, Ilorin, Kwara State."}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Lines</p>
                <div className="space-y-2">
                  {[settings?.contact_phone_1, settings?.contact_phone_2, settings?.contact_phone_3].filter(Boolean).map((phone, i) => (
                    <a key={i} href={`tel:${phone}`} className="block text-brand-green hover:underline font-medium font-mono text-sm">
                      {phone}
                    </a>
                  ))}
                  {![settings?.contact_phone_1, settings?.contact_phone_2, settings?.contact_phone_3].filter(Boolean).length && (
                    <p className="text-sm text-gray-500">No contact numbers available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
