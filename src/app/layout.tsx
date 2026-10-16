import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${HOME_TITLE} | ${SITE_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "menu digital Tunisie",
    "menu digital en Tunisie",
    "menu QR code Tunisie",
    "menu QR code restaurant",
    "menu QR café",
    "carte digitale restaurant",
    "menu numérique restaurant Tunisie",
    "QR code menu café Tunis",
    "ClickMenu",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: SITE_NAME,
    url: "/",
    title: `${HOME_TITLE} | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    images: [{ url: "/logos/clickmenu-mark-512.png", width: 512, height: 512, alt: "ClickMenu — menu digital en Tunisie" }],
  },
  twitter: {
    card: "summary",
    title: `${HOME_TITLE} | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    images: ["/logos/clickmenu-mark-512.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
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
