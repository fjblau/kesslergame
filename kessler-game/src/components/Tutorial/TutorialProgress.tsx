interface TutorialProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function TutorialProgress({ currentStep, totalSteps }: TutorialProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="text-sm text-gray-400">
        Step {currentStep + 1} of {totalSteps}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'bg-cyber-cyan-500 w-3 h-3'
                : index < currentStep
                ? 'bg-blue-700'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
