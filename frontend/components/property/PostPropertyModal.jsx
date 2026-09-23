"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/lib/api";

export default function PostPropertyModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setStatus(null);

      await submitLead({
        property_category: "post_property",
        property_id: null,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: "Post Property lead enquiry from header",
      });

      setStatus({
        type: "success",
        message: "Your property enquiry has been submitted successfully. Our team will contact you shortly.",
      });
      setForm({ name: "", email: "", phone: "" });

      setTimeout(() => {
        onClose();
        setStatus(null);
      }, 2500);
    } catch (err) {
      console.warn("Lead submission issue:", err?.message || err);
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again or reach out to us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Post Property</h3>
            <p className="mt-1 text-[13px] text-slate-500 font-normal">
              Enter your details to list your property
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#a98440] focus:ring-1 focus:ring-[#a98440]"
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#a98440] focus:ring-1 focus:ring-[#a98440]"
              placeholder="Email Address"
              required
            />
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#a98440] focus:ring-1 focus:ring-[#a98440]"
              placeholder="Mobile Number"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-3 text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-70 mt-1"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {status && (
            <div
              className={`mt-3 rounded-xl p-3 text-center text-xs font-medium flex items-center justify-center gap-2 ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
              <span>{status.message}</span>
            </div>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
