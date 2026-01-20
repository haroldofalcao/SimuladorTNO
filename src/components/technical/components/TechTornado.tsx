import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from "recharts";
import { reais } from "./TechUI";
import { TornadoResult } from "../types";

export function TechTornado({ tornado }: { tornado: TornadoResult }) {
    if (!tornado) return null;

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-[var(--danone-blue)] mb-2">
                🌪️ Análise de Sensibilidade (Tornado)
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Quais fatores mais impactam o resultado financeiro?
            </p>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={tornado.rows}
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.1)" />
                        <XAxis
                            type="number"
                            tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                            stroke="#6b7280"
                            fontSize={12}
                        />
                        <YAxis
                            type="category"
                            dataKey="fator"
                            width={150}
                            tick={{ fontSize: 11, fill: "#374151" }}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(0,0,0,0.05)" }}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            }}
                            formatter={(val: any) => reais(val || 0)}
                        />
                        <ReferenceLine x={tornado.baseNet} stroke="#0e7490" strokeDasharray="5 5" label="Base" />

                        {/* Range Bar */}
                        <Bar dataKey="min" fill="transparent" stackId="a" />
                        <Bar dataKey="span" stackId="a" radius={[4, 4, 4, 4]}>
                            {tornado.rows.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
