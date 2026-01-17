"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    ReferenceLine,
} from "recharts";

// ---------- Utilities ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
const reais = (x: number) =>
    x.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));
const tornadoColors = [
    "#2563eb",
    "#7c3aed",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#0ea5e9",
];

// ---------- Calculation Logic (Unchanged) ----------

// 1. Deterministic Cohort Calculation
function calculateCohort(p: any) {
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
async function calculateMonteCarlo(p: any, setProgress: (v: number) => void) {
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
function calculateTornado(baseNet: number, p: any) {
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
function calculateStrategies(cohort: any, p: any) {
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

// ---------- UI Components ----------

const Section = ({ title, children, guidedText }: any) => (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <h3 className="mt-0 text-lg font-semibold text-gray-800">{title}</h3>
        {guidedText && (
            <ul className="text-xs text-gray-600 mt-0 pl-4 list-disc">
                {guidedText.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                ))}
            </ul>
        )}
        <div className="mt-4">{children}</div>
    </div>
);

const KpiCard = ({ title, value, subtitle, positive }: any) => (
    <div
        className="border border-gray-200 rounded-xl p-4 bg-white"
        aria-live="polite"
    >
        <div className="text-xs text-gray-600">{title}</div>
        <div
            className={`text-xl font-bold ${positive === true
                    ? "text-emerald-700"
                    : positive === false
                        ? "text-red-700"
                        : "text-gray-900"
                }`}
        >
            {value}
        </div>
        <div className="text-xs text-gray-600">{subtitle}</div>
    </div>
);

const NumInput = ({
    labelText,
    value,
    onChange,
    step = 1,
    min = 0,
    max = 999999,
    suffix,
    prefix,
    helpText,
}: any) => (
    <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-800">{labelText}</label>
        <div className="flex items-center gap-2">
            {prefix && <span className="text-gray-500">{prefix}</span>}
            <input
                type="number"
                step={step}
                min={min}
                max={max}
                value={Number.isFinite(value) ? value : ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {suffix && <span className="text-gray-500">{suffix}</span>}
        </div>
        {helpText && (
            <span className="text-xs text-gray-600 leading-tight">{helpText}</span>
        )}
    </div>
);

const PctSlider = ({ labelText, value, onChange }: any) => (
    <div className="grid gap-1">
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-800">{labelText}</label>
            <span
                className="text-sm font-semibold text-indigo-700"
                aria-live="polite"
            >
                {pct(value)}
            </span>
        </div>
        <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(value * 100)}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            className="w-full"
        />
    </div>
);

const ToggleButton = ({ children, onClick, active }: any) => (
    <button
        onClick={onClick}
        aria-pressed={active}
        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${active
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
    >
        {children}
    </button>
);

// ---------- Main Application Component ----------
export function TechnicalSimulator() {
    const [guided, setGuided] = useState(true);
    const [natureza, setNatureza] = useState("Publico");
    const [perfil, setPerfil] = useState("Clinico");
    const [oralPatients, setOralPatients] = useState(300);
    const [riskLow, setRiskLow] = useState(0.5);
    const [riskMod, setRiskMod] = useState(0.35);
    const [dailyBedCost, setDailyBedCost] = useState(900);
    const [complicationCost, setComplicationCost] = useState(6000);
    const [losLow, setLosLow] = useState(4);
    const [losMod, setLosMod] = useState(7);
    const [losHigh, setLosHigh] = useState(10);
    const [crLow, setCrLow] = useState(0.04);
    const [crMod, setCrMod] = useState(0.1);
    const [crHigh, setCrHigh] = useState(0.22);
    const [dosesPerDay, setDosesPerDay] = useState(2);
    const [suppCostPerDose, setSuppCostPerDose] = useState(9);
    const [suppDays, setSuppDays] = useState(5);
    const [coverage, setCoverage] = useState(0.6);
    const [rrrComplication, setRrrComplication] = useState(0.18);
    const [losReductionLow, setLosReductionLow] = useState(0.2);
    const [losReductionMod, setLosReductionMod] = useState(0.5);
    const [losReductionHigh, setLosReductionHigh] = useState(0.8);
    const [iterations, setIterations] = useState(1000);
    const [sens, setSens] = useState({
        supplementCost: 0.2,
        rrr: 0.2,
        dailyCost: 0.2,
        complicationCost: 0.2,
        coverage: 0.2,
    });
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [cohort, setCohort] = useState<any>(null);
    const [mc, setMc] = useState<any>(null);
    const [tornado, setTornado] = useState<any>(null);
    const [strategyRows, setStrategyRows] = useState<any>(null);
    const [presetMsg, setPresetMsg] = useState<string | null>(null);

    const riskHigh = useMemo(
        () => Math.max(0, 1 - riskLow - riskMod),
        [riskLow, riskMod]
    );

    useEffect(() => {
        if (presetMsg) {
            const t = setTimeout(() => setPresetMsg(null), 3500);
            return () => clearTimeout(t);
        }
    }, [presetMsg]);

    const setRiskDist = (which: string, val: number) => {
        val = clamp01(val);
        if (which === "low") {
            const newMod = Math.min(riskMod, 1 - val);
            setRiskLow(val);
            setRiskMod(newMod);
        } else if (which === "mod") {
            const newLow = Math.min(riskLow, 1 - val);
            setRiskMod(val);
            setRiskLow(newLow);
        }
    };

    async function runSimulation() {
        setIsRunning(true);
        setProgress(0);
        setCohort(null);
        setMc(null);
        setTornado(null);
        setStrategyRows(null);

        const suppCostDay = dosesPerDay * suppCostPerDose;
        const inputs = {
            oralPatients,
            riskLow,
            riskMod,
            riskHigh,
            coverage,
            losLow,
            losMod,
            losHigh,
            crLow,
            crMod,
            crHigh,
            losReductionLow,
            losReductionMod,
            losReductionHigh,
            suppDays,
            suppCostDay,
            dailyBedCost,
            complicationCost,
            rrrComplication,
            iterations,
            sens,
        };

        const cohortResult = calculateCohort(inputs);
        setCohort(cohortResult);
        setProgress(0.1);
        await yieldToMain();

        const tornadoResult = calculateTornado(cohortResult.net, inputs);
        setTornado(tornadoResult);
        setProgress(0.2);
        await yieldToMain();

        const strategyResult = calculateStrategies(cohortResult, inputs);
        setStrategyRows(strategyResult);
        setProgress(0.3);
        await yieldToMain();

        const mcResult = await calculateMonteCarlo(inputs, (p) =>
            setProgress(0.3 + p * 0.7)
        );
        setMc(mcResult);

        setProgress(1);
        setIsRunning(false);
    }

    function applyPreset(name: string) {
        const [nat, per] = name.split(" ");
        setNatureza(nat);
        setPerfil(per);
        const isPrivate = nat === "Privado";
        const isSurgical = per === "Cirurgico";
        const newDailyCost = isPrivate ? 2300 : 950;
        const newCompCost = isPrivate
            ? isSurgical
                ? 14000
                : 11000
            : isSurgical
                ? 9000
                : 6000;
        setDailyBedCost(newDailyCost);
        setComplicationCost(newCompCost);
        setOralPatients(300);
        setCoverage(0.6);
        setDosesPerDay(2);
        setSuppCostPerDose(9);
        setSuppDays(5);
        setRrrComplication(0.18);
        setPresetMsg(
            `Preset aplicado: ${name}. Leito: ${reais(
                newDailyCost
            )} · Complicação: ${reais(newCompCost)}.`
        );
    }

    return (
        <div className="w-full p-2 bg-gray-50 font-sans grid gap-4">
            <header className="flex justify-between items-start gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Simulador de ROI - Módulo Técnico
                    </h1>
                    <p className="text-sm text-gray-600">
                        Análise Avançada e Farmacoeconomia
                    </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={guided}
                        onChange={(e) => setGuided(e.target.checked)}
                    />
                    Modo Guiado
                </label>
            </header>

            {presetMsg && (
                <div className="text-sm text-indigo-700 bg-indigo-50 p-3 rounded-lg">
                    ℹ️ {presetMsg}
                </div>
            )}

            <Section
                title="Parâmetros da Simulação"
                guidedText={
                    guided
                        ? [
                            "Ajuste os valores para refletir a realidade do seu hospital e execute a simulação.",
                            "Presets podem ser usados como ponto de partida.",
                        ]
                        : null
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Column 1: Profile & Presets */}\
                    <div className="grid gap-4 content-start">
                        <div>
                            <span className="text-sm font-medium text-gray-800">
                                Natureza
                            </span>
                            <div className="flex gap-2 mt-1">
                                <ToggleButton
                                    onClick={() => setNatureza("Publico")}
                                    active={natureza === "Publico"}
                                >
                                    Público
                                </ToggleButton>
                                <ToggleButton
                                    onClick={() => setNatureza("Privado")}
                                    active={natureza === "Privado"}
                                >
                                    Privado
                                </ToggleButton>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-800">Perfil</span>\
                            <div className="flex gap-2 mt-1">
                                <ToggleButton
                                    onClick={() => setPerfil("Clinico")}
                                    active={perfil === "Clinico"}
                                >
                                    Clínico
                                </ToggleButton>
                                <ToggleButton
                                    onClick={() => setPerfil("Cirurgico")}
                                    active={perfil === "Cirurgico"}
                                >
                                    Cirúrgico
                                </ToggleButton>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-800">Presets</span>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {[
                                    "Publico Clinico",
                                    "Publico Cirurgico",
                                    "Privado Clinico",
                                    "Privado Cirurgico",
                                ].map((p) => {
                                    const [nat, per] = p.split(" ");
                                    return (
                                        <ToggleButton
                                            key={p}\
                                onClick={() => applyPreset(p)}
                                active={nat === natureza && per === perfil}
                    >
                                {per}
                            </ToggleButton>
                            );
                })}
                        </div>
                    </div>
                </div>

                {/* Column 2: Cohort & Costs */}
                <div className="grid gap-4 content-start">
                    <NumInput
                        labelText="Pacientes orais/mês"
                        value={oralPatients}
                        onChange={setOralPatients}
                        step={10}
                        helpText="Tamanho da coorte mensal."
                    />
                    <NumInput
                        labelText="Custo diário do leito"
                        value={dailyBedCost}
                        onChange={setDailyBedCost}
                        prefix="R$"
                        step={100}
                        helpText="Custo médio da diária."
                    />
                    <NumInput
                        labelText="Custo por complicação"
                        value={complicationCost}
                        onChange={setComplicationCost}
                        prefix="R$"
                        step={500}
                        helpText="Custo médio incremental."
                    />
                </div>

                {/* Column 3: Supplement */}
                <div className="grid gap-4 content-start">
                    <PctSlider
                        labelText="Cobertura de suplementação"
                        value={coverage}
                        onChange={setCoverage}
                    />
                    <div>
                        <span className="text-sm font-medium text-gray-800">
                            Doses por dia
                        </span>
                        <div className="flex gap-2 mt-1">
                            {[1, 2, 3].map((d) => (
                                <ToggleButton
                                    key={d}
                                    onClick={() => setDosesPerDay(d)}
                                    active={dosesPerDay === d}
                                >
                                    {d}
                                </ToggleButton>
                            ))}
                        </div>
                    </div>
                    <NumInput
                        labelText="Custo por DOSE"
                        value={suppCostPerDose}
                        onChange={setSuppCostPerDose}
                        prefix="R$"
                        step={0.5}
                    />
                    <NumInput
                        labelText="Dias médios de uso"
                        value={suppDays}
                        onChange={setSuppDays}
                        suffix="dias"
                        step={1}
                    />
                </div>

                {/* Column 4: Efficacy */}
                <div className="grid gap-4 content-start">
                    <PctSlider
                        labelText="RRR de complicações"
                        value={rrrComplication}
                        onChange={setRrrComplication}
                    />
                    <PctSlider
                        labelText="Redução de LOS - Alto Risco"
                        value={losReductionHigh}
                        onChange={setLosReductionHigh}
                    />
                    <PctSlider
                        labelText="Redução de LOS - Mod. Risco"
                        value={losReductionMod}
                        onChange={setLosReductionMod}
                    />
                    <PctSlider
                        labelText="Redução de LOS - Leve Risco"
                        value={losReductionLow}
                        onChange={setLosReductionLow}
                    />
                </div>
        </div>

        {/* Risk Distribution */ }
    <div className="mt-6 border-t pt-4">
        <h4 className="m-0 text-base font-medium text-gray-800">
            Distribuição de Risco (Total: {pct(riskLow + riskMod + riskHigh)})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <PctSlider
                labelText="Leve"
                value={riskLow}
                onChange={(v: number) => setRiskDist("low", v)}
            />
            <PctSlider
                labelText="Moderado"
                value={riskMod}
                onChange={(v: number) => setRiskDist("mod", v)}
            />
            <div className="grid gap-1">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-800">
                        Alto
                    </label>
                    <span className="text-sm font-semibold text-indigo-700">
                        {pct(riskHigh)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2.5">
                    <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: pct(riskHigh) }}
                    ></div>
                </div>
            </div>
        </div>
    </div>
      </Section >

        {/* Simulation Runner */ }
        < div className = "bg-white border rounded-xl p-4 grid gap-3" >
            <button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
                {isRunning ? `Rodando... ${pct(progress)}` : "Executar Simulação"}
            </button>
    {
        isRunning && (
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: pct(progress), transition: "width 0.2s" }}
                ></div>
            </div>
        )
    }
      </div >

        {/* Results */ }
    {
        cohort && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <KpiCard
                    title="Cohort mensal"
                    value={cohort.n.toLocaleString("pt-BR")}
                    subtitle="Pacientes orais"
                />
                <KpiCard
                    title="Custo com suplementos"
                    value={reais(cohort.suppCost)}
                    subtitle={`${(
                        cohort.treated.low +
                        cohort.treated.mod +
                        cohort.treated.high
                    ).toLocaleString("pt-BR")} tratados`}
                    positive={false}
                />
                <KpiCard
                    title="Economia: ↓LOS"
                    value={reais(cohort.saveLOS)}
                    subtitle={`${cohort.losSaved.toFixed(1)} dias evitados`}
                    positive={true}
                />
                <KpiCard
                    title="Economia: ↓Complicações"
                    value={reais(cohort.saveComp)}
                    subtitle={`${cohort.compsAvoided.toFixed(2)} evitadas`}
                    positive={true}
                />
                <KpiCard
                    title="Resultado líquido (mês)"
                    value={reais(cohort.net)}
                    subtitle={`ROI: ${pct(cohort.roi)}`}
                    positive={cohort.net >= 0}
                />
            </div>
        )
    }

    {/* Charts (Sensitivity & Strategies) */ }
    {
        tornado && strategyRows && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Análise de Sensibilidade (Tornado)">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={tornado.rows}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="fator" type="category" width={100} hide />
                                <RTooltip formatter={(val: number) => reais(val)} />
                                <ReferenceLine x={tornado.baseNet} stroke="#666" strokeDasharray="3 3" />
                                <Bar dataKey="min" fill="#8884d8" name="Mínimo" stackId="a">
                                    {tornado.rows.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill="transparent" />
                                    ))}
                                </Bar>
                                <Bar dataKey="span" fill="#82ca9d" name="Variação" stackId="a">
                                    {tornado.rows.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Impacto de ±20% em cada variável no Resultado Líquido.
                    </p>
                </Section>

                <Section title="Comparação de Estratégias">
                    <div className="space-y-4">
                        {strategyRows.map((strat: any) => (
                            <div key={strat.nome} className="border p-3 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{strat.nome}</span>
                                    <span className={`font-bold ${strat.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {reais(strat.net)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>Investimento: {reais(strat.cost)}</div>
                                    <div>Economia: {reais(strat.saveLOS + strat.saveComp)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        )
    }

    {
        mc && (
            <Section title="Simulação de Monte Carlo (1000 iterações)">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mc.hist}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="faixa" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <RTooltip />
                            <Bar dataKey="contagem" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-center mt-4 text-sm">
                    <div>
                        <div className="text-gray-500">Pessimista (P05)</div>
                        <div className="font-bold text-red-600">{reais(mc.p05)}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">Provável (P50)</div>
                        <div className="font-bold text-gray-800">{reais(mc.p50)}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">Otimista (P95)</div>
                        <div className="font-bold text-green-600">{reais(mc.p95)}</div>
                    </div>
                </div>
            </Section>
        )
    }

    </div >
  );
}
