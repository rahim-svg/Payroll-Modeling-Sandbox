"""
@file models.py
@description Data models / dataclasses for solver input and output.
             Used for type safety and documentation within the Python solver.
"""
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class EmployeeInput:
    """Input record for a single employee from the census file."""
    employee_id: str
    first_name: str
    last_name: str
    pay_frequency: str
    gross_wages: float
    filing_status: str
    federal_allowances: int
    state: str
    medical_ee: float = 0.0
    medical_er: float = 0.0
    dental_ee: float = 0.0
    dental_er: float = 0.0
    vision_ee: float = 0.0
    vision_er: float = 0.0
    debit_card: float = 0.0
    ancillary: float = 0.0
    vcamp_target: float = 0.0
    ssn_last4: Optional[str] = None


@dataclass
class SolverResult:
    """Output from the solver for a single employee."""
    employee_id: str
    wimper: float
    simerp: float
    iterations: int
    status: str  # 'converged' | 'partial' | 'not_converged'
    vcamp_target: float
