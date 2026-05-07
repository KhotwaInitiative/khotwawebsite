"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

export default function About() {
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
    <section id="about" className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
          {/* Image */}
          <div ref={useReveal} className="order-2 lg:order-1 mt-16 lg:mt-0 relative group reveal">
            <div className="absolute -inset-4 bg-brand/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white hover:scale-[1.01] transition duration-500">
              <Image
                src="/image/1.jpeg"
                alt="Team meeting"
                width={800}
                height={600}
                className="w-full h-auto object-cover aspect-square md:aspect-[4/3]"
              />
            </div>
          </div>

          {/* Text */}
          <div ref={useReveal} className="order-1 lg:order-2 text-start reveal" style={{ transitionDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-brand rounded-full" />
              <h2 className="text-brand font-bold uppercase tracking-wide text-2xl md:text-3xl">
                {t("aboutTag")}
              </h2>
            </div>
            <p className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
              {t("aboutDesc1")}
            </p>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
              {t("aboutDesc2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
