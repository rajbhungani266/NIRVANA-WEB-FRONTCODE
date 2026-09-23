"use client";

import Link from "next/link";

const CATEGORIES = [
  {
    title: "High-Yield Investment",
    badge: "12% - 16% Potential ROI",
    desc: "Curated pre-leased commercial assets, retail spaces, and early-stage residential growth corridors with strong rental yields.",
    href: "/investment",
    linkText: "Explore Investments",
    icon: (
      <svg className="h-8 w-8 text-[#a98440]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    bgGradient: "from-[#fbf7ee] to-white",
    borderColor: "border-[#e2d1b3]/60",
  },
  {
    title: "Weekend Homes & Villas",
    badge: "Peaceful Living",
    desc: "Exclusive second-home sanctuaries, golf villas, and scenic farmland retreats near Sanand, Thol, and Kensville for tranquil escapes.",
    href: "/plot-weekend-villa",
    linkText: "Explore Villas",
    icon: (
      <svg className="h-8 w-8 text-[#a98440]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    bgGradient: "from-amber-50/40 to-white",
    borderColor: "border-amber-100",
  },
  {
    title: "Commercial & Tech Hubs",
    badge: "Corporate Grade A",
    desc: "Premium corporate offices, flagship retail showrooms, and SEZ spaces in GIFT City and Sindhubhavan Road with modern infrastructure.",
    href: "/commercial",
    linkText: "Explore Commercial",
    icon: (
      <svg className="h-8 w-8 text-[#a98440]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    bgGradient: "from-slate-50 to-white",
    borderColor: "border-slate-200",
  },
];

export default function HomeSections() {
  return (
    <section className="bg-white pt-8 pb-6 sm:pt-10 sm:pb-8">
      <div className="container-box">
        {/* Discover Properties Stats & Showcase Section (Matches Figma Image 1) */}
        <div className="mb-20">
          {/* Top Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8 lg:gap-14 items-start mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 leading-[1.18] tracking-tight">
                Discover Properties<br />That Match Your Goals
              </h2>
            </div>
            
            <div>
              <p className="text-sm sm:text-[14.5px] leading-relaxed text-slate-500 font-normal">
                Whether you are buying your first property, searching for investment opportunities, or exploring future growth locations, discover curated options designed to help you move faster and choose with confidence.
              </p>
              
              {/* Stats */}
              <div className="mt-8 flex flex-wrap items-start gap-8 sm:gap-12 lg:gap-16">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">500+</h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-1 font-normal">Verified Opportunities</p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">50K+</h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-1 font-normal">Searches Every Month</p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">10+ Years</h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-1 font-normal">Market Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Showcase Items: Wide Image | Middle Card | Right Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Wide Interior Image */}
            <div className="lg:col-span-6 h-[336px] xl:h-[352px] 2xl:h-[370px] rounded-[24px] overflow-hidden bg-slate-100 shadow-xs relative">
              <img
                src="/images/discover-interior-left.jpg"
                alt="Modern Living Room Interior"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right Side: Middle Card + Right Card + Bottom Subtitle */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Middle Feature Card */}
                <div className="h-[280px] xl:h-[295px] 2xl:h-[310px] bg-[#f5f5f5] border border-slate-200/70 rounded-[20px] p-5 sm:p-6 flex flex-col justify-between items-center text-center shadow-2xs">
                  <div className="pt-2 flex flex-col items-center">
                    <h3 className="text-[17px] font-semibold text-slate-900 leading-snug">
                      Discover Properties<br />That Match Your Goals
                    </h3>
                    <p className="mt-2.5 text-[11.5px] leading-relaxed text-slate-500 max-w-[200px]">
                      Explore curated opportunities across residential, investment, and future growth locations designed for confident decision-making.
                    </p>
                  </div>

                  <Link
                    href="/residential"
                    className="mb-1 rounded-full bg-white text-slate-900 text-xs font-medium px-5 py-2 shadow-xs border border-slate-200/80 hover:bg-slate-50 transition active:scale-95"
                  >
                    Explore Projects
                  </Link>
                </div>

                {/* Right Feature Card with Image */}
                <div className="h-[280px] xl:h-[295px] 2xl:h-[310px] bg-[#f5f5f5] border border-slate-200/70 rounded-[20px] overflow-hidden flex flex-col justify-between shadow-2xs">
                  <div className="h-[155px] xl:h-[168px] 2xl:h-[178px] w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src="/images/discover-interior-right.jpg"
                      alt="Luxury Living Space"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex flex-col items-center justify-between flex-1 text-center">
                    <h4 className="text-[16px] font-semibold text-slate-900">
                      Pricing Start at $256K
                    </h4>

                    <Link
                      href="/residential"
                      className="mb-1 rounded-full bg-black text-white text-xs font-medium py-2 px-6 hover:bg-slate-800 transition active:scale-95 shadow-sm text-center"
                    >
                      Explore Properties
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Footnote under Middle & Right cards */}
              <p className="mt-4 text-[13px] text-slate-600 font-normal leading-relaxed max-w-[430px]">
                Whether it&apos;s creating a cozy corner for relaxation or
                <br className="hidden sm:inline" /> transforming a small area into a workspace
              </p>
            </div>
          </div>
        </div>

        {/* Tailored Discovery Section */}
        <div className="mb-14 grid gap-8 xl:grid-cols-[1.5fr_1fr] items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a98440]">
              Tailored Discovery
            </span>
            <h2 className="heading-display mt-3 text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-[3.2rem]">
              Choose What You&apos;re
              <br />
              Looking For
            </h2>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
              Browse hand-picked categories tailored to distinct lifestyles, high-return investment goals, and family living across Ahmedabad&apos;s fastest-growing sectors.
            </p>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className={`group flex flex-col justify-between rounded-[24px] border ${cat.borderColor} bg-gradient-to-b ${cat.bgGradient} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#a98440]/40`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-100">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="heading-display mt-5 text-lg font-bold text-slate-900 group-hover:text-[#a98440] transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100/80">
                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-[#a98440] group-hover:gap-3 transition-all"
                >
                  <span>{cat.linkText}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
