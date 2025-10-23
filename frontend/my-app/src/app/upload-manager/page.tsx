'use client';

import { useState, useRef } from 'react';
import { useAIAnalysis } from '@/components/ai/AIIntegration';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import AnalysisResults from '@/components/analysis/AnalysisResults';
import { RoomAnalysisResult } from '@/types';

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RoomAnalysisResult | null>(null);
  const [location, setLocation] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

        // Set image preview for the first file
        if (files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
          };
          reader.readAsDataURL(files[0]);
        }

        setCurrentStep(2); // Move to describe/voice step
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

      // Set image preview for the first file
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(files[0]);
      }

      setCurrentStep(2); // Move to describe/voice step
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };


  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setCurrentStep(3); // Move to input step
  };

  const processTextInput = async () => {
    if (!textDescription.trim() || uploadedFiles.length === 0) return;

    setCurrentStep(4); // Move to processing step
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

      // Mock analysis result with new API structure
      const mockAnalysisResult: RoomAnalysisResult = {
        success: true,
        room_analysis: {
          detections: {
            walls: [
              { type: "wall", color: "#E8E2DB", area: 15.5 },
              { type: "wall", color: "#C4A484", area: 12.3 }
            ],
            windows: [
              { type: "window", area: 2.1, position: "north" },
              { type: "window", area: 1.8, position: "south" }
            ],
            furniture: [
              { name: "sofa", type: "furniture", color: "#8B4513" },
              { name: "coffee_table", type: "furniture", color: "#654321" },
              { name: "bookshelf", type: "furniture", color: "#2F4F4F" }
            ],
            other: [
              { name: "lamp", type: "lighting", color: "#FFD700" },
              { name: "plant", type: "decoration", color: "#228B22" }
            ]
          },
          color_palette: [
            { rgb: [232, 226, 219], hex: "#E8E2DB", percentage: 35.2 },
            { rgb: [196, 164, 132], hex: "#C4A484", percentage: 25.8 },
            { rgb: [139, 69, 19], hex: "#8B4513", percentage: 20.1 },
            { rgb: [245, 245, 220], hex: "#F5F5DC", percentage: 12.5 },
            { rgb: [210, 180, 140], hex: "#D2B48C", percentage: 6.4 }
          ],
          lighting: {
            mean_brightness: 125.5,
            lighting_condition: "moderate"
          },
          aesthetic_style: {
            style: "Modern Minimalist",
            confidence: 0.87
          }
        },
        recommendations: [
          {
            artwork_id: "art_001",
            title: "Modern Abstract Art",
            match_score: 0.95,
            reasoning: "Perfect match for your modern minimalist style; Complements your neutral color palette",
            artist: "Jane Smith",
            price: 299,
            image_url: "https://picsum.photos/seed/art1/300/200",
            style: "modern"
          }
        ],
        trend_insights: {
          evolution_insights: "Your modern minimalist style is trending. Consider incorporating warm earth tones and natural textures.",
          trending_complements: ["warm minimalism", "biophilic design", "curved furniture"],
          trending_styles: ["modern minimalist", "warm minimalism", "biophilic design"],
          popular_colors: ["warm neutrals", "earth tones", "sage green"],
          emerging_trends: ["sustainable materials", "curved furniture", "mixed textures"],
          seasonal_adaptations: {
            season: "winter",
            suggestions: ["warm textiles", "cozy lighting", "rich colors"]
          },
          analysis_timestamp: new Date().toISOString()
        },
        location_suggestions: {
          nearby_stores: []
        },
        final_reasoning: "Your room has a modern minimalist aesthetic with 87% confidence. The dominant colors are warm neutrals. Your space has moderate lighting conditions. Our top recommendation perfectly complements your style.",
        session_id: "session_upload_manager"
      };

      setAnalysisResult(mockAnalysisResult);
      setCurrentStep(5); // Move to results step

    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
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

          if (audioBlob.size > 0) {
            await processVoiceInput(audioBlob);
          } else {
            console.error('No audio data recorded');
            setIsProcessing(false);
            setCurrentStep(3);
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          setIsProcessing(false);
          setCurrentStep(3);
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
        setIsProcessing(false);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);

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
    if (uploadedFiles.length === 0) return;

    setCurrentStep(4); // Move to processing step
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 15;
          });
        }, 300);

        await new Promise(resolve => setTimeout(resolve, 2000));

        clearInterval(progressInterval);
        setProcessingProgress(100);

        const mockAnalysisResult: RoomAnalysisResult = {
          success: true,
          room_analysis: {
            detections: {
              walls: [
                { type: "wall", color: "#FF6B6B", area: 18.2 },
                { type: "wall", color: "#4ECDC4", area: 14.7 }
              ],
              windows: [
                { type: "window", area: 3.2, position: "east" },
                { type: "window", area: 2.8, position: "west" }
              ],
              furniture: [
                { name: "vibrant_sofa", type: "furniture", color: "#45B7D1" },
                { name: "colorful_chair", type: "furniture", color: "#96CEB4" },
                { name: "modern_table", type: "furniture", color: "#FFEAA7" }
              ],
              other: [
                { name: "artwork", type: "decoration", color: "#FF6B6B" },
                { name: "pillow", type: "textile", color: "#4ECDC4" }
              ]
            },
            color_palette: [
              { rgb: [255, 107, 107], hex: "#FF6B6B", percentage: 30.5 },
              { rgb: [78, 205, 196], hex: "#4ECDC4", percentage: 25.2 },
              { rgb: [69, 183, 209], hex: "#45B7D1", percentage: 20.8 },
              { rgb: [150, 206, 180], hex: "#96CEB4", percentage: 15.3 },
              { rgb: [255, 234, 167], hex: "#FFEAA7", percentage: 8.2 }
            ],
            lighting: {
              mean_brightness: 145.8,
              lighting_condition: "bright"
            },
            aesthetic_style: {
              style: "Contemporary Vibrant",
              confidence: 0.92
            }
          },
          recommendations: [
            {
              artwork_id: "art_002",
              title: "Vibrant Contemporary Art",
              match_score: 0.92,
              reasoning: "Perfect match for your contemporary vibrant style; Bold colors complement your space",
              artist: "John Doe",
              price: 399,
              image_url: "https://picsum.photos/seed/art2/300/200",
              style: "contemporary"
            }
          ],
          trend_insights: {
            evolution_insights: "Your contemporary vibrant style is very current. Bold colors and dynamic patterns are trending.",
            trending_complements: ["bold patterns", "mixed textures", "dynamic lighting"],
            trending_styles: ["contemporary vibrant", "bold contemporary", "dynamic modern"],
            popular_colors: ["bold reds", "vibrant blues", "energetic yellows"],
            emerging_trends: ["dynamic patterns", "mixed textures", "bold accents"],
            seasonal_adaptations: {
              season: "winter",
              suggestions: ["warm textiles", "cozy lighting", "rich colors"]
            },
            analysis_timestamp: new Date().toISOString()
          },
          location_suggestions: {
            nearby_stores: []
          },
          final_reasoning: "Your room has a contemporary vibrant aesthetic with 92% confidence. The bold color palette creates an energetic atmosphere. Your space has bright lighting conditions. Our recommendation perfectly matches your vibrant style.",
          session_id: "session_voice_analysis"
        };

        setAnalysisResult(mockAnalysisResult);
        setCurrentStep(5); // Move to results step
      };

      reader.readAsDataURL(audioBlob);

    } catch (error) {
      console.error('Voice processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async (file: File) => {
    await analyzeRoom(file, location || undefined);
  };

  const nextStep = () => {
    if (currentStep < 5) {
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
    setImagePreview(null);
    setSelectedOption(null);
    setTextDescription('');
    setAnalysisResult(null);
    setLocation('');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <main className="max-w-4xl mx-auto px-4 py-8 pt-20">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${step === currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : step < currentStep
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-12 h-1 mx-1 rounded ${step < currentStep
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
                {currentStep === 2 && 'Step 2: Choose Input Method'}
                {currentStep === 3 && (selectedOption === 'text' ? 'Step 3: Describe Your Style' : 'Step 3: Voice Recording')}
                {currentStep === 4 && 'Step 4: AI Analysis'}
                {currentStep === 5 && 'Step 5: Results'}
              </h2>
              <p className="text-gray-600">
                {currentStep === 1 && 'Help us find nearby stores and local trends'}
                {currentStep === 2 && 'Choose how you want to describe your preferences'}
                {currentStep === 3 && (selectedOption === 'text' ? 'Tell us about your style preferences in detail' : 'Record your design ideas naturally')}
                {currentStep === 4 && 'Our AI is analyzing your image and preferences'}
                {currentStep === 5 && 'Your personalized analysis and recommendations are ready'}
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

            {/* Step 2: Choose Input Method */}
            {currentStep === 2 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Input Method</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Now tell us about your design preferences
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {/* Text Input Option */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => handleOptionClick('text')}>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Describe Style</h4>
                    <p className="text-gray-600 text-sm">Tell us your design preferences in writing</p>
                  </div>

                  {/* Voice Input Option */}
                  <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => handleOptionClick('voice')}>
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Voice Query</h4>
                    <p className="text-gray-600 text-sm">Speak your design ideas naturally</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Text Input */}
            {currentStep === 3 && selectedOption === 'text' && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Describe Your Style</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Tell us about your design preferences in detail
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

                <div className="max-w-2xl mx-auto">
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
                    <button
                      onClick={processTextInput}
                      disabled={!textDescription.trim()}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Analysis
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Voice Recording */}
            {currentStep === 3 && selectedOption === 'voice' && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Voice Recording</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Click to start recording your design preferences
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

                {/* Compact Voice Recording Bar */}
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-pink-500 to-red-500'
                          }`}>
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {isRecording ? 'Recording...' : 'Voice Input'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isRecording ? 'Click to stop' : 'Click to start recording'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isRecording ? 'Stop' : 'Record'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Analysis */}
            {currentStep === 4 && (
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

            {/* Step 5: Results */}
            {currentStep === 5 && analysisResult && (
              <AnalysisResults
                analysisData={analysisResult}
                onResetFlow={resetFlow}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}