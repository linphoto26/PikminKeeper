import React from 'react';
import { CollectionItem } from '../types';
import { DECOR_CATEGORIES } from '../constants';
import { Check, X } from 'lucide-react';

interface DecorMatrixProps {
  collection: CollectionItem[];
}

const DecorMatrix: React.FC<DecorMatrixProps> = ({ collection }) => {
  const totalCollected = collection.reduce((acc, curr) => acc + curr.collectedDecors.length, 0);
  const totalPossible = collection.length * DECOR_CATEGORIES.length;
  const percentage = totalPossible > 0 ? Math.round((totalCollected / totalPossible) * 100) : 0;

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-gray-200/50 bg-white/40 backdrop-blur-md">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">全域飾品矩陣</h2>
        <p className="text-sm text-gray-500 mt-1">一覽所有皮克敏的飾品收集狀況</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-4 sticky left-0 bg-gray-50/90 backdrop-blur-md z-20 font-bold min-w-[150px] shadow-[1px_0_0_0_rgba(0,0,0,0.05)] border-b border-gray-200/50 text-gray-700">
                飾品種類
              </th>
              {collection.map(pikmin => (
                <th key={pikmin.id} className="px-2 py-4 text-center min-w-[60px] border-b border-gray-200/50 bg-white/30">
                  <div className={`w-8 h-8 rounded-full ${pikmin.baseColorClass} mx-auto flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white`}>
                    {pikmin.name.substring(0, 1)}
                  </div>
                </th>
              ))}
            </tr>
            {/* Summary Row */}
            <tr>
                <th className="px-4 py-3 sticky left-0 bg-gray-100/90 backdrop-blur-md z-10 text-xs font-medium text-gray-500 text-right shadow-[1px_0_0_0_rgba(0,0,0,0.05)] border-b border-gray-200/50">
                    已收集
                </th>
                {collection.map(pikmin => {
                    const count = pikmin.collectedDecors.length;
                    const total = DECOR_CATEGORIES.length;
                    const isComplete = count === total;
                    return (
                        <th key={`sum-${pikmin.id}`} className="px-2 py-3 text-center border-b border-gray-200/50 bg-gray-50/30">
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isComplete ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-white border border-gray-200 text-gray-400'}`}>
                                {count} / {total}
                            </span>
                        </th>
                    );
                })}
            </tr>
          </thead>
          <tbody>
            {DECOR_CATEGORIES.map((decor, index) => (
              <tr key={decor.id} className={`border-b border-gray-100/50 hover:bg-white/60 transition-colors ${index % 2 === 0 ? 'bg-white/20' : 'bg-transparent'}`}>
                <td className="px-4 py-3 font-medium text-gray-800 sticky left-0 bg-inherit z-10 flex items-center gap-2 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] backdrop-blur-[2px]">
                    <span>{decor.name.split('(')[0]}</span>
                </td>
                {collection.map(pikmin => {
                  const hasCollected = pikmin.collectedDecors.includes(decor.id);
                  return (
                    <td key={`${pikmin.id}-${decor.id}`} className="px-2 py-3 text-center">
                      {hasCollected ? (
                        <div className="flex justify-center">
                          <div className="bg-green-400 text-white rounded-full p-1 shadow-sm transition-transform hover:scale-110">
                            <Check size={12} strokeWidth={4} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                           <div className="text-gray-200/70">
                            <X size={12} />
                           </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="p-5 bg-white/40 backdrop-blur-md border-t border-gray-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <span className="font-bold text-gray-800">總進度</span>
            <p className="text-xs text-gray-500">全圖鑑達成率</p>
        </div>
        <div className="flex items-center gap-4 bg-white/60 px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
             <div className="text-right">
                <div className="text-xl font-black text-gray-800 leading-none">{totalCollected} <span className="text-sm font-medium text-gray-400">/ {totalPossible}</span></div>
             </div>
             <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
             </div>
             <span className="font-bold text-yellow-600 text-sm">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default DecorMatrix;