"use client";

import LanguageProvider, { useLanguage } from "./LanguageProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isRegister = pathname === "/register";

  return (
    <div className={lang === "en" ? "font-inter" : "font-cairo"}>
      {!isRegister && <Navbar />}
      {children}
      {!isRegister && <Footer />}
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <LayoutInner>{children}</LayoutInner>
    </LanguageProvider>
  );
}
