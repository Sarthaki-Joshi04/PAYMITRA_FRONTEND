// // src/components/UploadFile.jsx
// import React, { useEffect, useState } from "react";

// export default function UploadFile({ onFileSelect }) {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [objectUrl, setObjectUrl] = useState(null);

//     // When parent clears file (onFileSelect(null)), reflect here
//     useEffect(() => {
//         if (!selectedFile) {
//             if (objectUrl) {
//                 URL.revokeObjectURL(objectUrl);
//                 setObjectUrl(null);
//             }
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [selectedFile]);

//     const handleChange = (e) => {
//         const file = e.target.files && e.target.files[0];
//         if (!file) return;

//         if (file.type !== "application/pdf") {
//             alert("Please upload a PDF file.");
//             return;
//         }

//         setSelectedFile(file);

//         // create a temporary URL to view the pdf in a new tab
//         const url = URL.createObjectURL(file);
//         setObjectUrl(url);

//         // give the file back to parent
//         onFileSelect && onFileSelect(file);
//     };

//     const handleRemove = () => {
//         setSelectedFile(null);
//         onFileSelect && onFileSelect(null);
//         if (objectUrl) {
//             URL.revokeObjectURL(objectUrl);
//             setObjectUrl(null);
//         }
//     };

//     return (
//         <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
//             <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                 Upload Bank Statement (PDF)
//             </label>

//             <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={handleChange}
//                 className="mb-3"
//             />

//             {!selectedFile ? (
//                 <div className="text-sm text-gray-500">No file selected</div>
//             ) : (
//                 <div className="flex items-center justify-between gap-4">
//                     <div>
//                         <div className="font-medium">{selectedFile.name}</div>
//                         <div className="text-xs text-gray-500">
//                             {(selectedFile.size / 1024).toFixed(1)} KB
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         {objectUrl && (
//                             <a
//                                 href={objectUrl}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="text-sm text-blue-600 underline"
//                             >
//                                 View PDF
//                             </a>
//                         )}
//                         <button
//                             type="button"
//                             onClick={handleRemove}
//                             className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm"
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState, useEffect } from "react";
import { FileUp } from "lucide-react";

export default function UploadFile({ onFileSelect, big = false }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    return (
        <div>
            {/* BIG CHOOSE PDF AREA */}
            <label
                className={` w-full
                    flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer
                    transition-all 
                    ${big
                        ? " h-44 border-indigo-400 hover:border-indigo-600 bg-indigo-50/40 dark:bg-gray-800"
                        : "p-3 border-gray-400 hover:border-indigo-500 bg-gray-50 dark:bg-gray-800"}
                `}
            >
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="hidden"
                />

                {!selectedFile ? (
                    <div className="flex flex-col items-center">
                        <FileUp size={big ? 48 : 24} className="text-indigo-500 mb-2" />
                        <span className={`${big ? "text-lg" : "text-sm"} text-gray-700 dark:text-gray-300`}>
                            {big ? "Choose a PDF bank statement" : "Select PDF"}
                        </span>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="font-medium text-gray-800 dark:text-gray-100">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                )}
            </label>
        </div>
    );
}
