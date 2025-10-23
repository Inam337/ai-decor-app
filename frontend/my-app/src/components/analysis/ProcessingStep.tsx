interface ProcessingStepProps {
  processingProgress: number;
}

export default function ProcessingStep({ processingProgress }: ProcessingStepProps) {
  return (
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
  );
}
