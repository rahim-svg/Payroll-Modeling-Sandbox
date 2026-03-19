/**
 * @file CensusUploader.jsx
 * @description Drag-and-drop + click-to-upload census Excel file component.
 *              Shows file name after selection and validation errors if any.
 */
import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function CensusUploader({ onFileSelect, errors = [] }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const clearFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-10 text-center transition-colors',
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
          selectedFile ? 'cursor-default' : 'cursor-pointer'
        )}
      >
        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={clearFile} className="ml-4 text-gray-400 hover:text-red-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
            <p className="text-gray-600 font-medium">Drop your census file here</p>
            <p className="text-sm text-gray-400">or click to browse — .xlsx files only</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-1">
          <p className="text-sm font-medium text-red-800">Validation errors:</p>
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-700">• {err.field}: {err.message}</p>
          ))}
        </div>
      )}
    </div>
  )
}
