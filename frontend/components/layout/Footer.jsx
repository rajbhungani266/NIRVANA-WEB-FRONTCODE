import Link from "next/link";
import { PhoneCall, Mail, MapPin, Building2, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#090d16] pb-24 pt-16 text-white md:pb-16 border-t border-white/10">
      <div className="container-box">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block group">
              <img
                src="/images/logo-dark.png"
                alt="Nirvana Space - Built on Trust. Driven by Loyalty."
                className="h-18 sm:h-22 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Nirvana Space is Ahmedabad&apos;s premier real estate advisory platform, bridging discerning homebuyers, NRI investors, and high-growth commercial developments with total transparency.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-white/70">
              <p className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#e6c278] border border-white/10">
                  <PhoneCall className="h-3.5 w-3.5" />
                </span>
                <span>Advisory Desk: +91 79844 30082</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#e6c278] border border-white/10">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span>feedback@nirvanaspace.com</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#e6c278] border border-white/10">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span>Sindhubhavan Road & Iscon Ambli Road, Ahmedabad</span>
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6c278] hover:text-slate-900 transition-colors text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6c278] hover:text-slate-900 transition-colors text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6c278] hover:text-slate-900 transition-colors text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6c278] hover:text-slate-900 transition-colors text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6c278] hover:text-slate-900 transition-colors text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33zM9.75 15.02V8.48l5.83 3.27-5.83 3.27z"/></svg>
              </a>
            </div>
          </div>

          {/* Link Columns Wrapper */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e6c278]">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/residential" className="hover:text-white transition">Residential Properties</Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-white transition">Commercial Spaces</Link>
              </li>
              <li>
                <Link href="/investment" className="hover:text-white transition">High-Yield Investment</Link>
              </li>
              <li>
                <Link href="/gift-city" className="hover:text-white transition">GIFT City SEZ Hub</Link>
              </li>
              <li>
                <Link href="/plot-weekend-villa" className="hover:text-white transition">Plots & Weekend Villas</Link>
              </li>
            </ul>
          </div>

          {/* Popular Search Localities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e6c278]">
              Top Localities
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li>
                <Link href="/residential?search=Shela" className="hover:text-white transition">Shela & South Bopal</Link>
              </li>
              <li>
                <Link href="/residential?search=Iscon+Ambli" className="hover:text-white transition">Iscon Ambli Road</Link>
              </li>
              <li>
                <Link href="/commercial?search=Sindhubhavan" className="hover:text-white transition">Sindhu Bhavan Road</Link>
              </li>
              <li>
                <Link href="/gift-city" className="hover:text-white transition">GIFT City IFSC</Link>
              </li>
              <li>
                <Link href="/residential?search=Science+City" className="hover:text-white transition">Science City & Sola</Link>
              </li>
              <li>
                <Link href="/residential?search=Bodakdev" className="hover:text-white transition">Bodakdev & Judges</Link>
              </li>
            </ul>
          </div>

          {/* Services & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e6c278]">
              Services & Tools
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li>
                <Link href="/post-property" className="hover:text-white transition">List Your Property</Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-white transition text-[#e6c278] flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Builder / Seller Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Console</span>
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">Vastu Consultation</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">NRI Real Estate Desk</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">Home Loan & EMI Advisory</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">Legal Title Verification</span>
              </li>
            </ul>
          </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} Nirvana Space (NS). All rights reserved. RERA Certified Advisory Partner.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">RERA Disclaimer</span>
            <span className="hover:text-white transition cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}