import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./server.js";

describe("GET /", () => {
  it("returns a formatted quote string", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/^".*" -\S/);
  });
});

describe("POST /", () => {
  it("accepts a valid quote and author", async () => {
    const res = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ quote: "Test quote", author: "Test author" }));
    expect(res.status).toBe(200);
    expect(res.text).toBe("ok");
  });

  it("returns 400 when quote is missing", async () => {
    const res = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ author: "Test author" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when author is missing", async () => {
    const res = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ quote: "Test quote" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send("not valid json");
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is null", async () => {
    const res = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send("null");
    expect(res.status).toBe(400);
  });
});
