/**
 * @file upload.middleware.js
 * @description Multer configuration for census file uploads.
 *              Accepts only Excel files (.xlsx, .xls).
 *              Stores files in memory (no disk writes) for ephemeral processing.
 */
const multer = require('multer')

// Use memory storage — file never touches disk, keeping everything ephemeral
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls)$/i)) {
    cb(null, true)
  } else {
    cb(new Error('Only Excel files (.xlsx, .xls) are accepted'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
})

module.exports = upload
