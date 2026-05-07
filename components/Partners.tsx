"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

const partnerLogos = [
  "p1.jpg", "p2.jpg", "P3.jpg", "p4.jpg", "p5.jpg", "p6.jpg", "p7.jpg",
  "p8.jpg", "p9.png", "p10.jpg", "p11.jpg", "p12.jpg", "p13.jpg", "p14.webp",
];

const bgColors = [
  "bg-blue-50", "bg-yellow-50", "bg-emerald-50", "bg-purple-50",
  "bg-red-50", "bg-indigo-50", "bg-teal-50",
];

const sizes = [
  "w-24 h-24 md:w-32 md:h-32",
  "w-24 h-24 md:w-36 md:h-36",
  "w-20 h-20 md:w-28 md:h-28",
  "w-28 h-28 md:w-40 md:h-40",
];

const floatClasses = ["animate-float-1", "animate-float-2", "animate-float-3"];

export default function Partners() {
  const { t } = useLanguage();

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
    <section id="partners" className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={useReveal} className="text-center mb-16 relative z-10 w-full reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-1 bg-brand rounded-full" />
            <h2 className="text-brand font-bold uppercase tracking-wide text-2xl md:text-3xl">
              {t("partnersTag")}
            </h2>
            <div className="w-10 h-1 bg-brand rounded-full" />
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            {t("partnersTitle")}
          </h3>
          <p className="text-gray-500 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("partnersDesc")}
          </p>
        </div>

        <div ref={useReveal} className="relative w-full overflow-visible py-16 reveal" style={{ transitionDelay: "200ms" }}>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-2 gap-y-12 items-center justify-items-center relative z-10 w-full">
            {partnerLogos.map((logo, i) => {
              const color = bgColors[i % bgColors.length];
              const size = sizes[i % sizes.length];
              const float = floatClasses[i % floatClasses.length];
              const margin = i % 2 === 0 ? "mb-8 md:mb-16" : "mt-8 md:mt-16";

              return (
                <div
                  key={logo}
                  className={`${color} ${size} ${margin} ${float} rounded-full flex items-center justify-center shadow-lg shadow-gray-200/50 hover:!-translate-y-2 transition duration-500 cursor-pointer overflow-hidden p-4 md:p-6 shrink-0 border-4 border-white backdrop-blur-sm relative group`}
                >
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition duration-300" />
                  <Image
                    src={`/image/khotwa-partners/${logo}`}
                    alt="Partner"
                    width={120}
                    height={120}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm relative z-10 transition duration-500 transform group-hover:scale-110"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
