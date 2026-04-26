// File: src/components/Upload/index.js
export { default as FileUpload } from "./FileUpload";


// -------------------------------
// File: src/pages/UploadPage.jsx
import { useState } from "react";
import { FileUpload } from "../components/Upload";


export default function UploadPage() {
    const [uploadedFile, setUploadedFile] = useState(null);


    return (
        <div className="p-6 flex flex-col items-center gap-6">
            <h1 className="text-xl font-bold">Upload File</h1>
            <FileUpload onUpload={setUploadedFile} />


            {uploadedFile && (
                <div className="p-4 border rounded-xl w-full max-w-md">
                    <p className="font-medium">File Selected:</p>
                    <p className="text-sm">{uploadedFile.name}</p>
                </div>
            )}
        </div>
    );
}