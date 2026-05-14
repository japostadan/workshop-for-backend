export function validateQuote(body) {
  if (typeof body !== "object" || body === null || !body.quote) {
    return "quote is required";
  }
  if (body.quote.length > 1000) {
    return "quote must be 1000 characters or fewer";
  }
  if (!body.author) {
    return "author is required";
  }
  if (body.author.length > 255) {
    return "author must be 255 characters or fewer";
  }
  return null;
}

export class QuoteNotFoundError extends Error {
  constructor() {
    super("No quotes found");
  }
}
