"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "rgba(212, 165, 55, 0.08)" }: SpotlightProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-30 h-[169%] w-[138%] l-[-20%] t-[-30%] lg:w-[84%] opacity-0 animate-fade-up",
        className
      )}
      style={{
        animationDelay: "0.2s",
        animationFillMode: "forwards",
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter-spotlight)">
        <ellipse
          cx="1924.5"
          cy="273"
          rx="1924.5"
          ry="273"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291)"
          fill={fill}
          fillOpacity="1"
        />
      </g>
      <defs>
        <filter
          id="filter-spotlight"
          x="0.860352"
          y="-383.89"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  );
}
