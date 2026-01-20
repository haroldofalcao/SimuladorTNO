"use client";

import React, { useEffect, useMemo, useState } from "react";
// Components
import { TechSidebar } from "./components/TechSidebar";
import { TechKPIs } from "./components/TechKPIs";
import { TechTornado } from "./components/TechTornado";
import { TechMonteCarlo } from "./components/TechMonteCarlo";
import { TechStrategies } from "./components/TechStrategies";
import { reais, pct } from "./components/TechUI";

// Types
import {
    CohortResult,
    MonteCarloResult,
    SimulatorInputs,
    StrategyResult,
    TornadoResult,
} from "./types";

// Logic
import {
    calculateCohort,
    calculateMonteCarlo,
    calculateStrategies,
    calculateTornado,
} from "./logic/calculations";

export function TechnicalSimulator() {
    const [guided, setGuided] = useState(true);
    const [natureza, setNatureza] = useState("Publico");
    const [perfil, setPerfil] = useState("Clinico");

    // Inputs
    const [oralPatients, setOralPatients] = useState(300);
    const [riskLow, setRiskLow] = useState(0.5);
    const [riskMod, setRiskMod] = useState(0.35);
    const [dailyBedCost, setDailyBedCost] = useState(900);
    const [complicationCost, setComplicationCost] = useState(6000);

    // Cohort Details (LOS, CR)
    const [losLow, setLosLow] = useState(4);
    const [losMod, setLosMod] = useState(7);
    const [losHigh, setLosHigh] = useState(10);
    const [crLow, setCrLow] = useState(0.04);
    const [crMod, setCrMod] = useState(0.1);
    const [crHigh, setCrHigh] = useState(0.22);

    // Protocol
    const [dosesPerDay, setDosesPerDay] = useState(2);
    const [suppCostPerDose, setSuppCostPerDose] = useState(9);
    const [suppDays, setSuppDays] = useState(5);
    const [coverage, setCoverage] = useState(0.6);

    // Efficacy
    const [rrrComplication, setRrrComplication] = useState(0.18);
    const [losReductionLow, setLosReductionLow] = useState(0.2);
    const [losReductionMod, setLosReductionMod] = useState(0.5);
    const [losReductionHigh, setLosReductionHigh] = useState(0.8);

    // Simulation Settings
    const [iterations, setIterations] = useState(1000);
    const [sens, setSens] = useState({
        supplementCost: 0.2,
        rrr: 0.2,
        dailyCost: 0.2,
        complicationCost: 0.2,
        coverage: 0.2,
    });

    // State
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [cohort, setCohort] = useState<CohortResult | null>(null);
    const [mc, setMc] = useState<MonteCarloResult | null>(null);
    const [tornado, setTornado] = useState<TornadoResult | null>(null);
    const [strategyRows, setStrategyRows] = useState<StrategyResult[] | null>(null);
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

    async function runSimulation() {
        setIsRunning(true);
        setProgress(0);
        setCohort(null);
        setMc(null);
        setTornado(null);
        setStrategyRows(null);

        const suppCostDay = dosesPerDay * suppCostPerDose;
        const inputs: SimulatorInputs = {
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

        // 1. Cohort
        const cohortResult = calculateCohort(inputs);
        setCohort(cohortResult);
        setProgress(0.1);

        // 2. Tornado
        // Small delay to allow UI update
        await new Promise((r) => setTimeout(r, 0));
        const tornadoResult = calculateTornado(cohortResult.net, inputs);
        setTornado(tornadoResult);
        setProgress(0.2);

        // 3. Strategies
        await new Promise((r) => setTimeout(r, 0));
        const strategyResult = calculateStrategies(cohortResult, inputs);
        setStrategyRows(strategyResult);
        setProgress(0.3);

        // 4. Monte Carlo
        await new Promise((r) => setTimeout(r, 0));
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
            `Preset aplicado: ${name}. Leito: ${reais(newDailyCost)} · Complicação: ${reais(newCompCost)}.`
        );
    }

    const sidebarProps = {
        guided,
        setGuided,
        natureza,
        setNatureza,
        perfil,
        setPerfil,
        applyPreset,
        oralPatients,
        setOralPatients,
        dailyBedCost,
        setDailyBedCost,
        complicationCost,
        setComplicationCost,
        coverage,
        setCoverage,
        dosesPerDay,
        setDosesPerDay,
        suppCostPerDose,
        setSuppCostPerDose,
        suppDays,
        setSuppDays,
        rrrComplication,
        setRrrComplication,
        losReductionHigh,
        setLosReductionHigh,
        losReductionMod,
        setLosReductionMod,
        losReductionLow,
        setLosReductionLow,
        riskLow,
        setRiskLow,
        riskMod,
        setRiskMod,
        riskHigh,
    };

    return (
        <div className="w-full font-sans grid lg:grid-cols-[380px_1fr] gap-6 p-6 min-h-screen bg-[var(--background-start)]">

            {/* Sidebar - Settings */}
            <aside className="h-fit lg:sticky lg:top-6 space-y-4">
                <TechSidebar {...sidebarProps} />

                {/* Simulation Trigger */}
                <div className="glass-panel p-6 shadow-lg border border-[var(--danone-cyan)]">
                    <button
                        onClick={runSimulation}
                        disabled={isRunning}
                        className={`w-full py-4 text-xl font-bold rounded-lg transition-all shadow-md hover:shadow-xl ${isRunning
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "btn-primary transform hover:-translate-y-1"
                            }`}
                    >
                        {isRunning ? `Processando ${pct(progress)}` : "⚡ EXECUTAR ANÁLISE"}
                    </button>

                    {isRunning && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div
                                className="bg-gradient-to-r from-[var(--danone-blue)] to-[var(--danone-cyan)] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content - Results */}
            <main className="space-y-6">

                {/* Header */}
                <div className="flex justify-between items-end pb-4 border-b border-black/5">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--danone-blue)]">
                            Simulador Técnico
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Análise Farmacoeconômica Avançada (Monte Carlo & Sensibilidade)
                        </p>
                    </div>
                    {presetMsg && (
                        <div className="animate-in fade-in slide-in-from-top-2 bg-blue-50 text-[var(--danone-blue)] px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 shadow-sm">
                            ℹ️ {presetMsg}
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {!cohort && !isRunning && (
                    <div className="glass-panel p-12 text-center border-dashed border-2 border-gray-300">
                        <div className="text-6xl mb-4 opacity-20">📊</div>
                        <h3 className="text-xl font-semibold text-gray-500">Nenhum resultado gerado</h3>
                        <p className="text-gray-400 mt-2">Configure os parâmetros à esquerda e clique em Executar.</p>
                    </div>
                )}

                {/* Results Components */}
                {cohort && (
                    <>
                        <TechKPIs cohort={cohort} />

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {tornado && <TechTornado tornado={tornado} />}
                            {strategyRows && <TechStrategies strategies={strategyRows} />}
                        </div>

                        {mc && <TechMonteCarlo mc={mc} />}
                    </>
                )}

            </main>
        </div>
    );
}
