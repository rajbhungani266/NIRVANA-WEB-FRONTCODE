"use client";

import { useState } from "react";
import { submitLead } from "@/lib/api";

const INTERESTED_IN_OPTIONS = [
  { value: "office", label: "Office" },
  { value: "residential", label: "Residential" },
  { value: "investment", label: "Investment" },
  { value: "commercial", label: "Commercial" },
];

const BUDGET_OPTIONS = [
  "Under ₹50 Lac",
  "₹50 Lac - ₹1 Cr",
  "₹1 Cr - ₹2 Cr",
  "Above ₹2 Cr",
];

export default function GiftCityEnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interested_in: INTERESTED_IN_OPTIONS[0].value,
    budget: BUDGET_OPTIONS[0],
    message: "",
  });
  const [status, setStatus] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const interestedInLabel =
      INTERESTED_IN_OPTIONS.find((option) => option.value === form.interested_in)?.label ||
      form.interested_in;

    const message = [
      `Interested In: ${interestedInLabel}`,
      `Budget: ${form.budget}`,
      form.message && `Notes: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setStatus("Submitting...");
      await submitLead({
        property_category: "gift_city",
        name: form.name,
        phone: form.phone,
        email: form.email,
        message,
      });
      setStatus("Thanks! Our GIFT City advisor will reach out shortly.");
      setForm({
        name: "",
        phone: "",
        email: "",
        interested_in: INTERESTED_IN_OPTIONS[0].value,
        budget: BUDGET_OPTIONS[0],
        message: "",
      });
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">
        Enquire About GIFT City
      </h3>
      <p className="mt-1 text-[12px] text-slate-500">
        Tax benefits, SEZ zones, premium towers — let our team guide you.
      </p>

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
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="input-clean"
          placeholder="Mobile Number"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input-clean"
          placeholder="Email (Optional)"
        />

        <select
          name="interested_in"
          value={form.interested_in}
          onChange={handleChange}
          className="input-clean"
        >
          {INTERESTED_IN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className="input-clean"
        >
          {BUDGET_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="input-clean min-h-20"
          placeholder="Anything specific you're looking for? (Optional)"
        />

        <button className="w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-3 text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer">
          🏙️ Enquire Now
        </button>

        {status && <p className="text-[12px] text-slate-600">{status}</p>}
        <p className="text-center text-[11px] text-slate-400">
          🔒 Your information is secure.
        </p>
      </form>
    </div>
  );
}
