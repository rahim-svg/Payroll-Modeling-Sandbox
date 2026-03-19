# MoTek Payroll Modeling Sandbox

Internal simulation tool for comparing **Normal Payroll** vs **Hybrid Payroll** strategies using WIMPER (Section 125), VCAMP (Section 213d), and SIMERP (Section 105).

> ⚠️ **This is a sandbox simulation tool only. Not for production payroll operations.**

---

## Project Structure

```
motek-payroll-engine/
├── client/          → React + Vite frontend
├── server/          → Node.js + Express backend (coming soon)
├── solver/          → Python WIMPER/SIMERP solver (coming soon)
└── README.md
```

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/rahim-svg/Payroll-Modeling-Sandbox.git
cd Payroll-Modeling-Sandbox

# 2. Navigate to client
cd client

# 3. Install dependencies
npm install

# 4. Create your .env file
cp .env.example .env

# 5. Start the development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

> The frontend proxies all `/api` requests to the backend at `http://localhost:5000`.
> Make sure the backend server is running before testing API features.

---

## Default Login Credentials (Seeded)

| Email | Password | Role |
|---|---|---|
| admin@motek.com | MoTek@2024 | Admin |
| analyst@motek.com | MoTek@2024 | Analyst |

> Credentials are seeded by the backend on first run.

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | JWT authentication |
| `/dashboard` | Dashboard | Overview and quick start |
| `/bulk-run` | Bulk Run | Upload census file for multi-employee simulation |
| `/single-employee` | Single Employee | Manual entry for one employee |
| `/results/:runId` | Results | Before/after comparison, register, paychecks |
| `/template` | Template | Download census Excel template |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| UI | Tailwind CSS + shadcn/ui (Radix) |
| State | React Query + Context API |
| Forms | React Hook Form |
| HTTP | Axios |
| Charts | Recharts |
| Routing | React Router v6 |

---

## Architecture

```
User → React Frontend
         ↓
    Express Backend
         ↓
    Python Solver (child_process)
         ↓
    Rollfi API (mocked for sandbox)
         ↓
    Results → Frontend → Excel Export
```

---

## Out of Scope

- Production payroll operations
- YTD tracking or payroll history
- Persistent employee records
- Gross-to-net payroll calculations outside Rollfi
- Multi-tenant or multi-client management
- Mobile apps

---

## Team

- **MoTek** — Business rules, UAT, Rollfi coordination
- **Paklogics** — Full system development
- **Rollfi** — Payroll calculation engine (authoritative source)
