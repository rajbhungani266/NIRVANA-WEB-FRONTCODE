"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchProperties } from "@/lib/api";
import ProjectCard from "./ProjectCard";
import BookSiteVisitForm from "./BookSiteVisitForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterDropdown from "@/components/ui/FilterDropdown";

/*
  Listing page matching screenshot 2:
  - sticky-feeling filter bar (New Projects / Owner toggle + dropdowns)
  - grid of ProjectCard
  - sidebar form (defaults to site-visit booking; pass `sidebarForm` to swap
    in a category-tailored enquiry form, e.g. InvestmentEnquiryForm) + advisor
    + expert cards

  Filters map to the backend's filterset_fields (see backcode views.py) —
  the property-type field name and choices differ per category, so both are
  looked up from FILTER_CONFIG by the `category` prop.
*/

const FILTER_CONFIG = {
  residential: {
    typeField: "property_type",
    typeOptions: [
      { value: "flat", label: "Flat" },
      { value: "bungalow", label: "Bungalow" },
      { value: "villa", label: "Villa" },
      { value: "tenament", label: "Tenament" },
    ],
    showBhk: true,
  },
  commercial: {
    typeField: "commercial_type",
    typeOptions: [
      { value: "office", label: "Office" },
      { value: "showroom", label: "Showroom" },
      { value: "shop", label: "Shop" },
      { value: "warehouse", label: "Warehouse" },
      { value: "factory", label: "Factory" },
    ],
    showBhk: false,
  },
  "plot-weekend-villa": {
    typeField: "property_type",
    typeOptions: [
      { value: "plot", label: "Plot" },
      { value: "weekend_villa", label: "Weekend Villa" },
      { value: "farm_house", label: "Farm House" },
    ],
    showBhk: false,
  },
  investment: {
    typeField: "investment_type",
    typeOptions: [
      { value: "preleased", label: "Preleased" },
      { value: "rental_income", label: "Rental Income" },
      { value: "high_return", label: "High Return" },
      { value: "future_growth", label: "Future Growth" },
    ],
    showBhk: false,
  },
  "gift-city": {
    typeField: "gift_property_type",
    typeOptions: [
      { value: "office", label: "Office" },
      { value: "residential", label: "Residential" },
      { value: "investment", label: "Investment" },
      { value: "commercial", label: "Commercial" },
    ],
    showBhk: false,
  },
};

const BUDGET_OPTIONS = [
  { value: "under-50l", label: "Under ₹50 Lac" },
  { value: "50l-1cr", label: "₹50 Lac - ₹1 Cr" },
  { value: "above-1cr", label: "Above ₹1 Cr" },
];

function budgetToRange(value) {
  switch (value) {
    case "under-50l":
      return { lte: 5000000 };
    case "50l-1cr":
      return { gte: 5000000, lte: 10000000 };
    case "above-1cr":
      return { gte: 10000000 };
    default:
      return {};
  }
}

const POSSESSION_OPTIONS = [
  { value: "ready", label: "Ready to Move" },
  { value: "2025", label: "In 2025" },
  { value: "2026", label: "In 2026" },
  { value: "2027", label: "In 2027+" },
];

const SORT_OPTIONS = [
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-created_at", label: "Newest First" },
];

const BHK_OPTIONS = [
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4+ BHK" },
];

const CITY_OPTIONS = [
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Gandhinagar", label: "Gandhinagar" },
  { value: "GIFT City", label: "GIFT City" },
  { value: "Surat", label: "Surat" },
  { value: "Vadodara", label: "Vadodara" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Pune", label: "Pune" },
  { value: "Delhi NCR", label: "Delhi NCR" },
  { value: "Goa", label: "Goa" },
];

function CityDropdown({ city, setCity }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const activeLabel = city || "Ahmedabad";
  const displayedOptions = CITY_OPTIONS.some((c) => c.value === activeLabel)
    ? CITY_OPTIONS
    : [{ value: activeLabel, label: activeLabel }, ...CITY_OPTIONS];

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs font-normal text-slate-700 outline-none cursor-pointer pr-1 select-none"
      >
        <span>{activeLabel}</span>
        <svg
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#a98440]" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="panel-drop-animation absolute left-0 top-[calc(100%+10px)] z-50 min-w-[140px] max-h-60 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
          <div className="px-2.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            City
          </div>
          <div className="space-y-0.5">
            {displayedOptions.map((c) => {
              const active = (city || "Ahmedabad") === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setCity(c.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                    active
                      ? "bg-[#a98440]/10 font-bold text-[#a98440]"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-normal"
                  }`}
                >
                  <span>{c.label}</span>
                  {active && (
                    <svg className="h-3.5 w-3.5 text-[#a98440] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @param {{
 *   title?: string,
 *   endpoint: string,
 *   category: string,
 *   defaultQuery?: string,
 *   sidebarForm?: import("react").ReactNode,
 * }} props
 * */
export default function ProjectListingPage(props) {
  // useSearchParams() requires a Suspense boundary during static generation —
  // isolated here so every page using this component gets it for free.
  return (
    <Suspense fallback={<ListingPageFallback title={props.title} />}>
      <ProjectListingPageInner {...props} />
    </Suspense>
  );
}

function ListingPageFallback({ title }) {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="bg-soft-blue pb-6 pt-20 sm:pt-22">
        <Navbar />
        <div className="container-box pt-2 sm:pt-3">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
          <div className="mt-8 rounded-2xl bg-white p-8 text-center text-slate-500">
            Loading...
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectListingPageInner({
  title = "Properties in Ahmedabad",
  endpoint,
  category,
  defaultQuery = "",
  sidebarForm = null,
}) {
  const config = FILTER_CONFIG[category] ?? FILTER_CONFIG.residential;

  // Links from the mega-menus / hero search land here with query params
  // already set (e.g. ?property_type=flat&bedrooms=2). Dropdowns that have
  // a matching preset are seeded from these on mount; anything else (like a
  // raw price__gte from a Budget link) is carried through untouched via
  // extraParams below, so a link's filter still applies even without a
  // matching dropdown to display it in.
  const urlParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const OWNED_KEYS = ["search", "city", "bedrooms", config.typeField, "price__gte", "price__lte", "ordering"];

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("new"); // "new" | "owner"
  const [showAdvisorPhone, setShowAdvisorPhone] = useState(false);

  const initialSearch = urlParams.get("search") ?? urlParams.get("area__iexact") ?? urlParams.get("area") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [localityFilter, setLocalityFilter] = useState("");
  const [possession, setPossession] = useState("");
  const [city, setCity] = useState(urlParams.get("city") ?? "");
  const [bhk, setBhk] = useState(urlParams.get("bedrooms") ?? "");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState(urlParams.get(config.typeField) ?? "");
  const [sortBy, setSortBy] = useState(urlParams.get("ordering") ?? "");

  const [priceRangeFromUrl] = useState({
    gte: urlParams.get("price__gte") ?? "",
    lte: urlParams.get("price__lte") ?? "",
  });
  const [extraParams] = useState(() => {
    const extras = {};
    for (const [key, value] of urlParams.entries()) {
      if (!OWNED_KEYS.includes(key)) extras[key] = value;
    }
    return extras;
  });

  function buildQueryString() {
    const params = new URLSearchParams(defaultQuery.replace(/^\?/, ""));

    Object.entries(extraParams).forEach(([key, value]) => params.set(key, value));

    if (search) params.set("search", search);
    else if (localityFilter) params.set("search", localityFilter);

    if (city) params.set("city", city);
    if (bhk) params.set("bedrooms", bhk);
    if (propertyType) params.set(config.typeField, propertyType);
    if (possession) params.set("possession", possession);

    const range = budgetToRange(budget);
    const gte = range.gte ?? priceRangeFromUrl.gte;
    const lte = range.lte ?? priceRangeFromUrl.lte;
    if (gte) params.set("price__gte", String(gte));
    if (lte) params.set("price__lte", String(lte));

    if (sortBy) params.set("ordering", sortBy);

    params.set("listing_type", tab === "owner" ? "owner" : "builder");

    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  async function loadProperties() {
    const qs = buildQueryString();

    // Keep the URL in sync with the applied filters so a refresh, back-button,
    // or shared link reloads with the same search instead of resetting it.
    router.replace(`${pathname}${qs}`, { scroll: false });

    try {
      setLoading(true);
      const data = await fetchProperties(`${endpoint}${qs}`);
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Showing empty listing.", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  // Fires on mount, and again whenever Sort or the New/Owner tab change —
  // both should apply immediately without needing a separate Search click.
  useEffect(() => {
    let isMounted = true;
    const qs = buildQueryString();
    router.replace(`${pathname}${qs}`, { scroll: false });

    async function executeLoad() {
      setLoading(true);
      try {
        const data = await fetchProperties(`${endpoint}${qs}`);
        if (isMounted) {
          setProperties(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (error) {
        console.log("Showing empty listing.", error);
        if (isMounted) {
          setProperties([]);
          setLoading(false);
        }
      }
    }

    executeLoad();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, tab, city]);

  function handleSearch(event) {
    event.preventDefault();
    loadProperties();
  }

  const count = properties.length;
  const displayLocation = (search || localityFilter || "").trim();
  const pageTitle = city ? `Properties in ${city}` : title;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="bg-gradient-to-b from-[#dce7f3] via-[#edf3f8] to-[#f8fafc] pb-2 pt-20 sm:pt-22">
        <Navbar />

        <div className="container-box pt-2 sm:pt-3">
          {/* Header Row matching Image 1 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-normal text-slate-700 md:text-2xl flex items-baseline gap-2 flex-wrap">
              <span>{pageTitle}</span>
              <span className="text-sm font-normal text-slate-500">
                ({count} Projects)
              </span>
            </h1>

            {/* New Projects / Owner Properties toggle matching Image 1 top right */}
            <div className="flex w-fit items-center rounded-full bg-white p-1 shadow-xs border border-slate-200/80">
              <button
                type="button"
                onClick={() => setTab("new")}
                className={
                  tab === "new"
                    ? "rounded-full bg-[#a98440] px-5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition-colors cursor-pointer"
                    : "rounded-full px-5 py-1.5 text-xs sm:text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                }
              >
                New Projects
              </button>
              <button
                type="button"
                onClick={() => setTab("owner")}
                className={
                  tab === "owner"
                    ? "rounded-full bg-[#a98440] px-5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition-colors cursor-pointer"
                    : "rounded-full px-5 py-1.5 text-xs sm:text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                }
              >
                Owner Properties
              </button>
            </div>
          </div>

          {/* Filter pills matching Image 1 - single horizontal row with preserved Search button */}
          <form
            onSubmit={handleSearch}
            className="mt-3 flex items-center gap-1.5 sm:gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide py-1 w-full flex-nowrap lg:flex-wrap pr-4 sm:pr-6 relative z-30"
          >
            {/* Combined City + Search Location Capsule */}
            <div className="flex h-9 shrink-0 items-center rounded-full border border-slate-200/90 bg-white px-3 shadow-xs hover:border-slate-300 transition-colors">
              <CityDropdown city={city} setCity={setCity} />

              <div className="mx-2 h-3.5 w-[1px] bg-slate-200/80 shrink-0" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-28 sm:w-32 md:w-36 bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none"
                placeholder="Search Location, Builder..."
              />
            </div>

            {/* Locality / Search Pill Chip */}
            {displayLocation && (
              <div className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 shadow-xs text-xs font-normal text-slate-700">
                <span>{displayLocation}</span>
                <button
                  type="button"
                  onClick={() => {
                    setLocalityFilter("");
                    setSearch("");
                    const params = new URLSearchParams(defaultQuery.replace(/^\?/, ""));
                    Object.entries(extraParams).forEach(([key, value]) => params.set(key, value));
                    if (city) params.set("city", city);
                    if (bhk) params.set("bedrooms", bhk);
                    if (propertyType) params.set(config.typeField, propertyType);
                    if (possession) params.set("possession", possession);
                    const range = budgetToRange(budget);
                    const gte = range.gte ?? priceRangeFromUrl.gte;
                    const lte = range.lte ?? priceRangeFromUrl.lte;
                    if (gte) params.set("price__gte", String(gte));
                    if (lte) params.set("price__lte", String(lte));
                    if (sortBy) params.set("ordering", sortBy);
                    params.set("listing_type", tab === "owner" ? "owner" : "builder");
                    const qs = params.toString() ? `?${params.toString()}` : "";
                    router.replace(`${pathname}${qs}`, { scroll: false });
                    setLoading(true);
                    fetchProperties(`${endpoint}${qs}`)
                      .then((data) => setProperties(Array.isArray(data) ? data : []))
                      .catch(() => setProperties([]))
                      .finally(() => setLoading(false));
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1 flex items-center"
                  title="Remove location filter"
                >
                  <svg className="h-3.5 w-3.5 text-slate-500 hover:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </button>
              </div>
            )}

            {/* BHK Dropdown Pill */}
            {config.showBhk && (
              <FilterDropdown 
                value={bhk} 
                onChange={setBhk} 
                options={BHK_OPTIONS} 
                defaultLabel="BHK" 
              />
            )}

            {/* Budget Dropdown Pill */}
            <FilterDropdown 
              value={budget} 
              onChange={setBudget} 
              options={BUDGET_OPTIONS} 
              defaultLabel="Budget" 
            />

            {/* Possession Dropdown Pill */}
            <FilterDropdown 
              value={possession} 
              onChange={setPossession} 
              options={POSSESSION_OPTIONS} 
              defaultLabel="Possession" 
            />

            {/* Property Type Dropdown Pill */}
            <FilterDropdown 
              value={propertyType} 
              onChange={setPropertyType} 
              options={config.typeOptions} 
              defaultLabel="Property Type" 
            />

            {/* Sort By Dropdown Pill */}
            <FilterDropdown 
              value={sortBy} 
              onChange={setSortBy} 
              options={SORT_OPTIONS} 
              defaultLabel="Sort By : Relevance" 
            />

            {/* Preserved Search Button as matching pill */}
            <button
              type="submit"
              className="h-9 shrink-0 rounded-full bg-[#a98440] hover:bg-[#977232] px-4 text-xs font-semibold text-white shadow-xs transition-colors active:scale-95 cursor-pointer flex items-center justify-center"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Listing Results Count Bar */}
      <div className="container-box pt-2 pb-2">
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Showing {count} {tab === "new" ? "new projects" : "owner properties"}
          {displayLocation ? ` for "${displayLocation}"` : ""}
        </p>
      </div>

      <section className="container-box grid gap-6 pb-12 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
        {/* Listings */}
        <div className="space-y-5">
          {loading && (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
              Loading properties...
            </div>
          )}

          {!loading && count === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
              No properties found. Try adjusting your filters.
            </div>
          )}

          {!loading &&
            properties.map((property) => (
              <ProjectCard
                key={property.id}
                property={property}
                category={category}
              />
            ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-3 lg:sticky lg:top-20 lg:h-fit">
          {sidebarForm ?? <BookSiteVisitForm category={category} />}

          {/* Advisor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a98440] font-bold text-white shadow-xs">
                RP
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Raj Patel</p>
                <p className="text-[12px] text-slate-500">
                  Senior Property Advisor
                </p>
              </div>
              {showAdvisorPhone ? (
                <a
                  href="tel:+919574491891"
                  className="ml-auto rounded-lg bg-[#b18537] hover:bg-[#977232] px-3.5 py-2 text-[12px] font-bold text-white shadow-xs transition"
                >
                  +91 95744 91891
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdvisorPhone(true)}
                  className="ml-auto rounded-lg bg-[#b18537] hover:bg-[#977232] px-4 py-2 text-[12px] font-bold text-white shadow-xs transition cursor-pointer"
                >
                  Call
                </button>
              )}
            </div>
          </div>

          {/* Need Expert Advice */}
          <div className="rounded-2xl bg-[#fbf7ee] p-5 ring-1 ring-[#e2d1b3]/60">
            <p className="text-sm font-bold text-slate-900">
              Need Expert Advice ?
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              Our property advisors will help you find the best investment.
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-[#b18537] hover:bg-[#977232] py-2.5 text-[13px] font-bold text-white shadow-xs transition active:scale-95 cursor-pointer text-center"
            >
              Talk to advisor
            </button>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
