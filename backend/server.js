import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import { validateQuote, QuoteNotFoundError } from "./quote.js";

export function createApp(store) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/quotes", async (req, res) => {
    try {
      res.json(await store.getRandomQuote());
    } catch (err) {
      if (err instanceof QuoteNotFoundError) {
        res.status(404).json({ error: err.message });
      } else {
        throw err;
      }
    }
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

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { createStoreFromEnv } = await import("./quote-store-factory.js");
  const store = createStoreFromEnv([
    {
      quote: "Either write something worth reading or do something worth writing.",
      author: "Benjamin Franklin",
    },
    {
      quote: "I should have been more kind.",
      author: "Clive James",
    },
  ]);
  const app = createApp(store);
  app.listen(3001, () => {
    console.error("Quote server listening on port 3001");
  });
}
