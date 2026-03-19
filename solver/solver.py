"""
@file solver.py
@description Main Python solver entry point for WIMPER and SIMERP calculation.
             Reads employee data from stdin as JSON.
             Iteratively solves for WIMPER/SIMERP values that meet the VCAMP target.
             Writes results to stdout as JSON.

Usage:
    echo '{"employees": [...]}' | python3 solver.py
"""
import sys
import json
from models import EmployeeInput, Benefits, SolveResult
from wimper import calculate_wimper_tax_savings
from simerp import calculate_simerp, calculate_total_hybrid_savings
from constraints import validate_constraints

# Solver configuration
MAX_ITERATIONS = 25
TOLERANCE = 0.01       # $0.01 — match VCAMP target within one cent
SIMERP_RATIO = 0.6     # SIMERP = 60% of WIMPER
STEP_FACTOR = 0.5      # Binary search step factor


def solve_employee(emp: EmployeeInput) -> SolveResult:
    """
    Iteratively solves for WIMPER that generates savings matching the VCAMP target.
    Uses a binary search approach between 0 and gross_pay.

    @param emp: EmployeeInput with gross_pay, vcamp target, benefits
    @returns: SolveResult with wimper, simerp, status, iterations
    """
    target = emp.vcamp
    gross = emp.gross_pay

    # Binary search bounds
    low = 0.0
    high = gross
    best_wimper = 0.0
    best_simerp = 0.0
    best_savings = 0.0
    best_diff = float('inf')

    for iteration in range(1, MAX_ITERATIONS + 1):
        # Midpoint wimper
        wimper = round((low + high) / 2, 2)
        simerp = calculate_simerp(wimper, SIMERRP_RATIO=SIMERP_RATIO)

        # Validate constraints
        valid, _ = validate_constraints(wimper, simerp, gross)
        if not valid:
            high = wimper
            continue

        # Calculate total savings this WIMPER generates
        savings = calculate_total_hybrid_savings(wimper, simerp, gross)
        diff = abs(savings - target)

        # Track best result so far
        if diff < best_diff:
            best_diff = diff
            best_wimper = wimper
            best_simerp = simerp
            best_savings = savings

        # Check if within tolerance — done
        if diff <= TOLERANCE:
            return SolveResult(
                employee_id=emp.employee_id,
                wimper=best_wimper,
                simerp=best_simerp,
                vcamp_target=target,
                achieved_savings=best_savings,
                iterations=iteration,
                status='solved',
                message=f'Converged in {iteration} iterations',
            )

        # Adjust search bounds based on whether savings are above or below target
        if savings < target:
            low = wimper  # Need higher WIMPER to get more savings
        else:
            high = wimper  # Overshooting — reduce WIMPER

    # Max iterations reached — return best result found
    status = 'solved' if best_diff <= TOLERANCE else 'partial'
    return SolveResult(
        employee_id=emp.employee_id,
        wimper=best_wimper,
        simerp=best_simerp,
        vcamp_target=target,
        achieved_savings=best_savings,
        iterations=MAX_ITERATIONS,
        status=status,
        message=f'Best result after {MAX_ITERATIONS} iterations. Diff: ${best_diff:.4f}',
    )


def main():
    """
    Main entry point. Reads JSON from stdin, solves for each employee,
    writes results JSON to stdout.
    """
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)
        employees_raw = data.get('employees', [])

        results = []
        for emp_data in employees_raw:
            benefits_data = emp_data.get('benefits', {})
            benefits = Benefits(
                medical=benefits_data.get('medical', 0),
                dental=benefits_data.get('dental', 0),
                vision=benefits_data.get('vision', 0),
                debit_card=benefits_data.get('debitCard', 0),
                ancillary=benefits_data.get('ancillary', 0),
            )
            emp = EmployeeInput(
                employee_id=emp_data['employeeId'],
                gross_pay=float(emp_data['grossPay']),
                pay_schedule=emp_data.get('paySchedule', 'biweekly'),
                filing_status=emp_data.get('filingStatus', 'single'),
                state=emp_data.get('state', 'TX'),
                vcamp=float(emp_data.get('vcamp', 0)),
                benefits=benefits,
            )

            result = solve_employee(emp)
            results.append({
                'employeeId': result.employee_id,
                'wimper': result.wimper,
                'simerp': result.simerp,
                'vcampTarget': result.vcamp_target,
                'achievedSavings': result.achieved_savings,
                'iterations': result.iterations,
                'status': result.status,
                'message': result.message,
            })

        # Write results to stdout for Node.js to consume
        sys.stdout.write(json.dumps(results))

    except Exception as e:
        sys.stderr.write(f'Solver error: {str(e)}')
        sys.exit(1)


if __name__ == '__main__':
    main()
