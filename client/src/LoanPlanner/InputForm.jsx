import { useState } from 'react';

const InputForm = ({ onAnalyze, loading }) => {
  const [formData, setFormData] = useState({
    itemCost: 100000,
    cash: 40000,
    tenure: 24
  });

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  const handleInputChange = (field, value) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Purchase Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Item Cost */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Item Cost
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">₹</span>
              <input
                type="number"
                value={formData.itemCost}
                onChange={(e) => handleInputChange('itemCost', e.target.value)}
                className="w-32 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>
          </div>
          <input
            type="range"
            min="10000"
            max="500000"
            step="1000"
            value={formData.itemCost}
            onChange={(e) => handleSliderChange('itemCost', e.target.value)}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>₹10,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>

        {/* Cash Available */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Cash Available
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-500">₹</span>
              <input
                type="number"
                value={formData.cash}
                onChange={(e) => handleInputChange('cash', e.target.value)}
                className="w-32 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={formData.itemCost}
            step="1000"
            value={formData.cash}
            onChange={(e) => handleSliderChange('cash', e.target.value)}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>₹0</span>
            <span>₹{formData.itemCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Tenure (Months)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.tenure}
                onChange={(e) => handleInputChange('tenure', e.target.value)}
                className="w-24 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="6"
                max="60"
                step="1"
              />
              <span className="text-sm text-slate-600">months</span>
            </div>
          </div>
          <input
            type="range"
            min="6"
            max="60"
            step="1"
            value={formData.tenure}
            onChange={(e) => handleSliderChange('tenure', e.target.value)}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>6 months</span>
            <span>60 months</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || formData.cash >= formData.itemCost}
           className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-black transition-all  transform hover:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center">

              Analyzing...
            </span>
          ) : formData.cash >= formData.itemCost ? (
            '✓ You have enough cash!'
          ) : (
            ' Analyze My Finances'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
