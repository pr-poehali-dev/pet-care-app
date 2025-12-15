const API_BASE = 'https://functions.poehali.dev';

const ENDPOINTS = {
  auth: '2617f65f-ffb6-433b-ad2e-8c839b001667',
  pets: '5e26b78e-2b8d-4190-a78e-19b4500e6376',
  packs: '0819b091-124b-4da2-98fb-4a2b064aa250',
  trades: 'c624b38c-3e6d-4103-97be-01bd14923a81',
  payments: 'a6e9b254-522c-44db-80e2-f879b0881bbc',
};

export const api = {
  auth: {
    register: async (userId: string, username: string, telegramId?: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.auth}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', userId, username, telegramId }),
      });
      return res.json();
    },
    
    login: async (userId: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.auth}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', userId }),
      });
      return res.json();
    },
  },
  
  pets: {
    getAll: async (userId: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.pets}`, {
        headers: { 'X-User-Id': userId },
      });
      return res.json();
    },
    
    create: async (userId: string, pet: any) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.pets}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ pet }),
      });
      return res.json();
    },
    
    update: async (userId: string, petId: number, updates: any) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.pets}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ petId, updates }),
      });
      return res.json();
    },
  },
  
  packs: {
    get: async (userId: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.packs}`, {
        headers: { 'X-User-Id': userId },
      });
      return res.json();
    },
    
    create: async (userId: string, name: string, continent?: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.packs}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ action: 'create', name, continent }),
      });
      return res.json();
    },
    
    join: async (userId: string, packId: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.packs}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ action: 'join', packId }),
      });
      return res.json();
    },
    
    donate: async (userId: string, packId: string, amount: number, itemType: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.packs}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ action: 'donate', packId, amount, itemType }),
      });
      return res.json();
    },
  },
  
  trades: {
    getAll: async (userId: string, packId?: string) => {
      const url = packId 
        ? `${API_BASE}/${ENDPOINTS.trades}?packId=${packId}`
        : `${API_BASE}/${ENDPOINTS.trades}`;
      const res = await fetch(url, {
        headers: { 'X-User-Id': userId },
      });
      return res.json();
    },
    
    create: async (userId: string, itemType: string, itemId: string | undefined, itemName: string, amount: number, price: number) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.trades}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ action: 'create', itemType, itemId, itemName, amount, price }),
      });
      return res.json();
    },
    
    buy: async (userId: string, tradeId: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.trades}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ action: 'buy', tradeId }),
      });
      return res.json();
    },
  },
  
  payments: {
    createPayment: async (userId: string, amount: number, telegramId: string) => {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.payments}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ action: 'create_payment', amount, telegramId }),
      });
      return res.json();
    },
  },
};
