-- Crea la tabella events su Supabase
-- Esegui questo SQL nel SQL Editor di Supabase

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT DEFAULT 'default',
  month INTEGER NOT NULL,
  start_day INTEGER NOT NULL,
  end_day INTEGER NOT NULL,
  category_id TEXT NOT NULL,
  subtype_id TEXT NOT NULL,
  subtype_name TEXT NOT NULL,
  text TEXT NOT NULL,
  amount DECIMAL(10, 2),
  time_slot TEXT,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice per query veloci
CREATE INDEX IF NOT EXISTS idx_events_user_month ON events(user_id, month);

-- Row Level Security (opzionale, per multi-utente futuro)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy per permettere tutte le operazioni (per ora senza autenticazione)
CREATE POLICY "Allow all operations" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);
