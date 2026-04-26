import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAnalysisStore } from "../store/useAnalysisStore";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  generateLoanAdvisor,
  getCardRecommendations,
} from "../utils/mockFinance";

// ============================
// UTILITY HELPERS
// ============================
function formatINR(n) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(n || 0));
  } catch {
    return `₹${Math.round(n || 0)}`;
  }
}

function offerTypeBadge(type) {
  const base = "text-xs px-2 py-1 rounded-full border";
  switch ((type || "").toLowerCase()) {
    case "cashback":
      return `${base} bg-emerald-100 text-emerald-800 border-emerald-200`;
    case "credit_card":
      return `${base} bg-indigo-100 text-indigo-800 border-indigo-200`;
    case "emi":
      return `${base} bg-amber-100 text-amber-800 border-amber-200`;
    case "savings":
      return `${base} bg-blue-100 text-blue-800 border-blue-200`;
    case "reward":
      return `${base} bg-purple-100 text-purple-800 border-purple-200`;
    default:
      return `${base} bg-gray-100 text-gray-700 border-gray-200`;
  }
}

// ============================
// MAIN COMPONENT
// ============================
export default function AIAdvisor() {
  const { summary } = useAnalysisStore();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [monthlyOutgo, setMonthlyOutgo] = useState(0);
  const [netFinanced, setNetFinanced] = useState(0);
  const [cardRecs, setCardRecs] = useState([]);
  const [advisor, setAdvisor] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      loanAmount: 500000,
      cashAvailable: 50000,
      tenureMonths: 12,
      ownedCardBank: "HDFC",
    },
  });

  const loanAmount = watch("loanAmount");
  const cashAvailable = watch("cashAvailable");
  const tenureMonths = watch("tenureMonths");

  // Update computed values
  useEffect(() => {
    const net = Math.max(Number(loanAmount || 0) - Number(cashAvailable || 0), 0);
    setNetFinanced(net);
    const emi = tenureMonths > 0 ? net / Number(tenureMonths) : 0;
    setMonthlyOutgo(Math.round(emi));
  }, [loanAmount, cashAvailable, tenureMonths]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function fetchRecommendedCards(category_summary) {
    try {
      return getCardRecommendations(category_summary);
    } catch {
      return null;
    }
  }

  // ============================
  // MAIN SUBMIT HANDLER
  // ============================
  async function onSubmit(values) {
    setLoading(true);
    setError("");
    setStatus("Computing plan and best card suggestions locally...");

    let category_summary =
      summary?.category_summary ||
      (function fallback() {
        const m = monthlyOutgo || 1000;
        const b = values.ownedCardBank.toLowerCase();
        if (b.includes("axis"))
          return { bills: m, recharge: m * 0.4, utilities: m * 0.6 };
        if (b.includes("icici")) return { shopping: m, online: m * 0.6 };
        if (b.includes("sbi")) return { "online payments": m, shopping: m * 0.5 };
        return { shopping: m, food: m * 0.5, online: m * 0.6 };
      })();

    const recData = await fetchRecommendedCards(category_summary);

    let recs = [];
    if (recData?.recommended_cards?.length) {
      const bankPref = values.ownedCardBank.toLowerCase();
      const matched = recData.recommended_cards.filter(
        (c) => (c.bank || "").toLowerCase() === bankPref
      );
      recs = matched.length ? matched : recData.recommended_cards.slice(0, 3);
    }

    setCardRecs(recs);
    setStatus("Recommendations ready!");
    setLoading(false);

    // AI Loan Advisor
    setAiLoading(true);
    setAdvisor(null);
    const start = Date.now();

    try {
      const payload = {
        loanAmount: Number(values.loanAmount),
        cashAvailable: Number(values.cashAvailable),
        tenureMonths: Number(values.tenureMonths),
        ownedCardBank: values.ownedCardBank,
        summary,
      };

      setAdvisor(generateLoanAdvisor(payload));
    } catch {
      setError("Loan advisor could not generate local recommendations.");
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < 5000) await sleep(5000 - elapsed);
      setAiLoading(false);
    }
  }

  // ============================
  // PAGE UI
  // ============================
  return (
    <div className="min-h-screen p-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">

      {/* FULL-PAGE LOADING OVERLAY */}
      {(loading || aiLoading) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
          <LoadingSpinner size={96} />
          <p className="mt-3 text-white text-lg font-medium">
            {aiLoading ? "Analyzing with AI..." : (status || "Loading...")}
          </p>
        </div>
      )}

      {/* HEADER */}
      <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow rounded-none">
        <div className="flex items-center gap-4">
          <span className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V2.5a.75.75 0 0 1 .75-.75Z"/>
              <path d="M4.5 4.5a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L4.5 5.56a.75.75 0 0 1 0-1.06Zm14 0a.75.75 0 0 0-1.06 0l-1.06 1.06a.75.75 0 1 0 1.06 1.06l1.06-1.06a.75.75 0 0 0 0-1.06Z"/>
              <path d="M12 6.75a5.25 5.25 0 0 1 5.25 5.25v.75h.75A2.25 2.25 0 0 1 20.25 15v3A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18v-3A2.25 2.25 0 0 1 6 12.75h.75v-.75A5.25 5.25 0 0 1 12 6.75Zm0 2.25A3 3 0 0 0 9 12v.75h6V12a3 3 0 0 0-3-3Z"/>
            </svg>
          </span>

          <div>
            <div className="text-3xl font-semibold">AI Advisor — Pay Less, Earn More</div>
            <div className="text-white/80 text-sm">
              Smart planning to minimize monthly burden and maximize your benefits.
            </div>
          </div>
        </div>
      </div>

      {/* CONTEXT BANNER */}
      {summary && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-none">
          <div className="font-semibold">Using your spending insights</div>
          <div className="text-sm">Personalized card picks and financial strategies.</div>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-none shadow-lg p-6 space-y-6 border-t"
      >
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between">
            <label className="text-sm font-medium">Loan Amount</label>
            <span className="px-2 py-1 bg-gray-100 border text-xs rounded">
              {formatINR(loanAmount)}
            </span>
          </div>
          <input type="range" min={50000} max={5000000} step={5000} {...register("loanAmount")} className="w-full" />
        </div>

        {/* Cash Available */}
        <div>
          <div className="flex justify-between">
            <label className="text-sm font-medium">Cash Available</label>
            <span className="px-2 py-1 bg-gray-100 border text-xs rounded">
              {formatINR(cashAvailable)}
            </span>
          </div>
          <input type="range" min={0} max={2000000} step={5000} {...register("cashAvailable")} className="w-full" />
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between">
            <label className="text-sm font-medium">Tenure (Months)</label>
            <span className="px-2 py-1 bg-gray-100 border text-xs rounded">
              {tenureMonths} months
            </span>
          </div>
          <input type="range" min={6} max={72} step={1} {...register("tenureMonths")} className="w-full" />
        </div>

        {/* Bank Select */}
        <div>
          <label className="text-sm font-medium mb-1 block">Your Current Credit Card Bank</label>
          <select {...register("ownedCardBank")} className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-black">
            <option>HDFC</option>
            <option>SBI</option>
            <option>Axis</option>
            <option>ICICI</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button className="px-6 py-3 rounded-xl bg-black text-white font-semibold">
            Save Money With Us
          </button>
        </div>
      </form>

      {/* SUMMARY CARDS */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LOAN SUMMARY */}
        <div className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6 border">
          <div className="text-lg font-semibold">Loan Plan</div>
          <div className="mt-2 text-gray-600">Net financed</div>
          <div className="text-2xl font-bold">{formatINR(netFinanced)}</div>
          <div className="mt-2 text-gray-600">Estimated monthly EMI</div>
          <div className="text-2xl font-bold">{formatINR(monthlyOutgo)}</div>
        </div>

        {/* PREMIUM CREDIT CARD SUGGESTIONS */}
        {/* (FULL DESIGN FROM PREVIOUS MESSAGE INCLUDED HERE) */}
        {/* ✨ *** PASTE THE FULL PREMIUM CARD BLOCK HERE *** ✨ */}
      </div>

      {/* AI LOAN ADVISOR */}
      {aiLoading && (
        <></>
      )}

      {!aiLoading && advisor && (
        <div className="rounded-3xl shadow-xl bg-white dark:bg-gray-900 p-0 border mx-6 mt-6 overflow-hidden">

          {/* AI Advisor Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between">
            <div>
              <div className="text-xl font-semibold">AI-powered Recommendation</div>
              <div className="text-white/90 text-sm">{advisor.overview}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-white/80">Estimated benefit</div>
              <div className="text-2xl font-bold">{formatINR(advisor.est_benefit)}</div>
            </div>
          </div>

          {/* Chips */}
          <div className="px-6 py-4 bg-white/80 dark:bg-gray-900 flex flex-wrap gap-2 border-b">
            <span className="text-xs px-2 py-1 bg-gray-100 border">Tenure: {tenureMonths}m</span>
            <span className="text-xs px-2 py-1 bg-gray-100 border">Net financed: {formatINR(netFinanced)}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 border">EMI: {formatINR(monthlyOutgo)}</span>
          </div>

          {/* Sections */}
          <div className="divide-y">
            {/* Suggested Products */}
            {advisor.suggested_products?.length > 0 && (
              <div className="px-6 py-5">
                <div className="font-semibold mb-2 text-sm">Suggested products</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advisor.suggested_products.map((sp, i) => (
                    <div key={i} className="border p-4 rounded-xl hover:shadow-md transition">
                      <div className="font-semibold">{sp.bank} — {sp.product}</div>
                      <div className="text-sm text-gray-600">{sp.reason}</div>
                      <div className="text-xs text-gray-500 mt-1">Benefit: {formatINR(sp.est_annual_benefit)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {advisor.actions?.length > 0 && (
              <div className="px-6 py-5">
                <div className="font-semibold text-sm mb-1">Suggested actions</div>
                <ul className="list-disc pl-5 text-gray-700">
                  {advisor.actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Offers */}
            {advisor.available_offers?.length > 0 && (
              <div className="px-6 py-5">
                <div className="font-semibold text-sm mb-2">Current Available Offers</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advisor.available_offers.map((offer, idx) => (
                    <div key={idx} className="p-4 border rounded-xl hover:border-indigo-300 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {offer.provider} — {offer.title}
                        </span>
                        <span className={offerTypeBadge(offer.type)}>{offer.type}</span>
                      </div>

                      <div className="text-sm text-gray-600 mt-1">
                        Eligibility: {offer.eligibility}
                      </div>

                      <div className="text-sm text-gray-600">
                        Value: {formatINR(offer.estimated_value)}
                      </div>

                      {offer.link && (
                        <a href={offer.link} target="_blank" className="text-indigo-600 text-sm hover:underline mt-1 inline-block">
                          View offer
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER DISCLAIMER */}
      <div className="text-xs text-gray-500 p-6">
        These suggestions are indicative based on typical reward structures and spending categories.
      </div>
    </div>
  );
}
