import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { reais } from "./TechUI";
import { MonteCarloResult } from "../types";

export function TechMonteCarlo({ mc }: { mc: MonteCarloResult }) {
    if (!mc) return null;

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-[var(--danone-blue)] mb-2">
                🎲 Simulação de Monte Carlo
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Distribuição de probabilidades (1.000 iterações)
            </p>

            <div className="h-[300px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mc.hist} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                            dataKey="faixa"
                            tick={{ fontSize: 9, fill: "#6b7280" }}
                            interval={1}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Bar dataKey="contagem" fill="url(#colorGradient)" radius={[4, 4, 0, 0]}>
                            {mc.hist.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={index === Math.floor(mc.hist.length / 2) ? "var(--danone-blue)" : "var(--danone-cyan)"} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-xs text-red-500 uppercase font-bold mb-1">Pessimista (P05)</div>
                    <div className="text-lg font-bold text-red-700">{reais(mc.p05)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Provável (P50)</div>
                    <div className="text-lg font-bold text-gray-800">{reais(mc.p50)}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-xs text-green-500 uppercase font-bold mb-1">Otimista (P95)</div>
                    <div className="text-lg font-bold text-green-700">{reais(mc.p95)}</div>
                </div>
            </div>
        </div>
    );
}
