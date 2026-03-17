import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import ThemeSync from "@/components/ThemeSync";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Multi-Entity Meeting Materials",
    template: "%s — Multi-Entity Meeting Materials",
  },
  description: "Corporate Secretary Workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="bg-[#f0f0f1] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans antialiased flex flex-col h-screen overflow-hidden">
        <ThemeSync />
        <Script
          src="/proto-panel.js"
          data-description="Multi-entity governance dashboard prototype"
          strategy="afterInteractive"
        />
        <TopNav />
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
