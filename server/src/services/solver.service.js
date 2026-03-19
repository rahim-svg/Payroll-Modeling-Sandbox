/**
 * @file solver.service.js
 * @description Invokes the Python WIMPER/SIMERP solver as a child process.
 *              Passes employee data as JSON via stdin and reads results from stdout.
 *              Each employee is processed independently.
 */
const { spawn } = require('child_process')
const path = require('path')

// Path to the Python solver entry point
const SOLVER_PATH = path.join(__dirname, '../../../solver/solver.py')

/**
 * Run the Python solver for an array of employees.
 * @param {Array} employees - Validated employee records
 * @returns {Promise<Array>} - Solver results with WIMPER, SIMERP, iterations, and status per employee
 */
const solve = (employees) => {
  return new Promise((resolve, reject) => {
    // Spawn Python process — pass employee data as JSON via stdin
    const pythonProcess = spawn('python3', [SOLVER_PATH])

    let stdout = ''
    let stderr = ''

    // Collect stdout (solver results)
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    // Collect stderr (solver logs/errors)
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('[Solver] Python process error:', stderr)
        return reject(new Error(`Solver failed with exit code ${code}: ${stderr}`))
      }
      try {
        const results = JSON.parse(stdout)
        resolve(results)
      } catch (parseError) {
        reject(new Error(`Failed to parse solver output: ${stdout}`))
      }
    })

    // Send employee data to Python via stdin
    pythonProcess.stdin.write(JSON.stringify(employees))
    pythonProcess.stdin.end()
  })
}

module.exports = { solve }
