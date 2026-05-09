"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, UserCheck, Building2, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

function CountUp({
  target,
  prefix,
}: {
  target: number;
  prefix: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let start: number | null = null;
          const duration = 2000;

          function step(ts: number) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(ease * target);
            if (el) el.textContent = prefix + current;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              if (el) el.textContent = prefix + target;
            }
          }
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, prefix]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
      {prefix}0
    </div>
  );
}

export default function Hero() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

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

  const stats = [
    { icon: Users, num: 200, prefix: "+", labelKey: "stat1Label" },
    { icon: UserCheck, num: 22, prefix: "+", labelKey: "stat2Label" },
    { icon: Building2, num: 7, prefix: "+", labelKey: "stat3Label" },
    { icon: Clock, num: 600, prefix: "+", labelKey: "stat4Label" },
  ];

  return (
    <section id="home" ref={sectionRef} className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 end-0 -z-10 w-2/3 h-full bg-brand/5 rounded-bl-[100px] rtl:rounded-bl-none rtl:rounded-br-[100px] opacity-70 blur-3xl" />
      <div className="absolute bottom-0 start-0 -z-10 w-1/3 h-1/2 bg-brand/10 rounded-tr-[100px] rtl:rounded-tr-none rtl:rounded-tl-[100px] opacity-60 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          {/* Text */}
          <div ref={useReveal} className="lg:col-span-6 text-center lg:text-start reveal">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              <span>{t("heroHeadline1")}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
                {t("heroHeadline2")}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {t("heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="bg-brand text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-light transition duration-300 shadow-xl shadow-brand/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 focus:ring-4 focus:ring-brand/50"
              >
                <span>{t("heroRegisterCta")}</span>
                <ArrowRight className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div ref={useReveal} className="lg:col-span-6 mt-16 lg:mt-0 relative reveal" style={{ transitionDelay: "200ms" }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand/20 border-[6px] border-white transform lg:-rotate-2 hover:rotate-0 transition duration-500 hover:scale-[1.02]">
            <Link href="/">
              <Image
                src="/image/2.jpeg"
                alt="Students in an office"
                width={800}
                height={600}
                className="w-full h-auto object-cover aspect-[4/3]"
                priority
              />

              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Stats Board */}
        <div ref={useReveal} className="mt-20 lg:mt-32 relative z-20 reveal" style={{ transitionDelay: "400ms" }}>
          <div className="bg-white/70 backdrop-blur-2xl border border-white isolate shadow-2xl shadow-brand/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-24 -end-24 w-48 h-48 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 lg:divide-x lg:rtl:divide-x-reverse divide-gray-200/60 relative z-10">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.labelKey}
                    className="text-center px-2 transform transition duration-500 hover:-translate-y-2 group"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 text-brand mb-5 group-hover:bg-brand group-hover:text-white transition-colors duration-500 shadow-inner">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CountUp target={stat.num} prefix={stat.prefix} />
                    <div className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest">
                      {t(stat.labelKey)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
