import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {InterpolationRequest} from "../../types";

const AVAILABLE_FUNCTIONS = {
    "sin(x)": { label: "Синус (sin x)", fn: (x: number) => Math.sin(x) },
    "x^2": { label: "Квадрат (x²)", fn: (x: number) => Math.pow(x, 2) },
    "e^x": { label: "Экспонента (e^x)", fn: (x: number) => Math.exp(x) },
    "ln(x+1)": { label: "Логарифм (ln(x+1))", fn: (x: number) => Math.log(x + 1) }
};

interface FunctionGeneratorProps {
    onDataGenerated: (data: InterpolationRequest) => void;
}

export const FunctionGenerator: React.FC<FunctionGeneratorProps> = ({ onDataGenerated }) => {
    const [funcKey, setFuncKey] = useState<keyof typeof AVAILABLE_FUNCTIONS>("sin(x)");
    const [minX, setMinX] = useState<number>(0);
    const [maxX, setMaxX] = useState<number>(4);
    const [count, setCount] = useState<number>(10);
    const [targetX, setTargetX] = useState<number>(2);

    const generate = () => {
        if (minX >= maxX) {
            toast.error("Начало интервала должно быть меньше конца");
            return;
        }
        if (count < 3) {
            toast.error("Нужно минимум 3 точки для интерполяции");
            return;
        }

        const points = [];
        const step = (maxX - minX) / (count - 1);

        for (let i = 0; i < count; i++) {
            const x = minX + i * step;
            const y = AVAILABLE_FUNCTIONS[funcKey].fn(x);
            points.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
        }

        onDataGenerated({ points, targetX });
        toast.success(`Функция ${funcKey} сгенерирована`);
    };

    return (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Генерация данных</h3>

            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Математическая функция</label>
                <select
                    value={funcKey}
                    onChange={(e) => setFuncKey(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    {Object.entries(AVAILABLE_FUNCTIONS).map(([key, f]) => (
                        <option key={key} value={key}>{f.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Начало (Xmin)</label>
                    <input type="number" value={minX} onChange={(e) => setMinX(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Конец (Xmax)</label>
                    <input type="number" value={maxX} onChange={(e) => setMaxX(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Кол-во точек</label>
                    <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Искомый X</label>
                    <input type="number" value={targetX} onChange={(e) => setTargetX(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
            </div>

            <button
                onClick={generate}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
            >
                Создать набор данных
            </button>
        </div>
    );
};