"use client";

import Link from "next/link";
import {
  Trees,
  Ruler,
  Boxes,
  MapPin,
  FileEdit,
  Sparkles,
  ArrowRight,
  FileCheck,
  Tag,
  Users,
  Lock,
  PhoneCall,
} from "lucide-react";

// Query params match PlotWeekendVillaProperty's filterset_fields exactly
// (see backcode views.py).
export const PLOT_TYPE_LINKS = [
  { label: "Plot", href: "/plot-weekend-villa?property_type=plot" },
  { label: "Weekend Villa", href: "/plot-weekend-villa?property_type=weekend_villa" },
  { label: "Farm House", href: "/plot-weekend-villa?property_type=farm_house" },
];

export const PLOT_SIZE_LINKS = [
  { label: "Under 1000 Sq.Yd", href: "/plot-weekend-villa?plot_area__lte=1000" },
  { label: "1000 - 2000 Sq.Yd", href: "/plot-weekend-villa?plot_area__gte=1000&plot_area__lte=2000" },
  { label: "2000 - 5000 Sq.Yd", href: "/plot-weekend-villa?plot_area__gte=2000&plot_area__lte=5000" },
  { label: "Above 5000 Sq.Yd", href: "/plot-weekend-villa?plot_area__gte=5000" },
];

export const PLOT_FEATURE_LINKS = [
  { label: "Boundary Wall", href: "/plot-weekend-villa?boundary_wall=true" },
  { label: "Water Connection", href: "/plot-weekend-villa?water_connection=true" },
  { label: "Electricity", href: "/plot-weekend-villa?electricity=true" },
  { label: "Construction Allowed", href: "/plot-weekend-villa?construction_allowed=true" },
];

export const PLOTS_LOCATION_LINKS = [
  { label: "Shela", href: "/plot-weekend-villa?area__iexact=Shela" },
  { label: "Bavla", href: "/plot-weekend-villa?area__iexact=Bavla" },
  { label: "Sanand", href: "/plot-weekend-villa?area__iexact=Sanand" },
  { label: "Kalol", href: "/plot-weekend-villa?area__iexact=Kalol" },
  { label: "Dholera", href: "/plot-weekend-villa?area__iexact=Dholera" },
  { label: "SG Highway", href: "/plot-weekend-villa?area__iexact=SG Highway" },
];

const TRUST_ITEMS = [
  { icon: FileCheck, title: "Clear Title Verified", note: "100% Legal Due Diligence" },
  { icon: Tag, title: "Zero Brokerage", note: "Direct from Owners" },
  { icon: Users, title: "Expert Guidance", note: "From Land Specialists" },
  { icon: Lock, title: "Secure & Transparent", note: "Trusted by 10,000+ Customers" },
  { icon: PhoneCall, title: "Quick Assistance", note: "Call us: 1800 41 99099" },
];

function ColumnHeading({ icon: Icon, children }) {
  return (
    <div className="group flex items-center gap-2 text-[13px] font-bold text-slate-900 cursor-default">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-50 text-[#a98440]">
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
      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 text-[#a98440] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}

export default function PlotsMegaMenu({ onClose = () => {} }) {
  return (
    <div className="rounded-2xl border border-slate-100/90 bg-white/98 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.04] transition-all max-h-[calc(100vh-75px)] overflow-y-auto">
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_1fr_1fr_1.15fr_320px]">
        {/* Property Type */}
        <div>
          <ColumnHeading icon={Trees}>Property Type</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {PLOT_TYPE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <Link
            href="/plot-weekend-villa"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>View all Plots</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Plot Size */}
        <div>
          <ColumnHeading icon={Ruler}>Plot Size</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {PLOT_SIZE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <ColumnHeading icon={Boxes}>Features</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {PLOT_FEATURE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div>
          <ColumnHeading icon={MapPin}>Top Locations</ColumnHeading>
          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {PLOTS_LOCATION_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

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

        {/* Featured card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-[#fbf7ee] to-white p-3.5 ring-1 ring-[#e2d1b3]/70 shadow-xs transition-all duration-200 hover:shadow-md h-full">
          <div className="flex flex-col flex-1 min-h-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-bold text-[#a98440] w-fit">
              <Sparkles className="h-3 w-3 text-[#a98440]" />
              <span>Featured Plot</span>
            </span>

            <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#a98440] transition-colors leading-tight">
              Premium Farm House Plot
            </h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">Shela, Ahmedabad</p>

            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-[#a98440]">
                Clear Title
              </span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-600">
                Boundary Wall
              </span>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-600">
                Utilities
              </span>
            </div>

            {/* Expanded Image Filling the Gap */}
            <div className="my-2.5 flex-1 min-h-[160px] overflow-hidden rounded-lg relative">
              <img
                src="/images/ninth.png"
                alt="Premium Farm House Plot"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-2 gap-1 text-center py-1.5 bg-white/70 rounded-lg border border-amber-100/60">
              <div>
                <p className="text-[12px] font-bold text-[#a98440]">2,400 Sq.Yd</p>
                <p className="text-[9px] text-slate-500">Plot Size</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-green-600">Ready</p>
                <p className="text-[9px] text-slate-500">Construction</p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 border-t border-slate-100 pt-2 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] text-slate-500 leading-none">Starts from</p>
              <p className="text-sm font-bold text-[#a98440]">₹65.00 Lac.</p>
            </div>
            <Link
              href="/plot-weekend-villa"
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
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center gap-2 py-1 px-1"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-[#a98440]">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                  {item.title}
                </p>
                <p className="text-[9.5px] text-slate-400 truncate leading-tight">{item.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
