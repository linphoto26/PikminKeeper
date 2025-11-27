import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, Star, Check, X, Settings2, Tag, Sparkles, Gift, Sprout, ImageOff, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { 
  Utensils, Coffee, CakeSlice, Film, Pill, PawPrint, Trees, Waves, 
  Mail, Palette, Plane, Train, Umbrella, Sandwich, Store, 
  ShoppingBasket, Croissant, Scissors, Shrub, Book,
  MapPin, Pizza, Fish, Soup, Bus, FerrisWheel,
  Shirt, Mountain, Trophy, CloudRain, Waypoints, BedDouble, Gem, Tv,
  Landmark, CookingPot, Popsicle, CircleDot, Circle
} from 'lucide-react';
import { CollectionItem, PikminColorType, DecorCategory } from '../types';
import { DECOR_CATEGORIES, EVENT_PRESETS } from '../constants';

interface PikminCardProps {
  item: CollectionItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateDecors: (id: string, newDecors: string[]) => void;
  onUpdateTags?: (id: string, newTags: string[]) => void;
}

export const iconMap: Record<string, React.ElementType> = {
  Utensils, Coffee, CakeSlice, Film, Pill, PawPrint, Trees, Waves, 
  Mail, Palette, Plane, Train, Umbrella, Sandwich, Store, 
  ShoppingBasket, Croissant, Scissors, Shrub, Book,
  MapPin, Pizza, Fish, Soup, Bus, FerrisWheel,
  Shirt, Mountain, Trophy, CloudRain, Waypoints, BedDouble, Gem, Tv,
  Landmark, CookingPot, Popsicle, CircleDot, Circle
};

const PikminCard: React.FC<PikminCardProps> = ({ item, onIncrement, onDecrement, onToggleFavorite, onUpdateDecors, onUpdateTags }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDecors, setTempDecors] = useState<Set<string>>(new Set());
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [justAddedDecor, setJustAddedDecor] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isFavAnimating, setIsFavAnimating] = useState(false);
  
  // UI State for collapsible sections
  const [isEventExpanded, setIsEventExpanded] = useState(false);
  
  // Grouped Categories State
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Reset error state if the item changes
  useEffect(() => {
    setImgError(false);
  }, [item.id, item.imageUrl]);

  const collectedCount = item.collectedDecors.length;
  const totalDecors = DECOR_CATEGORIES.length;
  const isLightColor = item.type === PikminColorType.WHITE || item.type === PikminColorType.YELLOW;

  // Group the decors
  const groupedDecors = useMemo(() => {
    return DECOR_CATEGORIES.reduce((acc, decor) => {
        const group = decor.categoryGroup || '其他 (Other)';
        if (!acc[group]) acc[group] = [];
        acc[group].push(decor);
        return acc;
    }, {} as Record<string, DecorCategory[]>);
  }, []);

  // Initialize expanded state once groupedDecors is ready or modal opens
  useEffect(() => {
     if (isModalOpen && Object.keys(expandedGroups).length === 0) {
         const initial: Record<string, boolean> = {};
         Object.keys(groupedDecors).forEach(key => initial[key] = true);
         setExpandedGroups(initial);
     }
  }, [isModalOpen, groupedDecors, expandedGroups]);


  const handleOpenModal = () => {
    setTempDecors(new Set(item.collectedDecors));
    setTempTags([...(item.tags || [])]);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTagInput('');
    setIsEventExpanded(false);
    document.body.style.overflow = 'unset';
  };

  const handleToggleTempDecor = (decorId: string) => {
    const next = new Set(tempDecors);
    if (next.has(decorId)) {
        next.delete(decorId);
    } else {
        next.add(decorId);
    }
    setTempDecors(next);
  };

  const toggleGroup = (groupName: string) => {
      setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleQuickAdd = (e: React.MouseEvent, decorId: string) => {
    e.stopPropagation();
    onIncrement(item.id);

    const currentDecors = new Set(item.collectedDecors);
    currentDecors.add(decorId);
    
    const nextTemp = new Set(tempDecors);
    nextTemp.add(decorId);
    setTempDecors(nextTemp);

    onUpdateDecors(item.id, Array.from(currentDecors));
    setJustAddedDecor(decorId);
    setTimeout(() => setJustAddedDecor(null), 1500);
  };

  const handleSaveDecors = () => {
    onUpdateDecors(item.id, Array.from(tempDecors));
    if (onUpdateTags) {
        onUpdateTags(item.id, tempTags);
    }
    handleCloseModal();
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tempTags.includes(newTagInput.trim())) {
        setTempTags([...tempTags, newTagInput.trim()]);
        setNewTagInput('');
    }
  };
  const handleRemoveTag = (tag: string) => {
    setTempTags(tempTags.filter(t => t !== tag));
  };

  const handleToggleEvent = (eventName: string) => {
     const next = new Set(tempDecors);
     if (next.has(eventName)) {
         next.delete(eventName);
     } else {
         next.add(eventName);
     }
     setTempDecors(next);
  };

  const handleFavClick = (id: string) => {
    setIsFavAnimating(true);
    onToggleFavorite(id);
    setTimeout(() => setIsFavAnimating(false), 300);
  };

  return (
    <>
        <div className={`
            relative flex flex-col h-full glass-panel rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group
            ${item.count > 0 ? 'border-white/40' : 'opacity-80 grayscale-[0.3] hover:grayscale-0 hover:opacity-100'}
        `}>
            {/* Header Background */}
            <div className={`h-28 ${item.baseColorClass} bg-opacity-90 backdrop-blur-md flex items-center justify-center relative shrink-0 transition-colors duration-500`}>
                <div className="absolute top-3 right-3 z-10">
                    <button 
                        onClick={() => handleFavClick(item.id)}
                        className={`
                            p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm active:scale-90
                            ${item.isFavorite ? 'bg-white/30 text-yellow-300' : 'bg-black/10 text-white/70 hover:bg-black/20'}
                            ${isFavAnimating ? 'scale-125' : 'scale-100'}
                        `}
                    >
                        <Star size={18} className={`transition-all duration-300 ${item.isFavorite ? "fill-yellow-300 drop-shadow-sm" : ""}`} />
                    </button>
                </div>
                
                {/* Image Handling */}
                <div className="transform translate-y-10 relative group-hover:scale-105 transition-transform duration-300">
                    {imgError ? (
                        <div className={`w-24 h-24 rounded-full border-[5px] border-white shadow-xl flex items-center justify-center ${item.baseColorClass} relative`}>
                            <Sprout size={36} className={isLightColor ? 'text-gray-600' : 'text-white'} />
                            <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                                <ImageOff size={12} className="text-gray-400" />
                            </div>
                        </div>
                    ) : (
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-full border-[5px] border-white shadow-xl bg-white select-none" 
                            onError={() => setImgError(true)}
                        />
                    )}
                </div>
            </div>

            <div className="pt-14 pb-6 px-6 text-center flex-1 flex flex-col">
                <h3 className={`font-bold text-2xl mb-1 tracking-tight ${item.accentColorClass} drop-shadow-sm`}>
                    {item.name.split(' ')[0]}
                </h3>
                <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-widest">{item.name.split('(')[1]?.replace(')', '')}</p>
                <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[44px] leading-relaxed opacity-90 font-light">{item.description}</p>
                
                {/* Tags Display */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5 min-h-[24px]">
                        {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100/80 border border-gray-200 text-gray-600 rounded-md font-medium">
                                #{tag}
                            </span>
                        ))}
                        {item.tags.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{item.tags.length - 3}</span>}
                    </div>
                )}

                {/* Count Controls */}
                <div className="flex items-center justify-center gap-6 mb-6 mt-auto">
                    <button 
                        onClick={() => onDecrement(item.id)}
                        disabled={item.count === 0}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 transition-all active:scale-95 shadow-sm border border-transparent hover:border-red-200"
                    >
                        <Minus size={18} strokeWidth={2.5} />
                    </button>
                    
                    <div className="flex flex-col items-center w-14 overflow-hidden">
                        <span key={item.count} className="text-4xl font-bold text-gray-800 tracking-tighter animate-in slide-in-from-bottom-2 fade-in duration-200">
                            {item.count}
                        </span>
                    </div>

                    <button 
                        onClick={() => onIncrement(item.id)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-90 ${item.baseColorClass} hover:brightness-110 ${isLightColor ? 'text-gray-800' : 'text-white'} ring-2 ring-white/50`}
                    >
                        <Plus size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Decor Button */}
                <div className="pt-5 border-t border-gray-100 w-full">
                    <button 
                        onClick={handleOpenModal}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-yellow-50/60 border border-gray-200/50 hover:border-yellow-200/50 rounded-xl transition-all group relative backdrop-blur-sm active:scale-[0.98]"
                    >
                        <div className="flex items-center space-x-2.5">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:text-yellow-600 text-gray-400 transition-colors border border-gray-100">
                                <Settings2 size={16} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-yellow-700 uppercase tracking-wide">飾品與標籤</span>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-10">
                            管理飾品收藏與標籤
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>

                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${collectedCount === totalDecors ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-white text-gray-500 border-gray-200'}`}>
                            {collectedCount} / {totalDecors}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        {/* macOS Style Sheet Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleCloseModal} />
                <div className="relative glass-panel rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden border-white/60 ring-1 ring-black/5">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 z-20">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">編輯詳細資料</h3>
                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                <span className="font-medium text-gray-700">{item.name.split(' ')[0]}</span>
                                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md text-gray-500 border border-gray-200">ID: {item.id}</span>
                            </div>
                        </div>
                        <button onClick={handleCloseModal} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors active:scale-90">
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white/40">
                        
                        {/* Tags */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                                <Tag size={12} className="mr-1.5" /> 自定義標籤 (Tags)
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tempTags.map(tag => (
                                    <span key={tag} className="bg-white border border-green-200 text-green-700 text-xs px-2.5 py-1 rounded-lg flex items-center shadow-sm animate-in zoom-in duration-200">
                                        #{tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-green-400 hover:text-green-600 p-0.5 hover:bg-green-50 rounded"><X size={12}/></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex shadow-sm rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-green-500/30 transition-all">
                                <input 
                                    type="text" 
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                    placeholder="新增標籤..." 
                                    className="flex-1 text-sm bg-white/80 border-0 px-4 py-2.5 focus:outline-none placeholder-gray-400"
                                />
                                <button onClick={handleAddTag} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 border-l border-gray-200 transition-colors">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        <hr className="border-gray-200/60"/>

                        {/* Standard Decors (Grouped) */}
                        <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                                <Settings2 size={12} className="mr-1.5" /> 常規飾品 (Standard Decor)
                            </label>

                            <div className="space-y-4">
                                {Object.entries(groupedDecors).map(([groupName, decors]: [string, DecorCategory[]]) => {
                                    const isExpanded = expandedGroups[groupName] ?? true;
                                    const selectedInGroupCount = decors.filter(d => tempDecors.has(d.id)).length;
                                    
                                    return (
                                        <div key={groupName} className="border border-gray-200/60 rounded-2xl overflow-hidden bg-white/50 shadow-sm transition-all hover:shadow-md">
                                            <button 
                                                onClick={() => toggleGroup(groupName)}
                                                className="w-full flex items-center justify-between p-3.5 bg-white/40 hover:bg-white/70 transition-colors"
                                            >
                                                <div className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                    <LayoutGrid size={12} className="mr-2 opacity-50" /> 
                                                    {groupName}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedInGroupCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>
                                                        {selectedInGroupCount} / {decors.length}
                                                    </span>
                                                    {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                                </div>
                                            </button>
                                            
                                            {isExpanded && (
                                                <div className="p-3.5 border-t border-gray-200/60 animate-in slide-in-from-top-2 duration-200 bg-white/30">
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                        {decors.map(decor => {
                                                            const isSelected = tempDecors.has(decor.id);
                                                            const Icon = iconMap[decor.icon] || Star;
                                                            const isJustAdded = justAddedDecor === decor.id;
                                                            
                                                            const variant = decor.variants ? decor.variants[0] : null;
                                                            const variantId = variant ? `${decor.id}_${variant.id}` : '';
                                                            const isVariantSelected = variant && tempDecors.has(variantId);

                                                            return (
                                                                <div 
                                                                    key={decor.id} 
                                                                    className={`
                                                                        relative group rounded-xl transition-all duration-300
                                                                        ${isSelected 
                                                                            ? 'ring-2 ring-yellow-400 shadow-lg scale-[1.02] z-10' 
                                                                            : 'hover:shadow-md hover:bg-white/60'
                                                                        }
                                                                    `}
                                                                >
                                                                    <div className="w-full h-full aspect-square flex flex-col rounded-xl overflow-hidden relative bg-white/80 backdrop-blur-sm border border-white/50">
                                                                        
                                                                        {/* Toggle Action (Center Area) */}
                                                                        <button
                                                                            onClick={() => handleToggleTempDecor(decor.id)}
                                                                            className={`
                                                                                w-full h-full flex flex-col items-center justify-center p-2 transition-colors
                                                                                ${isSelected ? 'bg-yellow-50/90' : 'hover:bg-white'}
                                                                            `}
                                                                        >
                                                                            <div className="flex items-center justify-center gap-1 mb-1.5 relative">
                                                                                 {/* Preview Icon for Selected State */}
                                                                                {isSelected && <Icon size={12} className="text-yellow-600 absolute -left-3.5 top-1/2 -translate-y-1/2 opacity-70" />}
                                                                                
                                                                                <Icon 
                                                                                    size={24} 
                                                                                    className={`transition-all duration-300 drop-shadow-sm ${isSelected ? 'text-yellow-600 scale-110' : 'text-gray-400 group-hover:text-yellow-500 group-hover:scale-110'}`} 
                                                                                />
                                                                            </div>
                                                                            
                                                                            <span className={`text-[10px] text-center leading-tight line-clamp-2 w-full transition-colors ${isSelected ? 'text-yellow-800 font-bold' : 'text-gray-500'}`}>
                                                                                {decor.name.split('(')[0]}
                                                                            </span>
                                                                        </button>

                                                                        {/* Quick Add Button (Top Right, Separated) */}
                                                                        <button
                                                                            onClick={(e) => handleQuickAdd(e, decor.id)}
                                                                            className={`
                                                                                absolute top-1 right-1 z-20 w-6 h-6 flex items-center justify-center rounded-full border shadow-sm transition-all active:scale-90
                                                                                ${isSelected 
                                                                                    ? 'bg-white border-green-200 text-green-600 hover:bg-green-500 hover:text-white' 
                                                                                    : 'bg-white border-gray-200 text-green-600 hover:bg-green-500 hover:text-white'
                                                                                }
                                                                            `}
                                                                            title="快速新增 (+1)"
                                                                        >
                                                                            <Plus size={14} strokeWidth={3} />
                                                                        </button>

                                                                        {/* Collected Checkmark (Top Left) */}
                                                                        {isSelected && (
                                                                            <div className="absolute top-1 left-1 z-20 pointer-events-none">
                                                                                <div className="bg-green-500 text-white rounded-full p-[3px] shadow-sm animate-in zoom-in duration-200">
                                                                                    <Check size={10} strokeWidth={4} />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {/* Feedback Animation */}
                                                                        {isJustAdded && (
                                                                            <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-500/20 rounded-xl animate-pulse pointer-events-none">
                                                                                <span className="text-green-700 font-bold text-xs bg-white/90 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md animate-in slide-in-from-bottom-2">+1</span>
                                                                            </div>
                                                                        )}

                                                                        {/* Variant Indicator */}
                                                                        {isVariantSelected && (
                                                                            <div className="absolute bottom-6 right-1/2 translate-x-1/2 pointer-events-none">
                                                                                <Sparkles size={12} className="text-yellow-500 animate-pulse fill-yellow-500" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Variant Toggle Pill */}
                                                                    {isSelected && variant && (
                                                                        <button 
                                                                            onClick={() => handleToggleTempDecor(variantId)}
                                                                            className={`
                                                                                absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20 
                                                                                px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-md flex items-center gap-1 whitespace-nowrap backdrop-blur-md transition-transform active:scale-95
                                                                                ${isVariantSelected ? 'bg-yellow-100/90 border-yellow-400 text-yellow-800' : 'bg-white/90 border-gray-200 text-gray-400 hover:bg-gray-50'}
                                                                            `}
                                                                        >
                                                                        <Sparkles size={8} /> {variant.id === 'shiny' ? '閃亮' : '稀有'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <hr className="border-gray-200/60"/>

                        {/* Special Event Accordion */}
                        <div className="border border-gray-200/60 rounded-2xl overflow-hidden bg-white/50 shadow-sm">
                            <button 
                                onClick={() => setIsEventExpanded(!isEventExpanded)}
                                className="w-full flex items-center justify-between p-3.5 bg-white/40 hover:bg-white/70 transition-colors"
                            >
                                <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    <Gift size={12} className="mr-2" /> 
                                    活動限定與特殊 (Event / Special)
                                </div>
                                {isEventExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                            </button>
                            
                            {isEventExpanded && (
                                <div className="p-3.5 border-t border-gray-200/60 animate-in slide-in-from-top-2 duration-200 bg-white/30">
                                    <div className="flex flex-wrap gap-2">
                                        {EVENT_PRESETS.map(evt => {
                                            const isSelected = tempDecors.has(evt);
                                            return (
                                                <button
                                                    key={evt}
                                                    onClick={() => handleToggleEvent(evt)}
                                                    className={`
                                                        px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shadow-sm active:scale-95
                                                        ${isSelected 
                                                            ? 'bg-purple-100 border-purple-400 text-purple-800' 
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }
                                                    `}
                                                >
                                                    {evt.split('(')[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-3 text-center">
                                        活動飾品為獨立追蹤，不影響常規進度百分比。
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-gray-200/60 flex space-x-3 bg-white/70 backdrop-blur-xl sticky bottom-0 z-20">
                        <button 
                            onClick={handleCloseModal}
                            className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm active:scale-[0.98]"
                        >
                            取消
                        </button>
                        <button 
                            onClick={handleSaveDecors}
                            className="flex-1 py-3 px-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-900/20 flex items-center justify-center space-x-2 text-sm active:scale-[0.98]"
                        >
                            <Check size={16} />
                            <span>儲存變更</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default PikminCard;