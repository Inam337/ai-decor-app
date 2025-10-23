'use client';

import { useState } from 'react';
import Link from "next/link";
import { useChatAI } from '@/components/ai/AIIntegration';

export default function ChatPage() {
  // Mock user ID - in real app, get from auth context
  const userId = 'user-123';
  const [currentSessionId] = useState<string | null>(null);
  
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

  // Initialize the chat AI hook at component level
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

  // Handle quick action clicks
  const handleQuickAction = (message: string) => {
    setInputValue(message);
    // Trigger send immediately
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
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
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-16 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">AI Design Assistant</h1>
          <p className="text-lg text-slate-600">Get personalized design advice and recommendations</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md px-6 py-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about styles, colors, prices..."
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputValue.trim()}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 mb-4">Quick suggestions:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => handleQuickAction("Show me abstract art")}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Show me abstract art
            </button>
            <button 
              onClick={() => handleQuickAction("What's trending?")}
              disabled={isProcessing}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              What&apos;s trending?
            </button>
            <button 
              onClick={() => handleQuickAction("Find stores near me")}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find stores near me
            </button>
            <button 
              onClick={() => handleQuickAction("Budget under $200")}
              disabled={isProcessing}
              className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Budget under $200
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link 
            href="/recommendations"
            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors"
          >
            View Recommendations
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
