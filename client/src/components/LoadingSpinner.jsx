// const LoadingSpinner = () => {
//     return (
//         <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
//         </div>
//     );
// };

// export default LoadingSpinner;

// import logo from "../assets/icons/medneuro.jpg";



//main

// const LoadingSpinner = ({ size = 48, color = "border-indigo-600" }) => {
//     return (
//         <div className="flex justify-center items-center py-10">
//             <div
//                 className={`animate-spin rounded-full border-b-2 ${color}`}
//                 style={{
//                     width: size,
//                     height: size,
//                 }}
//             ></div>
//         </div>
//     );
// };

// export default LoadingSpinner;

import React from "react";
import logo from "../assets/icons/logo-ind.png";

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col justify-center items-center py-5 space-y-3">
            <img
                src={logo}
                alt="loader"
                className="w-40 h-40 rounded-full object-cover animate-fade"
            />

            <p className="text-gray-600 dark:text-gray-300 text-4xl tracking-wide flex items-center gap-0.5">
                {/* Analyzing */}
                <span className="animate-dot-1">.</span>
                <span className="animate-dot-2">.</span>
                <span className="animate-dot-3">.</span>

                <style>{`
        @keyframes dotFade {
            0% { opacity: 0; }
            20% { opacity: 0; }
            40% { opacity: 1; }
            100% { opacity: 0; }
        }

        .animate-dot-1 {
            animation: dotFade 1.4s infinite;
        }
        .animate-dot-2 {
            animation: dotFade 1.4s infinite 0.2s;
        }
        .animate-dot-3 {
            animation: dotFade 1.4s infinite 0.4s;
        }
    `}</style>

            </p>





            <style>{`
                @keyframes fadePulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                .animate-fade {
                    animation: fadePulse 1.8s ease-in-out infinite;
                }

                @keyframes textFade {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                .animate-textfade {
                    animation: textFade 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;



//3 dot

// const LoadingSpinner = () => {
//     return (
//         <div className="flex justify-center items-center py-10">
//             <div className="flex space-x-2">
//                 <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
//                 <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
//                 <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
//             </div>
//         </div>
//     );
// };

// export default LoadingSpinner;
