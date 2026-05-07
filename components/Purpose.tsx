"use client";

import { useCallback } from "react";
import {
  Handshake,
  Briefcase,
  Lightbulb,
  Compass,
  Users,
  GraduationCap,
  Quote,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const goals = [
  { icon: Handshake, titleKey: "goal1Title", descKey: "goal1Desc", delay: "100ms" },
  { icon: Briefcase, titleKey: "goal2Title", descKey: "goal2Desc", delay: "200ms" },
  { icon: Lightbulb, titleKey: "goal3Title", descKey: "goal3Desc", delay: "300ms" },
  { icon: Compass,   titleKey: "goal4Title", descKey: "goal4Desc", delay: "400ms" },
  { icon: Users,     titleKey: "goal5Title", descKey: "goal5Desc", delay: "500ms" },
  { icon: GraduationCap, titleKey: "goal6Title", descKey: "goal6Desc", delay: "600ms" },
];

export default function Purpose() {
  const { lang, t } = useLanguage();

  const useReveal = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(node);
  }, []);

  return (
    <section id="goals" className="py-32 bg-brand text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 60L60 0H30L0 30M60 60V30L30 60" fill="currentColor" fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Decoration */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 rtl:-translate-x-1/3" />
      <div className="absolute bottom-0 start-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 rtl:translate-x-1/4" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div ref={useReveal} className="inline-flex items-center gap-3 mb-8 reveal">
          <div className="w-10 h-1 bg-white/50 rounded-full" />
          <h2 className="text-white/80 font-bold uppercase tracking-wide text-2xl md:text-3xl">
            {t("goalsTag")}
          </h2>
          <div className="w-10 h-1 bg-white/50 rounded-full" />
        </div>

        <div ref={useReveal} className="relative mt-8 reveal" style={{ transitionDelay: "150ms" }}>
          <Quote className={`absolute -top-12 -start-8 w-24 h-24 text-white/10 ${lang === "ar" ? "" : "rotate-180"}`} />
          <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold leading-relaxed text-white max-w-3xl mx-auto mb-4 relative z-10">
            {t("goalsDesc")}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-20 text-start relative z-10">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <div
                key={goal.titleKey}
                ref={useReveal}
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/20 transition duration-300 reveal"
                style={{ transitionDelay: goal.delay }}
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{t(goal.titleKey)}</h4>
                <p className="text-white/80 leading-relaxed font-medium">{t(goal.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
