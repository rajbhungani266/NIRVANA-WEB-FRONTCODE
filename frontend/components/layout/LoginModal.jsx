"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginModal({ isOpen, onClose }) {
  const [authMethod, setAuthMethod] = useState("phone"); // "phone" | "email"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userState, setUserState] = useState(null); // null | { name, identifier }

  if (!isOpen) return null;

  function handleSendOtp(e) {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserState({ name: "User", identifier: phone });
      setTimeout(() => {
        onClose();
        setOtpSent(false);
        setPhone("");
        setOtp("");
      }, 1000);
    }, 600);
  }

  function handleEmailLogin(e) {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserState({ name: email.split("@")[0], identifier: email });
      setTimeout(() => {
        onClose();
        setEmail("");
      }, 1000);
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8a682b] via-[#a98440] to-[#c79c52]" />

        {/* Modal Header */}
        <div className="p-6 pb-4 sm:p-7 sm:pb-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-[#fbf7ee] border border-[#e2d1b3] px-3 py-0.5 text-[11px] font-semibold text-[#a98440] uppercase tracking-wider">
                Nirvana Space
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
                {userState ? "Welcome Back!" : "Login / Register"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {userState
                  ? `Successfully logged in as ${userState.identifier}`
                  : "Access your saved properties, site visits & verified quotes"}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {!userState && (
            <>
              {/* Method Switcher */}
              <div className="mt-5 flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("phone");
                    setOtpSent(false);
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
                    authMethod === "phone"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Mobile (OTP)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("email")}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
                    authMethod === "email"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Mobile OTP Form */}
              {authMethod === "phone" && (
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="mt-5 space-y-4">
                  {!otpSent ? (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-[#a98440] focus-within:ring-2 focus-within:ring-[#a98440]/20 transition">
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 pr-2.5 border-r border-slate-200">
                          <span>🇮🇳</span> +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="Enter 10 digit mobile"
                          required
                          className="w-full bg-transparent pl-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-slate-700">
                          Enter 4-Digit OTP sent to +91 {phone}
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[11px] font-medium text-[#a98440] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP (e.g. 1234)"
                        required
                        autoFocus
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-center text-lg font-bold tracking-widest text-slate-900 outline-none focus:border-[#a98440] focus:ring-2 focus:ring-[#a98440]/20 transition"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? "Please wait..." : otpSent ? "Verify & Login" : "Continue with OTP"}
                  </button>
                </form>
              )}

              {/* Email Form */}
              {authMethod === "email" && (
                <form onSubmit={handleEmailLogin} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#a98440] focus:ring-2 focus:ring-[#a98440]/20 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#a98440] hover:bg-[#977232] py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? "Signing in..." : "Continue with Email"}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">Or</span>
                </div>
              </div>

              {/* Google One-Click Button */}
              <button
                type="button"
                onClick={() => {
                  setUserState({ name: "Google User", identifier: "user@gmail.com" });
                  setTimeout(() => onClose(), 1000);
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-2xs cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Partner Portals Shortcut */}
              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-center">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Partner &amp; Internal Portals
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Link
                    href="/seller"
                    onClick={onClose}
                    className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 hover:text-[#a98440] hover:border-[#a98440] transition shadow-2xs flex items-center gap-1.5"
                  >
                    <span>🏢</span> Builder Portal
                  </Link>
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-bold text-slate-100 hover:bg-slate-800 transition shadow-2xs flex items-center gap-1.5"
                  >
                    <span>🛡️</span> Admin Console
                  </Link>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-4 text-center text-[11px] text-slate-400 leading-relaxed">
                By continuing, you agree to Nirvana Space’s{" "}
                <span className="text-slate-600 underline cursor-pointer">Terms of Service</span> &{" "}
                <span className="text-slate-600 underline cursor-pointer">Privacy Policy</span>.
              </p>
            </>
          )}

          {userState && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xl font-bold">
                ✓
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                You’re all set! Redirecting...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
