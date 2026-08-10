"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Moon, Sun, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Who We Are", href: "/about" },
      { label: "Mission & Vision", href: "/about" },
      { label: "Leadership", href: "/about" },
      { label: "Official Information", href: "/about" },
    ],
  },
  {
    label: "Programmes",
    href: "/programmes",
  },
  { label: "Gallery", href: "/gallery" },
  { label: "News & Events", href: "/events" },
  { label: "Mosque", href: "/mosque" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPortal = pathname?.startsWith("/portal") || pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isPortal) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-white/8 py-2"
          : "bg-white dark:bg-[#0d1117] py-3"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Image 
            src="/logo.png" 
            alt="ALIF Logo" 
            width={48} 
            height={48} 
            className="w-10 h-10 object-contain sm:w-12 sm:h-12 drop-shadow-sm group-hover:drop-shadow-md transition-all"
          />
          <div className="hidden sm:block">
            <div className="text-[15px] font-bold text-brand-red dark:text-brand-red-light font-[Outfit] leading-none">
              Al-Ibaanah
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 tracking-widest uppercase leading-none mt-0.5">
              Islamic Foundation
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <div key={link.href} className="relative group">
              {link.children ? (
                <button
                  onMouseEnter={() => setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={cn(
                    "flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname?.startsWith(link.href)
                      ? "text-brand-red dark:text-brand-red-light bg-[#f0fdf4] dark:bg-brand-red-dark/30"
                      : "text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red-light hover:bg-[#f0fdf4] dark:hover:bg-brand-red-dark/20"
                  )}
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      activeDropdown === link.href ? "rotate-180" : ""
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-brand-red dark:text-brand-red-light bg-[#f0fdf4] dark:bg-brand-red-dark/30"
                      : "text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red-light hover:bg-[#f0fdf4] dark:hover:bg-brand-red-dark/20"
                  )}
                >
                  {link.label}
                </Link>
              )}

              {/* Dropdown */}
              {link.children && (
                <div
                  onMouseEnter={() => setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={cn(
                    "absolute top-full left-0 mt-1 w-52 bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/10 rounded-xl shadow-lg py-1.5 transition-all duration-200",
                    activeDropdown === link.href
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red-light hover:bg-[#f0fdf4] dark:hover:bg-brand-red-dark/20 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/10 rounded-xl shadow-lg py-1.5 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <Link
                  href="/portal"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red-light hover:bg-[#f0fdf4] dark:hover:bg-brand-red-dark/20"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link
                  href="/portal/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red-light hover:bg-[#f0fdf4] dark:hover:bg-brand-red-dark/20"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <div className="my-1 border-t border-gray-100 dark:border-white/8" />
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-red dark:hover:text-brand-red-light transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/donate"
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#b8860b] to-[#d4a017] rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-[Outfit]"
              >
                Donate
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-brand-red to-brand-red-dark rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-[Outfit]"
              >
                Join ALIF
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d1117] px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname?.startsWith(link.href)
                    ? "text-brand-red dark:text-brand-red-light bg-[#f0fdf4] dark:bg-brand-red-dark/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red-light hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-white/8">
            {user ? (
              <>
                <Link
                  href="/portal"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-brand-red dark:text-brand-red-light border border-brand-red/30 dark:border-brand-red-dark/40"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/donate"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#b8860b] to-[#d4a017] shadow-md"
                >
                  Donate
                </Link>
                <Link
                  href="/register"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-red to-brand-red-dark shadow-md"
                >
                  Join ALIF
                </Link>
                <Link
                  href="/login"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
