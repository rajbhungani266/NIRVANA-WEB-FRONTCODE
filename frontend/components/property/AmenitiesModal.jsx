"use client";

import { useEffect } from "react";
import {
  Sparkles,
  Waves,
  Dumbbell,
  Trees,
  Zap,
  ShieldCheck,
  Smile,
  Landmark,
  BatteryCharging,
  Car,
  Activity,
  Wifi,
  X,
  ArrowRight
} from "lucide-react";

const DEFAULT_AMENITIES = [
  {
    icon: Waves,
    name: "Infinity Swimming Pool",
    desc: "Temperature controlled with expansive sundeck & kids pool area",
  },
  {
    icon: Dumbbell,
    name: "Modern Gymnasium",
    desc: "Fully equipped with cardio, strength training & personal trainers",
  },
  {
    icon: Landmark,
    name: "Grand Luxury Clubhouse",
    desc: "Banquet halls, private mini-theater & indoor game lounge",
  },
  {
    icon: Trees,
    name: "Landscaped Zen Gardens",
    desc: "Reflexology pathways, lush sit-outs & central water fountain",
  },
  {
    icon: Smile,
    name: "Children's Adventure Park",
    desc: "Rubberized shock-absorbent turf with slides & swings",
  },
  {
    icon: Zap,
    name: "EV Charging Infrastructure",
    desc: "Dedicated high-speed fast charging stations in all parking levels",
  },
  {
    icon: ShieldCheck,
    name: "3-Tier 24/7 Security",
    desc: "CCTV surveillance, biometric lobby entry & RFID boom barriers",
  },
  {
    icon: BatteryCharging,
    name: "100% Power Backup",
    desc: "Dedicated soundproof DG setup for residences & all common areas",
  },
  {
    icon: Activity,
    name: "Rooftop Skywalk & Track",
    desc: "Elevated jogging track with panoramic cityscape views",
  },
  {
    icon: Car,
    name: "Multi-Level Reserved Parking",
    desc: "Spacious ramp design with automated space guidance system",
  },
  {
    icon: Wifi,
    name: "High-Speed Wi-Fi Zones",
    desc: "Seamless connectivity across club, garden & pool pavilion",
  },
  {
    icon: Sparkles,
    name: "Yoga & Meditation Deck",
    desc: "Peaceful shaded outdoor pavilion facing morning sunlight",
  },
];

export default function AmenitiesModal({ project, onClose, onEnquire }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 bg-gradient-to-r from-amber-50/50 via-white to-white">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#a98440]">
              <Sparkles className="h-3 w-3" />
              <span>World-Class Living</span>
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {project.title || "Project"} — Amenities
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {project.area ? `${project.area}, ${project.city || "Ahmedabad"}` : "Exclusive luxury lifestyle features"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DEFAULT_AMENITIES.map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-amber-50/30 hover:border-[#a98440]/30 hover:shadow-xs group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#a98440] shadow-2xs border border-slate-100 group-hover:scale-105 group-hover:bg-[#a98440] group-hover:text-white transition-all">
                    <Icon className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#a98440] transition-colors">
                      {amenity.name}
                    </h4>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      {amenity.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-slate-800">
              Want the detailed brochure & master layout?
            </p>
            <p className="text-[11px] text-slate-500">
              Get comprehensive floorplans and amenity specs delivered instantly.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
            {onEnquire && (
              <button
                type="button"
                onClick={() => onEnquire(project)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#b88c3a] hover:bg-[#a2782c] px-4.5 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
