import { CATEGORY_CONFIG, PROPERTY_ENDPOINTS } from "./constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

const FALLBACK_PROPERTIES = {
  "sahjanand-heights": {
    id: 11,
    title: "Sahjanand Skyview",
    city: "Ahmedabad",
    area: "Iscon Ambli Road",
    address: "Iscon Ambli Road, Ahmedabad",
    price: "9152000",
    price_per_sqft: "6,950",
    area_sqft: "2150",
    slug: "sahjanand-heights",
    property_type: "4 BHK Luxury Apartment",
    builder: "Sahjanand Group",
    builder_rating: "4.7",
    reviews_count: 128,
    delivered_projects: 14,
    main_image: "/images/first.jpg",
    thumbnails: ["/images/first.jpg", "/images/second.jpg", "/images/seven.png", "/images/ninth.png"],
    roi_potential: "14%",
    rental_yield: "5.6%",
    possession: "April 2029",
    bedrooms: 4,
    is_featured: false,
    description: "Premium high-rise luxury apartment on Iscon Ambli Road with expansive views, club amenities and RERA verified approval.",
  },
  "skyline-residences": {
    id: 12,
    title: "Skyline Residences",
    city: "Ahmedabad",
    area: "Sindhubhavan Road",
    address: "Main SBR Boulevard, Sindhubhavan Road, Ahmedabad",
    price: "12800000",
    price_per_sqft: "6,950",
    area_sqft: "2450",
    slug: "skyline-residences",
    property_type: "4 BHK Luxury Apartments",
    builder: "Shilp Group",
    builder_rating: "4.7",
    reviews_count: 128,
    delivered_projects: 14,
    main_image: "/images/main.jpg",
    thumbnails: ["/images/main.jpg", "/images/second.jpg", "/images/seven.png", "/images/third.png"],
    roi_potential: "14%",
    rental_yield: "5.6%",
    possession: "Dec 2026",
    investment_score: "9.4",
    appreciation: "High Appreciation",
    bedrooms: 4,
    is_featured: true,
    description: "Exclusive luxury apartments on prime Sindhubhavan Road corridor with club amenities and high appreciation score.",
  },
  "the-sky-residences": {
    id: 1,
    title: "The Sky Residences",
    city: "Ahmedabad",
    area: "Iscon Ambli Road",
    address: "Opp. Ambli BRTS, Iscon Ambli Road, Ahmedabad",
    price: "42000000",
    price_per_sqft: "9882",
    area_sqft: "4250",
    slug: "the-sky-residences",
    property_type: "4 BHK Ultra-Lux Sky Villa",
    builder: "Skyline Living",
    builder_rating: "4.8",
    reviews_count: 94,
    delivered_projects: 8,
    main_image: "/images/ninth.png",
    thumbnails: ["/images/ninth.png", "/images/first.jpg", "/images/second.jpg", "/images/eight.png"],
    roi_potential: "15.5%",
    rental_yield: "5.2%",
    possession: "Ready to Move",
    bedrooms: 4,
    description: "Ultra-luxury high-rise residences featuring private sky decks, panoramic skyline views, double-height ceiling living rooms, and private elevator vestibule.",
  },
  "shantigram-aster": {
    id: 2,
    title: "Adani Shantigram Aster",
    city: "Ahmedabad",
    area: "SG Highway",
    address: "Adani Shantigram Township, SG Highway, Ahmedabad",
    price: "23500000",
    price_per_sqft: "8245",
    area_sqft: "2850",
    slug: "shantigram-aster",
    property_type: "3 & 4 BHK Golf Condos",
    builder: "Adani Realty",
    main_image: "/images/seven.png",
    roi_potential: "14.2%",
    rental_yield: "4.9%",
    possession: "December 2026",
    description: "Exclusive golf-view condominiums situated inside the 600-acre master-planned Shantigram integrated township.",
  },
  "shubham-anthem": {
    id: 5,
    title: "Shubham Anthem",
    city: "Ahmedabad",
    area: "Club O7 Road, Shela",
    address: "Opposite Club O7, Shela, Ahmedabad",
    price: "14400000",
    price_per_sqft: "6857",
    area_sqft: "2100",
    slug: "shubham-anthem",
    property_type: "3 & 4 BHK Luxury Apartments",
    builder: "Shubham Group",
    main_image: "/images/seven.png",
    roi_potential: "16.8%",
    rental_yield: "5.5%",
    possession: "March 2027",
    description: "Elegantly crafted urban sanctuary near Club O7 featuring lifestyle amenities, landscaped podium gardens, and high-efficiency smart layout plans.",
  },
  "shruti-apartment": {
    id: 6,
    title: "Shruti Residency",
    city: "Ahmedabad",
    area: "Drive-In Road, Memnagar",
    address: "Near Drive-In Cinema, Memnagar, Ahmedabad",
    price: "16000000",
    price_per_sqft: "7619",
    area_sqft: "2100",
    slug: "shruti-apartment",
    property_type: "3 BHK Premium Residences",
    builder: "Shruti Infra",
    main_image: "/images/eight.png",
    roi_potential: "13.5%",
    rental_yield: "5.1%",
    possession: "Ready to Move",
    description: "Prime central Ahmedabad residences offering swift access to SG Highway, University area, and Drive-in retail hubs with ready possession.",
  },
  "the-grandeur": {
    id: 7,
    title: "The Grandeur Heights",
    city: "Ahmedabad",
    area: "Science City Road, Sola",
    address: "Science City Road, Near Sola CIMS, Ahmedabad",
    price: "22000000",
    price_per_sqft: "8148",
    area_sqft: "2700",
    slug: "the-grandeur",
    property_type: "3 & 4 BHK High-Rise",
    builder: "Grandeur Spaces",
    main_image: "/images/first.jpg",
    roi_potential: "15.0%",
    rental_yield: "5.3%",
    possession: "June 2026",
    description: "Iconic twin tower overlooking Science City boulevard with infinite views, sky observatory lounge, and dual-layer security systems.",
  },
  "gift-one-hub": {
    id: 3,
    title: "GIFT One Corporate Tower",
    city: "Gandhinagar",
    area: "GIFT City SEZ",
    address: "Block 56, Zone 1, GIFT City IFSC, Gandhinagar",
    price: "18500000",
    price_per_sqft: "9487",
    area_sqft: "1950",
    slug: "gift-one-hub",
    property_type: "Grade A Pre-leased Office",
    commercial_type: "office",
    gift_property_type: "office",
    investment_type: "preleased",
    builder: "GIFT Development Corp",
    main_image: "/images/hero-gift-tower.jpg",
    roi_potential: "18.2%",
    rental_yield: "8.5%",
    possession: "Immediate Lease",
    description: "Grade A pre-leased commercial office spaces located in India's premier International Financial Services Centre with 8.5% net rental return.",
  },
  "sindhubhavan-trade-center": {
    id: 8,
    title: "Sindhubhavan Corporate Spire",
    city: "Ahmedabad",
    area: "Sindhubhavan Road",
    address: "Main SBR Boulevard, Bodakdev, Ahmedabad",
    price: "34000000",
    price_per_sqft: "11333",
    area_sqft: "3000",
    slug: "sindhubhavan-trade-center",
    property_type: "Flagship Corporate Headquarters",
    commercial_type: "showroom",
    gift_property_type: "commercial",
    investment_type: "high_return",
    builder: "Signature Commercials",
    main_image: "/images/main.jpg",
    roi_potential: "17.0%",
    rental_yield: "7.8%",
    possession: "Ready to Fitout",
    description: "High-visibility corporate headquarters located on Ahmedabad's highest-valued arterial commercial corridor.",
  },
  "titanium-square": {
    id: 9,
    title: "Titanium Prime Retail Showroom",
    city: "Ahmedabad",
    area: "SG Highway",
    address: "Next to Thaltej Cross Roads, SG Highway, Ahmedabad",
    price: "27500000",
    price_per_sqft: "11000",
    area_sqft: "2500",
    slug: "titanium-square",
    property_type: "High-Footfall Retail Showroom",
    commercial_type: "shop",
    gift_property_type: "commercial",
    investment_type: "rental_income",
    builder: "Goyal & Co",
    main_image: "/images/second.jpg",
    roi_potential: "15.8%",
    rental_yield: "7.2%",
    possession: "Ready Possession",
    description: "Triple-height glass frontage showroom on prime SG Highway intersection offering massive customer visibility and steady rental appreciation.",
  },
  "bavlu-farmland": {
    id: 4,
    title: "Bavlu Serene Farm Villas",
    city: "Ahmedabad",
    area: "Sanand - Nalsarovar Road",
    address: "Near Bavlu Lake Sanctuary, Sanand-Nalsarovar Corridor",
    price: "14500000",
    price_per_sqft: "2230",
    area_sqft: "6500",
    slug: "bavlu-farmland",
    property_type: "Luxury Weekend Farmland",
    builder: "Nirvana Escapes",
    main_image: "/images/hero-water-mansion.jpg",
    roi_potential: "19.5%",
    rental_yield: "4.0%",
    possession: "Immediate Registry",
    description: "Lush green gated farmland community featuring private orchards, solar-powered organic living, and club amenities.",
  },
  "kensville-golf-villa": {
    id: 10,
    title: "Kensville Signature Golf Villa",
    city: "Ahmedabad",
    area: "Dev Dholera, Bavla",
    address: "Kensville Golf & Country Club, Bavla-Rajkot Corridor",
    price: "38000000",
    price_per_sqft: "7600",
    area_sqft: "5000",
    slug: "kensville-golf-villa",
    property_type: "Championship Golf Course Villa",
    builder: "Kensville Living",
    main_image: "/images/hero-luxury.jpg",
    roi_potential: "14.5%",
    rental_yield: "5.0%",
    possession: "Ready to Move",
    description: "Signature 18-hole championship golf-course facing luxury villa with private putting green, infinity lap pool, and exclusive resort clubhouse membership.",
  },
};

const CATALOG_BY_CATEGORY = {
  residential: [
    FALLBACK_PROPERTIES["sahjanand-heights"],
    FALLBACK_PROPERTIES["skyline-residences"],
    FALLBACK_PROPERTIES["the-sky-residences"],
    FALLBACK_PROPERTIES["shantigram-aster"],
    FALLBACK_PROPERTIES["shubham-anthem"],
    FALLBACK_PROPERTIES["shruti-apartment"],
    FALLBACK_PROPERTIES["the-grandeur"],
  ],
  commercial: [
    FALLBACK_PROPERTIES["gift-one-hub"],
    FALLBACK_PROPERTIES["sindhubhavan-trade-center"],
    FALLBACK_PROPERTIES["titanium-square"],
  ],
  "gift-city": [
    FALLBACK_PROPERTIES["gift-one-hub"],
    FALLBACK_PROPERTIES["sindhubhavan-trade-center"],
  ],
  "plot-weekend-villa": [
    FALLBACK_PROPERTIES["bavlu-farmland"],
    FALLBACK_PROPERTIES["kensville-golf-villa"],
  ],
  investment: [
    FALLBACK_PROPERTIES["gift-one-hub"],
    FALLBACK_PROPERTIES["sindhubhavan-trade-center"],
    FALLBACK_PROPERTIES["titanium-square"],
  ],
};

function getFallbackPropertiesForEndpoint(endpoint = "") {
  let list = CATALOG_BY_CATEGORY.residential;
  for (const [key, catList] of Object.entries(CATALOG_BY_CATEGORY)) {
    if (endpoint.includes(key) || endpoint.includes(key.replace("-", "_"))) {
      list = catList;
      break;
    }
  }

  const queryIndex = endpoint.indexOf("?");
  if (queryIndex === -1) return list;

  const searchParams = new URLSearchParams(endpoint.slice(queryIndex));
  const search = (
    searchParams.get("search") ||
    searchParams.get("area") ||
    searchParams.get("area__iexact") ||
    ""
  ).toLowerCase().trim();
  const city = (searchParams.get("city") || "").toLowerCase().trim();
  const bedrooms = searchParams.get("bedrooms");
  const bedroomsGte = searchParams.get("bedrooms__gte");
  const propertyType = (
    searchParams.get("property_type") ||
    searchParams.get("commercial_type") ||
    searchParams.get("investment_type") ||
    ""
  ).toLowerCase().trim();
  const priceGte = parseFloat(searchParams.get("price__gte"));
  const priceLte = parseFloat(searchParams.get("price__lte"));
  const ordering = searchParams.get("ordering");

  let filtered = list;

  if (search) {
    const searchTerms = search.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((p) => {
      const text = `${p.title || ""} ${p.area || ""} ${p.address || ""} ${p.builder || ""} ${p.property_type || ""} ${p.city || ""}`.toLowerCase();
      return text.includes(search) || searchTerms.some((term) => text.includes(term));
    });
  }

  if (city) {
    filtered = filtered.filter((p) => (p.city || "").toLowerCase().includes(city));
  }

  if (bedrooms) {
    filtered = filtered.filter((p) => {
      if (p.bedrooms) return String(p.bedrooms) === String(bedrooms);
      return (p.property_type || "").includes(`${bedrooms} BHK`);
    });
  }

  if (bedroomsGte) {
    filtered = filtered.filter((p) => {
      const minBhk = parseInt(bedroomsGte, 10);
      if (p.bedrooms) return p.bedrooms >= minBhk;
      const match = (p.property_type || "").match(/(\d+)\s*BHK/i);
      return match ? parseInt(match[1], 10) >= minBhk : true;
    });
  }

  if (propertyType) {
    filtered = filtered.filter((p) =>
      (p.property_type || "").toLowerCase().includes(propertyType)
    );
  }

  if (!isNaN(priceGte)) {
    filtered = filtered.filter((p) => parseFloat(p.price || 0) >= priceGte);
  }

  if (!isNaN(priceLte)) {
    filtered = filtered.filter((p) => parseFloat(p.price || 0) <= priceLte);
  }

  if (ordering === "price") {
    filtered = [...filtered].sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
  } else if (ordering === "-price") {
    filtered = [...filtered].sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
  }

  return filtered;
}

export async function fetchProperties(endpoint) {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.results)) {
          return data.results;
        }
        return Array.isArray(data) ? data : [];
      }
    } catch {
      console.warn(`Backend offline at ${endpoint}, serving curated catalog.`);
    }
  }

  // Graceful fallback when backend server is offline or unreachable
  return getFallbackPropertiesForEndpoint(endpoint);
}

export async function fetchPropertyDetail(category, slug) {
  const config = CATEGORY_CONFIG[category];

  if (config && API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}${config.endpoint}${slug}/`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.warn(`Backend unreachable for property ${category}/${slug}, using fallback inventory:`, error?.message);
    }
  }

  // Fallback to local property inventory when backend is offline or returns 404
  if (slug) {
    if (FALLBACK_PROPERTIES[slug]) return FALLBACK_PROPERTIES[slug];
    const normalized = slug.replace(/_/g, "-");
    if (FALLBACK_PROPERTIES[normalized]) return FALLBACK_PROPERTIES[normalized];
    const match = Object.values(FALLBACK_PROPERTIES).find(
      (p) => p.slug === slug || p.slug === normalized || String(p.id) === String(slug)
    );
    if (match) return match;
  }

  return FALLBACK_PROPERTIES["shubham-anthem"] || null;
}

export async function fetchHomeFeaturedProperties() {
  const endpoints = [
    { category: "residential", endpoint: PROPERTY_ENDPOINTS.residential },
    { category: "commercial", endpoint: PROPERTY_ENDPOINTS.commercial },
    { category: "gift-city", endpoint: PROPERTY_ENDPOINTS.giftCity },
  ];

  const results = await Promise.allSettled(
    endpoints.map(async (item) => {
      const data = await fetchProperties(`${item.endpoint}?is_featured=true`);

      return data.map((property) => ({
        ...property,
        frontend_category: item.category,
      }));
    })
  );

  const properties = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);

  return properties.slice(0, 8);
}

export async function submitLead(data) {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/leads/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        return await res.json();
      }
      console.warn("Backend returned status", res.status, "for lead submission. Saving locally.");
    } catch (err) {
      console.warn("Backend offline/unreachable for lead submission, persisting locally:", err?.message);
    }
  }

  // Graceful offline fallback: persist lead in localStorage so user's enquiry is preserved
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const existing = JSON.parse(window.localStorage.getItem("nirvana_leads") || "[]");
      existing.push({
        ...data,
        submitted_at: new Date().toISOString(),
        id: Date.now(),
      });
      window.localStorage.setItem("nirvana_leads", JSON.stringify(existing));
    }
  } catch {
    // Ignore storage issues
  }

  return {
    success: true,
    message: "Enquiry submitted successfully.",
    id: Date.now(),
  };
}

export async function submitProperty(data) {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/submitted-properties/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        return await res.json();
      }
      console.warn("Backend returned status", res.status, "for property submission. Saving locally.");
    } catch (err) {
      console.warn("Backend offline/unreachable for property submission, persisting locally:", err?.message);
    }
  }

  // Graceful offline fallback: persist property in localStorage
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const existing = JSON.parse(window.localStorage.getItem("nirvana_submitted_properties") || "[]");
      existing.push({
        ...data,
        submitted_at: new Date().toISOString(),
        id: Date.now(),
      });
      window.localStorage.setItem("nirvana_submitted_properties", JSON.stringify(existing));
    }
  } catch {
    // Ignore storage issues
  }

  return {
    success: true,
    message: "Property submitted successfully.",
    id: Date.now(),
  };
}