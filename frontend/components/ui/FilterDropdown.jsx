"use client";

import React, { useState, useRef, useEffect } from "react";

export default function FilterDropdown({ value, onChange, options = [], defaultLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Close when pressing Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const isSelected = Boolean(value && selectedOption);
  const displayLabel = isSelected ? selectedOption.label : defaultLabel;

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs transition-all duration-200 cursor-pointer select-none shadow-xs ${
          isSelected
            ? "border-[#a98440] bg-[#a98440]/10 text-[#a98440] font-semibold hover:bg-[#a98440]/15"
            : isOpen
            ? "border-[#a98440] bg-white text-slate-900 shadow-sm"
            : "border-slate-200/90 bg-white text-slate-700 font-normal hover:border-slate-300 hover:bg-slate-50/80"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="whitespace-nowrap">{displayLabel}</span>

        {isSelected && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setIsOpen(false);
            }}
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-[#a98440]/20 text-[#a98440] transition-colors text-[10px] leading-none ml-0.5"
            title="Clear filter"
          >
            ✕
          </span>
        )}

        <svg
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#a98440]" : isSelected ? "text-[#a98440]" : "text-slate-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Beautiful Luxury Dropdown Menu */}
      {isOpen && (
        <div
          className="panel-drop-animation absolute left-0 top-[calc(100%+6px)] z-50 min-w-[170px] max-w-[260px] w-max rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
          role="listbox"
        >
          {defaultLabel && (
            <div className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              {defaultLabel}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
            {/* Reset / All option */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                !value
                  ? "bg-[#a98440]/10 font-bold text-[#a98440]"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <span>All {defaultLabel || "Options"}</span>
              {!value && (
                <svg className="h-3.5 w-3.5 text-[#a98440] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {options.map((option) => {
              const active = String(option.value) === String(value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    active
                      ? "bg-[#a98440]/10 font-bold text-[#a98440]"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 font-normal"
                  }`}
                  role="option"
                  aria-selected={active}
                >
                  <span className="truncate pr-2">{option.label}</span>
                  {active && (
                    <svg className="h-3.5 w-3.5 text-[#a98440] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
