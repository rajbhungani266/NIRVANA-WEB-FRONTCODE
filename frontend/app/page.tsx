import Navbar from "@/components/layout/Navbar";
import HeroSearch from "@/components/home/HeroSearch";
import SlidingImageStrip from "@/components/home/SlidingImageStrip";
import HomeFeaturedProjects from "@/components/home/HomeFeaturedProjects";
import RecommendedProjects from "@/components/home/RecommendedProjects";
import HomeSections from "@/components/home/HomeSections";
import Footer from "@/components/layout/Footer";
import BrowsePropertyTypes from "@/components/home/BrowsePropertyTypes";
import LandingFeatureSections from "@/components/home/LandingFeatureSections";
import RequestPropertyAssistance from "@/components/home/RequestPropertyAssistance";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSearch />

      {/* Live Continuous Property Stream - Sliding Left to Right */}
      <SlidingImageStrip />

      {/* Featured opportunities - Luxury developments */}
      <HomeFeaturedProjects />

      {/* Tailored Discovery - 3 Category Cards */}
      <HomeSections />

      {/* Recommended projects (from Figma) */}
      <RecommendedProjects />

      {/* High Impact Conversion CTA Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/tenth.png')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="container-box relative z-10">
          <p className="text-sm font-medium text-slate-300">
            Looking to Buy or Sell Property?
          </p>

          <h2 className="heading-display mx-auto mt-4 max-w-4xl text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl">
            Whether you&apos;re searching for the right opportunity or planning to list your property, our team can help you move with confidence.
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/post-property"
              className="inline-flex items-center gap-2 rounded-xl bg-[#a98440] hover:bg-[#977232] px-6 py-3 text-sm font-bold text-white shadow-lg transition active:scale-95"
            >
              Submit Property
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-10 10M17 7H8M17 7v9" />
              </svg>
            </Link>

            <Link
              href="/residential"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:bg-slate-100 active:scale-95"
            >
              Browse Properties
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-10 10M17 7H8M17 7v9" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse Property Types */}
      <BrowsePropertyTypes />

      {/* Feature & Social Proof Sections */}
      <LandingFeatureSections />

      {/* Request Property Assistance & Sell Property */}
      <RequestPropertyAssistance />

      <Footer />
    </main>
  );
}