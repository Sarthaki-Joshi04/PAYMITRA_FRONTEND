import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const MonthlyLineChart = ({ data }) => {
    const chartData = Object.entries(data).map(([month, amount]) => ({
        month,
        amount
    }));

    return (
        <div className="flex justify-center">
            <LineChart width={500} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
        </div>
    );
};

export default MonthlyLineChart;
