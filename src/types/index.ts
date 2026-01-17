export interface HospitalType {
    name: string;
    costRange: { min: number; max: number };
    avgDaily: number;
    avgComplicationCost: number;
    description: string;
}

export interface PatientType {
    name: string;
    avgLOS: number;
    responseRate: number;
    baseROI: number;
    baseComplicationRate: number;
    complicationReductionFactor: number;
    losReductionFactor: number;
    description: string;
}

export interface Config {
    hospitalType: 'publico' | 'privado' | 'misto';
    patientType: 'cirurgico' | 'clinico' | 'misto';
    populacao: number;
    eficaciaTNO: number;
    adesao: number;
    custoTNODiario: number;
    ranges: {
        populacao: { min: number; max: number };
        eficacia: { min: number; max: number };
        adesao: { min: number; max: number };
        custoTNO: { min: number; max: number };
    };
}

export interface SimulationResults {
    comTNO: {
        tempoInternacao: number;
        custo: number;
        custoTNO: number;
        complicacoes: number;
    };
    semTNO: {
        tempoInternacao: number;
        custo: number;
        complicacoes: number;
    };
}
