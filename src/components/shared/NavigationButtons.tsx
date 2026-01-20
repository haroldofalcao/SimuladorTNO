"use client";

interface NavigationButtonsProps {
  onNext?: () => void;
  onPrevious?: () => void;
  showNext?: boolean;
  showPrevious?: boolean;
  className?: string;
}

export function NavigationButtons({
  onNext,
  onPrevious,
  showNext = true,
  showPrevious = true,
  className,
}: NavigationButtonsProps) {
  return (
    <div className={`flex justify-between mt-8 ${className || ""}`}>
      {showPrevious ? (
        <button
          type="button"
          onClick={onPrevious}
          className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-base"
        >
          ← Anterior
        </button>
      ) : (
        <div />
      )}

      {showNext && (
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base"
        >
          Próximo →
        </button>
      )}
    </div>
  );
}
