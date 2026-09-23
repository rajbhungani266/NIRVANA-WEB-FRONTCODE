"use client";

import { useState } from "react";

export default function VastuCalculatorModal({ isOpen, onClose }) {
  const [entrance, setEntrance] = useState("north-east");
  const [kitchen, setKitchen] = useState("south-east");
  const [bedroom, setBedroom] = useState("south-west");
  const [pooja, setPooja] = useState("north-east");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Calculate a realistic Vastu Score based on traditional Vedic guidelines
  const calculateScore = () => {
    let score = 50;
    // Entrance
    if (entrance === "north-east" || entrance === "north" || entrance === "east") score += 15;
    else if (entrance === "west" || entrance === "north-west") score += 8;
    else score += 2;

    // Kitchen
    if (kitchen === "south-east") score += 15; // Agni corner
    else if (kitchen === "north-west") score += 10;
    else score += 2;

    // Master Bedroom
    if (bedroom === "south-west") score += 12; // Earth corner
    else if (bedroom === "south" || bedroom === "west") score += 8;
    else score += 3;

    // Pooja
    if (pooja === "north-east") score += 8; // Ishanya corner
    else if (pooja === "east" || pooja === "north") score += 6;
    else score += 2;

    return Math.min(score, 100);
  };

  const score = calculateScore();

  const getScoreColor = (val) => {
    if (val >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (val >= 70) return "text-[#a98440] bg-[#fbf7ee] border-[#e2d1b3]";
    return "text-amber-600 bg-amber-50 border-amber-200";
  };

  const getVerdict = (val) => {
    if (val >= 85) return { title: "Optimal Vastu Harmony", desc: "This layout aligns exceptionally well with solar and magnetic energies, promoting prosperity and family peace." };
    if (val >= 70) return { title: "Favorable Alignment", desc: "Good overall energy flow. Minor elemental corrections can elevate this property to 90%+ Vastu compliance." };
    return { title: "Requires Elemental Remedies", desc: "Consider basic Vedic remedies like brass pyramidal placements or color balancing to harmonize energy flow." };
  };

  const verdict = getVerdict(score);

  const handleSubmitConsult = (e) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition-opacity">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8 custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a98440]/10 text-2xl text-[#a98440]">
            🧭
          </div>
          <div>
            <h2 className="heading-display text-2xl font-bold text-slate-900">
              Vastu Harmony Calculator
            </h2>
            <p className="text-xs text-slate-500 md:text-sm">
              Evaluate real estate layout compatibility using traditional Vedic Vastu principles.
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Main Entrance */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Main Entrance Direction
            </label>
            <select
              value={entrance}
              onChange={(e) => setEntrance(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#a98440] focus:bg-white"
            >
              <option value="north-east">North-East (Ishanya) - Highly Auspicious</option>
              <option value="north">North (Kuber) - Excellent</option>
              <option value="east">East (Indra/Surya) - Auspicious</option>
              <option value="north-west">North-West (Vayu) - Neutral</option>
              <option value="west">West (Varuna) - Neutral</option>
              <option value="south-east">South-East (Agni) - Fair</option>
              <option value="south">South (Yama) - Requires Remedy</option>
              <option value="south-west">South-West (Nairutya) - Requires Care</option>
            </select>
          </div>

          {/* Kitchen Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Kitchen Placement
            </label>
            <select
              value={kitchen}
              onChange={(e) => setKitchen(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#a98440] focus:bg-white"
            >
              <option value="south-east">South-East (Agni Corner) - Best</option>
              <option value="north-west">North-West (Air Corner) - Second Best</option>
              <option value="east">East - Moderate</option>
              <option value="west">West - Acceptable</option>
              <option value="north-east">North-East - Not Recommended</option>
              <option value="south-west">South-West - Not Recommended</option>
            </select>
          </div>

          {/* Master Bedroom */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Master Bedroom Placement
            </label>
            <select
              value={bedroom}
              onChange={(e) => setBedroom(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#a98440] focus:bg-white"
            >
              <option value="south-west">South-West (Earth Corner) - Ideal for Stability</option>
              <option value="south">South - Good Stability</option>
              <option value="west">West - Favorable</option>
              <option value="north-west">North-West - Suitable for Guests</option>
              <option value="north-east">North-East - Avoid for Master Bed</option>
            </select>
          </div>

          {/* Pooja Room */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Pooja / Meditation Corner
            </label>
            <select
              value={pooja}
              onChange={(e) => setPooja(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#a98440] focus:bg-white"
            >
              <option value="north-east">North-East (Divine Corner) - Ideal</option>
              <option value="east">East - Very Good</option>
              <option value="north">North - Good</option>
              <option value="west">West - Moderate</option>
              <option value="south">South - Not Recommended</option>
            </select>
          </div>
        </div>

        {/* Score Card Display */}
        <div className={`mt-6 rounded-2xl border p-5 transition-all ${getScoreColor(score)}`}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold">{score}%</span>
                <span className="text-sm font-bold uppercase tracking-wider">Vastu Harmony Score</span>
              </div>
              <h4 className="mt-1 font-bold text-slate-900">{verdict.title}</h4>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">{verdict.desc}</p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-inner">
              <svg className="h-12 w-12 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#a98440]"
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Expert Consultation Request */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900">
            Need a Verified 100% Vastu-Compliant Home in Ahmedabad?
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            Our team will curate RERA-approved properties matching your exact astronomical and directional criteria.
          </p>

          {submitted ? (
            <div className="mt-4 rounded-xl bg-emerald-100 p-3 text-center text-sm font-bold text-emerald-800">
              ✓ Consultation requested! Our Vastu advisor will connect via WhatsApp shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmitConsult} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#a98440]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#a98440] hover:bg-[#977232] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer"
              >
                Get Verified Properties
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
