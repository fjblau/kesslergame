import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { nextTutorialStep, previousTutorialStep, skipTutorial, completeTutorial } from '../../store/slices/uiSlice';
import { TutorialProgress } from './TutorialProgress';
import { TutorialStep } from './TutorialStep';
import { TUTORIAL_STEPS } from './tutorialContent';

export function TutorialModal() {
  const dispatch = useAppDispatch();
  const { tutorialActive, tutorialStep } = useAppSelector(state => state.ui);

  if (!tutorialActive) {
    return null;
  }

  const currentStepContent = TUTORIAL_STEPS[tutorialStep];
  const isFirstStep = tutorialStep === 0;
  const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      dispatch(completeTutorial());
    } else {
      dispatch(nextTutorialStep());
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      dispatch(previousTutorialStep());
    }
  };

  const handleSkip = () => {
    dispatch(skipTutorial());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-800 border border-slate-700 rounded-xl p-10 shadow-2xl my-8">
        <TutorialProgress currentStep={tutorialStep} totalSteps={TUTORIAL_STEPS.length} />
        
        <TutorialStep stepContent={currentStepContent} />

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg font-semibold transition-all"
          >
            Skip Tutorial
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isFirstStep
                ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            {isLastStep ? 'Get Started!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
