"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList, BedDouble, Users, Wrench,
  LayoutDashboard, ChevronLeft, Settings, CreditCard
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview",       href: "/portal/admin/hostel" },
  { icon: ClipboardList,   label: "Applications",   href: "/portal/admin/hostel/applications" },
  { icon: BedDouble,       label: "Rooms",           href: "/portal/admin/hostel/rooms" },
  { icon: Users,           label: "Residents",       href: "/portal/admin/hostel/residents" },
  { icon: CreditCard,      label: "Payments",        href: "/portal/admin/hostel/payments" },
  { icon: Wrench,          label: "Maintenance",     href: "/portal/admin/hostel/maintenance" },
  { icon: Settings,        label: "Settings",        href: "/portal/admin/hostel/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-60 lg:min-h-screen bg-white dark:bg-[#161b22] border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/8 flex-shrink-0">
        <div className="p-4 lg:p-5">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm font-[Outfit]">ا</span>
            </div>
            <div>
              <div className="text-xs font-bold text-brand-red dark:text-brand-red-light font-[Outfit]">ALIF Admin</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Hostel Management</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {navItems.map((item) => {
              const active = pathname === item.href ||
                (item.href !== "/portal/admin/hostel" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink
                    ${active
                      ? "bg-brand-red text-white shadow-sm"
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
          <div className="hidden lg:block mt-8 pt-5 border-t border-gray-100 dark:border-white/8">
            <Link
              href="/portal"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-red dark:hover:text-brand-red-light transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Portal
            </Link>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
