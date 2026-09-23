"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/format";

const INITIAL_SELLER_PROPERTIES = [
  {
    id: "sp-1",
    title: "Sahjanand Skyview",
    category: "Residential",
    property_type: "4 BHK Luxury Apartment",
    location: "Iscon Ambli Road, Ahmedabad",
    price: 9152000,
    price_per_sqft: 6950,
    area_sqft: 2150,
    status: "Active",
    views: 3420,
    leads: 28,
    site_visits: 12,
    rera_number: "PR/GJ/AHMEDABAD/CITY/AUDA/RAA08921/040321",
    main_image: "/images/first.jpg",
    possession: "April 2029",
    featured: true,
  },
  {
    id: "sp-2",
    title: "Sahjanand Business Hub",
    category: "Commercial",
    property_type: "Corporate Grade-A Office",
    location: "Sindhubhavan Road, Ahmedabad",
    price: 18500000,
    price_per_sqft: 9250,
    area_sqft: 2000,
    status: "Active",
    views: 1890,
    leads: 19,
    site_visits: 7,
    rera_number: "PR/GJ/AHMEDABAD/AUDA/RAA09412/180222",
    main_image: "/images/second.jpg",
    possession: "December 2026",
    featured: false,
  },
  {
    id: "sp-3",
    title: "Sahjanand Serenity Villas",
    category: "Plot & Villa",
    property_type: "4 BHK Weekend Villa",
    location: "Rancharda, Ahmedabad",
    price: 32000000,
    price_per_sqft: 8000,
    area_sqft: 4000,
    status: "Under Review",
    views: 420,
    leads: 4,
    site_visits: 1,
    rera_number: "PR/GJ/GANDHINAGAR/RAA09981/Pending",
    main_image: "/images/seven.png",
    possession: "October 2027",
    featured: false,
  },
];

const INITIAL_LEADS = [
  {
    id: "ld-1",
    name: "Amitabh Shah",
    phone: "+91 98250 14821",
    email: "amitabh.shah@gmail.com",
    project: "Sahjanand Skyview",
    bhk: "4 BHK",
    type: "Site Visit Requested",
    date: "2026-09-19",
    timeSlot: "Morning (10:00 AM - 1:00 PM)",
    status: "New",
  },
  {
    id: "ld-2",
    name: "Dr. Neha Parikh",
    phone: "+91 94260 88319",
    email: "neha.parikh@medcare.in",
    project: "Sahjanand Skyview",
    bhk: "4 BHK",
    type: "Brochure & Floorplan Request",
    date: "2026-09-18",
    timeSlot: "Afternoon",
    status: "Contacted",
  },
  {
    id: "ld-3",
    name: "Rajesh K. Mehta (NRI - UK)",
    phone: "+44 7911 123456",
    email: "rkmehta.london@outlook.com",
    project: "Sahjanand Business Hub",
    bhk: "2,000 sq.ft. Office",
    type: "Site Visit Scheduled",
    date: "2026-09-17",
    timeSlot: "Virtual / Video Call",
    status: "Site Visit Done",
  },
  {
    id: "ld-4",
    name: "Harshvardhan Patel",
    phone: "+91 98980 55431",
    email: "hpatel.tech@yahoo.com",
    project: "Sahjanand Serenity Villas",
    bhk: "4 BHK Villa",
    type: "Callback Requested",
    date: "2026-09-16",
    timeSlot: "Evening (4:00 PM - 7:00 PM)",
    status: "In Discussion",
  },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("listings"); // "listings" | "add" | "leads" | "profile"
  const [properties, setProperties] = useState(INITIAL_SELLER_PROPERTIES);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");

  // New Property Form State
  const [newProp, setNewProp] = useState({
    title: "",
    category: "Residential",
    property_type: "3 BHK Luxury Apartment",
    location: "Sindhubhavan Road, Ahmedabad",
    price: "",
    price_per_sqft: "",
    area_sqft: "",
    possession: "Ready to Move",
    rera_number: "",
    builder_name: "Sahjanand Group",
    description: "",
    main_image: "/images/first.jpg",
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleCreateProperty = (e) => {
    e.preventDefault();
    if (!newProp.title || !newProp.price) {
      alert("Please fill in the project title and price.");
      return;
    }

    const created = {
      id: `sp-${Date.now()}`,
      ...newProp,
      price: Number(newProp.price),
      price_per_sqft: Number(newProp.price_per_sqft) || 7200,
      area_sqft: Number(newProp.area_sqft) || 1850,
      status: "Under Review",
      views: 1,
      leads: 0,
      site_visits: 0,
      featured: false,
    };

    setProperties([created, ...properties]);
    showToast(`🎉 "${newProp.title}" listed successfully! Sent to Nirvana Space Admin for RERA verification.`);
    setActiveTab("listings");
    setNewProp({
      title: "",
      category: "Residential",
      property_type: "3 BHK Luxury Apartment",
      location: "Sindhubhavan Road, Ahmedabad",
      price: "",
      price_per_sqft: "",
      area_sqft: "",
      possession: "Ready to Move",
      rera_number: "",
      builder_name: "Sahjanand Group",
      description: "",
      main_image: "/images/second.jpg",
    });
  };

  const togglePropertyStatus = (id) => {
    setProperties(
      properties.map((p) => {
        if (p.id === id) {
          const next = p.status === "Active" ? "Paused" : "Active";
          showToast(`Status of ${p.title} changed to ${next}`);
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  const handleDeleteProperty = (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}"?`)) {
      setProperties(properties.filter((p) => p.id !== id));
      showToast(`Property "${title}" deleted from portal.`);
    }
  };

  const updateLeadStatus = (leadId, nextStatus) => {
    setLeads(
      leads.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );
    showToast(`Lead status updated to "${nextStatus}"`);
  };

  const filteredProperties = properties.filter((p) => {
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    const matchQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.property_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const totalViews = properties.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLeadsCount = leads.length;
  const activeCount = properties.filter((p) => p.status === "Active").length;

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans">
      <Navbar />

      {/* Top Breadcrumb & Portal Banner */}
      <section className="bg-gradient-to-b from-[#dce7f3] via-[#edf3f8] to-[#f8fafc] pt-28 pb-8 border-b border-slate-200/70">
        <div className="w-[96%] max-w-[1340px] mx-auto">
          {/* Header row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#a98440]/15 px-3 py-1 text-xs font-bold text-[#8a682b] border border-[#a98440]/30">
                  <span>🏢</span> Builder &amp; Seller Portal
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  RERA Registered Developer Desk
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>Sahjanand Group Partner Dashboard</span>
                <span className="inline-block rounded-md bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-bold border border-emerald-300">
                  ✓ Verified Developer
                </span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Manage your live project inventory, capture verified homebuyer leads, and coordinate free site visits.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className="rounded-full bg-[#a98440] hover:bg-[#977232] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>＋</span> List New Property
              </button>
              <Link
                href="/admin"
                className="rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition shadow-2xs"
              >
                Go to Admin Portal ➔
              </Link>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {notification && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs sm:text-sm font-semibold text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in duration-300">
              <span>{notification}</span>
              <button
                onClick={() => setNotification("")}
                className="text-emerald-600 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Key Metrics Strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Live Projects
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
                {activeCount} <span className="text-xs font-normal text-slate-400">/ {properties.length} Total</span>
              </p>
              <span className="mt-1 inline-block text-[11px] font-medium text-emerald-600">
                ✓ 100% RERA Compliant
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Buyer Inquiries
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-[#a98440]">
                {totalLeadsCount}
              </p>
              <span className="mt-1 inline-block text-[11px] font-medium text-slate-500">
                +4 new leads this week
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Site Visits Booked
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
                20
              </p>
              <span className="mt-1 inline-block text-[11px] font-medium text-blue-600">
                12 Scheduled this weekend
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Impressions
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
                {totalViews.toLocaleString()}
              </p>
              <span className="mt-1 inline-block text-[11px] font-medium text-emerald-600">
                ↑ 18.2% Organic reach
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("listings")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                activeTab === "listings"
                  ? "border-[#a98440] text-[#a98440]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              My Listed Projects ({properties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("add")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "add"
                  ? "border-[#a98440] text-[#a98440]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>＋</span> List New Project
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "leads"
                  ? "border-[#a98440] text-[#a98440]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📩</span> Buyer Leads &amp; Visits ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                activeTab === "profile"
                  ? "border-[#a98440] text-[#a98440]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Developer Profile &amp; RERA Desk
            </button>
          </div>
        </div>
      </section>

      {/* Tab 1: My Listed Properties */}
      {activeTab === "listings" && (
        <section className="w-[96%] max-w-[1340px] mx-auto py-8 flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              {["All", "Active", "Under Review", "Paused"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    statusFilter === status
                      ? "bg-[#a98440] text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project title or locality..."
                className="h-9 w-64 rounded-full border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#a98440]"
              />
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className="h-9 rounded-full bg-[#a98440] hover:bg-[#977232] px-4 text-xs font-bold text-white shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
              >
                + Add Project
              </button>
            </div>
          </div>

          {/* Properties Table / Cards */}
          <div className="space-y-4">
            {filteredProperties.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                <p className="text-base font-semibold">No projects matching your search.</p>
                <button
                  onClick={() => {
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-bold text-[#a98440] underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm hover:border-slate-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 sm:gap-6 items-center">
                    {/* Thumbnail */}
                    <div className="relative h-28 w-full md:w-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={prop.main_image}
                        alt={prop.title}
                        className="h-full w-full object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs ${
                          prop.status === "Active"
                            ? "bg-emerald-600"
                            : prop.status === "Under Review"
                            ? "bg-amber-600"
                            : "bg-slate-600"
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>

                    {/* Middle Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {prop.category}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {prop.property_type}
                        </span>
                        {prop.featured && (
                          <span className="rounded-md bg-[#d97706]/15 border border-[#d97706]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#d97706]">
                            ★ FEATURED
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1 text-lg font-bold text-slate-900 hover:text-[#a98440] transition">
                        <Link href={`/residential?search=${encodeURIComponent(prop.title)}`}>
                          {prop.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">📍 {prop.location}</p>

                      <div className="mt-2.5 flex items-center gap-4 text-xs font-semibold text-slate-700 flex-wrap">
                        <span>💰 {formatPrice(prop.price)}</span>
                        <span className="text-slate-300">|</span>
                        <span>📐 {prop.area_sqft} sq.ft. (₹{prop.price_per_sqft}/sq.ft.)</span>
                        <span className="text-slate-300">|</span>
                        <span>📅 Possession: {prop.possession}</span>
                      </div>

                      <p className="mt-1.5 text-[11px] font-mono text-slate-400">
                        RERA: {prop.rera_number}
                      </p>
                    </div>

                    {/* Right Performance Stats & Actions */}
                    <div className="flex flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span title="Views">👁️ <strong>{prop.views}</strong> views</span>
                        <span>•</span>
                        <span title="Leads" className="text-[#a98440]">📩 <strong>{prop.leads}</strong> leads</span>
                        <span>•</span>
                        <span title="Visits" className="text-blue-600">📅 <strong>{prop.site_visits}</strong> visits</span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => togglePropertyStatus(prop.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                            prop.status === "Active"
                              ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                              : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          }`}
                        >
                          {prop.status === "Active" ? "Pause Listing" : "Activate Listing"}
                        </button>

                        <Link
                          href={`/residential?search=${encodeURIComponent(prop.title)}`}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          View Live
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(prop.id, prop.title)}
                          className="rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
                          title="Delete Property"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Tab 2: Add New Property Form Wizard */}
      {activeTab === "add" && (
        <section className="w-[96%] max-w-[1000px] mx-auto py-8 flex-1">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <span className="rounded-full bg-[#a98440]/15 px-3 py-1 text-xs font-bold text-[#8a682b] border border-[#a98440]/30">
                Step 1 of 1 • New Project Inventory
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
                List a New Property / Project
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Enter your project specifications. All listings undergo Nirvana Space RERA title check before going live to 50,000+ buyers.
              </p>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Project / Building Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahjanand Skyview"
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440] focus:ring-2 focus:ring-[#a98440]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newProp.category}
                    onChange={(e) => setNewProp({ ...newProp, category: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#a98440]"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot & Villa">Plots &amp; Weekend Villas</option>
                    <option value="Investment">High-Yield Investment</option>
                    <option value="GIFT City">GIFT City SEZ Hub</option>
                  </select>
                </div>
              </div>

              {/* Configuration & Location */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Unit Type / BHK *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4 BHK Luxury Apartment"
                    value={newProp.property_type}
                    onChange={(e) => setNewProp({ ...newProp, property_type: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Locality &amp; Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sindhubhavan Road, Ahmedabad"
                    value={newProp.location}
                    onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Possession Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. December 2028"
                    value={newProp.possession}
                    onChange={(e) => setNewProp({ ...newProp, possession: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>
              </div>

              {/* Pricing & Area */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Total Starting Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 9152000"
                    value={newProp.price}
                    onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Rate per Sq.Ft. (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 6950"
                    value={newProp.price_per_sqft}
                    onChange={(e) => setNewProp({ ...newProp, price_per_sqft: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Carpet / Super Built Area (Sq.Ft.)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2150"
                    value={newProp.area_sqft}
                    onChange={(e) => setNewProp({ ...newProp, area_sqft: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>
              </div>

              {/* Legal RERA & Media */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Gujarat RERA Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PR/GJ/AHMEDABAD/CITY/AUDA/RAA08921/040321"
                    value={newProp.rera_number}
                    onChange={(e) => setNewProp({ ...newProp, rera_number: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 font-mono placeholder-slate-400 outline-none focus:border-[#a98440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cover Image URL / Asset
                  </label>
                  <select
                    value={newProp.main_image}
                    onChange={(e) => setNewProp({ ...newProp, main_image: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#a98440]"
                  >
                    <option value="/images/first.jpg">Tower Render (first.jpg)</option>
                    <option value="/images/second.jpg">Aerial View (second.jpg)</option>
                    <option value="/images/seven.png">Luxury Club Villa (seven.png)</option>
                    <option value="/images/ninth.png">Modern High-Rise (ninth.png)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Project Highlights &amp; Amenities
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention double-height ceiling, private deck, EV charging stations, clubhouse amenities..."
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#a98440]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("listings")}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#a98440] hover:bg-[#977232] px-7 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Submit for Verification &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Tab 3: Buyer Leads & Site Visit Bookings */}
      {activeTab === "leads" && (
        <section className="w-[96%] max-w-[1340px] mx-auto py-8 flex-1">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Buyer Inquiries &amp; Site Visits
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Direct inquiries generated from Nirvana Space residential &amp; commercial listings.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                ⚡ Instant Lead Delivery Enabled
              </span>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3 px-4">Lead Name &amp; Contact</th>
                    <th className="py-3 px-4">Interested Project</th>
                    <th className="py-3 px-4">Inquiry Type</th>
                    <th className="py-3 px-4">Date / Slot</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{lead.name}</p>
                        <p className="text-slate-500 text-xs">{lead.phone}</p>
                        <p className="text-slate-400 text-[11px]">{lead.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{lead.project}</span>
                        <p className="text-xs text-slate-500">{lead.bhk}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {lead.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <p className="font-medium">{lead.date}</p>
                        <p className="text-[11px] text-slate-400">{lead.timeSlot}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold ${
                            lead.status === "New"
                              ? "bg-amber-100 text-amber-800"
                              : lead.status === "Contacted"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "Site Visit Done"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                        >
                          <option value="New">Mark New</option>
                          <option value="Contacted">Mark Contacted</option>
                          <option value="Site Visit Done">Site Visit Done</option>
                          <option value="In Discussion">In Discussion</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Developer Profile & RERA */}
      {activeTab === "profile" && (
        <section className="w-[96%] max-w-[1000px] mx-auto py-8 flex-1">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Developer Profile &amp; Verification Details
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              This official information is displayed to buyers on project listings and verified advisor reports.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Company Details</h3>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong className="text-slate-800">Legal Entity:</strong> Sahjanand Realty Developers LLP</p>
                  <p><strong className="text-slate-800">Corporate HQ:</strong> Iscon Ambli Road, Ahmedabad, Gujarat 380058</p>
                  <p><strong className="text-slate-800">Experience:</strong> 18+ Years in Luxury Real Estate</p>
                  <p><strong className="text-slate-800">Delivered Projects:</strong> 14 Completed Projects (AUDA Approved)</p>
                  <p><strong className="text-slate-800">Total Built Area:</strong> 2.8 Million Sq.Ft.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">RERA &amp; Compliance</h3>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong className="text-slate-800">Promoter RERA:</strong> GUJRERA/PR/AHM/2021/00142</p>
                  <p><strong className="text-slate-800">Title Verification:</strong> 100% Clear Title &amp; NA/NOC verified</p>
                  <p><strong className="text-slate-800">Bank Approvals:</strong> SBI, HDFC, ICICI, Axis approved</p>
                  <p><strong className="text-slate-800">Assigned Advisor:</strong> Raj Patel (Senior Real Estate Consultant)</p>
                  <p><strong className="text-slate-800">Direct Desk:</strong> +91 95744 91891</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
