"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchHomeFeaturedProperties } from "@/lib/api";
import { getImageUrl } from "@/lib/format";
import EnquireModal from "@/components/property/EnquireModal";
import AmenitiesModal from "@/components/property/AmenitiesModal";

function displayPrice(value) {
  if (!value) return "Price on Request";
  if (typeof value === "string" && (value.includes("₹") || value.includes("Cr") || value.includes("Lac"))) {
    return value;
  }
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;

  if (numberValue >= 10000000) {
    const val = (numberValue / 10000000).toFixed(2).replace(/\.?0+$/, "");
    return `₹${val} Cr +`;
  }
  if (numberValue >= 100000) {
    const val = (numberValue / 100000).toFixed(2).replace(/\.?0+$/, "");
    return `₹${val} Lac`;
  }
  return `₹${numberValue.toLocaleString("en-IN")}`;
}

const fallbackProjects = [
  {
    id: 1,
    title: "The Sky Residences",
    city: "Ahmedabad",
    area: "Iscon Ambli Road",
    price: "42000000",
    area_sqft: "4250",
    slug: "the-sky-residences",
    frontend_category: "residential",
    main_image: "/images/ninth.png",
    property_type: "4 BHK Ultra-Lux",
    builder: "Skyline Living",
    badge: "High ROI",
    possession: "Dec 2025",
  },
  {
    id: 11,
    title: "Sahjanand Skyview",
    city: "Ahmedabad",
    area: "Iscon Ambli Road",
    price: "18500000",
    area_sqft: "2450",
    slug: "sahjanand-heights",
    frontend_category: "residential",
    main_image: "/images/first.jpg",
    property_type: "4 BHK Luxury",
    builder: "Sahjanand Group",
    badge: "High ROI",
    possession: "April 2029",
  },
  {
    id: 12,
    title: "Skyline Residences",
    city: "Ahmedabad",
    area: "Sindhubhavan Road",
    price: "24800000",
    area_sqft: "2850",
    slug: "skyline-residences",
    frontend_category: "residential",
    main_image: "/images/second.jpg",
    property_type: "4 BHK Luxury",
    builder: "Shilp Group",
    badge: "High ROI",
    possession: "Dec 2026",
  },
  {
    id: 2,
    title: "Adani Shantigram Aster",
    city: "Ahmedabad",
    area: "SG Highway",
    price: "23500000",
    area_sqft: "2850",
    slug: "shantigram-aster",
    frontend_category: "residential",
    main_image: "/images/seven.png",
    property_type: "3 & 4 BHK Luxury",
    builder: "Adani Realty",
    badge: "High ROI",
    possession: "Dec 2026",
  },
  {
    id: 5,
    title: "Shubham Anthem",
    city: "Ahmedabad",
    area: "Club O7 Road, Shela",
    price: "14400000",
    area_sqft: "2100",
    slug: "shubham-anthem",
    frontend_category: "residential",
    main_image: "/images/third.png",
    property_type: "3 & 4 BHK Luxury",
    builder: "Shubham Group",
    badge: "High ROI",
    possession: "Dec 2026",
  },
  {
    id: 6,
    title: "The Grandeur Heights",
    city: "Ahmedabad",
    area: "Science City Road, Sola",
    price: "16500000",
    area_sqft: "2400",
    slug: "the-grandeur",
    frontend_category: "residential",
    main_image: "/images/first.jpg",
    property_type: "3 & 4 BHK High-Rise",
    builder: "Grandeur Spaces",
    badge: "High ROI",
    possession: "Mid 2026",
  },
];

function ProjectCard({ project, onEnquire, onShowAmenities }) {
  const category = project.frontend_category || "residential";
  const propertyType = project.property_type || "4 BHK Ultra-Lux";
  const areaSqft = project.area_sqft
    ? `${Number(String(project.area_sqft).replace(/[^0-9]/g, "")).toLocaleString("en-IN")} Sq. Ft.`
    : "4,250 Sq. Ft.";
  const possession = project.possession || "Dec 2025";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#a98440]/50 flex flex-col justify-between h-full">
      {/* Card Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={getImageUrl(project.main_image)}
          alt={project.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-[#182230] px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
            RERA Verified
          </span>
          <span className="rounded-full bg-[#b88c3a] px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
            {project.badge || "High ROI"}
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Price */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="heading-display text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#a98440] transition-colors truncate">
              {project.title}
            </h3>
            <p className="text-[#b88c3a] font-bold text-base sm:text-lg whitespace-nowrap shrink-0">
              {displayPrice(project.price)}
            </p>
          </div>

          {/* Location */}
          <p className="mt-1 text-xs sm:text-[13px] text-slate-500 flex items-center gap-1.5 truncate">
            <svg className="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{project.area}, {project.city}</span>
          </p>

          {/* 4 Feature Items */}
          <div className="mt-5 grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-[13px] font-medium text-slate-800">
            {/* Bed / Type */}
            <div className="flex items-center gap-2 truncate">
              <svg className="h-4 w-4 text-[#b88c3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v11m0-4h18m0-7v11m-18-4h18M7 10h3a1 1 0 001-1V7a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 001 1zm7 0h3a1 1 0 001-1V7a1 1 0 00-1-1h-3a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="truncate">{propertyType}</span>
            </div>

            {/* Sq. Ft. */}
            <div className="flex items-center gap-2 truncate">
              <svg className="h-4 w-4 text-[#b88c3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16L4 4zm4 12h2m-2-3h4m-4-3h2" />
              </svg>
              <span className="truncate">{areaSqft}</span>
            </div>

            {/* Possession */}
            <div className="flex items-center gap-2 truncate">
              <svg className="h-4 w-4 text-[#b88c3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="truncate">{possession}</span>
            </div>

            {/* Amenities - Clickable with popup */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onShowAmenities) onShowAmenities(project);
              }}
              className="flex items-center gap-2 truncate text-left group/amenities cursor-pointer hover:text-[#a98440] transition-colors"
              title="Click to view all amenities"
            >
              <svg className="h-4 w-4 text-[#b88c3a] shrink-0 transition-transform group-hover/amenities:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="truncate underline decoration-dotted decoration-slate-400 underline-offset-2 group-hover/amenities:decoration-[#a98440]">
                Amenities
              </span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Brochure & Enquire Now */}
        <div className="mt-6 flex items-center gap-3">
          <Link
            href={`/property/${category}/${project.slug || project.id}`}
            className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-center text-xs sm:text-sm font-bold text-slate-800 transition hover:bg-slate-50 shadow-2xs"
          >
            Brochure
          </Link>
          <button
            type="button"
            onClick={() => onEnquire({ ...project, category })}
            className="flex-1 rounded-xl bg-[#b88c3a] hover:bg-[#a2782c] py-2.5 text-center text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomeFeaturedProjects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [enquiryProject, setEnquiryProject] = useState(null);
  const [amenitiesProject, setAmenitiesProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const totalPages = Math.ceil(projects.length / 3) || 1;

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchHomeFeaturedProperties();
        if (data && data.length >= 3) {
          setProjects(data);
        }
      } catch {
        // Keeps polished fallback inventory
      }
    }
    loadProjects();
  }, []);

  // Auto-play automation every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 4500);
    return () => clearInterval(interval);
  }, [totalPages]);

  const handleScrollUpdate = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setCurrentPage(1);
      return;
    }
    const progress = Math.min(Math.max(scrollLeft / maxScroll, 0), 1);
    const pageIndex = Math.round(progress * (totalPages - 1)) + 1;
    setCurrentPage(pageIndex);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 5) {
      setCurrentPage((prev) => {
        if (direction === "left") {
          return prev > 1 ? prev - 1 : totalPages;
        } else {
          return prev < totalPages ? prev + 1 : 1;
        }
      });
      return;
    }

    const gap = typeof window !== "undefined" && window.innerWidth >= 1024 ? 20 : 16;
    const step = clientWidth + gap;

    let targetLeft = direction === "left" ? scrollLeft - step : scrollLeft + step;

    if (direction === "right" && scrollLeft >= maxScroll - 15) {
      targetLeft = 0;
    } else if (direction === "left" && scrollLeft <= 15) {
      targetLeft = maxScroll;
    }

    const animateScroll = (element, target, duration) => {
      const start = element.scrollLeft;
      const change = target - start;
      const startTime = performance.now();
      
      const easeInOutQuad = (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
      };

      const stepAnimation = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        element.scrollLeft = easeInOutQuad(elapsedTime, start, change, duration);
        if (elapsedTime < duration) {
          requestAnimationFrame(stepAnimation);
        } else {
          element.scrollLeft = target;
        }
      };
      
      requestAnimationFrame(stepAnimation);
    };

    animateScroll(scrollRef.current, targetLeft, 700);
  };

  return (
    <section className="bg-white pt-2 pb-6 sm:pt-3 sm:pb-8">
      <div className="container-box">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a98440]">
            Elite Collection
          </span>
          <h2 className="heading-display mt-1.5 text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight tracking-tight text-slate-900">
            Featured Opportunities
          </h2>
          <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-500">
            Flagship developments chosen for strategic location dominance, developer credibility, and superior capital appreciation.
          </p>
        </div>

        {/* Carousel/Row Container */}
        <div
          ref={scrollRef}
          onScroll={handleScrollUpdate}
          className="flex gap-4 lg:gap-5 overflow-x-auto pb-3 scrollbar-hide"
        >
          {/* Mobile Animated Carousel */}
          <div className="sm:hidden relative w-full overflow-hidden px-1">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
            >
              {projects.map((project, idx) => {
                const category = project.frontend_category || "residential";
                return (
                  <div key={`mob-${category}-${project.id || idx}`} className="w-full flex-shrink-0 px-2">
                    <ProjectCard
                      project={project}
                      onEnquire={setEnquiryProject}
                      onShowAmenities={setAmenitiesProject}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Mobile Carousel Navigation Capsule */}
            <div className="mt-5 flex sm:hidden justify-center items-center">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#525252] p-1 shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-[#666]/30">
                <button
                  type="button"
                  onClick={() => setMobileIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-transform active:scale-90"
                >
                  <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="w-16 text-center text-sm font-bold tracking-widest text-white">
                  {String(mobileIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </div>
                
                <button
                  type="button"
                  onClick={() => setMobileIndex((prev) => (prev + 1) % projects.length)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-transform active:scale-90"
                >
                  <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Cards */}
          {projects.map((project, idx) => {
            const category = project.frontend_category || "residential";
            return (
              <div
                key={`desk-${category}-${project.id || idx}`}
                className="flex-none w-full sm:w-[calc(50%-10px)] hidden sm:block lg:w-[calc((100%-40px)/3)]"
              >
                <ProjectCard
                  project={project}
                  onEnquire={setEnquiryProject}
                  onShowAmenities={setAmenitiesProject}
                />
              </div>
            );
          })}
        </div>

        {/* Desktop Bottom Carousel Navigation Capsule */}
        <div className="mt-5 sm:mt-6 hidden md:flex justify-center items-center">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-[#525252] p-1 sm:p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-[#666]/30">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-all duration-200 hover:scale-110 active:scale-75 hover:bg-[#a98440] hover:text-white cursor-pointer"
              aria-label="Previous property"
            >
              <svg className="h-4 w-4 stroke-[3] currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span
              key={currentPage}
              className="inline-block animate-page-number-pop text-white font-semibold text-xs sm:text-sm tracking-wider px-2 sm:px-3 select-none"
            >
              {String(currentPage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-all duration-200 hover:scale-110 active:scale-75 hover:bg-[#a98440] hover:text-white cursor-pointer"
              aria-label="Next property"
            >
              <svg className="h-4 w-4 stroke-[3] currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom CTA Link: View All Properties */}
        <div className="mt-6 sm:mt-8 flex justify-center px-4 sm:px-0">
          <Link
            href="/residential"
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#b88c3a] hover:bg-[#a2782c] px-8 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95"
          >
            <span>View All Properties</span>
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {enquiryProject && (
        <EnquireModal
          property={enquiryProject}
          category={enquiryProject.category}
          onClose={() => setEnquiryProject(null)}
        />
      )}

      {amenitiesProject && (
        <AmenitiesModal
          project={amenitiesProject}
          onClose={() => setAmenitiesProject(null)}
          onEnquire={(proj) => {
            setAmenitiesProject(null);
            setEnquiryProject({
              ...proj,
              category: proj.frontend_category || "residential",
            });
          }}
        />
      )}
    </section>
  );
}
