"use client"

import { useState, useCallback } from "react"
import { Upload, CheckCircle } from "lucide-react"
import type React from "react" // Import React

export default function UploadForm() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])


const upload = () => {
    if (!file) return
    
    console.log("Uploading")
    const formData = new FormData()
    formData.append("file", file)
  
    fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
  }

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])

   
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Futuristic Upload</h1>
        <div
          className={`
            relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out
            ${isDragging ? "border-purple-500 bg-purple-500 bg-opacity-10" : "border-gray-600 hover:border-purple-400"}
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-8 text-center">
            {file ? (
              <div className="text-purple-400">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-semibold">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-lg font-semibold text-white mb-2">Drag & Drop your video here</p>
                <p className="text-sm text-gray-400">Or click to select a file</p>
              </>
            )}
          </div>
        </div>
        {file && (
          <button onClick={upload} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
            Upload Video
          </button>
        )}
      </div>
      <FuturisticBackground />
    </div>
  )
}

function FuturisticBackground() {
  return (
    <div className="fixed inset-0 z-[-1]">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#purpleGlow)" />
        <path d="M0 100 L50 0 L100 100 Z" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="0.5">
          <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="10s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  )
}

