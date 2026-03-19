# MoTek Payroll Modeling Sandbox

An internal payroll simulation tool that models the financial impact of hybrid payroll strategies (WIMPER / SIMERP / VCAMP) against normal payroll — powered by a Python solver, Rollfi API integration, and a React frontend.

---

## ⚠️ Important

This is a **sandbox simulation tool only**. It is not a payroll engine and does not produce legally binding payroll outputs. All final payroll numbers come from Rollfi.

---

## 🏗️ Architecture

```
motek-payroll-engine/
├── client/          → React + Vite frontend
├── server/          → Node.js + Express backend
├── solver/          → Python WIMPER/SIMERP solver
└── docker-compose.yml
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/rahim-svg/Payroll-Modeling-Sandbox.git
cd Payroll-Modeling-Sandbox
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
```

### 3. Seed users
```bash
npm run seed
```

This creates two login accounts:
- `admin@motek.com` / `MoTek@2024`
- `analyst@motek.com` / `MoTek@2024`

### 4. Python solver setup
```bash
cd ../solver
pip install -r requirements.txt
```

### 5. Frontend setup
```bash
cd ../client
npm install
cp .env.example .env
```

### 6. Run everything

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
# Runs on http://localhost:3000
```

---

## 🐳 Docker (Alternative)

```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

See `server/.env.example` and `client/.env.example` for all required variables.

**Never commit `.env` files.**

---

## 📋 Workflows

### Bulk Payroll Run
1. Download census template from the app
2. Fill in employee data
3. Upload the file
4. System validates and runs solver
5. Both scenarios submitted to Rollfi
6. View before/after comparison
7. Export Excel summary

### Single Employee
1. Select single employee mode
2. Enter employee data manually
3. Run simulation
4. View results

---

## 🧠 Key Concepts

| Term | Meaning |
|---|---|
| WIMPER | Section 125 pre-tax deduction |
| SIMERP | Section 105 employer reimbursement |
| VCAMP | Per-employee payroll tax savings target |
| Normal Payroll | Payroll without hybrid strategy |
| Hybrid Payroll | Payroll with WIMPER + VCAMP + SIMERP applied |

---

## 👥 Users

Two seeded accounts (sandbox only):
- `admin@motek.com`
- `analyst@motek.com`

Both use password: `MoTek@2024`
