"use client";

import { Coffee, Soup, UtensilsCrossed, CakeSlice } from "lucide-react";

const NAV = [
  { label: "Main dish", icon: UtensilsCrossed, active: true },
  { label: "Appetizer", icon: Soup, active: false },
  { label: "Desserts", icon: CakeSlice, active: false },
  { label: "Drink", icon: Coffee, active: false },
];

export function MenuBottomNav() {
  return (
    <div className="mt-6 rounded-[28px] bg-[#f7f2ea] p-3 shadow-inner">
      <div className="grid grid-cols-4 gap-2">
        {NAV.map((item) => (
          <button
            key={item.label}
            className={`rounded-2xl py-3 text-center transition-all ${
              item.active ? "bg-[#101014] text-white shadow-lg" : "bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <item.icon className="mx-auto h-4 w-4" />
            <p className="mt-1 text-[10px] font-medium">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
