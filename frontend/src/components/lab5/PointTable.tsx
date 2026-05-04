import React from 'react';
import { Point } from '../../types';

interface Props {
    points: Point[];
    onChange: (index: number, field: keyof Point, value: number) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export const PointTable: React.FC<Props> = ({ points, onChange, onAdd, onRemove }) => {
    return (
        <div className="w-full">
            <h3 className="text-lg font-bold mb-3">Узлы интерполяции</h3>
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2">x</th>
                    <th className="border p-2">y</th>
                    <th className="border p-2 w-10"></th>
                </tr>
                </thead>
                <tbody>
                {points.map((p, i) => (
                    <tr key={i}>
                        <td className="border p-1">
                            <input
                                type="number"
                                step="any"
                                value={p.x}
                                onChange={(e) => onChange(i, 'x', parseFloat(e.target.value) || 0)}
                                className="w-full p-1 outline-none focus:ring-1 ring-blue-400"
                            />
                        </td>
                        <td className="border p-1">
                            <input
                                type="number"
                                step="any"
                                value={p.y}
                                onChange={(e) => onChange(i, 'y', parseFloat(e.target.value) || 0)}
                                className="w-full p-1 outline-none focus:ring-1 ring-blue-400"
                            />
                        </td>
                        <td className="border p-1 text-center">
                            <button
                                onClick={() => onRemove(i)}
                                className="text-red-500 font-bold hover:text-red-700 px-2"
                            >
                                ×
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button
                onClick={onAdd}
                className="mt-3 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition-colors"
            >
                + Добавить точку
            </button>
        </div>
    );
};