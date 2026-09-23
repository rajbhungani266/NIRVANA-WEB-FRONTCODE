"use client";

import { useState } from "react";
import { submitLead } from "@/lib/api";

export default function BookSiteVisitForm({ category }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setStatus("Submitting...");
      await submitLead({
        property_category: category?.replace("-", "_") || "",
        ...form,
      });
      setStatus("Booked! Our advisor will call you shortly.");
      setForm({ name: "", phone: "", email: "" });
    } catch {
      setStatus("Request received! Our advisor will contact you.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      {/* Top Brown Gold Banner matching Image 2 */}
      <div className="bg-[#a98440] p-4 text-white">
        <h3 className="text-base font-bold leading-tight">
          Schedule Your Free Site Visit
        </h3>
        <p className="mt-1 text-xs text-white/90 leading-relaxed">
          Share your details and our advisor will connect with you
        </p>
      </div>

      {/* Form Content matching Image 2 */}
      <div className="p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full border-b border-slate-200 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440] transition"
            />
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile number"
              required
              className="w-full border-b border-slate-200 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440] transition"
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border-b border-slate-200 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#b18537] hover:bg-[#977232] py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            Book Site Visit
          </button>

          {status && (
            <p className="text-center text-xs font-semibold text-[#a98440]">{status}</p>
          )}
        </form>

        {/* Callback note matching Image 2 */}
        <div className="mt-5 flex items-center gap-2.5 border-t border-slate-100 pt-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fbf7ee] border border-[#e2d1b3] text-sm font-bold text-[#a98440] shadow-xs">
            👨‍💼
          </div>
          <p className="text-[11px] leading-snug text-slate-600 font-medium">
            Expect a callback within 5 minutes during working hours.
          </p>
        </div>
      </div>
    </div>
  );
}
