import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مبادرة خطوة | Khotwa Initiative",
  description:
    "برنامج مهني للظل الوظيفي يربط طلاب الجامعات بالشركات الرائدة في السوق السعودي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body
        className={`${cairo.variable} ${inter.variable} font-cairo bg-gray-50 text-gray-800 antialiased selection:bg-brand selection:text-white transition-colors duration-300`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
