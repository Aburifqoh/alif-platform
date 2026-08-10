"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, CreditCard, Copy, CheckCircle2, ChevronRight, Mic, Camera, Speaker, MonitorSmartphone, HelpCircle, Heart, HandCoins } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Mic, Camera, Speaker, MonitorSmartphone, Building2, Heart, HandCoins
};

export default function DonateClient({ initialCampaigns }: { initialCampaigns: any[] }) {
  const [copied, setCopied] = useState(false);
  const accountNumber = "0020310259";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">Support the Mission of Light</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-[Outfit] leading-tight">
            Donate to ALIF
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            “Whoever guides someone to goodness will have a reward like the one who did it.” — Ṣaḥīḥ Muslim.
            Your contribution goes towards Da'wah, medical outreaches, and welfare support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-12">
          
          {/* Left Column: Bank & Online Payment */}
          <div className="lg:col-span-3 space-y-8">
            
            <div className="bg-[#faf6ef] dark:bg-[#161b22] rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-6 flex items-center gap-3">
                <Building2 className="text-brand-red w-6 h-6" /> Direct Bank Transfer
              </h2>
              
              <div className="bg-white dark:bg-[#0d1117] rounded-2xl p-6 border border-gray-100 dark:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 dark:bg-brand-red-dark/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="space-y-5 relative z-10">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Bank Name</label>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">JAIZ BANK</div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Account Name</label>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">Al-Ibaanah Islamic Foundation</div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Account Number</label>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl sm:text-4xl font-bold text-brand-red dark:text-brand-red-light font-[Outfit] tracking-wider">
                        {accountNumber}
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl transition-all"
                        aria-label="Copy account number"
                      >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-sm leading-relaxed flex items-start gap-3">
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  No amount is too small. Your donations are used transparently for organizing lecture venues, printing da'wah materials, transporting outreach teams, medical supplies, and welfare support.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161b22] rounded-3xl p-8 border border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-2 flex items-center gap-3">
                <CreditCard className="text-brand-red w-6 h-6" /> Online Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Make a secure online donation using your debit card or bank app (Coming Soon).
              </p>
              
              <button disabled className="w-full py-4 px-6 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-xl font-semibold flex items-center justify-between cursor-not-allowed">
                <span>Pay via Paystack</span>
                <span className="text-xs uppercase tracking-wider bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">Coming Soon</span>
              </button>
            </div>

          </div>

          {/* Right Column: Current Needs & Transparency */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-[#faf6ef] dark:bg-[#161b22] rounded-3xl p-8 border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-6">Current Da'wah Needs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                We are currently seeking support to acquire the following items to significantly aid our Da'wah efforts and improve our services.
              </p>
              
              <div className="space-y-4">
                {initialCampaigns.length === 0 ? (
                   <div className="text-sm text-gray-500 py-4 text-center">No specific needs listed at the moment. General donations are still welcome!</div>
                ) : (
                  initialCampaigns.map((camp, i) => {
                    const Icon = ICONS[camp.icon_name] || Heart;
                    const progress = camp.goal_amount ? Math.min(100, Math.round((camp.raised_amount / camp.goal_amount) * 100)) : 0;
                    
                    return (
                      <div key={i} className="p-4 bg-white dark:bg-[#0d1117] rounded-xl border border-gray-100 dark:border-white/5">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-brand-red-subtle dark:bg-brand-red-dark/20 text-brand-red shrink-0 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{camp.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">{camp.description}</p>
                            
                            {camp.goal_amount > 0 && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-semibold text-brand-red dark:text-brand-red-light">₦{camp.raised_amount.toLocaleString()} raised</span>
                                  <span className="text-gray-500 dark:text-gray-400">Goal: ₦{camp.goal_amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-brand-red h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Want to sponsor a specific item?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Please contact us directly if you would like to purchase any of these items for the foundation.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red dark:text-brand-red-light hover:underline">
                  Contact Management <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
          
        </div>
      </section>
    </div>
  );
}
