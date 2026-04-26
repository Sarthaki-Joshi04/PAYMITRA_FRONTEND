import { useEffect, useState } from 'react';
import InputForm from './InputForm';
import NormalCostSummary from './NormalCostSummary';
import ResultsGrid from './ResultsGrid';
import LoadingSpinner from "../components/LoadingSpinner";
import {
  generateLoanPlannerResults,
  getLatestOptimizerAnalysis,
  saveLatestOptimizerAnalysis,
} from "../utils/mockFinance";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  // Load latest persisted optimizer analysis on mount
  useEffect(() => {
    const loadLatest = () => {
      setStatus("Loading your last local analysis...");
      const data = getLatestOptimizerAnalysis();
      if (data?.result) setResults(data.result);
      setStatus("");
    };
    loadLatest();
  }, []);

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError(null);
    setStatus("Analyzing best split with local demo logic...");
    
    try {
      const result = generateLoanPlannerResults(formData);
      setResults(result);
      setStatus("Saving your analysis locally...");
      saveLatestOptimizerAnalysis({
        input: {
          item_cost: formData.itemCost,
          cash: formData.cash,
          tenure: formData.tenure,
        },
        result,
      });
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className=" font-roboto min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white  border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Loan Planner
              </h1>
              <p className="text-slate-600 mt-1">Personalized Insights for a Smarter Financial Future</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">PayMitra Finance</p>
                <p className="text-xs text-slate-400">Your Adaptive AI Companion</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full-page overlay for loading */}
      {(loading) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <LoadingSpinner />
          <p className="mt-4 text-gray-200 text-lg font-medium animate-textfade">{status}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Form */}
        <div className="mb-8">
          <InputForm onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}
            
        {/* Results */}
        {results && !loading && (
          <>
            {/* Normal Cost Summary */}
            <div className="mb-8">
              <NormalCostSummary data={results} />
            </div>

            {/* Results Grid */}
            <div>
              <ResultsGrid data={results} />
            </div>
          </>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <svg className="mx-auto h-24 w-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No Analysis Yet</h3>
            <p className="mt-2 text-sm text-slate-500">Enter your purchase details above to get started</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
