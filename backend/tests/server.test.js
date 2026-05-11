import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";
import { createQuoteStore } from "../quote-store.js";

const app = createApp(createQuoteStore([{ quote: "Test", author: "Tester" }]));

describe("GET /quotes", () => {
  it("returns a JSON object with quote and author", async () => {
    const res = await request(app).get("/quotes");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      quote: expect.any(String),
      author: expect.any(String),
    });
  });
});

describe("POST /quotes", () => {
  it("accepts a valid quote and returns 201 with success", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ quote: "Test quote", author: "Test author" }));
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  it("returns 400 with error message when quote is missing", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ author: "Test author" }));
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "quote is required" });
  });

  it("returns 400 with error message when author is missing", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ quote: "Test quote" }));
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "author is required" });
  });

  it("returns 400 when quote is an empty string", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ quote: "", author: "Test author" }));
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "quote is required" });
  });

  it("returns 400 when author is an empty string", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ quote: "Test quote", author: "" }));
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "author is required" });
  });

  it("returns 400 with error message for malformed JSON", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send("not valid json");
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  it("returns 400 when body is null", async () => {
    const res = await request(app)
      .post("/quotes")
      .set("Content-Type", "application/json")
      .send("null");
    expect(res.status).toBe(400);
  });
});

describe("CORS", () => {
  it("includes Access-Control-Allow-Origin on GET /quotes", async () => {
    const res = await request(app)
      .get("/quotes")
      .set("Origin", "http://localhost:5500");
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });
});
