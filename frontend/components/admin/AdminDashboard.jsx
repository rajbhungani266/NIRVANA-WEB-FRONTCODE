"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/format";

const INITIAL_ADMIN_PROPERTIES = [
  {
    id: "adm-1",
    title: "Sahjanand Skyview",
    builder: "Sahjanand Group",
    category: "Residential",
    property_type: "4 BHK Luxury Apartment",
    location: "Iscon Ambli Road, Ahmedabad",
    price: 9152000,
    area_sqft: 2150,
    rera_status: "Verified",
    rera_number: "PR/GJ/AHMEDABAD/AUDA/RAA08921/040321",
    is_featured: true,
    status: "Published",
    submitted_date: "2026-09-18",
  },
  {
    id: "adm-2",
    title: "Skyline Residences",
    builder: "Shilp Group",
    category: "Residential",
    property_type: "4 BHK Luxury Apartments",
    location: "Sindhubhavan Road, Ahmedabad",
    price: 12800000,
    area_sqft: 2450,
    rera_status: "Verified",
    rera_number: "PR/GJ/AHMEDABAD/AUDA/RAA09311/120422",
    is_featured: true,
    status: "Published",
    submitted_date: "2026-09-17",
  },
  {
    id: "adm-3",
    title: "Sahjanand Serenity Villas",
    builder: "Sahjanand Group",
    category: "Plot & Villa",
    property_type: "4 BHK Weekend Villa",
    location: "Rancharda, Ahmedabad",
    price: 32000000,
    area_sqft: 4000,
    rera_status: "Pending Verification",
    rera_number: "PR/GJ/GANDHINAGAR/RAA09981/Pending",
    is_featured: false,
    status: "Pending Review",
    submitted_date: "2026-09-19",
  },
  {
    id: "adm-4",
    title: "The Capital Commercial Tower",
    builder: "Goyal & Co",
    category: "Commercial",
    property_type: "Showroom & Grade-A Offices",
    location: "Science City Road, Ahmedabad",
    price: 24500000,
    area_sqft: 3200,
    rera_status: "Verified",
    rera_number: "PR/GJ/AHMEDABAD/AUDA/RAA07612/100121",
    is_featured: false,
    status: "Published",
    submitted_date: "2026-09-15",
  },
  {
    id: "adm-5",
    title: "GIFT One Horizon",
    builder: "Shilp Group",
    category: "GIFT City",
    property_type: "FinTech Hub Office",
    location: "GIFT City SEZ, Gandhinagar",
    price: 45000000,
    area_sqft: 5000,
    rera_status: "Pending Verification",
    rera_number: "PR/GJ/GANDHINAGAR/SEZ/RAA11029/Pending",
    is_featured: false,
    status: "Pending Review",
    submitted_date: "2026-09-19",
  },
];

const INITIAL_ADMIN_LEADS = [
  {
    id: "lead-101",
    name: "Amitabh Shah",
    phone: "+91 98250 14821",
    email: "amitabh.shah@gmail.com",
    property: "Sahjanand Skyview",
    builder: "Sahjanand Group",
    type: "Site Visit Request",
    preferred_slot: "Sunday Morning (11:00 AM)",
    assigned_advisor: "Raj Patel",
    status: "Scheduled",
    date: "2026-09-19 14:30",
  },
  {
    id: "lead-102",
    name: "Pooja Desai",
    phone: "+91 98790 33411",
    email: "pooja.desai@infosys.com",
    property: "Skyline Residences",
    builder: "Shilp Group",
    type: "Advisor Callback",
    preferred_slot: "Immediate (Working Hours)",
    assigned_advisor: "Vikram Mehta",
    status: "New",
    date: "2026-09-19 15:10",
  },
  {
    id: "lead-103",
    name: "Dr. K. S. Rathore",
    phone: "+91 94280 99872",
    email: "ksrathore@apollo.org",
    property: "The Capital Commercial Tower",
    builder: "Goyal & Co",
    type: "Price & Floorplan Request",
    preferred_slot: "Evening Call",
    assigned_advisor: "Raj Patel",
    status: "In Progress",
    date: "2026-09-18 18:45",
  },
  {
    id: "lead-104",
    name: "Sanjay Singhania (NRI - Dubai)",
    phone: "+971 50 123 4567",
    email: "sanjay.singh@gulfventures.ae",
    property: "GIFT One Horizon",
    builder: "Shilp Group",
    type: "Investment Consultation",
    preferred_slot: "WhatsApp / Zoom Meet",
    assigned_advisor: "Raj Patel",
    status: "Converted",
    date: "2026-09-17 11:20",
  },
];

const INITIAL_BUILDERS = [
  {
    id: "bld-1",
    name: "Sahjanand Group",
    founded: "2008",
    completed_projects: 14,
    active_listings: 3,
    rating: 4.7,
    rera_registered: true,
    contact_person: "Haresh Patel (MD)",
    phone: "+91 95744 91891",
  },
  {
    id: "bld-2",
    name: "Shilp Group",
    founded: "2004",
    completed_projects: 26,
    active_listings: 6,
    rating: 4.8,
    rera_registered: true,
    contact_person: "Snehal Patel (Partner)",
    phone: "+91 79844 30082",
  },
  {
    id: "bld-3",
    name: "Adani Realty",
    founded: "2010",
    completed_projects: 18,
    active_listings: 4,
    rating: 4.9,
    rera_registered: true,
    contact_person: "Kunal Vora (VP Sales)",
    phone: "+91 79 2656 5555",
  },
  {
    id: "bld-4",
    name: "Goyal & Co",
    founded: "1971",
    completed_projects: 220,
    active_listings: 5,
    rating: 4.8,
    rera_registered: true,
    contact_person: "Tanmay Goyal",
    phone: "+91 79 4000 1111",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("listings"); // "listings" | "leads" | "builders" | "settings"
  const [properties, setProperties] = useState(INITIAL_ADMIN_PROPERTIES);
  const [leads, setLeads] = useState(INITIAL_ADMIN_LEADS);
  const [builders] = useState(INITIAL_BUILDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleApproveProperty = (id) => {
    setProperties(
      properties.map((p) => {
        if (p.id === id) {
          showToast(`✓ "${p.title}" RERA verified & approved for live publication!`);
          return {
            ...p,
            status: "Published",
            rera_status: "Verified",
          };
        }
        return p;
      })
    );
  };

  const handleToggleFeatured = (id) => {
    setProperties(
      properties.map((p) => {
        if (p.id === id) {
          const next = !p.is_featured;
          showToast(`★ ${p.title} ${next ? "marked as FEATURED" : "removed from featured"}.`);
          return { ...p, is_featured: next };
        }
        return p;
      })
    );
  };

  const handleDeleteProperty = (id, title) => {
    if (confirm(`Admin action: Remove listing "${title}" from the platform?`)) {
      setProperties(properties.filter((p) => p.id !== id));
      showToast(`Property "${title}" deleted by Admin.`);
    }
  };

  const handleAssignLead = (leadId, advisor) => {
    setLeads(
      leads.map((l) => (l.id === leadId ? { ...l, assigned_advisor: advisor } : l))
    );
    showToast(`Lead assigned to ${advisor}`);
  };

  const handleUpdateLeadStatus = (leadId, status) => {
    setLeads(
      leads.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    showToast(`Lead marked as ${status}`);
  };

  const filteredProperties = properties.filter((p) => {
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && p.status === "Pending Review") ||
      (statusFilter === "Published" && p.status === "Published") ||
      (statusFilter === "Featured" && p.is_featured);

    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.builder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const pendingCount = properties.filter((p) => p.status === "Pending Review").length;
  const publishedCount = properties.filter((p) => p.status === "Published").length;
  const featuredCount = properties.filter((p) => p.is_featured).length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Top Admin Header Bar */}
      <section className="bg-[#0b1120] pt-28 pb-8 border-b border-slate-800">
        <div className="w-[96%] max-w-[1340px] mx-auto">
          {/* Header Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Nirvana Space Admin Console
                </span>
                <span className="text-xs text-slate-400 font-mono">v2.4 Production</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>Platform Moderation &amp; Control Center</span>
                <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                  Super Admin
                </span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Audit builder submissions, verify Gujarat RERA numbers, supervise buyer lead queues, and manage platform listings.
              </p>
            </div>

            {/* Quick Portal Switch */}
            <div className="flex items-center gap-3">
              <Link
                href="/seller"
                className="rounded-full bg-[#a98440] hover:bg-[#977232] px-4.5 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <span>🏢</span> Switch to Builder Portal
              </Link>
              <Link
                href="/residential"
                className="rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition"
              >
                View Live Site ➔
              </Link>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="mt-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 p-3 text-xs sm:text-sm font-semibold text-emerald-300 flex items-center justify-between shadow-lg animate-in fade-in duration-300">
              <span>{notification}</span>
              <button
                onClick={() => setNotification("")}
                className="text-emerald-400 hover:text-white font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Platform Metrics Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Live Projects
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-emerald-400">
                {publishedCount}
              </p>
              <span className="mt-1 inline-block text-[11px] text-slate-400">
                Active on search
              </span>
            </div>

            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 shadow-xs">
              <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                Pending Verification
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-amber-400">
                {pendingCount}
              </p>
              <span className="mt-1 inline-block text-[11px] text-amber-300 font-medium">
                Requires RERA Check
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Featured Projects
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-[#e6c278]">
                {featuredCount}
              </p>
              <span className="mt-1 inline-block text-[11px] text-slate-400">
                Homepage Hero slots
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Total Buyer Leads
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-blue-400">
                {leads.length}
              </p>
              <span className="mt-1 inline-block text-[11px] text-slate-400">
                100% Assigned to Desk
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Verified Developers
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-purple-400">
                {builders.length}
              </p>
              <span className="mt-1 inline-block text-[11px] text-slate-400">
                AUDA Certified
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("listings")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === "listings"
                  ? "border-[#a98440] text-[#e6c278]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <span>🏛️</span> Listings Moderation ({properties.length})
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-500 text-slate-950 px-1.5 py-0.2 text-[10px] font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === "leads"
                  ? "border-[#a98440] text-[#e6c278]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <span>📩</span> Lead Queue &amp; Visits ({leads.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("builders")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === "builders"
                  ? "border-[#a98440] text-[#e6c278]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <span>🏗️</span> Partner Developers ({builders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === "settings"
                  ? "border-[#a98440] text-[#e6c278]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <span>⚙️</span> Portal Engine Settings
            </button>
          </div>
        </div>
      </section>

      {/* Tab 1: Listings Moderation & Verification */}
      {activeTab === "listings" && (
        <section className="w-[96%] max-w-[1340px] mx-auto py-8 flex-1">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400">Filter Listings:</span>
              {["All", "Pending", "Published", "Featured"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                    statusFilter === filter
                      ? "bg-[#a98440] text-white shadow-sm"
                      : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project title or builder..."
                className="h-9 w-64 rounded-full border border-slate-700 bg-slate-900 px-3.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#a98440]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Project &amp; Developer</th>
                    <th className="py-3 px-4">Category &amp; Specs</th>
                    <th className="py-3 px-4">Pricing</th>
                    <th className="py-3 px-4">RERA Compliance</th>
                    <th className="py-3 px-4">Publication Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-bold text-white text-sm">{prop.title}</p>
                            <p className="text-xs text-[#e6c278] font-medium">{prop.builder}</p>
                            <p className="text-[11px] text-slate-400">📍 {prop.location}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300">
                          {prop.category}
                        </span>
                        <p className="mt-1 text-xs text-slate-400">{prop.property_type}</p>
                        <p className="text-[11px] text-slate-500">{prop.area_sqft} sq.ft.</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{formatPrice(prop.price)}</p>
                        <p className="text-[11px] text-slate-400">
                          Submitted: {prop.submitted_date}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                            prop.rera_status === "Verified"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}
                        >
                          {prop.rera_status === "Verified" ? "✓ RERA Verified" : "⏳ Pending Check"}
                        </span>
                        <p className="mt-1 font-mono text-[10px] text-slate-400">
                          {prop.rera_number}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              prop.status === "Published"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {prop.status}
                          </span>
                          {prop.is_featured && (
                            <span className="block text-[10px] font-bold text-[#e6c278]">
                              ★ Featured on Home
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {prop.status === "Pending Review" && (
                            <button
                              type="button"
                              onClick={() => handleApproveProperty(prop.id)}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-bold transition shadow-xs cursor-pointer"
                              title="Verify RERA and publish live"
                            >
                              ✓ Approve
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(prop.id)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer border ${
                              prop.is_featured
                                ? "border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            {prop.is_featured ? "★ Featured" : "+ Feature"}
                          </button>

                          <Link
                            href={`/residential?search=${encodeURIComponent(prop.title)}`}
                            className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 text-xs font-semibold transition"
                          >
                            Preview
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteProperty(prop.id, prop.title)}
                            className="rounded-lg border border-red-800 bg-red-950/60 hover:bg-red-900 text-red-300 px-2 py-1 text-xs font-bold transition cursor-pointer"
                            title="Remove listing"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Buyer Leads Queue */}
      {activeTab === "leads" && (
        <section className="w-[96%] max-w-[1340px] mx-auto py-8 flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Central Lead &amp; Visit Distribution</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-intent buyer leads from all site visit forms across Ahmedabad &amp; GIFT City.
                </p>
              </div>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
                Real-time CRM Sync Active
              </span>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Buyer Details</th>
                    <th className="py-3 px-4">Requested Project</th>
                    <th className="py-3 px-4">Inquiry Type &amp; Slot</th>
                    <th className="py-3 px-4">Assigned Advisor</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{lead.name}</p>
                        <p className="text-slate-400 text-xs">{lead.phone}</p>
                        <p className="text-slate-500 text-[11px]">{lead.email}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{lead.property}</p>
                        <p className="text-xs text-[#e6c278]">{lead.builder}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="rounded bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-xs text-blue-300 font-semibold">
                          {lead.type}
                        </span>
                        <p className="mt-1 text-xs text-slate-400">{lead.preferred_slot}</p>
                        <p className="text-[10px] text-slate-500">{lead.date}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.assigned_advisor}
                          onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                          className="h-8 rounded-lg border border-slate-700 bg-slate-800 px-2 text-xs font-semibold text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="Raj Patel">Raj Patel (Senior)</option>
                          <option value="Vikram Mehta">Vikram Mehta (Commercial)</option>
                          <option value="Priya Sharma">Priya Sharma (NRI Desk)</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            lead.status === "Scheduled"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : lead.status === "New"
                              ? "bg-amber-500/20 text-amber-300"
                              : lead.status === "Converted"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="h-8 rounded-lg border border-slate-700 bg-slate-800 px-2 text-xs font-semibold text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="New">Mark New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
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

      {/* Tab 3: Partner Developers Directory */}
      {activeTab === "builders" && (
        <section className="w-[96%] max-w-[1340px] mx-auto py-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {builders.map((bld) => (
              <div
                key={bld.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{bld.name}</span>
                      <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        ✓ RERA Verified
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Established {bld.founded} • AUDA Certified Developer</p>
                  </div>
                  <span className="rounded-full bg-[#a98440]/20 text-[#e6c278] px-2.5 py-1 text-xs font-bold">
                    ★ {bld.rating} Rating
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-slate-800 py-3 text-center text-xs">
                  <div>
                    <p className="text-slate-400">Delivered</p>
                    <p className="font-bold text-white mt-0.5">{bld.completed_projects} Projects</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Active Listings</p>
                    <p className="font-bold text-emerald-400 mt-0.5">{bld.active_listings} Live</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Compliance</p>
                    <p className="font-bold text-blue-400 mt-0.5">100% Clear</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Contact: <strong className="text-slate-200">{bld.contact_person}</strong></span>
                  <a href={`tel:${bld.phone}`} className="text-[#e6c278] hover:underline font-semibold">
                    {bld.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 4: System Settings */}
      {activeTab === "settings" && (
        <section className="w-[96%] max-w-[1000px] mx-auto py-8 flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Platform Settings &amp; Legal Policies</h2>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-sm">Strict RERA Gatekeeping</p>
                  <p className="text-slate-400 mt-0.5">Require manual admin verification of Gujarat RERA before public listing.</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 font-bold text-xs">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-sm">Instant Lead WhatsApp Dispatch</p>
                  <p className="text-slate-400 mt-0.5">Automatically ping assigned advisors when a user books a free site visit.</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 font-bold text-xs">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-bold text-white text-sm">Lead Privacy Protection</p>
                  <p className="text-slate-400 mt-0.5">Mask buyer mobile numbers until advisor claims the lead.</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 font-bold text-xs">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
