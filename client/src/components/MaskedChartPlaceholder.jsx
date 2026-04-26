import React from "react";
import { Lock } from "lucide-react";

const MaskedChartPlaceholder = ({ title }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 h-[360px] relative overflow-hidden">

            <h2 className="text-lg font-semibold mb-2 opacity-40">{title}</h2>

            {/* Blurred mask layer */}
            <div className="absolute inset-0 backdrop-blur-sm bg-white/40 dark:bg-gray-900/30 flex flex-col items-center justify-center">

                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-md mb-3">
                    <Lock className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>

                <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Analyze to unlock insights
                </p>
            </div>
        </div>
    );
};

export default MaskedChartPlaceholder;
