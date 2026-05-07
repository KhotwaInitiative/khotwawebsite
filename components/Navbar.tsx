"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function Navbar() {
  const { lang, t, toggleLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    let lastScroll = 0;
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 100);
      lastScroll = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { key: "navHome", href: "/" },
    { key: "navAbout", href: "#about" },
    { key: "navGoals", href: "#goals" },
    { key: "navPartners", href: "#partners" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[98%] max-w-[1400px] bg-white/80 backdrop-blur-xl z-50 rounded-[2rem] shadow-lg shadow-brand/5 border border-white/50 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        hidden ? "nav-hidden" : ""
      }`}
    >
      <div className="px-6 md:px-8">
        <div className="flex justify-between items-center py-1 relative">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-start cursor-pointer mx-2 md:mx-4 flex-1 z-[60]">
            <Link href="/">
              <Image
                src="/image/khotwa-logo.png"
                alt="Khotwa Logo"
                width={96}
                height={96}
                className="h-16 md:h-24 w-auto object-contain transition-all mix-blend-multiply drop-shadow-sm hover:scale-105"
              />
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex gap-10 lg:gap-14 items-center justify-center flex-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-gray-600 hover:text-brand font-semibold transition-colors"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-gray-600 hover:text-brand font-semibold transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span>{lang === "ar" ? "English" : "عربي"}</span>
            </button>
            <Link
              href="/register"
              className="bg-brand text-white px-5 py-2 rounded-[1.5rem] font-semibold hover:bg-brand-light transition duration-300 shadow-md shadow-brand/20 hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
            >
              {t("navRegister")}
            </Link>
          </div>

          {/* Mobile tools */}
          <div className="md:hidden flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-gray-600 hover:text-brand font-semibold transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">
                {lang === "ar" ? "English" : "عربي"}
              </span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-600 hover:text-brand focus:outline-none"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 border-t border-gray-100 flex flex-col gap-4 text-center">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="block text-gray-600 hover:text-brand font-semibold transition-colors text-lg"
              onClick={() => setMobileOpen(false)}
            >
              {t(link.key)}
            </a>
          ))}
          <div className="mt-2 pt-4 border-t border-gray-50 flex justify-center">
            <Link
              href="/register"
              className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-light transition duration-300 shadow-md inline-block w-full max-w-xs"
              onClick={() => setMobileOpen(false)}
            >
              {t("navRegister")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
