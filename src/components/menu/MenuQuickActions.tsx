"use client";

import { MapPin, MessageCircle, Phone } from "lucide-react";

export function MenuQuickActions({
  whatsappHref,
  callHref,
  locationHref,
}: {
  whatsappHref: string;
  callHref: string;
  locationHref: string;
}) {
  return (
    <div
      className="fixed right-4 z-40 flex flex-col gap-2.5"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-[0.92] hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: "#22C55E",
          boxShadow:
            "0 6px 20px rgba(34, 197, 94, 0.38), 0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
        aria-label="Contact WhatsApp"
      >
        <MessageCircle className="h-5 w-5 text-white" aria-hidden="true" />
      </a>

      <a
        href={callHref}
        className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-[0.92] hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: "var(--pm-bg-card-elevated)",
          border: "1px solid var(--pm-border-medium)",
          color: "var(--pm-text-heading)",
          boxShadow: "var(--pm-shadow-fab)",
        }}
        aria-label="Appeler"
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
      </a>

      <a
        href={locationHref}
        target="_blank"
        rel="noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-[0.92] hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: "var(--pm-accent)",
          boxShadow:
            "0 6px 20px rgba(201, 136, 26, 0.38), 0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
        aria-label="Localisation sur la carte"
      >
        <MapPin className="h-[18px] w-[18px] text-white" aria-hidden="true" />
      </a>
    </div>
  );
}
