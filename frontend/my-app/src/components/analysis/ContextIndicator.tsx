'use client';

import { useState, useEffect } from 'react';

interface ContextIndicatorProps {
  contextUsed: boolean;
  contextSummary?: string;
  onClearContext?: () => void;
}

export default function ContextIndicator({ 
  contextUsed, 
  contextSummary, 
  onClearContext 
}: ContextIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (contextUsed && contextSummary) {
      setIsVisible(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [contextUsed, contextSummary]);

  if (!isVisible || !contextUsed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Using Previous Search Context
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              {contextSummary}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              💡 Your recommendations are enhanced with information from your previous searches
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {onClearContext && (
            <button
              onClick={onClearContext}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear Context
            </button>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
