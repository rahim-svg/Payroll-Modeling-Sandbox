/**
 * @file CensusUploader.jsx
 * @description Drag-and-drop file uploader for payroll census Excel files.
 *              Accepts only .xlsx and .xls files. Shows file preview before upload.
 */
import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function CensusUploader({ onUpload }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    // Only accept Excel files
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      alert('Please upload an Excel file (.xlsx or .xls)')
      return
    }
    setSelectedFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 transition-colors cursor-pointer',
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-10 w-10 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
              className="ml-4 text-gray-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <p className="font-medium text-gray-700">Drop your census file here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse — .xlsx and .xls only</p>
            </div>
          </>
        )}
      </div>

      {/* Submit Button */}
      {selectedFile && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Run Payroll Simulation
          </button>
        </div>
      )}
    </div>
  )
}
