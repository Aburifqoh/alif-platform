import Link from 'next/link';
import { Home, ShoppingBag, BedDouble, Settings, Image, Calendar, Users, LogOut, Heart, Bell } from 'lucide-react';

export default function AdminSidebar() {
  const routes = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Donations', icon: Heart, href: '/donations' },
    { label: 'Marketplace', icon: ShoppingBag, href: '/marketplace' },
    { label: 'Hostel', icon: BedDouble, href: '/hostel' },
    { label: 'Hostel Settings', icon: Settings, href: '/hostel/settings' },
    { label: 'Hostel Notices', icon: Bell, href: '/hostel/notices' },
    { label: 'Hostel Procedure', icon: Calendar, href: '/hostel/procedure' },
    { label: 'Gallery', icon: Image, href: '/gallery' },
    { label: 'Programmes', icon: Calendar, href: '/programmes' },
    { label: 'Notifications', icon: Bell, href: '/notifications' },
    { label: 'Users & Roles', icon: Users, href: '/users' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">ALIF Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800"
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
