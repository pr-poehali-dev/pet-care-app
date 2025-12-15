CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  telegram_id TEXT UNIQUE,
  stars INTEGER DEFAULT 1500,
  pet_slots INTEGER DEFAULT 1,
  pack_id TEXT,
  login_streak INTEGER DEFAULT 0,
  last_login BIGINT,
  perfect_streak INTEGER DEFAULT 0,
  card_linked BOOLEAN DEFAULT false,
  inventory_resources JSONB DEFAULT '{}',
  inventory_food INTEGER DEFAULT 0,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  pet_template_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  image TEXT NOT NULL,
  rarity TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  health INTEGER DEFAULT 100,
  lifespan INTEGER DEFAULT 100,
  hunger INTEGER DEFAULT 100,
  energy INTEGER DEFAULT 100,
  activity INTEGER DEFAULT 100,
  vitamins INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  is_sick BOOLEAN DEFAULT false,
  sickness TEXT,
  sickness_level INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  is_dead BOOLEAN DEFAULT false,
  boost_level INTEGER DEFAULT 0,
  last_fed BIGINT,
  last_visit BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  resting_until BIGINT,
  equipped_clothes JSONB DEFAULT '[]',
  equipped_toys JSONB DEFAULT '[]',
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS packs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  treasury INTEGER DEFAULT 0,
  continent TEXT,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS pack_members (
  pack_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  contribution INTEGER DEFAULT 0,
  joined_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  PRIMARY KEY (pack_id, user_id)
);

CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  buyer_id TEXT,
  item_type TEXT NOT NULL,
  item_id TEXT,
  item_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  price INTEGER NOT NULL,
  status TEXT DEFAULT 'open',
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  completed_at BIGINT
);

CREATE TABLE IF NOT EXISTS clinics (
  user_id TEXT NOT NULL,
  clinic_id INTEGER NOT NULL,
  unlocked BOOLEAN DEFAULT false,
  upgrades_foundation INTEGER DEFAULT 0,
  upgrades_walls INTEGER DEFAULT 0,
  upgrades_roof INTEGER DEFAULT 0,
  upgrades_equipment INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, clinic_id)
);

CREATE TABLE IF NOT EXISTS missions (
  user_id TEXT NOT NULL,
  mission_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  last_reset BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  PRIMARY KEY (user_id, mission_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT,
  telegram_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  completed_at BIGINT
);

CREATE TABLE IF NOT EXISTS daily_offers (
  user_id TEXT NOT NULL,
  offer_date DATE NOT NULL,
  offers JSONB NOT NULL,
  PRIMARY KEY (user_id, offer_date)
);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_seller ON trades(seller_id);
CREATE INDEX IF NOT EXISTS idx_pack_members_user ON pack_members(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
