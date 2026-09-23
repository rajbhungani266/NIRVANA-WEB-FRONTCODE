"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/lib/api";

export default function EnquireModal({ property, category, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setStatus("Submitting...");
      await submitLead({
        property_category: category?.replace("-", "_") || "",
        property_id: property?.id ?? null,
        ...form,
      });
      setStatus("Your enquiry has been submitted successfully.");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Enquire Now</h3>
            {property?.title && (
              <p className="mt-1 text-[13px] text-slate-500">{property.title}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-clean"
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input-clean"
            placeholder="Email Address"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input-clean"
            placeholder="Mobile Number"
            required
          />

          <button className="w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-3 text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer">
            Submit
          </button>

          {status && <p className="text-[12px] text-slate-600">{status}</p>}
        </form>
      </div>
    </div>,
    document.body
  );
}
