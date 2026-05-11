import express from "express";
import { fileURLToPath } from "url";
//import cors from "cors";

const app = express();
const port = 3001;

app.use(express.json());

const quotes = [
  {
    quote:
      "Either write something worth reading or do something worth writing.",
    author: "Benjamin Franklin",
  },
  {
    quote: "I should have been more kind.",
    author: "Clive James",
  },
];

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

function validateQuote(body) {
  if (typeof body !== "object" || body === null || !("quote" in body) || !("author" in body)) {
    return "Expected body to be a JSON object containing keys quote and author.";
  }
  return null;
}

app.get("/", (req, res) => {
  const quote = randomQuote();
  res.send(`"${quote.quote}" -${quote.author}`);
});

app.post("/", (req, res) => {
  const error = validateQuote(req.body);
  if (error) {
    console.error(`Failed to extract quote and author from post body: ${JSON.stringify(req.body)}`);
    res.status(400).send(error);
    return;
  }
  quotes.push({
    quote: req.body.quote,
    author: req.body.author,
  });
  res.send("ok");
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    res.status(400).send("Expected body to be JSON.");
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
