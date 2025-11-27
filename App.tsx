import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sprout, BarChart3, Leaf, Search, X, Grid3X3, Sword, Settings as SettingsIcon, Filter, ArrowUpDown, Footprints, LayoutGrid, Layers, HardDrive } from 'lucide-react';

import { PIKMIN_TYPES, STORAGE_KEY, DECOR_CATEGORIES } from './constants';
import { CollectionItem } from './types';
import PikminCard from './components/PikminCard';
import StatsChart from './components/StatsChart';
import DecorMatrix from './components/DecorMatrix';
import MushroomCalculator from './components/MushroomCalculator';
import Settings from './components/Settings';
import StepPlanner from './components/StepPlanner';
import DecorGroupCard from './components/DecorGroupCard';

// Initial loader or state initializer
const getInitialState = (): CollectionItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with static data to ensure new types are added if constants change
      return PIKMIN_TYPES.map(p => {
        const found = parsed.find((i: CollectionItem) => i.id === p.id);
        return found 
            ? { 
                ...p, 
                count: found.count, 
                isFavorite: found.isFavorite ?? false, 
                collectedDecors: Array.from(new Set(found.collectedDecors || [])),
                tags: found.tags || [] // Ensure tags exist
              } 
            : { ...p, count: 0, isFavorite: false, collectedDecors: [], tags: [] };
      });
    }
  } catch (e) {
    console.error("Failed to load local storage", e);
  }
  return PIKMIN_TYPES.map(p => ({ ...p, count: 0, isFavorite: false, collectedDecors: [], tags: [] }));
};

const Navbar = () => {
    const location = useLocation();
    
    // macOS Toolbar Item Style
    const navItemClass = (path: string) => `
        flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap
        ${location.pathname === path 
            ? 'bg-black/10 text-gray-900 shadow-sm' 
            : 'text-gray-500 hover:bg-black/5 hover:text-gray-800'}
    `;

    return (
        <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-2">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl flex justify-between items-center h-14 px-4 sm:px-6">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center group">
                        <div className="bg-gradient-to-tr from-green-500 to-emerald-400 p-1.5 rounded-lg mr-2 shadow-lg group-hover:scale-105 transition-transform">
                            <Leaf className="text-white" size={18} />
                        </div>
                        <span className="font-bold text-lg text-gray-800 tracking-tight hidden sm:block font-sans">Pikmin<span className="text-green-600">Keeper</span></span>
                    </Link>
                </div>
                
                <div className="flex space-x-1 overflow-x-auto no-scrollbar mask-linear-fade items-center">
                    <Link to="/" className={navItemClass('/')} title="收藏">
                        <Sprout size={18} /> <span className="hidden md:inline">收藏</span>
                    </Link>
                    <Link to="/planner" className={navItemClass('/planner')} title="步數">
                        <Footprints size={18} /> <span className="hidden md:inline">步數</span>
                    </Link>
                    <Link to="/matrix" className={navItemClass('/matrix')} title="矩陣">
                        <Grid3X3 size={18} /> <span className="hidden md:inline">矩陣</span>
                    </Link>
                    <Link to="/calculator" className={navItemClass('/calculator')} title="戰力">
                        <Sword size={18} /> <span className="hidden md:inline">戰力</span>
                    </Link>
                    <Link to="/stats" className={navItemClass('/stats')} title="統計">
                        <BarChart3 size={18} /> <span className="hidden md:inline">統計</span>
                    </Link>
                    <Link to="/settings" className={navItemClass('/settings')} title="設定">
                        <SettingsIcon size={18} /> 
                        <span className="hidden md:inline">設定</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const App: React.FC = () => {
  const [collection, setCollection] = useState<CollectionItem[]>(getInitialState);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'type' | 'decor'>('type');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'incomplete'>('all');
  const [sortType, setSortType] = useState<'default' | 'count_desc' | 'count_asc'>('default');

  // Auto-save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  const handleIncrement = (id: string) => {
    setCollection(prev => prev.map(item => 
      item.id === id ? { ...item, count: item.count + 1 } : item
    ));
  };

  const handleDecrement = (id: string) => {
    setCollection(prev => prev.map(item => 
      item.id === id ? { ...item, count: Math.max(0, item.count - 1) } : item
    ));
  };

  const handleToggleFavorite = (id: string) => {
    setCollection(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleUpdateDecors = (id: string, newDecors: string[]) => {
    setCollection(prev => prev.map(item => 
        item.id === id ? { ...item, collectedDecors: newDecors } : item
    ));
  };

  const handleUpdateTags = (id: string, newTags: string[]) => {
    setCollection(prev => prev.map(item => 
        item.id === id ? { ...item, tags: newTags } : item
    ));
  };

  const handleToggleDecorSingle = (pikminId: string, decorId: string) => {
    setCollection(prev => prev.map(item => {
        if (item.id !== pikminId) return item;

        const hasDecor = item.collectedDecors.includes(decorId);
        let newDecors;
        let newCount = item.count;

        if (hasDecor) {
            newDecors = item.collectedDecors.filter(d => d !== decorId);
        } else {
            newDecors = [...item.collectedDecors, decorId];
            if (item.count === 0) {
                newCount = 1;
            }
        }
        return { ...item, count: newCount, collectedDecors: newDecors };
    }));
  };

  // Filter & Sort Logic
  const filteredCollection = collection
    .filter(item => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(q) || 
                              item.description.toLowerCase().includes(q) ||
                              (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q)));
        const matchesFilter = 
            filterType === 'all' ? true :
            filterType === 'favorites' ? item.isFavorite :
            filterType === 'incomplete' ? item.collectedDecors.length < DECOR_CATEGORIES.length : true;
        
        return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
        if (sortType === 'count_desc') return b.count - a.count;
        if (sortType === 'count_asc') return a.count - b.count;
        return 0; // default order
    });

  const filteredDecors = DECOR_CATEGORIES.filter(decor => {
      const q = searchQuery.toLowerCase();
      return decor.name.toLowerCase().includes(q);
  });

  const totalPikmin = collection.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900 pb-12 selection:bg-green-200 selection:text-green-900">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 pt-8">
          <Routes>
            <Route path="/" element={
              <>
                <div className="glass-panel rounded-3xl p-6 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    {/* Local Storage Indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/50 px-2 py-1 rounded-full shadow-sm">
                         <HardDrive size={12} className="text-gray-500" />
                         <span>本機儲存</span>
                    </div>
                    
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">我的皮克敏</h1>
                        <p className="text-gray-500 mt-1 font-medium">收藏總數: <span className="text-green-600 text-lg">{totalPikmin}</span></p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
                        <div className="flex bg-gray-200/50 p-1 rounded-lg border border-gray-200/50">
                            <button
                                onClick={() => setViewMode('type')}
                                className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm ${viewMode === 'type' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700 shadow-none bg-transparent'}`}
                            >
                                <LayoutGrid size={16} /> <span>種類</span>
                            </button>
                            <button
                                onClick={() => setViewMode('decor')}
                                className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm ${viewMode === 'decor' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700 shadow-none bg-transparent'}`}
                            >
                                <Layers size={16} /> <span>飾品</span>
                            </button>
                        </div>

                        <div className="relative group w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-9 pr-8 py-2 border border-gray-300/50 rounded-lg bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm placeholder-gray-400"
                                placeholder={viewMode === 'type' ? "搜尋名稱、標籤..." : "搜尋飾品..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <div className="bg-gray-200 rounded-full p-0.5">
                                        <X size={12} />
                                    </div>
                                </button>
                            )}
                        </div>

                        {viewMode === 'type' && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                        <Filter className="h-3.5 w-3.5 text-gray-500" />
                                    </div>
                                    <select 
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value as any)}
                                        className="block w-full pl-8 pr-8 py-2 border border-gray-300/50 rounded-lg bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm appearance-none cursor-pointer text-gray-600 font-medium"
                                    >
                                        <option value="all">全部</option>
                                        <option value="favorites">最愛</option>
                                        <option value="incomplete">未滿</option>
                                    </select>
                                </div>

                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                        <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                                    </div>
                                    <select 
                                        value={sortType}
                                        onChange={(e) => setSortType(e.target.value as any)}
                                        className="block w-full pl-8 pr-8 py-2 border border-gray-300/50 rounded-lg bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm appearance-none cursor-pointer text-gray-600 font-medium"
                                    >
                                        <option value="default">預設</option>
                                        <option value="count_desc">多到少</option>
                                        <option value="count_asc">少到多</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {viewMode === 'type' && (
                    filteredCollection.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredCollection.map(item => {
                            const missingDecorCount = DECOR_CATEGORIES.length - item.collectedDecors.filter(d => !d.includes('_')).length; 
                            const isCollected = item.count > 0;
                            const isIncomplete = isCollected && missingDecorCount > 0;
                            
                            return (
                                <div key={item.id} className="relative h-full">
                                    {isIncomplete && (
                                        <div className="absolute -top-2 left-4 z-20 pointer-events-none">
                                            <div className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                缺 {missingDecorCount} 飾品
                                            </div>
                                        </div>
                                    )}
                                    <PikminCard 
                                        item={item} 
                                        onIncrement={handleIncrement}
                                        onDecrement={handleDecrement}
                                        onToggleFavorite={handleToggleFavorite}
                                        onUpdateDecors={handleUpdateDecors}
                                        onUpdateTags={handleUpdateTags}
                                    />
                                </div>
                            );
                        })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-3xl text-center">
                            <div className="bg-gray-100/50 p-6 rounded-full mb-4">
                                <Search className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2">找不到皮克敏</h3>
                            <p className="text-gray-400">沒有符合搜尋或篩選條件的結果</p>
                        </div>
                    )
                )}

                {viewMode === 'decor' && (
                    filteredDecors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {filteredDecors.map(decor => (
                                <DecorGroupCard 
                                    key={decor.id}
                                    decor={decor}
                                    collection={collection}
                                    onToggle={handleToggleDecorSingle}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-3xl text-center">
                            <div className="bg-gray-100/50 p-6 rounded-full mb-4">
                                <Search className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2">找不到飾品</h3>
                            <p className="text-gray-400">嘗試搜尋其他關鍵字</p>
                        </div>
                    )
                )}

              </>
            } />
            
            <Route path="/planner" element={<StepPlanner />} />
            
            <Route path="/matrix" element={<DecorMatrix collection={collection} />} />
            
            <Route path="/calculator" element={<MushroomCalculator collection={collection} />} />

            <Route path="/stats" element={
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 pl-2">收藏統計</h1>
                    <StatsChart collection={collection} />
                </>
            } />

            <Route path="/settings" element={
                <Settings 
                    collection={collection} 
                    setCollection={setCollection} 
                />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;