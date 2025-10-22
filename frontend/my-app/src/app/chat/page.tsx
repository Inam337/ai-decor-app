'use client';

import { useState } from 'react';
import Link from "next/link";
import { useChatAI } from '@/components/ai/AIIntegration';
import { UserSessionService } from '@/services/database';
import { UserSession, SessionData, InputType } from '@/types/database';

export default function ChatPage() {
  // Mock user ID - in real app, get from auth context
  const userId = 'user-123';
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Array<{
    id: string;
    session_id: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: string;
  }>>([
    {
      id: '1',
      session_id: 'temp',
      sender: 'bot',
      message: "Hi! I analyzed your room. The beige tones and natural lighting suggest you'd love warm, earthy artwork. What's your budget range?",
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      session_id: 'temp',
      sender: 'user',
      message: "Between 100 and 200 dollars",
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      session_id: 'temp',
      sender: 'bot',
      message: "Perfect! I found 5 beautiful pieces in that range. They all feature warm color palettes that complement your space.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const { processMessage, isProcessing } = useChatAI({
        userId,
        onResponse: (response) => {
          // Add AI response to messages
          const aiMessage = {
            id: `ai-${Date.now()}`,
            session_id: currentSessionId || 'temp',
            sender: 'bot' as const,
            message: response,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      });

      // Add user message
      const userMessage = {
        id: `user-${Date.now()}`,
        session_id: currentSessionId || 'temp',
        sender: 'user' as const,
        message: inputValue,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Process message with AI
      await processMessage(inputValue, 'text');
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <h2 className="text-2xl font-bold text-white">Chat with Your AI Stylist</h2>
              </div>
              
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                        <span className="text-white text-sm font-bold">You</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about styles, colors, prices..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-r-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chat Interface</h3>
              <p className="text-gray-600 mb-4">Conversational AI assistant</p>
              <div className="text-sm text-gray-500 mb-6">
                Screen 6 of 6
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">AI Capabilities</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Style recommendations</li>
                    <li>• Color matching</li>
                    <li>• Budget planning</li>
                    <li>• Room analysis</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900">
                      Show me abstract art
                    </button>
                    <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900">
                      What's trending?
                    </button>
                    <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900">
                      Find stores near me
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Session Summary</h4>
                  <p className="text-sm text-green-700">
                    Analyzed room, discussed budget, found 5 recommendations
                  </p>
                </div>
              </div>
              
              <Link 
                href="/recommendations"
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-center block"
              >
                View Recommendations →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
