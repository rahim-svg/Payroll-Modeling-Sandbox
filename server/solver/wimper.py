"""
@file wimper.py
@description WIMPER (Section 125 Cafeteria Plan) calculation logic.
             WIMPER is a pre-tax deduction that reduces:
               1. Federal income tax
               2. State income tax
               3. FICA (Social Security + Medicare) — 7.65%
             This makes WIMPER more powerful than SIMERP in terms of tax savings.
"""

from typing import Dict

# ─────────────────────────────────────────
# STATE TAX RATES LOOKUP TABLE
# ─────────────────────────────────────────
# Simplified flat-rate state income tax rates
# No-income-tax states: TX, FL, NV, WA, WY, SD, AK, NH, TN
STATE_TAX_RATES: Dict[str, float] = {
    'AL': 0.050, 'AK': 0.000, 'AZ': 0.025, 'AR': 0.055,
    'CA': 0.093, 'CO': 0.044, 'CT': 0.050, 'DE': 0.066,
    'FL': 0.000, 'GA': 0.055, 'HI': 0.080, 'ID': 0.058,
    'IL': 0.049, 'IN': 0.032, 'IA': 0.060, 'KS': 0.057,
    'KY': 0.045, 'LA': 0.042, 'ME': 0.075, 'MD': 0.050,
    'MA': 0.050, 'MI': 0.043, 'MN': 0.098, 'MS': 0.050,
    'MO': 0.054, 'MT': 0.069, 'NE': 0.068, 'NV': 0.000,
    'NH': 0.000, 'NJ': 0.089, 'NM': 0.059, 'NY': 0.068,
    'NC': 0.052, 'ND': 0.029, 'OH': 0.040, 'OK': 0.050,
    'OR': 0.099, 'PA': 0.031, 'RI': 0.060, 'SC': 0.070,
    'SD': 0.000, 'TN': 0.000, 'TX': 0.000, 'UT': 0.048,
    'VT': 0.086, 'VA': 0.058, 'WA': 0.000, 'WV': 0.065,
    'WI': 0.077, 'WY': 0.000, 'DC': 0.085
}

# FICA rate (employee side) = Social Security (6.2%) + Medicare (1.45%)
FICA_RATE = 0.0765

# Employer FICA rate (same as employee)
EMPLOYER_FICA_RATE = 0.0765


def get_state_tax_rate(state: str) -> float:
    """
    Get state income tax rate by 2-letter state code.
    Defaults to 5% if state code is not found.

    Args:
        state (str): 2-letter state code (e.g., 'TX', 'CA')

    Returns:
        float: State tax rate as decimal (e.g., 0.093 for 9.3%)
    """
    return STATE_TAX_RATES.get(state.upper(), 0.05)


def calculate_federal_tax(taxable_income: float, filing_status: str) -> float:
    """
    Calculate federal income tax using simplified tax brackets.
    Brackets are per-pay-period (not annual) for simplicity.

    Brackets used (simplified per-period):
      single/head_of_household:
        0     - 10,000  → 10%
        10,001 - 41,000 → 12%
        41,001+         → 22%

      married:
        0     - 20,000  → 10%
        20,001 - 81,000 → 12%
        81,001+         → 22%

    Args:
        taxable_income (float): Income after pre-tax deductions
        filing_status (str):    single | married | head_of_household

    Returns:
        float: Calculated federal income tax
    """
    if taxable_income <= 0:
        return 0.0

    if filing_status == 'married':
        # Married filing jointly brackets (per period)
        if taxable_income <= 20000:
            tax = taxable_income * 0.10
        elif taxable_income <= 81000:
            tax = 2000 + (taxable_income - 20000) * 0.12
        else:
            tax = 9320 + (taxable_income - 81000) * 0.22
    else:
        # Single and head_of_household brackets (per period)
        if taxable_income <= 10000:
            tax = taxable_income * 0.10
        elif taxable_income <= 41000:
            tax = 1000 + (taxable_income - 10000) * 0.12
        else:
            tax = 4720 + (taxable_income - 41000) * 0.22

    return max(0.0, tax)


def calculate_wimper_savings(
    gross_pay: float,
    wimper: float,
    filing_status: str,
    state: str
) -> float:
    """
    Calculate total tax savings from WIMPER (Section 125) deduction.

    WIMPER reduces:
      - Federal income tax (applied to reduced taxable income)
      - State income tax (applied to reduced taxable income)
      - FICA (7.65% of WIMPER amount — both employee and employer)

    Formula:
      taxableIncome = grossPay - wimper
      federalSavings = federalTax(gross) - federalTax(taxable)
      stateSavings   = grossPay * stateRate - taxableIncome * stateRate
      ficaSavings    = wimper * 0.0765
      total          = federalSavings + stateSavings + ficaSavings

    Args:
        gross_pay (float):     Employee gross pay per period
        wimper (float):        WIMPER deduction amount
        filing_status (str):   single | married | head_of_household
        state (str):           2-letter state code

    Returns:
        float: Total employee tax savings from WIMPER
    """
    if wimper <= 0:
        return 0.0

    # Taxable income after WIMPER deduction
    taxable_income = max(0.0, gross_pay - wimper)

    # Federal tax before and after WIMPER
    federal_tax_before = calculate_federal_tax(gross_pay, filing_status)
    federal_tax_after = calculate_federal_tax(taxable_income, filing_status)
    federal_savings = federal_tax_before - federal_tax_after

    # State tax savings (flat rate applied to reduction)
    state_rate = get_state_tax_rate(state)
    state_savings = wimper * state_rate

    # FICA savings — WIMPER reduces FICA base (Section 125 benefit)
    fica_savings = wimper * FICA_RATE

    total_savings = federal_savings + state_savings + fica_savings
    return max(0.0, total_savings)


def get_wimper_employer_savings(wimper: float) -> float:
    """
    Calculate employer FICA savings from WIMPER.
    Employer also saves 7.65% on the WIMPER amount.

    Args:
        wimper (float): WIMPER deduction amount

    Returns:
        float: Employer FICA savings
    """
    return wimper * EMPLOYER_FICA_RATE
