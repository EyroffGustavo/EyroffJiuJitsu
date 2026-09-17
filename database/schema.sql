CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age BETWEEN 3 AND 100),
  interest VARCHAR(40) NOT NULL CHECK (interest IN ('Jiu Jitsu Adulto', 'Jiu Jitsu Kids')),
  phone VARCHAR(20) NOT NULL,
  instagram VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  interest VARCHAR(40) NOT NULL CHECK (interest IN ('Jiu Jitsu Adulto', 'Jiu Jitsu Kids')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 500),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS feedbacks_published_created_at_idx ON feedbacks (published, created_at DESC);
