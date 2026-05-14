import { describe, it, expect, beforeEach, afterAll, afterEach } from "vitest";
import pg from "pg";
import { createPgQuoteStore } from "../../db/quote-store-pg.js";
import { QuoteNotFoundError } from "../../quote.js";

const { Pool } = pg;

const skip = !process.env.TEST_DATABASE_URL;

describe.skipIf(skip)("createPgQuoteStore.initialize", () => {
  let pool;
  let store;

  beforeEach(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await pool.query("DROP TABLE IF EXISTS quotes");
    store = createPgQuoteStore(pool);
  });

  afterEach(async () => {
    await pool?.query(
      `CREATE TABLE IF NOT EXISTS quotes (
        id         SERIAL PRIMARY KEY,
        quote      TEXT NOT NULL,
        author     VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`
    );
    await pool?.end();
  });

  it("creates the quotes table so the store is usable", async () => {
    await store.initialize();
    await expect(store.getRandomQuote()).rejects.toThrow(QuoteNotFoundError);
  });

  it("is idempotent — calling initialize twice does not throw", async () => {
    await store.initialize();
    await expect(store.initialize()).resolves.not.toThrow();
  });
});

describe.skipIf(skip)("createPgQuoteStore", () => {
  let pool;
  let store;

  beforeEach(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await pool.query("TRUNCATE quotes RESTART IDENTITY");
    store = createPgQuoteStore(pool);
  });

  afterAll(async () => {
    await pool?.end();
  });

  it("getRandomQuote returns a quote that was inserted", async () => {
    await pool.query(
      "INSERT INTO quotes (quote, author) VALUES ($1, $2)",
      ["Hello", "World"]
    );
    const result = await store.getRandomQuote();
    expect(result).toEqual({ quote: "Hello", author: "World" });
  });

  it("addQuote makes the quote retrievable via getRandomQuote", async () => {
    await store.addQuote({ quote: "Test quote", author: "Test author" });
    const result = await store.getRandomQuote();
    expect(result).toEqual({ quote: "Test quote", author: "Test author" });
  });

  it("getRandomQuote throws QuoteNotFoundError when table is empty", async () => {
    await expect(store.getRandomQuote()).rejects.toThrow(QuoteNotFoundError);
  });
});
