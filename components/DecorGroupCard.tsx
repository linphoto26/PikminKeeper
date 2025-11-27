import React from 'react';
import { Star, Check } from 'lucide-react';
import { DecorCategory, CollectionItem } from '../types';
import { PIKMIN_TYPES } from '../constants';
import { iconMap } from './PikminCard';

interface DecorGroupCardProps {
  decor: DecorCategory;
  collection: CollectionItem[];
  onToggle: (pikminId: string, decorId: string) => void;
}

const DecorGroupCard: React.FC<DecorGroupCardProps> = ({ decor, collection, onToggle }) => {
  const Icon = iconMap[decor.icon] || Star;
  
  // Calculate completion for this specific decor across all Pikmin types
  const collectedCount = collection.filter(p => p.collectedDecors.includes(decor.id)).length;
  const totalTypes = PIKMIN_TYPES.length;
  const isComplete = collectedCount === totalTypes;

  return (
    <div className={`
        relative glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
        ${isComplete ? 'border-yellow-300/60 ring-1 ring-yellow-200' : 'border-white/50'}
    `}>
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b ${isComplete ? 'bg-yellow-50/50 border-yellow-200/50' : 'bg-white/40 border-gray-100/50'} backdrop-blur-sm`}>
            <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl shadow-sm ${isComplete ? 'bg-yellow-100 text-yellow-600' : 'bg-white text-gray-500 border border-gray-200/50'}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className={`font-bold text-base ${isComplete ? 'text-yellow-800' : 'text-gray-800'}`}>
                        {decor.name.split('(')[0]}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{decor.name.split('(')[1]?.replace(')', '')}</p>
                </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isComplete ? 'bg-green-500 text-white border-green-600' : 'bg-gray-200/50 text-gray-500 border-gray-200'}`}>
                {collectedCount}/{totalTypes}
            </span>
        </div>

        {/* Grid of Pikmin */}
        <div className="p-4 grid grid-cols-4 gap-2.5">
            {PIKMIN_TYPES.map((type) => {
                const userPikmin = collection.find(p => p.id === type.id);
                const hasDecor = userPikmin?.collectedDecors.includes(decor.id) || false;
                
                return (
                    <button
                        key={type.id}
                        onClick={() => onToggle(type.id, decor.id)}
                        className={`
                            relative flex flex-col items-center justify-center p-2 rounded-xl transition-all aspect-square
                            ${hasDecor 
                                ? `bg-white border-2 ${type.baseColorClass.replace('bg-', 'border-')} shadow-md scale-100` 
                                : 'bg-gray-100/50 border border-gray-200/50 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105'
                            }
                        `}
                        title={type.name}
                    >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mb-1
                            ${type.baseColorClass}
                        `}>
                            {type.name[0]}
                        </div>
                        
                        {hasDecor && (
                            <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white rounded-full p-0.5 shadow-sm border border-white">
                                <Check size={10} strokeWidth={4} />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default DecorGroupCard;