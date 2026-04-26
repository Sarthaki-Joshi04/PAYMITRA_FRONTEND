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
} from "recharts";

/**
 * WeeklyCategoryTrendChart
 * - transactions: [{ date: "YYYY-MM-DD or YYYY-MM-DD hh:mm", amount: number|string, type: "debit"|"credit", category: "Grocery" }]
 * - renders debit-only weekly trends per category
 */

const FALLBACK_COLORS = [
    "#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#6366F1", "#14B8A6"
];

const parseAmount = (raw) => {
    if (raw == null) return 0;
    if (typeof raw === "number") return raw;
    try {
        const s = String(raw).replace(/[^0-9.-]+/g, "");
        return Number(s) || 0;
    } catch {
        return 0;
    }
};

const getWeekStartISO = (dateLike) => {
    // Accept Date object or string
    const d = new Date(String(dateLike));
    if (isNaN(d)) return null;
    const day = d.getDay(); // 0 Sun .. 6 Sat
    // Make Monday the week start
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().slice(0, 10); // YYYY-MM-DD
};

const isoToLabel = (iso) => {
    // iso like "2025-11-03" -> "11-03"
    return iso ? iso.slice(5) : "";
};

const WeeklyCategoryTrendChart = ({ transactions = [] }) => {
    const data = useMemo(() => {
        // 1) Filter debit transactions and normalize
        const debitTx = transactions
            .map((t) => {
                try {
                    const date = t.date ? String(t.date) : "";
                    const iso = getWeekStartISO(date);
                    return {
                        week: iso, // may be null
                        amount: parseAmount(t.amount),
                        category: t.category ? String(t.category).trim() : "Unknown",
                        // determine debit by explicit type or by sign fallback
                        isDebit:
                            (t.type && String(t.type).toLowerCase().includes("debit")) ||
                            (t.type && String(t.type).toLowerCase().includes("dr")) ||
                            (!t.type && Number(parseAmount(t.amount)) >= 0),
                    };
                } catch (e) {
                    return null;
                }
            })
            .filter(Boolean)
            .filter((t) => t.week !== null && t.isDebit); // only debit & valid week

        if (debitTx.length === 0) {
            return { rows: [], categories: [] };
        }

        // 2) Determine the set of categories present (stable order)
        const categoriesSet = new Set();
        debitTx.forEach((t) => categoriesSet.add(t.category));
        const categories = Array.from(categoriesSet);

        // 3) Build bucket map: week -> { weekStart: Date, cat1: amount, cat2: amount, ... }
        const buckets = {}; // key = week ISO

        debitTx.forEach((t) => {
            const key = t.week;
            if (!buckets[key]) {
                buckets[key] = { weekStartISO: key };
            }
            const prev = buckets[key][t.category] || 0;
            buckets[key][t.category] = prev + Math.abs(Number(t.amount) || 0);
        });

        // 4) Create continuous list of weeks from min -> max so chart has stable X axis
        const weekKeys = Object.keys(buckets).sort();
        const minWeek = weekKeys[0];
        const maxWeek = weekKeys[weekKeys.length - 1];

        const rows = [];

        if (minWeek && maxWeek) {
            // iterate by 7 days stepping
            let cur = new Date(minWeek + "T00:00:00Z");
            const end = new Date(maxWeek + "T00:00:00Z");
            while (cur <= end) {
                const iso = cur.toISOString().slice(0, 10);
                const row = { week: isoToLabel(iso) }; // label for X axis
                // fill categories
                categories.forEach((cat) => {
                    row[cat] = Math.round(buckets[iso] && buckets[iso][cat] ? buckets[iso][cat] : 0);
                });
                rows.push(row);
                cur.setDate(cur.getDate() + 7);
            }
        }

        return { rows, categories };
    }, [transactions]);

    const { rows, categories } = data;

    if (!rows || rows.length === 0 || !categories || categories.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                No debit category data yet — run analysis to populate weekly trends.
            </div>
        );
    }

    // color mapping for categories (stable)
    const colorMap = {};
    categories.forEach((cat, i) => {
        colorMap[cat] = FALLBACK_COLORS[i % FALLBACK_COLORS.length];
    });

    return (
        <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows} margin={{ top: 8, right: 18, left: 0, bottom: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                    <Legend verticalAlign="top" height={28} />

                    {categories.map((cat) => (
                        <Line
                            key={cat}
                            type="monotone"
                            dataKey={cat}
                            stroke={colorMap[cat]}
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyCategoryTrendChart;
