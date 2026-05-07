"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations } from "@/lib/translations";

type Lang = "ar" | "en";

interface LanguageContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lang, setLang] = useState<Lang>("ar");

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("khotwa_lang") as Lang | null;
    if (saved === "en" || saved === "ar") {
      setLang(saved);
    }
  }, []);

  // Sync html attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      localStorage.setItem("khotwa_lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] ?? translations["ar"]?.[key] ?? key;
    },
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
