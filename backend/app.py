import os
import json
import time
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import fitz  # PyMuPDF
import requests
import pandas as pd
# NEW: add sqlite3 for persistence
# import sqlite3
from datetime import datetime
from pymongo import MongoClient
# ---------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------

API_KEY = "YOUR_API_KEY"   # <<< PUT YOUR KEY HERE

GEN_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

app = Flask(__name__)
# CORS(app)

CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5000"
], supports_credentials=True)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# NEW: database path and initialization
DB_PATH = os.path.join(os.path.dirname(__file__), "analysis.db")

MONGO_URI = "mongodb://localhost:27017"  # or your Atlas URL
client = MongoClient(MONGO_URI)

db = client['paymitra']          # database name
analyses_col = db['analyses'] 


def init_db():
    try:
        # Switch to MongoDB: ensure connection/collection is accessible
        analyses_col.find_one({})
    except Exception as e:
        print("MongoDB init error:", e)

init_db()



class PurchaseOptimizer:
    def __init__(self):
        self.credit_cards = [
            {"name": "SBI Cashback", "reward": 5.0, "fee": 999},
            {"name": "HDFC Infinia", "reward": 3.3, "fee": 12500},
            {"name": "Axis Magnus", "reward": 2.4, "fee": 12500},
            {"name": "ICICI Amazon Pay", "reward": 2.0, "fee": 0},
            {"name": "AmEx Platinum", "reward": 2.8, "fee": 3500},
        ]
        
        self.investments = [
            {"name": "Sovereign Gold Bonds", "return": 12.0, "risk": "Medium"},
            {"name": "Physical Gold", "return": 10.5, "risk": "Low"},
            {"name": "Equity Mutual Funds", "return": 14.0, "risk": "High"},
            {"name": "Debt Mutual Funds", "return": 7.5, "risk": "Low"},
            {"name": "Fixed Deposits", "return": 7.0, "risk": "Low"},
            {"name": "Hybrid Funds", "return": 11.0, "risk": "Medium"},
            {"name": "Index Funds", "return": 12.5, "risk": "Medium"},
        ]
        
        self.loans = [
            {"name": "HDFC Personal", "rate": 10.5, "processing": 2.0},
            {"name": "SBI Personal", "rate": 11.0, "processing": 1.5},
            {"name": "ICICI Personal", "rate": 10.75, "processing": 2.0},
            {"name": "Bajaj Finserv", "rate": 13.0, "processing": 3.0},
        ]
        
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        except:
            self.model = None
    
    def emi(self, p, r, n):
        if r == 0 or p == 0: return p / n if n > 0 else 0
        mr = r / 1200
        return p * mr * ((1 + mr) ** n) / (((1 + mr) ** n) - 1)
    
    def maturity(self, p, r, n):
        return p * ((1 + r / 100) ** (n / 12))
    
    def normal_strategy(self, item, cash, tenure):
        loan_amt = item - cash
        loan = self.loans[1]  # SBI
        proc_fee = loan_amt * loan["processing"] / 100
        total_loan = loan_amt + proc_fee
        emi = self.emi(total_loan, loan["rate"], tenure)
        total_interest = (emi * tenure) - total_loan
        total_cost = cash + proc_fee + (emi * tenure)
        
        return {
            "strategy": "Normal Purchase (Direct Loan)",
            "item_cost": item,
            "cash_upfront": cash,
            "loan": {
                "type": loan["name"],
                "amount": round(loan_amt, 2),
                "processing_fee": round(proc_fee, 2),
                "rate": loan["rate"],
                "tenure": tenure
            },
            "emi": {
                "monthly": round(emi, 2),
                "count": tenure,
                "total": round(emi * tenure, 2)
            },
            "costs": {
                "principal": round(loan_amt, 2),
                "interest": round(total_interest, 2),
                "processing_fee": round(proc_fee, 2),
                "cash_used": cash,
                "total": round(total_cost, 2)
            }
        }
    
    def optimized_strategy(self, item, cash, tenure, cc, inv, loan):
        reward = item * cc["reward"] / 100
        cc_bill = item - reward
        
        inv_amt = cash
        mat_val = self.maturity(inv_amt, inv["return"], tenure)
        inv_gain = mat_val - inv_amt
        
        loan_amt = cc_bill
        proc_fee = loan_amt * loan["processing"] / 100
        total_loan_principal = loan_amt + proc_fee
        
        standard_emi = self.emi(total_loan_principal, loan["rate"], tenure)
        total_interest = (standard_emi * tenure) - total_loan_principal
        
        reg_emis = tenure - 1
        total_debt = total_loan_principal + total_interest
        monthly_emi = (total_debt - mat_val) / reg_emis
        reg_total = monthly_emi * reg_emis
        
        remaining_debt_24th = total_debt - reg_total
        if mat_val > remaining_debt_24th:
            refund = mat_val - remaining_debt_24th
            final_payment = 0
        else:
            refund = 0
            final_payment = remaining_debt_24th - mat_val
        
        total_cost = inv_amt + proc_fee + cc["fee"] + reg_total + final_payment
        savings = item - total_cost
        
        return {
            "strategy": f"{cc['name']} + {inv['name']} + {loan['name']}",
            "credit_card": {
                "name": cc["name"],
                "reward_rate": cc["reward"],
                "reward_earned": round(reward, 2),
                "annual_fee": cc["fee"],
                "bill_amount": round(cc_bill, 2)
            },
            "investment": {
                "type": inv["name"],
                "amount": cash,
                "return_rate": inv["return"],
                "tenure_months": tenure,
                "maturity_value": round(mat_val, 2),
                "gain": round(inv_gain, 2),
                "risk": inv["risk"]
            },
            "loan": {
                "type": loan["name"],
                "amount": round(loan_amt, 2),
                "processing_fee": round(proc_fee, 2),
                "rate": loan["rate"],
                "tenure": tenure,
                "total_principal": round(total_loan_principal, 2)
            },
            "emi": {
                "monthly": round(monthly_emi, 2),
                "regular_count": reg_emis,
                "regular_total": round(reg_total, 2),
                "final_payment": round(final_payment, 2),
                "paid_by_investment": round(min(mat_val, remaining_debt_24th), 2)
            },
            "costs": {
                "total_emi": round(reg_total + final_payment, 2),
                "cc_fee": cc["fee"],
                "processing_fee": round(proc_fee, 2),
                "interest": round(total_interest, 2),
                "refund": round(refund, 2),
                "total": round(total_cost, 2),
                "savings": round(savings, 2),
                "savings_pct": round(savings / item * 100, 2)
            }
        }
    
    def find_best(self, item, cash, tenure):
        strategies = []
        for cc in self.credit_cards:
            for inv in self.investments:
                for loan in self.loans:
                    try:
                        s = self.optimized_strategy(item, cash, tenure, cc, inv, loan)
                        strategies.append(s)
                    except:
                        pass
        strategies.sort(key=lambda x: x["costs"]["total"])
        return strategies
    
    def analyze(self, item, cash, tenure=24):
        normal = self.normal_strategy(item, cash, tenure)
        optimized = self.find_best(item, cash, tenure)
        top5 = optimized[:5]
        
        for s in top5:
            s["costs"]["vs_normal"] = round(normal["costs"]["total"] - s["costs"]["total"], 2)
        
        best = top5[0]
        normal_cost = normal["costs"]["cash_used"] + normal["costs"]["principal"] + normal["costs"]["interest"]
        best_cost = best["costs"]["total"]
        max_savings = normal_cost - best_cost
        savings_pct = (max_savings / normal_cost) * 100
        
        result = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "input": {"item_cost": item, "cash": cash, "tenure": tenure},
            "normal_strategy": normal,
            "top_5_optimized": top5,
            "all_strategies": optimized,
            "comparison": {
                "normal_cost": round(normal_cost, 2),
                "best_cost": round(best_cost, 2),
                "max_savings": round(max_savings, 2),
                "savings_pct": round(savings_pct, 2)
            }
        }
        
        return result


optimizer = PurchaseOptimizer()


@app.route('/bestsplit', methods=['POST'])
def best_split():
    try:
        data = request.get_json()
        item = float(data.get('item_cost', 100000))
        cash = float(data.get('cash', 40000))
        tenure = int(data.get('tenure', 24))
        
        if item <= 0 or cash < 0:
            return jsonify({"error": "Invalid input values"}), 400
        
        if cash >= item:
            return jsonify({"message": "You have enough cash!"}), 200
        
        result = optimizer.analyze(item, cash, tenure)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# ---------------------------------------------------------------------
# PDF TEXT EXTRACTION (PAGE BY PAGE)
# ---------------------------------------------------------------------
def extract_pages_text(pdf_path):
    pages = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages, 1):
                text = page.extract_text() or ""
                text = clean_sensitive(text)
                pages.append((i, text))
    except Exception as e:
        print("⚠ TEXT EXTRACTION FAILED → IMAGE MODE", e)
        return []
    return pages


def clean_sensitive(text):
    """Remove phone, email, PAN, card numbers"""
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
    text = re.sub(r'\b(?:\+91|0)?[6-9]\d{9}\b', '[PHONE]', text)
    text = re.sub(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b', '[PAN]', text)
    text = re.sub(r'\b\d{12,16}\b', '[CARD]', text)
    return text

# Optimizer analysis persistence (MongoDB)
def save_optimizer_analysis(input_payload, result_payload):
    try:
        doc = {
            "type": "optimizer",
            "created_at": datetime.utcnow().isoformat(),
            "input": input_payload or {},
            "result": result_payload or {},
        }
        res = analyses_col.insert_one(doc)
        return str(res.inserted_id)
    except Exception as e:
        print("DB save error:", e)
        return None


def get_latest_optimizer_analysis():
    try:
        cursor = analyses_col.find({"type": "optimizer"}).sort([("_id", -1)]).limit(1)
        latest = next(cursor, None)
        if not latest:
            return None
        return {
            "id": str(latest.get("_id")),
            "created_at": latest.get("created_at"),
            "input": latest.get("input") or {},
            "result": latest.get("result") or {},
        }
    except Exception as e:
        print("DB fetch error:", e)
        return None

def save_analysis(filename, path, transactions, summary):
    try:
        doc = {
            "filename": filename,
            "path": path,
            "created_at": datetime.utcnow().isoformat(),
            "transactions": transactions or [],
            "summary": summary or {},
        }
        res = analyses_col.insert_one(doc)
        return str(res.inserted_id)
    except Exception as e:
        print("DB save error:", e)
        return None


def get_latest_analysis():
    try:
        cursor = analyses_col.find().sort([("_id", -1)]).limit(1)
        latest = next(cursor, None)
        if not latest:
            return None
        return {
            "id": str(latest.get("_id")),
            "filename": latest.get("filename"),
            "path": latest.get("path"),
            "created_at": latest.get("created_at"),
            "transactions": latest.get("transactions") or [],
            "summary": latest.get("summary") or {},
        }
    except Exception as e:
        print("DB fetch error:", e)
        return None

# ---------------------------------------------------------------------
# IMAGE FALLBACK
# ---------------------------------------------------------------------
def pdf_page_to_image_b64(path, page_num):
    try:
        doc = fitz.open(path)
        page = doc.load_page(page_num - 1)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        b = pix.tobytes("png")
        import base64
        return base64.b64encode(b).decode("utf-8")
    except Exception as e:
        print("ERROR converting PDF to image:", e)
        return None


# ---------------------------------------------------------------------
# GEMINI PAGE PROCESSING (TEXT MODE)
# ---------------------------------------------------------------------
def gemini_process_text(page_num, text):
    prompt = f"""
Analyze page {page_num} of this bank statement and extract ALL transactions.

For each transaction return:
- date (YYYY-MM-DD)
- time (HH:MM or 00:00)
- description
- amount (float)
- type: Credit/Debit
- method: UPI/Card/NEFT/IMPS/Auto Debit/BBPS/Cash/Other
- category (use the 7-category system you defined)
Return ONLY a JSON array [].

PAGE TEXT:
{text}
"""
    payload = {
        "contents": [{ "parts": [{ "text": prompt }] }],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 4096,
            "responseMimeType": "application/json"
        }
    }

    r = requests.post(
        f"{GEN_URL}?key={API_KEY}",
        json=payload,
        timeout=90
    )

    try:
        result = r.json()
        txt = result["candidates"][0]["content"]["parts"][0]["text"]
        if txt.startswith("["):
            return json.loads(txt)
        match = re.search(r"\[[\s\S]*\]", txt)
        return json.loads(match.group(0)) if match else []
    except Exception as e:
        print("Gemini parsing error:", e)
        return []


# ---------------------------------------------------------------------
# GEMINI PAGE PROCESSING (IMAGE MODE)
# ---------------------------------------------------------------------
def gemini_process_image(page_num, image_b64):
    prompt = f"""
Analyze this BANK STATEMENT PAGE IMAGE and return ALL transactions.
Format: JSON array only.
"""
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/png", "data": image_b64}}
            ]
        }],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 4096,
            "responseMimeType": "application/json"
        }
    }

    r = requests.post(
        f"{GEN_URL}?key={API_KEY}",
        json=payload,
        timeout=120
    )

    try:
        result = r.json()
        txt = result["candidates"][0]["content"]["parts"][0]["text"]
        if txt.startswith("["):
            return json.loads(txt)
        match = re.search(r"\[[\s\S]*\]", txt)
        return json.loads(match.group(0)) if match else []
    except:
        return []


# ---------------------------------------------------------------------
# COMBINE ALL TRANSACTIONS + SUMMARY
# ---------------------------------------------------------------------
# def summarize(transactions):
#     if not transactions:
#         return {
#             "total_credit": 0,
#             "total_debit": 0,
#             "net": 0,
#             "category_summary": {}
#         }

#     df = pd.DataFrame(transactions)

#     df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
#     df_credit = df[df["type"] == "Credit"]
#     df_debit  = df[df["type"] == "Debit"]

#     summary = {
#         "total_credit": float(df_credit["amount"].sum()),
#         "total_debit": float(df_debit["amount"].sum()),
#         "net": float(df_credit["amount"].sum() - df_debit["amount"].sum()),
#         "category_summary": df_debit.groupby("category")["amount"].sum().to_dict()
#     }

#     return summary


def summarize(transactions):
    if not transactions:
        return {
            "total_credit": 0,
            "total_debit": 0,
            "net": 0,
            "category_summary": {},
            "monthly_summary": {}
        }

    df = pd.DataFrame(transactions)

    # Convert
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    # Basic totals
    df_credit = df[df["type"].str.lower() == "credit"]
    df_debit = df[df["type"].str.lower() == "debit"]

    total_credit = float(df_credit["amount"].sum())
    total_debit  = float(df_debit["amount"].sum())

    # Category wise spending (only debit)
    category_summary = (
        df_debit.groupby("category")["amount"]
        .sum()
        .sort_values(ascending=False)
        .to_dict()
    )

    # Monthly summary
    df["month"] = df["date"].dt.to_period("M").astype(str)
    monthly_summary = (
        df.groupby("month")["amount"]
        .sum()
        .sort_values()
        .to_dict()
    )

    return {
        "total_credit": total_credit,
        "total_debit": total_debit,
        "net": total_credit - total_debit,
        "category_summary": category_summary,
        "monthly_summary": monthly_summary
    }



@app.route("/recommend_cards", methods=["POST"])
def recommend_cards():
    data = request.json
    category_summary = data.get("category_summary", {})

    if not category_summary:
        return jsonify({"error": "No category summary provided"}), 400

    # Load cards database
    with open("cards.json", "r") as f:
        cards = json.load(f)

    # Identify top spending category
    sorted_cats = sorted(category_summary.items(), key=lambda x: x[1], reverse=True)
    top_category = sorted_cats[0][0].lower()

    # Filter cards that match user spending category
    recommended = [
        card for card in cards 
        if top_category in [c.lower() for c in card["best_for"]]
    ]

    return jsonify({
        "top_category": top_category,
        "recommended_cards": recommended
    }), 200



# ---------------------------------------------------------------------
# ROUTE 1 — upload_pdf (store file)
# ---------------------------------------------------------------------
@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    if "pdf" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["pdf"]
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    return jsonify({
        "message": "PDF uploaded",
        "filename": file.filename,
        "path": path
    })


# ---------------------------------------------------------------------
# ROUTE 2 — process_pdf (FULL AI ANALYSIS)
# ---------------------------------------------------------------------
# Replace the return block to also persist analysis
@app.route("/process_pdf", methods=["POST"])
def process_pdf():
    data = request.json
    pdf_path = data.get("path")

    if not pdf_path or not os.path.exists(pdf_path):
        return jsonify({"error": "PDF path invalid"}), 400

    # Try TEXT extraction first
    pages = extract_pages_text(pdf_path)

    all_txn = []

    if pages:  # TEXT MODE
        for page_num, text in pages:
            tx = gemini_process_text(page_num, text)
            all_txn.extend(tx)
            time.sleep(0.5)
    else:  # IMAGE MODE
        with fitz.open(pdf_path) as doc:
            for page_num in range(1, len(doc) + 1):
                img = pdf_page_to_image_b64(pdf_path, page_num)
                if img:
                    tx = gemini_process_image(page_num, img)
                    all_txn.extend(tx)
                time.sleep(0.5)

    summary = summarize(all_txn)

    # NEW: persist to DB
    filename = os.path.basename(pdf_path)
    analysis_id = save_analysis(filename, pdf_path, all_txn, summary)

    return jsonify({
        "transactions": all_txn,
        "summary": summary,
        "analysis_id": analysis_id,
        "filename": filename,
        "path": pdf_path,
    })

# NEW: fetch latest persisted analysis
@app.route("/latest_analysis", methods=["GET"])
def latest_analysis():
    latest = get_latest_analysis()
    if not latest:
        return jsonify({"message": "No analysis found"}), 404
    return jsonify(latest), 200

# ---------------------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------------------
@app.route("/health")
def health():
    return "Backend running", 200


# ---------------------------------------------------------------------
# ROUTE 3 — save_optimizer_analysis
# ---------------------------------------------------------------------
@app.route("/save_optimizer_analysis", methods=["POST"])
def save_optimizer_analysis_route():
    data = request.json or {}
    input_payload = data.get("input") or {}
    result_payload = data.get("result") or {}
    analysis_id = save_optimizer_analysis(input_payload, result_payload)
    if not analysis_id:
        return jsonify({"error": "Failed to save optimizer analysis"}), 500
    return jsonify({"analysis_id": analysis_id}), 200

# ---------------------------------------------------------------------
# ROUTE 4 — latest_optimizer_analysis
# ---------------------------------------------------------------------
@app.route("/latest_optimizer_analysis", methods=["GET"])
def latest_optimizer_analysis():
    latest = get_latest_optimizer_analysis()
    if not latest:
        return jsonify({"message": "No optimizer analysis found"}), 404
    return jsonify(latest), 200

# ---------------------------------------------------------------------
# RUN SERVER (moved to bottom)
# ---------------------------------------------------------------------


# NEW: Gemini-powered advisor for savings/payment optimization
# Helper: Gemini offers generator based on user inputs (do not modify gemini_process_load_advise)
def gemini_generate_offers(loan_amount, cash_available, tenure_months, bank_account, categories):
    try:
        net_financed = max(float(loan_amount or 0) - float(cash_available or 0), 0.0)
        tenure = int(tenure_months or 0)
        prompt = f"""
You are an Indian personal finance concierge.
Task: List CURRENT AVAILABLE OFFERS relevant to the user's loan and card situation.

STRICT OUTPUT:
Return ONLY a JSON array of 3–6 offers with this schema:
[
  {
    "provider": "string",        // bank or card issuer or portal
    "title": "string",           // concise offer title
    "type": "credit_card|cashback|emi|savings|reward",
    "eligibility": "string",     // who qualifies
    "valid_till": "YYYY-MM-DD",  // best guess if unknown, use null
    "benefits": ["string", ...],
    "estimated_value": integer,   // INR annualized or total benefit, conservative
    "link": "string|null"        // official page if known, else null
  }
]
- All currency values MUST be integers.
- Include at least one offer from the preferred_bank if relevant.
- Ground offers to user categories when provided (e.g., online, shopping, fuel, dining).
- Prefer widely known evergreen offers or typical bank reward constructs.

INPUTS:
- loan_amount: ₹{int(loan_amount or 0)}
- cash_available: ₹{int(cash_available or 0)}
- net_financed: ₹{int(net_financed)}
- tenure_months: {tenure}
- preferred_bank: {bank_account}
- top_categories: {json.dumps(categories or {}, ensure_ascii=False)}

GUIDANCE:
- Examples of typical offers: welcome bonus, milestone spends, fuel surcharge waiver, bill payment cashback, online portal rewards, EMI low-interest campaign.
- Use conservative estimates for benefit: online/shopping 1.5–5%, dining 1–3%, fuel 0.75–1%.
- Avoid hallucinating specific URLs; if unsure, set link to null.
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048,
                "responseMimeType": "application/json"
            }
        }
        r = requests.post(f"{GEN_URL}?key={API_KEY}", json=payload, timeout=60)
        result = r.json()
        txt = None
        try:
            txt = result["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            txt = None
        if txt:
            if txt.strip().startswith("["):
                return json.loads(txt)
            m = re.search(r"\[[\s\S]*\]", txt)
            if m:
                return json.loads(m.group(0))
        return []
    except Exception as e:
        print("gemini_generate_offers error:", e)
        return []


@app.route("/loan_advisor_ai", methods=["POST"])
def loan_advisor_ai():
    try:
        data = request.json or {}
        loan_amount = float(data.get("loanAmount", 0) or 0)
        cash_available = float(data.get("cashAvailable", 0) or 0)
        tenure_months = int(data.get("tenureMonths", 0) or 0)
        bank_account = str(data.get("ownedCardBank", "")).strip()
        summary = data.get("summary") or {}
        categories = summary.get("category_summary", {}) if isinstance(summary, dict) else {}
        monthly = summary.get("monthly_summary", {}) if isinstance(summary, dict) else {}

        advisor = gemini_process_load_advise(loan_amount, cash_available, tenure_months, bank_account, categories, monthly)
        offers = gemini_generate_offers(loan_amount, cash_available, tenure_months, bank_account, categories)

        # Fallback if model fails
        net_financed = max(loan_amount - cash_available, 0)
        emi = int(net_financed / tenure_months) if tenure_months > 0 else int(net_financed)
        if not advisor:
            advisor = {
                "overview": "Use your existing card for online/shopping categories and allocate a fixed EMI each month. Consider auto-sweep FDs for idle cash.",
                "emi": emi,
                "est_benefit": int(emi * 12 * 0.03),
                "actions": [
                    "Fix a monthly EMI allocation equal to EMI",
                    "Enable auto-sweep FD on savings to earn interest",
                    "Route eligible spends through cashback/reward categories",
                    "Consolidate bill payments on a single portal to track rewards",
                ],
                "suggested_products": [
                    {
                        "bank": bank_account or "Your Bank",
                        "product": "Savings + Auto-sweep FD",
                        "reason": "Higher yield on idle balances while paying EMI",
                        "categories": ["savings", "online", "shopping"],
                        "est_annual_benefit": int(emi * 12 * 0.02)
                    }
                ]
            }

        # Attach offers or fallback offers
        if not offers:
            offers = [
                {
                    "provider": bank_account or "Your Bank",
                    "title": "Bill payment cashback",
                    "type": "cashback",
                    "eligibility": "Active savings/credit card users",
                    "valid_till": None,
                    "benefits": ["1-2% cashback on utility/bill payments", "Waiver on convenience fees on select portals"],
                    "estimated_value": int(emi * 12 * 0.01),
                    "link": None
                },
                {
                    "provider": bank_account or "Your Bank",
                    "title": "Fuel surcharge waiver",
                    "type": "reward",
                    "eligibility": "Select bank cards",
                    "valid_till": None,
                    "benefits": ["1% fuel surcharge waiver at partner pumps"],
                    "estimated_value": int(emi * 12 * 0.005),
                    "link": None
                }
            ]
        advisor["available_offers"] = offers

        return jsonify({"loan_advisor": advisor}), 200
    except Exception as e:
        print("loan_advisor_ai error:", e)
        # Graceful fallback
        loan_amount = float((request.json or {}).get("loanAmount", 0) or 0)
        cash_available = float((request.json or {}).get("cashAvailable", 0) or 0)
        tenure_months = int((request.json or {}).get("tenureMonths", 0) or 0)
        bank_account = str((request.json or {}).get("ownedCardBank", "")).strip()
        net_financed = max(loan_amount - cash_available, 0)
        emi = int(net_financed / tenure_months) if tenure_months > 0 else int(net_financed)
        fallback = {
            "overview": "Allocate a fixed EMI each month and maximize rewards on your top spend categories.",
            "emi": emi,
            "est_benefit": int(emi * 12 * 0.03),
            "actions": [
                "Automate EMI payment from a dedicated account",
                "Enable auto-sweep FD for idle funds",
                "Use card on categories with best rewards",
                "Review statements quarterly to optimize",
            ],
            "suggested_products": [
                {
                    "bank": bank_account or "Your Bank",
                    "product": "Savings + Auto-sweep FD",
                    "reason": "Conservative yield on idle balances",
                    "categories": ["savings"],
                    "est_annual_benefit": int(emi * 12 * 0.02)
                }
            ],
            "available_offers": [
                {
                    "provider": bank_account or "Your Bank",
                    "title": "Utility bill cashback",
                    "type": "cashback",
                    "eligibility": "Payments via bank app/card",
                    "valid_till": None,
                    "benefits": ["Up to 1% on BBPS/utility payments"],
                    "estimated_value": int(emi * 12 * 0.01),
                    "link": None
                }
            ]
        }
        return jsonify({"loan_advisor": fallback}), 200




if __name__ == "__main__":
    app.run(port=5000, debug=True)

