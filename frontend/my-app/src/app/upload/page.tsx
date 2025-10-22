'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Art.Decor.AI</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">Explore</Link>
              <Link href="/trending" className="text-gray-600 hover:text-gray-900">Trending</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Room</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div 
                className={`border-2 border-dashed border-purple-300 rounded-lg p-8 text-center transition-colors ${
                  uploadedFile ? 'border-green-400 bg-green-50' : 'hover:border-purple-400'
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">Drop your image here</p>
                <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors"
                >
                  Browse Files
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">✓ {uploadedFile.name} uploaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your room...</p>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Wall Color</span>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                      <div className="w-6 h-6 bg-gray-500 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Lighting</span>
                    <span className="text-orange-500 font-medium">Natural Light</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Room Type</span>
                    <span className="text-blue-500 font-medium">Living Room</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Style Detected</span>
                    <span className="text-purple-500 font-medium">Modern</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Upload a room photo to see analysis results</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload & Analysis</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600 mb-4">Room photo upload and processing</p>
              <div className="text-sm text-gray-500">
                Screen 2 of 6
              </div>
              {uploadedFile && !isAnalyzing && (
                <Link 
                  href="/recommendations"
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-center block"
                >
                  Get Recommendations →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
