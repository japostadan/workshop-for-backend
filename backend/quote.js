export function validateQuote(body) {
  if (typeof body !== "object" || body === null || !body.quote) {
    return "quote is required";
  }
  if (!body.author) {
    return "author is required";
  }
  return null;
}

export class QuoteNotFoundError extends Error {
  constructor() {
    super("No quotes found");
  }
}
