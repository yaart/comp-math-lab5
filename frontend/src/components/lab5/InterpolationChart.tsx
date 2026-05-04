import React from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {InterpolationResponse, Point} from "../../types";

interface Props {
    originalPoints: Point[];
    interpolatedPoints?: Point[];
    allResults?: InterpolationResponse[];
    targetPoint: Point;
}

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#ea580c'];

export const InterpolationChart = ({
                                       originalPoints,
                                       interpolatedPoints,
                                       allResults,
                                       targetPoint
                                   }: Props) => {

    return (
        <div className="h-[400px] w-full bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} />
                    <YAxis dataKey="y" type="number" domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend />

                    {allResults ? (
                        allResults.map((res, index) => (
                            <Line
                                key={index}
                                data={res.plotPoints || []}
                                dataKey="y"
                                name={res.methodName}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                                type="monotone"
                                isAnimationActive={false}
                            />
                        ))
                    ) : (
                        <Line
                            data={interpolatedPoints}
                            dataKey="y"
                            name="Интерполяция"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={false}
                            type="monotone"
                        />
                    )}

                    <Scatter data={originalPoints} fill="#dc2626" name="Узлы" />
                    <Scatter data={[targetPoint]} fill="#16a34a" name="Результат" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};