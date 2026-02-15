'use client'

import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select an image file')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/getMessage`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image')
      }

      if (data.message) {
        setResult({ 
          success: true,
          content: data.message
        })
      } else {
        setResult({ 
          success: true,
          content: null
        })
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the image')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Secret Message Extractor
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Upload an image to retrieve your secret message
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-blue-500 transition-colors">
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="text-center">
                      {preview ? (
                        <div className="mb-4">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="max-h-64 mx-auto rounded-lg shadow-lg"
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <svg
                            className="mx-auto h-16 w-16 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-blue-600 hover:text-blue-500">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!file || loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      '🔓 Extract Message'
                    )}
                  </button>
                  {(file || result) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="flex flex-col justify-center">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg animate-pulse">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-red-700 dark:text-red-300 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className={`rounded-2xl p-8 shadow-2xl animate-fadeIn ${
                  result.content 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500' 
                    : 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-500'
                }`}>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                      {result.content ? '✅' : '❌'}
                    </div>
                    <h2 className={`text-3xl font-bold mb-2 ${
                      result.content ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {result.content ? 'Message Found' : 'Message Not Found'}
                    </h2>
                  </div>

                  {result.content && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-inner">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-mono break-words">
                          {result.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {!result.content && (
                    <div className="text-center text-gray-600 dark:text-gray-300">
                      <p>No message was found for this image.</p>
                    </div>
                  )}
                </div>
              )}

              {!error && !result && (
                <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-lg font-medium">Your message will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
