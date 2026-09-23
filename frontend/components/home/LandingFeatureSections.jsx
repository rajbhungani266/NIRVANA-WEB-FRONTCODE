const TESTIMONIALS = [
  {
    title: "Seamless High-Yield Investment",
    text: "Found a pre-leased Grade-A corporate office in GIFT City with 8.5% net rental yield in under 3 weeks. Nirvana's documentation verification and title clearance were exemplary.",
    author: "Rajesh Shah",
    role: "Commercial Investor, Mumbai",
    initials: "RS",
    rating: 5,
  },
  {
    title: "Found Our Dream Vastu Home",
    text: "We spent months touring Shela and Bopal. Nirvana's team filtered out unverified projects and guided us straight to a 100% Vastu-aligned 3 BHK with optimal sunlight and zero brokerage.",
    author: "Meera & Kunal Desai",
    role: "Homebuyers, Shela",
    initials: "MD",
    rating: 5,
  },
  {
    title: "Exceptional NRI Advisory",
    text: "Operating from Dubai, I needed complete transparency, legal verification, and detailed video walk-throughs for my weekend villa investment near Thol. They handled everything flawlessly.",
    author: "Vikram Singhania",
    role: "NRI Investor, UAE",
    initials: "VS",
    rating: 5,
  },
];

export default function LandingFeatureSections() {
  return (
    <section className="bg-[#f8fafc] text-slate-950">
      {/* 1. Explore Spaces Bento */}
      <div className="container-box py-20 sm:py-24">
        <div className="grid gap-10 md:gap-14 lg:grid-cols-2 items-start max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-10 lg:gap-14">
            <div className="max-w-lg lg:pt-4">
              <h2 className="heading-display text-3xl md:text-[38px] font-semibold text-slate-900 leading-[1.2] tracking-tight">
                Explore Spaces Designed<br />for Better Living
              </h2>
              <p className="mt-5 text-[13px] md:text-[14px] leading-relaxed text-slate-500">
                Discover thoughtfully selected homes, premium communities, and future-ready developments that combine lifestyle, convenience, and long-term value for modern buyers and investors.
              </p>
            </div>
            
            <div className="w-full rounded-[20px] overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
              <img
                src="/images/fourth.png"
                alt="Modern interior detail"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 md:gap-8 w-full">
            <div className="rounded-[20px] overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
              <img
                src="/images/main.jpg"
                alt="Living room architecture"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            <div className="rounded-[20px] overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
              <img
                src="/images/fifth.png"
                alt="Contemporary living"
                className="w-full aspect-[16/9] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Why Buyers Choose Nirvana Space */}
      <div className="container-box py-20 border-t border-slate-200/80">
        <div className="grid gap-12 xl:grid-cols-[0.95fr_1.05fr] items-start">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a98440]">
              The Nirvana Advantage
            </span>
            <h2 className="heading-display mt-4 text-3xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Why Buyers & Investors
              <br />
              Trust Nirvana Space
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              We eliminate ambiguity in real estate through rigorous due diligence, developer track-record vetting, transparent pricing matrices, and dedicated client advocates from inspection to registry.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { img: "/images/six.png", title: "Smart Architecture", tag: "Design" },
              { img: "/images/seven.png", title: "Prime Corridors", tag: "Location" },
              { img: "/images/eight.png", title: "Verified Clear Title", tag: "Trust" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-md"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e2b764]">
                    {item.tag}
                  </span>
                  <p className="text-sm font-bold text-white drop-shadow">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Social Proof & Testimonials */}
      <div className="container-box pb-24">
        <div className="pt-8 md:pt-12">
          <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr] items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a98440]">
                Proven Client Satisfaction
              </span>
              <h2 className="heading-display mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Trusted by 1,200+
                <br />
                Property Owners & Buyers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Independent guidance, curated projects, and an effortless advisory experience across Ahmedabad.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-6 text-center">
                <p className="heading-display text-3xl font-extrabold text-[#a98440]">₹450 Cr+</p>
                <p className="mt-2 text-xs font-medium text-slate-600">Property Value Advised</p>
              </div>
              <div className="p-6 text-center">
                <p className="heading-display text-3xl font-extrabold text-[#a98440]">99.2%</p>
                <p className="mt-2 text-xs font-medium text-slate-600">Client Satisfaction Rate</p>
              </div>
              <div className="p-6 text-center">
                <p className="heading-display text-3xl font-extrabold text-[#a98440]">240+</p>
                <p className="mt-2 text-xs font-medium text-slate-600">Verified Project Catalogs</p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-4"
              >
                <div>
                  <div className="flex text-amber-400 text-sm mb-3">
                    {"★".repeat(item.rating)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    &ldquo;{item.title}&rdquo;
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.text}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#a98440] to-[#e2b764] font-bold text-white text-xs shadow-md">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.author}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
