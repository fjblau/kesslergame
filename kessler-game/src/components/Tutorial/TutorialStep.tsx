import type { TutorialStepContent } from './tutorialContent';

interface TutorialStepProps {
  stepContent: TutorialStepContent;
}

export function TutorialStep({ stepContent }: TutorialStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
            className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700/70 transition-colors"
          >
            <p className="text-gray-200 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
