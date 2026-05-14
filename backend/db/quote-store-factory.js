import pg from "pg";
import { createQuoteStore } from "./quote-store.js";
import { createPgQuoteStore } from "./quote-store-pg.js";

export function createStoreFromEnv(initialQuotes = []) {
  if (process.env.DATABASE_URL) {
    return createPgQuoteStore(new pg.Pool({ connectionString: process.env.DATABASE_URL }));
  }
  return createQuoteStore(initialQuotes);
}
