import React from 'react';

interface Props {
    table: number[][];
    methodName: string;
}

const METHOD_MAP: Record<string, 'newton1' | 'newton2' | 'gauss1' | 'gauss2' | 'stirling' | 'bessel' | 'none'> = {
    "Ньютон (I формула)": 'newton1',
    "Ньютон (II формула)": 'newton2',
    "Гаусс (I формула)": 'gauss1',
    "Гаусс (II формула)": 'gauss2',
    "Стирлинг": 'stirling',
    "Бессель": 'bessel'
};
export const DifferenceTable: React.FC<Props> = ({ table, methodName }) => {
    if (!table || table.length === 0) return null;

    const n = table.length;
    const mid = Math.floor(n / 2);

    const methodType = METHOD_MAP[methodName] || 'none';

    const isHighlighted = (i: number, j: number): boolean => {
        if (methodType === 'newton1') {
            return i === 0;
        }


        if (methodType === 'newton2') {
            return i === (n - 1 - j);
        }

        if (methodType === 'gauss1') {
            if (j === 0) return i === mid;
            if (j === 1) return i === mid;
            if (j >= 2) {
                const k = Math.floor(j / 2);
                return i === (mid - k);
            }
        }

        if (methodType === 'gauss2') {
            if (j === 0) return i === mid;
            if (j === 1) return i === mid - 1;
            if (j >= 2) {
                const k = Math.floor((j + 1) / 2);
                return i === (mid - k);
            }
        }

        if (methodType === 'stirling') {
            if (j === 0) return i === mid;
            if (j >= 1) {
                const k = Math.floor((j + 1) / 2);
                return i === mid - k || i === mid - k + 1;
            }
        }

        if (methodType === 'bessel') {
            if (j === 0) return i === mid || i === mid + 1;
            if (j >= 1) {
                const k = Math.floor(j / 2);
                return i === mid - k || i === mid - k + 1;
            }
        }

        return false;
    };

    return (
        <div className="overflow-x-auto w-full my-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                Путь расчета: {methodName}
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-sm">
                <thead className="bg-slate-50">
                <tr>
                    <th className="border p-2">y</th>
                    {table[0].slice(1).map((_, i) => (
                        <th key={i} className="border p-2">Δ{i + 1}y</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {table.map((row, i) => (
                    <tr key={i}>
                        {row.map((val, j) => {
                            const isVisible = (i + j) < n;
                            const active = isVisible && isHighlighted(i, j);

                            return (
                                <td key={j} className={`border p-2 text-center font-mono transition-all duration-300 ${
                                    active
                                        ? 'bg-blue-600 text-white font-bold shadow-lg scale-105'
                                        : 'text-slate-600'
                                }`}>
                                    {isVisible ? val.toFixed(4) : ""}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};