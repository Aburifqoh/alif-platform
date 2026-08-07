"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ClipboardList, CreditCard, Wrench,
  Users, ArrowLeft, Building2
} from "lucide-react";

const navItems = [
  { icon: Home,          label: "Dashboard",    href: "/portal/hostel" },
  { icon: ClipboardList, label: "My Application",href: "/portal/hostel/application" },
  { icon: CreditCard,    label: "Payments",     href: "/portal/hostel/payments" },
  { icon: Wrench,        label: "Maintenance",  href: "/portal/hostel/maintenance" },
  { icon: Users,         label: "Visitors",     href: "/portal/hostel/visitors" },
];

export default function HostelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 lg:min-h-screen bg-white dark:bg-[#161b22] border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/8 flex-shrink-0">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f5132] to-[#166534] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm font-[Outfit]">ALIF Hostel</div>
              <div className="text-xs text-gray-400">Resident Portal</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink
                    ${active
                      ? "bg-[#0f5132] text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Back to portal */}
          <div className="hidden lg:block mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
            <Link
              href="/portal"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to main portal
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
