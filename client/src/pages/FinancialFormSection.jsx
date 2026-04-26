// FinancialFormSection.jsx
import Dropdown from "./Dropdown";
import TextInput from "./form/TextInput";
import TextArea from "./form/TextArea";
import SubmitButton from "./form/SubmitButton";

const FinancialFormSection = ({
    register,
    handleSubmit,
    watch,
    setValue,
    onSubmit,
    isDisabled,
    isSubmitting
}) => {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Financial Profile Form
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-[#0c0d0f] p-6 rounded-xl shadow-md"
            >
                {/* Employment Type */}
                <Dropdown
                    label="Employment Type"
                    options={["Gig Worker", "Salaried", "Self-Employed", "Student"]}
                    value={watch("employment_type")}
                    onChange={(val) => setValue("employment_type", val)}
                />

                {/* Monthly Income */}
                <TextInput
                    label="Average Monthly Income"
                    register={register}
                    name="monthly_income"
                    placeholder="e.g. 25000"
                />

                {/* Fixed Expenses */}
                <TextInput
                    label="Monthly Fixed Expenses"
                    register={register}
                    name="fixed_expenses"
                    placeholder="Rent + Bills + EMI total"
                />

                {/* Financial Goal */}
                <Dropdown
                    label="Primary Financial Goal"
                    options={[
                        "Reduce Debt",
                        "Save Money",
                        "Plan EMI",
                        "Better Credit Card",
                        "Increase Savings Rate"
                    ]}
                    value={watch("financial_goal")}
                    onChange={(val) => setValue("financial_goal", val)}
                />

                {/* Risk Tolerance */}
                <Dropdown
                    label="Risk Tolerance"
                    options={["Low", "Medium", "High"]}
                    value={watch("risk_tolerance")}
                    onChange={(val) => setValue("risk_tolerance", val)}
                />

                {/* User Query (optional) */}
                <TextArea
                    label="Additional Context (optional)"
                    register={register}
                    name="user_query"
                    placeholder="Describe anything specific you're looking for..."
                />

                <SubmitButton isDisabled={isDisabled} isSubmitting={isSubmitting} />
            </form>
        </section>
    );
};

export default FinancialFormSection;
