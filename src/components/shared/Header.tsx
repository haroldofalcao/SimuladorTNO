"use client";

import { useSimulator } from "@/context/SimulatorContext";

export function Header() {
  const { currentSection, setCurrentSection } = useSimulator();
  const totalSections = 6;

  return (
    <header className="bg-white  shadow-md mb-5">
      <div className="max-w-7xl mx-auto px-5 py-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              Economics
            </h1>

            <button
              type="button"
              onClick={() => setCurrentSection(7)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg hover:border-blue-600 dark:hover:border-blue-400"
              title="Ver Termos de Uso"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="hidden sm:inline">Termos de Uso</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {Array.from({ length: totalSections }, (_, i) => i + 1).map(
              (step) => (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${
                    step === currentSection
                      ? "bg-blue-600 scale-110"
                      : step < currentSection
                        ? "bg-green-600"
                        : "bg-gray-400"
                  }`}
                >
                  {step}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
