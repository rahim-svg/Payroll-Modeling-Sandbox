"""
@file solver.py
@description Main Python solver entry point for the Payroll Modeling Sandbox.
             Reads employee JSON from stdin or file argument,
             runs iterative WIMPER + SIMERP solver per employee,
             outputs results as JSON to stdout for Node.js to consume.

Usage:
  python3 solver.py <input_file.json>
  echo '<json>' | python3 solver.py

Input:  JSON array of Employee objects
Output: JSON array of SolveResult objects
"""

import sys
import json
import logging
from typing import List, Dict, Any

from models import Employee, Benefits, SolveResult
from constraints import (
    check_hard_constraints,
    enforce_hard_constraints,
    is_within_tolerance,
    MAX_ITERATIONS,
    INITIAL_WIMPER_RATIO,
    INITIAL_SIMERP_RATIO,
    ADJUSTMENT_FACTOR_UP,
    ADJUSTMENT_FACTOR_DOWN
)
from simerp import calculate_combined_savings

# ─────────────────────────────────────────
# LOGGING SETUP
# ─────────────────────────────────────────
# Log to stderr so it doesn't pollute stdout JSON output
logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format='[solver] %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)


def parse_employee(data: Dict[str, Any]) -> Employee:
    """
    Parse a single employee dictionary into an Employee dataclass.

    Args:
        data (dict): Raw employee data from JSON

    Returns:
        Employee: Parsed and validated employee object
    """
    benefits_data = data.get('benefits', {})
    benefits = Benefits(
        medical=float(benefits_data.get('medical', 0)),
        dental=float(benefits_data.get('dental', 0)),
        vision=float(benefits_data.get('vision', 0)),
        debit_card=float(benefits_data.get('debitCard', 0)),
        ancillary=float(benefits_data.get('ancillary', 0))
    )

    return Employee(
        employee_id=str(data['employeeId']),
        first_name=str(data.get('firstName', '')),
        last_name=str(data.get('lastName', '')),
        gross_pay=float(data['grossPay']),
        pay_frequency=str(data['payFrequency']),
        filing_status=str(data['filingStatus']),
        state=str(data['state']).upper(),
        benefits=benefits,
        vcamp_target=float(data['vcampTarget'])
    )


def solve_employee(employee: Employee) -> SolveResult:
    """
    Core iterative solver for a single employee.
    Uses binary search with proportional adjustment to find
    WIMPER + SIMERP values that achieve the VCAMP savings target.

    Algorithm:
      1. Start with initial guesses (25% + 15% of gross)
      2. Calculate combined savings
      3. If within tolerance → done (solved)
      4. If undershooting → increase both by 5%
      5. If overshooting → decrease both by 5%
      6. Enforce hard constraints after each step
      7. Repeat up to MAX_ITERATIONS
      8. If not converged → return best result (partial)

    Args:
        employee (Employee): Employee to solve for

    Returns:
        SolveResult: Best WIMPER + SIMERP solution found
    """
    gross_pay = employee.gross_pay
    vcamp_target = employee.vcamp_target
    filing_status = employee.filing_status
    state = employee.state

    logger.info(f"Solving employee {employee.employee_id} | gross={gross_pay} | target={vcamp_target}")

    # Initial guess — start at 25% WIMPER and 15% SIMERP of gross
    wimper = gross_pay * INITIAL_WIMPER_RATIO
    simerp = gross_pay * INITIAL_SIMERP_RATIO

    # Enforce constraints on initial guess
    wimper, simerp = enforce_hard_constraints(wimper, simerp, gross_pay)

    best_wimper = wimper
    best_simerp = simerp
    best_savings = 0.0
    best_diff = float('inf')

    for iteration in range(MAX_ITERATIONS):
        # Calculate current combined savings
        current_savings = calculate_combined_savings(
            gross_pay, wimper, simerp, filing_status, state
        )

        difference = current_savings - vcamp_target
        abs_diff = abs(difference)

        logger.info(
            f"  iter {iteration + 1}: wimper={wimper:.2f} simerp={simerp:.2f} "
            f"savings={current_savings:.2f} target={vcamp_target:.2f} diff={difference:.2f}"
        )

        # Track best solution found so far
        if abs_diff < best_diff:
            best_diff = abs_diff
            best_wimper = wimper
            best_simerp = simerp
            best_savings = current_savings

        # Check if within tolerance — solved!
        if is_within_tolerance(current_savings, vcamp_target):
            logger.info(f"  SOLVED in {iteration + 1} iterations")
            return SolveResult(
                employee_id=employee.employee_id,
                wimper=round(wimper, 2),
                simerp=round(simerp, 2),
                solve_status='solved',
                iterations=iteration + 1,
                achieved_savings=round(current_savings, 2),
                vcamp_target=vcamp_target
            )

        # Adjust direction based on over/under shooting
        if difference < 0:
            # Undershooting — increase both to get more savings
            wimper *= ADJUSTMENT_FACTOR_UP
            simerp *= ADJUSTMENT_FACTOR_UP
        else:
            # Overshooting — decrease both to reduce savings
            wimper *= ADJUSTMENT_FACTOR_DOWN
            simerp *= ADJUSTMENT_FACTOR_DOWN

        # Enforce hard constraints after each adjustment
        wimper, simerp = enforce_hard_constraints(wimper, simerp, gross_pay)

    # Max iterations reached — return best solution found
    solve_status = 'partial' if best_savings > 0 else 'unsolvable'
    logger.warning(
        f"  {solve_status.upper()} after {MAX_ITERATIONS} iterations. "
        f"Best savings: {best_savings:.2f} / target: {vcamp_target:.2f}"
    )

    return SolveResult(
        employee_id=employee.employee_id,
        wimper=round(best_wimper, 2),
        simerp=round(best_simerp, 2),
        solve_status=solve_status,
        iterations=MAX_ITERATIONS,
        achieved_savings=round(best_savings, 2),
        vcamp_target=vcamp_target
    )


def solve_all(employees: List[Employee]) -> List[SolveResult]:
    """
    Solve for all employees in the census.

    Args:
        employees (List[Employee]): List of employees to solve

    Returns:
        List[SolveResult]: Results for all employees
    """
    results = []
    for employee in employees:
        try:
            result = solve_employee(employee)
            results.append(result)
        except Exception as e:
            # Don't let one employee failure stop the whole run
            logger.error(f"Failed to solve employee {employee.employee_id}: {e}")
            results.append(SolveResult(
                employee_id=employee.employee_id,
                wimper=0.0,
                simerp=0.0,
                solve_status='unsolvable',
                iterations=0,
                achieved_savings=0.0,
                vcamp_target=employee.vcamp_target
            ))
    return results


def main():
    """
    Main entry point — reads JSON input, runs solver, outputs JSON results.
    Called by Node.js solver.service.js via child_process.spawn.
    """
    try:
        # Read input from file argument or stdin
        if len(sys.argv) > 1:
            input_file = sys.argv[1]
            logger.info(f"Reading input from file: {input_file}")
            with open(input_file, 'r') as f:
                raw_data = json.load(f)
        else:
            logger.info("Reading input from stdin")
            raw_data = json.load(sys.stdin)

        # Parse employees
        employees = []
        for emp_data in raw_data:
            try:
                employee = parse_employee(emp_data)
                employees.append(employee)
            except Exception as e:
                logger.error(f"Failed to parse employee: {e}")
                # Add a placeholder error result
                employees_id = emp_data.get('employeeId', 'UNKNOWN')
                print(json.dumps([{
                    'employeeId': employees_id,
                    'wimper': 0,
                    'simerp': 0,
                    'solveStatus': 'unsolvable',
                    'iterations': 0,
                    'achievedSavings': 0,
                    'vcampTarget': 0,
                    'achievementPct': 0
                }]))
                sys.exit(1)

        logger.info(f"Loaded {len(employees)} employees. Starting solver...")

        # Run solver for all employees
        results = solve_all(employees)

        # Output results as JSON to stdout (Node.js reads this)
        output = [result.to_dict() for result in results]
        print(json.dumps(output))

        logger.info(f"Solver complete. {len(results)} results output.")

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON input: {e}")
        sys.exit(1)
    except FileNotFoundError as e:
        logger.error(f"Input file not found: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
