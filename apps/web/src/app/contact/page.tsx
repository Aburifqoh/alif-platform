import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ALIF",
  description: "Get in touch with Al-Ibaanah Islamic Foundation. Contact us for inquiries, registration details, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-charcoal via-[#24465B] to-brand-blue-dark text-white">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contactPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contactPattern)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-[Outfit] tracking-tight">Contact Us</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Have any questions or inquiries? Reach out to us, and we will get back to you as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm space-y-8">
            <h2 className="text-xl font-bold font-[Outfit] border-b pb-3 border-gray-100 dark:border-white/5">Contact Info</h2>
            
            <div className="space-y-6">
              <ContactInfoRow 
                icon={<Phone className="w-5 h-5 text-[#b8860b]" />}
                title="Phone" 
                detail="+234 (0) 803 123 4567"
              />
              <ContactInfoRow 
                icon={<Mail className="w-5 h-5 text-[#b8860b]" />}
                title="Email" 
                detail="info@alif.ng"
              />
              <ContactInfoRow 
                icon={<MapPin className="w-5 h-5 text-[#b8860b]" />}
                title="Address" 
                detail="ALIF Centre, Plot 245, Islamic Area, Garki, Abuja, Nigeria"
              />
              <ContactInfoRow 
                icon={<Clock className="w-5 h-5 text-[#b8860b]" />}
                title="Office Hours" 
                detail="Mon - Fri: 8:00 AM - 5:00 PM"
              />
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold font-[Outfit] border-b pb-3 border-gray-100 dark:border-white/5">Send a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-[#b8860b] focus:border-transparent outline-none resize-none" required></textarea>
              </div>

              <button 
                type="submit" 
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-[Outfit] text-sm"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoRow({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 rounded-2xl shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm font-[Outfit] text-gray-900 dark:text-white leading-none mb-1">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
