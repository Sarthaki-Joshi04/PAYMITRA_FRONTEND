// const Card = ({ title, items, icon, variant = "default" }) => {
//     const isHighlight = variant === "highlight";

//     return (
//         <div
//             // className={`w-full ${isHighlight ? "bg-gradient-to-r from-coralStart to-coralEnd text-white" : "sm:w-[350px] bg-white dark:bg-[#0c0d0f] text-gray-900 dark:text-white"
//             className={`w-full ${isHighlight ? "bg-gradient-to-r from-coralStart to-coralEnd text-white dark:from-[#4282f8] dark:to-[#1cb4f5] " : "sm:w-[350px] bg-white dark:bg-[#0c0d0f] text-gray-900 dark:text-white"
//                 } flex-1 rounded-2xl shadow-md px-8 py-12 transition-colors`}
//         >
//             {/* Icon */}
//             {icon && (
//                 <div
//                     className={`w-12 h-12 flex justify-center items-center rounded-full ${isHighlight ? "bg-white bg-opacity-20 " : "bg-[#FF5E57] dark:bg-[#1cb4f5]"
//                         }`}
//                 >
//                     <img
//                         src={icon}
//                         alt={title}
//                         className="w-6 h-6 object-contain"
//                     />
//                 </div>
//             )}

//             {/* Title */}
//             <h3
//                 className={`mt-4 text-xl font-semibold ${isHighlight ? "text-white font-bold dark:text-black" : "text-gray-900 dark:text-white"
//                     }`}
//             >
//                 {title}
//             </h3>

//             {/* Items */}
//             <ul
//                 className={`mt-3 space-y-2 text-sm list-disc list-inside ${isHighlight
//                     ? "text-white text-[16px] dark:text-black dark:text-[16px]"
//                         : "text-gray-700 dark:text-gray-300"
//                     }`}
//             >
//                 {items?.map((item, idx) => (
//                     <li key={idx} className="leading-relaxed">
//                         {item.replace(/^\*?\d*\.?\s*/, '')}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Card;


// old
// const Card = ({ title, items, icon }) => (
//     <div className="flex-1 w-full sm:w-[350px] rounded-2xl shadow-md px-8 py-12 bg-white dark:bg-gray-900 transition-colors">

//         {/* Icon */}
//         {icon && (
//             <div className="w-12 h-12 flex justify-center items-center bg-[#FF5E57] rounded-full">
//                 <img src={icon} alt={title} className="w-6 h-6 object-contain" />
//             </div>
//         )}

//         {/* Title */}
//         <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
//             {title}
//         </h3>

//         {/* Items */}
//         <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
//             {items?.map((item, idx) => (
//                 <li key={idx} className="leading-relaxed">
//                     {item.replace(/^\*?\d*\.?\s*/, '')}
//                 </li>
//             ))}
//         </ul>
//     </div>
// );

// export default Card;
import React from "react";
import { Brain, Activity, BarChart3, LineChart, Lightbulb, Waves, Zap } from "lucide-react";

export default function EEGKeyInsights() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-16 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* === HEADER === */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                        <Brain className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">
                            EEG and Meditation Research
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 font-montserrat">
                        Key Insights and Interpretations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Summary of EEG-based classification and neural signatures across meditation groups.
                    </p>
                </div>

                {/* === INSIGHT CARDS === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <BarChart3 className="text-indigo-600 dark:text-indigo-400" />,
                            title: "ML Accuracy Overview",
                            color: "indigo",
                            text: (
                                <>
                                    Overall model accuracy was <b>65.7%</b>.
                                    Himalayan (HTR) and Vipassana (VIP) groups showed strongest predictive patterns.
                                </>
                            ),
                        },
                        {
                            icon: <Waves className="text-green-600 dark:text-green-400" />,
                            title: "Alpha Band (8–13 Hz)",
                            color: "green",
                            text: (
                                <>
                                    Alpha power was <b>higher</b> in TM and HTR groups, reflecting calm internalized focus.
                                </>
                            ),
                        },
                        {
                            icon: <Zap className="text-amber-600 dark:text-amber-400" />,
                            title: "Gamma Band (30–45 Hz)",
                            color: "amber",
                            text: (
                                <>
                                    VIP and Shoonya (SNY) displayed balanced gamma activity linked with heightened awareness.
                                </>
                            ),
                        },
                        {
                            icon: <Activity className="text-sky-600 dark:text-sky-400" />,
                            title: "Theta Band (4–8 Hz)",
                            color: "sky",
                            text: (
                                <>
                                    Theta oscillations increased during focused practice — markers of deep relaxation.
                                </>
                            ),
                        },
                        {
                            icon: <LineChart className="text-rose-600 dark:text-rose-400" />,
                            title: "Beta Band (13–30 Hz)",
                            color: "rose",
                            text: (
                                <>
                                    Beta power was slightly higher in controls, indicating active thought and external engagement.
                                </>
                            ),
                        },
                        {
                            icon: <Lightbulb className="text-purple-600 dark:text-purple-400" />,
                            title: "Model Behavior",
                            color: "purple",
                            text: (
                                <>
                                    Random Forest and Gradient Boosting outperformed linear models, revealing non-linear EEG patterns.
                                </>
                            ),
                        },
                    ].map(({ icon, title, color, text }) => (
                        <div
                            key={title}
                            className={`bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-100 dark:border-${color}-800 rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-sm`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {icon}
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>
                        </div>
                    ))}
                </div>

                {/* === SUMMARY === */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <BarChart3 className="text-indigo-500" />
                        Summary of Observations
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        Distinct meditation techniques showed unique EEG signatures.
                        Himalayan and Transcendental methods enhanced <b>alpha and theta power</b>, signifying calm alertness.
                        Vipassana and Shoonya revealed elevated <b>gamma activity</b>, associated with awareness and integration.
                        <br /><br />
                        Machine-learning classification reached <b>65.7% accuracy</b>; non-linear models performed best.
                        EEG features thus hold promise for objective assessment of meditative states and neurofeedback applications.
                    </p>
                </div>
            </div>
        </div>
    );
}
