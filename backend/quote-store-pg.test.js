import { describe, it, expect, beforeEach, afterAll } from "vitest";
import pg from "pg";
import { createPgQuoteStore } from "./quote-store-pg.js";

const { Pool } = pg;

const skip = !process.env.TEST_DATABASE_URL;

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
});
