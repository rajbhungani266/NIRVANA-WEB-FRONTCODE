"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, User, Menu, X, ChevronDown, ChevronUp, Home, Square, TrendingUp, MapPin } from "lucide-react";
import BuyMegaMenu from "./BuyMegaMenu";
import SellMegaMenu from "./SellMegaMenu";
import RentMegaMenu from "./RentMegaMenu";
import InvestmentMegaMenu from "./InvestmentMegaMenu";
import PlotsMegaMenu from "./PlotsMegaMenu";
import GiftCityMegaMenu from "./GiftCityMegaMenu";
import VastuCalculatorModal from "../tools/VastuCalculatorModal";
import AISearchModal from "../tools/AISearchModal";
import LoginModal from "./LoginModal";
import PostPropertyModal from "../property/PostPropertyModal";

// Matches Image 1: Buy, Sell, Rent, Investment, Plots, Gift City (Logo acts as Home)
const TOP_NAV_LINKS = [
  { label: "Buy", href: "/residential" },
  { label: "Sell", href: "/post-property" },
  { label: "Rent", href: "/rent" },
  { label: "Investment", href: "/investment" },
  { label: "Plots", href: "/plot-weekend-villa" },
  { label: "Gift City", href: "/gift-city" },
];

const MEGA_MENUS = {
  Buy: BuyMegaMenu,
  Sell: SellMegaMenu,
  Rent: RentMegaMenu,
  Investment: InvestmentMegaMenu,
  Plots: PlotsMegaMenu,
  "Gift City": GiftCityMegaMenu,
};

export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isVastuOpen, setIsVastuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState("Residential");

  const navRef = useRef(null);

  const closeMenu = () => setOpenMenu(null);
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  }

  // Handle scroll effect: hide on scroll down, immediately show on scroll up, and style switch
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled styling state (glass/dark background vs white background)
      setIsScrolled(currentScrollY > 30);

      // Top of page: always visible
      if (currentScrollY <= 50) {
        setIsVisible(true);
      } else {
        const delta = currentScrollY - lastScrollY;
        // Scrolling UP with threshold
        if (delta < -5) {
          setIsVisible(true);
        } 
        // Scrolling DOWN with threshold
        else if (delta > 5 && currentScrollY > 100) {
          setIsVisible(false);
          setOpenMenu(null);
        }
      }

      lastScrollY = Math.max(0, currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click + Escape key
  useEffect(() => {
    if (!openMenu) return;

    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openMenu]);

  const ActiveMegaMenu = openMenu ? MEGA_MENUS[openMenu] : null;

  // Render navigation item based on current scroll state
  function renderNavItem(link, { compact = false } = {}) {
    // Only mark active when its mega menu is currently opened
    const isOpen = openMenu === link.label;
    const isCurrentActive = isOpen;
    const isMegaMenu = Boolean(MEGA_MENUS[link.label]);

    let activeClass = "";

    if (!isScrolled) {
      // Top State: Gold pill when active or on hover, clean text by default
      if (isCurrentActive) {
        activeClass = compact
          ? "rounded-full bg-[#a98440] px-4 py-1 font-semibold text-white shadow-md"
          : "rounded-full bg-[#a98440] px-5 py-1.5 font-semibold text-white shadow-[0_4px_14px_rgba(169,132,64,0.32)] scale-[1.03]";
      } else {
        activeClass = compact
          ? "rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 font-medium text-slate-800 hover:bg-[#a98440] hover:text-white hover:border-[#a98440] hover:shadow-sm transition-all duration-200 ease-out active:scale-95"
          : "rounded-full px-5 py-1.5 font-medium text-slate-700 hover:bg-[#a98440] hover:text-white hover:shadow-[0_4px_14px_rgba(169,132,64,0.32)] hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-250 ease-out active:scale-95";
      }
    } else {
      // Scrolled State: White pill when active, gold pill on hover
      if (isCurrentActive) {
        activeClass = compact
          ? "rounded-full bg-white px-4 py-1 font-semibold text-slate-900 shadow-md"
          : "rounded-full bg-white px-4.5 py-1.5 font-semibold text-slate-900 shadow-md";
      } else {
        activeClass = compact
          ? "rounded-full bg-white/15 px-3.5 py-1 text-white font-medium hover:bg-[#a98440] hover:text-white transition-all duration-200 ease-out"
          : "rounded-full px-4.5 py-1.5 text-white/90 font-medium hover:bg-[#a98440] hover:text-white hover:shadow-[0_4px_14px_rgba(169,132,64,0.4)] hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-250 ease-out active:scale-95";
      }
    }

    // Mega menu trigger
    if (isMegaMenu) {
      return (
        <button
          key={link.href}
          type="button"
          onClick={() =>
            setOpenMenu((current) => (current === link.label ? null : link.label))
          }
          aria-expanded={isOpen}
          className={`${activeClass} flex shrink-0 items-center whitespace-nowrap text-sm cursor-pointer outline-none focus:outline-none focus:ring-0`}
        >
          {link.label}
        </button>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        className={`${activeClass} shrink-0 whitespace-nowrap text-sm`}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transform transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full shadow-none pointer-events-none"
        } ${
          isScrolled
            ? "glass-nav-scrolled py-1 shadow-xl"
            : "bg-white border-b border-slate-200/80 py-1.5 shadow-sm"
        }`}
        ref={navRef}
      >
        {/* Universal responsive container: Aligns Logo, links and action buttons across all screen sizes */}
        <div className="mx-auto flex h-[54px] sm:h-[62px] w-full max-w-[1520px] 2xl:max-w-[1620px] items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* 1. Left: Official Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group py-0.5">
              <img
                src={isScrolled ? "/images/logo-dark.png" : "/images/logo-transparent.png"}
                alt="Nirvana Space - Built on Trust. Driven by Loyalty."
                className="h-10 sm:h-11 md:h-12 lg:h-[52px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
              />
            </Link>
          </div>

          {/* 2. Center: Desktop Navigation Links */}
          <nav
            className={`hidden items-center text-sm transition-all duration-300 lg:flex ${
              isScrolled ? "rounded-full p-1 text-white glass-nav gap-1" : "gap-2"
            }`}
          >
            {TOP_NAV_LINKS.map((link) => renderNavItem(link))}
          </nav>

          {/* 3. Right: Action Buttons (No emojis, matching Image 1) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop Action Buttons */}
            <div className="hidden items-center gap-2.5 lg:flex">
            {/* Post Property Button */}
            <button
              onClick={() => setIsPostPropertyOpen(true)}
              className={`transition-all duration-300 cursor-pointer flex items-center ${
                isScrolled
                  ? "pill-btn px-4 py-1.5 text-xs font-semibold text-slate-800 hover:text-[#a98440]"
                  : "rounded-full bg-[#0d1520] px-4.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-900 active:scale-95"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1.5 text-[#a98440]" />
              <span>Post Property</span>
            </button>

            {/* Login Button */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className={`transition-all duration-300 cursor-pointer flex items-center ${
                isScrolled
                  ? "rounded-full bg-[#a98440] hover:bg-[#977232] px-4.5 py-1.5 text-xs font-bold text-white shadow-md active:scale-95"
                  : "rounded-full bg-[#a98440] hover:bg-[#977232] px-5 py-2 text-xs font-semibold text-white shadow-sm active:scale-95"
              }`}
            >
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>Login</span>
            </button>
            </div>
            
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="bg-slate-100 p-1.5 rounded-md lg:hidden text-slate-700 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        

        {/* Mega-menu Dimmed Backdrop Overlay */}
        {ActiveMegaMenu && (
          <div
            className="fixed inset-0 top-[54px] sm:top-[62px] z-40 bg-slate-950/20 backdrop-blur-[2px] animate-mega-backdrop cursor-pointer"
            onClick={closeMenu}
          />
        )}

        {/* Mega-menu Floating Animated Panel */}
        {ActiveMegaMenu && (
          <div
            key={openMenu}
            className="panel-drop-animation absolute left-0 top-full z-50 w-full px-[4%] pt-2.5 pointer-events-auto"
          >
            <div className="mx-auto max-w-[1520px] 2xl:max-w-[1620px]">
              <ActiveMegaMenu onClose={closeMenu} />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[110] w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <img src="/images/logo.png" alt="Nirvana Space" className="h-8 sm:h-9 w-auto object-contain" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-[#f8fafc] p-2 sm:p-2.5 text-[#0f172a] transition hover:bg-slate-100">
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {/* Residential Accordion */}
              <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <button onClick={() => setMobileAccordion(mobileAccordion === 'Residential' ? '' : 'Residential')} className="flex w-full items-center justify-between p-4 font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-[#a98440]" fill="#a98440" />
                    Residential
                  </div>
                  {mobileAccordion === 'Residential' ? <ChevronUp className="h-4 w-4 text-[#a98440]" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {mobileAccordion === 'Residential' && (
                  <div className="border-t border-slate-100 bg-white px-5 py-4">
                    <ul className="space-y-4 text-[13px] font-medium text-slate-600">
                      <li><Link href="/residential?property_type=flat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> Apartments / Flats</Link></li>
                      <li><Link href="/residential?property_type=bungalow" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Home className="h-4 w-4 text-slate-500" fill="currentColor" /> Independent House</Link></li>
                      <li><Link href="/residential?property_type=villa" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Home className="h-4 w-4 text-slate-500" fill="currentColor" /> Villas & Penthouses</Link></li>
                      <li><Link href="/plot-weekend-villa?property_type=plot" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><MapPin className="h-4 w-4 text-slate-500" fill="currentColor" /> Residential Plots</Link></li>
                      <li><Link href="/residential" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> Builder Floors</Link></li>
                      <li><Link href="/residential" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Gated Communities</Link></li>
                      
                      <li className="pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">BY BHK</li>
                      <li><Link href="/residential?bedrooms=1" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> 1 BHK Apartments</Link></li>
                      <li><Link href="/residential?bedrooms=2" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> 2 BHK Apartments</Link></li>
                      <li><Link href="/residential?bedrooms=3" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> 3 BHK Apartments</Link></li>
                      <li><Link href="/residential?bedrooms__gte=4" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> 4+ BHK Luxury Homes</Link></li>
                      
                      <li className="pt-4"><Link href="/residential" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-[#0284c7] hover:underline">View all Residential &rarr;</Link></li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Commercial Accordion */}
              <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <button onClick={() => setMobileAccordion(mobileAccordion === 'Commercial' ? '' : 'Commercial')} className="flex w-full items-center justify-between p-4 font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <Square className="h-5 w-5 text-slate-800" fill="currentColor" />
                    Commercial
                  </div>
                  {mobileAccordion === 'Commercial' ? <ChevronUp className="h-4 w-4 text-[#a98440]" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {mobileAccordion === 'Commercial' && (
                  <div className="border-t border-slate-100 bg-white px-5 py-4">
                    <ul className="space-y-4 text-[13px] font-medium text-slate-600">
                      <li><Link href="/commercial?commercial_type=office" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> Office Spaces</Link></li>
                      <li><Link href="/commercial?commercial_type=shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> Retail Shops</Link></li>
                      <li><Link href="/commercial?commercial_type=showroom" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> Showrooms</Link></li>
                      <li><Link href="/commercial" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><Square className="h-4 w-4 text-slate-500" fill="currentColor" /> Co-working Spaces</Link></li>
                      <li className="pt-4"><Link href="/commercial" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-[#0284c7] hover:underline">View all Commercial &rarr;</Link></li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Investment Accordion */}
              <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <button onClick={() => setMobileAccordion(mobileAccordion === 'Investment' ? '' : 'Investment')} className="flex w-full items-center justify-between p-4 font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-slate-800" />
                    Investment
                  </div>
                  {mobileAccordion === 'Investment' ? <ChevronUp className="h-4 w-4 text-[#a98440]" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {mobileAccordion === 'Investment' && (
                  <div className="border-t border-slate-100 bg-white px-5 py-4">
                    <ul className="space-y-4 text-[13px] font-medium text-slate-600">
                      <li><Link href="/investment?investment_type=preleased" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><TrendingUp className="h-4 w-4 text-slate-500" /> Pre-leased Properties</Link></li>
                      <li><Link href="/investment" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><TrendingUp className="h-4 w-4 text-slate-500" /> Fractional Ownership</Link></li>
                      <li><Link href="/investment?investment_type=high_return" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><TrendingUp className="h-4 w-4 text-slate-500" /> High ROI Assets</Link></li>
                      <li className="pt-4"><Link href="/investment" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-[#0284c7] hover:underline">View all Investment &rarr;</Link></li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Top Locations Accordion */}
              <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <button onClick={() => setMobileAccordion(mobileAccordion === 'Locations' ? '' : 'Locations')} className="flex w-full items-center justify-between p-4 font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-800" fill="currentColor" />
                    Top Locations
                  </div>
                  {mobileAccordion === 'Locations' ? <ChevronUp className="h-4 w-4 text-[#a98440]" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {mobileAccordion === 'Locations' && (
                  <div className="border-t border-slate-100 bg-white px-5 py-4">
                    <ul className="space-y-4 text-[13px] font-medium text-slate-600">
                      <li><Link href="/residential?area__iexact=SG Highway" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><MapPin className="h-4 w-4 text-slate-500" fill="currentColor" /> SG Highway</Link></li>
                      <li><Link href="/residential?area__iexact=Sindhi Bhavan Road" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><MapPin className="h-4 w-4 text-slate-500" fill="currentColor" /> Sindhu Bhavan Road</Link></li>
                      <li><Link href="/residential?area__iexact=Science City" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><MapPin className="h-4 w-4 text-slate-500" fill="currentColor" /> Science City</Link></li>
                      <li><Link href="/gift-city" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#a98440] transition"><MapPin className="h-4 w-4 text-slate-500" fill="currentColor" /> Gift City</Link></li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Promotional Card - Matches Figma */}
              <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 mb-3">
                  ★ FEATURED OPPORTUNITY
                </span>
                <h4 className="text-base font-bold text-slate-900">Premium Office Tower</h4>
                <p className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Iscon Ambli Road, Ahmedabad
                </p>
                
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Grade A</span>
                  <span className="rounded bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">Pre-Leased</span>
                  <span className="rounded bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-700">High ROI</span>
                </div>
                
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img src="/images/first.jpg" alt="Premium Office Tower" className="h-[140px] w-full object-cover" />
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-[9px] text-slate-500">Rental Yield</p>
                    <p className="text-xs font-bold text-emerald-600">8.2%*</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-[9px] text-slate-500">ROI Potential</p>
                    <p className="text-xs font-bold text-emerald-600">14%*</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-[9px] text-slate-500">Score</p>
                    <p className="text-xs font-bold text-amber-500">★ 9.6/10</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500">Starts from</p>
                    <p className="text-sm font-extrabold text-slate-900">₹91.52 Lac.</p>
                  </div>
                </div>
                
                <Link
                  href="/commercial"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#0f172a] py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  View Project Details
                </Link>
              </div>

              {/* Post Property Card */}
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <h4 className="text-sm font-bold text-slate-900">Want to sell or rent your property?</h4>
                <p className="mt-1 text-[11px] text-slate-500">List your property with Nirvana Spaces and reach thousands of verified buyers.</p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPostPropertyOpen(true);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#a98440] hover:bg-[#977232] py-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post Property
                </button>
              </div>

              {/* Trust Badges Footer */}
              <div className="mt-8 space-y-4 pb-6 px-1">
                <div className="flex gap-3 items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">RERA Verified</p>
                    <p className="text-[10px] text-slate-500">100% Legit Projects</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zero Brokerage</p>
                    <p className="text-[10px] text-slate-500">Direct from Builders</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Expert Guidance</p>
                    <p className="text-[10px] text-slate-500">From Industry Experts</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Secure & Transparent</p>
                    <p className="text-[10px] text-slate-500">Trusted by 10,000+ Customers</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Quick Assistance</p>
                    <p className="text-[10px] text-slate-500">Call us: 1800-41 99099</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <PostPropertyModal
        isOpen={isPostPropertyOpen}
        onClose={() => setIsPostPropertyOpen(false)}
      />
      <VastuCalculatorModal
        isOpen={isVastuOpen}
        onClose={() => setIsVastuOpen(false)}
      />
      <AISearchModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}
