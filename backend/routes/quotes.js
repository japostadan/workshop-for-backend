import { Router } from "express";
import { validateQuote, QuoteNotFoundError } from "../quote.js";

export function createQuotesRouter(store) {
  const router = Router();

  router.get("/quotes", async (req, res) => {
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

  router.post("/quotes", async (req, res) => {
    const error = validateQuote(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    await store.addQuote({ quote: req.body.quote, author: req.body.author });
    res.status(201).json({ success: true });
  });

  return router;
}
