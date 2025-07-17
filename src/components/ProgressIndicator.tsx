interface ProgressIndicatorProps {
  isFormComplete: boolean;
  isScriptGenerated: boolean;
}

export default function ProgressIndicator({ isFormComplete, isScriptGenerated }: ProgressIndicatorProps) {
  const steps = [
    { 
      number: 1, 
      title: '填写脚本信息', 
      completed: isFormComplete 
    },
    { 
      number: 2, 
      title: '生成脚本', 
      completed: isScriptGenerated 
    }
  ];

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-36">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {step.completed ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`text-xs mt-2 text-center font-medium ${
                step.completed ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div 
                  className={`w-0.5 h-8 mt-2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 