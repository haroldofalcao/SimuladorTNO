import React from "react";
import { reais, pct } from "./TechUI";
import { CohortResult } from "../types";

export function TechKPIs({ cohort }: { cohort: CohortResult }) {
    if (!cohort) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in fade-in zoom-in duration-500">
            {/* 1. Economia Líquida */}
            <div className="glass-panel p-5 border-l-4 border-l-[var(--danone-blue)]">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Economia Líquida</span>
                <div className="mt-2 text-2xl font-bold text-[var(--danone-blue)]">
                    {reais(cohort.net)}
                </div>
                <div className="text-xs text-green-600 mt-1 font-medium">
                    Total Mensal
                </div>
            </div>

            {/* 2. ROI */}
            <div className="glass-panel p-5 border-l-4 border-l-green-500">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ROI</span>
                <div className="mt-2 text-3xl font-bold text-green-600">
                    {pct(cohort.roi)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Retorno sobre Investimento
                </div>
            </div>

            {/* 3. Custo Evitado */}
            <div className="glass-panel p-5 border-l-4 border-l-[var(--danone-cyan)]">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custo Evitado</span>
                <div className="mt-2 text-xl font-bold text-gray-800">
                    {reais(cohort.totalSavings)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Em diárias e complicações
                </div>
            </div>

            {/* 4. Efficiency */}
            <div className="glass-panel p-5 border-l-4 border-l-orange-400">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Eficiência</span>
                <div className="mt-2 text-xl font-bold text-orange-600">
                    {reais(cohort.costPerCompAvoided)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Custo por complicação evitada
                </div>
            </div>
        </div>
    );
}
