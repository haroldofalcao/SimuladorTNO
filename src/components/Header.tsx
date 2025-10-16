"use client";

import { useSimulator } from "@/context/SimulatorContext";

export function Header() {
  const { currentSection } = useSimulator();
  const totalSections = 6;

  return (
    <header className="bg-white shadow-md mb-5">
      <div className="max-w-7xl mx-auto px-5 py-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
            Economics
          </h1>

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
