import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
    "#6366F1", "#10B981", "#F59E0B", "#EF4444",
    "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6"
];

const SpendingPieChart = ({ data }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);

    const chartData = Object.entries(data).map(([category, amount], i) => ({
        name: category,
        value: amount,
        percent: ((amount / total) * 100).toFixed(1),
        color: COLORS[i % COLORS.length]
    }));

    // outside clean label
    const renderLabel = ({ name, cx, cy, midAngle, outerRadius }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 18;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#4b5563"
                fontSize="11"
                fontWeight={500}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="middle"
            >
                {name}
            </text>
        );
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4">

            {/* PIE */}
            <div className="w-full lg:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius="70%"
                            // label={renderLabel}
                            labelLine={true}
                            dataKey="value"
                        >
                            {chartData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={2} />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(v, n) => [`₹${v}`, n]}
                            contentStyle={{
                                background: "#fff",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                                fontSize: "12px"
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* LEGEND (scrollable, never overflows) */}
            <div className="w-full lg:w-1/2 max-h-[300px] overflow-y-auto pr-2">
                {chartData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {item.name}
                            </span>
                        </div>
                        <div className="text-right text-sm">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {/* ₹{item.value.toLocaleString()} */}
                            </div>
                            <div className="text-xs text-gray-500">{item.percent}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpendingPieChart;
