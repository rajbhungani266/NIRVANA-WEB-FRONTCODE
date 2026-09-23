import Link from "next/link";
import { ShieldCheck, Tag, Users, Lock, PhoneCall } from "lucide-react";

export const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "RERA Verified", note: "100% Compliant Projects" },
  { icon: Tag, title: "Zero Brokerage", note: "Direct from Builders" },
  { icon: Users, title: "Expert Guidance", note: "From Industry Experts" },
  { icon: Lock, title: "Secure & Transparent", note: "Trusted by 10,000+ Customers" },
  { icon: PhoneCall, title: "Quick Assistance", note: "Call us: 1800 41 99099" },
];

export function ColumnHeading({ icon: Icon, children }) {
  return (
    <div className="group flex items-center gap-2 text-[13px] font-bold text-slate-900 cursor-default">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#a98440]/10 text-[#a98440]">
        <Icon className="h-3 w-3" />
      </span>
      <span>{children}</span>
    </div>
  );
}

export function MenuLink({ item, onClose }) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="group flex items-center justify-between text-xs text-slate-600 transition-colors duration-150 hover:text-[#a98440] py-0.5"
    >
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-[#a98440]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function TrustBar() {
  return (
    <div className="mt-2.5 border-t border-slate-100 pt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-slate-700">
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-1.5 py-0.5 px-1"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-[#a98440]">
            <item.icon className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold text-slate-900 truncate leading-tight">
              {item.title}
            </p>
            <p className="text-[9px] text-slate-400 truncate leading-tight">{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
