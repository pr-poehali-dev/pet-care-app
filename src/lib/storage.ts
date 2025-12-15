export const storage = {
  getUserId: (): string => {
    let userId = localStorage.getItem('petlife_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('petlife_user_id', userId);
    }
    return userId;
  },
  
  getUsername: (): string => {
    return localStorage.getItem('petlife_username') || 'Игрок';
  },
  
  setUsername: (username: string) => {
    localStorage.setItem('petlife_username', username);
  },
  
  getTelegramId: (): string | null => {
    return localStorage.getItem('petlife_telegram_id');
  },
  
  setTelegramId: (telegramId: string) => {
    localStorage.setItem('petlife_telegram_id', telegramId);
  },
  
  getStars: (): number => {
    return parseInt(localStorage.getItem('petlife_stars') || '1500');
  },
  
  setStars: (stars: number) => {
    localStorage.setItem('petlife_stars', stars.toString());
  },
  
  getPetSlots: (): number => {
    return parseInt(localStorage.getItem('petlife_pet_slots') || '1');
  },
  
  setPetSlots: (slots: number) => {
    localStorage.setItem('petlife_pet_slots', slots.toString());
  },
  
  getInventory: () => {
    const inv = localStorage.getItem('petlife_inventory');
    return inv ? JSON.parse(inv) : { resources: {}, food: 0 };
  },
  
  setInventory: (inventory: any) => {
    localStorage.setItem('petlife_inventory', JSON.stringify(inventory));
  },
  
  getLoginStreak: (): number => {
    return parseInt(localStorage.getItem('petlife_login_streak') || '0');
  },
  
  setLoginStreak: (streak: number) => {
    localStorage.setItem('petlife_login_streak', streak.toString());
  },
  
  getLastLogin: (): number => {
    return parseInt(localStorage.getItem('petlife_last_login') || '0');
  },
  
  setLastLogin: (timestamp: number) => {
    localStorage.setItem('petlife_last_login', timestamp.toString());
  },
  
  getPerfectStreak: (): number => {
    return parseInt(localStorage.getItem('petlife_perfect_streak') || '0');
  },
  
  setPerfectStreak: (streak: number) => {
    localStorage.setItem('petlife_perfect_streak', streak.toString());
  },
};
