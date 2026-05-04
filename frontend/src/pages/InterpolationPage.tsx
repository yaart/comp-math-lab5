import React, { useState } from 'react';
import { InterpolationRequest, InterpolationResponse, Point } from "../types";
import { interpolationApi } from "../services/api";
import { PointTable } from "../components/lab5/PointTable";
import { InterpolationChart } from "../components/lab5/InterpolationChart";
import { DifferenceTable } from "../components/lab5/DifferenceTable";
import { Header } from "./Header";
import { FileUpload } from "../components/common/FileUpload";
import { FunctionGenerator } from '../components/common/FunctionGenerator';

export const InterpolationPage = () => {
    const [points, setPoints] = useState<Point[]>([
        { x: 2.10, y: 3.7587 }, { x: 2.15, y: 4.1861 }, { x: 2.20, y: 4.9218 },
        { x: 2.25, y: 5.3487 }, { x: 2.30, y: 5.9275 }, { x: 2.35, y: 6.4193 },
        { x: 2.40, y: 7.0839 }
    ]);
    const [targetX, setTargetX] = useState<number>(2.359);
    const [results, setResults] = useState<InterpolationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState<number | 'all'>('all');

    const handleDataLoad = (data: InterpolationRequest) => {
        setPoints(data.points);
        if (data.targetX !== undefined) {
            setTargetX(data.targetX);
        }
    };

    const handleCalculate = async () => {
        if (points.some(p => isNaN(p.x) || isNaN(p.y))) {
            alert("Пожалуйста, проверьте корректность введенных данных");
            return;
        }

        const xValues = points.map(p => p.x);
        if (new Set(xValues).size !== xValues.length) {
            alert("Ошибка: Узлы интерполяции должны быть уникальными.");
            return;
        }

        const sortedX = [...xValues].sort((a, b) => a - b);
        const minX = sortedX[0];
        const maxX = sortedX[sortedX.length - 1];

        if (targetX < minX || targetX > maxX) {
            alert(`Ошибка: Точка ${targetX} находится вне допустимого диапазона [${minX}, ${maxX}]. Экстраполяция запрещена.`);
            return;
        }

        setLoading(true);
        try {
            const data = await interpolationApi.calculate({ points, targetX });
            setResults(data);
            setActiveView('all');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Ошибка при расчете. Убедитесь, что сервер запущен.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const activeResult = typeof activeView === 'number' ? results[activeView] : null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8 space-y-6">

                            <div>
                                <h2 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                                    <span className="text-blue-500"></span> Исходные данные
                                    <FileUpload onDataLoaded={handleDataLoad} />

                                </h2>
                                <PointTable
                                    points={points}
                                    onChange={(i, f, v) => setPoints(points.map((p, idx) => idx === i ? { ...p, [f]: v } : p))}
                                    onAdd={() => setPoints([...points, { x: 0, y: 0 }])}
                                    onRemove={(i) => setPoints(points.filter((_, idx) => idx !== i))}
                                />
                                <div className="flex gap-2 mt-4">
                                    <FunctionGenerator onDataGenerated={handleDataLoad} />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Искомый аргумент X</label>
                                <input
                                    type="number" step="any" value={targetX}
                                    onChange={(e) => setTargetX(parseFloat(e.target.value) || 0)}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-lg text-slate-800 outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    onClick={handleCalculate}
                                    disabled={loading}
                                    className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Вычисление...</>
                                    ) : "Рассчитать интерполяцию"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        {results.length > 0 ? (
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                    <button
                                        onClick={() => setActiveView('all')}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 ${activeView === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Сравнение методов
                                    </button>
                                    {results.map((res, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveView(index)}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 ${activeView === index ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {res.methodName}
                                        </button>
                                    ))}
                                </div>

                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {activeView === 'all' ? (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black text-slate-800">Все методы на одном графике</h3>
                                            <InterpolationChart originalPoints={points} allResults={results} targetPoint={{ x: targetX, y: 0 }} />
                                        </div>
                                    ) : activeResult && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-800">{activeResult.methodName}</h3>
                                                <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-mono font-bold">
                                                    <span>f({targetX}) =</span>
                                                    <span className="text-lg">{activeResult.resultValue}</span>
                                                </div>
                                            </div>

                                            <InterpolationChart
                                                originalPoints={points}
                                                interpolatedPoints={activeResult.plotPoints || []}
                                                targetPoint={{ x: targetX, y: activeResult.resultValue }}
                                            />

                                            {activeResult.differenceTable && (
                                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                                    <h4 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wider">Таблица разностей</h4>
                                                    <DifferenceTable table={activeResult.differenceTable} methodName={activeResult.methodName} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-16 text-slate-400 bg-white">
                                <h3 className="text-lg font-bold text-slate-700 mb-2">Готов к расчету</h3>
                                <p className="text-slate-500 text-center max-w-xs">Введите значения X и Y слева, чтобы начать работу.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};