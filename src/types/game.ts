export type PetRarity = 'free' | 'common' | 'rare' | 'epic' | 'legendary' | 'elite';

export type ResourceRarity = 'common' | 'medium' | 'rare';

export type ResourceType = 'foundation' | 'wall' | 'roof' | 'equipment';

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  rarity: ResourceRarity;
  icon: string;
};

export type ClinicUpgrade = {
  foundation: number;
  walls: number;
  roof: number;
  equipment: number;
};

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
  lifespan: number;
  hunger: number;
  energy: number;
  activity: number;
  vitamins: number;
  happiness: number;
  isSick: boolean;
  sickness?: string;
  sicknessLevel: number;
  steps: number;
  isDead: boolean;
  boostLevel: number;
  equippedClothes?: number[];
  equippedToys?: number[];
  lastFed?: number;
  lastVisit?: number;
  restingUntil?: number;
};

export type ShopItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'medicine' | 'booster' | 'clothes' | 'toy' | 'food' | 'revive' | 'energy' | 'resource';
  icon: string;
  effect?: {
    health?: number;
    hunger?: number;
    happiness?: number;
    vitamins?: number;
    energy?: number;
    xpMultiplier?: number;
  };
  boostLevel?: number;
  resource?: Resource;
  amount?: number;
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
  upgrades: ClinicUpgrade;
  requiredUpgrades: ClinicUpgrade;
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

export type DailyOffer = {
  id: number;
  item: ShopItem;
  discount: number;
  expiresAt: number;
};

export type PackMember = {
  id: string;
  username: string;
  level: number;
  contribution: number;
};

export type Pack = {
  id: string;
  name: string;
  creatorId: string;
  members: PackMember[];
  treasury: number;
  continent?: string;
  createdAt: number;
};

export type Trade = {
  id: string;
  sellerId: string;
  sellerName: string;
  buyerId?: string;
  itemType: 'resource' | 'food';
  itemId?: string;
  itemName: string;
  amount: number;
  price: number;
  status: 'open' | 'completed' | 'cancelled';
  createdAt: number;
};

export type User = {
  id: string;
  username: string;
  stars: number;
  pets: Pet[];
  inventory: {
    resources: { [key: string]: number };
    food: number;
  };
  petSlots: number;
  packId?: string;
  loginStreak: number;
  lastLogin?: number;
  perfectStreak: number;
  telegramId?: string;
  cardLinked: boolean;
};

export type EliteReward = {
  petId: number;
  unlockedAt?: number;
};

export type PaymentMethod = 'telegram' | 'mir' | 'visa' | 'mastercard';