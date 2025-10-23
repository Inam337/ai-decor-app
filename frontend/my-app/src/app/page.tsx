'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ProgressSteps from '@/components/analysis/ProgressSteps';
import ImageUpload from '@/components/analysis/ImageUpload';
import StyleInput from '@/components/analysis/StyleInput';
import ProcessingStep from '@/components/analysis/ProcessingStep';
import AnalysisResults from '@/components/analysis/AnalysisResults';
import { RoomAnalysisResult } from '@/types';
import BackButton from '@/components/analysis/BackButton';
import ContextIndicator from '@/components/analysis/ContextIndicator';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<RoomAnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [contextUsed, setContextUsed] = useState(false);
  const [contextSummary, setContextSummary] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setCurrentStep(2); // Move to input options step
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
    setShowResults(false);
    setContextUsed(false);
    setContextSummary(null);
  };

  const startDemo = () => {
    setShowDemo(true);
    resetFlow();
  };

  const exitDemo = () => {
    setShowDemo(false);
    resetFlow();
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
          },
          {
            artwork_id: "art_002",
            title: "Minimalist Lines",
            match_score: 0.89,
            reasoning: "Clean lines complement your modern aesthetic; Neutral colors blend seamlessly",
            artist: "John Doe",
            price: 250,
            image_url: "https://picsum.photos/seed/art2/300/200",
            style: "minimalist"
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
        session_id: "session_demo"
      };
      
      setAnalysisResult(mockAnalysisResult);
      
      // Simulate context usage for demo purposes
      // In a real app, this would come from the API response
      if (Math.random() > 0.5) { // 50% chance to show context
        setContextUsed(true);
        setContextSummary("Your last text query was: 'modern living room decor' | Search context from December 15, 2024 at 2:30 PM | Previous style preferences: modern, minimalist");
      }
      
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
        // const base64Audio = reader.result as string;
        
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
        
        // Mock analysis result with new API structure
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
              artwork_id: "art_004",
              title: "Vibrant Contemporary Art",
              match_score: 0.92,
              reasoning: "Perfect match for your contemporary vibrant style; Bold colors complement your space",
              artist: "John Doe",
              price: 399,
              image_url: "https://picsum.photos/seed/art4/300/200",
              style: "contemporary"
            },
            {
              artwork_id: "art_005",
              title: "Nature-Inspired Canvas",
              match_score: 0.88,
              reasoning: "Matches your preference for natural elements; Organic shapes complement vibrant colors",
              artist: "Sarah Wilson",
              price: 249,
              image_url: "https://picsum.photos/seed/art5/300/200",
              style: "nature"
            },
            {
              artwork_id: "art_006",
              title: "Statement Wall Piece",
              match_score: 0.85,
              reasoning: "Perfect centerpiece for your space; Dramatic design matches your bold aesthetic",
              artist: "Mike Johnson",
              price: 499,
              image_url: "https://picsum.photos/seed/art6/300/200",
              style: "statement"
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
          session_id: "session_voice_demo"
        };
        
        setAnalysisResult(mockAnalysisResult);
        
        // Simulate context usage for voice queries
        if (Math.random() > 0.3) { // 70% chance to show context for voice
          setContextUsed(true);
          setContextSummary("Your last voice query was: 'I need colorful artwork for my bedroom' | Search context from December 15, 2024 at 3:45 PM | Previous style preferences: contemporary, vibrant");
        }
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

  // Step configuration
  const stepTitles = [
    'Step 1: Upload Your Space',
    'Step 2: Describe Your Style',
    'Step 3: AI Analysis',
    'Step 4: Your Results'
  ];

  const stepDescriptions = [
    'Upload a photo of your space to get started',
    'Tell us about your design preferences or record your voice',
    'Our AI is analyzing your image and preferences',
    'Your personalized analysis and recommendations are ready'
  ];

  // If demo is active, show the interactive demo
  if (showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Demo Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Art.Decor.AI Demo</h1>
            </div>
            <button
              onClick={exitDemo}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Exit Demo
            </button>
          </div>
        </div>

        {/* Main Demo Content */}
        <main className="max-w-4xl mx-auto px-4 py-16">
          {/* Progress Steps */}
          <ProgressSteps
            currentStep={currentStep}
            totalSteps={4}
            stepTitles={stepTitles}
            stepDescriptions={stepDescriptions}
          />

          {/* Step Content */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 min-h-[500px] relative">
            
            {/* Context Indicator */}
            <ContextIndicator 
              contextUsed={contextUsed}
              contextSummary={contextSummary || undefined}
              onClearContext={() => {
                setContextUsed(false);
                setContextSummary(null);
              }}
            />
            
            {/* Back Button - Top Left */}
            {currentStep > 1 && (
              <BackButton onBack={prevStep} />
            )}
            
            {/* Step 1: Upload Image */}
            {currentStep === 1 && (
              <ImageUpload
                onImageUpload={handleImageUpload}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                fileInputRef={fileInputRef}
              />
            )}

            {/* Step 2: Input Options */}
            {currentStep === 2 && (
              <StyleInput
                textDescription={textDescription}
                onTextChange={setTextDescription}
                imagePreview={imagePreview}
                isRecording={isRecording}
                isProcessing={isProcessing}
                selectedOption={selectedOption}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onProcessAnalysis={() => {
                  if (textDescription.trim()) {
                    processTextInput();
                  } else if (selectedOption === 'voice') {
                    setCurrentStep(3);
                  } else {
                    alert('Please describe your style or record your voice before proceeding.');
                  }
                }}
              />
            )}

            {/* Step 3: Processing */}
            {currentStep === 3 && (
              <ProcessingStep processingProgress={processingProgress} />
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && showResults && analysisResult && (
              <AnalysisResults
                analysisData={analysisResult}
                onResetFlow={resetFlow}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Main homepage content
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              AI-Powered Interior Design
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Artwork Match
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload a photo of your space and get instant AI-powered artwork recommendations that perfectly match your style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startDemo}
                className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Demo
              </button>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-slate-200 shadow-sm"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Simple steps to perfect artwork</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Upload Photo</h3>
              <p className="text-slate-600">Take a photo of your room or upload an existing image</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Describe Style</h3>
              <p className="text-slate-600">Tell us your preferences via text or voice</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Get Results</h3>
              <p className="text-slate-600">Receive personalized artwork recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Context Storage Feature */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                Smart Learning
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Your Searches Get Smarter</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Every search builds on your previous preferences, creating increasingly personalized recommendations without you having to repeat yourself.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Automatic Learning</h3>
                    <p className="text-slate-600">System learns your style preferences from each search</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Better Results</h3>
                    <p className="text-slate-600">Each recommendation becomes more accurate over time</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Seamless Experience</h3>
                    <p className="text-slate-600">No need to repeat preferences - we remember everything</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">First Search</h3>
                    <p className="text-slate-600 text-sm">&quot;Modern living room art&quot;</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">System Learns</h3>
                    <p className="text-slate-600 text-sm">Modern style preference saved</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Next Search</h3>
                    <p className="text-slate-600 text-sm">&quot;Bedroom decor&quot; → automatically includes modern style</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Perfect Match</h3>
                    <p className="text-slate-600 text-sm">More relevant recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-slate-600">Complete toolkit for interior design</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/dashboard" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-blue-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Dashboard</h3>
                <p className="text-slate-600 text-sm">System overview and analytics</p>
              </div>
            </Link>

            <Link href="/upload-manager" className="group" onClick={startDemo}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-green-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Manager</h3>
                <p className="text-slate-600 text-sm">Advanced file management</p>
              </div>
            </Link>

            <Link href="/recommendations" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-orange-300">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Recommendations</h3>
                <p className="text-slate-600 text-sm">Personalized suggestions</p>
              </div>
            </Link>

            <Link href="/chat" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-purple-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Chat</h3>
                <p className="text-slate-600 text-sm">Real-time design advice</p>
              </div>
            </Link>

            <Link href="/stores" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-yellow-300">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Local Stores</h3>
                <p className="text-slate-600 text-sm">Find nearby retailers</p>
              </div>
            </Link>

            <Link href="/trending" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-pink-300">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Trending Styles</h3>
                <p className="text-slate-600 text-sm">Current design trends</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-12">
            Join thousands of users discovering their perfect artwork with AI-powered recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startDemo}
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
            >
              Try Demo Now
            </button>
            <Link
              href="/auth"
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all duration-300 border border-slate-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}