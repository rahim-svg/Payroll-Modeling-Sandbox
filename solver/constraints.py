"""
@file constraints.py
@description Solver constraint definitions.
             WIMPER must always be greater than SIMERP.
             Both must be non-negative.
             WIMPER cannot exceed gross pay.
"""


def validate_constraints(wimper: float, simerp: float, gross_pay: float) -> tuple[bool, str]:
    """
    Validates solver output against business rules.
    Returns (is_valid, error_message)
    """
    if wimper < 0:
        return False, 'WIMPER cannot be negative'

    if simerp < 0:
        return False, 'SIMERP cannot be negative'

    if wimper <= simerp:
        return False, f'WIMPER ({wimper}) must be greater than SIMERP ({simerp})'

    if wimper > gross_pay:
        return False, f'WIMPER ({wimper}) cannot exceed gross pay ({gross_pay})'

    return True, ''
