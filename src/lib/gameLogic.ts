import { Pet, Resource, ResourceRarity } from '@/types/game';

export const HOUR_MS = 1000 * 60 * 60;
export const DAY_MS = HOUR_MS * 24;
export const REST_DURATION = HOUR_MS * 6;

export const checkPetStatus = (pet: Pet): Pet => {
  const now = Date.now();
  const lastVisit = pet.lastVisit || now;
  const daysMissed = Math.floor((now - lastVisit) / DAY_MS);
  
  const updates: Partial<Pet> = { lastVisit: now };
  
  if (daysMissed >= 3) {
    const hungerLoss = Math.min(100, daysMissed * 10);
    const newHunger = Math.max(0, pet.hunger - hungerLoss);
    updates.hunger = newHunger;
    
    if (newHunger <= 30) {
      const sicknessLevel = Math.min(5, Math.floor((100 - newHunger) / 20));
      updates.isSick = true;
      updates.sicknessLevel = sicknessLevel;
      updates.sickness = getSicknessName(sicknessLevel);
      
      const healthLoss = sicknessLevel * 15;
      updates.health = Math.max(0, pet.health - healthLoss);
      
      if (updates.health === 0) {
        updates.isDead = true;
      }
    }
  }
  
  if (pet.restingUntil && now >= pet.restingUntil) {
    updates.energy = 100;
    updates.restingUntil = undefined;
  }
  
  return { ...pet, ...updates };
};

const getSicknessName = (level: number): string => {
  const sicknesses = [
    'Легкое недомогание',
    'Простуда',
    'Инфекция',
    'Тяжелая болезнь',
    'Критическое состояние'
  ];
  return sicknesses[Math.min(level - 1, sicknesses.length - 1)];
};

export const canPerformAction = (pet: Pet, energyCost: number): boolean => {
  if (pet.isDead) return false;
  if (pet.restingUntil && Date.now() < pet.restingUntil) return false;
  return pet.energy >= energyCost;
};

export const consumeEnergy = (pet: Pet, amount: number): Pet => {
  return { ...pet, energy: Math.max(0, pet.energy - amount) };
};

export const startRest = (pet: Pet): Pet => {
  return { ...pet, restingUntil: Date.now() + REST_DURATION };
};

export const buyEnergy = (pet: Pet, amount: number): Pet => {
  return { ...pet, energy: Math.min(100, pet.energy + amount) };
};

export const RESOURCES: Resource[] = [
  { id: 'foundation_common', name: 'Простой фундамент', type: 'foundation', rarity: 'common', icon: 'Square' },
  { id: 'foundation_medium', name: 'Средний фундамент', type: 'foundation', rarity: 'medium', icon: 'Square' },
  { id: 'foundation_rare', name: 'Редкий фундамент', type: 'foundation', rarity: 'rare', icon: 'Square' },
  
  { id: 'wall_common', name: 'Простая стена', type: 'wall', rarity: 'common', icon: 'Building' },
  { id: 'wall_medium', name: 'Средняя стена', type: 'wall', rarity: 'medium', icon: 'Building' },
  { id: 'wall_rare', name: 'Редкая стена', type: 'wall', rarity: 'rare', icon: 'Building' },
  
  { id: 'roof_common', name: 'Простая крыша', type: 'roof', rarity: 'common', icon: 'Home' },
  { id: 'roof_medium', name: 'Средняя крыша', type: 'roof', rarity: 'medium', icon: 'Home' },
  { id: 'roof_rare', name: 'Редкая крыша', type: 'roof', rarity: 'rare', icon: 'Home' },
  
  { id: 'equipment_common', name: 'Простое оборудование', type: 'equipment', rarity: 'common', icon: 'Wrench' },
  { id: 'equipment_medium', name: 'Среднее оборудование', type: 'equipment', rarity: 'medium', icon: 'Wrench' },
  { id: 'equipment_rare', name: 'Редкое оборудование', type: 'equipment', rarity: 'rare', icon: 'Wrench' },
];

export const getResourceDropRate = (rarity: ResourceRarity): number => {
  switch (rarity) {
    case 'common': return 0.6;
    case 'medium': return 0.3;
    case 'rare': return 0.1;
    default: return 0;
  }
};

export const getRandomResource = (): Resource => {
  const rand = Math.random();
  let rarity: ResourceRarity;
  
  if (rand < 0.6) rarity = 'common';
  else if (rand < 0.9) rarity = 'medium';
  else rarity = 'rare';
  
  const resourcesOfRarity = RESOURCES.filter(r => r.rarity === rarity);
  return resourcesOfRarity[Math.floor(Math.random() * resourcesOfRarity.length)];
};

export const RESOURCE_TO_FOOD_RATE = {
  common: 100,
  medium: 70,
  rare: 50,
};

export const exchangeResourceForFood = (rarity: ResourceRarity, amount: number): number => {
  return Math.floor(amount / RESOURCE_TO_FOOD_RATE[rarity]);
};

export const getDailyLoginBonus = (streak: number): { food: number; resources: Resource[] } => {
  const food = Math.min(10 + streak, 50);
  const resourceCount = Math.min(2 + Math.floor(streak / 7), 10);
  
  const resources: Resource[] = [];
  for (let i = 0; i < resourceCount; i++) {
    const rarityRoll = Math.random();
    const rarity: ResourceRarity = rarityRoll < 0.7 ? 'common' : 'medium';
    const resourcesOfRarity = RESOURCES.filter(r => r.rarity === rarity);
    resources.push(resourcesOfRarity[Math.floor(Math.random() * resourcesOfRarity.length)]);
  }
  
  return { food, resources };
};

export const PET_SLOT_PRICES = [
  { slots: 1, price: 0 },
  { slots: 2, price: 1000 },
  { slots: 3, price: 5000 },
  { slots: 4, price: 20000 },
  { slots: 5, price: 50000 },
];

export const ELITE_PETS = [
  { id: 14, name: 'Алмазный волк', species: 'Элитный волк', rarity: 'elite', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg' },
  { id: 15, name: 'Золотой дракон', species: 'Элитный дракон', rarity: 'elite', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/af9f6f8f-b625-46b3-a6ab-462cab1f8932.jpg' },
  { id: 16, name: 'Королевский лев', species: 'Элитный лев', rarity: 'elite', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg' },
];

export const checkEliteReward = (perfectStreak: number): boolean => {
  return perfectStreak >= 30;
};

export const TRADE_COMMISSION_RATE = 0.3;

export const calculateTradeCommission = (price: number): number => {
  return Math.floor(price * TRADE_COMMISSION_RATE);
};
