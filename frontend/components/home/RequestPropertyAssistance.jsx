"use client";

import { useState } from "react";

export default function RequestPropertyAssistance() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "Apartment",
    budget: "₹ 1 Cr - ₹ 2 Cr",
    location: "Shela / Ambli Road",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Quick callback state
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleCallback = (e) => {
    e.preventDefault();
    if (!callbackPhone) return;
    setCallbackDone(true);
    setTimeout(() => {
      setCallbackPhone("");
    }, 4000);
  };

  return (
    <>
      {/* 1. Sell Property With Confidence Banner */}
      
      {/* 1. Sell / Monetize Banner */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-box">
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-slate-900 w-full min-h-[340px] sm:min-h-[400px] flex items-center shadow-xl group">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/images/type-villa.jpg"
                alt="Luxury Property"
                className="h-full w-full object-cover object-center transition duration-1000 group-hover:scale-105"
              />
            </div>
            
            {/* Gradient Overlay matching Figma: Dark fade from left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f141f] via-[#0f141f]/90 to-transparent w-[95%] sm:w-[75%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f141f]/70 to-transparent sm:hidden" />
            
            {/* Content Container */}
            <div className="relative z-10 w-full max-w-2xl px-6 py-12 sm:px-12 md:px-16 lg:py-16">
              <h2 className="heading-display text-3xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-4xl lg:text-[42px]">
                Sell Your Property With Confidence
              </h2>
              <p className="mt-3 sm:mt-5 max-w-lg text-[13px] sm:text-[15px] leading-relaxed text-slate-300 font-medium">
                Get expert support, market-backed pricing guidance, and qualified buyer interest for your property.
              </p>

              <div className="mt-8 sm:mt-10">
                <button
                  type="button"
                  className="rounded-lg border border-white bg-transparent px-8 py-3 text-[13px] sm:text-sm font-semibold tracking-wide text-white transition hover:bg-white hover:text-slate-900 active:scale-95 cursor-pointer"
                >
                  Request a Callback
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Structured Lead Assistance Form */}
      <section className="bg-white py-8 md:py-10">
        <div className="container-box">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] xl:grid-cols-[1.1fr_1.2fr] items-stretch max-w-4xl xl:max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl group">
              <img
                src="/images/first.jpg"
                alt="Personalized Property Shortlist"
                className="h-full min-h-[280px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-lg flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a98440]">
                Bespoke Advisory
              </span>
              <h3 className="heading-display mt-1.5 text-xl font-extrabold tracking-[-0.02em] text-slate-950 sm:text-2xl">
                Request Property Assistance
              </h3>
              <p className="mt-1.5 text-xs text-slate-600">
                Share your target parameters. Our Ahmedabad realty desk will filter verified on-market & off-market listings for you.
              </p>

              {isSubmitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600 mb-3">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Request Confirmed!</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Thank you, {formData.name}. We have matched 12 verified projects in {formData.location}. An advisor will share the shortlist via WhatsApp at {formData.phone}.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-5 text-xs font-bold text-[#a98440] underline"
                  >
                    Submit another requirement
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 grid gap-2.5">
                  <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-800">
                    Your Name
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="your name"
                      className="input-clean border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
                    />
                  </label>
                  
                  <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-800">
                    Mobile Number
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Mobile number"
                      className="input-clean border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-800">
                    Email Address
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      className="input-clean border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
                    />
                  </label>

                  <div className="grid gap-2.5 grid-cols-2">
                    <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-800">
                      Max Price
                      <input
                        type="text"
                        placeholder="$90,000"
                        className="input-clean border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-800">
                      Min Size
                      <input
                        type="text"
                        placeholder="2,000 sq ft"
                        className="input-clean border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 w-full rounded-lg bg-[#a98440] hover:bg-[#977232] px-6 py-2 text-[12px] font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
