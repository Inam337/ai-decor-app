interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  stepDescriptions: string[];
}

export default function ProgressSteps({ 
  currentStep, 
  totalSteps, 
  stepTitles, 
  stepDescriptions 
}: ProgressStepsProps) {
  return (
    <div className="mb-8">
      {/* Progress Indicators */}
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
              step === currentStep 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : step < currentStep 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? '✓' : step}
            </div>
            {step < totalSteps && (
              <div className={`w-12 h-1 mx-1 rounded ${
                step < currentStep 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Title and Description */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {stepTitles[currentStep - 1]}
        </h2>
        <p className="text-gray-600">
          {stepDescriptions[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}
