import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { InterpolationRequest } from '../../types';

interface FileUploadProps {
    onDataLoaded: (data: InterpolationRequest) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            parseFile(content);
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
        setFileName(file.name);
    };

    const parseFile = (content: string) => {
        try {
            const lines = content.split('\n')
                .map(l => l.trim().replace(',', '.'))
                .filter(l => l.length > 0);

            if (lines.length < 2) throw new Error("Файл слишком короткий");

            const targetX = parseFloat(lines[0].split(/[\s;]+/)[0]);
            if (isNaN(targetX)) throw new Error("Первое значение (Target X) не является числом");

            const dataLines = lines.slice(1);
            let parsedPoints: { x: number; y: number }[] = [];

            if (dataLines.length === 2) {
                const xValues = dataLines[0].split(/[\s;]+/).filter(Boolean).map(Number);
                const yValues = dataLines[1].split(/[\s;]+/).filter(Boolean).map(Number);

                if (xValues.length !== yValues.length) {
                    throw new Error("Количество X и Y в строках не совпадает");
                }
                parsedPoints = xValues.map((x, i) => ({ x, y: yValues[i] }));
            }
            else {
                parsedPoints = dataLines.map((line, index) => {
                    const coords = line.split(/[\s;]+/).filter(Boolean).map(Number);
                    if (coords.length < 2) {
                        throw new Error(`Ошибка в строке ${index + 2}: ожидалось две координаты`);
                    }
                    return { x: coords[0], y: coords[1] };
                });
            }

            if (parsedPoints.length < 3) throw new Error("Нужно минимум 3 точки");
            if (parsedPoints.some(p => isNaN(p.x) || isNaN(p.y))) throw new Error("Некорректные числа");

            parsedPoints.sort((a, b) => a.x - b.x);

            onDataLoaded({
                points: parsedPoints,
                targetX: targetX
            });

            toast.success(`Загружено: ${parsedPoints.length} узлов, TargetX=${targetX}`);
        } catch (err: any) {
            toast.error(err.message);
            setFileName('');
        }
    };

    const clearFile = () => {
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-[10px] font-black uppercase tracking-widest rounded shadow-sm"
            >
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                {fileName ? 'Сменить файл' : 'Загрузить .txt'}
            </button>

            <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />

            {fileName && (
                <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                    <span className="text-[9px] text-indigo-600 font-mono font-bold truncate max-w-[100px]">{fileName}</span>
                    <button onClick={clearFile} className="hover:bg-indigo-200 rounded-full p-0.5"><X className="w-2.5 h-2.5 text-indigo-400" /></button>
                </div>
            )}
        </div>
    );
};