"use client";

import { useCallback } from "react";
import { Quote } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const stories = [
  {
    nameKey: "story1Name",
    roleKey: "story1Role",
    textKey: "story1Text",
    initials: "NA",
    bgClass: "bg-gradient-to-br from-gray-200 to-gray-300",
    initialsColor: "text-gray-500",
    delay: "150ms",
  },
  {
    nameKey: "story2Name",
    roleKey: "story2Role",
    textKey: "story2Text",
    initials: "AO",
    bgClass: "bg-gradient-to-br from-brand/20 to-brand/10",
    initialsColor: "text-brand",
    delay: "300ms",
  },
];

export default function Testimonials() {
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
    <section className="py-24 bg-gray-50 relative">
      <div className="absolute top-0 w-full h-1/2 bg-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-1 bg-brand rounded-full" />
            <h2 className="text-brand font-bold uppercase tracking-wide text-2xl md:text-3xl">
              {t("testimonialsTag")}
            </h2>
            <div className="w-10 h-1 bg-brand rounded-full" />
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            {t("testimonialsTitle")}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-start">
          {stories.map((story) => (
            <div
              key={story.nameKey}
              ref={useReveal}
              className="bg-white p-10 lg:p-12 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative group hover:-translate-y-2 transition duration-500 reveal"
              style={{ transitionDelay: story.delay }}
            >
              <div className="absolute top-10 end-10 text-brand/10 group-hover:text-brand/20 transition duration-300">
                <Quote className={`w-20 h-20 ${lang === "ar" ? "" : "rotate-180"}`} />
              </div>
              <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
                  <div className={`w-full h-full ${story.bgClass} flex items-center justify-center`}>
                    <span className={`text-xl font-bold ${story.initialsColor}`}>
                      {story.initials}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xl">{t(story.nameKey)}</h4>
                  <p className="text-brand font-bold text-sm mt-1">{t(story.roleKey)}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg relative z-10 font-medium">
                {t(story.textKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
