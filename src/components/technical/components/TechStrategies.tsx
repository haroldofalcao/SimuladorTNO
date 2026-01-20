import React from "react";
import { reais } from "./TechUI";
import { StrategyResult } from "../types";

export function TechStrategies({ strategies }: { strategies: StrategyResult[] }) {
    if (!strategies) return null;

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-[var(--danone-blue)] mb-4">
                ♟️ Comparação de Estratégias
            </h3>

            <div className="space-y-4">
                {strategies.map((strat: any, index: number) => (
                    <div
                        key={strat.nome}
                        className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${index === 0
                            ? "bg-white border-blue-200 shadow-sm"
                            : "bg-white/50 border-gray-100"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                {index === 0 ? "🥇" : "🥈"} {strat.nome}
                            </span>
                            <span
                                className={`text-lg font-bold ${strat.net >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {reais(strat.net)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="bg-red-50 p-2 rounded-lg text-center">
                                <div className="text-[10px] text-red-500 uppercase font-bold">Investimento</div>
                                <div className="text-sm font-semibold text-red-700">{reais(strat.cost)}</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg text-center">
                                <div className="text-[10px] text-green-500 uppercase font-bold">Economia Bruta</div>
                                <div className="text-sm font-semibold text-green-700">{reais(strat.saveLOS + strat.saveComp)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
