import React, { useEffect, useState } from "react";
import {
  Brain,
  Activity,
  Clock,
  Settings,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner"; // <- add this

const EEGReports = () => {
  const [loading, setLoading] = useState(true);

  // simulate 1-second loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // === DEMO DATA ===
  const accuracy = 65.7;
  const trainingDate = new Date("2025-10-20T15:30:00");

  const comparisonData = [
    { metric: "Accuracy", RF: 65.7, SVM: 63.4, GB: 66.2 },
    { metric: "Precision", RF: 68.1, SVM: 65.2, GB: 67.8 },
    { metric: "Recall", RF: 64.5, SVM: 62.7, GB: 65.9 },
    { metric: "F1 Score", RF: 66.3, SVM: 63.8, GB: 66.0 },
  ];

  const modelConfig = {
    algorithm: "Random Forest Classifier",
    n_estimators: 400,
    test_split: "20%",
    features_used: 64,
  };

  const dataSummary = {
    participants: 98,
    meditationGroups: 5,
    totalTasks: 2,
  };

  // ===== LOADER UI =====
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <LoadingSpinner size={120} color="border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* === HEADER === */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              EEG Model Performance Report
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Machine learning evaluation of EEG-based meditation classification.
            Demo data displayed for Random Forest, SVM, and Gradient Boosting.
          </p>
        </div>

        {/* === SUMMARY CARDS === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Accuracy */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300">
                Model Accuracy
              </h3>
            </div>
            <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-200">
              {accuracy.toFixed(1)}%
            </p>
          </div>

          {/* Data Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Data Overview
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <span className="font-semibold">Participants:</span>{" "}
              {dataSummary.participants}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <span className="font-semibold">Groups:</span>{" "}
              {dataSummary.meditationGroups}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <span className="font-semibold">Tasks:</span>{" "}
              {dataSummary.totalTasks}
            </p>
          </div>

          {/* Training Info */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Training Date
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {trainingDate.toLocaleDateString()}{" "}
              {trainingDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Model Config */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
                Model Configuration
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Algorithm: {modelConfig.algorithm}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Estimators: {modelConfig.n_estimators}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Features: {modelConfig.features_used}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Test Split: {modelConfig.test_split}
            </p>
          </div>
        </div>

        {/* === PERFORMANCE CHART === */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Model Comparison (Demo Metrics)
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="RF" fill="#6366F1" />
                <Bar dataKey="SVM" fill="#10B981" />
                <Bar dataKey="GB" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EEGReports;


// import React from "react";
// import {
//   Brain,
//   Activity,
//   Clock,
//   Settings,
//   Zap,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const EEGReports = () => {
//   // === DEMO DATA ===
//   const accuracy = 65.7;
//   const trainingDate = new Date("2025-10-20T15:30:00");

//   const comparisonData = [
//     { metric: "Accuracy", RF: 65.7, SVM: 63.4, GB: 66.2 },
//     { metric: "Precision", RF: 68.1, SVM: 65.2, GB: 67.8 },
//     { metric: "Recall", RF: 64.5, SVM: 62.7, GB: 65.9 },
//     { metric: "F1 Score", RF: 66.3, SVM: 63.8, GB: 66.0 },
//   ];

//   const modelConfig = {
//     algorithm: "Random Forest Classifier",
//     n_estimators: 400,
//     test_split: "20%",
//     features_used: 64,
//   };

//   const dataSummary = {
//     participants: 98,
//     meditationGroups: 5,
//     totalTasks: 2,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* === HEADER === */}
//         <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
//           <div className="flex items-center space-x-3 mb-6">
//             <Brain className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               EEG Model Performance Report
//             </h1>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
//             Machine learning evaluation of EEG-based meditation classification.
//             Demo data displayed for Random Forest, SVM, and Gradient Boosting.
//           </p>
//         </div>

//         {/* === SUMMARY CARDS === */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Accuracy */}
//           <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
//             <div className="flex items-center gap-2 mb-2">
//               <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//               <h3 className="font-semibold text-indigo-800 dark:text-indigo-300">
//                 Model Accuracy
//               </h3>
//             </div>
//             <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-200">
//               {accuracy.toFixed(1)}%
//             </p>
//           </div>

//           {/* Data Summary */}
//           <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
//             <div className="flex items-center gap-2 mb-2">
//               <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               <h3 className="font-semibold text-blue-800 dark:text-blue-300">
//                 Data Overview
//               </h3>
//             </div>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               <span className="font-semibold">Participants:</span>{" "}
//               {dataSummary.participants}
//             </p>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               <span className="font-semibold">Groups:</span>{" "}
//               {dataSummary.meditationGroups}
//             </p>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               <span className="font-semibold">Tasks:</span>{" "}
//               {dataSummary.totalTasks}
//             </p>
//           </div>

//           {/* Training Info */}
//           <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800 shadow-sm">
//             <div className="flex items-center gap-2 mb-2">
//               <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
//               <h3 className="font-semibold text-green-800 dark:text-green-300">
//                 Training Date
//               </h3>
//             </div>
//             <p className="text-gray-700 dark:text-gray-300">
//               {trainingDate.toLocaleDateString()}{" "}
//               {trainingDate.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </p>
//           </div>

//           {/* Model Config */}
//           <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800 shadow-sm">
//             <div className="flex items-center gap-2 mb-2">
//               <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//               <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
//                 Model Configuration
//               </h3>
//             </div>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               Algorithm: {modelConfig.algorithm}
//             </p>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               Estimators: {modelConfig.n_estimators}
//             </p>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               Features: {modelConfig.features_used}
//             </p>
//             <p className="text-gray-700 dark:text-gray-300 text-sm">
//               Test Split: {modelConfig.test_split}
//             </p>
//           </div>
//         </div>

//         {/* === PERFORMANCE CHART === */}
//         <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
//             Model Comparison (Demo Metrics)
//           </h2>
//           <div className="h-96">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={comparisonData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
//                 <XAxis dataKey="metric" />
//                 <YAxis domain={[0, 100]} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="RF" fill="#6366F1" />
//                 <Bar dataKey="SVM" fill="#10B981" />
//                 <Bar dataKey="GB" fill="#F59E0B" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EEGReports;
