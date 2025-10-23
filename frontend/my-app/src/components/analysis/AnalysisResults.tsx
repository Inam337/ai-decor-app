import Link from 'next/link';
import { RoomAnalysisResult } from '@/types';

interface AnalysisResultsProps {
  analysisData: RoomAnalysisResult | null;
  onResetFlow: () => void;
}

export default function AnalysisResults({ 
  analysisData, 
  onResetFlow 
}: AnalysisResultsProps) {
  // Add null check and loading state
  if (!analysisData) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Analysis...</h3>
        <p className="text-gray-600 mb-8">Please wait while we process your room analysis</p>
      </div>
    );
  }

  // Extract data from the new API response structure
  const roomAnalysis = analysisData.room_analysis;
  const recommendations = analysisData.recommendations;
  const finalReasoning = analysisData.final_reasoning;
  
  // Helper function to get total detected objects
  const getTotalDetectedObjects = () => {
    const detections = roomAnalysis?.detections;
    if (!detections) return 0;
    return (detections.walls?.length || 0) + 
           (detections.windows?.length || 0) + 
           (detections.furniture?.length || 0) + 
           (detections.other?.length || 0);
  };

  // Helper function to get wall colors from detections
  const getWallColors = () => {
    const detections = roomAnalysis?.detections;
    if (!detections?.walls) return [];
    return detections.walls.map((wall: { color?: string }) => wall.color || '#f0f0f0');
  };
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete!</h3>
      <p className="text-gray-600 mb-8">Your personalized analysis and recommendations are ready</p>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Mandatory Metrics Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Analysis Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Style Confidence - MANDATORY */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Style Confidence</h4>
              <p className="text-3xl font-bold text-green-600">{((roomAnalysis?.aesthetic_style?.confidence || 0) * 100).toFixed(0)}%</p>
              <p className="text-sm text-gray-600 mt-2">AI Analysis Accuracy</p>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">MANDATORY</span>
              </div>
            </div>

            {/* Detected Objects Count - MANDATORY */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Objects Detected</h4>
              <p className="text-3xl font-bold text-blue-600">{getTotalDetectedObjects()}</p>
              <p className="text-sm text-gray-600 mt-2">Items Found</p>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">MANDATORY</span>
              </div>
            </div>

            {/* Color Palette Count - MANDATORY */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-green-200">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Color Palette</h4>
              <p className="text-3xl font-bold text-pink-600">{roomAnalysis?.color_palette?.length || 0}</p>
              <p className="text-sm text-gray-600 mt-2">Colors Identified</p>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">MANDATORY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Color Palette Section - MANDATORY */}
        <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-purple-200">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">🎨 Color Palette Analysis</h4>
            <p className="text-gray-600">Primary colors detected from your space</p>
            <div className="mt-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">MANDATORY</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {(roomAnalysis?.color_palette || []).map((colorData: { hex: string; percentage: number }, index: number) => (
              <div key={index} className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl border-3 border-white shadow-xl mx-auto mb-3"
                  style={{ backgroundColor: colorData.hex }}
                  title={`${colorData.hex} (${colorData.percentage.toFixed(1)}%)`}
                ></div>
                <p className="text-xs font-mono text-gray-600">{colorData.hex}</p>
                <p className="text-xs text-gray-500">{colorData.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Style:</span> {roomAnalysis?.aesthetic_style?.style || 'Unknown'} | 
              <span className="font-semibold"> Confidence:</span> {((roomAnalysis?.aesthetic_style?.confidence || 0) * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Analysis Attributes Section - MANDATORY */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">📊 Analysis</h4>
            <p className="text-gray-600">Detailed room analysis results</p>
            <div className="mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">MANDATORY</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Wall Color */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="text-left">
                <p className="text-gray-700 font-medium">Wall Color</p>
              </div>
              <div className="flex items-center space-x-2">
                {getWallColors().length > 0 ? (
                  getWallColors().slice(0, 2).map((color, index) => (
                    <div 
                      key={index}
                      className="w-8 h-8 rounded border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gray-800 rounded border-2 border-white shadow-sm"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded border-2 border-white shadow-sm"></div>
                  </>
                )}
              </div>
            </div>

            {/* Lighting */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="text-left">
                <p className="text-gray-700 font-medium">Lighting</p>
              </div>
              <div className="text-right">
                <span className="text-yellow-600 font-semibold">
                  {roomAnalysis?.lighting?.lighting_condition || 'Natural Light'}
                </span>
              </div>
            </div>

            {/* Room Type */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="text-left">
                <p className="text-gray-700 font-medium">Room Type</p>
              </div>
              <div className="text-right">
                <span className="text-blue-600 font-semibold">
                  Living Room
                </span>
              </div>
            </div>

            {/* Style Detected */}
            <div className="flex items-center justify-between py-4">
              <div className="text-left">
                <p className="text-gray-700 font-medium">Style Detected</p>
              </div>
              <div className="text-right">
                <span className="text-purple-600 font-semibold">{roomAnalysis?.aesthetic_style?.style || 'Unknown Style'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Objects */}
        <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">🔍 Detected Objects</h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {(roomAnalysis?.detections?.furniture || []).map((item: { name?: string; type?: string }, index: number) => (
              <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full border border-blue-200">
                {item.name || item.type || 'Furniture'}
              </span>
            ))}
            {(roomAnalysis?.detections?.windows || []).map((item: { name?: string; type?: string }, index: number) => (
              <span key={`window-${index}`} className="bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full border border-green-200">
                Window
              </span>
            ))}
            {(roomAnalysis?.detections?.other || []).map((item: { name?: string; type?: string }, index: number) => (
              <span key={`other-${index}`} className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full border border-gray-200">
                {item.name || item.type || 'Other'}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">Objects found in your space</p>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(recommendations || []).map((rec) => (
            <div key={rec.artwork_id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 hover:shadow-lg transition-all">
              {rec.image_url && (
                <img 
                  src={rec.image_url} 
                  alt={rec.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{rec.reasoning}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {rec.style && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {rec.style}
                  </span>
                )}
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Match: {(rec.match_score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                {rec.price && (
                  <span className="text-xl font-bold text-gray-900">${rec.price}</span>
                )}
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Final Reasoning */}
        {finalReasoning && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">💡 AI Analysis Summary</h4>
            <p className="text-gray-700 text-center leading-relaxed">{finalReasoning}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Find Items Button - Skip Reasoning Agent */}
          <Link
            href="/trending"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-xl hover:shadow-2xl block text-center transform hover:scale-105"
          >
            🔍 Find Items - Browse Available Online Items
            <div className="text-sm font-normal mt-1 opacity-90">
              Skip reasoning agent • Direct to VDB • Show all available items
            </div>
          </Link>
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
            onClick={onResetFlow}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
