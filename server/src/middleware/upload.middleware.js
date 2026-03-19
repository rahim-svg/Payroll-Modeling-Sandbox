/**
 * @file upload.middleware.js
 * @description Multer configuration for file uploads.
 *              Stores uploaded files in memory (not disk) for temporary processing.
 */
import multer from 'multer'

// Store files in memory for processing
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Accept only Excel files
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only Excel files are allowed (.xlsx or .xls)'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

export default upload
