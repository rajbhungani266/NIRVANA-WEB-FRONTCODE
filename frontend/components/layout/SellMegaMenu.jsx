"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EnquireModal from "@/components/property/EnquireModal";

/*
  Sell is an action, not a category to browse — clicking options opens
  the quick lead enquiry form modal directly for smooth conversion.
*/

export const SELL_CATEGORY_LINKS = [
  { label: "Residential Property", href: "/post-property?property_category=residential" },
  { label: "Commercial Property", href: "/post-property?property_category=commercial" },
  { label: "Plot / Land", href: "/post-property?property_category=plot_weekend_villa" },
  { label: "Investment Property", href: "/post-property?property_category=investment" },
  { label: "Gift City Property", href: "/post-property?property_category=gift_city" },
];

export const SELL_USER_TYPE_LINKS = [
  { label: "Owner", href: "/post-property?user_type=owner" },
  { label: "Builder / Developer", href: "/post-property?user_type=builder" },
];

export const SELL_DEAL_TYPE_LINKS = [
  { label: "Sale", href: "/post-property?deal_type=sale" },
  { label: "Rental", href: "/post-property?deal_type=rental" },
  { label: "Resale", href: "/post-property?deal_type=resale" },
];

const WHY_SELL_ITEMS = [
  { icon: "🏷️", title: "Zero Brokerage", note: "No Hidden Charges" },
  { icon: "✅", title: "Verified Buyers Only", note: "No Time-Wasters" },
  { icon: "⚡", title: "Fast Closure", note: "Avg. 21 Days to Sell" },
  { icon: "📢", title: "Wide Reach", note: "10,000+ Active Buyers" },
];

const STATS_ITEMS = [
  { icon: "🏢", title: "5,000+", note: "Properties Listed" },
  { icon: "⚡", title: "21 Days", note: "Avg. Time to Sell" },
  { icon: "🤝", title: "10,000+", note: "Verified Buyers" },
  { icon: "⭐", title: "4.8/5", note: "Customer Rating" },
  { icon: "📞", title: "Quick Assistance", note: "Call us: 1800 41 99099" },
];

function ColumnHeading({ icon, children }) {
  return (
    <div className="group flex items-center gap-1.5 text-[13px] font-bold text-slate-900 cursor-default">
      <span className="text-sm transition-transform duration-200 group-hover:scale-110">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function MenuLink({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex w-full items-center justify-between text-xs text-slate-600 transition-colors duration-150 hover:text-[#a98440] py-1 text-left cursor-pointer"
    >
      <span className="transition-colors duration-150 group-hover:font-medium">
        {item.label}
      </span>
      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 text-[#a98440] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
    </button>
  );
}

export default function SellMegaMenu({ onClose = () => {} }) {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleSelect = (item) => {
    setSelectedEnquiry(item);
  };

  return (
    <div className="rounded-2xl border border-slate-100/90 bg-white/98 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.04] transition-all max-h-[calc(100vh-75px)] overflow-y-auto">
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_1fr_1.1fr_320px]">
        {/* I want to sell my... */}
        <div>
          <ColumnHeading icon="🏠">I want to sell my...</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {SELL_CATEGORY_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onSelect={handleSelect} />
            ))}
          </div>
        </div>

        {/* I am a... */}
        <div>
          <ColumnHeading icon="👤">I am a...</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {SELL_USER_TYPE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onSelect={handleSelect} />
            ))}
          </div>

          <div className="mt-3.5 border-t border-slate-100 pt-2.5">
            <ColumnHeading icon="🤝">Deal Type</ColumnHeading>
            <div className="mt-2 space-y-1.5">
              {SELL_DEAL_TYPE_LINKS.map((item) => (
                <MenuLink key={item.label} item={item} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        </div>

        {/* Why Sell With Us */}
        <div>
          <ColumnHeading icon="✨">Why Sell With Us</ColumnHeading>
          <div className="mt-2.5 space-y-2">
            {WHY_SELL_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-2 rounded-lg p-1.5 transition-all duration-150 hover:bg-[#fbf7ee] cursor-pointer"
              >
                <span className="text-base leading-none transition-transform duration-200 group-hover:scale-115">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-slate-900 group-hover:text-[#a98440] transition-colors leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured CTA card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-[#fbf7ee] to-white p-3.5 ring-1 ring-[#e2d1b3]/70 shadow-xs transition-all duration-200 hover:shadow-md h-full">
          <div className="flex flex-col flex-1 min-h-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-bold text-[#a98440] w-fit">
              💰 Free Tool
            </span>

            <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#a98440] transition-colors leading-tight">
              Free Property Valuation
            </h4>
            <p className="mt-1 text-[11px] leading-tight text-slate-500">
              Find out what your property is really worth — our experts analyze trends for free.
            </p>

            {/* Expanded Image Filling the Gap */}
            <div className="my-2.5 flex-1 min-h-[160px] overflow-hidden rounded-lg relative">
              <img
                src="/images/ninth.png"
                alt="Property valuation"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <Link
            href="/post-property"
            onClick={onClose}
            className="mt-3 block rounded-md bg-[#a98440] hover:bg-[#977232] py-2 text-center text-xs font-bold text-white shadow-xs transition active:scale-95 shrink-0"
          >
            Post Your Property →
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mt-4 border-t border-slate-100 pt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-700">
        {STATS_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2 py-1 px-1"
          >
            <span className="text-base">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                {item.title}
              </p>
              <p className="text-[9.5px] text-slate-400 truncate leading-tight">{item.note}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedEnquiry && (
        <EnquireModal
          property={{ title: selectedEnquiry.label }}
          category="sell"
          onClose={() => {
            setSelectedEnquiry(null);
            onClose();
          }}
        />
      )}
    </div>
  );
}
