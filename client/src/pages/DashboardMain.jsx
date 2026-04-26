// src/pages/DashboardHome.jsx
import React from "react";
import {
    Wallet,
    PiggyBank,
    BadgeCheck,
    CalendarClock,
    BarChart3,
    FileText,
    CreditCard,
    Landmark,
    Sparkles,
    HeartPulse,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import AIAdvisor from './AIAdvisor'

import UPform from "./UPForm";
import upload from "./GetInfo"

import SpendingPieChart from "../components/SpendingPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import MaskedChartPlaceholder from "../components/MaskedChartPlaceholder";
import WeeklyDebitCreditChart from "../components/WeeklyDebitCreditChart";
import { useAnalysisStore } from "../store/useAnalysisStore";

const SummaryCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            <Icon size={26} className={`${color}`} />
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
);

const DashboardHome = () => {
    // Read shared analysis state so charts reflect UPForm results
    const { summary, transactions } = useAnalysisStore();

    // Helper to format currency in INR
    const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    // Compute totals from analyzed summary (populated via UPForm)
    const totals = summary ? {
        total_debit: summary.total_debit || 0,
        total_credit: summary.total_credit || 0,
        net: (summary.total_credit || 0) - (summary.total_debit || 0),
        count: (transactions || []).length,
    } : null;

    const summaryData = [
        { title: "This Month's Spending", value: "₹42,510", icon: Wallet, color: "text-blue-500" },
        { title: "Savings Achieved", value: "₹8,200", icon: PiggyBank, color: "text-green-500" },
        { title: "Credit Score", value: "742", icon: BadgeCheck, color: "text-indigo-500" },
        { title: "Upcoming Bills", value: "3 Due Soon", icon: CalendarClock, color: "text-orange-500" },
    ];

    const modules = [


        {
            title: "Loan Planner",
            desc: "Plan car loans, personal loans, EMIs, and compare live interest rates.",
            icon: Landmark,
            link: "/advisor",
        },
   

        {
            title: "Statement Analyzer",
            desc: "Upload your PDF bank statement to extract transactions automatically.",
            icon: FileText,
            link: "/upload",
        },

        {
            title: "Future Lock",
            desc: "Auto-classify spending, detect patterns, identify overspending categories.",
            icon: BarChart3,
            link: "/expenses",
        },

    ];

    return (
        <div className=" font-roboto min-h-screen bg-gradient-to-b bg-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">

            {/* HERO SECTION */}
            <section className="relative bg-gradient-to-br bg-white dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 py-24 px-6 text-center overflow-hidden">
               
               
                <div className="relative z-10">
                    <h1 className="text-6xl font-bold tracking-tight mb-6 text-black dark:text-white">
                        PayMitra
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        Your <span className="font-semibold text-indigo-500" >Adaptive AI Financial Companion</span> —
                        understand spending, plan better, and make smarter financial decisions.
                    </p>

                    <Link
                        to="/upload"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-black transition-all  transform hover:scale-95"
                    >
                        Analyze My Finances
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* SPENDING TRENDS */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3 justify-left">
                    <BarChart3 size={28} className="text-indigo-500" />
                    Monthly Spending Trends
                </h2>

                {/* Charts grid — masked initially, shown after analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Spending Breakdown Pie */}
                    {summary?.category_summary ? (
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px]">
                            <h3 className="text-lg font-semibold mb-2">Spending Breakdown</h3>
                            <SpendingPieChart data={summary.category_summary} />
                        </div>
                    ) : (
                        <MaskedChartPlaceholder title="Spending Breakdown" />
                    )}

                    {/* Monthly Trend */}
                    {summary?.monthly_summary ? (
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px]">
                            <h3 className="text-lg font-semibold mb-2">Monthly Spending Trend</h3>
                            <MonthlyLineChart data={summary.monthly_summary} />
                        </div>
                    ) : (
                        <MaskedChartPlaceholder title="Monthly Spending Trend" />
                    )}
                </div>

                {/* Weekly Debit vs Credit (full width) */}
                <div className="mt-6">
                    {(transactions && transactions.length > 0) ? (
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px] w-full">
                            <h3 className="text-lg font-semibold mb-2">Weekly Debit vs Credit</h3>
                            <WeeklyDebitCreditChart transactions={transactions} />
                        </div>
                    ) : (
                        <MaskedChartPlaceholder title="Weekly Debit vs Credit" />
                    )}
                </div>

                <div className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
                    Visualizing daily expenses across selected accounts
                </div>
            </section>

            {/* SUMMARY CARDS (Dynamic from UPForm) */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                {totals ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SummaryCard title="Total Debit" value={fmtINR(totals.total_debit)} icon={Wallet} color="text-rose-500" />
                        <SummaryCard title="Total Credit" value={fmtINR(totals.total_credit)} icon={CreditCard} color="text-emerald-500" />
                        <SummaryCard title="Net" value={fmtINR(totals.net)} icon={PiggyBank} color="text-indigo-500" />
                        <SummaryCard title="Transactions" value={totals.count} icon={FileText} color="text-gray-500" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow">
                        <p className="text-gray-700 dark:text-gray-300">
                            Upload a statement in the Analyzer to see your debit, credit and net totals here.
                        </p>
                        <Link to="/upload" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-black text-white rounded-xl shadow hover:scale-105 transition">
                            Analyze My Finances <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </section>

            {/* MODULES */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10 flex items-center gap-3">
                    <Sparkles size={28} className="text-pink-500" />
                    Financial Tools
                </h2>

                <div className="grid  md:grid-cols-3 gap-10">
                    {modules.map((m, i) => (
                        <div
                            key={i}
                            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="absolute -top-6 left-6 p-3 rounded-xl border">
                                <m.icon size={28} className="text-indigo-400" />
                            </div>

                            <h3 className="text-2xl font-semibold mt-4 mb-3 text-black dark:text-white">{m.title}</h3>
                            <p className="text-black dark:text-gray-300 mb-6 leading-relaxed">{m.desc}</p>

                            <Link
                                to={m.link}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Open Module
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER CTA */}
            <footer className="bg-white dark:bg-gray-900 py-12 text-center rounded-t-3xl shadow-inner">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center justify-center gap-3">
                    <HeartPulse size={26} className="text-indigo-500" />
                    Ready to Improve Your Financial Life?
                </h2>

                <Link
                    to="/recommendations"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                    Get Personalized Recommendations
                    <ArrowRight size={20} />
                </Link>
            </footer>
        </div>
    );
};

export default DashboardHome;
