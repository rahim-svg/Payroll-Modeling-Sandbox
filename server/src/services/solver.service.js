/**
 * @file solver.service.js
 * @description Invokes the Python solver via child_process.
 *              Passes employee data as JSON stdin and receives solver results as JSON stdout.
 */
const { spawn } = require('child_process')
const path = require('path')

/**
 * Runs the Python WIMPER/SIMERP solver for all employees
 * @param {Array} employees - Validated employee array from census
 * @returns {Promise<Array>} Solver results per employee
 */
const solve = (employees) => {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python3'
    const solverPath = path.resolve(
      __dirname,
      process.env.SOLVER_PATH || '../../../solver/solver.py'
    )

    // Spawn Python process
    const python = spawn(pythonPath, [solverPath])

    let stdout = ''
    let stderr = ''

    // Send employee data to Python via stdin
    python.stdin.write(JSON.stringify({ employees }))
    python.stdin.end()

    // Collect stdout (solver results)
    python.stdout.on('data', (data) => { stdout += data.toString() })

    // Collect stderr (solver logs/errors)
    python.stderr.on('data', (data) => { stderr += data.toString() })

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('[SOLVER] Python error:', stderr)
        return reject(new Error(`Solver failed with exit code ${code}: ${stderr}`))
      }
      try {
        const results = JSON.parse(stdout)
        resolve(results)
      } catch (parseError) {
        reject(new Error(`Failed to parse solver output: ${stdout}`))
      }
    })
  })
}

module.exports = { solve }
