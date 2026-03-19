"""
@file constraints.py
@description Solver constraint enforcement.
             Applies all business rules and mathematical limits to WIMPER and SIMERP values.

Key constraints from SOW:
- WIMPER must always be greater than SIMERP
- Both values must be non-negative
- Combined deductions cannot exceed available wages
- Each employee is solved independently
"""

# Maximum allowable deduction as fraction of gross wages (safety cap)
MAX_DEDUCTION_RATIO = 0.50


def apply_constraints(wimper, simerp, gross_wages, total_benefits):
    """
    Apply all business rule constraints to WIMPER and SIMERP values.

    Args:
        wimper (float): Proposed WIMPER amount
        simerp (float): Proposed SIMERP amount
        gross_wages (float): Employee gross wages
        total_benefits (float): Existing benefit deductions

    Returns:
        tuple: (constrained_wimper, constrained_simerp)
    """
    # Constraint 1: Both values must be non-negative
    wimper = max(0.0, wimper)
    simerp = max(0.0, simerp)

    # Constraint 2: WIMPER must be strictly greater than SIMERP
    if wimper <= simerp and simerp > 0:
        # Reduce SIMERP to be slightly below WIMPER
        simerp = wimper * 0.90

    # Constraint 3: Total hybrid deductions cannot exceed safety cap
    max_total_deduction = gross_wages * MAX_DEDUCTION_RATIO
    total_hybrid_deductions = total_benefits + wimper + simerp

    if total_hybrid_deductions > max_total_deduction:
        # Scale down proportionally to fit within cap
        available = max(0, max_total_deduction - total_benefits)
        total_new = wimper + simerp
        if total_new > 0:
            scale = available / total_new
            wimper = wimper * scale
            simerp = simerp * scale

    # Constraint 4: Re-check WIMPER > SIMERP after scaling
    if wimper <= simerp:
        simerp = wimper * 0.90

    return round(wimper, 2), round(simerp, 2)
