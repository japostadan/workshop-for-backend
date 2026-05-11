import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import { createQuoteStore } from "./quote-store.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const store = createQuoteStore([
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

function validateQuote(body) {
  if (
    typeof body !== "object" ||
    body === null ||
    !body.quote ||
    !body.author
  ) {
    return "Missing required fields";
  }
  return null;
}

app.get("/quotes", (req, res) => {
  res.json(store.getRandomQuote());
});

app.post("/quotes", (req, res) => {
  const error = validateQuote(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  store.addQuote({ quote: req.body.quote, author: req.body.author });
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
