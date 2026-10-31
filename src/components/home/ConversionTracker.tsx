"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackWhatsAppConversion(payload: {
  pathname: string;
  ctaLocation: string;
  ctaLabel: string;
  href: string;
}) {
  try {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "whatsapp_lead_click",
        page_path: payload.pathname,
        cta_location: payload.ctaLocation,
        cta_label: payload.ctaLabel,
      });
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          event_category: "engagement",
          event_label: `${payload.pathname} | ${payload.ctaLocation}`,
        });
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact", {
          content_name: payload.pathname,
          content_category: payload.ctaLocation,
        });
      }
    }

    const body = JSON.stringify({
      eventType: "whatsapp_click",
      pathname: payload.pathname,
      ctaLocation: payload.ctaLocation,
      ctaLabel: payload.ctaLabel,
      href: payload.href,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/conversion", blob);
    } else {
      fetch("/api/analytics/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Non-blocking analytics
  }
}

export function ConversionTracker() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.includes("wa.me/")) return;

      const ctaLocation =
        anchor.getAttribute("data-cta-location") ||
        (anchor.closest("header")
          ? "navbar"
          : anchor.closest("footer")
          ? "footer"
          : "inline_cta");
      const ctaLabel = (anchor.textContent || "WhatsApp").trim().replace(/\s+/g, " ");

      trackWhatsAppConversion({
        pathname: window.location.pathname || pathname,
        ctaLocation,
        ctaLabel,
        href,
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  // Show floating WhatsApp CTA on commercial/marketing pages, hide on dashboard, admin, auth, and live restaurant menus
  const isPrivateOrMenuView =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/menu/");

  if (isPrivateOrMenuView) return null;

  const prefill = buildWhatsAppUrl(
    `Bonjour ClickMenu, je visite ${pathname === "/" ? "votre site" : pathname} et je souhaite une démo pour mon établissement.`
  );

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href={prefill}
        target="_blank"
        rel="noreferrer"
        data-cta-location="floating_whatsapp_button"
        aria-label="Contacter ClickMenu sur WhatsApp pour une démo"
        className="group flex items-center gap-2.5 rounded-full border border-black/10 bg-[#111] px-4 py-3 text-xs font-bold text-white shadow-[0_16px_38px_-10px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:bg-black active:scale-95 sm:px-5 sm:py-3.5 sm:text-sm"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-black">
          <MessageSquare className="h-3.5 w-3.5 fill-current" />
        </span>
        <span>Démo WhatsApp · 48h</span>
      </a>
    </div>
  );
}

