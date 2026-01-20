import React from "react";

export const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
export const reais = (x: number) =>
    x.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ToggleButton = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active: boolean }) => (
    <button
        onClick={onClick}
        aria-pressed={active}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 border ${active
            ? "bg-[var(--danone-blue)] text-white border-[var(--danone-blue)] shadow-md transform scale-105"
            : "bg-white/50 text-gray-700 border-gray-200 hover:bg-white hover:border-[var(--danone-cyan)] hover:text-[var(--danone-blue)]"
            }`}
    >
        {children}
    </button>
);

interface NumInputProps {
    labelText: string;
    value: number;
    onChange: (val: number) => void;
    step?: number;
    min?: number;
    max?: number;
    suffix?: string;
    prefix?: string;
    helpText?: string;
}

export const NumInput = ({
    labelText,
    value,
    onChange,
    step = 1,
    min = 0,
    max = 999999,
    suffix,
    prefix,
    helpText,
}: NumInputProps) => (
    <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700">{labelText}</label>
        <div className="flex items-center gap-2 group focus-within:ring-2 focus-within:ring-[var(--danone-cyan)] rounded-lg transition-all">
            {prefix && <span className="text-gray-500 font-medium">{prefix}</span>}
            <input
                type="number"
                step={step}
                min={min}
                max={max}
                value={Number.isFinite(value) ? value : ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full p-2 bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--danone-cyan)] text-gray-800 font-medium transition-colors"
            />
            {suffix && <span className="text-gray-500 font-medium">{suffix}</span>}
        </div>
        {helpText && (
            <span className="text-[10px] text-gray-500 leading-tight">{helpText}</span>
        )}
    </div>
);

interface PctSliderProps {
    labelText: string;
    value: number;
    onChange: (val: number) => void;
}

export const PctSlider = ({ labelText, value, onChange }: PctSliderProps) => (
    <div className="grid gap-1">
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{labelText}</label>
            <span className="text-xs font-bold text-[var(--danone-blue)] bg-blue-50 px-2 py-0.5 rounded-full">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--danone-cyan)] hover:accent-[var(--danone-blue)] transition-all"
        />
    </div>
);
