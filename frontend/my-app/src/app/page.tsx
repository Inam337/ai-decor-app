'use client';

import { useState, useRef } from 'react';
import Link from "next/link";
import { apiService } from '@/services/api';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    colorPalette: string[];
    detectedObjects: string[];
    style: string;
    confidence: number;
  } | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    title: string;
    price: number;
    image_url: string;
    style_tags: string[];
    description: string;
  }>>([]);
  const [showResults, setShowResults] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setCurrentStep(2); // Move to input options step
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setCurrentStep(2); // Move to input options step
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    // No need to change step, we'll show both options together
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setImagePreview(null);
    setSelectedOption(null);
    setTextDescription('');
    setAnalysisResult(null);
    setRecommendations([]);
    setShowResults(false);
  };

  const processTextInput = async () => {
    if (!textDescription.trim() || !uploadedImage) return;
    
    setCurrentStep(3); // Move to processing step
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // Simulate image analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      // Mock analysis result with color palette and object detection
      const mockAnalysisResult = {
        colorPalette: ['#E8E2DB', '#C4A484', '#8B4513', '#F5F5DC', '#D2B48C'],
        detectedObjects: ['Sofa', 'Coffee Table', 'Window', 'Plant', 'Lamp'],
        style: 'Modern Minimalist',
        confidence: 0.87
      };
      
      setAnalysisResult(mockAnalysisResult);
      
      // Mock recommendations based on analysis
      const mockRecommendations = [
        {
          id: '1',
          title: 'Modern Abstract Art',
          price: 299,
          image_url: 'https://picsum.photos/seed/art1/300/200',
          style_tags: ['Modern', 'Abstract', 'Contemporary'],
          description: 'Perfect match for your modern minimalist style'
        },
        {
          id: '2', 
          title: 'Geometric Wall Art',
          price: 199,
          image_url: 'https://picsum.photos/seed/art2/300/200',
          style_tags: ['Geometric', 'Modern', 'Clean'],
          description: 'Complements your clean aesthetic preferences'
        },
        {
          id: '3',
          title: 'Minimalist Canvas',
          price: 149,
          image_url: 'https://picsum.photos/seed/art3/300/200',
          style_tags: ['Minimalist', 'Simple', 'Elegant'],
          description: 'Matches your preference for simplicity'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setShowResults(true);
      setCurrentStep(4); // Move to results step
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: 'audio/webm;codecs=opus' 
          });
          
          // Check if we have audio data
          if (audioBlob.size > 0) {
        await processVoiceInput(audioBlob);
          } else {
            console.error('No audio data recorded');
            setIsProcessing(false);
            setCurrentStep(2); // Stay on input step
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          setIsProcessing(false);
          setCurrentStep(2);
        } finally {
          // Clean up stream
        stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
        setIsProcessing(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setSelectedOption('voice'); // Mark that voice was used
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions and try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
      }
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    if (!uploadedImage) return;
    
    setCurrentStep(3); // Move to processing step
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Convert audio to base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 15;
          });
        }, 300);

        // Simulate image analysis with voice input
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        clearInterval(progressInterval);
        setProcessingProgress(100);
        
        // Mock analysis result with color palette and object detection
        const mockAnalysisResult = {
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
          detectedObjects: ['Sofa', 'Coffee Table', 'Window', 'Plant', 'Lamp'],
          style: 'Contemporary Vibrant',
          confidence: 0.92
        };
        
        setAnalysisResult(mockAnalysisResult);
        
        // Mock recommendations based on voice analysis
        const mockRecommendations = [
          {
            id: '4',
            title: 'Vibrant Contemporary Art',
            price: 399,
            image_url: 'https://picsum.photos/seed/art4/300/200',
            style_tags: ['Contemporary', 'Vibrant', 'Bold'],
            description: 'Based on your voice description of bold colors'
          },
          {
            id: '5',
            title: 'Nature-Inspired Canvas',
            price: 249,
            image_url: 'https://picsum.photos/seed/art5/300/200',
            style_tags: ['Nature', 'Organic', 'Calming'],
            description: 'Matches your preference for natural elements'
          },
          {
            id: '6',
            title: 'Statement Wall Piece',
            price: 499,
            image_url: 'https://picsum.photos/seed/art6/300/200',
            style_tags: ['Statement', 'Large', 'Dramatic'],
            description: 'Perfect centerpiece for your space'
          }
        ];
        
        setRecommendations(mockRecommendations);
        setShowResults(true);
        setCurrentStep(4); // Move to results step
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (error) {
      console.error('Voice processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 pt-20">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                  step === currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : step < currentStep 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-1 rounded ${
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
              {currentStep === 1 && 'Step 1: Upload Your Space'}
              {currentStep === 2 && 'Step 2: Describe Your Style'}
              {currentStep === 3 && 'Step 3: AI Analysis'}
              {currentStep === 4 && 'Step 4: Your Results'}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 && 'Upload a photo of your space to get started'}
              {currentStep === 2 && 'Tell us about your design preferences or record your voice'}
              {currentStep === 3 && 'Our AI is analyzing your image and preferences'}
              {currentStep === 4 && 'Your personalized analysis and recommendations are ready'}
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
          
          {/* Step 1: Upload Image */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Space</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Upload a photo of your space to get started with AI analysis
              </p>
              
              <div className="max-w-2xl mx-auto">
                <div
                  className="border-3 border-dashed border-gray-300 rounded-3xl p-12 text-center transition-all duration-300 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
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
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
                      >
                        Choose Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Input Options */}
          {currentStep === 2 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Describe Your Style</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Tell us about your design preferences or record your voice
              </p>
              
              {/* Show uploaded image preview */}
              {imagePreview && (
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg">
                    <img src={imagePreview} alt="Uploaded space" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Your uploaded space</p>
                </div>
              )}
              
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Text Input Section */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Describe Style</h4>
                  </div>
                  <textarea
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    placeholder="Tell us about your style preferences... e.g., 'I love modern minimalist design with clean lines and neutral colors. I want something that complements my white walls and wooden furniture.'"
                    className="w-full h-32 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">
                      {textDescription.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Voice Recording Section */}
                <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Voice Recording</h4>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-pink-500 to-red-500'
                    }`}>
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                   
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                  </div>
                </div>

                {/* Process Analysis Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (textDescription.trim()) {
                        processTextInput();
                      } else if (selectedOption === 'voice') {
                        // If voice was used, the processVoiceInput is already called in the recording flow
                        setCurrentStep(3);
                      } else {
                        alert('Please describe your style or record your voice before proceeding.');
                      }
                    }}
                    disabled={!textDescription.trim() && !selectedOption}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    Process Analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {currentStep === 3 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h3>
              <p className="text-gray-600 mb-8">Our AI is analyzing your image and preferences</p>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="text-purple-600 font-bold text-lg">{Math.round(processingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <p className="text-gray-700 font-medium">
                    {processingProgress < 25 && "Processing image..."}
                    {processingProgress >= 25 && processingProgress < 50 && "Detecting objects..."}
                    {processingProgress >= 50 && processingProgress < 75 && "Analyzing color palette..."}
                    {processingProgress >= 75 && processingProgress < 100 && "Generating recommendations..."}
                    {processingProgress === 100 && "Analysis complete!"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && showResults && analysisResult && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete!</h3>
              <p className="text-gray-600 mb-8">Your personalized analysis and recommendations are ready</p>

              <div className="max-w-4xl mx-auto space-y-8">
                {/* Image Analysis Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Color Palette */}
                  <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Color Palette</h4>
                    <div className="flex justify-center space-x-3 mb-4">
                      {analysisResult.colorPalette.map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg"
                          style={{ backgroundColor: color }}
                          title={color}
                        ></div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Detected from your space</p>
                  </div>

                  {/* Detected Objects */}
                  <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Detected Objects</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {analysisResult.detectedObjects.map((object: string, index: number) => (
                        <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {object}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">Found in your space</p>
                  </div>
                </div>

                {/* Style Analysis */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Detected Style</p>
                      <p className="font-bold text-gray-900 text-xl capitalize">{analysisResult.style}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="font-bold text-green-600 text-xl">{(analysisResult.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 hover:shadow-lg transition-all">
                      <img 
                        src={rec.image_url} 
                        alt={rec.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.style_tags.map((tag: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">${rec.price}</span>
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link
                    href="/recommendations"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl block"
                  >
                    View All Recommendations
                  </Link>
                  <Link
                    href="/chat"
                    className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all block"
                  >
                    Chat with AI
                  </Link>
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
            </div>
          )}
          </div>
      </main>

      <Footer />
    </div>
  );
}