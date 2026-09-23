"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STRIP_PROPERTIES = [
  {
    id: "s1",
    title: "The Palm Sanctuary",
    category: "Ultra-Luxury Villa",
    location: "Iscon Ambli Road",
    price: "₹4.85 Cr",
    image: "/images/hero-luxury.jpg",
    link: "/residential",
    tag: "Ready to Move",
  },
  {
    id: "s2",
    title: "Adani Shantigram Aster",
    category: "Golf Condos",
    location: "SG Highway",
    price: "₹2.35 Cr",
    image: "/images/seven.png",
    link: "/residential",
    tag: "RERA Verified",
  },
  {
    id: "s3",
    title: "GIFT One Corporate Hub",
    category: "Grade A Office",
    location: "GIFT City SEZ",
    price: "₹1.85 Cr",
    image: "/images/hero-gift-tower.jpg",
    link: "/gift-city",
    tag: "8.5% Net Yield",
  },
  {
    id: "s4",
    title: "Bavlu Serene Farm Villa",
    category: "Weekend Farmland",
    location: "Sanand - Nalsarovar",
    price: "₹1.45 Cr",
    image: "/images/first.jpg",
    link: "/plot-weekend-villa",
    tag: "Clear Title",
  },
  {
    id: "s5",
    title: "The Sky Penthouse",
    category: "4 BHK Sky Villa",
    location: "Sindhubhavan Road",
    price: "₹4.20 Cr",
    image: "/images/ninth.png",
    link: "/residential",
    tag: "Signature Living",
  },
  {
    id: "s6",
    title: "Cascading Water Mansion",
    category: "Designer Estate",
    location: "Bopal - Ambli Corridor",
    price: "₹6.10 Cr",
    image: "/images/hero-water-mansion.jpg",
    link: "/residential",
    tag: "Private Pool",
  },
  {
    id: "s7",
    title: "High-Growth Commercial Hub",
    category: "Retail Showrooms",
    location: "Science City Road",
    price: "₹2.90 Cr",
    image: "/images/main.jpg",
    link: "/commercial",
    tag: "High Footfall",
  },
  {
    id: "s8",
    title: "Zenith Contemporary Villa",
    category: "Bespoke Bungalow",
    location: "Bodakdev",
    price: "₹5.50 Cr",
    image: "/images/eight.png",
    link: "/residential",
    tag: "Vastu Aligned",
  },
];

export default function SlidingImageStrip() {
  const duplicatedList = [...STRIP_PROPERTIES, ...STRIP_PROPERTIES];

  // Mobile Carousel State (using CSS Transform for guaranteed smooth animation)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % STRIP_PROPERTIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const CardContent = ({ item }) => (
    <>
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-900 shadow backdrop-blur-md">
            {item.tag}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-[#a98440] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md">
            {item.price}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
            {item.category}
          </span>
          <h4 className="text-sm font-bold text-white truncate drop-shadow">
            {item.title}
          </h4>
          <p className="text-[11px] text-white/80 truncate flex items-center gap-1 mt-0.5">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg> {item.location}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/50 group-hover:bg-[#a98440]/10 transition-colors">
        <span className="text-[#a98440] group-hover:underline">View Details</span>
        <span className="text-slate-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
      </div>
    </>
  );

  return (
    <div className="relative w-full overflow-hidden bg-white pt-6 pb-3 sm:pt-7 sm:pb-3 border-b border-slate-100">
      <div className="container-box mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a98440] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#a98440]"></span>
          </span>
          <h3 className="heading-display text-base sm:text-lg font-bold text-slate-900">
            Live Property Stream &bull; Sliding Left to Right
          </h3>
          <span className="hidden sm:inline-block rounded-full bg-[#fbf7ee] border border-[#e2d1b3] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a98440]">
            Curated Ahmedabad Inventory
          </span>
        </div>
      </div>

      {/* Desktop Continuous Marquee */}
      <div className="hidden sm:block relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-white via-white/80 to-transparent" />

        <div className="animate-slide-ltr flex gap-5 py-2">
          {duplicatedList.map((item, idx) => (
            <Link
              key={`desk-${item.id}-${idx}`}
              href={item.link}
              className="group relative flex-shrink-0 w-[320px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#a98440]/40"
            >
              <CardContent item={item} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile CSS Transform Carousel for guaranteed slide animation */}
      <div className="sm:hidden relative w-full overflow-hidden px-4">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {STRIP_PROPERTIES.map((item, idx) => (
            <div key={`mob-${item.id}-${idx}`} className="w-full flex-shrink-0 px-1">
              <Link
                href={item.link}
                className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300"
              >
                <CardContent item={item} />
              </Link>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators (Dots) */}
        <div className="flex justify-center gap-1.5 mt-3">
          {STRIP_PROPERTIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-4 bg-[#a98440]" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
