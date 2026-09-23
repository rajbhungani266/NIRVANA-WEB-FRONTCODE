"use client";

import Link from "next/link";
import {
  Building2,
  Layers,
  Handshake,
  Sparkles,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
  Lock,
  PhoneCall,
  FileEdit,
  ArrowRight,
} from "lucide-react";

// Query params match GiftCityProperty's filterset_fields exactly
// (see backcode views.py).
export const GIFT_PROPERTY_TYPE_LINKS = [
  { label: "Office Spaces", href: "/gift-city?gift_property_type=office" },
  { label: "Residential Units", href: "/gift-city?gift_property_type=residential" },
  { label: "Commercial Spaces", href: "/gift-city?gift_property_type=commercial" },
  { label: "Investment Opportunities", href: "/gift-city?gift_property_type=investment" },
];

export const GIFT_ZONE_LINKS = [
  { label: "SEZ (Special Economic Zone)", href: "/gift-city?zone=sez" },
  { label: "DTA (Domestic Tariff Area)", href: "/gift-city?zone=dta" },
];

export const GIFT_DEAL_TYPE_LINKS = [
  { label: "For Sale", href: "/gift-city?deal_type=sale" },
  { label: "For Rent", href: "/gift-city?deal_type=rental" },
];

// Marketing highlights, not filters — no anchored sections exist on the page
// yet, so these just browse GIFT City rather than link to a #fragment that
// goes nowhere.
export const GIFT_HIGHLIGHT_LINKS = [
  { label: "Tax Benefits", href: "/gift-city" },
  { label: "IFSC Status", href: "/gift-city" },
  { label: "World-Class Infrastructure", href: "/gift-city" },
  { label: "International Business Hub", href: "/gift-city" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "SEZ / RERA Compliant", note: "100% Verified Towers" },
  { icon: Tag, title: "Zero Brokerage", note: "Direct from Builders" },
  { icon: Users, title: "Expert Guidance", note: "From GIFT City Specialists" },
  { icon: Lock, title: "Secure & Transparent", note: "Trusted by 10,000+ Customers" },
  { icon: PhoneCall, title: "Quick Assistance", note: "Call us: 1800 41 99099" },
];

function ColumnHeading({ icon: Icon, children }) {
  return (
    <div className="group flex items-center gap-2 text-[13px] font-bold text-slate-900 cursor-default">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#a98440]/10 text-[#a98440]">
        <Icon className="h-3 w-3" />
      </span>
      <span>{children}</span>
    </div>
  );
}

function MenuLink({ item, onClose }) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="group flex items-center justify-between text-xs text-slate-600 transition-colors duration-150 hover:text-[#a98440] py-1"
    >
      <span className="transition-colors duration-150 group-hover:font-medium">
        {item.label}
      </span>
      <ArrowRight className="opacity-0 -translate-x-1 h-3 w-3 text-[#a98440] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}

export default function GiftCityMegaMenu({ onClose = () => {} }) {
  return (
    <div className="rounded-2xl border border-slate-100/90 bg-white/98 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.04] transition-all max-h-[calc(100vh-75px)] overflow-y-auto">
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_1fr_1fr_1.15fr_320px]">
        {/* Property Type */}
        <div>
          <ColumnHeading icon={Building2}>Property Type</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {GIFT_PROPERTY_TYPE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <Link
            href="/gift-city"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>View all GIFT City</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Zone */}
        <div>
          <ColumnHeading icon={Layers}>Zone</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {GIFT_ZONE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mt-3.5 border-t border-slate-100 pt-2.5">
            <ColumnHeading icon={Handshake}>Deal Type</ColumnHeading>
            <div className="mt-2 space-y-1.5">
              {GIFT_DEAL_TYPE_LINKS.map((item) => (
                <MenuLink key={item.label} item={item} onClose={onClose} />
              ))}
            </div>
          </div>
        </div>

        {/* Why GIFT City */}
        <div>
          <ColumnHeading icon={Sparkles}>Why GIFT City</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {GIFT_HIGHLIGHT_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Quick enquiry */}
        <div>
          <ColumnHeading icon={MapPin}>GIFT City, Gandhinagar</ColumnHeading>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            India&apos;s first smart city & international financial hub.
          </p>

          <div className="mt-3.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <p className="text-xs font-semibold text-slate-900">
              Looking for something specific?
            </p>
            <p className="mt-1 text-[11px] leading-tight text-slate-500">
              Post your requirement and we&apos;ll help you find the best.
            </p>
            <Link
              href="/post-property"
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#a98440] px-3 py-1.5 text-[11px] font-bold text-[#a98440] transition-all hover:bg-[#a98440] hover:text-white"
            >
              <FileEdit className="h-3 w-3" />
              <span>Post Requirement</span>
            </Link>
          </div>
        </div>

        {/* Featured Tower card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-[#fbf7ee] to-white p-3.5 ring-1 ring-[#e2d1b3]/70 shadow-xs transition-all duration-200 hover:shadow-md h-full">
          <div className="flex flex-col flex-1 min-h-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-bold text-[#a98440] w-fit">
              <Sparkles className="h-3 w-3" />
              <span>Featured Tower</span>
            </span>

            <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#a98440] transition-colors leading-tight">
              GIFT One — Premium Office
            </h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              GIFT City, Gandhinagar
            </p>

            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-[#a98440]">
                SEZ
              </span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-600">
                Tax Benefits
              </span>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-600">
                IFSC
              </span>
            </div>

            {/* Expanded Image Filling the Gap */}
            <div className="my-2.5 flex-1 min-h-[160px] overflow-hidden rounded-lg relative">
              <img
                src="/images/ninth.png"
                alt="GIFT One Tower"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="mt-2.5 border-t border-slate-100 pt-2 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] text-slate-500 leading-none">Starts from</p>
              <p className="text-sm font-bold text-[#a98440]">₹85.00 Lac.</p>
            </div>
            <Link
              href="/gift-city"
              onClick={onClose}
              className="flex items-center justify-center gap-1 rounded-md bg-[#a98440] hover:bg-[#977232] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs transition active:scale-95"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="mt-4 border-t border-slate-100 pt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-700">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2 py-1 px-1"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-[#a98440]">
              <item.icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                {item.title}
              </p>
              <p className="text-[9.5px] text-slate-400 truncate leading-tight">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
