import { QuoteNotFoundError } from "../quote.js";

export function createPgQuoteStore(pool) {
  return {
    async initialize() {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS quotes (
          id         SERIAL PRIMARY KEY,
          quote      TEXT NOT NULL,
          author     VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`
      );
    },
    async getRandomQuote() {
      const result = await pool.query(
        "SELECT quote, author FROM quotes ORDER BY RANDOM() LIMIT 1"
      );
      if (result.rows.length === 0) throw new QuoteNotFoundError();
      return result.rows[0];
    },
    async addQuote({ quote, author }) {
      await pool.query(
        "INSERT INTO quotes (quote, author) VALUES ($1, $2)",
        [quote, author]
      );
    },
  };
}
