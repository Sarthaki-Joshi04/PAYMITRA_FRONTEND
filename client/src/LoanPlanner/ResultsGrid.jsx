import { useState } from 'react';

const ResultsGrid = ({ data }) => {
  const { all_strategies, comparison } = data;
  const [selectedStrategy, setSelectedStrategy] = useState(all_strategies[0]);

  // Group strategies by credit card
  const creditCards = [...new Set(all_strategies.map(s => s.credit_card.name))];
  const loans = [...new Set(all_strategies.map(s => s.loan.type))];
  const investments = [...new Set(all_strategies.map(s => s.investment.type))];

  // Get all strategies for selected card
  const getStrategiesForCard = (cardName) => {
    return all_strategies.filter(s => s.credit_card.name === cardName);
  };

  const getStrategiesForLoan = (loanType) => {
    return all_strategies.filter(s => s.loan.type === loanType);
  };

  const getStrategiesForInvestment = (invType) => {
    return all_strategies.filter(s => s.investment.type === invType);
  };

  const handleCardChange = (cardName) => {
    const strategies = getStrategiesForCard(cardName);
    if (strategies.length > 0) {
      setSelectedStrategy(strategies[0]);
    }
  };

  const handleLoanChange = (loanType) => {
    const strategies = getStrategiesForLoan(loanType);
    if (strategies.length > 0) {
      setSelectedStrategy(strategies[0]);
    }
  };

  const handleInvestmentChange = (invType) => {
    const strategies = getStrategiesForInvestment(invType);
    if (strategies.length > 0) {
      setSelectedStrategy(strategies[0]);
    }
  };

  const savings = comparison.normal_cost - selectedStrategy.costs.total;
  const savingsPercent = (savings / comparison.normal_cost) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white"> */}
        <h2 className="text-2xl font-bold mb-2">Optimized Strategy Comparison</h2>
        {/* <p className="text-blue-100">Explore different combinations to maximize your savings</p> */}
      {/* </div> */}

      {/* 4 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Column 1: Best Credit Cards */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
            <h3 className="text-white font-bold text-lg flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              BEST CREDIT CARDS
            </h3>
          </div>
          
          <div className="p-4 space-y-3 h-[650px] overflow-y-auto">
            {creditCards.map((cardName) => {
              const cardStrategies = getStrategiesForCard(cardName);
              const bestForCard = cardStrategies[0];
              const isSelected = selectedStrategy.credit_card.name === cardName;
              
              return (
                <button
                  key={cardName}
                  onClick={() => handleCardChange(cardName)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {cardName}
                    </span>
                    {isSelected && (
                      <span className="text-blue-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Reward Rate:</span>
                      <span className="font-semibold text-green-600">{bestForCard.credit_card.reward_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cashback:</span>
                      <span className="font-semibold text-green-600">₹{bestForCard.credit_card.reward_earned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Annual Fee:</span>
                      <span className="font-semibold text-orange-600">₹{bestForCard.credit_card.annual_fee.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Best Loans */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <h3 className="text-white font-bold text-lg flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              BEST LOAN
            </h3>
          </div>
          
          <div className="p-4 space-y-3 h-[650px] overflow-y-auto">
            {loans.map((loanType) => {
              const loanStrategies = getStrategiesForLoan(loanType);
              const bestForLoan = loanStrategies[0];
              const isSelected = selectedStrategy.loan.type === loanType;
              
              return (
                <button
                  key={loanType}
                  onClick={() => handleLoanChange(loanType)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    isSelected 
                      ? 'border-green-500 bg-green-50 shadow-lg' 
                      : 'border-slate-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-sm ${isSelected ? 'text-green-700' : 'text-slate-800'}`}>
                      {loanType}
                    </span>
                    {isSelected && (
                      <span className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Interest Rate:</span>
                      <span className="font-semibold text-red-600">{bestForLoan.loan.rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Processing:</span>
                      <span className="font-semibold text-orange-600">₹{bestForLoan.loan.processing_fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Loan Amount:</span>
                      <span className="font-semibold text-slate-700">₹{bestForLoan.loan.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 3: Best Investments */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <h3 className="text-white font-bold text-lg flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              BEST INVESTMENT
            </h3>
          </div>
          
          <div className="p-4 space-y-3 h-[650px] overflow-y-auto">
            {investments.map((invType) => {
              const invStrategies = getStrategiesForInvestment(invType);
              const bestForInv = invStrategies[0];
              const isSelected = selectedStrategy.investment.type === invType;
              
              return (
                <button
                  key={invType}
                  onClick={() => handleInvestmentChange(invType)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50 shadow-lg' 
                      : 'border-slate-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-xs ${isSelected ? 'text-purple-700' : 'text-slate-800'}`}>
                      {invType}
                    </span>
                    {isSelected && (
                      <span className="text-purple-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Return Rate:</span>
                      <span className="font-semibold text-green-600">{bestForInv.investment.return_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gain:</span>
                      <span className="font-semibold text-green-600">₹{bestForInv.investment.gain.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk:</span>
                      <span className={`font-semibold ${
                        bestForInv.investment.risk === 'Low' ? 'text-green-600' :
                        bestForInv.investment.risk === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {bestForInv.investment.risk}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 4: Savings & Optimized Cost */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
            <h3 className="text-white font-bold text-lg flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              SAVING & OPTIMIZED COST
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Savings */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <p className="text-xs text-green-700 font-semibold uppercase mb-2">Total Savings</p>
              <p className="text-3xl font-bold text-green-600 mb-2">
                ₹{savings.toLocaleString()}
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  {savingsPercent.toFixed(1)}% OFF
                </span>
                <span className="text-xs text-green-700">vs Normal</span>
              </div>
            </div>

            {/* Optimized Cost */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-xs text-blue-700 font-semibold uppercase mb-2">Optimized Savings</p>
              <p className="text-3xl font-bold text-blue-600 mb-3">
                ₹{selectedStrategy.costs.total.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mb-1">
                (₹{data.input.cash.toLocaleString()}/Month)
              </p>
            </div>

            {/* Summary Distribution */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700">Summary Distribution</h4>
              
              <div className="space-y-2">
                {/* Monthly EMI */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-600">Monthly EMI</span>
                  <span className="text-sm font-bold text-slate-800">
                    ₹{selectedStrategy.emi.monthly.toLocaleString()}
                  </span>
                </div>

                {/* CC Rewards */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-xs text-green-700">Credit Card Fees</span>
                  <span className="text-sm font-bold text-green-600">
                    ₹{selectedStrategy.credit_card.annual_fee.toLocaleString()}
                  </span>
                </div>

                {/* Loan Interest */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs text-orange-700">Loan Interest</span>
                  <span className="text-sm font-bold text-orange-600">
                    ₹{selectedStrategy.costs.interest.toLocaleString()}
                  </span>
                </div>

                {/* Monthly Savings */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-xs text-purple-700">Monthly Savings</span>
                  <span className="text-sm font-bold text-purple-600">
                    ₹{(savings / data.input.tenure).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Strategy Details */}
      <div className="bg-white rounded-2xl shadow-xl p-6 text-black">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          {/* <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg> */}
          Current Strategy Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400 mb-1">Credit Card</p>
            <p className="font-semibold">{selectedStrategy.credit_card.name}</p>
            <p className="text-xs font-bold text-blue-300">+₹{selectedStrategy.credit_card.reward_earned.toLocaleString()} cashback</p>
          </div>
          
          <div>
            <p className="text-slate-400 mb-1">Investment</p>
            <p className="font-semibold">{selectedStrategy.investment.type}</p>
            <p className="text-xs font-bold  text-green-300">+₹{selectedStrategy.investment.gain.toLocaleString()} gain</p>
          </div>
          
          <div>
            <p className="text-slate-400 mb-1">Loan</p>
            <p className="font-semibold">{selectedStrategy.loan.type}</p>
            <p className="text-xs font-bold text-yellow-300">{selectedStrategy.loan.rate}% interest</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            💡 Pay ₹{selectedStrategy.emi.monthly.toLocaleString()} × {selectedStrategy.emi.regular_count} months + 
            ₹{selectedStrategy.emi.final_payment.toLocaleString()} final payment from investment maturity
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsGrid;
