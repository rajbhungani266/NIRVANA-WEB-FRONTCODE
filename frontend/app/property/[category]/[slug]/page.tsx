import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadForm from "@/components/property/LeadForm";
import PropertyGallery from "@/components/property/PropertyGallery";
import EMICalculator from "@/components/property/EMICalculator";
import { fetchPropertyDetail } from "@/lib/api";
import { formatPrice, getTypeLabel, getWhatsAppUrl } from "@/lib/format";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const property = await fetchPropertyDetail(category, slug);

  if (!property) {
    notFound();
  }

  const amenities = [
    { icon: "🏊‍♂️", label: "Infinity Pool", desc: "Temperature controlled" },
    { icon: "🏋️‍♂️", label: "Modern Gymnasium", desc: "Cardio & strength zone" },
    { icon: "🌿", label: "Landscaped Gardens", desc: "Zen & reflexology paths" },
    { icon: "⚡", label: "EV Charging Station", desc: "Dedicated parking slots" },
    { icon: "🛡️", label: "3-Tier Security", desc: "24/7 CCTV & biometric" },
    { icon: "🧒", label: "Children Play Park", desc: "Soft-cushion rubberized" },
    { icon: "🏛️", label: "Luxury Clubhouse", desc: "Banquet & squash court" },
    { icon: "🔋", label: "100% Power Backup", desc: "Common areas & elevators" },
  ];

  const connectivity = [
    { name: "SG Highway (Sarkhej-Gandhinagar)", distance: "5 mins" },
    { name: "Sardar Patel Ring Road", distance: "8 mins" },
    { name: "Top International Schools (DPS / Zydus)", distance: "12 mins" },
    { name: "KD Hospital & Zydus Hospital", distance: "15 mins" },
    { name: "Sardar Vallabhbhai Patel Airport", distance: "30 mins" },
    { name: "GIFT City IFSC Financial District", distance: "35 mins" },
  ];

  return (
    <main className="bg-[#f8fafc]">
      <Navbar />

      {/* Hero Header Banner */}
      <section className="bg-slate-900 pb-12 pt-24 md:pt-28 text-white">
        <div className="container-box">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 mb-3">
            <span>Home</span>
            <span>/</span>
            <span className="capitalize">{category.replace("-", " ")}</span>
            <span>/</span>
            <span className="text-[#e6c278] font-semibold">{property.title}</span>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                  RERA Verified Project
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  {getTypeLabel(property)}
                </span>
              </div>

              <h1 className="heading-display mt-3 text-3xl font-extrabold md:text-5xl text-white">
                {property.title}
              </h1>
              <p className="mt-2 text-sm text-white/70 flex items-center gap-1.5">
                <span>📍</span>
                <span>{property.address || `${property.area}, ${property.city}`}</span>
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs uppercase tracking-wider text-white/60">
                Starting Investment
              </span>
              <p className="heading-display text-3xl font-black text-[#e6c278] md:text-4xl">
                {formatPrice(property.price)}
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                {property.price_per_sqft ? `₹ ${property.price_per_sqft} / sq.ft.` : "All-inclusive pricing guidance"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container-box grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {/* 1. Photo Gallery */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <PropertyGallery
              mainImage={property.main_image || property.thumbnail}
              images={property.images}
              title={property.title}
            />
          </div>

          {/* 2. Key Project Specifications Grid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="heading-display text-xl font-bold text-slate-900 mb-6">
              Property Specifications & Highlights
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Configuration</span>
                <p className="text-base font-bold text-slate-900 mt-1">{getTypeLabel(property)}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Super Builtup Area</span>
                <p className="text-base font-bold text-slate-900 mt-1">{property.area_sqft || "3,250"} Sq.Ft</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Possession Status</span>
                <p className="text-base font-bold text-slate-900 mt-1">Ready to Move</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Vastu Orientation</span>
                <p className="text-base font-bold text-emerald-600 mt-1">100% East Facing</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Detailed Project Overview</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                {property.description ||
                  "Thoughtfully conceived with premium luxury finishes, sprawling balconies overlooking scenic greenery, double-height grand lobby, and high-efficiency smart home provisions designed for refined comfort."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl(property)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <span>💬 Connect on WhatsApp</span>
              </a>
              <a
                href="#lead-form"
                className="btn-secondary"
              >
                <span>📅 Schedule Private Site Visit</span>
              </a>
            </div>
          </div>

          {/* 3. Luxury Amenities Grid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="heading-display text-xl font-bold text-slate-900 mb-6">
              Exclusive Amenities & Facilities
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-white hover:shadow-md"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{item.label}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Interactive EMI Calculator */}
          <EMICalculator initialPrice={property.price} />

          {/* 5. Location & Neighborhood Connectivity */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="heading-display text-xl font-bold text-slate-900 mb-4">
              Location & Strategic Connectivity
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Situated in high-growth prime corridors with immediate transit access across Ahmedabad.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {connectivity.map((conn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs"
                >
                  <span className="font-semibold text-slate-700">{conn.name}</span>
                  <span className="font-bold text-[#a98440] shrink-0 ml-2">{conn.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar Lead Form */}
        <aside id="lead-form" className="lg:sticky lg:top-20 lg:h-fit">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-[#a98440] to-[#b8934d] p-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                Direct Developer Coordination
              </span>
              <h4 className="heading-display text-base font-bold text-white">
                Book a VIP Site Walkthrough
              </h4>
              <p className="text-[11px] leading-tight text-white/90">
                Get confirmed pricing matrix, floor plans, and RERA approval dossiers.
              </p>
            </div>
            <div className="p-3">
              <LeadForm
                propertyCategory={category.replace("-", "_")}
                propertyId={property.id}
              />
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}