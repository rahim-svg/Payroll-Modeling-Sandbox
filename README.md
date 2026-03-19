# MoTek Payroll Modeling Sandbox

Internal payroll simulation tool for modeling Normal vs Hybrid payroll scenarios using WIMPER (Section 125) and SIMERP (Section 105) strategies.

> **Sandbox Only** — This tool is not for production payroll operations. All runs are ephemeral with no YTD tracking or persistent employee records.

---

## Architecture

```
client/     → React + Vite frontend (shadcn/ui + Tailwind)
server/     → Node.js + Express backend (MVC)
solver/     → Python WIMPER/SIMERP iterative solver
```

**Flow:** Upload Census → Validate → Python Solver → Rollfi (Mock) → Comparison → Export

---

## Prerequisites

- Node.js v18+
- Python 3.x
- MongoDB (local or Docker)
- npm or yarn

---

## Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/rahim-svg/Payroll-Modeling-Sandbox.git
cd Payroll-Modeling-Sandbox
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
```

### 3. Seed the database (creates the 2 default users)

```bash
npm run seed
```

This creates:
- `admin@motek.com` / `MoTek@2024`
- `analyst@motek.com` / `MoTek@2024`

### 4. Start the backend

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Set up the frontend (new terminal)

```bash
cd client
npm install
cp .env.example .env
```

### 6. Start the frontend

```bash
npm run dev
# App runs on http://localhost:3000
```

### 7. Verify Python solver works

```bash
cd solver
echo '[{"employee_id":"EMP001","gross_wages":3500,"vcamp_target":200,"medical_ee":150,"dental_ee":25,"vision_ee":10,"debit_card":50,"ancillary":25}]' | python3 solver.py
```

Expected output: JSON with `wimper`, `simerp`, `iterations`, and `status` per employee.

---

## Docker Setup

```bash
# Start all services
docker-compose up

# Run seed after containers start
docker exec motek_server npm run seed
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/motek_payroll` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | — |
| `JWT_EXPIRES_IN` | Token expiry | `8h` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:3000` |
| `ROLLFI_MOCK` | Use mock Rollfi data | `true` |
| `ROLLFI_API_URL` | Real Rollfi API URL | — |
| `ROLLFI_API_KEY` | Real Rollfi API key | — |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |

---

## Rollfi Integration

Rollfi is currently **mocked**. When you receive Rollfi API credentials:

1. Set `ROLLFI_MOCK=false` in `server/.env`
2. Set `ROLLFI_API_URL` and `ROLLFI_API_KEY`
3. Implement the real API call in `server/src/services/rollfi.service.js` inside `callRollfiAPI()`

No other code changes needed.

---

## Supported Workflows

### Bulk Payroll Run
1. Download census template from the Template page
2. Fill in employee data
3. Upload on the Bulk Run page
4. View comparison results and export to Excel

### Single Employee Run
1. Go to Single Employee page
2. Fill in the form manually
3. Run simulation
4. View results

---

## Default Users

| Email | Password | Role |
|---|---|---|
| admin@motek.com | MoTek@2024 | Admin |
| analyst@motek.com | MoTek@2024 | Analyst |

---

## Important Notes

- All payroll results are **temporary** — stored in server memory only
- Closing or restarting the server clears all run results
- Export your Excel report before closing the browser
- This is a **sandbox** — Rollfi is the authoritative source for real payroll numbers
