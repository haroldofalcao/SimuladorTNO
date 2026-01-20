export interface SimulatorSensitivities {
    supplementCost: number;
    rrr: number;
    dailyCost: number;
    complicationCost: number;
    coverage: number;
}

export interface SimulatorInputs {
    oralPatients: number;
    riskLow: number;
    riskMod: number;
    riskHigh: number;
    coverage: number;
    losLow: number;
    losMod: number;
    losHigh: number;
    crLow: number;
    crMod: number;
    crHigh: number;
    losReductionLow: number;
    losReductionMod: number;
    losReductionHigh: number;
    suppDays: number;
    suppCostDay: number;
    dailyBedCost: number;
    complicationCost: number;
    rrrComplication: number;
    iterations: number;
    sens: SimulatorSensitivities;
}

export interface TreatedGroups {
    low: number;
    mod: number;
    high: number;
}

export interface CohortResult {
    n: number;
    nLow: number;
    nMod: number;
    nHigh: number;
    treated: TreatedGroups;
    untreated: TreatedGroups;
    los: { low: number; mod: number; high: number };
    cr: { low: number; mod: number; high: number };
    losRed: { low: number; mod: number; high: number };
    suppCost: number;
    compUntreated: number;
    compTreated: number;
    compsAvoided: number;
    losBase: number;
    losSaved: number;
    saveLOS: number;
    saveComp: number;
    totalSavings: number;
    net: number;
    roi: number;
    costPerCompAvoided: number;
}

export interface TornadoRow {
    fator: string;
    min: number;
    max: number;
    span: number;
    color: string;
    baseNet: number;
}

export interface TornadoResult {
    baseNet: number;
    rows: TornadoRow[];
}

export interface StrategyResult {
    nome: string;
    treatedTotal: number;
    t: TreatedGroups;
    cost: number;
    losSaved: number;
    saveLOS: number;
    compsAvoided: number;
    saveComp: number;
    net: number;
}

export interface HistogramBin {
    faixa: string;
    centro: number;
    contagem: number;
}

export interface MonteCarloResult {
    p05: number;
    p50: number;
    p95: number;
    hist: HistogramBin[];
    min: number;
    max: number;
}

export interface SidebarProps {
    guided: boolean;
    setGuided: (v: boolean) => void;
    natureza: string;
    setNatureza: (v: string) => void;
    perfil: string;
    setPerfil: (v: string) => void;
    applyPreset: (name: string) => void;
    oralPatients: number;
    setOralPatients: (v: number) => void;
    dailyBedCost: number;
    setDailyBedCost: (v: number) => void;
    complicationCost: number;
    setComplicationCost: (v: number) => void;
    coverage: number;
    setCoverage: (v: number) => void;
    dosesPerDay: number;
    setDosesPerDay: (v: number) => void;
    suppCostPerDose: number;
    setSuppCostPerDose: (v: number) => void;
    suppDays: number;
    setSuppDays: (v: number) => void;
    rrrComplication: number;
    setRrrComplication: (v: number) => void;
    losReductionHigh: number;
    setLosReductionHigh: (v: number) => void;
    losReductionMod: number;
    setLosReductionMod: (v: number) => void;
    losReductionLow: number;
    setLosReductionLow: (v: number) => void;
    riskLow: number;
    setRiskLow: (v: number) => void;
    riskMod: number;
    setRiskMod: (v: number) => void;
    riskHigh: number;
}
