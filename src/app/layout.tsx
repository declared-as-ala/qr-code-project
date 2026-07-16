import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "ClickMenu — Digital QR menus for cafés & restaurants",
    template: "%s · ClickMenu",
  },
  description:
    "ClickMenu: build and manage premium digital QR menus for cafés and restaurants in minutes.",
  applicationName: "ClickMenu",
  appleWebApp: { capable: true, title: "ClickMenu", statusBarStyle: "black-translucent" },
  icons: {
    icon: "/logos/logo.png",
    shortcut: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-[#fafaf8] text-stone-900 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
