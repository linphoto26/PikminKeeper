import { PikminColorType, PikminData, DecorCategory } from './types';

export const PIKMIN_TYPES: PikminData[] = [
  {
    id: 'pikmin-red',
    type: PikminColorType.RED,
    name: '紅色皮克敏 (Red Pikmin)',
    description: '耐火，攻擊力強。有尖尖的鼻子。',
    baseColorClass: 'bg-pikmin-red',
    accentColorClass: 'text-red-500',
    imageUrl: 'https://ui-avatars.com/api/?name=Red&background=ef4444&color=fff&size=128&bold=true&font-size=0.6',
  },
  {
    id: 'pikmin-blue',
    type: PikminColorType.BLUE,
    name: '藍色皮克敏 (Blue Pikmin)',
    description: '能在水中行動，不會溺水。有嘴巴。',
    baseColorClass: 'bg-pikmin-blue',
    accentColorClass: 'text-blue-500',
    imageUrl: 'https://ui-avatars.com/api/?name=Blue&background=3b82f6&color=fff&size=128&bold=true&font-size=0.6',
  },
  {
    id: 'pikmin-yellow',
    type: PikminColorType.YELLOW,
    name: '黃色皮克敏 (Yellow Pikmin)',
    description: '耐電，被拋出時飛得比較高。有大耳朵。',
    baseColorClass: 'bg-pikmin-yellow',
    accentColorClass: 'text-yellow-600',
    imageUrl: 'https://ui-avatars.com/api/?name=Yellow&background=facc15&color=fff&size=128&bold=true&font-size=0.5',
  },
  {
    id: 'pikmin-purple',
    type: PikminColorType.PURPLE,
    name: '紫色皮克敏 (Purple Pikmin)',
    description: '力氣是其他的10倍，但動作緩慢。有鬍鬚。',
    baseColorClass: 'bg-pikmin-purple',
    accentColorClass: 'text-purple-500',
    imageUrl: 'https://ui-avatars.com/api/?name=Purple&background=9333ea&color=fff&size=128&bold=true&font-size=0.5',
  },
  {
    id: 'pikmin-white',
    type: PikminColorType.WHITE,
    name: '白色皮克敏 (White Pikmin)',
    description: '速度快，身體有毒，可以看到地下的東西。',
    baseColorClass: 'bg-pikmin-white',
    accentColorClass: 'text-gray-500',
    imageUrl: 'https://ui-avatars.com/api/?name=White&background=e5e7eb&color=4b5563&size=128&bold=true&font-size=0.5',
  },
  {
    id: 'pikmin-rock',
    type: PikminColorType.ROCK,
    name: '岩石皮克敏 (Rock Pikmin)',
    description: '身體堅硬，可以破壞水晶和玻璃。',
    baseColorClass: 'bg-pikmin-rock',
    accentColorClass: 'text-stone-600',
    imageUrl: 'https://ui-avatars.com/api/?name=Rock&background=57534e&color=fff&size=128&bold=true&font-size=0.5',
  },
  {
    id: 'pikmin-winged',
    type: PikminColorType.WINGED,
    name: '羽翅皮克敏 (Winged Pikmin)',
    description: '可以在空中飛行，搬運空中的物體。',
    baseColorClass: 'bg-pikmin-winged',
    accentColorClass: 'text-pink-500',
    imageUrl: 'https://ui-avatars.com/api/?name=Winged&background=f472b6&color=fff&size=128&bold=true&font-size=0.5',
  },
  {
    id: 'pikmin-ice',
    type: PikminColorType.ICE,
    name: '冰凍皮克敏 (Ice Pikmin)',
    description: '可以凍結敵人和水面。',
    baseColorClass: 'bg-pikmin-ice',
    accentColorClass: 'text-cyan-600',
    imageUrl: 'https://ui-avatars.com/api/?name=Ice&background=22d3ee&color=fff&size=128&bold=true&font-size=0.6',
  },
];

export const DECOR_CATEGORIES: DecorCategory[] = [
  // Food & Drink (餐飲美食)
  { 
    id: 'restaurant', 
    name: '餐廳 (Restaurant)', 
    icon: 'Utensils',
    variants: [{ id: 'shiny', name: '✨ 閃亮廚師帽 (Shiny)' }],
    categoryGroup: '餐飲美食 (Food)'
  },
  { id: 'cafe', name: '咖啡廳 (Cafe)', icon: 'Coffee', categoryGroup: '餐飲美食 (Food)' },
  { id: 'sweetshop', name: '甜點店 (Sweetshop)', icon: 'CakeSlice', categoryGroup: '餐飲美食 (Food)' },
  { id: 'burger', name: '漢堡店 (Burger)', icon: 'Sandwich', categoryGroup: '餐飲美食 (Food)' },
  { id: 'bakery', name: '麵包店 (Bakery)', icon: 'Croissant', categoryGroup: '餐飲美食 (Food)' },
  { id: 'pizza', name: '披薩 (Pizza)', icon: 'Pizza', categoryGroup: '餐飲美食 (Food)' },
  { id: 'sushi', name: '壽司 (Sushi)', icon: 'Fish', categoryGroup: '餐飲美食 (Food)' },
  { id: 'ramen', name: '拉麵 (Ramen)', icon: 'Soup', categoryGroup: '餐飲美食 (Food)' },
  { id: 'curry', name: '咖哩 (Curry)', icon: 'CookingPot', categoryGroup: '餐飲美食 (Food)' },
  { id: 'ice_cream', name: '冰淇淋 (Ice Cream)', icon: 'Popsicle', categoryGroup: '餐飲美食 (Food)' },
  { id: 'donut', name: '甜甜圈 (Donut)', icon: 'CircleDot', categoryGroup: '餐飲美食 (Food)' },
  { id: 'macaron', name: '馬卡龍 (Macaron)', icon: 'Circle', categoryGroup: '餐飲美食 (Food)' },

  // City Life (城市與生活)
  { id: 'movie', name: '電影院 (Movie)', icon: 'Film', categoryGroup: '城市設施 (City)' },
  { id: 'pharmacy', name: '藥局 (Pharmacy)', icon: 'Pill', categoryGroup: '城市設施 (City)' },
  { id: 'post_office', name: '郵局 (Post Office)', icon: 'Mail', categoryGroup: '城市設施 (City)' },
  { id: 'art_gallery', name: '美術館 (Art Gallery)', icon: 'Palette', categoryGroup: '城市設施 (City)' },
  { id: 'library', name: '圖書館/書店 (Library)', icon: 'Book', categoryGroup: '城市設施 (City)' },
  { id: 'theme_park', name: '主題樂園 (Theme Park)', icon: 'FerrisWheel', categoryGroup: '城市設施 (City)' },
  { id: 'stadium', name: '體育場 (Stadium)', icon: 'Trophy', categoryGroup: '城市設施 (City)' },
  { id: 'hotel', name: '飯店 (Hotel)', icon: 'BedDouble', categoryGroup: '城市設施 (City)' },
  { id: 'shrine', name: '神社/寺廟 (Shrine)', icon: 'Landmark', categoryGroup: '城市設施 (City)' },
  
  // Shopping (購物)
  { id: 'corner_store', name: '便利商店 (Store)', icon: 'Store', categoryGroup: '購物 (Shopping)' },
  { id: 'supermarket', name: '超市 (Supermarket)', icon: 'ShoppingBasket', categoryGroup: '購物 (Shopping)' },
  { id: 'salon', name: '理髮廳 (Salon)', icon: 'Scissors', categoryGroup: '購物 (Shopping)' },
  { id: 'clothing', name: '服飾店 (Clothing)', icon: 'Shirt', categoryGroup: '購物 (Shopping)' },
  { id: 'makeup', name: '美妝 (Makeup)', icon: 'Gem', categoryGroup: '購物 (Shopping)' },
  { id: 'appliance', name: '電器行 (Appliance)', icon: 'Tv', categoryGroup: '購物 (Shopping)' },

  // Outdoors & Nature (戶外與自然)
  { id: 'zoo', name: '動物園 (Zoo)', icon: 'PawPrint', categoryGroup: '戶外與自然 (Nature)' },
  { id: 'forest', name: '森林 (Forest)', icon: 'Trees', categoryGroup: '戶外與自然 (Nature)' },
  { id: 'waterside', name: '水邊 (Waterside)', icon: 'Waves', categoryGroup: '戶外與自然 (Nature)' },
  { id: 'beach', name: '海灘 (Beach)', icon: 'Umbrella', categoryGroup: '戶外與自然 (Nature)' },
  { id: 'mountain', name: '山 (Mountain)', icon: 'Mountain', categoryGroup: '戶外與自然 (Nature)' },
  { id: 'weather', name: '天氣 (Weather)', icon: 'CloudRain', categoryGroup: '戶外與自然 (Nature)' },
  { 
    id: 'park', 
    name: '公園 (Park)', 
    icon: 'Shrub',
    variants: [{ id: '4leaf', name: '🍀 四葉草 (4-Leaf)' }],
    categoryGroup: '戶外與自然 (Nature)'
  },

  // Transport & Travel (交通)
  { id: 'airport', name: '機場 (Airport)', icon: 'Plane', categoryGroup: '交通與旅遊 (Travel)' },
  { id: 'station', name: '車站 (Station)', icon: 'Train', categoryGroup: '交通與旅遊 (Travel)' },
  { id: 'bus_stop', name: '公車站 (Bus Stop)', icon: 'Bus', categoryGroup: '交通與旅遊 (Travel)' },
  { id: 'bridge', name: '橋樑 (Bridge)', icon: 'Waypoints', categoryGroup: '交通與旅遊 (Travel)' },
  { id: 'roadside', name: '路邊 (Roadside)', icon: 'MapPin', categoryGroup: '交通與旅遊 (Travel)' },
];

// Special Event Presets for the modal
export const EVENT_PRESETS = [
  '2024 萬聖節 (Halloween)',
  '2024 花牌 (Hanafuda)',
  '麻將 (Mahjong)',
  '手指滑板 (Fingerboard)',
  '起司 (Cheese)',
  '拼圖 (Puzzle)',
  '復活節 (Easter)',
  '農曆新年 (Lunar New Year)',
  '情人節 (Valentine)',
  '賞月 (Moon Viewing)',
];

export const STORAGE_KEY = 'pikmin-collection-v1';

// Mushroom Battle Constants
export const MUSHROOM_COLORS = [
  { id: 'RED', name: '紅色蘑菇', colorClass: 'bg-red-500' },
  { id: 'BLUE', name: '藍色蘑菇', colorClass: 'bg-blue-500' },
  { id: 'YELLOW', name: '黃色蘑菇', colorClass: 'bg-yellow-400' },
  { id: 'PURPLE', name: '紫色蘑菇', colorClass: 'bg-purple-600' },
  { id: 'WHITE', name: '白色蘑菇', colorClass: 'bg-gray-200' },
  { id: 'PINK', name: '粉紅(羽翅)蘑菇', colorClass: 'bg-pink-400' },
  { id: 'GRAY', name: '灰色(岩石)蘑菇', colorClass: 'bg-stone-600' },
  { id: 'CYAN', name: '冰凍蘑菇', colorClass: 'bg-cyan-400' },
];

// Base attack power (simplified approximation based on Wiki)
export const BASE_ATTACK_POWER: Record<PikminColorType, number> = {
  [PikminColorType.RED]: 4,
  [PikminColorType.BLUE]: 4,
  [PikminColorType.YELLOW]: 4,
  [PikminColorType.WHITE]: 3, 
  [PikminColorType.WINGED]: 3, 
  [PikminColorType.PURPLE]: 6, 
  [PikminColorType.ROCK]: 5,   
  [PikminColorType.ICE]: 4,
};

// Step Planner Data
export const SEEDLING_TYPES = [
  { id: 'red', name: '紅色花苗 (1,000)', steps: 1000, color: 'bg-red-500' },
  { id: 'yellow', name: '黃色花苗 (1,000)', steps: 1000, color: 'bg-yellow-400' },
  { id: 'blue', name: '藍色花苗 (1,000)', steps: 1000, color: 'bg-blue-500' },
  { id: 'purple', name: '紫色花苗 (3,000)', steps: 3000, color: 'bg-purple-600' },
  { id: 'white', name: '白色花苗 (3,000)', steps: 3000, color: 'bg-gray-200' },
  { id: 'winged', name: '羽翅花苗 (5,000)', steps: 5000, color: 'bg-pink-400' },
  { id: 'rock', name: '岩石花苗 (5,000)', steps: 5000, color: 'bg-stone-600' },
  { id: 'huge', name: '巨大花苗 (10,000)', steps: 10000, color: 'bg-green-500' },
  { id: 'gold', name: '金色花苗 (100)', steps: 100, color: 'bg-yellow-200' },
];