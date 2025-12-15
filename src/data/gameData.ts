import { Pet, ShopItem, VetClinic, Mission } from '@/types/game';

export const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

export const INITIAL_PETS: Pet[] = [
  { id: 1, name: 'Рекс', species: 'Золотистый ретривер', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 0, rarity: 'free', owned: true, level: 1, xp: 0, xpToNextLevel: 100, health: 85, lifespan: 100, hunger: 60, energy: 100, activity: 40, vitamins: 70, happiness: 75, isSick: false, sicknessLevel: 0, steps: 0, isDead: false, boostLevel: 0, lastVisit: Date.now() },
  { id: 2, name: 'Мурзик', species: 'Рыжий кот', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 0, rarity: 'free', owned: true, level: 1, xp: 0, xpToNextLevel: 100, health: 90, lifespan: 100, hunger: 75, energy: 100, activity: 55, vitamins: 65, happiness: 80, isSick: false, sicknessLevel: 0, steps: 0, isDead: false, boostLevel: 0, lastVisit: Date.now() },
  { id: 3, name: 'Хома', species: 'Сирийский хомяк', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/cd99cfa0-476f-4645-a753-2f565a31f812.jpg', price: 0, rarity: 'free', owned: true, level: 1, xp: 0, xpToNextLevel: 100, health: 95, lifespan: 100, hunger: 80, energy: 100, activity: 70, vitamins: 80, happiness: 85, isSick: false, sicknessLevel: 0, steps: 0, isDead: false, boostLevel: 0, lastVisit: Date.now() },
  { id: 4, name: 'Барсик', species: 'Британская кошка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 50, rarity: 'common', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, lifespan: 100, hunger: 100, energy: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, sicknessLevel: 0, steps: 0, isDead: false, boostLevel: 0 },
  { id: 5, name: 'Джек', species: 'Джек рассел терьер', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 100, rarity: 'common', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 6, name: 'Кеша', species: 'Попугай ара', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/af9f6f8f-b625-46b3-a6ab-462cab1f8932.jpg', price: 150, rarity: 'rare', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 7, name: 'Снежок', species: 'Ангорский кролик', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/cd99cfa0-476f-4645-a753-2f565a31f812.jpg', price: 200, rarity: 'rare', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 8, name: 'Тортилла', species: 'Красноухая черепаха', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/480b00cd-7c57-41ff-a9e9-90e208f33218.jpg', price: 300, rarity: 'rare', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 9, name: 'Буся', species: 'Персидская кошка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 450, rarity: 'epic', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 10, name: 'Тайсон', species: 'Немецкая овчарка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 600, rarity: 'epic', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 11, name: 'Пушок', species: 'Морская свинка', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/18ddaa8b-c153-4311-a75b-280126c57312.jpg', price: 750, rarity: 'epic', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 12, name: 'Фокс', species: 'Померанский шпиц', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/834528d6-a6bf-4b95-aae3-f3d7d91cd58f.jpg', price: 900, rarity: 'legendary', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
  { id: 13, name: 'Симба', species: 'Мейн-кун', image: 'https://cdn.poehali.dev/projects/ce8dc110-3266-4218-a618-5d84eb90d8e4/files/10550fcc-179b-4a82-b1f4-e2631d5b693a.jpg', price: 1000, rarity: 'legendary', owned: false, level: 1, xp: 0, xpToNextLevel: 100, health: 100, hunger: 100, activity: 100, vitamins: 100, happiness: 100, isSick: false, steps: 0, isDead: false, boostLevel: 0 },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 1, name: 'Витамины', description: 'Базовый комплекс витаминов', price: 10, type: 'medicine', icon: 'Pill', effect: { vitamins: 20, health: 5 } },
  { id: 2, name: 'Премиум витамины', description: 'Улучшенный комплекс витаминов', price: 25, type: 'medicine', icon: 'Pill', effect: { vitamins: 40, health: 15 } },
  { id: 3, name: 'Препарат от паразитов', description: 'Базовое средство от паразитов', price: 10, type: 'medicine', icon: 'Bug', effect: { health: 15 } },
  { id: 4, name: 'Комплексное лечение', description: 'Препарат + витамины', price: 30, type: 'medicine', icon: 'Package', effect: { health: 30, vitamins: 20 } },
  { id: 5, name: 'Прививка возрождения', description: 'Оживляет питомца', price: 100, type: 'revive', icon: 'Heart' },
  { id: 6, name: 'Ускоритель x1', description: '+10 XP за действие', price: 20, type: 'booster', icon: 'Zap', boostLevel: 1, effect: { xpMultiplier: 10 } },
  { id: 7, name: 'Ускоритель x2', description: '+20 XP за действие', price: 40, type: 'booster', icon: 'Zap', boostLevel: 2, effect: { xpMultiplier: 20 } },
  { id: 8, name: 'Ускоритель x3', description: '+30 XP за действие', price: 60, type: 'booster', icon: 'Zap', boostLevel: 3, effect: { xpMultiplier: 30 } },
  { id: 9, name: 'Ускоритель x4', description: '+40 XP за действие', price: 80, type: 'booster', icon: 'Zap', boostLevel: 4, effect: { xpMultiplier: 40 } },
  { id: 10, name: 'Ускоритель x5', description: '+50 XP за действие', price: 100, type: 'booster', icon: 'Zap', boostLevel: 5, effect: { xpMultiplier: 50 } },
  { id: 11, name: 'Ускоритель x6', description: '+60 XP за действие', price: 150, type: 'booster', icon: 'Zap', boostLevel: 6, effect: { xpMultiplier: 60 } },
  { id: 12, name: 'Ускоритель x7', description: '+70 XP за действие', price: 200, type: 'booster', icon: 'Zap', boostLevel: 7, effect: { xpMultiplier: 70 } },
  { id: 13, name: 'Ускоритель x8', description: '+80 XP за действие', price: 300, type: 'booster', icon: 'Zap', boostLevel: 8, effect: { xpMultiplier: 80 } },
  { id: 14, name: 'Ускоритель x9', description: '+90 XP за действие', price: 400, type: 'booster', icon: 'Zap', boostLevel: 9, effect: { xpMultiplier: 90 } },
  { id: 15, name: 'Ускоритель x10', description: '+100 XP за действие', price: 500, type: 'booster', icon: 'Zap', boostLevel: 10, effect: { xpMultiplier: 100 } },
  { id: 16, name: 'Красная бандана', description: 'Стильная бандана для питомца', price: 50, type: 'clothes', icon: 'Shirt', effect: { happiness: 10 } },
  { id: 17, name: 'Зимняя куртка', description: 'Тёплая куртка', price: 80, type: 'clothes', icon: 'Shirt', effect: { happiness: 15, health: 5 } },
  { id: 18, name: 'Королевская корона', description: 'Для настоящих королей', price: 200, type: 'clothes', icon: 'Crown', effect: { happiness: 30 } },
  { id: 19, name: 'Мячик', description: 'Игрушка для активных игр', price: 15, type: 'toy', icon: 'Circle', effect: { happiness: 10 } },
  { id: 20, name: 'Плюшевый мишка', description: 'Мягкая игрушка', price: 30, type: 'toy', icon: 'ToyBrick', effect: { happiness: 15 } },
  { id: 21, name: 'Лежанка премиум', description: 'Комфортная лежанка', price: 100, type: 'toy', icon: 'Bed', effect: { happiness: 20, health: 10 } },
  { id: 22, name: 'Деликатес', description: 'Вкусное лакомство', price: 20, type: 'food', icon: 'Cookie', effect: { hunger: 30, happiness: 15 } },
];

export const VET_CLINICS: VetClinic[] = [
  { id: 1, name: 'Городская ветклиника', level: 1, unlocked: true, unlockCost: 0, treatmentBonus: 1.0, description: 'Базовое лечение' },
  { id: 2, name: 'Клиника "Здоровье+"', level: 2, unlocked: false, unlockCost: 100, treatmentBonus: 1.25, description: '+25% к эффекту лечения' },
  { id: 3, name: 'Премиум центр', level: 3, unlocked: false, unlockCost: 300, treatmentBonus: 1.5, description: '+50% к эффекту лечения' },
  { id: 4, name: 'Элитная клиника', level: 4, unlocked: false, unlockCost: 600, treatmentBonus: 2.0, description: 'x2 к эффекту лечения' },
];

export const INITIAL_MISSIONS: Mission[] = [
  { id: 1, title: 'Первые шаги', description: 'Пройди 500 шагов', reward: 20, type: 'daily', completed: false, progress: 0, target: 500 },
  { id: 2, title: 'Заботливый хозяин', description: 'Покорми питомца 3 раза', reward: 15, type: 'daily', completed: false, progress: 0, target: 3 },
  { id: 3, title: 'Здоровье важно', description: 'Дай витамины 2 раза', reward: 25, type: 'daily', completed: false, progress: 0, target: 2 },
  { id: 4, title: 'Марафон недели', description: 'Пройди 5000 шагов за неделю', reward: 100, type: 'weekly', completed: false, progress: 0, target: 5000 },
  { id: 5, title: 'Коллекционер', description: 'Собери 5 питомцев', reward: 150, type: 'weekly', completed: false, progress: 0, target: 5 },
];

export const TUTORIAL_TIPS = [
  { level: 1, tip: '🐾 Добро пожаловать! Знакомься со своим первым питомцем. Следи за его характеристиками!' },
  { level: 2, tip: '🍖 Не забывай кормить питомца! Сытость важна для здоровья.' },
  { level: 3, tip: '🚶 Гуляй с питомцем — это даёт активность и шаги для прогресса!' },
  { level: 4, tip: '💊 Давай витамины регулярно, чтобы питомец не заболел.' },
  { level: 5, tip: '⚡ Купи ускоритель роста в магазине, чтобы быстрее получать опыт!' },
  { level: 6, tip: '🏥 Разблокируй лучшие ветклиники для эффективного лечения.' },
  { level: 7, tip: '🎯 Выполняй ежедневные задания, чтобы получать звёзды!' },
  { level: 8, tip: '👕 Одевай питомца — это повышает счастье и даёт бонусы!' },
  { level: 9, tip: '🎮 Игрушки делают питомца счастливее. Купи их в магазине!' },
  { level: 10, tip: '🏆 Ты освоил основы! Теперь ты сам эксперт по уходу за питомцами!' },
];