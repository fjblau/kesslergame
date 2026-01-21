import { TutorialProgress } from './TutorialProgress';
import { TutorialStep } from './TutorialStep';
import { TUTORIAL_STEPS } from './tutorialContent';

interface TutorialModalProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export function TutorialModal({ currentStep, onNext, onPrevious, onClose }: TutorialModalProps) {
  const currentStepContent = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50 overflow-y-auto">
      <div className="max-w-4xl w-full bg-deep-space-300 border border-deep-space-50 border-none p-10 shadow-2xl my-8">
        <TutorialProgress currentStep={currentStep} totalSteps={TUTORIAL_STEPS.length} />
        
        <TutorialStep stepContent={currentStepContent} />

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-deep-space-100 hover:bg-deep-space-50 text-gray-300 border-none font-semibold transition-all"
          >
            Close
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={onPrevious}
            disabled={isFirstStep}
            className={`px-6 py-3 border-none font-semibold transition-all ${
              isFirstStep
                ? 'bg-deep-space-100 text-gray-500 cursor-not-allowed'
                : 'bg-deep-space-100 hover:bg-deep-space-50 text-white'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-none font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            {isLastStep ? 'Get Started!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
