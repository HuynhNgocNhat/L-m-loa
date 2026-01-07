import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { analyzeBox } from './services/audioService';
import { BoxDimensions, AnalysisResult, TrianglePortConfig, UsageType } from './types';
import { Speaker, Volume2 } from 'lucide-react';

export default function App() {
  const [dims, setDims] = useState<BoxDimensions>({ w: 35, h: 60, d: 32 });
  const [port, setPort] = useState<TrianglePortConfig>({
    base: 10,
    height: 10,
    length: 20
  });
  const [usage, setUsage] = useState<UsageType>(UsageType.KARAOKE);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleCalculate = () => {
    const res = analyzeBox(dims, port, usage);
    setResult(res);
  };

  const handleReset = () => {
    setDims({ w: 35, h: 60, d: 32 });
    setPort({ base: 10, height: 10, length: 20 });
    setUsage(UsageType.KARAOKE);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans selection:bg-sky-500/30">
      <div className="max-w-5xl mx-auto h-full">
        
        {/* Header */}
        <header className="mb-6 flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-2 z-50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-sky-600 rounded-xl shadow-lg shadow-sky-900/50">
                <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                    12WF335 <span className="text-sky-400 font-light">Analyzer</span>
                </h1>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                    Dành cho thùng loa đã đóng (2 lỗ tam giác)
                </p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-white px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors uppercase tracking-wider"
          >
            Reset
          </button>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 xl:col-span-4 h-full">
             <InputSection 
                dims={dims}
                setDims={setDims}
                port={port}
                setPort={setPort}
                usage={usage}
                setUsage={setUsage}
                onCalculate={handleCalculate}
             />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 xl:col-span-8 h-full">
             <ResultSection result={result} />
          </div>

        </div>
        
        <footer className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-widest opacity-50">
             Professional Audio Engineering Tool • 12WF335 Specific
        </footer>
      </div>
    </div>
  );
}