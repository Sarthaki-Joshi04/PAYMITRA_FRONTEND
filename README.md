<img width="620" height="102" alt="image" src="https://github.com/user-attachments/assets/d8dd825a-846a-48c1-98e8-1c4e17b32e59" />

# PayMitra Finance
PayMitra is a full-stack finance intelligence platform that analyzes user spending patterns and provides user with personalized financial insights, spending analytics, and loan optimization.

## 1. Project Structure
```
PayMitra
│
├── backend/
│   │   app.py
│   │   cards.json
│   │   requirements.txt
│   │
│   ├── templates/
│   │   └── index.html
│   │
│   └── uploads/
│       ├── bank statement.pdf
│       └── Statements.pdf
│
└── client/
    │   eslint.config.js
    │   index.html
    │   package-lock.json
    │   package.json
    │   postcss.config.js
    │   tailwind.config.js
    │   vite.config.js
    │
    ├── public/
    │   ├── DarkMode.png
    │   ├── LightMode.png
    │   └── vite.svg
    │
    └── src/
        │   App.jsx
        │   main.jsx
        │   App.css
        │   index.css
        │
        ├── assets/
        │   └── icons/
        │       (multiple icons and images)
        │
        ├── components/
        │   ├── Card.jsx
        │   ├── Dropdown.jsx
        │   ├── Upload/
        │   ├── charts/
        │   ├── layout/
        │   └── form/
        │
        ├── hooks/
        │   └── useTheme.js
        │
        ├── loaders/
        │   └── animations
        │
        ├── LoanPlanner/
        │   └── EMI planning components
        │
        ├── pages/
        │   ├── Dashboard
        │   ├── UploadPage
        │   ├── Analytics
        │   ├── AIAdvisor
        │   ├── Compare
        │   └── Settings
        │
        └── store/
            └── useAnalysisStore.js

```

<br>

<table>
  <tr>
    <td align="center" width="600">
      <img src="https://github.com/Yash-Bandal/PayMitra-Finance/blob/34429550935a874f988a8fdb3045dfac52eab2e6/client/src/assets/icons/dashboard%20(2).png" width="300"/>
      <br>
      <b>Main Dashboard</b>
    </td>
    <td align="center" width="600">
      <img src="https://github.com/Yash-Bandal/PayMitra-Finance/blob/300749756e82ec090b424b3f9876afe875726bfd/client/src/assets/icons/mvp.png" width="300"/>
      <br>
      <b>Load Planner</b>
    </td>
  </tr>
</table>

<br>

## 2. Getting Started
### 2.1 Backend Setup

1. Navigate to backend directory:
```
cd backend
```

2. Create and activate virtual environment:
```
python -m venv myenv
myenv\Scripts\activate   
source myenv/bin/activate
```
3. Install dependencies:

```
pip install -r requirements.txt
```


4. Start backend server:
```
python app.py
```

The server should run at:
```
http://127.0.0.1:5000
```

Update endpoints in frontend if different.

<br>

### 2.2 Frontend Setup
1. Navigate to client folder:
```
cd client
```

2. Install dependencies:
```
npm install
```

3. Start frontend:
```
npm run dev
```

4. Open browser:
```
http://localhost:5173
```

<br>

## 3. Feaatures
- AI-based bank statement PDF analysis
- Automatic transaction extraction (date, amount, category, method)
- Sensitive data masking 
- Spending summary: total credit, total debit, net balance
- Category-wise spending analysis

<br>

## 4. Technologies Used
**Backend:** Flask, MongoDB, PyMuPDF, pdfplumber, pandas, Google Gemini API\
**Frontend:** React, Tailwind, Zustand, Vite\
**Tools:** Axios, Lucide Icons, Custom Hooks, React Hook Form

<br>

## 5. License
[MIT License](https://github.com/Yash-Bandal/PayMitra-Finance/blob/02c8d07f2b3b4183378f2c62ef532056cbd21d85/LICENSE)

<br>






