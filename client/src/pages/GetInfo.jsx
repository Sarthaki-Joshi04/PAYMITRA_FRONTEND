// // GetInfo.jsx
// import { useForm } from "react-hook-form";
// import FinancialFormSection from "./FinancialFormSection";

// const GetInfo = () => {
//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         formState: { isSubmitting, isValid }
//     } = useForm({
//         mode: "onChange",
//         defaultValues: {
//             employment_type: "",
//             monthly_income: "",
//             fixed_expenses: "",
//             financial_goal: "",
//             risk_tolerance: "",
//             user_query: ""
//         }
//     });

//     const onSubmit = async (data) => {
//         console.log("Form Submitted:", data);
//         // Here you will send data to your backend / agent later
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <FinancialFormSection
//                 register={register}
//                 handleSubmit={handleSubmit}
//                 watch={watch}
//                 setValue={setValue}
//                 onSubmit={onSubmit}
//                 isDisabled={!isValid}
//                 isSubmitting={isSubmitting}
//             />
//         </div>
//     );
// };

// export default GetInfo;


import { useState } from "react";
import UploadFile from "../components/UploadFile";

const UPform = () => {
    const [pdfFile, setPdfFile] = useState(null);

    const handleFileUpload = (file) => {
        setPdfFile(file);
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pdfFile) {
            alert("Please upload your PDF");
            return;
        }

        console.log("PDF ready to send:", pdfFile);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Upload Your Statement</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <UploadFile onFileSelect={handleFileUpload} />

                <button
                    type="submit"
                    className="bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                    Continue
                </button>
            </form>
        </div>
    );
};

export default UPform;
