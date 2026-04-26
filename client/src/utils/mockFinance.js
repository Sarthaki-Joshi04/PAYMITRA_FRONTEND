const ANALYSIS_KEY = "paymitra.latestAnalysis";
const OPTIMIZER_KEY = "paymitra.latestOptimizerAnalysis";
const FUTURE_HISTORY_PREFIX = "paymitra.futureAnalysis.";

const MOCK_TRANSACTIONS = [
  { date: "2026-01-03", description: "Salary Credit", amount: 92000, type: "credit", category: "income" },
  { date: "2026-01-05", description: "Rent Payment", amount: 22000, type: "debit", category: "housing" },
  { date: "2026-01-06", description: "Grocery Store", amount: 4850, type: "debit", category: "groceries" },
  { date: "2026-01-09", description: "Fuel Station", amount: 3100, type: "debit", category: "fuel" },
  { date: "2026-01-12", description: "Dining Out", amount: 2600, type: "debit", category: "food" },
  { date: "2026-01-15", description: "Online Shopping", amount: 7400, type: "debit", category: "shopping" },
  { date: "2026-01-23", description: "Utility Bill", amount: 2800, type: "debit", category: "utilities" },
  { date: "2026-02-03", description: "Salary Credit", amount: 92000, type: "credit", category: "income" },
  { date: "2026-02-06", description: "Rent Payment", amount: 22000, type: "debit", category: "housing" },
  { date: "2026-02-08", description: "Grocery Store", amount: 5200, type: "debit", category: "groceries" },
  { date: "2026-02-12", description: "Medicine", amount: 1800, type: "debit", category: "healthcare" },
  { date: "2026-02-18", description: "Travel Booking", amount: 9200, type: "debit", category: "travel" },
  { date: "2026-02-24", description: "Movie + Dinner", amount: 3400, type: "debit", category: "entertainment" },
  { date: "2026-03-03", description: "Salary Credit", amount: 94000, type: "credit", category: "income" },
  { date: "2026-03-05", description: "Rent Payment", amount: 22000, type: "debit", category: "housing" },
  { date: "2026-03-09", description: "Electricity Bill", amount: 3200, type: "debit", category: "utilities" },
  { date: "2026-03-11", description: "Grocery Store", amount: 5600, type: "debit", category: "groceries" },
  { date: "2026-03-14", description: "Restaurant", amount: 3100, type: "debit", category: "food" },
  { date: "2026-03-18", description: "Shopping Mall", amount: 8700, type: "debit", category: "shopping" },
  { date: "2026-03-26", description: "Fuel Station", amount: 3300, type: "debit", category: "fuel" },
];

const CARD_LIBRARY = {
  groceries: [
    { bank: "HDFC", name: "Millennia", description: "Strong cashback on groceries, wallets, and everyday online spends." },
    { bank: "SBI", name: "SimplySAVE", description: "Good value for grocery and dining-led monthly spend." },
  ],
  shopping: [
    { bank: "Axis", name: "Flipkart Axis", description: "Useful for online shopping and partner marketplace rewards." },
    { bank: "ICICI", name: "Amazon Pay", description: "Simple cashback structure for frequent online orders." },
  ],
  food: [
    { bank: "HDFC", name: "Swiggy HDFC", description: "Better value on dining and food delivery purchases." },
    { bank: "SBI", name: "SimplyCLICK", description: "Decent mix of dining and online merchant benefits." },
  ],
  travel: [
    { bank: "Axis", name: "Atlas", description: "Better for flights, hotel bookings, and travel reward conversion." },
    { bank: "HDFC", name: "Regalia Gold", description: "Balanced travel rewards and lounge-focused benefits." },
  ],
  utilities: [
    { bank: "Axis", name: "ACE", description: "Good savings on bill payments, utilities, and merchant offers." },
    { bank: "IDFC FIRST", name: "Select", description: "Useful everyday returns with low-friction bill usage." },
  ],
  default: [
    { bank: "HDFC", name: "Millennia", description: "A balanced cashback card for mixed urban spending." },
    { bank: "Axis", name: "ACE", description: "Useful for bills, offline spend, and frequent cashback categories." },
  ],
};

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function groupByMonth(transactions) {
  return transactions.reduce((acc, tx) => {
    if (tx.type !== "debit") return acc;
    const month = new Date(tx.date).toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + tx.amount;
    return acc;
  }, {});
}

function groupByCategory(transactions) {
  return transactions.reduce((acc, tx) => {
    if (tx.type !== "debit") return acc;
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
}

function totalAmount(transactions, type) {
  return transactions
    .filter((tx) => tx.type === type)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

function cloneTransactions() {
  return MOCK_TRANSACTIONS.map((tx) => ({ ...tx }));
}

export function buildMockStatementAnalysis(fileName = "statement.pdf") {
  const fileBias = fileName.toLowerCase().includes("salary") ? 1.08 : 1;
  const transactions = cloneTransactions().map((tx, index) => {
    if (tx.type === "credit") return { ...tx, amount: Math.round(tx.amount * fileBias) };
    const modifier = 1 + ((index % 4) - 1.5) * 0.035;
    return { ...tx, amount: Math.round(tx.amount * modifier) };
  });

  const summary = {
    total_debit: totalAmount(transactions, "debit"),
    total_credit: totalAmount(transactions, "credit"),
    category_summary: groupByCategory(transactions),
    monthly_summary: groupByMonth(transactions),
  };

  return {
    path: `mock://${fileName.replace(/\s+/g, "-").toLowerCase()}`,
    transactions,
    summary,
  };
}

export function getLatestAnalysis() {
  return readJson(ANALYSIS_KEY, null);
}

export function saveLatestAnalysis(analysis) {
  writeJson(ANALYSIS_KEY, analysis);
}

export function getCardRecommendations(categorySummary = {}) {
  const topCategory =
    Object.entries(categorySummary).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] || "default";

  return {
    top_category: topCategory,
    recommended_cards: CARD_LIBRARY[topCategory] || CARD_LIBRARY.default,
  };
}

function buildStrategy({ cardName, rewardRate, fee, loanType, loanRate, investType, investRate, financedAmount, tenure, cash }) {
  const principal = Math.max(financedAmount, 0);
  const processingFee = Math.round(principal * 0.0125);
  const interest = Math.round(principal * (loanRate / 100) * (tenure / 12));
  const rewardEarned = Math.round(principal * (rewardRate / 100));
  const gain = Math.round(cash * (investRate / 100) * (tenure / 12));
  const total = principal + processingFee + interest + fee - rewardEarned - gain;
  const monthly = tenure > 1 ? Math.round((total - Math.round(total * 0.08)) / (tenure - 1)) : total;
  const finalPayment = Math.max(total - monthly * Math.max(tenure - 1, 0), 0);

  return {
    credit_card: {
      name: cardName,
      reward_rate: rewardRate,
      reward_earned: rewardEarned,
      annual_fee: fee,
    },
    loan: {
      type: loanType,
      rate: loanRate,
      processing_fee: processingFee,
      amount: principal,
    },
    investment: {
      type: investType,
      return_rate: investRate,
      gain,
      risk: investRate >= 8 ? "Medium" : "Low",
    },
    costs: {
      principal,
      processing_fee: processingFee,
      interest,
      cash_used: cash,
      total,
    },
    emi: {
      monthly,
      regular_count: Math.max(tenure - 1, 0),
      final_payment: finalPayment,
    },
  };
}

export function generateLoanPlannerResults({ itemCost, cash, tenure }) {
  const principal = Math.max(Number(itemCost || 0) - Number(cash || 0), 0);
  const months = Math.max(Number(tenure || 1), 1);

  const strategies = [
    buildStrategy({
      cardName: "HDFC Millennia",
      rewardRate: 5,
      fee: 1000,
      loanType: "Bank EMI",
      loanRate: 12.5,
      investType: "Liquid Fund",
      investRate: 6.8,
      financedAmount: principal,
      tenure: months,
      cash: Number(cash || 0),
    }),
    buildStrategy({
      cardName: "Axis ACE",
      rewardRate: 4,
      fee: 499,
      loanType: "NBFC EMI",
      loanRate: 13.9,
      investType: "Recurring Deposit",
      investRate: 7.2,
      financedAmount: principal,
      tenure: months,
      cash: Number(cash || 0),
    }),
    buildStrategy({
      cardName: "SBI Cashback",
      rewardRate: 5,
      fee: 999,
      loanType: "Credit Card EMI",
      loanRate: 14.5,
      investType: "Ultra Short Fund",
      investRate: 7.8,
      financedAmount: principal,
      tenure: months,
      cash: Number(cash || 0),
    }),
  ].sort((a, b) => a.costs.total - b.costs.total);

  const normalInterest = Math.round(principal * 0.16 * (months / 12));
  const normalProcessingFee = Math.round(principal * 0.015);
  const normalCost = principal + normalInterest + normalProcessingFee;

  return {
    input: {
      item_cost: Number(itemCost || 0),
      cash: Number(cash || 0),
      tenure: months,
    },
    normal_strategy: {
      loan: { type: "Standard Personal Loan", rate: 16 },
      costs: {
        principal,
        processing_fee: normalProcessingFee,
        interest: normalInterest,
        cash_used: Number(cash || 0),
      },
      emi: {
        monthly: months ? Math.round(normalCost / months) : normalCost,
        count: months,
      },
    },
    all_strategies: strategies,
    comparison: {
      normal_cost: normalCost,
      best_cost: strategies[0]?.costs.total || normalCost,
    },
  };
}

export function getLatestOptimizerAnalysis() {
  return readJson(OPTIMIZER_KEY, null);
}

export function saveLatestOptimizerAnalysis(result) {
  writeJson(OPTIMIZER_KEY, result);
}

export function generateLoanAdvisor(payload) {
  const loanAmount = Number(payload.loanAmount || 0);
  const cashAvailable = Number(payload.cashAvailable || 0);
  const tenureMonths = Math.max(Number(payload.tenureMonths || 12), 1);
  const netFinanced = Math.max(loanAmount - cashAvailable, 0);
  const cardChoices = getCardRecommendations(payload.summary?.category_summary).recommended_cards;
  const yearlySavings = Math.round(netFinanced * 0.04 + cardChoices.length * 1800);

  return {
    overview: "Use a higher upfront contribution, pair it with a cashback-first card, and keep the balance on the lowest-friction EMI option.",
    est_benefit: yearlySavings,
    suggested_products: cardChoices.map((card, index) => ({
      bank: card.bank,
      product: card.name,
      reason: index === 0 ? "Best fit for your dominant spend category and upfront purchase size." : "Good backup option if you prefer lower fees or a different rewards program.",
      est_annual_benefit: Math.round(yearlySavings / (index + 2)),
    })),
    actions: [
      `Keep upfront payment near ${Math.round((cashAvailable / Math.max(loanAmount, 1)) * 100)}% to lower interest drag.`,
      `Target an EMI below ${Math.round(netFinanced / tenureMonths).toLocaleString("en-IN")} per month to stay comfortable on cash flow.`,
      "Use statement credits or cashback rewards to offset the first one or two EMIs.",
    ],
    available_offers: [
      {
        provider: "Merchant EMI",
        title: "Low processing fee checkout plan",
        type: "emi",
        eligibility: "Available on select electronics and appliance purchases",
        estimated_value: Math.round(netFinanced * 0.012),
        link: "#",
      },
      {
        provider: cardChoices[0]?.bank || "Partner Bank",
        title: `${cardChoices[0]?.name || "Rewards Card"} welcome cashback`,
        type: "cashback",
        eligibility: "New or upgraded card activation with minimum spend",
        estimated_value: 2500,
        link: "#",
      },
    ],
  };
}

export function generateLifestyleRecommendations(formData) {
  const dietPreference = (formData.dietary_preferences || "Balanced").toLowerCase();
  const goal = (formData.fitness_goals || "General Fitness").toLowerCase();

  return {
    diet_types: [
      `${formData.dietary_preferences || "Balanced"} meals with whole foods and steady protein`,
      dietPreference.includes("vegan") ? "Add legumes, tofu, and nuts for protein coverage" : "Include curd, eggs, or lean paneer for easy protein wins",
      "Build plates around fiber-rich carbs and seasonal vegetables",
    ],
    workouts: goal.includes("muscle")
      ? ["3 strength sessions weekly", "2 brisk walks for recovery", "Progressive overload on compound lifts"]
      : goal.includes("weight")
        ? ["Daily 30-minute walk", "3 mixed cardio-strength sessions weekly", "1 longer low-intensity session on weekends"]
        : ["2 mobility sessions weekly", "3 moderate cardio sessions", "1 interval day for stamina"],
    breakfasts: [
      "Oats with fruit and seeds",
      "Protein smoothie with banana and peanut butter",
      "Poha or upma with added sprouts",
    ],
    dinners: [
      "Roti with dal and sabzi",
      "Rice bowl with vegetables and protein",
      "Soup plus a light protein-based side",
    ],
    additional_tips: [
      `Account for ${formData.lifestyle_factors || "your daily routine"} when planning workout timing.`,
      `Avoid trigger foods linked to ${formData.dietary_restrictions || "your restrictions"}.`,
      formData.health_conditions
        ? `Keep portions and meal timing consistent around ${formData.health_conditions}.`
        : "Hydrate consistently and aim for regular sleep-wake timing.",
    ],
  };
}

function buildFutureRecommendation({ method, provider, totalCost, savings, breakdown, reasoning, actionRequired, type }) {
  return {
    method,
    provider,
    totalCost,
    netCost: totalCost,
    savings,
    breakdown,
    pros: ["Clear upfront math", "Matches current cash flow", "Easy to execute without backend support"],
    cons: ["Indicative only", "Merchant terms may vary", "Recheck fees before purchase"],
    reasoning,
    actionRequired,
    type,
  };
}

export function generateFutureRecommendations(userProfile, purchaseDetails) {
  const cash = Number(userProfile.cash || 0);
  const amount = Number(purchaseDetails.amount || 0);
  const monthlyIncome = Number(userProfile.monthlyIncome || 0);
  const creditScore = Number(userProfile.creditScore || 750);
  const balance = Math.max(amount - cash, 0);
  const safetyBuffer = Math.max(monthlyIncome * 0.3, 15000);

  const recommendations = [
    buildFutureRecommendation({
      method: "Cash + Rewards Card",
      provider: "HDFC Millennia",
      totalCost: Math.round(amount * 0.97),
      savings: Math.round(amount * 0.03),
      breakdown: "Use available cash for most of the purchase and route the rest through a cashback card.",
      reasoning: "This keeps debt low while preserving a small emergency cushion.",
      actionRequired: "Use the card only for the remaining balance after keeping your safety buffer intact.",
      type: "cash",
    }),
    buildFutureRecommendation({
      method: "Merchant EMI",
      provider: "Axis Partner EMI",
      totalCost: Math.round(amount * 1.05),
      savings: Math.round(amount * 0.01),
      breakdown: "Split the amount across short tenure EMI with a moderate processing fee.",
      reasoning: "Useful if you want to protect liquidity and your monthly income can absorb the EMI.",
      actionRequired: "Choose the shortest tenure that keeps EMI manageable.",
      type: "emi",
    }),
    buildFutureRecommendation({
      method: "Cash + Liquid Fund Buffer",
      provider: "IDFC FIRST + Liquid Fund",
      totalCost: Math.round(amount * 0.985),
      savings: Math.round(amount * 0.015),
      breakdown: "Pay mostly with cash and keep the rest invested in a low-risk parking product.",
      reasoning: "Suitable when your credit score is solid and you want flexibility without much debt.",
      actionRequired: "Do not draw cash below your monthly essential-expense reserve.",
      type: "savings",
    }),
  ].map((rec, index) => ({
    ...rec,
    totalCost: rec.totalCost + Math.round((creditScore < 700 ? 0.01 : 0) * amount) + index * 450,
  }));

  const analytics = {
    avgCost: recommendations.reduce((sum, rec) => sum + rec.totalCost, 0) / recommendations.length,
    bestSavings: Math.max(...recommendations.map((rec) => rec.savings || 0)),
    cashOptions: recommendations.filter((rec) => rec.type === "cash").length,
    emiOptions: recommendations.filter((rec) => rec.type === "emi").length,
    reserveLeft: Math.max(cash - Math.min(cash, amount), 0),
    safetyBuffer,
    balance,
  };

  return { recommendations, analytics };
}

export function listFutureHistory() {
  if (typeof window === "undefined") return [];
  try {
    return Object.keys(window.localStorage)
      .filter((key) => key.startsWith(FUTURE_HISTORY_PREFIX))
      .sort()
      .slice(-5)
      .map((key) => JSON.parse(window.localStorage.getItem(key)))
      .reverse();
  } catch {
    return [];
  }
}

export function saveFutureHistory(entry) {
  writeJson(`${FUTURE_HISTORY_PREFIX}${entry.timestamp}`, entry);
}
