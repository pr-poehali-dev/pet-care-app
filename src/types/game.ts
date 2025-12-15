export type PetRarity = 'free' | 'common' | 'rare' | 'epic' | 'legendary';

export type Pet = {
  id: number;
  name: string;
  species: string;
  image: string;
  price: number;
  rarity: PetRarity;
  owned: boolean;
  level: number;
  xp: number;
  xpToNextLevel: number;
  health: number;
  hunger: number;
  activity: number;
  vitamins: number;
  happiness: number;
  isSick: boolean;
  sickness?: string;
  steps: number;
  isDead: boolean;
  boostLevel: number;
  equippedClothes?: number[];
  equippedToys?: number[];
};

export type ShopItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'medicine' | 'booster' | 'clothes' | 'toy' | 'food' | 'revive';
  icon: string;
  effect?: {
    health?: number;
    hunger?: number;
    happiness?: number;
    vitamins?: number;
    xpMultiplier?: number;
  };
  boostLevel?: number;
};

export type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  reward: number;
};

export type VetClinic = {
  id: number;
  name: string;
  level: number;
  unlocked: boolean;
  unlockCost: number;
  treatmentBonus: number;
  description: string;
};

export type Mission = {
  id: number;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'weekly';
  completed: boolean;
  progress: number;
  target: number;
};
