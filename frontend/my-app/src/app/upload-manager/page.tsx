'use client';

import { useState, useRef } from 'react';
import Link from "next/link";
import { useAIAnalysis } from '@/components/ai/AIIntegration';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';

interface Recommendation {
  id: string;
  title: string;
  price: number;
  size: string;
  image_url?: string;
  style_tags?: string[];
}

interface AnalysisResult {
  style: string;
  confidence: number;
  colors: {
    primary: string[];
    secondary?: string[];
    accent?: string[];
  };
  recommendations: Recommendation[];
  session_id?: string;
}

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

  // Initialize AI analysis hook
  const { analyzeRoom, isAnalyzing, analysisProgress } = useAIAnalysis({
    userId: user?.id || '',
    onAnalysisComplete: (result) => {
      setAnalysisResult(result);
      setCurrentStep(4); // Move to results step
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);

      try {
        // Simulate upload progress
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUploadedFiles(prev => [...prev, ...files]);
        setCurrentStep(3); // Move to analysis step
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(files);
      setCurrentStep(3); // Move to analysis step
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };


  const handleAnalyze = async (file: File) => {
    await analyzeRoom(file, location || undefined);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setAnalysisResult(null);
    setLocation('');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <main className="max-w-4xl mx-auto px-4 py-8 pt-20">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step === currentStep 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : step < currentStep 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 rounded ${
                      step < currentStep 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
                </div>
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === 1 && 'Step 1: Location'}
                {currentStep === 2 && 'Step 2: Upload Photo'}
                {currentStep === 3 && 'Step 3: AI Analysis'}
                {currentStep === 4 && 'Step 4: Results'}
              </h2>
              <p className="text-gray-600">
                {currentStep === 1 && 'Help us find nearby stores and local trends'}
                {currentStep === 2 && 'Upload your room photo for AI analysis'}
                {currentStep === 3 && 'Our AI is analyzing your room'}
                {currentStep === 4 && 'Your personalized recommendations are ready'}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 min-h-[500px] relative">
            
            {/* Back Button - Top Left */}
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="absolute top-6 left-6 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            )}
            
            {/* Step 1: Location */}
            {currentStep === 1 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Location (Optional)</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Help us find nearby stores and local trends to provide better recommendations
                </p>
                <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, NY"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                  <button
                    onClick={nextStep}
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload */}
            {currentStep === 2 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Room Photo</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Drop your room photo here or click to browse files
                </p>
                
                <div
                  className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 mx-auto max-w-lg ${
                    isUploading 
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50' 
                      : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50'
                    }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium text-lg">Uploading...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium text-lg mb-2">Drop your room photo here</p>
                        <p className="text-gray-500 mb-6">or click to browse</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                        >
                          Choose Files
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-center mt-8">
                          <button
                    onClick={nextStep}
                    disabled={uploadedFiles.length === 0}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                          </button>
                        </div>
              </div>
            )}

            {/* Step 3: Analysis */}
            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
            </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h3>
                <p className="text-gray-600 mb-8">Our AI is analyzing your room to find perfect artwork matches</p>
                
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="text-purple-600 font-bold text-lg">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                    <p className="text-gray-700 font-medium">
                      {analysisProgress < 25 && "Processing image..."}
                      {analysisProgress >= 25 && analysisProgress < 50 && "Detecting room features..."}
                      {analysisProgress >= 50 && analysisProgress < 75 && "Finding matching artwork..."}
                      {analysisProgress >= 75 && analysisProgress < 95 && "Generating recommendations..."}
                      {analysisProgress >= 95 && analysisProgress < 100 && "Finalizing analysis..."}
                      {analysisProgress === 100 && "Analysis complete!"}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => handleAnalyze(uploadedFiles[0])}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                  </button>
                  </div>
                </div>
              )}

            {/* Step 4: Results */}
            {currentStep === 4 && analysisResult && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete!</h3>
                <p className="text-gray-600 mb-8">Your personalized recommendations are ready</p>

                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Room Style */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Detected Style</p>
                        <p className="font-bold text-gray-900 text-lg capitalize">{analysisResult.style}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="font-bold text-green-600 text-lg">{(analysisResult.confidence * 100).toFixed(0)}%</p>
                      </div>
                      </div>
                    </div>

                    {/* Color Palette */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Color Palette</h4>
                    <div className="space-y-4">
                        {/* Primary Colors */}
                        <div>
                        <p className="text-sm text-gray-600 mb-2">Primary Colors</p>
                        <div className="flex justify-center space-x-3">
                            {analysisResult.colors.primary.map((color: string, index: number) => (
                              <div
                                key={index}
                              className="w-12 h-12 rounded-xl border-2 border-white shadow-lg"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                ></div>
                              ))}
                            </div>
                      </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                  <div className="space-y-4">
                      <Link
                        href="/recommendations"
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl block"
                      >
                        View Recommendations
                      </Link>
                      <Link
                        href="/chat"
                      className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all block"
                      >
                        Chat with AI
                      </Link>
                    </div>
                  </div>

                {/* Navigation */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={resetFlow}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
                  >
                    Start Over
                  </button>
                </div>
                </div>
              )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}