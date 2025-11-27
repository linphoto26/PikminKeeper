import React, { useState } from 'react';
import { CollectionItem } from '../types';
import { MUSHROOM_COLORS, BASE_ATTACK_POWER } from '../constants';
import { Sword, HelpCircle, BarChart3, ChevronsUp, Droplets } from 'lucide-react';

interface MushroomCalculatorProps {
  collection: CollectionItem[];
}

const MushroomCalculator: React.FC<MushroomCalculatorProps> = ({ collection }) => {
  const [selectedMushroom, setSelectedMushroom] = useState(MUSHROOM_COLORS[0].id);
  const [squadSize, setSquadSize] = useState(40);
  const [avgHeartLevel, setAvgHeartLevel] = useState(4); // 0 to 4 (Gold hearts are 8, simplifed here)
  const [useFlowers, setUseFlowers] = useState(true);

  // Helper to find matching color ID
  const isColorMatch = (pikminType: string, mushroomId: string) => {
    // Simplified mapping
    if (pikminType === 'RED' && mushroomId === 'RED') return true;
    if (pikminType === 'BLUE' && mushroomId === 'BLUE') return true;
    if (pikminType === 'YELLOW' && mushroomId === 'YELLOW') return true;
    if (pikminType === 'PURPLE' && mushroomId === 'PURPLE') return true;
    if (pikminType === 'WHITE' && mushroomId === 'WHITE') return true;
    if (pikminType === 'WINGED' && mushroomId === 'PINK') return true;
    if (pikminType === 'ROCK' && mushroomId === 'GRAY') return true;
    if (pikminType === 'ICE' && mushroomId === 'CYAN') return true;
    return false;
  };

  const calculatePower = () => {
    const mushroom = MUSHROOM_COLORS.find(m => m.id === selectedMushroom);
    // Ensure consistent return type structure
    if (!mushroom) return { totalPower: 0, squadDetails: [], remainingSlots: squadSize };

    // Logic: Find the best Pikmin in collection to fill the squad
    // 1. Sort collection by strength for this mushroom
    const rankedPikmin = [...collection].map(p => {
        let power = BASE_ATTACK_POWER[p.type] || 4;
        
        // Flower bonus (Simplified: ~3 extra power)
        if (useFlowers) power += 3;
        
        // Heart bonus (Simplified: +1 per heart approx)
        power += avgHeartLevel;

        // Color Match Multiplier
        // Wiki says: Attack power = Base × Friendship Multiplier.
        // Also if colors match, the attack power is significantly higher.
        // We will use a simplified "Total Score" estimation for sorting.
        
        const isMatch = isColorMatch(p.type, selectedMushroom);
        let finalScore = power;
        
        if (isMatch) {
            finalScore = power + 10; // Major bonus for matching
        }
        
        return {
            ...p,
            scorePerUnit: finalScore,
            isMatch
        };
    }).sort((a, b) => b.scorePerUnit - a.scorePerUnit);

    // 2. Fill the squad and track details
    let totalPower = 0;
    let remainingSlots = squadSize;
    let squadDetails: Array<{
        id: string;
        name: string;
        count: number;
        contribution: number;
        colorClass: string;
        isMatch: boolean;
    }> = [];

    for (const p of rankedPikmin) {
        if (remainingSlots <= 0) break;
        const take = Math.min(remainingSlots, p.count);
        if (take > 0) {
            const contribution = take * p.scorePerUnit;
            totalPower += contribution;
            remainingSlots -= take;
            
            squadDetails.push({
                id: p.id,
                name: p.name,
                count: take,
                contribution: contribution,
                colorClass: p.baseColorClass,
                isMatch: p.isMatch
            });
        }
    }

    return { totalPower, squadDetails, remainingSlots };
  };

  const result = calculatePower();

  return (
    <div className="glass-panel rounded-3xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-tr from-red-500 to-pink-500 p-2.5 rounded-xl mr-4 shadow-lg">
            <Sword className="text-white" size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">蘑菇戰力計算機</h2>
            <p className="text-sm text-gray-500 font-medium">基於你的收藏估算最佳隊伍戰力</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
            <div className="bg-white/50 p-4 rounded-2xl border border-white/50">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">蘑菇顏色</label>
                <div className="grid grid-cols-4 gap-3">
                    {MUSHROOM_COLORS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMushroom(m.id)}
                            className={`
                                h-12 rounded-xl transition-all border-2 shadow-sm
                                ${selectedMushroom === m.id 
                                    ? 'border-gray-800 scale-105 shadow-md ring-2 ring-gray-200' 
                                    : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                                } 
                                ${m.colorClass}
                            `}
                            title={m.name}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right font-medium">{MUSHROOM_COLORS.find(m => m.id === selectedMushroom)?.name}</p>
            </div>

            <div className="p-5 bg-white/50 rounded-2xl space-y-5 border border-white/50">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">隊伍上限</label>
                        <span className="font-bold text-gray-900">{squadSize}</span>
                    </div>
                    <input 
                        type="range" min="10" max="40" step="1" 
                        value={squadSize} 
                        onChange={(e) => setSquadSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">平均好感度</label>
                        <span className="font-bold text-red-500">{avgHeartLevel} ❤️</span>
                    </div>
                    <input 
                        type="range" min="0" max="8" step="1" 
                        value={avgHeartLevel} 
                        onChange={(e) => setAvgHeartLevel(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                    <label htmlFor="flowerCheck" className="text-sm text-gray-700 flex items-center font-medium">
                        <Droplets size={16} className="mr-2 text-blue-400"/>
                        <span>頭上有花加成</span>
                    </label>
                    <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="toggle" 
                            id="flowerCheck" 
                            checked={useFlowers}
                            onChange={(e) => setUseFlowers(e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-6 border-gray-300 transition-all duration-300 shadow-sm"
                        />
                        <label htmlFor="flowerCheck" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${useFlowers ? 'bg-green-500' : 'bg-gray-300'}`}></label>
                    </div>
                </div>
            </div>
        </div>

        {/* Results */}
        <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-xl">
             {/* Total Power Badge */}
            <div className="bg-gray-800 text-white p-8 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">預估總戰力</h3>
                <div className="text-6xl font-black tracking-tight flex items-center justify-center gap-3">
                    <Sword size={36} className="text-gray-600" />
                    {result.totalPower.toLocaleString()}
                </div>
            </div>
            
            <div className="flex-1 border-t-0 p-5 bg-white/80 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3 mb-4">
                    <p className="font-bold text-gray-800 flex items-center text-sm">
                        <BarChart3 size={16} className="mr-2 text-gray-500"/>
                        隊伍構成
                    </p>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-bold">
                        {squadSize - result.remainingSlots}/{squadSize}
                    </span>
                </div>

                {result.squadDetails.length > 0 ? (
                    <div className="space-y-4">
                        {result.squadDetails.map((group) => {
                            const percentage = (group.contribution / result.totalPower) * 100;
                            const isLight = group.colorClass.includes('white') || group.colorClass.includes('gray-200');
                            const barColor = isLight ? 'bg-gray-400' : group.colorClass;
                            const dotColor = isLight ? 'bg-gray-100 border border-gray-300' : group.colorClass;
                                
                            return (
                                <div key={group.id} className="relative">
                                    <div className="flex justify-between items-center text-xs mb-1.5">
                                        <div className="flex items-center gap-2">
                                            {/* Color Dot */}
                                            <div className={`w-3 h-3 rounded-full ${dotColor} shadow-sm ring-1 ring-white`}></div>
                                            
                                            <span className="font-bold text-gray-700">
                                                {group.name.split(' ')[0]}
                                            </span>
                                            
                                            <span className="bg-gray-100 text-gray-500 px-1.5 rounded text-[10px] font-medium border border-gray-200">
                                                x{group.count}
                                            </span>

                                            {group.isMatch && (
                                                <span className="flex items-center text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100" title="屬性加成">
                                                    <ChevronsUp size={10} className="mr-0.5" /> Bonus
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-mono font-bold text-gray-700">
                                            {Math.round(group.contribution)} <span className="text-[10px] text-gray-400 font-normal">({Math.round(percentage)}%)</span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out relative shadow-sm`} 
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center">
                        <p className="text-gray-400 font-medium mb-1">隊伍是空的</p>
                        <p className="text-xs text-gray-400">請去收集更多皮克敏吧！</p>
                    </div>
                )}

                {result.remainingSlots > 0 && (
                     <div className="mt-6 p-3 bg-orange-50/80 border border-orange-100 rounded-xl text-center backdrop-blur-sm">
                        <p className="text-orange-600 text-xs font-bold flex items-center justify-center">
                            ⚠️ 隊伍未滿 (缺 {result.remainingSlots} 隻)
                        </p>
                     </div>
                )}
            </div>
            
            <div className="bg-white/90 p-3 flex items-start text-[10px] text-gray-400 text-center justify-center border-t border-gray-100">
                <HelpCircle size={12} className="mr-1 flex-shrink-0 mt-[1px]" />
                <span>數值僅供參考，實際戰力受精華、好感度小數點及特殊加成影響。</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MushroomCalculator;