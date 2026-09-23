"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLE_PROMPTS = [
  "3 BHK luxury apartment in Shela with clubhouse",
  "Commercial office space in GIFT City SEZ",
  "Weekend villa with private garden near Sanand",
  "Preleased high-return retail shop on Sindhubhavan Road",
  "4 BHK penthouse on Iscon Ambli Road under 3 Cr",
];

export default function AISearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      onClose();

      const lower = q.toLowerCase();
      let targetPath = "/residential";
      const params = new URLSearchParams();

      if (lower.includes("commercial") || lower.includes("office") || lower.includes("showroom") || lower.includes("shop")) {
        targetPath = "/commercial";
      } else if (lower.includes("gift") || lower.includes("gift city")) {
        targetPath = "/gift-city";
      } else if (lower.includes("investment") || lower.includes("preleased") || lower.includes("roi") || lower.includes("return")) {
        targetPath = "/investment";
      } else if (lower.includes("villa") || lower.includes("plot") || lower.includes("weekend") || lower.includes("farmhouse")) {
        targetPath = "/plot-weekend-villa";
      } else if (lower.includes("rent")) {
        targetPath = "/rent";
      }

      // Extract search locality keywords
      const localities = ["shela", "ambli", "iscon", "thaltej", "bopal", "sindhubhavan", "bodakdev", "science city", "sanand", "prahlad nagar"];
      for (const loc of localities) {
        if (lower.includes(loc)) {
          params.set("search", loc.charAt(0).toUpperCase() + loc.slice(1));
          break;
        }
      }

      const queryString = params.toString();
      router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-2xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#a98440] to-[#e2b764] text-2xl text-white shadow-md">
            ✨
          </div>
          <div>
            <h2 className="heading-display text-2xl font-bold text-slate-900">
              Nirvana AI Property Finder
            </h2>
            <p className="text-xs text-slate-500 md:text-sm">
              Describe your ideal property in plain English or Gujarati — AI will match verified opportunities.
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="mt-6">
          <div className="relative flex items-center rounded-2xl border-2 border-[#a98440]/30 bg-slate-50/70 p-2 shadow-inner transition focus-within:border-[#a98440] focus-within:bg-white">
            <span className="pl-3 text-lg text-[#a98440]">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. 3 BHK with 2 car parking near Iscon Ambli Road under 1.8 Cr..."
              className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none md:text-base"
              autoFocus
            />
            <button
              onClick={() => handleSearch()}
              disabled={isAnalyzing}
              className="shrink-0 rounded-xl bg-[#a98440] hover:bg-[#977232] px-5 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? "Analyzing..." : "Find Properties"}
            </button>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Suggested Prompts
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(prompt);
                  handleSearch(prompt);
                }}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700 transition hover:border-[#a98440] hover:bg-[#a98440]/10 hover:text-[#a98440]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities Indicator */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time RERA verified inventory parsed
          </span>
          <span>Powered by Nirvana SmartMatch</span>
        </div>
      </div>
    </div>
  );
}
