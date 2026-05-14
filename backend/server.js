import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import { createQuotesRouter } from "./routes/quotes.js";

export function createApp(store, corsOrigin) {
  const app = express();

  app.use(cors(corsOrigin ? { origin: corsOrigin } : undefined));
  app.use(express.json());
  app.use(createQuotesRouter(store));

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
  const { createStoreFromEnv } = await import("./db/quote-store-factory.js");
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
  await store.initialize();
  const app = createApp(store, process.env.CORS_ORIGIN);
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.error(`Quote server listening on port ${port}`);
  });
}
