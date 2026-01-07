import React from 'react';
import { BoxDimensions, TrianglePortConfig, UsageType } from '../types';
import { Triangle, Box, Ruler, Music2, Mic2 } from 'lucide-react';

interface Props {
  dims: BoxDimensions;
  setDims: (d: BoxDimensions) => void;
  port: TrianglePortConfig;
  setPort: (p: TrianglePortConfig) => void;
  usage: UsageType;
  setUsage: (u: UsageType) => void;
  onCalculate: () => void;
}

export const InputSection: React.FC<Props> = ({
  dims,
  setDims,
  port,
  setPort,
  usage,
  setUsage,
  onCalculate,
}) => {
  
  const handleDimChange = (field: keyof BoxDimensions, value: string) => {
    const val = parseFloat(value) || 0;
    setDims({ ...dims, [field]: val });
  };

  const handlePortChange = (field: keyof TrianglePortConfig, value: string) => {
    const val = parseFloat(value) || 0;
    setPort({ ...port, [field]: val });
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl h-full flex flex-col">
      
      {/* 1. Box Dimensions */}
      <div className="mb-6">
        <h3 className="flex items-center text-md font-semibold text-sky-400 mb-3 uppercase tracking-wide">
          <Box className="w-4 h-4 mr-2" />
          1. Kích thước thùng (Lọt lòng)
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <label className="block text-slate-400 text-[10px] mb-1 uppercase">Rộng (cm)</label>
            <input
              type="number"
              value={dims.w || ''}
              onChange={(e) => handleDimChange('w', e.target.value)}
              className="w-full bg-transparent text-white font-mono font-bold text-lg outline-none placeholder-slate-600"
              placeholder="0"
            />
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <label className="block text-slate-400 text-[10px] mb-1 uppercase">Cao (cm)</label>
            <input
              type="number"
              value={dims.h || ''}
              onChange={(e) => handleDimChange('h', e.target.value)}
              className="w-full bg-transparent text-white font-mono font-bold text-lg outline-none placeholder-slate-600"
              placeholder="0"
            />
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <label className="block text-slate-400 text-[10px] mb-1 uppercase">Sâu (cm)</label>
            <input
              type="number"
              value={dims.d || ''}
              onChange={(e) => handleDimChange('d', e.target.value)}
              className="w-full bg-transparent text-white font-mono font-bold text-lg outline-none placeholder-slate-600"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* 2. Port Configuration */}
      <div className="mb-6">
        <h3 className="flex items-center text-md font-semibold text-sky-400 mb-3 uppercase tracking-wide">
          <Triangle className="w-4 h-4 mr-2" />
          2. Lỗ thông hơi (2 x Tam giác)
        </h3>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
           <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-300 text-xs mb-1">Cạnh đáy (a)</label>
                    <input
                        type="number"
                        value={port.base || ''}
                        onChange={(e) => handlePortChange('base', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-sky-500 outline-none"
                        placeholder="cm"
                    />
                </div>
                <div>
                    <label className="block text-slate-300 text-xs mb-1">Chiều cao (h)</label>
                    <input
                        type="number"
                        value={port.height || ''}
                        onChange={(e) => handlePortChange('height', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-sky-500 outline-none"
                        placeholder="cm"
                    />
                </div>
           </div>
           
           <div className="border-t border-slate-700 pt-3">
               <label className="flex items-center text-amber-400 font-bold text-sm mb-2">
                   <Ruler className="w-4 h-4 mr-2" />
                   Chiều sâu ống hơi HIỆN TẠI (cm)
               </label>
               <input
                    type="number"
                    value={port.length || ''}
                    onChange={(e) => handlePortChange('length', e.target.value)}
                    className="w-full bg-slate-900 border border-amber-600 text-amber-100 text-xl font-bold p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Nhập số đo..."
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">
                    *Đo từ mặt thùng vào sâu bên trong
                </p>
           </div>
        </div>
      </div>

      {/* 3. Usage */}
      <div className="mb-8">
        <label className="block text-slate-400 text-xs uppercase tracking-wide mb-2">Mục đích sử dụng</label>
        <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUsage(UsageType.KARAOKE)}
              className={`flex items-center justify-center py-3 rounded-lg border transition-all ${
                usage === UsageType.KARAOKE 
                ? 'bg-sky-600/20 border-sky-500 text-sky-400' 
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
              }`}
            >
              <Mic2 className="w-4 h-4 mr-2" />
              <span className="font-bold text-sm">Karaoke</span>
            </button>
            <button
              onClick={() => setUsage(UsageType.MUSIC)}
              className={`flex items-center justify-center py-3 rounded-lg border transition-all ${
                usage === UsageType.MUSIC
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
              }`}
            >
              <Music2 className="w-4 h-4 mr-2" />
              <span className="font-bold text-sm">Nghe Nhạc</span>
            </button>
        </div>
      </div>

      <div className="mt-auto">
        <button
            onClick={onCalculate}
            className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:bg-slate-200 transition-all uppercase tracking-widest"
        >
            Phân Tích Ngay
        </button>
      </div>

    </div>
  );
};