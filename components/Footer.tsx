"use client";

import Image from "next/image";
import { Mail } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { key: "navHome", href: "#home" },
    { key: "navAbout", href: "#about" },
    { key: "navGoals", href: "#goals" },
    { key: "navPartners", href: "#partners" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t-4 border-brand text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/image/khotwa-logo.png"
                alt="Khotwa Logo"
                width={112}
                height={112}
                className="h-20 lg:h-28 w-auto object-contain bg-white rounded-xl p-2 shadow-sm"
              />
            </div>
            <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
              {t("footerDesc")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-start-7 lg:col-span-2">
            <h4 className="font-bold text-xl mb-6 text-white">{t("footerLinks")}</h4>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white ltr:hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition duration-300"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-bold text-xl mb-6 text-white">{t("footerContact")}</h4>
            <a
              href="mailto:khotwa.scc@gmail.com"
              className="flex items-center gap-4 text-gray-400 hover:text-white transition duration-300 mb-8 group"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-brand transition duration-300 shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-medium" dir="ltr">khotwa.scc@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 font-medium gap-4">
          <p>{t("footerRights")}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition duration-300">{t("footerPrivacy")}</a>
            <a href="#" className="hover:text-white transition duration-300">{t("footerTerms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
