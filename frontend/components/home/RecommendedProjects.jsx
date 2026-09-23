"use client";

import Link from "next/link";

const RECOMMENDED = [
  {
    name: "Shubham Anthem",
    type: "3,4 BHK Apartment, Shela",
    price: "₹ 1.14 - 1.44 Cr",
    img: "/images/seven.png",
    slug: "residential/shubham-anthem",
    builderLogo: {
      top: "SHUBHAM",
      bottom: "ANTHEM",
      topColor: "text-slate-800",
      bottomColor: "text-[#b88c3a]",
    },
  },
  {
    name: "Shruti Apartment",
    type: "3 BHK Apartment, Memnagar",
    price: "₹ 1.14 - 1.44 Cr",
    img: "/images/first.jpg",
    slug: "residential/shruti-apartment",
    builderLogo: {
      top: "SHRUTI",
      bottom: "RESIDENCY",
      topColor: "text-[#b88c3a]",
      bottomColor: "text-slate-700",
    },
  },
  {
    name: "Shubham Anthem",
    type: "3,4 BHK Apartment, Shela",
    price: "₹ 1.14 - 1.44 Cr",
    img: "/images/seven.png",
    slug: "residential/shubham-anthem",
    builderLogo: {
      top: "SHUBHAM",
      bottom: "ANTHEM",
      topColor: "text-slate-800",
      bottomColor: "text-[#b88c3a]",
    },
  },
  {
    name: "Shubham Anthem",
    type: "3,4 BHK Apartment, Shela",
    price: "₹ 1.14 - 1.44 Cr",
    img: "/images/seven.png",
    slug: "residential/shubham-anthem",
    builderLogo: {
      top: "SHUBHAM",
      bottom: "ANTHEM",
      topColor: "text-slate-800",
      bottomColor: "text-[#b88c3a]",
    },
  },
];

export default function RecommendedProjects() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-box">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight">
            Recommended Projects
          </h2>
          <p className="max-w-2xl text-[14px] leading-relaxed text-slate-500">
            Explore some of the most searched and carefully selected projects across Ahmedabad. Compare locations, property types, pricing insights, and project highlights to discover opportunities that align with your goals.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RECOMMENDED.map((project, idx) => {
            const propertyHref = project.slug.startsWith("property/")
              ? `/${project.slug}`
              : project.slug.startsWith("/property/")
              ? project.slug
              : `/property/${project.slug.startsWith("/") ? project.slug.slice(1) : project.slug}`;

            return (
              <Link href={propertyHref} key={idx} className="block group">
                <div className="w-full relative transition-transform duration-300 group-hover:-translate-y-1">
                {/* Top Image */}
                <div className="h-[210px] w-full overflow-hidden">
                  <img
                    src={project.img}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Overlapping Card */}
                <div className="relative -mt-16 mx-4 sm:mx-3 xl:mx-4 mb-2 rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.07)] border border-slate-100 p-5 pt-8 text-left transition-shadow duration-300 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
                  {/* Left-Aligned Circle Logo */}
                  <div className="absolute -top-7 left-5 sm:left-6 h-14 w-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden">
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className={`text-[7.5px] font-extrabold tracking-wider uppercase leading-none ${project.builderLogo.topColor}`}>
                        {project.builderLogo.top}
                      </span>
                      <span className={`text-[6px] font-bold tracking-wider uppercase mt-0.5 leading-none ${project.builderLogo.bottomColor}`}>
                        {project.builderLogo.bottom}
                      </span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
                    {project.name}
                  </h3>

                  {/* Subtitle (Type, Location) */}
                  <p className="mt-1 text-[13px] text-slate-400 font-normal">
                    {project.type}
                  </p>
                  
                  {/* Price */}
                  <div className="mt-5 text-[15px] font-bold text-[#b88c3a] tracking-tight">
                    {project.price}
                  </div>
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/residential"
            className="rounded-lg bg-[#b88c3a] hover:bg-[#a2782c] px-8 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95"
          >
            View All Properties
          </Link>
        </div>

      </div>
    </section>
  );
}
