"""
@file simerp.py
@description SIMERP (Section 105) calculation logic.
             SIMERP is an employer-funded medical expense reimbursement.
             It is non-taxable to the employee and tax-deductible for the employer.
             SIMERP must always be less than WIMPER.
"""


def calculate_simerp(wimper: float, ratio: float = 0.6) -> float:
    """
    Calculates SIMERP as a ratio of WIMPER.
    Default ratio is 0.6 (SIMERP = 60% of WIMPER).
    This ensures WIMPER > SIMERP constraint is always satisfied.

    @param wimper: Calculated WIMPER amount
    @param ratio: SIMERP to WIMPER ratio (must be < 1.0)
    @returns: Calculated SIMERP amount
    """
    if ratio >= 1.0:
        raise ValueError('SIMERP ratio must be less than 1.0 to ensure WIMPER > SIMERP')

    return round(wimper * ratio, 2)


def calculate_total_hybrid_savings(wimper: float, simerp: float, gross_pay: float) -> float:
    """
    Calculates total savings from combining WIMPER + SIMERP.
    Includes employee FICA savings and employer FICA savings.

    @param wimper: Section 125 pre-tax deduction
    @param simerp: Section 105 reimbursement
    @param gross_pay: Employee gross pay
    @returns: Total estimated payroll tax savings
    """
    FICA_RATE = 0.0765
    taxable_gross = max(0, gross_pay - wimper)

    employee_savings = round((gross_pay - taxable_gross) * FICA_RATE, 2)
    employer_savings = round(wimper * FICA_RATE, 2)

    return round(employee_savings + employer_savings, 2)
