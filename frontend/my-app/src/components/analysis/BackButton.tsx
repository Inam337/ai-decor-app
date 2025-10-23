interface BackButtonProps {
  onBack: () => void;
}

export default function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      onClick={onBack}
      className="absolute top-6 left-6 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all flex items-center space-x-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span>Back</span>
    </button>
  );
}
