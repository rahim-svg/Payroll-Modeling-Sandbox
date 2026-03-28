# Payroll Solver — Python

This directory contains the Python solver for WIMPER (Section 125) and SIMERP (Section 105) calculations.

## Setup

```bash
cd solver
pip install -r requirements.txt
```

## How It Works

1. **Node.js** writes employee data as JSON to a temp file
2. **Node.js** spawns: `python3 solver.py <input_file.json>`
3. **solver.py** reads the input, runs the iterative solver per employee
4. **solver.py** prints JSON results to stdout
5. **Node.js** reads stdout and parses the results

## Files

| File | Description |
|---|---|
| `solver.py` | Main entry point |
| `wimper.py` | Section 125 savings calculation |
| `simerp.py` | Section 105 savings calculation |
| `constraints.py` | Hard + soft constraint rules |
| `models.py` | Python data models |
| `requirements.txt` | Python dependencies |

## Test Manually

Create a test input file `test_input.json`:

```json
[
  {
    "employeeId": "E001",
    "firstName": "John",
    "lastName": "Doe",
    "grossPay": 5000,
    "payFrequency": "biweekly",
    "filingStatus": "single",
    "state": "TX",
    "benefits": {
      "medical": 200,
      "dental": 50,
      "vision": 20,
      "debitCard": 100,
      "ancillary": 30
    },
    "vcampTarget": 800
  }
]
```

Run:
```bash
python3 solver.py test_input.json
```

Expected output:
```json
[
  {
    "employeeId": "E001",
    "wimper": 1250.00,
    "simerp": 750.00,
    "solveStatus": "solved",
    "iterations": 7,
    "achievedSavings": 798.50,
    "vcampTarget": 800,
    "achievementPct": 99.81
  }
]
```

## Constraints

| Constraint | Rule |
|---|---|
| WIMPER max | ≤ 40% of gross pay |
| SIMERP max | ≤ 30% of gross pay |
| Combined max | ≤ 60% of gross pay |
| WIMPER > SIMERP | Always enforced |
| Tolerance | ±5% of VCAMP target |
| Max iterations | 25 |
