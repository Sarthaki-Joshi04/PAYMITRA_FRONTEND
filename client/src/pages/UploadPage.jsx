import { useState } from "react";
import { Upload, X } from "lucide-react";


export default function FileUpload({ onUpload }) {
    const [file, setFile] = useState(null);


    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        onUpload && onUpload(selected);
    };


    const removeFile = () => {
        setFile(null);
        onUpload && onUpload(null);
    };


    return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 w-full max-w-md cursor-pointer hover:shadow">
            {!file ? (
                <label className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8" />
                    <p className="text-sm">Click to upload or drag & drop</p>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            ) : (
                <div className="flex items-center justify-between w-full">
                    <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={removeFile}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}