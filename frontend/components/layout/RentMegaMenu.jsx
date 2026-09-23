"use client";

import Link from "next/link";
import {
  Home,
  BarChart3,
  Armchair,
  Coins,
  MapPin,
  ArrowRight,
  Tag,
  FileCheck,
  Users,
  Lock,
  PhoneCall,
} from "lucide-react";

/*
  Rent mega-menu — same shape as BuyMegaMenu but themed around renting:
  property type, furnishing, budget bands and rental locations instead of
  ownership categories. Kept as its own self-contained data set (not shared
  with Buy) since rent filters (furnishing, monthly budget) don't apply to
  purchase listings.
*/

// Query params match the backend's actual filterset_fields for
// ResidentialProperty (rent reuses that endpoint) — see backcode views.py.
// Labels with no real matching choice fall back to `search=`.
export const PROPERTY_TYPE_LINKS = [
  { label: "Flats & Apartments", href: "/rent?property_type=flat" },
  { label: "Villas & Bungalows", href: "/rent?property_type=villa" },
  { label: "PG / Co-living", href: "/rent?search=PG Co-living" },
  { label: "Independent House", href: "/rent?property_type=bungalow" },
  { label: "Studio Apartment", href: "/rent?search=Studio Apartment" },
  { label: "Serviced Apartment", href: "/rent?search=Serviced Apartment" },
];

export const FURNISHING_LINKS = [
  { label: "Fully Furnished", href: "/rent?furnishing__iexact=Furnished" },
  { label: "Semi Furnished", href: "/rent?furnishing__iexact=Semi-Furnished" },
  { label: "Unfurnished", href: "/rent?furnishing__iexact=Unfurnished" },
];

export const RENT_BHK_LINKS = [
  { label: "1 BHK", href: "/rent?bedrooms=1" },
  { label: "2 BHK", href: "/rent?bedrooms=2" },
  { label: "3 BHK", href: "/rent?bedrooms=3" },
  { label: "4+ BHK", href: "/rent?bedrooms__gte=4" },
];

// price on ResidentialProperty doubles as the monthly rent for deal_type=rental.
export const BUDGET_LINKS = [
  { label: "Under ₹15,000", href: "/rent?price__lte=15000" },
  { label: "₹15,000 - ₹30,000", href: "/rent?price__gte=15000&price__lte=30000" },
  { label: "₹30,000 - ₹50,000", href: "/rent?price__gte=30000&price__lte=50000" },
  { label: "₹50,000 - ₹1,00,000", href: "/rent?price__gte=50000&price__lte=100000" },
  { label: "Above ₹1,00,000", href: "/rent?price__gte=100000" },
];

export const RENT_LOCATION_LINKS = [
  { label: "SG Highway", href: "/rent?area__iexact=SG Highway" },
  { label: "Sindhi Bhavan Road", href: "/rent?area__iexact=Sindhi Bhavan Road" },
  { label: "Bopal", href: "/rent?area__iexact=Bopal" },
  { label: "South Bopal", href: "/rent?area__iexact=South Bopal" },
  { label: "Thaltej", href: "/rent?area__iexact=Thaltej" },
  { label: "Prahlad Nagar", href: "/rent?area__iexact=Prahlad Nagar" },
  { label: "Science City", href: "/rent?area__iexact=Science City" },
];

const TRUST_ITEMS = [
  { icon: Tag, title: "Zero Brokerage", note: "No Hidden Charges" },
  { icon: FileCheck, title: "Verified Listings", note: "100% Genuine Owners" },
  { icon: Users, title: "Expert Guidance", note: "From Rental Advisors" },
  { icon: Lock, title: "Secure & Transparent", note: "Trusted by 10,000+ Tenants" },
  { icon: PhoneCall, title: "Quick Assistance", note: "Call us: 1800 41 99099" },
];

function ColumnHeading({ icon: Icon, children }) {
  const isComponent = typeof Icon === "function" || (typeof Icon === "object" && Icon !== null);
  return (
    <div className="group flex items-center gap-2 text-[13px] font-bold text-slate-900 cursor-default">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-50 text-[#a98440]">
        {isComponent ? <Icon className="h-3 w-3" /> : <span>{Icon}</span>}
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

export default function RentMegaMenu({ onClose = () => {} }) {
  return (
    <div className="rounded-2xl border border-slate-100/90 bg-white/98 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.04] transition-all max-h-[calc(100vh-75px)] overflow-y-auto">
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_1fr_1fr_1.15fr_320px]">
        {/* Property Type */}
        <div>
          <ColumnHeading icon={Home}>Property Type</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {PROPERTY_TYPE_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mt-3.5 border-t border-slate-100 pt-2.5">
            <ColumnHeading icon={BarChart3}>By BHK</ColumnHeading>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {RENT_BHK_LINKS.map((item) => (
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
        </div>

        {/* Furnishing */}
        <div>
          <ColumnHeading icon={Armchair}>Furnishing</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {FURNISHING_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <Link
            href="/rent"
            onClick={onClose}
            className="group mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a98440] transition-all duration-150 hover:text-[#977232]"
          >
            <span>View all Rentals</span>
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Budget */}
        <div>
          <ColumnHeading icon={Coins}>Monthly Budget</ColumnHeading>
          <div className="mt-2.5 space-y-1.5">
            {BUDGET_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div>
          <ColumnHeading icon={MapPin}>Top Locations</ColumnHeading>
          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {RENT_LOCATION_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onClose={onClose} />
            ))}
          </div>

          <div className="mt-3.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <p className="text-xs font-semibold text-slate-900">
              Can&apos;t find the right rental?
            </p>
            <p className="mt-1 text-[11px] leading-tight text-slate-500">
              Post your requirement and we&apos;ll help you find the best.
            </p>
            <Link
              href="/post-property"
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#a98440] px-3 py-1.5 text-[11px] font-bold text-[#a98440] transition-all hover:bg-[#a98440] hover:text-white"
            >
              📝 Post Requirement
            </Link>
          </div>
        </div>

        {/* Featured Rental card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-[#fbf7ee] to-white p-3.5 ring-1 ring-[#e2d1b3]/70 shadow-xs transition-all duration-200 hover:shadow-md h-full">
          <div className="flex flex-col flex-1 min-h-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-bold text-[#a98440] w-fit">
              ⭐ Featured Rental
            </span>

            <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#a98440] transition-colors leading-tight">
              Fully Furnished 3BHK
            </h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Sindhu Bhavan Road, Ahmedabad
            </p>

            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-[#a98440]">
                Furnished
              </span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-600">
                Zero Brokerage
              </span>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-600">
                Immediate
              </span>
            </div>

            {/* Expanded Image Filling the Gap */}
            <div className="my-2.5 flex-1 min-h-[160px] overflow-hidden rounded-lg relative">
              <img
                src="/images/ninth.png"
                alt="Fully Furnished 3BHK"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-2 gap-1 text-center py-1.5 bg-white/70 rounded-lg border border-amber-100/60">
              <div>
                <p className="text-[12px] font-bold text-[#a98440]">2 Months</p>
                <p className="text-[9px] text-slate-500">Security Deposit</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-green-600">Immediate</p>
                <p className="text-[9px] text-slate-500">Available From</p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 border-t border-slate-100 pt-2 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] text-slate-500 leading-none">Monthly Rent</p>
              <p className="text-sm font-bold text-[#a98440]">₹45,000/mo.</p>
            </div>
            <Link
              href="/rent"
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
