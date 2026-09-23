"use client";

import Link from "next/link";

const PROPERTY_TYPES = [
  {
    title: "Apartment",
    subtitle: "8,400+ Properties",
    img: "/images/type-apartment.jpg",
    bg: "bg-[#fef5e7]",
    href: "/residential",
  },
  {
    title: "Independent House / Villa",
    subtitle: "1,800+ Properties",
    img: "/images/type-villa.jpg",
    bg: "bg-[#edf5fd]",
    href: "/residential?property_type=villa",
  },
  {
    title: "Residential Land",
    subtitle: "1,100+ Properties",
    img: "/images/type-land.jpg",
    bg: "bg-[#eaf5ed]",
    href: "/plot-weekend-villa",
  },
  {
    title: "Commercial Space",
    subtitle: "2,400+ Properties",
    img: "/images/type-commercial.jpg",
    bg: "bg-[#e5f5ea]",
    href: "/commercial",
  },
  {
    title: "Penthouses & Estates",
    subtitle: "650+ Properties",
    img: "/images/type-community.jpg",
    bg: "bg-[#fef5e7]",
    href: "/plot-weekend-villa",
  },
];

export default function BrowsePropertyTypes() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 text-slate-950">
      <div className="container-box">
        {/* Section Heading */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a98440]">
              Diverse Portfolio
            </span>
            <h2 className="heading-display mt-3 text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[3.2rem]">
              Browse Property Types
              <br />
              in Ahmedabad
            </h2>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Discover a wide spectrum of lifestyle, commercial, and investment-focused real estate assets. Filter by configuration, locality, and budget parameters to find your exact match.
            </p>
          </div>
        </div>

        {/* 5-Column Responsive Cards Grid (Matching Reference Image 2) */}
        <div className="mt-12 sm:mt-14 grid gap-5 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {PROPERTY_TYPES.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className={`group flex flex-col justify-between overflow-hidden rounded-[22px] border border-slate-200/70 ${card.bg} shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300`}
            >
              {/* Top Text Content: Title & Subtitle without pill badges */}
              <div className="p-5 sm:p-6 pb-4">
                <h3 className="heading-display text-lg sm:text-xl font-bold text-slate-800 leading-tight group-hover:text-[#a98440] transition-colors whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-400">
                  {card.subtitle}
                </p>
              </div>

              {/* Bottom Bleed Image: Flush against left, right, and bottom edges */}
              <div className="relative mt-auto h-40 sm:h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
