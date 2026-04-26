import React, { useEffect } from "react";
import UploadFile from "../components/UploadFile";
import SpendingPieChart from "../components/SpendingPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAnalysisStore } from "../store/useAnalysisStore";
import MaskedChartPlaceholder from "../components/MaskedChartPlaceholder";
import WeeklyDebitCreditChart from "../components/WeeklyDebitCreditChart";
import WeeklyCategoryTrendChart from "../components/WeeklyCategoryTrendChart";
import {
    buildMockStatementAnalysis,
    getCardRecommendations,
    getLatestAnalysis,
    saveLatestAnalysis,
} from "../utils/mockFinance";


const UPform = () => {
    const {
        pdfFile,
        pdfPath,
        transactions,
        summary,
        cardRecs,
        status,
        loading,
        setState,
        reset,
    } = useAnalysisStore();

    // Load latest persisted analysis on mount
    useEffect(() => {
        const data = getLatestAnalysis();
        if (!data) return;
        setState({
            transactions: data.transactions || [],
            summary: data.summary || null,
            pdfPath: data.path || "",
            status: "Loaded last local analysis.",
        });
    }, [setState]);

    // ===========================
    // FILE SELECT
    // ===========================
    const handleFileSelect = (file) => {
        setState({
            pdfFile: file,
            status: "",
            transactions: [],
            summary: null,
            pdfPath: "",
            cardRecs: null,
        });
    };

    // ===========================
    // SINGLE ACTION — Upload then Analyze
    // ===========================
    const handleAnalyze = async () => {
        // Require a chosen file or an existing path
        if (!pdfFile && !pdfPath) {
            setState({ status: "Please choose a PDF first." });
            return;
        }

        setState({
            loading: true,
            status: pdfPath ? "Refreshing local analysis..." : "Generating local demo analysis...",
        });

        try {
            const analysis = buildMockStatementAnalysis(pdfFile?.name || pdfPath || "statement.pdf");
            saveLatestAnalysis(analysis);
            setState({
                pdfPath: analysis.path,
                transactions: analysis.transactions,
                summary: analysis.summary,
                status: "Analysis complete in local demo mode!",
            });
        } catch (err) {
            setState({ status: "Unable to create local analysis." });
        }

        setState({ loading: false });
    };

    // ===========================
    // STEP 3 — Card Recommendations
    // ===========================
    const handleGetCards = async () => {
        if (!summary) {
            setState({ status: "Run analysis first." });
            return;
        }

        setState({
            loading: true,
            status: "Finding best cards from local rules...",
        });

        try {
            const data = getCardRecommendations(summary.category_summary);
            setState({
                cardRecs: data,
                status: "Recommendations ready!",
            });
        } catch (err) {
            setState({ status: "Unable to generate local recommendations." });
        }

        setState({ loading: false });
    };

    // Simple stats row for persistence UX
    const totals = summary ? {
        total_debit: summary.total_debit || 0,
        total_credit: summary.total_credit || 0,
        net: (summary.total_credit || 0) - (summary.total_debit || 0),
        count: (transactions || []).length,
    } : null;

    return (
        <div className=" font-roboto min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50  ">
        <div className="mx-auto p-6">

            {/* LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-200 text-lg font-medium animate-textfade">
                        {status}
                    </p>
                </div>
            )}


            {/* HEADER */}
            {/* <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Financial Statement Analyzer
            </h1> */}

            {/* Stats row */}
            {/* {totals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                        <div className="text-xs text-gray-500">Total Debit</div>
                        <div className="text-xl font-semibold">₹{totals.total_debit.toFixed(2)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                        <div className="text-xs text-gray-500">Total Credit</div>
                        <div className="text-xl font-semibold">₹{totals.total_credit.toFixed(2)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                        <div className="text-xs text-gray-500">Net</div>
                        <div className="text-xl font-semibold">₹{totals.net.toFixed(2)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                        <div className="text-xs text-gray-500">Transactions</div>
                        <div className="text-xl font-semibold">{totals.count}</div>
                    </div>
                </div>
            )} */}

<div className="bg-white border-b border-slate-200 mb-5">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
<div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Finance Tracker
              </h1>
              </div>
              </div>
</div>


            {/* MAIN UPLOAD CARD */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-10 flex flex-col gap-6">

                {/* FULL WIDTH UPLOAD BOX */}
                <div className="w-full">
                    <UploadFile onFileSelect={handleFileSelect} big />
                </div>

                {/* Single action button */}
                <button
                    onClick={handleAnalyze}
                    className="px-6 py-3 rounded-xl bg-black hover:bg-black text-white font-semibold shadow transition-all mx-auto"
                >
                     Track Spendings
                </button>

                {status && (
                    <p className="text-center mt-2 text-gray-500 dark:text-gray-300 text-sm">
                        {status}
                    </p>
                )}
            </div>


            {/* ACTION BUTTONS */}
            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleGetCards}
                    className="px-6 py-3 rounded-xl bg-black hover:bg-black text-white font-semibold shadow transition-all"
                >
                     Recommend Best Credit Cards
                </button>
            </div>

            {/* RESULTS GRID */}

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PIE CHART */}
                {summary?.category_summary ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px]">
                        <h2 className="text-lg font-semibold mb-2">Spending Breakdown</h2>
                        <SpendingPieChart data={summary.category_summary} />
                    </div>
                ) : (
                    <MaskedChartPlaceholder title="Spending Breakdown" />
                )}

                {/* RIGHT COLUMN: Monthly trend */}
                {summary?.monthly_summary ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px]">
                        <h2 className="text-lg font-semibold mb-2">Monthly Spending Trend</h2>
                        <MonthlyLineChart data={summary.monthly_summary} />
                    </div>
                ) : (
                    <MaskedChartPlaceholder title="Monthly Spending Trend" />
                )}
            </div>

            {/* FULL-WIDTH WEEKLY CHART */}
            <div className="mt-6">
                {(transactions && transactions.length > 0) ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px] w-full">
                        <h2 className="text-lg font-semibold mb-2">Weekly Debit vs Credit</h2>
                        <WeeklyDebitCreditChart transactions={transactions} />
                    </div>
                ) : (
                    <MaskedChartPlaceholder title="Weekly Debit vs Credit" />
                )}
            </div>

            {/* CARD RECOMMENDATIONS */}
            {cardRecs && (
                <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Best Cards for Your Spending ({cardRecs.top_category})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cardRecs.recommended_cards.map((card, idx) => (
                            <div key={idx} className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
                                <h3 className="font-bold text-lg">{card.bank} — {card.name}</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default UPform;
