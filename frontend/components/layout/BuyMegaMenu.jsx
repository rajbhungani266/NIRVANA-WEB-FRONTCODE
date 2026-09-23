"use client";

import Link from "next/link";
import {
  Home,
  BarChart3,
  Building2,
  Briefcase,
  TrendingUp,
  Calculator,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
  Lock,
  PhoneCall,
  Star,
  FileEdit,
  ArrowRight,
} from "lucide-react";

/*
  Buy mega-menu.
  Data-driven so the layout stays clean and easy to edit — each column is
  just an array of { label, href }. Query params match the backend's actual
  filterset_fields exactly (see backcode/apps/properties/views.py) — where a
  label has no real matching choice/field, it falls back to `search=` (a
  genuine full-text match) rather than a param the backend silently ignores.
*/

export const RESIDENTIAL_LINKS = [
  { label: "Apartments", href: "/residential?property_type=flat" },
  { label: "Villas", href: "/residential?property_type=villa" },
  { label: "Penthouses", href: "/residential?search=Penthouse" },
  { label: "Plots", href: "/plot-weekend-villa" },
  { label: "Luxury Homes", href: "/residential?is_featured=true" },
  { label: "Independent Houses", href: "/residential?property_type=bungalow" },
];

const BHK_LINKS = [
  { label: "1 BHK", href: "/residential?bedrooms=1" },
  { label: "2 BHK", href: "/residential?bedrooms=2" },
  { label: "3 BHK", href: "/residential?bedrooms=3" },
  { label: "4 BHK", href: "/residential?bedrooms=4" },
  { label: "5+ BHK", href: "/residential?bedrooms__gte=5" },
];

export const COMMERCIAL_LINKS = [
  { label: "Office Spaces", href: "/commercial?commercial_type=office" },
  { label: "Retail Shops", href: "/commercial?commercial_type=shop" },
  { label: "Showrooms", href: "/commercial?commercial_type=showroom" },
  { label: "Warehouses", href: "/commercial?commercial_type=warehouse" },
  { label: "Industrial Properties", href: "/commercial?commercial_type=factory" },
  { label: "Co-working Spaces", href: "/commercial?search=Co-working" },
];

const COMMERCIAL_USE_LINKS = [
  { label: "Office", href: "/commercial?commercial_type=office" },
  { label: "Retail", href: "/commercial?commercial_type=shop" },
];

export const INVESTMENT_LINKS = [
  { label: "High ROI Projects", href: "/investment?investment_type=high_return", tag: "Hot" },
  { label: "Rental Income Properties", href: "/investment?investment_type=rental_income" },
  { label: "Pre-Leased Properties", href: "/investment?investment_type=preleased" },
  { label: "Commercial Investment", href: "/investment?search=Commercial" },
  { label: "Under Construction", href: "/investment?investment_type=future_growth" },
  { label: "Fractional Ownership", href: "/investment?search=Fractional Ownership" },
];

// No calculator pages exist yet — these are honest placeholders that just
// browse Investment rather than pretending a ?tool= param does something.
const INVESTMENT_TOOLS = [
  { label: "ROI Calculator", href: "/investment" },
  { label: "EMI Calculator", href: "/investment" },
  { label: "Affordability Calculator", href: "/investment" },
];

export const LOCATION_LINKS = [
  { label: "SG Highway", href: "/residential?area__iexact=SG Highway" },
  { label: "Sindhi Bhavan Road", href: "/residential?area__iexact=Sindhi Bhavan Road" },
  { label: "GIFT City", href: "/gift-city" },
  { label: "Ambli", href: "/residential?area__iexact=Ambli" },
  { label: "Bopal", href: "/residential?area__iexact=Bopal" },
  { label: "South Bopal", href: "/residential?area__iexact=South Bopal" },
  { label: "Science City", href: "/residential?area__iexact=Science City" },
  { label: "Prahlad Nagar", href: "/residential?area__iexact=Prahlad Nagar" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "RERA Verified", note: "100% Compliant Projects" },
  { icon: Tag, title: "Zero Brokerage", note: "Direct from Builders" },
  { icon: Users, title: "Expert Guidance", note: "From Industry Experts" },
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
      <span className="flex items-center gap-1.5 transition-colors duration-150 group-hover:font-medium">
        <span>{item.label}</span>
        {item.tag && (
          <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-[#a98440]">
            {item.tag}
          </span>
        )}
      </span>
      <ArrowRight className="opacity-0 -translate-x-1 h-3 w-3 text-[#a98440] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}

export default function BuyMegaMenu({ onClose = () => {} }) {
  return (
    <div className="rounded-2xl border border-slate-100/90 bg-white/98 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.04] transition-all max-h-[calc(100vh-75px)] overflow-y-auto">
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1.1fr_1fr_1fr_1.15fr_310px]">
        {/* Residential */}
        <div>
          <ColumnHeading icon={Home}>Residential</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {RESIDENTIAL_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mt-3.5 border-t border-slate-100 pt-2.5">
            <ColumnHeading icon={BarChart3}>By BHK</ColumnHeading>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {BHK_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="rounded-md bg-slate-50 border border-slate-100 py-1 text-center text-[10.5px] font-medium text-slate-700 hover:bg-[#a98440] hover:text-white hover:border-[#a98440] transition-all whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/residential"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>View all Residential</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Commercial */}
        <div>
          <ColumnHeading icon={Building2}>Commercial</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {COMMERCIAL_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mt-3.5 border-t border-slate-100 pt-2.5">
            <ColumnHeading icon={Briefcase}>By Use</ColumnHeading>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {COMMERCIAL_USE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="rounded-md bg-slate-50 border border-slate-100 px-2 py-1 text-center text-[11px] font-medium text-slate-700 hover:bg-[#a98440] hover:text-white hover:border-[#a98440] transition-all truncate"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/commercial"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>View all Commercial</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Investment */}
        <div>
          <ColumnHeading icon={TrendingUp}>Investment</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {INVESTMENT_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mt-3.5 border-t border-slate-100 pt-2.5">
            <ColumnHeading icon={Calculator}>Investment Tools</ColumnHeading>
            <div className="mt-2 space-y-1.5">
              {INVESTMENT_TOOLS.map((item) => (
                <MenuLink key={item.label} item={item} onClose={onClose} />
              ))}
            </div>
          </div>

          <Link
            href="/investment"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>Explore Investment</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Top Locations */}
        <div>
          <ColumnHeading icon={MapPin}>Top Locations</ColumnHeading>
          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {LOCATION_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <Link
            href="/residential"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>View all Locations</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>

          <div className="mt-3.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <p className="text-xs font-semibold text-slate-900">
              Looking for something specific?
            </p>
            <p className="mt-1 text-[11px] leading-tight text-slate-500">
              Post your requirement and we&apos;ll find the best match.
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

        {/* Featured Opportunity card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-[#fbf7ee] to-white p-3.5 ring-1 ring-[#e2d1b3]/70 shadow-xs transition-all duration-200 hover:shadow-md h-full">
          <div className="flex flex-col flex-1 min-h-0">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#a98440] transition-colors leading-tight">
              Premium Office Tower
            </h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Iscon Ambli Road, Ahmedabad
            </p>

            {/* Expanded Image Filling the Gap */}
            <div className="my-2.5 flex-1 min-h-[160px] overflow-hidden rounded-lg relative">
              <img
                src="/images/ninth.png"
                alt="Premium Office Tower"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-3 gap-1 text-center py-1.5 bg-white/70 rounded-lg border border-amber-100/60">
              <div>
                <p className="text-[12px] font-bold text-green-600">8.2%*</p>
                <p className="text-[9px] text-slate-500">Rental Yield</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#a98440]">14%*</p>
                <p className="text-[9px] text-slate-500">ROI Potential</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-amber-500 flex items-center justify-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-amber-400" />
                  <span>9.6</span>
                </p>
                <p className="text-[9px] text-slate-500">Score</p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 border-t border-slate-100 pt-2 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] text-slate-500 leading-none">Starts from</p>
              <p className="text-sm font-bold text-[#a98440]">₹91.52 Lac.</p>
            </div>
            <Link
              href="/investment"
              onClick={onClose}
              className="flex items-center justify-center gap-1 rounded-md bg-[#a98440] hover:bg-[#977232] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs transition active:scale-95"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust bar - sleek compact single line */}
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
