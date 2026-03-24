"""
@file models.py
@description Python data models for the Payroll Modeling Sandbox solver.
             Defines Employee input model and SolveResult output model.
             Used by solver.py, wimper.py and simerp.py.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Benefits:
    """
    Employee benefit deductions per pay period.
    All values are optional — default to 0 if not provided.
    """
    medical: float = 0.0
    dental: float = 0.0
    vision: float = 0.0
    debit_card: float = 0.0
    ancillary: float = 0.0

    @property
    def total(self) -> float:
        """Total benefits deductions per pay period."""
        return self.medical + self.dental + self.vision + self.debit_card + self.ancillary


@dataclass
class Employee:
    """
    Employee input model — data passed from Node.js to Python solver.
    Represents a single employee's payroll data for one pay period.
    """
    employee_id: str
    first_name: str
    last_name: str
    gross_pay: float                  # Per pay period gross pay
    pay_frequency: str                # weekly | biweekly | semimonthly | monthly
    filing_status: str                # single | married | head_of_household
    state: str                        # 2-letter state code (TX, CA, NY, etc.)
    benefits: Benefits                # Benefit deductions
    vcamp_target: float               # Target savings per pay period

    def __post_init__(self):
        """Validate required fields after initialization."""
        if self.gross_pay <= 0:
            raise ValueError(f"Employee {self.employee_id}: gross_pay must be > 0")
        if self.vcamp_target <= 0:
            raise ValueError(f"Employee {self.employee_id}: vcamp_target must be > 0")
        if self.pay_frequency not in ['weekly', 'biweekly', 'semimonthly', 'monthly']:
            raise ValueError(f"Employee {self.employee_id}: invalid pay_frequency '{self.pay_frequency}'")
        if self.filing_status not in ['single', 'married', 'head_of_household']:
            raise ValueError(f"Employee {self.employee_id}: invalid filing_status '{self.filing_status}'")


@dataclass
class SolveResult:
    """
    Solver output model — returned per employee after solving.
    Contains WIMPER + SIMERP values and solve metadata.
    """
    employee_id: str
    wimper: float                     # Section 125 pre-tax amount
    simerp: float                     # Section 105 HRA amount
    solve_status: str                 # solved | partial | unsolvable
    iterations: int                   # Number of iterations used
    achieved_savings: float           # Actual tax savings achieved
    vcamp_target: float               # Original target for reference

    @property
    def achievement_pct(self) -> float:
        """Percentage of VCAMP target achieved."""
        if self.vcamp_target <= 0:
            return 0.0
        return round((self.achieved_savings / self.vcamp_target) * 100, 2)

    def to_dict(self) -> dict:
        """Serialize to dictionary for JSON output to Node.js."""
        return {
            'employeeId': self.employee_id,
            'wimper': round(self.wimper, 2),
            'simerp': round(self.simerp, 2),
            'solveStatus': self.solve_status,
            'iterations': self.iterations,
            'achievedSavings': round(self.achieved_savings, 2),
            'vcampTarget': round(self.vcamp_target, 2),
            'achievementPct': self.achievement_pct
        }


@dataclass
class PayrollBreakdown:
    """
    Full payroll breakdown for a single scenario (normal or hybrid).
    Used internally by wimper.py and simerp.py for calculations.
    """
    gross_pay: float
    federal_tax: float
    state_tax: float
    fica_tax: float                   # Employee FICA (7.65%)
    total_deductions: float
    net_pay: float
    employer_fica: float              # Employer FICA (7.65%)
    employer_cost: float              # Total cost to employer

    def to_dict(self) -> dict:
        """Serialize to dictionary."""
        return {
            'grossPay': round(self.gross_pay, 2),
            'federalTax': round(self.federal_tax, 2),
            'stateTax': round(self.state_tax, 2),
            'ficaTax': round(self.fica_tax, 2),
            'totalDeductions': round(self.total_deductions, 2),
            'netPay': round(self.net_pay, 2),
            'employerFica': round(self.employer_fica, 2),
            'employerCost': round(self.employer_cost, 2)
        }
