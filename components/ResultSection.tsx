import React from 'react';
import { AnalysisResult, SuggestionAction } from '../types';
import { CheckCircle2, AlertTriangle, ArrowRight, Gauge, AlertOctagon, Ruler, Scissors } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
}

export const ResultSection: React.FC<Props> = ({ result }) => {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50 text-slate-500">
        <div className="text-center max-w-xs">
            <Gauge className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Nhập kích thước thùng và số đo ống hơi hiện tại để kiểm tra độ chuẩn.</p>
        </div>
      </div>
    );
  }

  const isPerfect = result.action === SuggestionAction.PERFECT;
  const isImpossible = result.action === SuggestionAction.IMPOSSIBLE;

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* 1. STATUS HEADER */}
      <div className={`p-6 rounded-2xl border flex items-center gap-5 ${
        isPerfect 
            ? 'bg-emerald-950/40 border-emerald-500/50' 
            : isImpossible
                ? 'bg-red-950/40 border-red-500/50'
                : 'bg-amber-950/40 border-amber-500/50'
      }`}>
        <div className={`p-3 rounded-full ${
            isPerfect ? 'bg-emerald-500 text-emerald-950' : isImpossible ? 'bg-red-500 text-white' : 'bg-amber-500 text-amber-950'
        }`}>
             {isPerfect ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
        </div>
        <div>
            <h4 className={`font-bold text-2xl ${
                isPerfect ? 'text-emerald-400' : isImpossible ? 'text-red-400' : 'text-amber-400'
            }`}>
                {isPerfect && 'ĐÃ CHUẨN'}
                {result.action === SuggestionAction.ADJUST_LENGTH && 'CẦN CHỈNH CHIỀU SÂU'}
                {isImpossible && 'KHÔNG ĐẠT YÊU CẦU'}
            </h4>
            <p className="text-slate-300 text-sm mt-1 opacity-80">
                {isPerfect && 'Thông số hiện tại đã tối ưu cho củ loa 12WF335.'}
                {result.action === SuggestionAction.ADJUST_LENGTH && 'Cần thay đổi chiều dài ống hơi để đạt Fb tối ưu.'}
                {isImpossible && 'Kích thước lỗ hiện tại không thể điều chỉnh chiều sâu để đạt chuẩn. Cần thay đổi diện tích lỗ.'}
            </p>
        </div>
      </div>

      {/* 2. FREQUENCY METER */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
         <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Hiện tại</div>
                <div className="text-4xl font-black text-white">{result.fbCurrent.toFixed(1)} <span className="text-lg text-slate-600 font-medium">Hz</span></div>
            </div>
            
            <div className="flex flex-col items-center">
                 <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-slate-400 mb-2">
                    Lệch {result.deltaFb > 0 ? '+' : ''}{result.deltaFb.toFixed(1)} Hz
                 </div>
                 <ArrowRight className={`w-8 h-8 ${Math.abs(result.deltaFb) <= 1 ? 'text-emerald-500' : 'text-amber-500'}`} />
            </div>

            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Mục tiêu</div>
                <div className="text-4xl font-black text-sky-400">{result.fbTarget} <span className="text-lg text-sky-900 font-medium">Hz</span></div>
            </div>
         </div>
         
         <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
             <div 
                className={`h-full transition-all duration-500 ${result.fbCurrent > result.fbTarget ? 'bg-amber-500' : 'bg-sky-500'}`}
                style={{ width: `${Math.min(Math.max((result.fbCurrent / 60) * 100, 10), 100)}%` }} 
             />
         </div>
      </div>

      {/* 3. ACTION BOX */}
      {!isPerfect && !isImpossible && (
          <div className="bg-slate-800 rounded-2xl border-2 border-amber-500/30 overflow-hidden shadow-2xl shadow-amber-900/10">
            <div className="bg-amber-500/10 p-3 border-b border-amber-500/20 flex items-center text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Scissors className="w-4 h-4 mr-2" />
                Hành động đề xuất
            </div>
            <div className="p-6 flex items-center justify-between">
                <div>
                     <div className="text-slate-300 mb-1">
                        {result.lengthDiff > 0 ? 'Cần nối dài thêm' : 'Cần cắt ngắn đi'}
                     </div>
                     <div className="text-3xl font-bold text-white">
                        {Math.abs(result.lengthDiff).toFixed(1)} cm
                     </div>
                </div>
                <div className="h-12 w-px bg-slate-700 mx-6"></div>
                <div className="text-right">
                     <div className="text-slate-500 text-xs uppercase mb-1">Chiều sâu mới</div>
                     <div className="text-3xl font-bold text-emerald-400">
                        {result.suggestedLength.toFixed(1)} cm
                     </div>
                </div>
            </div>
          </div>
      )}
      
      {isImpossible && (
          <div className="bg-red-950/20 p-6 rounded-2xl border border-red-500/30 text-red-200">
              <h5 className="font-bold flex items-center mb-2">
                  <AlertOctagon className="w-5 h-5 mr-2" />
                  Không thể chỉnh chiều sâu!
              </h5>
              <p className="text-sm opacity-80 mb-2">
                  Chiều sâu cần thiết ({result.suggestedLength.toFixed(1)}cm) nằm ngoài ngưỡng an toàn (8-35cm).
              </p>
              <p className="text-sm font-bold text-white">
                  → Bắt buộc phải thay đổi kích thước mặt lỗ (tăng/giảm diện tích).
              </p>
          </div>
      )}

      {/* 4. STATS GRID */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-1">Thể tích thực Vb</div>
              <div className={`text-xl font-bold ${result.vNet >= 50 && result.vNet <= 70 ? 'text-white' : 'text-red-400'}`}>
                  {result.vNet.toFixed(1)} Lít
              </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-1">Tổng diện tích lỗ</div>
              <div className={`text-xl font-bold ${result.sTotal >= 150 ? 'text-white' : 'text-red-400'}`}>
                  {result.sTotal.toFixed(0)} cm²
              </div>
          </div>
      </div>

      {/* 5. WARNINGS */}
      {result.warnings.length > 0 && (
          <div className="bg-slate-900/80 p-4 rounded-xl border-l-4 border-red-500 text-sm space-y-2">
              {result.warnings.map((w, i) => (
                  <div key={i} className="text-red-300 flex items-start">
                      <span className="mr-2 text-red-500">•</span> {w}
                  </div>
              ))}
          </div>
      )}

    </div>
  );
};