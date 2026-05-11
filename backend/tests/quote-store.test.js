import { describe, it, expect } from "vitest";
import { createQuoteStore } from "../quote-store.js";
import { QuoteNotFoundError } from "../quote.js";

describe("createQuoteStore", () => {
  it("getRandomQuote returns a quote from the initial set", () => {
    const store = createQuoteStore([{ quote: "Hello", author: "World" }]);
    expect(store.getRandomQuote()).toEqual({ quote: "Hello", author: "World" });
  });

  it("addQuote makes the quote retrievable via getRandomQuote", () => {
    const store = createQuoteStore([]);
    store.addQuote({ quote: "Test quote", author: "Test author" });
    expect(store.getRandomQuote()).toEqual({ quote: "Test quote", author: "Test author" });
  });

  it("getRandomQuote throws QuoteNotFoundError when store is empty", () => {
    const store = createQuoteStore([]);
    expect(() => store.getRandomQuote()).toThrow(QuoteNotFoundError);
  });
});
