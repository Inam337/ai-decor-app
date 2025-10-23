'use client';

import { useState } from 'react';
import { apiService, RoomAnalysisResult } from '@/services/api';
import { AIService, UserSessionService } from '@/services/database';
import { SessionData, InputType, RoomAnalysis } from '@/types/database';

interface AIAnalysisProps {
  userId: string;
  onAnalysisComplete: (result: any) => void;
}

export function useAIAnalysis({ userId, onAnalysisComplete }: AIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzeRoom = async (file: File, location?: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    let progressInterval: NodeJS.Timeout;

    try {
      // Simulate progress updates with better control
      progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            return prev; // Stop at 95% until API completes
          }
          return prev + Math.random() * 5;
        });
      }, 300);

      // Call the real backend API with timeout
      const result = await Promise.race([
        apiService.analyzeRoom(file, userId, location),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analysis timeout')), 30000)
        )
      ]) as RoomAnalysisResult;
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Transform the result to match our frontend expectations
      const transformedResult = {
        room_type: result.room_analysis.aesthetic_style.style || 'modern',
        style: result.room_analysis.aesthetic_style.style || 'modern',
        lighting: {
          type: result.room_analysis.lighting.lighting_condition,
          intensity: result.room_analysis.lighting.mean_brightness > 150 ? 'bright' : 
                     result.room_analysis.lighting.mean_brightness > 100 ? 'moderate' : 'dim'
        },
        confidence: result.room_analysis.aesthetic_style.confidence,
        colors: {
          primary: result.room_analysis.color_palette.slice(0, 3).map(c => c.hex),
          secondary: result.room_analysis.color_palette.slice(3, 6).map(c => c.hex),
          accent: result.room_analysis.color_palette.slice(6, 9).map(c => c.hex)
        },
        recommendations: result.recommendations,
        reasoning: result.final_reasoning,
        session_id: result.session_id
      };

      onAnalysisComplete(transformedResult);

    } catch (error) {
      console.error('Analysis failed:', error);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Provide fallback result with better data
      const fallbackResult = {
        room_type: 'modern',
        style: 'modern',
        lighting: { type: 'moderate', intensity: 'moderate' },
        confidence: 0.8,
        colors: {
          primary: ['#2c3e50', '#3498db', '#e74c3c'],
          secondary: ['#f8f9fa', '#6c757d', '#495057'],
          accent: ['#28a745', '#6f42c1', '#fd7e14']
        },
        recommendations: [
          {
            id: 'fallback-1',
            title: 'Modern Abstract Art',
            price: 299,
            size: '24x36',
            image_url: 'https://picsum.photos/seed/art1/300/200',
            style_tags: ['Modern', 'Abstract', 'Contemporary']
          },
          {
            id: 'fallback-2',
            title: 'Geometric Wall Art',
            price: 199,
            size: '18x24',
            image_url: 'https://picsum.photos/seed/art2/300/200',
            style_tags: ['Geometric', 'Modern', 'Clean']
          },
          {
            id: 'fallback-3',
            title: 'Minimalist Canvas',
            price: 149,
            size: '16x20',
            image_url: 'https://picsum.photos/seed/art3/300/200',
            style_tags: ['Minimalist', 'Simple', 'Elegant']
          }
        ],
        reasoning: 'Analysis completed with fallback data due to API error.',
        session_id: null
      };
      onAnalysisComplete(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeRoom,
    isAnalyzing,
    analysisProgress
  };
}

interface ChatAIProps {
  userId: string;
  onResponse: (response: string) => void;
}

export function useChatAI({ userId, onResponse }: ChatAIProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = async (message: string, inputType: InputType = 'text') => {
    setIsProcessing(true);

    try {
      // Create session data
      const sessionData: SessionData = {
        input_type: inputType,
        query_text: message,
        timestamp: new Date().toISOString()
      };

      // Save session to database
      const session = await AIService.saveChatSession(userId, sessionData);
      
      // Generate reasoning
      const reasoning = `I understand you're looking for ${message.toLowerCase()}. Based on your preferences, I'd recommend focusing on warm color palettes and modern abstract pieces that would complement your space beautifully.`;
      
      // Update session with reasoning
      await UserSessionService.updateSessionReasoning(session.id, reasoning);
      
      onResponse(reasoning);

    } catch (error) {
      console.error('Chat processing failed:', error);
      onResponse('I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processMessage,
    isProcessing
  };
}

interface VoiceAIProps {
  userId: string;
  onTranscription: (text: string) => void;
  onAnalysis: (result: RoomAnalysis) => void;
}

export function useVoiceAI({ userId, onTranscription, onAnalysis }: VoiceAIProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
    // This would use Web Speech API or similar
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      // Simulate voice transcription
      const transcribedText = "I want modern abstract art for my living room with warm colors";
      onTranscription(transcribedText);

      // Create session data
      const sessionData: SessionData = {
        input_type: 'voice',
        query_text: transcribedText,
        timestamp: new Date().toISOString()
      };

      // Save session to database
      const session = await AIService.saveChatSession(userId, sessionData);
      
      // Generate reasoning
      const reasoning = 'I heard you want modern abstract art for your living room with warm colors. I\'ll find some beautiful pieces that match your requirements.';
      
      // Update session with reasoning
      await UserSessionService.updateSessionReasoning(session.id, reasoning);

      // Create mock room analysis for voice input
      const mockAnalysis: RoomAnalysis = {
        room_type: 'Living Room',
        style: 'Modern',
        colors: {
          primary: ['#FF6B6B', '#4ECDC4'],
          secondary: ['#F7F7F7', '#E8E8E8'],
          accent: ['#FFE66D', '#FF8B94'],
          dominant: '#FF6B6B',
          complementary: ['#4ECDC4', '#45B7D1']
        },
        lighting: {
          type: 'natural',
          intensity: 'medium',
          direction: 'south',
          temperature: 5500,
          brightness: 80
        },
        confidence: 0.85
      };

      onAnalysis(mockAnalysis);

    } catch (error) {
      console.error('Voice processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing
  };
}

// AI Configuration Component
interface AIConfigProps {
  onConfigUpdate: (config: AIConfig) => void;
}

interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  enableVision: boolean;
  enableVoice: boolean;
}

export function useAIConfig({ onConfigUpdate }: AIConfigProps) {
  const [config, setConfig] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    enableVision: true,
    enableVoice: false
  });

  const updateConfig = (key: keyof AIConfig, value: string | number | boolean) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  return {
    config,
    updateConfig
  };
}

// AI Status Component
export function useAIStatus() {
  const [status, setStatus] = useState({
    vision: 'operational',
    language: 'operational',
    voice: 'maintenance',
    recommendations: 'operational'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'maintenance': return 'text-blue-500';
      case 'outage': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return {
    status,
    getStatusColor
  };
}

