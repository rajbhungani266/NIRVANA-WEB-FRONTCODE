"use client";

import { useState } from "react";
import { submitLead } from "@/lib/api";

export default function LeadForm({ propertyCategory = "", propertyId = null }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setStatus("Submitting...");

      await submitLead({
        property_category: propertyCategory,
        property_id: propertyId,
        ...form,
      });

      setStatus("Your enquiry has been submitted successfully.");
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-2.5">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input-clean py-2 px-3 text-sm"
          placeholder="Name"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="input-clean py-2 px-3 text-sm"
          placeholder="Mobile number"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input-clean py-2 px-3 text-sm"
          placeholder="Email Address"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="input-clean min-h-16 py-2 px-3 text-sm"
          placeholder="Message"
        />

        <button className="w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-2.5 text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer mt-1">
          Submit
        </button>

        {status && <p className="text-xs text-center text-slate-600">{status}</p>}
      </div>
    </form>
  );
}