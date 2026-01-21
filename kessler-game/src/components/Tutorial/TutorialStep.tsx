import type { TutorialStepContent } from './tutorialContent';

interface TutorialStepProps {
  stepContent: TutorialStepContent;
}

export function TutorialStep({ stepContent }: TutorialStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-center mb-2 text-cyber-cyan-500">
          {stepContent.title}
        </h2>
        <p className="text-center text-gray-400 text-sm">
          {stepContent.description}
        </p>
      </div>

      <div className="space-y-3">
        {stepContent.points.map((point, index) => (
          <div
            key={index}
            className="p-4 bg-deep-space-100/50 border border-deep-space-50 border-none hover:bg-deep-space-100/70 transition-colors"
          >
            <p className="text-gray-200 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
