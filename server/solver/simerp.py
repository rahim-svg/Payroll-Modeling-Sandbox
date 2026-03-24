"""
@file simerp.py
@description SIMERP (Section 105 Health Reimbursement Arrangement) calculation logic.
             SIMERP is a post-deduction HRA that reduces:
               1. Federal income tax
               2. State income tax
             IMPORTANT: SIMERP does NOT reduce FICA.
             This makes SIMERP less powerful than WIMPER per dollar.
"""

from wimper import (
    calculate_federal_tax,
    get_state_tax_rate,
    STATE_TAX_RATES
)


def calculate_simerp_savings(
    gross_pay: float,
    simerp: float,
    filing_status: str,
    state: str
) -> float:
    """
    Calculate total tax savings from SIMERP (Section 105 HRA) deduction.

    SIMERP reduces:
      - Federal income tax (applied to reduced taxable income)
      - State income tax (applied to reduced taxable income)
    SIMERP does NOT reduce:
      - FICA (Social Security + Medicare) — this is the key difference from WIMPER

    Formula:
      taxableIncome  = grossPay - simerp
      federalSavings = federalTax(gross) - federalTax(taxable)
      stateSavings   = grossPay * stateRate - taxableIncome * stateRate
      total          = federalSavings + stateSavings
      (NO fica savings)

    Args:
        gross_pay (float):     Employee gross pay per period
        simerp (float):        SIMERP deduction amount
        filing_status (str):   single | married | head_of_household
        state (str):           2-letter state code

    Returns:
        float: Total employee tax savings from SIMERP (no FICA savings)
    """
    if simerp <= 0:
        return 0.0

    # Taxable income after SIMERP deduction
    taxable_income = max(0.0, gross_pay - simerp)

    # Federal tax before and after SIMERP
    federal_tax_before = calculate_federal_tax(gross_pay, filing_status)
    federal_tax_after = calculate_federal_tax(taxable_income, filing_status)
    federal_savings = federal_tax_before - federal_tax_after

    # State tax savings (flat rate applied to reduction)
    state_rate = get_state_tax_rate(state)
    state_savings = simerp * state_rate

    # NO FICA savings for SIMERP — this is the critical difference
    total_savings = federal_savings + state_savings
    return max(0.0, total_savings)


def calculate_combined_savings(
    gross_pay: float,
    wimper: float,
    simerp: float,
    filing_status: str,
    state: str
) -> float:
    """
    Calculate total savings from BOTH WIMPER and SIMERP combined.
    Used by the solver to measure against VCAMP target.

    IMPORTANT: Federal and state taxes are calculated on
    (grossPay - wimper - simerp) — both reduce taxable income.
    FICA is only reduced by WIMPER.

    Args:
        gross_pay (float):     Employee gross pay per period
        wimper (float):        WIMPER deduction amount
        simerp (float):        SIMERP deduction amount
        filing_status (str):   single | married | head_of_household
        state (str):           2-letter state code

    Returns:
        float: Total combined employee tax savings
    """
    if wimper <= 0 and simerp <= 0:
        return 0.0

    # Taxable income reduced by BOTH wimper and simerp
    taxable_income = max(0.0, gross_pay - wimper - simerp)

    # Federal tax savings (on combined reduction)
    federal_tax_before = calculate_federal_tax(gross_pay, filing_status)
    federal_tax_after = calculate_federal_tax(taxable_income, filing_status)
    federal_savings = federal_tax_before - federal_tax_after

    # State tax savings (on combined reduction)
    state_rate = get_state_tax_rate(state)
    state_savings = (wimper + simerp) * state_rate

    # FICA savings — ONLY from WIMPER (not SIMERP)
    fica_savings = wimper * 0.0765

    total_savings = federal_savings + state_savings + fica_savings
    return max(0.0, total_savings)
