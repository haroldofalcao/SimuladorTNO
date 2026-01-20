import React from "react";
import { NumInput, PctSlider, ToggleButton, pct, reais } from "./TechUI";
import { SidebarProps } from "../types";

// Utility (could be shared)
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function TechSidebar({
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
    riskHigh, // Derived
}: SidebarProps) {

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

    return (
        <div className="glass-panel p-6 animate-in slide-in-from-left duration-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--danone-blue)] flex items-center gap-2">
                    ⚙️ Parâmetros
                </h3>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer hover:text-[var(--danone-blue)] transition-colors">
                    <input
                        type="checkbox"
                        checked={guided}
                        onChange={(e) => setGuided(e.target.checked)}
                        className="rounded text-[var(--danone-cyan)] focus:ring-[var(--danone-cyan)]"
                    />
                    Modo Guiado
                </label>
            </div>

            <div className="space-y-8">
                {/* SECTION 1: Profile & Presets */}
                <div className="space-y-4">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <span className="text-xs font-bold text-[var(--danone-blue)] uppercase tracking-wider block mb-2">Preset Rápido</span>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "Publico Clinico",
                                "Publico Cirurgico",
                                "Privado Clinico",
                                "Privado Cirurgico",
                            ].map((p) => {
                                const [nat, per] = p.split(" ");
                                return (
                                    <button
                                        key={p}
                                        onClick={() => applyPreset(p)}
                                        className={`text-[10px] py-1.5 px-2 rounded-lg font-semibold transition-all ${nat === natureza && per === perfil
                                            ? "bg-[var(--danone-blue)] text-white shadow-sm"
                                            : "bg-white text-gray-500 hover:bg-gray-100"
                                            }`}
                                    >
                                        {nat} {per}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-medium text-gray-500 block mb-1">Natureza</span>
                            <div className="flex gap-1">
                                <ToggleButton onClick={() => setNatureza("Publico")} active={natureza === "Publico"}>Pub</ToggleButton>
                                <ToggleButton onClick={() => setNatureza("Privado")} active={natureza === "Privado"}>Priv</ToggleButton>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-500 block mb-1">Perfil</span>
                            <div className="flex gap-1">
                                <ToggleButton onClick={() => setPerfil("Clinico")} active={perfil === "Clinico"}>Clín</ToggleButton>
                                <ToggleButton onClick={() => setPerfil("Cirurgico")} active={perfil === "Cirurgico"}>Cir</ToggleButton>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* SECTION 2: Capacity & Costs */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-700">🏥 Capacidade & Custos</h4>
                    <NumInput
                        labelText="Pacientes/mês"
                        value={oralPatients}
                        onChange={setOralPatients}
                        step={10}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <NumInput
                            labelText="Diária (R$)"
                            value={dailyBedCost}
                            onChange={setDailyBedCost}
                            step={100}
                        />
                        <NumInput
                            labelText="Complicação (R$)"
                            value={complicationCost}
                            onChange={setComplicationCost}
                            step={500}
                        />
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* SECTION 3: Protocol TNO */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-700">💊 Protocolo TNO</h4>
                    <PctSlider
                        labelText="Cobertura (%)"
                        value={coverage}
                        onChange={setCoverage}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <NumInput
                            labelText="Dose (R$)"
                            value={suppCostPerDose}
                            onChange={setSuppCostPerDose}
                            step={0.5}
                        />
                        <NumInput
                            labelText="Dias Uso"
                            value={suppDays}
                            onChange={setSuppDays}
                        />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-500 block mb-1">Doses/dia</span>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((d) => (
                                <ToggleButton key={d} onClick={() => setDosesPerDay(d)} active={dosesPerDay === d}>{d}</ToggleButton>
                            ))}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* SECTION 4: Efficacy */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-700">📉 Eficácia Clínica</h4>
                    <PctSlider
                        labelText="Redução Complicações"
                        value={rrrComplication}
                        onChange={setRrrComplication}
                    />
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Redução LOS (Alta)</span>
                        <PctSlider labelText="Alto Risco" value={losReductionHigh} onChange={setLosReductionHigh} />
                        <PctSlider labelText="Mod. Risco" value={losReductionMod} onChange={setLosReductionMod} />
                        <PctSlider labelText="Leve Risco" value={losReductionLow} onChange={setLosReductionLow} />
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* SECTION 5: Distribution */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-700">📊 Distribuição Risco</h4>
                    <PctSlider labelText="Leve" value={riskLow} onChange={(v: number) => setRiskDist("low", v)} />
                    <PctSlider labelText="Moderado" value={riskMod} onChange={(v: number) => setRiskDist("mod", v)} />
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Alto Risco (Calc)</span>
                        <span className="font-bold text-[var(--danone-blue)]">{pct(riskHigh)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-[var(--danone-blue)] h-1.5 rounded-full" style={{ width: pct(riskHigh) }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
