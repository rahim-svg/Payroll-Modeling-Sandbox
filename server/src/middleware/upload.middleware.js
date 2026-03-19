/**
 * @file upload.middleware.js
 * @description Multer configuration for census file uploads.
 *              Accepts only .xlsx files, stores in memory (no disk persistence).
 */
const multer = require('multer')

// Store file in memory — no disk writes, fully ephemeral
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Only accept Excel files
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only .xlsx Excel files are accepted'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
})

module.exports = upload
