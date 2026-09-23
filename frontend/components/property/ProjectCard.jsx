"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice, getImageUrl, getTypeLabel } from "@/lib/format";
import EnquireModal from "./EnquireModal";

/*
  Project card matching screenshot 2:
  - Left: Image + RERA / Featured badge + Wishlist heart + bottom thumbnail row with 4+
  - Middle: Title + Subtitle + Location + Price + Per sqft + Investment Score (if featured) +
            ROI / Rental yield / Possession stats + Zero Brokerage/RERA/Exclusive badges + Connectivity line
  - Right: Builder details + Rating + Delivered count + Book Free Site Visit CTA + View Details outline button
*/
export default function ProjectCard({ property, category }) {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const thumbnails = useMemo(() => {
    return property.thumbnails && property.thumbnails.length > 0
      ? property.thumbnails
      : [
          property.main_image || "/images/first.jpg",
          "/images/second.jpg",
          "/images/seven.png",
          "/images/ninth.png",
        ];
  }, [property.thumbnails, property.main_image]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevImage, setPrevImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sync state during render if property changes (avoids cascading render effect)
  const [prevPropertyId, setPrevPropertyId] = useState(property.id);
  if (property.id !== prevPropertyId) {
    setPrevPropertyId(property.id);
    setCurrentIndex(0);
    setPrevImage(null);
    setIsTransitioning(false);
  }

  // Automatic image change animation interval (cycles smoothly through thumbnails)
  useEffect(() => {
    if (thumbnails.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % Math.min(thumbnails.length, 4);
        setPrevImage(thumbnails[prev]);
        setIsTransitioning(true);
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [thumbnails, isPaused]);

  function handleSelectImage(idx) {
    if (idx === currentIndex) return;
    setPrevImage(thumbnails[currentIndex]);
    setCurrentIndex(idx);
    setIsTransitioning(true);
  }

  const activeImage = thumbnails[currentIndex] || property.main_image || "/images/first.jpg";

  const connectivity = property.connectivity || [
    { label: "Airport", dist: "17.5 km" },
    { label: "Mall/Market", dist: "2 km" },
    { label: "School", dist: "2.10 to 4.6 km" },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr_210px] xl:grid-cols-[300px_1fr_225px]">
        {/* 1. Left: Main Image + Badges + Thumbnails */}
        <div
          className="relative h-64 md:h-auto min-h-[220px] overflow-hidden bg-slate-900"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background previous image for seamless crossfade */}
          {prevImage && isTransitioning && (
            <img
              src={getImageUrl(prevImage)}
              alt="Previous view"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Active new image with smooth cinematic crossfade & scale */}
          <img
            key={activeImage}
            src={getImageUrl(activeImage)}
            alt={property.title}
            onAnimationEnd={() => setIsTransitioning(false)}
            className={`relative h-full w-full object-cover ${
              isTransitioning ? "animate-image-swap" : "transition-transform duration-500 hover:scale-105"
            }`}
          />

          {/* Top-Left Badge: Featured or RERA Verified */}
          {property.is_featured ? (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-[#d97706] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm z-10">
              <span>★</span> FEATURED
            </span>
          ) : (
            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs border border-slate-200/60 z-10">
              RERA Verified
            </span>
          )}

          {/* Top-Right Wishlist Heart */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm text-slate-700 hover:text-red-500 transition cursor-pointer"
            aria-label="Save Property"
          >
            <svg
              className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "fill-none"}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Bottom Clickable Thumbnail Strip with active pulse sync */}
          <div className="absolute inset-x-2 bottom-2 z-10 flex items-center gap-1.5 rounded-lg bg-black/45 p-1 backdrop-blur-xs">
            {thumbnails.slice(0, 4).map((thumb, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectImage(idx);
                  }}
                  className={`relative h-8 flex-1 overflow-hidden rounded transition-all duration-300 active:scale-95 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-white scale-105 opacity-100 shadow-md"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={getImageUrl(thumb)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {idx === 3 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-bold text-white transition-opacity hover:bg-black/40">
                      4+
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Middle: Project Info, Pricing, Metrics, Badges */}
        <div className="flex flex-col p-4 sm:p-5 border-b md:border-b-0 md:border-r border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                href={`/property/${category}/${property.slug}`}
                className="text-lg sm:text-xl font-bold text-slate-900 hover:text-[#a98440] transition"
              >
                {property.title || "Project name"}
              </Link>
              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {getTypeLabel(property)}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <span>📍</span>
                <span>{property.address || `${property.area}, ${property.city}`}</span>
              </p>
            </div>

            {/* Price block */}
            <div className="text-right shrink-0">
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {formatPrice(property.price)}
                {property.is_featured && <span className="text-[#a98440] text-sm">*</span>}
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                ₹ {property.price_per_sqft || "6,950"} / sq.ft.
              </p>
            </div>
          </div>

          {/* Investment Score Badge if present (Matches Image 2 Skyline card) */}
          {property.investment_score && (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200/80 p-2.5 text-xs text-emerald-950">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Investment Score
              </span>
              <span className="text-sm font-extrabold text-emerald-700">
                {property.investment_score}{" "}
                <span className="text-[10px] font-normal text-emerald-600">/10</span>
              </span>
              <span className="ml-auto rounded bg-emerald-600/15 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                {property.appreciation || "High Appreciation"}
              </span>
            </div>
          )}

          {/* 3 Key Stats: ROI, Rental Yield, Possession */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 border border-slate-100 p-2.5 text-xs">
            <div>
              <p className="font-extrabold text-emerald-600 text-[13px]">
                {property.roi_potential || "14%"}*
              </p>
              <p className="text-[10px] text-slate-500 font-medium">ROI Potential</p>
            </div>
            <div>
              <p className="font-extrabold text-emerald-600 text-[13px]">
                {property.rental_yield || "5.6%"}*
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Rental Yield</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-[12px] truncate">
                {property.possession || "April 2029"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Possession</p>
            </div>
          </div>

          {/* Badges Row */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
              <span>🏷️</span> Zero Brokerage
            </span>
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
              <span>🛡️</span> RERA Verified
            </span>
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
              <span>✨</span> Exclusive Residential
            </span>
          </div>

          {/* Connectivity snippet matching Image 2 */}
          <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
            {connectivity.map((c, i) => (
              <span key={i}>
                <span className="font-medium text-slate-700">{c.label}</span> within{" "}
                <strong className="text-slate-900 font-bold">{c.dist}</strong>
              </span>
            ))}
            <Link
              href={`/property/${category}/${property.slug}`}
              className="text-[#0078d7] font-semibold hover:underline cursor-pointer ml-auto"
            >
              Show More
            </Link>
          </div>
        </div>

        {/* 3. Right: Builder Information & CTAs */}
        <div className="flex flex-col justify-between p-4 sm:p-5 bg-slate-50/40">
          <div>
            <p className="text-xs text-slate-400 font-medium">Builder</p>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {property.builder || "Sahjanand Group"}
            </h4>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 font-bold">
              <span>★</span>
              <span>{property.builder_rating || "4.7"}</span>
              <span className="text-slate-400 font-normal">
                ({property.reviews_count || 128} Reviews)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Delivered {property.delivered_projects || 14} Projects
            </p>
          </div>

          {/* Action Buttons matching Image 2 */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => setShowEnquiry(true)}
              className="w-full rounded-xl bg-[#b18537] hover:bg-[#977232] py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer text-center"
            >
              Book Site Visit
            </button>

            <Link
              href={`/property/${category}/${property.slug}`}
              className="block w-full rounded-xl border border-slate-700 hover:bg-slate-50 py-2.5 text-xs sm:text-sm font-bold text-slate-800 transition text-center active:scale-95 shadow-2xs"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {showEnquiry && (
        <EnquireModal
          property={property}
          category={category}
          onClose={() => setShowEnquiry(false)}
        />
      )}
    </article>
  );
}
