interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading?: boolean;
}

export default function GenerateButton({ onGenerate, isLoading = false }: GenerateButtonProps) {
  return (
    <div className="mt-8 text-center">
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-12 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none cursor-pointer disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>生成脚本</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
} 