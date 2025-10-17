"use client";

import React, {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import type {
  Config,
  HospitalType,
  PatientType,
  SimulationResults,
} from "@/types";

interface SimulatorContextType {
  currentSection: number;
  config: Config;
  resultados: SimulationResults | null;
  hospitalData: Record<string, HospitalType>;
  patientData: Record<string, PatientType>;
  setCurrentSection: (section: number) => void;
  updateConfig: (updates: Partial<Config>) => void;
  setResultados: (results: SimulationResults) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(
  undefined,
);

const hospitalData: Record<string, HospitalType> = {
  publico: {
    name: "Hospital Público/SUS",
    costRange: { min: 196, max: 680 },
    avgDaily: 380,
    description: "Foco em custo-efetividade e atendimento universal",
  },
  privado: {
    name: "Hospital Privado",
    costRange: { min: 359, max: 5000 },
    avgDaily: 1200,
    description: "Convênios e particulares com alto padrão",
  },
  misto: {
    name: "Hospital Misto",
    costRange: { min: 280, max: 950 },
    avgDaily: 600,
    description: "Atende SUS e convênios/particulares",
  },
};

const patientData: Record<string, PatientType> = {
  cirurgico: {
    name: "Pacientes Cirúrgicos",
    avgLOS: 6,
    responseRate: 0.85,
    baseROI: 550,
    description: "Foco em cicatrização e recuperação pós-operatória",
  },
  clinico: {
    name: "Pacientes Clínicos",
    avgLOS: 14,
    responseRate: 0.78,
    baseROI: 800,
    description: "Patologias complexas e internações prolongadas",
  },
  misto: {
    name: "Perfil Misto",
    avgLOS: 10,
    responseRate: 0.81,
    baseROI: 675,
    description: "Mistura equilibrada de ambos os perfis",
  },
};

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState(1);
  const [resultados, setResultados] = useState<SimulationResults | null>(null);
  const [config, setConfig] = useState<Config>({
    hospitalType: "privado",
    patientType: "cirurgico",
    populacao: 10000,
    eficaciaTNO: 75,
    adesao: 80,
    custoTNODiario: 15,
    ranges: {
      populacao: { min: 1000, max: 50000 },
      eficacia: { min: 30, max: 95 },
      adesao: { min: 40, max: 95 },
      custoTNO: { min: 5, max: 50 },
    },
  });

  const updateConfig = (updates: Partial<Config>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SimulatorContext.Provider
      value={{
        currentSection,
        config,
        resultados,
        hospitalData,
        patientData,
        setCurrentSection,
        updateConfig,
        setResultados,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }
  return context;
}
