"""
@file wimper.py
@description WIMPER (Section 125 Cafeteria Plan) deduction calculator.
             WIMPER is the pre-tax payroll deduction used in the hybrid strategy.
             It reduces taxable income, generating FICA tax savings for both
             the employee and employer.

Section 125 allows employees to pay for qualified benefits with pre-tax dollars,
reducing their federal income tax, Social Security, and Medicare withholdings.
"""

# Approximate FICA rate (SS 6.2% + Medicare 1.45%)
FICA_RATE = 0.0765

# Federal income tax estimate (simplified flat rate for solver)
FEDERAL_TAX_RATE = 0.12


def calculate_wimper(gross_wages, vcamp_target, total_benefits, simerp):
    """
    Calculate the WIMPER deduction amount for an employee.

    WIMPER is derived from the VCAMP target, working backwards from the desired
    tax savings amount to find the required pre-tax deduction.

    The relationship:
    Tax Savings = WIMPER * (FICA_RATE + FEDERAL_TAX_RATE)
    Therefore: WIMPER = Tax Savings / (FICA_RATE + FEDERAL_TAX_RATE)

    Args:
        gross_wages (float): Employee gross wages per pay period
        vcamp_target (float): Desired payroll tax savings (VCAMP target)
        total_benefits (float): Existing pre-tax benefit deductions
        simerp (float): Current SIMERP value from previous iteration

    Returns:
        float: Calculated WIMPER deduction amount
    """
    if vcamp_target <= 0 or gross_wages <= 0:
        return 0.0

    combined_rate = FICA_RATE + FEDERAL_TAX_RATE

    # Portion of VCAMP target allocated to WIMPER savings
    # WIMPER generates savings through pre-tax treatment
    wimper_savings_target = vcamp_target * 0.6  # 60% of target via WIMPER

    # Back-calculate required WIMPER deduction
    wimper = wimper_savings_target / combined_rate if combined_rate > 0 else 0

    # WIMPER cannot exceed available taxable wages after existing benefits
    max_wimper = max(0, gross_wages - total_benefits - simerp)
    wimper = min(wimper, max_wimper)

    return round(max(0, wimper), 2)
