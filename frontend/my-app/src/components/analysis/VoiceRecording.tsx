interface VoiceRecordingProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function VoiceRecording({ 
  isRecording, 
  isProcessing, 
  onStartRecording, 
  onStopRecording 
}: VoiceRecordingProps) {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-gray-900">Voice Recording</h4>
      </div>
      
      {/* Compact Voice Recording Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-pink-500 to-red-500'
            }`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 text-left">
                {isRecording ? 'Recording...' : 'Voice Input'}
              </p>
              <p className="text-xs text-gray-500">
                {isRecording ? 'Click to stop' : 'Click to start recording'}
              </p>
            </div>
          </div>
         
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? 'Stop' : 'Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
