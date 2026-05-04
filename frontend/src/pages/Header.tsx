import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-slate-200 mb-8">
            <div className="container mx-auto px-4 py-6 max-w-6xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">Лабораторная работа №5</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Интерполяция функции
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">Ясаков А. А. | Р3213</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Вариант 20 | ИСУ: 468198</p>
                </div>
            </div>
        </header>
    );
};