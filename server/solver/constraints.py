"""
@file constraints.py
@description Hard and soft constraint rules for the WIMPER + SIMERP solver.
             All constraints must be satisfied before a solution is accepted.
             Hard constraints are non-negotiable.
             Soft constraints define the solving tolerance.
"""

# ─────────────────────────────────────────
# HARD CONSTRAINT LIMITS
# ─────────────────────────────────────────

# Maximum WIMPER as a fraction of gross pay (Section 125 limit)
WIMPER_MAX_RATIO = 0.40        # WIMPER <= grossPay * 40%

# Maximum SIMERP as a fraction of gross pay (Section 105 limit)
SIMERP_MAX_RATIO = 0.30        # SIMERP <= grossPay * 30%

# Maximum combined WIMPER + SIMERP as a fraction of gross pay
COMBINED_MAX_RATIO = 0.60      # WIMPER + SIMERP <= grossPay * 60%

# Maximum solver iterations before giving up
MAX_ITERATIONS = 25

# Minimum allowed value for either WIMPER or SIMERP
MIN_VALUE = 0.01

# ─────────────────────────────────────────
# SOFT CONSTRAINT (TOLERANCE)
# ─────────────────────────────────────────

# Acceptable deviation from VCAMP target (±5%)
TOLERANCE_PCT = 0.05

# ─────────────────────────────────────────
# INITIAL GUESS RATIOS
# ─────────────────────────────────────────

# Starting guess for WIMPER as fraction of gross pay
INITIAL_WIMPER_RATIO = 0.25

# Starting guess for SIMERP as fraction of gross pay
INITIAL_SIMERP_RATIO = 0.15

# Adjustment step size per iteration
ADJUSTMENT_FACTOR_UP = 1.05    # Increase by 5% per step
ADJUSTMENT_FACTOR_DOWN = 0.95  # Decrease by 5% per step


def check_hard_constraints(wimper: float, simerp: float, gross_pay: float) -> tuple[bool, list]:
    """
    Validate all hard constraints for a given WIMPER + SIMERP pair.

    Args:
        wimper (float):    Proposed WIMPER value
        simerp (float):    Proposed SIMERP value
        gross_pay (float): Employee gross pay per period

    Returns:
        tuple: (is_valid: bool, violations: list of str)
    """
    violations = []

    # WIMPER must be positive
    if wimper < MIN_VALUE:
        violations.append(f"WIMPER ({wimper:.2f}) must be >= {MIN_VALUE}")

    # SIMERP must be positive
    if simerp < MIN_VALUE:
        violations.append(f"SIMERP ({simerp:.2f}) must be >= {MIN_VALUE}")

    # WIMPER must be greater than SIMERP (always)
    if wimper <= simerp:
        violations.append(f"WIMPER ({wimper:.2f}) must be > SIMERP ({simerp:.2f})")

    # WIMPER cannot exceed 40% of gross pay
    wimper_max = gross_pay * WIMPER_MAX_RATIO
    if wimper > wimper_max:
        violations.append(f"WIMPER ({wimper:.2f}) exceeds max allowed ({wimper_max:.2f})")

    # SIMERP cannot exceed 30% of gross pay
    simerp_max = gross_pay * SIMERP_MAX_RATIO
    if simerp > simerp_max:
        violations.append(f"SIMERP ({simerp:.2f}) exceeds max allowed ({simerp_max:.2f})")

    # Combined cannot exceed 60% of gross pay
    combined_max = gross_pay * COMBINED_MAX_RATIO
    if wimper + simerp > combined_max:
        violations.append(f"Combined ({wimper + simerp:.2f}) exceeds max allowed ({combined_max:.2f})")

    # Combined cannot exceed gross pay
    if wimper + simerp >= gross_pay:
        violations.append(f"Combined ({wimper + simerp:.2f}) cannot exceed gross pay ({gross_pay:.2f})")

    return len(violations) == 0, violations


def enforce_hard_constraints(wimper: float, simerp: float, gross_pay: float) -> tuple[float, float]:
    """
    Clamp WIMPER and SIMERP to satisfy all hard constraints.
    Used inside the iteration loop to keep values in valid range.

    Args:
        wimper (float):    Current WIMPER value
        simerp (float):    Current SIMERP value
        gross_pay (float): Employee gross pay

    Returns:
        tuple: (adjusted_wimper, adjusted_simerp)
    """
    # Enforce minimums
    wimper = max(wimper, MIN_VALUE)
    simerp = max(simerp, MIN_VALUE)

    # Enforce individual maximums
    wimper = min(wimper, gross_pay * WIMPER_MAX_RATIO)
    simerp = min(simerp, gross_pay * SIMERP_MAX_RATIO)

    # Enforce WIMPER > SIMERP
    if wimper <= simerp:
        # Swap and adjust
        wimper, simerp = simerp * 1.1, wimper * 0.9
        wimper = min(wimper, gross_pay * WIMPER_MAX_RATIO)
        simerp = min(simerp, gross_pay * SIMERP_MAX_RATIO)

    # Enforce combined maximum
    combined = wimper + simerp
    combined_max = gross_pay * COMBINED_MAX_RATIO
    if combined > combined_max:
        # Scale both down proportionally
        scale = combined_max / combined
        wimper *= scale
        simerp *= scale

    return wimper, simerp


def is_within_tolerance(achieved: float, target: float) -> bool:
    """
    Check if achieved savings is within ±5% of VCAMP target.

    Args:
        achieved (float): Actual savings calculated
        target (float):   VCAMP target savings

    Returns:
        bool: True if within tolerance
    """
    if target <= 0:
        return False
    tolerance = target * TOLERANCE_PCT
    return abs(achieved - target) <= tolerance
