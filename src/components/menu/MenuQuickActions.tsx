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
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 sm:right-6">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="h-11 w-11 rounded-full bg-[#1bcf79] text-white grid place-items-center shadow-lg hover:scale-105 transition"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <a
        href={callHref}
        className="h-11 w-11 rounded-full bg-white text-[#111116] grid place-items-center shadow-lg hover:scale-105 transition"
      >
        <Phone className="h-4 w-4" />
      </a>
      <a
        href={locationHref}
        target="_blank"
        rel="noreferrer"
        className="h-11 w-11 rounded-full bg-[#d4a537] text-[#111116] grid place-items-center shadow-lg hover:scale-105 transition"
      >
        <MapPin className="h-4 w-4" />
      </a>
    </div>
  );
}
