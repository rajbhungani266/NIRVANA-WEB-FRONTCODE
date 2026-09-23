"use client";

import { useState } from "react";

export default function EMICalculator({ initialPrice = 12000000 }) {
  const numPrice = Number(initialPrice) || 12000000;
  const defaultLoan = Math.round(numPrice * 0.8);
  const minLoan = Math.min(1000000, Math.round(defaultLoan * 0.2));
  const maxLoan = Math.max(50000000, Math.round(defaultLoan * 1.5));

  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} Lac`;
    return `₹ ${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#a98440]/10 text-xl text-[#a98440]">
          🧮
        </div>
        <div>
          <h3 className="heading-display text-xl font-bold text-slate-900">
            Home Loan & EMI Estimator
          </h3>
          <p className="text-xs text-slate-500">
            Estimate monthly outflows with competitive housing loan rates.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
        {/* Sliders */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Loan Amount</span>
              <span className="text-sm font-bold text-[#a98440]">{formatCurrency(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={minLoan}
              max={maxLoan}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#a98440] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{formatCurrency(minLoan)}</span>
              <span>{formatCurrency(maxLoan)}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Interest Rate (% per annum)</span>
              <span className="text-sm font-bold text-[#a98440]">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={7.0}
              max={12.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#a98440] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>7.0% (Prime)</span>
              <span>12.0%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Loan Tenure</span>
              <span className="text-sm font-bold text-[#a98440]">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#a98440] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Estimated Monthly EMI
            </span>
            <div className="heading-display mt-2 text-3xl font-black text-[#e2b764]">
              ₹ {emi.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-white/70"> / month</span>
            </div>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
            <div className="flex justify-between text-white/70">
              <span>Principal Amount:</span>
              <span className="font-semibold text-white">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Total Interest Payable:</span>
              <span className="font-semibold text-white">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Total Repayment:</span>
              <span className="font-semibold text-white">{formatCurrency(totalPayment)}</span>
            </div>
          </div>

          <a
            href="https://wa.me/917984430082?text=Hello%20Nirvana%20Space,%20I%20would%20like%20to%20check%20home%20loan%20pre-approval%20eligibility"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#a98440] hover:bg-[#977232] py-3 text-xs font-bold text-white shadow-md transition active:scale-95"
          >
            Check Loan Pre-Approval
          </a>
        </div>
      </div>
    </div>
  );
}
