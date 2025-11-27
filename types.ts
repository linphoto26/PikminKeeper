export enum PikminColorType {
  RED = 'RED',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  PURPLE = 'PURPLE',
  WHITE = 'WHITE',
  ROCK = 'ROCK',
  WINGED = 'WINGED',
  ICE = 'ICE',
}

export interface PikminData {
  id: string;
  type: PikminColorType;
  name: string;
  description: string;
  baseColorClass: string;
  accentColorClass: string;
  imageUrl: string;
}

export interface DecorVariant {
    id: string; // e.g., 'shiny', '4leaf'
    name: string;
}

export interface DecorCategory {
  id: string;
  name: string;
  icon: string;
  variants?: DecorVariant[]; // For Rare/Shiny tracking
  categoryGroup?: string; // e.g., 'Food', 'Nature', 'City'
}

export interface CollectionItem extends PikminData {
  count: number;
  isFavorite: boolean;
  collectedDecors: string[]; // List of DecorCategory IDs (and variant IDs like 'restaurant_shiny')
  tags: string[]; // User custom tags
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}