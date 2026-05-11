import { QuoteNotFoundError } from "./quote.js";

export function createPgQuoteStore(pool) {
  return {
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
