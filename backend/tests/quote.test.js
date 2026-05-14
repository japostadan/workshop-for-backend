import { describe, it, expect } from "vitest";
import { validateQuote, QuoteNotFoundError } from "../quote.js";

describe("validateQuote", () => {
  it("returns null when quote and author are present", () => {
    expect(validateQuote({ quote: "Test", author: "Tester" })).toBeNull();
  });

  it("returns 'quote is required' when quote is missing", () => {
    expect(validateQuote({ author: "Tester" })).toBe("quote is required");
  });

  it("returns 'quote is required' when quote is empty string", () => {
    expect(validateQuote({ quote: "", author: "Tester" })).toBe("quote is required");
  });

  it("returns 'author is required' when author is missing", () => {
    expect(validateQuote({ quote: "Test" })).toBe("author is required");
  });

  it("returns 'author is required' when author is empty string", () => {
    expect(validateQuote({ quote: "Test", author: "" })).toBe("author is required");
  });

  it("returns 'quote is required' when body is null", () => {
    expect(validateQuote(null)).toBe("quote is required");
  });

  it("returns error when quote exceeds 1000 characters", () => {
    expect(validateQuote({ quote: "a".repeat(1001), author: "Tester" })).toBe(
      "quote must be 1000 characters or fewer"
    );
  });

  it("returns null when quote is exactly 1000 characters", () => {
    expect(validateQuote({ quote: "a".repeat(1000), author: "Tester" })).toBeNull();
  });

  it("returns error when author exceeds 255 characters", () => {
    expect(validateQuote({ quote: "Test", author: "a".repeat(256) })).toBe(
      "author must be 255 characters or fewer"
    );
  });

  it("returns null when author is exactly 255 characters", () => {
    expect(validateQuote({ quote: "Test", author: "a".repeat(255) })).toBeNull();
  });
});

describe("QuoteNotFoundError", () => {
  it("is an instance of Error with a meaningful message", () => {
    const err = new QuoteNotFoundError();
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBeTruthy();
  });
});
