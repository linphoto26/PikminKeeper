import React, { useState } from 'react';
import { SEEDLING_TYPES } from '../constants';
import { Footprints, Timer, ChevronsRight, PlayCircle } from 'lucide-react';

const StepPlanner: React.FC = () => {
  const [seedlings, setSeedlings] = useState<Record<string, number>>({});
  const [isBoosterActive, setIsBoosterActive] = useState(false);
  const [stepsPerMinute, setStepsPerMinute] = useState(100); // Avg walking speed

  const handleCountChange = (id: string, delta: number) => {
    setSeedlings(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const calculateTotal = () => {
    let maxStepsNeeded = 0;
    let totalSeeds = 0;

    SEEDLING_TYPES.forEach(type => {
      const count = seedlings[type.id] || 0;
      if (count > 0) {
        totalSeeds += count;
        // If you walk, all slots hatch simultaneously. 
        // So the time to finish ALL is determined by the longest seedling.
        // Note: In game, you have limited slots, but for simplicity we assume slots are available.
        maxStepsNeeded = Math.max(maxStepsNeeded, type.steps);
      }
    });

    const boosterMultiplier = isBoosterActive ? 0.7 : 1.0;
    const effectiveSteps = Math.ceil(maxStepsNeeded * boosterMultiplier);
    const timeInMinutes = Math.ceil(effectiveSteps / stepsPerMinute);
    
    return { effectiveSteps, timeInMinutes, totalSeeds };
  };

  const { effectiveSteps, timeInMinutes, totalSeeds } = calculateTotal();

  return (
    <div className="glass-panel rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-tr from-green-400 to-teal-500 p-2.5 rounded-xl mr-4 shadow-lg">
            <Footprints className="text-white" size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">花苗步數規劃師</h2>
            <p className="text-sm text-gray-500 font-medium">計算孵化這些花苗需要走多久</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/50 rounded-2xl border border-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 transition-colors ${isBoosterActive ? 'bg-pink-100' : 'bg-gray-100'}`}>
                        <ChevronsRight size={20} className={`transition-colors ${isBoosterActive ? 'text-pink-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <span className="font-bold text-gray-700 block text-sm">花苗加速器 (種花)</span>
                        <span className="text-xs text-gray-400">減少 30% 步數</span>
                    </div>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="boosterToggle" checked={isBoosterActive} onChange={(e) => setIsBoosterActive(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-6 border-gray-300 transition-all duration-300 shadow-sm"/>
                    <label htmlFor="boosterToggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${isBoosterActive ? 'bg-pink-400' : 'bg-gray-300'}`}></label>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <div className="flex justify-between mb-2">
                     <span className="text-sm font-bold text-gray-700">步行速度</span>
                     <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-mono">{stepsPerMinute} 步/分</span>
                </div>
                <input 
                    type="range" min="50" max="150" step="5"
                    value={stepsPerMinute}
                    onChange={(e) => setStepsPerMinute(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
            </div>
        </div>

        {/* Seedling Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEEDLING_TYPES.map(seed => {
                const count = seedlings[seed.id] || 0;
                return (
                    <div key={seed.id} className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-300 ${count > 0 ? 'bg-white border-green-200 shadow-md transform scale-[1.02]' : 'bg-white/40 border-transparent hover:bg-white/60'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${seed.color} flex items-center justify-center shadow-sm border-2 border-white text-lg`}>
                                🌱
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm leading-tight">{seed.name.split(' ')[0]}</p>
                                <p className="text-[10px] text-gray-500 font-medium">{seed.steps.toLocaleString()} 步</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                            <button 
                                onClick={() => handleCountChange(seed.id, -1)}
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm disabled:opacity-50"
                                disabled={!count}
                            >
                                -
                            </button>
                            <span className="w-4 text-center font-bold text-gray-800 text-sm">{count}</span>
                            <button 
                                onClick={() => handleCountChange(seed.id, 1)}
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-green-600 hover:text-green-700 shadow-sm"
                            >
                                +
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Result Banner */}
        {totalSeeds > 0 ? (
             <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden mt-6 animate-in slide-in-from-bottom-6 duration-500">
                <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4 rotate-12">
                    <Footprints size={300} />
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-around gap-8 relative z-10">
                    <div className="text-center">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">所需總步數</p>
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500 flex items-baseline justify-center">
                            {effectiveSteps.toLocaleString()}
                            <span className="text-sm font-medium text-gray-500 ml-2">steps</span>
                        </p>
                    </div>
                    
                    <div className="h-16 w-[1px] bg-gray-700/50 hidden md:block"></div>

                    <div className="text-center">
                         <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">預估時間</p>
                         <p className="text-5xl font-black text-white flex items-baseline justify-center">
                            ~{Math.floor(timeInMinutes / 60) > 0 ? `${Math.floor(timeInMinutes / 60)}h ` : ''}{timeInMinutes % 60}
                            <span className="text-sm font-medium text-gray-500 ml-2">min</span>
                         </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-gray-400 bg-white/10 inline-block px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                        正在孵化 {totalSeeds} 顆花苗 • 平均速度: {stepsPerMinute} 步/分
                    </p>
                </div>
            </div>
        ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300/50 rounded-2xl bg-white/30 mt-4">
                <p className="text-gray-400 font-medium">請選擇至少一顆花苗開始計算</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StepPlanner;