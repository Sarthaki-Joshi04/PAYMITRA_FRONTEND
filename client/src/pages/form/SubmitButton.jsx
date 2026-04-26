const SubmitButton = ({ isDisabled, isSubmitting }) => {
    return (
        <div className="flex justify-end">
            <button
                type="submit"
                disabled={isDisabled}
                className={`px-6 py-2 rounded-lg font-medium text-white transition ${isDisabled
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-[#ce132e] hover:bg-[#bb112b] dark:bg-[#4282f8] dark:hover:bg-[#226cf7]"
                    }`}
            >
                {isSubmitting ? "Analyzing Your Data..." : "Get Recommendations"}
            </button>
        </div>
    );
};

export default SubmitButton;
