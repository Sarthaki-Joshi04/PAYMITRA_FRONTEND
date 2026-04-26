import React from "react";

const LoadingSpinner = ({ size = 48, color = "border-indigo-600" }) => {
    return (
        <div className="flex justify-center items-center py-10">
            <div
                className={`animate-spin rounded-full border-b-2 ${color}`}
                style={{
                    width: size,
                    height: size,
                }}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
