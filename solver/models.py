"""
@file models.py
@description Data models (dataclasses) for the solver.
             Defines the input and output structure for each employee.
"""
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Benefits:
    medical: float = 0.0
    dental: float = 0.0
    vision: float = 0.0
    debit_card: float = 0.0
    ancillary: float = 0.0

    @property
    def total(self) -> float:
        return self.medical + self.dental + self.vision + self.debit_card + self.ancillary


@dataclass
class EmployeeInput:
    employee_id: str
    gross_pay: float
    pay_schedule: str
    filing_status: str
    state: str
    vcamp: float  # Target payroll tax savings
    benefits: Benefits = field(default_factory=Benefits)


@dataclass
class SolveResult:
    employee_id: str
    wimper: float          # Section 125 pre-tax deduction
    simerp: float          # Section 105 employer reimbursement
    vcamp_target: float    # Original target
    achieved_savings: float  # Actual savings achieved
    iterations: int
    status: str            # 'solved', 'partial', 'failed'
    message: str = ''
