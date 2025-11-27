import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList 
} from 'recharts';
import { CollectionItem } from '../types';
import { DECOR_CATEGORIES } from '../constants';

interface StatsChartProps {
  collection: CollectionItem[];
}

const StatsChart: React.FC<StatsChartProps> = ({ collection }) => {
  const total = collection.reduce((acc, curr) => acc + curr.count, 0);

  const data = collection.map(item => ({
    name: item.name.split(' ')[0], // Take Chinese name
    count: item.count,
    color: getHexColor(item.type),
    percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : "0"
  })).filter(item => item.count > 0);
  
  // Decor Stats
  const totalDecorsPossible = collection.length * DECOR_CATEGORIES.length;
  const totalDecorsCollected = collection.reduce((acc, curr) => acc + curr.collectedDecors.length, 0);
  const decorPercentage = Math.round((totalDecorsCollected / totalDecorsPossible) * 100) || 0;

  if (total === 0 && totalDecorsCollected === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 glass-panel rounded-3xl text-center">
        <p className="text-gray-400 font-medium text-lg">尚未收集任何皮克敏</p>
        <p className="text-sm text-gray-400 mt-2">快去增加你的收藏吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Decor Progress Section */}
        <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">飾品收藏進度</h3>
            <div className="flex items-end justify-between mb-3">
                <span className="text-5xl font-bold text-yellow-500 tracking-tighter">{totalDecorsCollected}</span>
                <span className="text-sm text-gray-500 mb-1.5 font-medium">/ {totalDecorsPossible} 可收集</span>
            </div>
            <div className="w-full bg-gray-200/50 rounded-full h-5 overflow-hidden shadow-inner">
                <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                    style={{ width: `${decorPercentage}%` }}
                ></div>
            </div>
            <p className="text-right text-xs text-gray-400 mt-2 font-medium tracking-wide">{decorPercentage}% 完成度</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribution Pie Chart */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">皮克敏種類分佈</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        stroke="none"
                        >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: '1px solid rgba(255,255,255,0.5)', 
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                background: 'rgba(255,255,255,0.9)',
                                padding: '8px 12px'
                            }}
                            itemStyle={{ color: '#374151', fontSize: '13px', fontWeight: 'bold' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quantity Bar Chart (Rankings) */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">數量排行</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#6b7280'}} interval={0} axisLine={false} tickLine={false}/>
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Detailed Stats Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">詳細統計數據</h3>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barSize={40}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                        <Tooltip 
                            cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'rgba(255,255,255,0.9)' }}
                            formatter={(value: number, name: string, props: any) => {
                                return [
                                    <span key="val" className="font-bold text-gray-800">
                                        {value} <span className="text-gray-500 font-normal text-xs ml-1">({props.payload.percentage}%)</span>
                                    </span>, 
                                    '數量'
                                ];
                            }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={1000}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList 
                                dataKey="percentage" 
                                position="top" 
                                formatter={(val: string) => `${val}%`} 
                                style={{ fill: '#6b7280', fontSize: '11px', fontWeight: 'bold' }} 
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

// Helper to map enum/class to hex for Recharts
function getHexColor(type: string): string {
  // Mapping based on Tailwind pastel colors defined in index.html
  switch (type) {
    case 'RED': return '#fca5a5';
    case 'BLUE': return '#93c5fd';
    case 'YELLOW': return '#fde047';
    case 'PURPLE': return '#d8b4fe';
    case 'WHITE': return '#f3f4f6'; 
    case 'ROCK': return '#a8a29e';
    case 'WINGED': return '#f9a8d4';
    case 'ICE': return '#67e8f9';
    default: return '#cccccc';
  }
}

export default StatsChart;