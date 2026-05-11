export function createQuoteStore(initialQuotes = []) {
  const quotes = [...initialQuotes];

  return {
    getRandomQuote() {
      const index = Math.floor(Math.random() * quotes.length);
      return quotes[index];
    },
    addQuote({ quote, author }) {
      quotes.push({ quote, author });
    },
  };
}
