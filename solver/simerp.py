"""
@file simerp.py
@description SIMERP (Section 105 Health Reimbursement) calculator.
             SIMERP is an employer-funded reimbursement under Section 105(b).
             It provides additional tax savings that complement the WIMPER deduction.

Section 105 allows employers to reimburse employees for qualified medical
expenses tax-free, reducing the employer's payroll tax obligations.
"""

# FICA rate for tax savings calculation
FICA_RATE = 0.0765


def calculate_simerp(gross_wages, wimper, vcamp_target, total_benefits):
    """
    Calculate the SIMERP reimbursement amount for an employee.

    SIMERP handles the remaining portion of the VCAMP target
    that WIMPER alone cannot satisfy.

    The constraint WIMPER > SIMERP must always be maintained.

    Args:
        gross_wages (float): Employee gross wages per pay period
        wimper (float): Calculated WIMPER amount from current iteration
        vcamp_target (float): Desired payroll tax savings (VCAMP target)
        total_benefits (float): Existing pre-tax benefit deductions

    Returns:
        float: Calculated SIMERP reimbursement amount
    """
    if vcamp_target <= 0 or gross_wages <= 0:
        return 0.0

    # Remaining savings target after WIMPER contribution
    wimper_savings = wimper * FICA_RATE
    remaining_target = max(0, vcamp_target - wimper_savings)

    # Back-calculate SIMERP from remaining savings target
    simerp = remaining_target / FICA_RATE if FICA_RATE > 0 else 0

    # SIMERP must be less than WIMPER per constraint
    simerp = min(simerp, wimper * 0.95)  # Keep SIMERP below WIMPER

    # SIMERP cannot push total deductions beyond gross wages
    max_simerp = max(0, gross_wages - total_benefits - wimper)
    simerp = min(simerp, max_simerp)

    return round(max(0, simerp), 2)
