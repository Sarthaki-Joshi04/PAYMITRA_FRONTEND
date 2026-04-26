import React, { useState, useEffect } from 'react';
import {
  CreditCard, Building2, Wallet, Sparkles, TrendingUp, AlertCircle, Download, History,
  PieChart, Target, Zap, Shield, Award, ChevronDown, ChevronUp, Info, X, DollarSign, Calendar, Percent
} from 'lucide-react';
import {
  generateFutureRecommendations,
  listFutureHistory,
  saveFutureHistory,
} from "../utils/mockFinance";

//---------------------------------------------------------
// FINANCIAL DATA STATIC TABLES
//---------------------------------------------------------
const FINANCIAL_DATA = {
  banks: [
    { name: 'SBI', savingsRate: 2.7, fdRate: 6.5, loanRate: 10.5, features: ['UPI', 'NetBanking', 'Zero Balance'] },
    { name: 'HDFC', savingsRate: 3.0, fdRate: 7.0, loanRate: 10.75, features: ['Premium Banking', 'Forex', 'Investment'] },
    { name: 'ICICI', savingsRate: 3.0, fdRate: 7.1, loanRate: 10.85, features: ['Digital Banking', 'Global Services'] },
    { name: 'Kotak', savingsRate: 3.5, fdRate: 7.2, loanRate: 10.5, features: ['811 Digital', 'Low MAB'] },
    { name: 'Axis', savingsRate: 3.0, fdRate: 7.0, loanRate: 10.65, features: ['Burgundy', 'Priority Banking'] },
    { name: 'IDFC First', savingsRate: 7.0, fdRate: 7.5, loanRate: 11.0, features: ['High Interest', 'Zero Fees'] },
    { name: 'Yes Bank', savingsRate: 3.25, fdRate: 7.25, loanRate: 11.5, features: ['Digital First'] }
  ],
  creditCards: [
    { name: 'SBI Card', joiningFee: 500, annualFee: 500, cashback: 5, rewardRate: 1, features: ['Fuel Surcharge Waiver', 'Lounge Access'] },
    { name: 'HDFC Regalia', joiningFee: 2500, annualFee: 2500, cashback: 4, rewardRate: 2, features: ['SmartBuy', 'Travel Benefits', '4 Lounge/Quarter'] },
    { name: 'ICICI Amazon Pay', joiningFee: 0, annualFee: 500, cashback: 5, rewardRate: 1, features: ['Amazon Cashback', 'Prime Benefits'] },
    { name: 'Kotak League', joiningFee: 1500, annualFee: 1500, cashback: 3, rewardRate: 1.5, features: ['Dining', 'Entertainment'] },
    { name: 'Axis Flipkart', joiningFee: 500, annualFee: 500, cashback: 4, rewardRate: 1, features: ['Flipkart Cashback', 'BookMyShow'] },
    { name: 'AmEx Platinum', joiningFee: 5000, annualFee: 5000, cashback: 2, rewardRate: 3, features: ['Taj Vouchers', 'Global Lounge'] },
    { name: 'SBI SimplyCLICK', joiningFee: 499, annualFee: 499, cashback: 10, rewardRate: 1, features: ['Online Shopping', 'Vouchers'] }
  ],
  emiProviders: [
    { name: 'Bajaj Finserv', interestRate: 12, tenure: [3, 6, 9, 12, 18, 24], processingFee: 1.5 },
    { name: 'HDFC PayLater', interestRate: 11, tenure: [3, 6, 9, 12], processingFee: 1.0 },
    { name: 'Amazon Pay Later', interestRate: 13, tenure: [3, 6, 9, 12], processingFee: 0 },
    { name: 'Simpl', interestRate: 14, tenure: [3, 6], processingFee: 0 }
  ]
};

const EMPLOYMENT_MULTIPLIERS = {
  salaried: { loanRate: 1.0, creditScore: 1.1 },
  "self-employed": { loanRate: 1.4, creditScore: 0.9 },
  business: { loanRate: 1.3, creditScore: 1.0 },
  freelancer: { loanRate: 1.5, creditScore: 0.85 }
};

// ==========================================================================
// MAIN COMPONENT
// ==========================================================================
export default function FinancialAdvisorPro() {

  //---------------------------------------------------------
  // HOOKS & STATES
  //---------------------------------------------------------
  const [activeTab, setActiveTab] = useState("profile");

  const [userProfile, setUserProfile] = useState({
    cash: "",
    monthlyIncome: "",
    banks: [],
    creditCards: [],
    employmentType: "salaried",
    creditScore: 750,
    monthlyExpenses: "",
    investments: ""
  });

  const [purchaseDetails, setPurchaseDetails] = useState({
    amount: "",
    category: "electronics",
    urgency: "medium"
  });

  const [recommendations, setRecommendations] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  //---------------------------------------------------------
  // HISTORY LOADER
  //---------------------------------------------------------
  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setHistory(listFutureHistory());
  };

  const saveHistory = async (analysis) => {
    const timestamp = Date.now();
    saveFutureHistory({
      timestamp,
      recommendations: analysis,
      userProfile,
      purchaseDetails,
    });
    await loadHistory();
  };

  //---------------------------------------------------------
  // UTILITY
  //---------------------------------------------------------
  const toggleArrayItem = (arr, item) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const calculateFinancialHealth = () => {
    const cash = Number(userProfile.cash || 0);
    const inc = Number(userProfile.monthlyIncome || 1);
    const exp = Number(userProfile.monthlyExpenses || 0);
    const invest = Number(userProfile.investments || 0);

    const savingsRate = ((inc - exp) / inc) * 100;
    const liquidity = cash / (exp || 1);
    const wealth = ((cash + invest) / (inc * 12)) * 100;

    return {
      savingsRate: savingsRate.toFixed(1),
      liquidityRatio: liquidity.toFixed(2),
      wealthScore: wealth.toFixed(0),
      healthStatus:
        savingsRate > 20 ? "Excellent" :
        savingsRate > 10 ? "Good" : "Needs Improvement"
    };
  };

  //---------------------------------------------------------
  // LOCAL RECOMMENDATION ENGINE
  //---------------------------------------------------------
  const generateAdvancedRecommendations = async () => {
    if (!purchaseDetails.amount || !userProfile.cash) {
      alert("Please enter purchase & cash");
      return;
    }
    setIsLoading(true);

    try {
      const result = generateFutureRecommendations(userProfile, purchaseDetails);
      setRecommendations(result.recommendations);
      setAnalytics(result.analytics);
      await saveHistory(result.recommendations);

    } catch (err) {
      console.error(err);
      alert("Recommendation engine failed.");
    }
    setIsLoading(false);
  };

  //---------------------------------------------------------
  // EXPORT JSON
  //---------------------------------------------------------
  const downloadJSON = () => {
    const final = {
      timestamp: new Date().toISOString(),
      userProfile,
      purchaseDetails,
      recommendations,
      analytics
    };
    const blob = new Blob([JSON.stringify(final, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${Date.now()}.json`;
    a.click();
  };

  //---------------------------------------------------------
  // PROFILE TAB
  //---------------------------------------------------------
  const ProfileTab = () => {
    const health = calculateFinancialHealth();

    return (
      <div className="space-y-6">

        {/* Cash */}
        <div>
          <label className="font-medium">Available Cash (₹)</label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg mt-1"
            value={userProfile.cash}
            onChange={(e) => setUserProfile({ ...userProfile, cash: e.target.value })}
            placeholder="50000"
          />
        </div>

        {/* Income */}
        <div>
          <label className="font-medium">Monthly Income (₹)</label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg mt-1"
            value={userProfile.monthlyIncome}
            onChange={(e) => setUserProfile({ ...userProfile, monthlyIncome: e.target.value })}
            placeholder="70000"
          />
        </div>

        {/* Expenses */}
        <div>
          <label className="font-medium">Monthly Expenses (₹)</label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg mt-1"
            value={userProfile.monthlyExpenses}
            onChange={(e) => setUserProfile({ ...userProfile, monthlyExpenses: e.target.value })}
            placeholder="40000"
          />
        </div>

        {/* Credit Score */}
        <div>
          <label className="font-medium">Credit Score: {userProfile.creditScore}</label>
          <input
            type="range"
            min="300"
            max="900"
            className="w-full"
            value={userProfile.creditScore}
            onChange={(e) => setUserProfile({ ...userProfile, creditScore: e.target.value })}
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="font-medium">Employment Type</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(EMPLOYMENT_MULTIPLIERS).map(type => (
              <button
                key={type}
                onClick={() => setUserProfile({ ...userProfile, employmentType: type })}
                className={`px-3 py-2 rounded-lg ${
                  userProfile.employmentType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Health */}
        <div className="p-4 border rounded-lg bg-indigo-50">
          <h3 className="font-semibold mb-3">Financial Health</h3>
          <p>Savings Rate: {health.savingsRate}%</p>
          <p>Liquidity: {health.liquidityRatio}x</p>
          <p>Wealth Score: {health.wealthScore}</p>
          <p>Status: <strong>{health.healthStatus}</strong></p>
        </div>

      </div>
    );
  };

  //---------------------------------------------------------
  // PURCHASE TAB
  //---------------------------------------------------------
  const PurchaseTab = () => (
    <div className="space-y-6">
      <div>
        <label className="font-medium">Purchase Amount (₹)</label>
        <input
          type="number"
          className="w-full border p-3 rounded-lg mt-1"
          value={purchaseDetails.amount}
          onChange={(e) => setPurchaseDetails({ ...purchaseDetails, amount: e.target.value })}
          placeholder="25000"
        />
      </div>

      <div>
        <label className="font-medium">Category</label>
        <select
          className="w-full border p-3 rounded-lg mt-1"
          value={purchaseDetails.category}
          onChange={(e) => setPurchaseDetails({ ...purchaseDetails, category: e.target.value })}
        >
          <option value="electronics">Electronics</option>
          <option value="appliances">Home Appliances</option>
          <option value="travel">Travel</option>
          <option value="medical">Medical</option>
          <option value="education">Education</option>
        </select>
      </div>

      <div>
        <label className="font-medium">Urgency</label>
        <div className="flex gap-2">
          {["low", "medium", "high"].map(u => (
            <button
              key={u}
              onClick={() => setPurchaseDetails({ ...purchaseDetails, urgency: u })}
              className={`px-4 py-2 rounded-lg ${
                purchaseDetails.urgency === u ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generateAdvancedRecommendations}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl mt-4"
      >
        {isLoading ? "Analyzing..." : "Generate AI Recommendations"}
      </button>
    </div>
  );

  //---------------------------------------------------------
  // RECOMMENDATION CARD
  //---------------------------------------------------------
  const RecommendationCard = ({ rec, index }) => {
    const expanded = expandedCard === index;

    return (
      <div className="border rounded-xl p-5 bg-white shadow-sm mb-4">

        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold">{rec.method}</h3>
            <p className="text-sm text-gray-500">{rec.provider}</p>
          </div>
          <button
            onClick={() => setExpandedCard(expanded ? null : index)}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* Cost Summary */}
        <p className="mt-3 text-xl font-bold">
          ₹{(rec.netCost || rec.totalCost).toLocaleString("en-IN")}
        </p>

        {rec.savings > 0 && (
          <p className="text-green-600 font-semibold">
            Savings: ₹{rec.savings.toLocaleString("en-IN")}
          </p>
        )}

        {/* Expanded Section */}
        {expanded && (
          <div className="mt-4 space-y-3">
            <p><strong>Breakdown:</strong> {rec.breakdown}</p>

            <div>
              <strong>Pros:</strong>
              <ul className="list-disc ml-6">
                {rec.pros?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div>
              <strong>Cons:</strong>
              <ul className="list-disc ml-6">
                {rec.cons?.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            <div>
              <strong>Reasoning:</strong>
              <p>{rec.reasoning}</p>
            </div>

            <div className="bg-indigo-100 p-3 rounded-lg">
              <strong>Action Required:</strong>
              <p>{rec.actionRequired}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  //---------------------------------------------------------
  // FINAL RENDER
  //---------------------------------------------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-6">
        Financial Advisor Pro
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["profile", "purchase", "recommendations"].map(tab => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-xl ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "purchase" && <PurchaseTab />}
        {activeTab === "recommendations" && (
          <>
            {recommendations.length === 0 ? (
              <p className="text-center text-gray-600">No recommendations yet.</p>
            ) : (
              recommendations.map((rec, i) => (
                <RecommendationCard rec={rec} index={i} key={i} />
              ))
            )}

            {recommendations.length > 0 && (
              <button
                onClick={downloadJSON}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl mt-4 flex items-center justify-center gap-2"
              >
                <Download size={20} /> Export Results
              </button>
            )}
          </>
        )}
      </div>

      {/* History */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-3 flex gap-2">
          <History /> Recent Analyses
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500">No history found.</p>
        ) : (
          history.map((h, idx) => (
            <div key={idx} className="p-3 border rounded-lg mb-2 bg-gray-50">
              <p className="text-sm text-gray-600">
                {new Date(h.timestamp).toLocaleString()}
              </p>
              <p className="text-sm">
                Recommendations: {h.recommendations.length}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
