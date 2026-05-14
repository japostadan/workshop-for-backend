CREATE TABLE quotes (
  id         SERIAL PRIMARY KEY,
  quote      TEXT NOT NULL,
  author     VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
