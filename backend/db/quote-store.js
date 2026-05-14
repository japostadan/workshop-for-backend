import { QuoteNotFoundError } from "../quote.js";

export function createQuoteStore(initialQuotes = []) {
  const quotes = [...initialQuotes];

  return {
    initialize() {},
    getRandomQuote() {
      if (quotes.length === 0) throw new QuoteNotFoundError();
      const index = Math.floor(Math.random() * quotes.length);
      return quotes[index];
    },
    addQuote({ quote, author }) {
      quotes.push({ quote, author });
    },
  };
}
