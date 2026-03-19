/**
 * @file CensusUploader.jsx
 * @description Drag-and-drop + click-to-browse Excel census file uploader.
 *              Validates file type client-side before submission.
 *              Calls onUpload callback with the selected File object.
 */
import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function CensusUploader({ onUpload, isLoading = false }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [clientError, setClientError] = useState(null)
  const inputRef = useRef(null)

  const validateFile = (file) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return 'Only Excel files (.xlsx, .xls) are supported.'
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be under 10MB.'
    }
    return null
  }

  const handleFile = (file) => {
    const error = validateFile(file)
    if (error) {
      setClientError(error)
      setSelectedFile(null)
      return
    }
    setClientError(null)
    setSelectedFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setClientError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSubmit = () => {
    if (selectedFile && onUpload) onUpload(selectedFile)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50',
          selectedFile && 'cursor-default hover:bg-white'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleChange}
        />

        {selectedFile ? (
          // File selected state
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB — Ready to process
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          // Empty state
          <div className="space-y-2">
            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop your census file here, or{' '}
                <span className="text-blue-600 hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Excel files only (.xlsx, .xls) — max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Client-side validation error */}
      {clientError && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <span>&#9888;</span> {clientError}
        </p>
      )}

      {/* Submit button */}
      {selectedFile && (
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Process Census File'}
        </button>
      )}
    </div>
  )
}
