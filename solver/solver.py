"""
@file solver.py
@description Main entry point for the WIMPER/SIMERP iterative solver.
             Reads employee JSON from stdin, processes each employee independently,
             and writes solver results as JSON to stdout.

Usage: echo '[...]' | python3 solver.py
"""
import sys
import json
from wimper import calculate_wimper
from simerp import calculate_simerp
from constraints import apply_constraints


def solve_employee(employee):
    """
    Solve WIMPER and SIMERP for a single employee using iterative convergence.
    Uses VCAMP target as the desired payroll tax savings amount.

    Args:
        employee (dict): Single employee record with all payroll fields

    Returns:
        dict: Solver result with wimper, simerp, iterations, and status
    """
    employee_id = employee.get('employee_id')
    vcamp_target = float(employee.get('vcamp_target', 0))
    gross_wages = float(employee.get('gross_wages', 0))

    # Benefit inputs
    medical_ee = float(employee.get('medical_ee', 0))
    dental_ee = float(employee.get('dental_ee', 0))
    vision_ee = float(employee.get('vision_ee', 0))
    debit_card = float(employee.get('debit_card', 0))
    ancillary = float(employee.get('ancillary', 0))

    # Total existing pre-tax benefits
    total_benefits = medical_ee + dental_ee + vision_ee + debit_card + ancillary

    # Initialise solver variables
    wimper = 0.0
    simerp = 0.0
    tolerance = 0.01  # $0.01 convergence tolerance
    max_iterations = 25
    iterations = 0
    status = 'not_converged'

    # Iterative solver loop
    for i in range(max_iterations):
        iterations += 1

        # Calculate WIMPER (Section 125 pre-tax deduction)
        new_wimper = calculate_wimper(
            gross_wages=gross_wages,
            vcamp_target=vcamp_target,
            total_benefits=total_benefits,
            simerp=simerp
        )

        # Calculate SIMERP (Section 105 reimbursement)
        new_simerp = calculate_simerp(
            gross_wages=gross_wages,
            wimper=new_wimper,
            vcamp_target=vcamp_target,
            total_benefits=total_benefits
        )

        # Apply constraints: WIMPER must be > SIMERP, both non-negative
        new_wimper, new_simerp = apply_constraints(
            wimper=new_wimper,
            simerp=new_simerp,
            gross_wages=gross_wages,
            total_benefits=total_benefits
        )

        # Check convergence — stop if values stabilise within tolerance
        wimper_delta = abs(new_wimper - wimper)
        simerp_delta = abs(new_simerp - simerp)

        wimper = new_wimper
        simerp = new_simerp

        if wimper_delta < tolerance and simerp_delta < tolerance and iterations >= 5:
            status = 'converged'
            break

    # Mark as partial if we hit max iterations without full convergence
    if status != 'converged':
        actual_savings = wimper + simerp
        if actual_savings > 0 and actual_savings >= vcamp_target * 0.8:
            status = 'partial'  # Within 80% of target
        else:
            status = 'not_converged'

    return {
        'employee_id': employee_id,
        'wimper': round(wimper, 2),
        'simerp': round(simerp, 2),
        'iterations': iterations,
        'status': status,
        'vcamp_target': vcamp_target,
    }


def main():
    """
    Read employee array from stdin, solve each employee, write results to stdout.
    """
    try:
        input_data = sys.stdin.read()
        employees = json.loads(input_data)

        if not isinstance(employees, list):
            employees = [employees]

        results = [solve_employee(emp) for emp in employees]

        # Write results to stdout for Node.js to read
        print(json.dumps(results))

    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON input: {str(e)}'}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
