"use client";

import { useState } from "react";
import { submitLead } from "@/lib/api";

/*
  Investment page needs different questions than a generic site-visit
  booking: what kind of return the buyer wants and how much they can put in.
  The Lead model only stores name/phone/email/message, so the structured
  picks are folded into the message text — no backend change needed, and
  admins still see everything in one readable field.
*/
const INVESTMENT_TYPE_OPTIONS = [
  { value: "preleased", label: "Preleased" },
  { value: "rental_income", label: "Rental Income" },
  { value: "high_return", label: "High Return" },
  { value: "future_growth", label: "Future Growth" },
];

const BUDGET_OPTIONS = [
  "Under ₹50 Lac",
  "₹50 Lac - ₹1 Cr",
  "₹1 Cr - ₹2 Cr",
  "Above ₹2 Cr",
];

export default function InvestmentEnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    investment_type: INVESTMENT_TYPE_OPTIONS[0].value,
    budget: BUDGET_OPTIONS[0],
    message: "",
  });
  const [status, setStatus] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const investmentTypeLabel =
      INVESTMENT_TYPE_OPTIONS.find((option) => option.value === form.investment_type)?.label ||
      form.investment_type;

    const message = [
      `Investment Type: ${investmentTypeLabel}`,
      `Budget: ${form.budget}`,
      form.message && `Notes: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setStatus("Submitting...");
      await submitLead({
        property_category: "investment",
        name: form.name,
        phone: form.phone,
        email: form.email,
        message,
      });
      setStatus("Thanks! Our investment advisor will reach out shortly.");
      setForm({
        name: "",
        phone: "",
        email: "",
        investment_type: INVESTMENT_TYPE_OPTIONS[0].value,
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
        Get Investment Advice
      </h3>
      <p className="mt-1 text-[12px] text-slate-500">
        Tell us your goals — our team will match you with the right opportunity.
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
          name="investment_type"
          value={form.investment_type}
          onChange={handleChange}
          className="input-clean"
        >
          {INVESTMENT_TYPE_OPTIONS.map((option) => (
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
          📈 Get Investment Advice
        </button>

        {status && <p className="text-[12px] text-slate-600">{status}</p>}
        <p className="text-center text-[11px] text-slate-400">
          🔒 Your information is secure.
        </p>
      </form>
    </div>
  );
}
