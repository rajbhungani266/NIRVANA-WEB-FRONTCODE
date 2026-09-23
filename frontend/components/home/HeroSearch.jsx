"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Building,
  Home,
  Landmark,
  Sparkles,
  MapPin,
  Map,
  X,
  Check,
  ArrowRight,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

const DEAL_MODES = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "invest", label: "Invest" },
];

const CATEGORY_TABS_BY_MODE = {
  buy: [
    { value: "residential", label: "Residential" },
    { value: "new-launch", label: "New Launch" },
    { value: "commercial", label: "Commercial" },
    { value: "plots", label: "Plots/Land" },
  ],
  rent: [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "villa", label: "Luxury Villas" },
    { value: "furnished", label: "Furnished" },
  ],
  invest: [
    { value: "preleased", label: "Pre-Leased Commercial" },
    { value: "gift-city", label: "GIFT City IFSC" },
    { value: "retail", label: "High-ROI Retail" },
    { value: "land", label: "Growth Corridors" },
  ],
};

const RESIDENTIAL_PROPERTY_TYPES = [
  { value: "", label: "All Residential", icon: Building2, desc: "All residential configurations" },
  { value: "flat", label: "Apartment / Flat", icon: Building, desc: "High-rise & luxury towers" },
  { value: "villa", label: "Luxury Villa", icon: Home, desc: "Private standalone luxury villas" },
  { value: "bungalow", label: "Bungalow", icon: Landmark, desc: "Exclusive independent houses" },
  { value: "penthouse", label: "Sky Penthouse", icon: Sparkles, desc: "Top floor panoramic residences" },
  { value: "plot", label: "Residential Plot", icon: Map, desc: "Gated villas & weekend land" },
];

const COMMERCIAL_PROPERTY_TYPES = [
  { value: "", label: "All Commercial", icon: Building2, desc: "All commercial spaces" },
  { value: "office", label: "Office Spaces", icon: Building, desc: "Corporate towers & IT parks" },
  { value: "shop", label: "Retail Shops", icon: Landmark, desc: "High-footfall retail units" },
  { value: "showroom", label: "Grand Showrooms", icon: Sparkles, desc: "Prominent main-road frontage" },
  { value: "warehouse", label: "Warehouses", icon: Map, desc: "Logistics & industrial hubs" },
];

const INVEST_PROPERTY_TYPES = [
  { value: "", label: "All Assets", icon: TrendingUp, desc: "All high-return investment assets" },
  { value: "preleased", label: "Pre-Leased Office", icon: Building2, desc: "Steady rental income from Day 1" },
  { value: "retail", label: "High-ROI Retail", icon: Landmark, desc: "Anchor brand commercial shops" },
  { value: "gift", label: "GIFT City Tower", icon: Sparkles, desc: "IFSC tax-efficient global assets" },
  { value: "plot", label: "Growth Corridor Land", icon: Map, desc: "Rapidly appreciating land parcels" },
];

const BHK_OPTIONS = [
  { value: "", label: "All BHK" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5", label: "5+ BHK" },
];

const ALL_LOCATIONS = [
  // Mumbai & MMR
  { name: "Bandra West", area: "Pali Hill / Carter Road", city: "Mumbai", state: "Maharashtra", type: "Ultra-Luxury", tag: "Celebrity Hub" },
  { name: "Worli", area: "Sea Link / Lower Parel", city: "Mumbai", state: "Maharashtra", type: "Prime Seafront", tag: "Skyscraper Boulevard" },
  { name: "Juhu", area: "Juhu Beach / Tara Road", city: "Mumbai", state: "Maharashtra", type: "Luxury Villas", tag: "Elite Coastal" },
  { name: "BKC (Bandra Kurla Complex)", area: "G Block Corporate Hub", city: "Mumbai", state: "Maharashtra", type: "Commercial IFSC", tag: "Financial Hub" },
  { name: "Powai", area: "Hiranandani Gardens", city: "Mumbai", state: "Maharashtra", type: "Tech Hub & Living", tag: "Modern Township" },
  { name: "Andheri West", area: "Lokhandwala / Versova", city: "Mumbai", state: "Maharashtra", type: "Central Commercial", tag: "High Demand" },
  { name: "Navi Mumbai", area: "Palm Beach / Kharghar", city: "Navi Mumbai", state: "Maharashtra", type: "Planned City", tag: "Airport Corridor" },
  { name: "Thane West", area: "Ghubunder Road / Majiwada", city: "Thane", state: "Maharashtra", type: "Residential & IT", tag: "Growth Corridor" },

  // Delhi NCR
  { name: "Golf Course Road", area: "DLF Phase 5 / Sector 42", city: "Gurugram", state: "Delhi NCR", type: "Ultra-Luxury Condos", tag: "Pinnacle of Luxury" },
  { name: "Cyber City", area: "DLF CyberHub", city: "Gurugram", state: "Delhi NCR", type: "Corporate Tech Hub", tag: "Global Business" },
  { name: "Golf Course Extension", area: "Sector 65 / 66", city: "Gurugram", state: "Delhi NCR", type: "Emerging Luxury", tag: "High Appreciation" },
  { name: "Dwarka Expressway", area: "Sector 102 - 113", city: "Gurugram", state: "Delhi NCR", type: "Mega Expressway", tag: "New Launch Hotspot" },
  { name: "South Delhi", area: "Greater Kailash / Vasant Kunj", city: "New Delhi", state: "Delhi", type: "Diplomatic & Elite", tag: "Prime Capital" },
  { name: "Noida Expressway", area: "Sector 128 / 137 / 150", city: "Noida", state: "Delhi NCR", type: "Tech Corridor", tag: "Modern High-Rise" },
  { name: "Greater Noida", area: "Pari Chowk / Yamuna Exp.", city: "Greater Noida", state: "Delhi NCR", type: "Integrated Hub", tag: "Affordable Growth" },

  // Bengaluru (Bangalore)
  { name: "Whitefield", area: "EPIP Zone / Hope Farm", city: "Bengaluru", state: "Karnataka", type: "Silicon Hub", tag: "Tech & Luxury Villas" },
  { name: "Indiranagar", area: "100ft Road / Defence Colony", city: "Bengaluru", state: "Karnataka", type: "High Street & Res.", tag: "Prime Cultural" },
  { name: "Koramangala", area: "Block 3 / 4 / 7", city: "Bengaluru", state: "Karnataka", type: "Startup Capital", tag: "Cosmopolitan" },
  { name: "Sarjapur Road", area: "Carmelaram / Haralur", city: "Bengaluru", state: "Karnataka", type: "Fast Growth Corridor", tag: "High Demand" },
  { name: "Hebbal", area: "Bellary Road / Manyata Tech", city: "Bengaluru", state: "Karnataka", type: "Airport Corridor", tag: "Lakefront Luxury" },
  { name: "Electronic City", area: "Phase 1 & 2 IT Hub", city: "Bengaluru", state: "Karnataka", type: "IT Infrastructure", tag: "High Yield" },

  // Hyderabad
  { name: "HITEC City", area: "Madhapur / Cyber Towers", city: "Hyderabad", state: "Telangana", type: "Silicon Valley Hub", tag: "IT & Commercial" },
  { name: "Gachibowli", area: "Financial District Arterial", city: "Hyderabad", state: "Telangana", type: "Corporate Tech", tag: "High ROI" },
  { name: "Jubilee Hills", area: "Road No. 36 / 45", city: "Hyderabad", state: "Telangana", type: "Billionaires Hub", tag: "Exclusive Luxury" },
  { name: "Banjara Hills", area: "Road No. 1 / 12", city: "Hyderabad", state: "Telangana", type: "Heritage Elite", tag: "Prime Central" },
  { name: "Financial District", area: "Nanakramguda", city: "Hyderabad", state: "Telangana", type: "Skyscrapers", tag: "Corporate IFSC" },
  { name: "Kondapur", area: "Near Botanical Garden", city: "Hyderabad", state: "Telangana", type: "Modern Living", tag: "Fast Growing" },

  // Pune
  { name: "Koregaon Park", area: "North Main Road", city: "Pune", state: "Maharashtra", type: "Heritage Lifestyle", tag: "Elite Living" },
  { name: "Hinjewadi", area: "Phase 1 / 2 / 3 IT Park", city: "Pune", state: "Maharashtra", type: "Mega IT SEZ", tag: "Tech Employment" },
  { name: "Baner", area: "Baner-Pashan Link Road", city: "Pune", state: "Maharashtra", type: "Urban High-Rise", tag: "High Demand" },
  { name: "Viman Nagar", area: "Near Phoenix Marketcity", city: "Pune", state: "Maharashtra", type: "Airport Hub", tag: "Cosmopolitan" },
  { name: "Kharadi", area: "EON IT Park / World Trade Center", city: "Pune", state: "Maharashtra", type: "Eastern IT Belt", tag: "Booming Hub" },
  { name: "Wakad", area: "Near Hinjewadi Flyover", city: "Pune", state: "Maharashtra", type: "Residential Growth", tag: "High Appreciation" },

  // Ahmedabad & Gandhinagar
  { name: "Sindhu Bhavan Road", area: "Bodakdev / Thaltej", city: "Ahmedabad", state: "Gujarat", type: "Prime Corridor", tag: "Luxury Hub" },
  { name: "SG Highway", area: "North-South Corridor", city: "Ahmedabad", state: "Gujarat", type: "Commercial & Res.", tag: "Major Artery" },
  { name: "Iscon Ambli Road", area: "Ambli", city: "Ahmedabad", state: "Gujarat", type: "Ultra-Luxury Villas", tag: "High Appreciation" },
  { name: "GIFT City", area: "IFSC Zone", city: "Gandhinagar", state: "Gujarat", type: "Global Financial Hub", tag: "SEZ & FinTech" },
  { name: "Science City Road", area: "Sola", city: "Ahmedabad", state: "Gujarat", type: "Upscale Residential", tag: "Family Friendly" },
  { name: "Bopal", area: "West Ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "Residential Hub", tag: "Fast Growth" },
  { name: "South Bopal (SoBo)", area: "South Bopal", city: "Ahmedabad", state: "Gujarat", type: "Modern Townships", tag: "High Demand" },
  { name: "Prahlad Nagar", area: "Satellite", city: "Ahmedabad", state: "Gujarat", type: "Commercial & Retail", tag: "Prime Corporate" },
  { name: "Bodakdev", area: "Judges Bungalow Road", city: "Ahmedabad", state: "Gujarat", type: "Elite Residential", tag: "Luxury Homes" },
  { name: "Thaltej", area: "West Zone", city: "Ahmedabad", state: "Gujarat", type: "Green & Peaceful", tag: "Premium Living" },
  { name: "Satellite", area: "Central-West", city: "Ahmedabad", state: "Gujarat", type: "Urban Center", tag: "Established" },
  { name: "Vastrapur", area: "Near IIM / AlphaOne", city: "Ahmedabad", state: "Gujarat", type: "Central City Hub", tag: "High Demand" },
  { name: "Navrangpura", area: "Central Ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "Heritage & Business", tag: "Prime City" },
  { name: "Naranpura", area: "Central-North", city: "Ahmedabad", state: "Gujarat", type: "Residential Area", tag: "Established" },
  { name: "Nikol", area: "East Ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "Emerging Corridor", tag: "Growth Potential" },
  { name: "Vaishnodevi Circle", area: "North SG Highway", city: "Ahmedabad", state: "Gujarat", type: "New Launch Hotspot", tag: "Booming Corridor" },
  { name: "Gota", area: "North Ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "Modern Living", tag: "Well Connected" },
  { name: "Shela", area: "Near Club O7", city: "Ahmedabad", state: "Gujarat", type: "High-Rise Living", tag: "Fast Growth" },
  { name: "Shantigram", area: "Adani Township", city: "Ahmedabad", state: "Gujarat", type: "Integrated Township", tag: "Golf Living" },
  { name: "Chandkheda", area: "Near Gandhinagar Link", city: "Ahmedabad", state: "Gujarat", type: "Twin City Corridor", tag: "Metro Connected" },
  { name: "Kudasan & Randesan", area: "GIFT City Link", city: "Gandhinagar", state: "Gujarat", type: "High Growth Corridor", tag: "Modern Living" },

  // Goa
  { name: "Candolim", area: "North Goa Coast", city: "Goa", state: "Goa", type: "Beachside Luxury", tag: "Holiday Villas" },
  { name: "Assagao", area: "Designer Village", city: "Goa", state: "Goa", type: "Heritage & Luxury", tag: "Boutique Living" },
  { name: "Anjuna & Vagator", area: "North Goa", city: "Goa", state: "Goa", type: "Coastal Living", tag: "Vibrant Hub" },
  { name: "Panaji (Panjim)", area: "Miramar / Dona Paula", city: "Panaji", state: "Goa", type: "Capital Waterfront", tag: "Scenic Sea Views" },

  // Kolkata
  { name: "New Town", area: "Action Area 1 / 2 / 3", city: "Kolkata", state: "West Bengal", type: "Planned Smart City", tag: "IT & Financial Hub" },
  { name: "Salt Lake (Bidhannagar)", area: "Sector V IT Park", city: "Kolkata", state: "West Bengal", type: "IT Capital", tag: "Established" },
  { name: "Alipore", area: "South Kolkata", city: "Kolkata", state: "West Bengal", type: "Aristocratic Elite", tag: "Heritage Luxury" },
  { name: "Rajarhat", area: "Near City Centre 2", city: "Kolkata", state: "West Bengal", type: "Modern Corridors", tag: "Airport Link" },

  // Chennai
  { name: "OMR (Old Mahabalipuram Rd)", area: "Perungudi / Sholinganallur", city: "Chennai", state: "Tamil Nadu", type: "IT Expressway", tag: "Tech Belt" },
  { name: "ECR (East Coast Road)", area: "Palavakkam / Neelankarai", city: "Chennai", state: "Tamil Nadu", type: "Beachside Luxury", tag: "Scenic Villas" },
  { name: "Anna Nagar", area: "West / Shanti Colony", city: "Chennai", state: "Tamil Nadu", type: "Planned Urban Hub", tag: "Prestige Living" },
  { name: "Adyar & Besant Nagar", area: "South Coast", city: "Chennai", state: "Tamil Nadu", type: "Coastal Heritage", tag: "Elite Residential" },

  // Other Leading Indian Cities
  { name: "Vesu", area: "VIP Road / Canal Corridor", city: "Surat", state: "Gujarat", type: "Diamond Capital Hub", tag: "Ultra Luxury" },
  { name: "Alkapuri", area: "RC Dutt Road", city: "Vadodara", state: "Gujarat", type: "Royal City Center", tag: "Prime Commercial" },
  { name: "C-Scheme", area: "Civil Lines / Ashok Nagar", city: "Jaipur", state: "Rajasthan", type: "Pink City Heritage", tag: "Royal Residences" },
  { name: "Jagatpura", area: "Near Airport & Ring Road", city: "Jaipur", state: "Rajasthan", type: "Growth Corridor", tag: "High Demand" },
  { name: "Gomti Nagar", area: "Vibhuti Khand / Shaheed Path", city: "Lucknow", state: "Uttar Pradesh", type: "Modern Planned City", tag: "IT & Commercial" },
  { name: "Vijay Nagar", area: "AB Road / Scheme 54", city: "Indore", state: "Madhya Pradesh", type: "Commercial Spine", tag: "Fast Growing" },
  { name: "Super Corridor", area: "Near Airport & TCS Campus", city: "Indore", state: "Madhya Pradesh", type: "Tech Expressway", tag: "Future Growth" },
  { name: "Sector 17 & Mohali", area: "IT City / Aerocity", city: "Chandigarh", state: "Punjab", type: "Tricity IT Hub", tag: "Planned Living" },
  { name: "Marine Drive", area: "Waterfront Boulevard", city: "Kochi", state: "Kerala", type: "Coastal Marine Views", tag: "Luxury Promenade" },
  { name: "Kakkanad", area: "Infopark / SmartCity", city: "Kochi", state: "Kerala", type: "Cyber City Kerala", tag: "High Appreciation" },
  { name: "Madhurawada", area: "Beach Road / IT SEZ", city: "Visakhapatnam", state: "Andhra Pradesh", type: "Coastal Smart City", tag: "Executive Capital" },
  { name: "Infocity / Patia", area: "KIIT Square", city: "Bhubaneswar", state: "Odisha", type: "Eastern IT Capital", tag: "Smart City" },
  { name: "Avinashi Road", area: "Peelamedu / Race Course", city: "Coimbatore", state: "Tamil Nadu", type: "Industrial & Textile", tag: "Prime City" },
  { name: "Rajpur Road", area: "Mussoorie Foothills", city: "Dehradun", state: "Uttarakhand", type: "Scenic Luxury", tag: "Foothill Retreats" },
];

const DYNAMIC_WORDS = [
  "High-Potential",
  "Ultra-Luxury",
  "High-Yield",
  "Vastu-Aligned",
];

const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/hero-luxury.jpg",
    title: "The Palm Sanctuary Villa",
    location: "Iscon Ambli Road, Ahmedabad",
    tag: "Ultra-Luxury Villa",
  },
  {
    id: 2,
    image: "/images/hero-water-mansion.jpg",
    title: "Cascading Water Mansion",
    location: "Sindhubhavan Road, Ahmedabad",
    tag: "Signature Residence",
  },
  {
    id: 3,
    image: "/images/hero-gift-tower.jpg",
    title: "GIFT Diamond Corporate Tower",
    location: "GIFT City IFSC, Gandhinagar",
    tag: "Grade-A Commercial",
  },
  {
    id: 4,
    image: "/images/main.jpg",
    title: "The Grand Courtyard Estate",
    location: "SG Highway, Bodakdev",
    tag: "Luxury Bungalow",
  },
  {
    id: 5,
    image: "/images/ninth.png",
    title: "Skyline Glass Penthouse",
    location: "Science City Road, Ahmedabad",
    tag: "Sky Condominium",
  },
];

function highlightMatch(text, query) {
  if (!query || !query.trim()) return text;
  try {
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.trim().toLowerCase() ? (
        <span key={i} className="font-extrabold text-[#a98440] bg-amber-100/70 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  } catch {
    return text;
  }
}

function resolveDestination({ dealMode, categoryTab, propertyType, bedrooms, search, city }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (city) params.set("city", city);
  if (bedrooms) params.set("bedrooms", bedrooms);

  let path = "/residential";

  if (dealMode === "rent") {
    path = "/rent";
    if (categoryTab === "commercial") path = "/commercial";
    else if (categoryTab === "villa") path = "/plot-weekend-villa";
    if (propertyType) params.set("property_type", propertyType);
  } else if (dealMode === "invest") {
    path = "/investment";
    if (categoryTab === "gift-city") path = "/gift-city";
    else if (categoryTab === "land") path = "/plot-weekend-villa";
    else if (categoryTab === "retail") path = "/commercial";
    if (propertyType) params.set("property_type", propertyType);
  } else {
    path = "/residential";
    if (categoryTab === "commercial") path = "/commercial";
    else if (categoryTab === "plots") path = "/plot-weekend-villa";
    else if (categoryTab === "new-launch") params.set("is_featured", "true");
    if (propertyType) params.set("property_type", propertyType);
  }

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function HeroPropertyTypeDropdown({
  value,
  onChange,
  bedrooms,
  onBedroomsChange,
  dealMode,
  categoryTab,
  isOpen,
  onToggle,
  onClose,
  dropdownRef,
}) {
  const isCommercial = dealMode === "invest" || categoryTab === "commercial";
  const isInvest = dealMode === "invest";
  const isResidential = !isCommercial && !isInvest;

  const currentTypes = isInvest
    ? INVEST_PROPERTY_TYPES
    : isCommercial
    ? COMMERCIAL_PROPERTY_TYPES
    : RESIDENTIAL_PROPERTY_TYPES;

  let displayLabel = "All Residential";
  if (isInvest) {
    const active = INVEST_PROPERTY_TYPES.find((o) => o.value === value);
    displayLabel = active?.label || "All Assets";
  } else if (isCommercial) {
    const active = COMMERCIAL_PROPERTY_TYPES.find((o) => o.value === value);
    displayLabel = active?.label || "All Commercial";
  } else {
    const activeType = RESIDENTIAL_PROPERTY_TYPES.find((o) => o.value === value);
    const typeName = activeType?.value ? activeType.label.split(" / ")[0] : "";
    const bhkName = bedrooms ? (bedrooms === "5" ? "5+ BHK" : `${bedrooms} BHK`) : "";

    if (bhkName && typeName) {
      displayLabel = `${bhkName} ${typeName}`;
    } else if (bhkName) {
      displayLabel = `${bhkName} Homes`;
    } else if (typeName) {
      displayLabel = activeType.label;
    } else {
      displayLabel = dealMode === "rent" ? "All Rentals" : "All Residential";
    }
  }

  return (
    <div ref={dropdownRef} className="relative flex items-center shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 py-2 pl-2 pr-3 text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#a98440] transition-colors cursor-pointer outline-none select-none"
      >
        <span className="whitespace-nowrap">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#a98440]" : ""
          }`}
        />
      </button>

      {/* The Detailed Panel */}
      {isOpen && (
        <div className="panel-drop-animation absolute left-0 top-[calc(100%+12px)] z-50 w-[300px] sm:w-[410px] max-h-[min(480px,calc(100vh-220px))] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.05]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#a98440]">
                {isResidential ? "Residential Filter" : isCommercial ? "Commercial Filter" : "Investment Filter"}
              </h4>
              <p className="text-[11px] text-slate-500">Select property type & configuration</p>
            </div>
            {(value || bedrooms) && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  onBedroomsChange("");
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Property Category List */}
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Property Category
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentTypes.map((opt) => {
                const active = opt.value === value;
                const Icon = opt.icon || Building2;
                return (
                  <button
                    key={opt.value || "all"}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`group flex items-start gap-2 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                      active
                        ? "border-[#a98440] bg-[#a98440]/10 shadow-2xs"
                        : "border-slate-100 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-[#a98440] text-white"
                          : "bg-white text-slate-500 border border-slate-200/60 group-hover:text-[#a98440]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight truncate ${
                          active ? "text-[#a98440]" : "text-slate-800"
                        }`}
                      >
                        {opt.label}
                      </p>
                      {opt.desc && (
                        <p className="text-[9.5px] text-slate-400 truncate leading-tight mt-0.5">
                          {opt.desc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bedrooms (BHK) Selection (Shown for Residential) */}
          {isResidential && (
            <div className="mt-3.5 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Bedrooms (BHK)
                </p>
                {bedrooms && (
                  <span className="text-[10px] font-bold text-[#a98440]">
                    {bedrooms === "5" ? "5+ BHK Selected" : `${bedrooms} BHK Selected`}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {BHK_OPTIONS.map((bhkOpt) => {
                  const active = bedrooms === bhkOpt.value;
                  return (
                    <button
                      key={bhkOpt.label}
                      type="button"
                      onClick={() => onBedroomsChange(bhkOpt.value)}
                      className={`rounded-lg py-1.5 text-center text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? "bg-[#a98440] text-white shadow-xs"
                          : "bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-[#a98440]/50"
                      }`}
                    >
                      {bhkOpt.label.replace(" BHK", "")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Done Action */}
          <div className="mt-3.5 border-t border-slate-100 pt-3 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 truncate mr-2">
              <span className="font-semibold text-slate-800">Filter:</span>{" "}
              <span className="text-[#a98440] font-bold">{displayLabel}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#a98440] hover:bg-[#977232] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeroSearch() {
  const router = useRouter();
  const [dealMode, setDealMode] = useState("buy");
  const [categoryTab, setCategoryTab] = useState("residential");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [search, setSearch] = useState("");

  const [wordIndex, setWordIndex] = useState(0);
  const [fadeWord, setFadeWord] = useState(true);

  // Background Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dropdown Visibility States
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const typeDropdownRef = useRef(null);
  const locationRef = useRef(null);

  // Auto-advance slide every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Dynamic word cycle animation every 2.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
        setFadeWord(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close open panels
  useEffect(() => {
    function handleClickOutside(e) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Filter locations dynamically based on user input
  const query = search.trim().toLowerCase();
  const filteredLocations = query
    ? ALL_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.city.toLowerCase().includes(query) ||
          (loc.state && loc.state.toLowerCase().includes(query)) ||
          (loc.area && loc.area.toLowerCase().includes(query)) ||
          (loc.tag && loc.tag.toLowerCase().includes(query))
      )
    : ALL_LOCATIONS.slice(0, 10); // Top popular places across India when empty

  function handleSearch(customSearch, customCity) {
    const s = typeof customSearch === "string" ? customSearch : search;
    setIsLocationOpen(false);
    setIsTypeDropdownOpen(false);

    let resolvedCity = customCity;
    if (!resolvedCity && s) {
      const match = ALL_LOCATIONS.find(
        (l) =>
          l.name.toLowerCase() === s.trim().toLowerCase() ||
          l.city.toLowerCase() === s.trim().toLowerCase()
      );
      if (match) {
        resolvedCity = match.city;
      }
    }

    router.push(
      resolveDestination({
        dealMode,
        categoryTab,
        propertyType,
        bedrooms,
        search: s,
        city: resolvedCity,
      })
    );
  }

  return (
    <section className="relative z-30 bg-slate-950 pb-28 sm:pb-36 lg:pb-40 pt-20 md:pt-24 min-h-[600px] sm:min-h-[660px] lg:min-h-[700px] flex flex-col justify-center">
      {/* 1. Ultra-Luxury Architectural Background with Smooth Slide Transitions */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Sliding Image Track */}
        <div
          className="flex h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="relative h-full w-full min-w-full shrink-0 overflow-hidden"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center opacity-95 brightness-[0.98] contrast-[1.05]"
              />
            </div>
          ))}
        </div>

        {/* Ambient lighting overlays */}
        <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.12),transparent_70%)]" />
      </div>

      {/* 2. Bottom Slide Info Badge - Lower z-index and hidden when dropdown is active */}
      <div
        className={`pointer-events-none absolute bottom-4 left-6 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/80 px-4 py-2 backdrop-blur-md text-xs text-white shadow-xl transition-all duration-200 ${
          isTypeDropdownOpen || isLocationOpen ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-amber-300">{HERO_SLIDES[currentSlide].tag}:</span>
        <span className="font-semibold text-white">{HERO_SLIDES[currentSlide].title}</span>
        <span className="text-white/50">•</span>
        <span className="text-white/80">{HERO_SLIDES[currentSlide].location}</span>
      </div>

      {/* 3. Hero Content - Higher z-index than background badge */}
      <div className="relative z-30">
        <div className="container-box text-center">
          {/* Main Animated Headline */}
          <h1 className="hero-title mx-auto max-w-[900px] xl:max-w-[1020px] text-[28px] leading-[1.1] text-white sm:text-[40px] md:text-[50px] lg:text-[58px] xl:text-[64px] drop-shadow-lg">
            Find{" "}
            <span
              className={`animate-shimmer inline-block bg-gradient-to-r from-[#e6c278] via-[#fce6a8] to-[#a98440] bg-clip-text text-transparent transition-all duration-300 ${
                fadeWord ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
              }`}
            >
              {DYNAMIC_WORDS[wordIndex]}
            </span>
            <br />
            Real Estate Opportunities
          </h1>

          <p className="mt-2.5 sm:mt-3 mx-auto max-w-[680px] xl:max-w-[740px] text-xs leading-relaxed text-white/85 sm:text-sm md:text-base drop-shadow">
            Explore curated luxury residences, flagship corporate offices, and emerging high-growth corridors with complete transparency.
          </p>

          {/* Search Box Container with Ambient Pulse Glow */}
          <div className="relative mt-5 sm:mt-6 mx-auto w-full max-w-[980px] lg:max-w-[1040px] xl:max-w-[1100px] text-left z-30">
            {/* Ambient Background Aura */}
            <div className="animate-pulse-ambient absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-r from-[#a98440]/25 via-[#fbbf24]/20 to-[#a98440]/25 blur-2xl" />

            {/* Deal mode tabs (Buy / Rent / Invest) - Centered directly above the card */}
            <div className="flex items-end justify-center gap-1.5">
              {DEAL_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => {
                    setDealMode(mode.value);
                    const defaultTab = CATEGORY_TABS_BY_MODE[mode.value]?.[0]?.value || "residential";
                    setCategoryTab(defaultTab);
                    setPropertyType("");
                    setBedrooms("");
                    setIsTypeDropdownOpen(false);
                    setIsLocationOpen(false);
                  }}
                  className={`rounded-t-xl px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                    dealMode === mode.value
                      ? "bg-[#a98440] text-white shadow-sm"
                      : "glass-search-tab text-slate-900 hover:bg-white/95"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Unified Glassmorphic Search Card - NOTE: No overflow-hidden so panels drop down cleanly! */}
            <div className="glass-search-card relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)]">
              {/* Category subtabs row */}
              <div className="mb-3 flex items-center gap-6 sm:gap-8 border-b border-slate-100 pb-2.5 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-hide">
                {(CATEGORY_TABS_BY_MODE[dealMode] || CATEGORY_TABS_BY_MODE.buy).map((tabItem) => (
                  <button
                    key={tabItem.value}
                    type="button"
                    onClick={() => {
                      setCategoryTab(tabItem.value);
                      setPropertyType("");
                      setBedrooms("");
                    }}
                    className={`relative pb-2 transition cursor-pointer shrink-0 ${
                      categoryTab === tabItem.value
                        ? "border-b-2 border-[#a98440] text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900 font-medium"
                    }`}
                  >
                    {tabItem.label}
                    {tabItem.value === "new-launch" && (
                      <span className="inline-block h-2 w-2 rounded-full bg-red-600 ml-1 mb-2.5 align-middle" />
                    )}
                  </button>
                ))}
              </div>

              {/* Main Search Input Line */}
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
                {/* Left: Detailed Property Type & Configuration Dropdown */}
                <HeroPropertyTypeDropdown
                  value={propertyType}
                  onChange={setPropertyType}
                  bedrooms={bedrooms}
                  onBedroomsChange={setBedrooms}
                  dealMode={dealMode}
                  categoryTab={categoryTab}
                  isOpen={isTypeDropdownOpen}
                  onToggle={() => {
                    setIsTypeDropdownOpen((prev) => !prev);
                    setIsLocationOpen(false);
                  }}
                  onClose={() => setIsTypeDropdownOpen(false)}
                  dropdownRef={typeDropdownRef}
                />

                {/* Divider Line */}
                <div className="hidden md:block h-7 w-[1px] bg-slate-200 shrink-0" />

                {/* Main Search Input with Location Suggestions Dropdown */}
                <div ref={locationRef} className="relative flex-1">
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setIsLocationOpen(true);
                      setIsTypeDropdownOpen(false);
                    }}
                    onFocus={() => {
                      setIsLocationOpen(true);
                      setIsTypeDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsLocationOpen(false);
                        handleSearch();
                      } else if (e.key === "Escape") {
                        setIsLocationOpen(false);
                      }
                    }}
                    className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                    placeholder="Search city, locality, project, builder, or landmark"
                    autoComplete="off"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setIsLocationOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 hover:bg-slate-300 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}

                  {/* Location Suggestions Dropdown Panel */}
                  {isLocationOpen && (
                    <div className="panel-drop-animation absolute left-0 right-0 sm:-left-3 sm:-right-3 top-[calc(100%+12px)] z-50 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-[0_25px_60px_rgba(15,23,42,0.22)] ring-1 ring-black/[0.05] max-h-[290px] overflow-y-auto">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 text-[11px]">
                        <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#a98440]" />
                          <span>
                            {search.trim()
                              ? `Places matching "${search}" (${filteredLocations.length})`
                              : "Popular Cities & Prime Localities Across India"}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsLocationOpen(false)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label="Close suggestions"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Locations List */}
                      <div className="mt-1.5 space-y-1">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((loc) => (
                            <button
                              key={`${loc.city}-${loc.name}`}
                              type="button"
                              onClick={() => {
                                setSearch(loc.name);
                                setIsLocationOpen(false);
                                handleSearch(loc.name, loc.city);
                              }}
                              className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all hover:bg-amber-50/70 hover:border-[#a98440]/30 border border-transparent cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100/70 text-[#a98440] group-hover:bg-[#a98440] group-hover:text-white transition-colors">
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#a98440] transition-colors truncate">
                                    {highlightMatch(loc.name, search)}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {highlightMatch(loc.area || loc.name, search)}, {highlightMatch(loc.city, search)}
                                    {loc.state ? ` • ${highlightMatch(loc.state, search)}` : ""}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 group-hover:bg-amber-100 group-hover:text-[#a98440] transition-colors">
                                  {loc.tag || loc.type}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#a98440] transition-all" />
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-xs text-slate-600 font-semibold">
                              No matching locations found for &ldquo;{search}&rdquo;
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Press Enter or click Search to perform a site-wide search for this term.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Icons & Primary Golden Search Button */}
                <div className="flex items-center gap-2 justify-end">
                  {/* Mic Voice Search */}
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-blue-50/90 text-[#0284c7] hover:bg-blue-100 transition cursor-pointer shadow-xs"
                    title="Voice Search"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                  </button>

                  {/* Crosshair Location (Near Me) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("Ahmedabad");
                      handleSearch("Ahmedabad");
                    }}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-blue-50/90 text-[#0284c7] hover:bg-blue-100 transition cursor-pointer shadow-xs"
                    title="Near Me"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="12" cy="12" r="7"/>
                      <line x1="12" y1="2" x2="12" y2="5"/>
                      <line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="5" y2="12"/>
                      <line x1="19" y1="12" x2="22" y2="12"/>
                    </svg>
                  </button>

                  {/* Golden Search Button */}
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="rounded-xl bg-[#a98440] hover:bg-[#977232] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    Search Properties
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
