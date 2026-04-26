import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
} from "recharts";

/**
 * WeeklyDebitCreditChart
 * - Accepts `transactions` prop: array of { date: "YYYY-MM-DD ...", amount: number, type: "debit"|"credit" }
 * - If `type` missing, falls back to amount < 0 as debit.
 */
const WeeklyDebitCreditChart = ({ transactions = [] }) => {
    // Helpers
    const getWeekStart = (isoDate) => {
        const d = new Date(isoDate);
        // Normalize to start of week (Mon). Adjust if you prefer Sun (0).
        const day = d.getDay(); // 0 Sun ... 6 Sat
        // Make Monday as start: diff = day === 0 ? -6 : 1 - day
        const diff = day === 0 ? -6 : 1 - day;
        const monday = new Date(d);
        monday.setDate(d.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const isDebit = (tx) => {
        const t = (tx.type || "").toString().toLowerCase();
        if (t.includes("debit") || t.includes("dr")) return true;
        if (t.includes("credit") || t.includes("cr")) return false;
        // fallback to sign check (negative numbers treated as debit)
        if (typeof tx.amount === "number") return tx.amount < 0;
        return false;
    };

    // Build weekly aggregated data
    const weeklyData = useMemo(() => {
        const buckets = {}; // key -> { weekStart: Date, debit: num, credit: num }

        transactions.forEach((tx) => {
            if (!tx.date || tx.amount == null) return;
            // Accept date either "YYYY-MM-DD" or "YYYY-MM-DD hh:mm"
            const iso = tx.date.split(" ")[0];
            const wk = getWeekStart(iso);
            const key = wk.toISOString().slice(0, 10); // YYYY-MM-DD (week start)
            const amt = Number(tx.amount) || 0;
            const debitFlag = isDebit(tx);

            if (!buckets[key]) buckets[key] = { weekStart: wk, debit: 0, credit: 0 };
            if (debitFlag) buckets[key].debit += Math.abs(amt);
            else buckets[key].credit += Math.abs(amt);
        });

        // Turn into array and sort
        const arr = Object.values(buckets)
            .sort((a, b) => a.weekStart - b.weekStart)
            .map((r) => ({
                week: r.weekStart.toISOString().slice(5, 10), // MM-DD for X axis (short)
                weekFull: r.weekStart.toISOString().slice(0, 10),
                debit: Math.round(r.debit),
                credit: Math.round(r.credit),
            }));

        // If no data, generate empty placeholder for UI stability
        if (arr.length === 0) {
            // produce last 6 weeks with zeros
            const today = new Date();
            const result = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i * 7);
                const wk = getWeekStart(d.toISOString().slice(0, 10));
                result.push({
                    week: wk.toISOString().slice(5, 10),
                    weekFull: wk.toISOString().slice(0, 10),
                    debit: 0,
                    credit: 0,
                });
            }
            return result;
        }

        return arr;
    }, [transactions]);

    // Chart colors matching your Python code
    const DEBIT_COLOR = "#ef4444";
    const CREDIT_COLOR = "#10b981";

    return (
        <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 10, right: 12, left: 0, bottom: 6 }}>
                    <defs>
                        <linearGradient id="gradDebit" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={DEBIT_COLOR} stopOpacity={0.16} />
                            <stop offset="100%" stopColor={DEBIT_COLOR} stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradCredit" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={CREDIT_COLOR} stopOpacity={0.12} />
                            <stop offset="100%" stopColor={CREDIT_COLOR} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                    <Legend verticalAlign="top" height={28} />

                    {/* Debit as red line + filled area */}
                    <Area type="monotone" dataKey="debit" stroke={DEBIT_COLOR} fill="url(#gradDebit)" fillOpacity={1} />
                    <Line type="monotone" dataKey="debit" stroke={DEBIT_COLOR} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />

                    {/* Credit as green line + filled area */}
                    <Area type="monotone" dataKey="credit" stroke={CREDIT_COLOR} fill="url(#gradCredit)" fillOpacity={1} />
                    <Line type="monotone" dataKey="credit" stroke={CREDIT_COLOR} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyDebitCreditChart;
