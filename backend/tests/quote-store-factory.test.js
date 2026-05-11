import { describe, it, expect } from "vitest";
import { createStoreFromEnv } from "../quote-store-factory.js";

describe("createStoreFromEnv", () => {
  it("returns an in-memory store when DATABASE_URL is not set", async () => {
    delete process.env.DATABASE_URL;
    const store = createStoreFromEnv([{ quote: "Test", author: "Tester" }]);
    const quote = await store.getRandomQuote();
    expect(quote).toEqual({ quote: "Test", author: "Tester" });
  });

  it("seeds the in-memory store with provided initial quotes", async () => {
    delete process.env.DATABASE_URL;
    const store = createStoreFromEnv([
      { quote: "A", author: "One" },
      { quote: "B", author: "Two" },
    ]);
    const quote = await store.getRandomQuote();
    expect(["A", "B"]).toContain(quote.quote);
  });
});
