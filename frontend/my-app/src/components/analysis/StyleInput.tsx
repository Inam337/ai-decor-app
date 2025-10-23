import VoiceRecording from './VoiceRecording';

interface StyleInputProps {
  textDescription: string;
  onTextChange: (text: string) => void;
  imagePreview: string | null;
  isRecording: boolean;
  isProcessing: boolean;
  selectedOption: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onProcessAnalysis: () => void;
}

export default function StyleInput({
  textDescription,
  onTextChange,
  imagePreview,
  isRecording,
  isProcessing,
  selectedOption,
  onStartRecording,
  onStopRecording,
  onProcessAnalysis
}: StyleInputProps) {
  return (
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
            onChange={(e) => onTextChange(e.target.value)}
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
        <VoiceRecording
          isRecording={isRecording}
          isProcessing={isProcessing}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
        />

        {/* Process Analysis Button */}
        <div className="flex justify-center">
          <button
            onClick={onProcessAnalysis}
            disabled={!textDescription.trim() && !selectedOption}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Process Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
