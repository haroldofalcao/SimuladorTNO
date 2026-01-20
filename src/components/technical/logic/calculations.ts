// Utilities
import {
    CohortResult,
    MonteCarloResult,
    SimulatorInputs,
    StrategyResult,
    TornadoResult,
} from "../types";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
export const reais = (x: number) =>
    x.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const tornadoColors = [
    "#2563eb",
    "#7c3aed",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#0ea5e9",
];

const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

// 1. Deterministic Cohort Calculation
export function calculateCohort(p: SimulatorInputs): CohortResult {
    const n = Math.max(0, Math.round(p.oralPatients));
    const nLow = Math.round(n * p.riskLow);
    const nMod = Math.round(n * p.riskMod);
    const nHigh = Math.max(0, n - nLow - nMod);
    const cov = clamp01(p.coverage);
    const treated = {
        low: Math.round(nLow * cov),
        mod: Math.round(nMod * cov),
        high: Math.round(nHigh * cov),
    };
    const untreated = {
        low: nLow - treated.low,
        mod: nMod - treated.mod,
        high: nHigh - treated.high,
    };
    const los = { low: p.losLow, mod: p.losMod, high: p.losHigh };
    const cr = { low: p.crLow, mod: p.crMod, high: p.crHigh };
    const losRed = {
        low: p.losReductionLow,
        mod: p.losReductionMod,
        high: p.losReductionHigh,
    };
    const suppCost =
        (treated.low + treated.mod + treated.high) *
        Math.max(0, p.suppDays) *
        Math.max(0, p.suppCostDay);
    const compUntreated =
        untreated.low * cr.low + untreated.mod * cr.mod + untreated.high * cr.high;
    const compTreatedNoEffect =
        treated.low * cr.low + treated.mod * cr.mod + treated.high * cr.high;
    const compTreated =
        compTreatedNoEffect * (1 - Math.max(0, p.rrrComplication));
    const compsAvoided = Math.max(0, compTreatedNoEffect - compTreated);
    const losBase = nLow * los.low + nMod * los.mod + nHigh * los.high;
    const losSaved = Math.max(
        0,
        treated.low * losRed.low +
        treated.mod * losRed.mod +
        treated.high * losRed.high
    );
    const saveLOS = losSaved * Math.max(0, p.dailyBedCost);
    const saveComp = compsAvoided * Math.max(0, p.complicationCost);
    const totalSavings = saveLOS + saveComp;
    const net = totalSavings - suppCost;
    const roi = suppCost > 0 ? net / suppCost : 0;
    const costPerCompAvoided =
        compsAvoided > 0 ? suppCost / compsAvoided : Infinity;
    return {
        n,
        nLow,
        nMod,
        nHigh,
        treated,
        untreated,
        los,
        cr,
        losRed,
        suppCost,
        compUntreated,
        compTreated,
        compsAvoided,
        losBase,
        losSaved,
        saveLOS,
        saveComp,
        totalSavings,
        net,
        roi,
        costPerCompAvoided,
    };
}

// 2. Asynchronous Monte Carlo Calculation
export async function calculateMonteCarlo(p: SimulatorInputs, setProgress: (v: number) => void): Promise<MonteCarloResult> {
    const data = [];
    const n = Math.max(0, Math.round(p.oralPatients));
    const batchSize = Math.max(100, Math.floor(p.iterations / 100));
    for (let i = 0; i < p.iterations; i++) {
        const mulSupp =
            1 + (Math.random() * 2 * p.sens.supplementCost - p.sens.supplementCost);
        const mulRRR = 1 + (Math.random() * 2 * p.sens.rrr - p.sens.rrr);
        const mulDaily =
            1 + (Math.random() * 2 * p.sens.dailyCost - p.sens.dailyCost);
        const mulCompC =
            1 +
            (Math.random() * 2 * p.sens.complicationCost - p.sens.complicationCost);
        const mulCov = 1 + (Math.random() * 2 * p.sens.coverage - p.sens.coverage);
        const cov = clamp01(p.coverage * mulCov);
        const nLow = Math.round(n * p.riskLow);
        const nMod = Math.round(n * p.riskMod);
        const nHigh = Math.max(0, n - nLow - nMod);
        const tLow = Math.round(nLow * cov);
        const tMod = Math.round(nMod * cov);
        const tHigh = Math.round(nHigh * cov);
        const suppCost =
            (tLow + tMod + tHigh) *
            Math.max(0, p.suppDays) *
            Math.max(0, p.suppCostDay * mulSupp);
        const compTreatNoEff = tLow * p.crLow + tMod * p.crMod + tHigh * p.crHigh;
        const rrr = Math.max(0, p.rrrComplication * mulRRR);
        const compTreat = compTreatNoEff * (1 - rrr);
        const compsAvoided = Math.max(0, compTreatNoEff - compTreat);
        const losSaved = Math.max(
            0,
            tLow * p.losReductionLow +
            tMod * p.losReductionMod +
            tHigh * p.losReductionHigh
        );
        const saveLOS = losSaved * Math.max(0, p.dailyBedCost * mulDaily);
        const saveComp = compsAvoided * Math.max(0, p.complicationCost * mulCompC);
        const net = saveLOS + saveComp - suppCost;
        data.push(net);
        if (i % batchSize === 0) {
            setProgress(i / p.iterations);
            await yieldToMain();
        }
    }
    data.sort((a, b) => a - b);
    const idx = (pct: number) =>
        Math.max(0, Math.min(data.length - 1, Math.floor(pct * (data.length - 1))));
    const p05 = data[idx(0.05)] ?? 0;
    const p50 = data[idx(0.5)] ?? 0;
    const p95 = data[idx(0.95)] ?? 0;
    const min = data[0] ?? 0;
    const max = data[data.length - 1] ?? 0;
    const bins = 14;
    const hist = Array.from({ length: bins }, () => 0);
    const edges = Array.from(
        { length: bins + 1 },
        (_, i) => min + ((max - min) * i) / bins
    );
    for (const v of data) {
        if (max === min) {
            hist[0] += 1;
            continue;
        }
        let k = Math.floor(((v - min) / (max - min)) * bins);
        if (k === bins) k = bins - 1;
        hist[k] += 1;
    }
    const histData = hist.map((count, k) => {
        const x0 = edges[k];
        const x1 = edges[k + 1];
        return {
            faixa: `${reais(x0)} – ${reais(x1)}`,
            centro: (x0 + x1) / 2,
            contagem: count,
        };
    });
    return { p05, p50, p95, hist: histData, min, max };
}

// 3. Tornado Chart Calculation
export function calculateTornado(baseNet: number, p: SimulatorInputs): TornadoResult {
    function computeNetWith(overrides: any) {
        const n = Math.max(0, Math.round(p.oralPatients));
        const cov = clamp01(overrides.cov ?? p.coverage);
        const nLow = Math.round(n * p.riskLow);
        const nMod = Math.round(n * p.riskMod);
        const nHigh = Math.max(0, n - nLow - nMod);
        const tLow = Math.round(nLow * cov);
        const tMod = Math.round(nMod * cov);
        const tHigh = Math.round(nHigh * cov);
        const suppCost =
            (tLow + tMod + tHigh) * p.suppDays * (overrides.supp ?? p.suppCostDay);
        const compTreatNoEff = tLow * p.crLow + tMod * p.crMod + tHigh * p.crHigh;
        const rrr = Math.max(0, overrides.rrr ?? p.rrrComplication);
        const compTreat = compTreatNoEff * (1 - rrr);
        const compsAvoided = Math.max(0, compTreatNoEff - compTreat);
        const losSaved =
            tLow * p.losReductionLow +
            tMod * p.losReductionMod +
            tHigh * p.losReductionHigh;
        const saveLOS = losSaved * (overrides.daily ?? p.dailyBedCost);
        const saveComp = compsAvoided * (overrides.comp ?? p.complicationCost);
        return saveLOS + saveComp - suppCost;
    }
    const items = [
        {
            key: "Custo do suplemento (R$/dia)",
            base: p.suppCostDay,
            amp: p.sens.supplementCost,
            apply: (v: number) => computeNetWith({ supp: v }),
        },
        {
            key: "RRR de complicações (%)",
            base: p.rrrComplication,
            amp: p.sens.rrr,
            apply: (v: number) => computeNetWith({ rrr: v }),
        },
        {
            key: "Custo diário do leito (R$)",
            base: p.dailyBedCost,
            amp: p.sens.dailyCost,
            apply: (v: number) => computeNetWith({ daily: v }),
        },
        {
            key: "Custo por complicação (R$)",
            base: p.complicationCost,
            amp: p.sens.complicationCost,
            apply: (v: number) => computeNetWith({ comp: v }),
        },
        {
            key: "Cobertura de suplementação (%)",
            base: p.coverage,
            amp: p.sens.coverage,
            apply: (v: number) => computeNetWith({ cov: v }),
        },
    ];
    const rows = items
        .map((it, idx) => {
            const low = it.base * (1 - it.amp);
            const high = it.base * (1 + it.amp);
            const netLow = it.apply(low);
            const netHigh = it.apply(high);
            const min = Math.min(netLow, netHigh);
            const max = Math.max(netLow, netHigh);
            return {
                fator: it.key,
                min,
                max,
                span: max - min,
                color: tornadoColors[idx % tornadoColors.length],
                baseNet,
            };
        })
        .sort((a, b) => b.span - a.span);
    return { baseNet, rows };
}

// 4. Strategy Calculation
export function calculateStrategies(cohort: CohortResult, p: SimulatorInputs): StrategyResult[] {
    const { n, nLow, nMod, nHigh, treated } = cohort;
    const treatedTotal = treated.low + treated.mod + treated.high;

    const evalScenario = (t: any) => {
        const cost =
            treatedTotal * Math.max(0, p.suppDays) * Math.max(0, p.suppCostDay);
        const losSaved =
            t.low * p.losReductionLow +
            t.mod * p.losReductionMod +
            t.high * p.losReductionHigh;
        const saveLOS = losSaved * Math.max(0, p.dailyBedCost);
        const compsAvoided =
            t.low * p.crLow * p.rrrComplication +
            t.mod * p.crMod * p.rrrComplication +
            t.high * p.crHigh * p.rrrComplication;
        const saveComp = compsAvoided * Math.max(0, p.complicationCost);
        const net = saveLOS + saveComp - cost;
        return { t, cost, losSaved, saveLOS, compsAvoided, saveComp, net };
    };

    // Strategy 1: Proportional to risk distribution (apply to all)
    const adj = (val: number, max: number) => Math.max(0, Math.min(val, max));
    const tP_low_raw = Math.round(treatedTotal * (nLow / Math.max(1, n)));
    const tP_mod_raw = Math.round(treatedTotal * (nMod / Math.max(1, n)));
    const tP_high_raw = treatedTotal - tP_low_raw - tP_mod_raw;
    const tP_low = adj(tP_low_raw, nLow);
    const tP_mod = adj(tP_mod_raw, nMod);
    const tP_high = adj(
        tP_high_raw + (tP_low_raw - tP_low) + (tP_mod_raw - tP_mod),
        nHigh
    );
    const proportionalTreated = { low: tP_low, mod: tP_mod, high: tP_high };
    const proportionalScenario = {
        nome: "Usar em todos (proporcional)",
        ...evalScenario(proportionalTreated),
        treatedTotal,
    };

    // Strategy 2: Prioritize high, then moderate risk
    let rem = treatedTotal;
    const tF_high = Math.min(rem, nHigh);
    rem -= tF_high;
    const tF_mod = Math.min(rem, nMod);
    rem -= tF_mod;
    const tF_low = Math.min(rem, nLow);
    const focusTreated = { low: tF_low, mod: tF_mod, high: tF_high };
    const focusScenario = {
        nome: "Focar em risco Mod./Alto",
        ...evalScenario(focusTreated),
        treatedTotal,
    };

    return [proportionalScenario, focusScenario];
}
