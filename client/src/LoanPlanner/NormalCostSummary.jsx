const NormalCostSummary = ({ data }) => {
  const { normal_strategy, comparison } = data;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Normal Purchase Strategy</h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
          Traditional Approach
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <p className="text-xs text-red-600 font-semibold uppercase mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-red-700">
            ₹{comparison.normal_cost.toLocaleString()}
          </p>
        </div>

        {/* Cash Upfront */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Cash Paid</p>
          <p className="text-2xl font-bold text-blue-700">
            ₹{normal_strategy.costs.cash_used.toLocaleString()}
          </p>
        </div>

        {/* Monthly EMI */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <p className="text-xs text-purple-600 font-semibold uppercase mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-purple-700">
            ₹{normal_strategy.emi.monthly.toLocaleString()}
          </p>
          <p className="text-xs text-purple-500 mt-1">× {normal_strategy.emi.count} months</p>
        </div>

        {/* Interest Paid */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <p className="text-xs text-orange-600 font-semibold uppercase mb-1">Interest</p>
          <p className="text-2xl font-bold text-orange-700">
            ₹{normal_strategy.costs.interest.toLocaleString()}
          </p>
          <p className="text-xs text-orange-500 mt-1">{normal_strategy.loan.type}</p>
        </div>
      </div>

      {/* Summary Distribution */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Principal Amount</span>
            <span className="text-sm font-semibold text-slate-800">
              ₹{normal_strategy.costs.principal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Processing Fee</span>
            <span className="text-sm font-semibold text-slate-800">
              ₹{normal_strategy.costs.processing_fee.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Interest @ {normal_strategy.loan.rate}%</span>
            <span className="text-sm font-semibold text-slate-800">
              ₹{normal_strategy.costs.interest.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalCostSummary;
