# MoTek Payroll Modeling Sandbox

Internal web-based payroll modeling tool for MoTek. Simulates Normal vs Hybrid payroll scenarios using WIMPER/SIMERP calculations via a Python solver and Rollfi as the payroll calculation engine.

---

## ⚠️ Important

This is a **sandbox simulation tool only**. It is not a payroll engine and does not perform production payroll operations. All runs are independent simulations with no persistent data storage.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind + shadcn/ui |
| Backend | Node.js + Express |
| Database | MongoDB (auth only) |
| Solver | Python 3 (WIMPER/SIMERP) |
| Payroll Engine | Rollfi API |
| Local Dev | Docker Compose |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (local or Atlas)
- Docker + Docker Compose (optional)

### 1. Clone the repo
```bash
git clone https://github.com/rahim-svg/Payroll-Modeling-Sandbox.git
cd Payroll-Modeling-Sandbox
```

### 2. Set up environment variables
```bash
# Backend
cp server/.env.example server/.env
# Fill in your values in server/.env

# Frontend
cp client/.env.example client/.env
```

### 3. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install

# Python solver
cd ../solver && pip install -r requirements.txt
```

### 4. Seed the database
```bash
cd server && npm run seed
```

### 5. Run the app
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

### OR — Run with Docker
```bash
docker-compose up --build
```

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@motek.com | MoTek@2024 |
| Analyst | analyst@motek.com | MoTek@2024 |

---

## 📁 Project Structure

```
Payroll-Modeling-Sandbox/
├── client/          → React frontend
├── server/          → Node.js + Express backend
├── solver/          → Python WIMPER/SIMERP solver
├── docker-compose.yml
└── README.md
```

---

## 🔄 Workflow

1. Upload payroll census Excel file
2. System validates and parses file
3. Python solver calculates WIMPER + SIMERP per employee
4. System submits both Normal and Hybrid scenarios to Rollfi
5. Results returned as before vs after comparison
6. Export Excel summary report

---

## 🌐 Rollfi Integration

Rollfi API is currently **mocked** for local development.
Set `ROLLFI_MOCK=false` in `server/.env` when real credentials are available.

---

## 📋 Census Template

Download the master payroll census template from the **Template** page in the UI,
or directly from `/api/export/template`.
