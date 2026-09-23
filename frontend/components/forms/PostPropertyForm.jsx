"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitProperty } from "@/lib/api";

export default function PostPropertyForm() {
  // Sell mega-menu links arrive as e.g. ?property_category=commercial&user_type=owner
  // — pre-fill the matching dropdowns instead of leaving the defaults.
  const urlParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    user_type: urlParams.get("user_type") ?? "owner",
    property_category: urlParams.get("property_category") ?? "residential",
    deal_type: urlParams.get("deal_type") ?? "sale",
    city: "",
    area: "",
    address: "",
    expected_price: "",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
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

      await submitProperty(form);

      setStatus(
        "Your property has been submitted successfully. Our team will verify and contact you shortly."
      );

      setForm({
        name: "",
        phone: "",
        email: "",
        user_type: "owner",
        property_category: "residential",
        deal_type: "sale",
        city: "",
        area: "",
        address: "",
        expected_price: "",
        area_sqft: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
      });
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input-clean"
          placeholder="Your Name"
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
          placeholder="Email"
        />

        <select
          name="user_type"
          value={form.user_type}
          onChange={handleChange}
          className="input-clean"
        >
          <option value="owner">Owner</option>
          <option value="builder">Builder / Developer</option>
        </select>

        <select
          name="property_category"
          value={form.property_category}
          onChange={handleChange}
          className="input-clean"
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="plot_weekend_villa">Plot / Weekend Villa</option>
          <option value="investment">Investment</option>
          <option value="gift_city">Gift City</option>
        </select>

        <select
          name="deal_type"
          value={form.deal_type}
          onChange={handleChange}
          className="input-clean"
        >
          <option value="sale">Sale</option>
          <option value="rental">Rent</option>
          <option value="resale">Resale</option>
        </select>

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="input-clean"
          placeholder="City"
          required
        />

        <input
          name="area"
          value={form.area}
          onChange={handleChange}
          className="input-clean"
          placeholder="Area"
        />

        <input
          name="expected_price"
          value={form.expected_price}
          onChange={handleChange}
          className="input-clean"
          placeholder="Expected Price / Rent"
        />

        <input
          name="area_sqft"
          value={form.area_sqft}
          onChange={handleChange}
          className="input-clean"
          placeholder="Area Sqft"
        />

        <input
          name="bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          className="input-clean"
          placeholder="Bedrooms"
        />

        <input
          name="bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          className="input-clean"
          placeholder="Bathrooms"
        />
      </div>

      <textarea
        name="address"
        value={form.address}
        onChange={handleChange}
        className="input-clean mt-4 min-h-20"
        placeholder="Property Address"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="input-clean mt-4 min-h-28"
        placeholder="Property Description"
      />

      <button className="mt-5 w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-4 text-sm font-bold text-white shadow-md transition active:scale-95 cursor-pointer">
        Submit Property
      </button>

      {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
    </form>
  );
}