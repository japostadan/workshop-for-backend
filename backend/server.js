import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import pg from "pg";
import { createQuoteStore } from "./quote-store.js";
import { createPgQuoteStore } from "./quote-store-pg.js";
import { validateQuote } from "./quote.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const store = process.env.DATABASE_URL
  ? createPgQuoteStore(new pg.Pool({ connectionString: process.env.DATABASE_URL }))
  : createQuoteStore([
      {
        quote:
          "Either write something worth reading or do something worth writing.",
        author: "Benjamin Franklin",
      },
      {
        quote: "I should have been more kind.",
        author: "Clive James",
      },
    ]);

app.get("/quotes", async (req, res) => {
  res.json(await store.getRandomQuote());
});

app.post("/quotes", async (req, res) => {
  const error = validateQuote(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  await store.addQuote({ quote: req.body.quote, author: req.body.author });
  res.status(201).json({ success: true });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ error: "Expected body to be JSON." });
    return;
  }
  next(err);
});

export { app };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.error(`Quote server listening on port ${port}`);
  });
}
