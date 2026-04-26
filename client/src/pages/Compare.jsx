import React from "react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Brain, BarChart3, Activity } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const EEGGroupComparison = () => {


  
  // === UPDATED DEMO DATA ===
  const groupPerformance = [
    { group: "HTR (Himalayan)", accuracy: 74.3, alpha: 15.2, gamma: 6.8 },
    { group: "CTR (Control)", accuracy: 61.4, alpha: 10.5, gamma: 4.1 },
    { group: "TM (Transcendental)", accuracy: 69.8, alpha: 16.1, gamma: 7.2 },
    { group: "VIP (Vipassana)", accuracy: 71.6, alpha: 13.5, gamma: 5.9 },
    { group: "SNY (Shoonya)", accuracy: 67.9, alpha: 12.2, gamma: 6.1 },
  ];

  // Additional demo data for cognitive performance radar chart
  const cognitiveData = [
    { metric: "Focus", HTR: 82, CTR: 65, TM: 79, VIP: 80, SNY: 77 },
    { metric: "Calmness", HTR: 88, CTR: 70, TM: 83, VIP: 85, SNY: 84 },
    { metric: "Attention", HTR: 80, CTR: 66, TM: 78, VIP: 79, SNY: 76 },
  ];


    const [loading, setLoading] = useState(true);
  
    // simulate 1-second loader
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }, []);
  


  // ===== LOADER UI =====
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <LoadingSpinner size={120} color="border-indigo-600" />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meditation Group EEG Comparison
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Demo data — Accuracy & EEG Power Comparison
        </p>
      </div>

      {/* ======= BAR CHART ======= */}
      <div className="h-96 mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={groupPerformance}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="group" tick={{ fill: "#999", fontSize: 12 }} interval={0} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: "rgba(99,102,241,0.05)" }}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
            <Legend />
            <Bar dataKey="accuracy" fill="#6366F1" radius={[8, 8, 0, 0]} name="Accuracy (%)" />
            <Bar dataKey="alpha" fill="#10B981" radius={[8, 8, 0, 0]} name="Alpha Power (µV²)" />
            <Bar dataKey="gamma" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Gamma Power (µV²)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ======= RADAR CHART ======= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="text-pink-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cognitive State Indices 
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart outerRadius={130} data={cognitiveData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" stroke="#aaa" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="HTR" dataKey="HTR" stroke="#6366F1" fill="#6366F1" fillOpacity={0.5} />
            <Radar name="CTR" dataKey="CTR" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.3} />
            <Radar name="TM" dataKey="TM" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
            <Radar name="VIP" dataKey="VIP" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
            <Radar name="SNY" dataKey="SNY" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ======= SUMMARY INSIGHTS ======= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-5 rounded-xl hover:scale-[1.02] transition-all">
          <p className="text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
            🧘‍♂️ Highest Accuracy
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Himalayan Tradition (HTR) reached <b>74.3%</b> classification accuracy.
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-5 rounded-xl hover:scale-[1.02] transition-all">
          <p className="text-green-700 dark:text-green-300 font-semibold mb-1">
            🌿 Strongest Alpha Activity
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Transcendental Meditation (TM) showed the highest alpha amplitude
            (<b>16.1 µV²</b>), indicating relaxed alertness.
          </p>
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 p-5 rounded-xl hover:scale-[1.02] transition-all">
          <p className="text-pink-700 dark:text-pink-300 font-semibold mb-1">
            ⚡ Balanced Gamma Focus
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Vipassana (VIP) and Shoonya (SNY) displayed balanced gamma oscillations
            (~6 µV²), linked to focused awareness and clarity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EEGGroupComparison;
