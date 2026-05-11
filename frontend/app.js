async function fetchAndShow() {
  const res = await fetch(window.CONFIG.BACKEND_URL + "/quotes");
  const data = await res.json();
  document.getElementById("quote-text").textContent = data.quote;
  document.getElementById("quote-author").textContent = "— " + data.author;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndShow();
  document.getElementById("new-quote-btn").addEventListener("click", fetchAndShow);

  document.getElementById("add-quote-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const quote = form.quote.value.trim();
    const author = form.author.value.trim();
    const result = document.getElementById("add-result");

    if (!quote || !author) {
      result.textContent = !quote ? "Quote text is required." : "Author name is required.";
      return;
    }

    const res = await fetch(window.CONFIG.BACKEND_URL + "/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, author }),
    });

    if (res.ok) {
      form.reset();
      result.textContent = "Quote added!";
    } else {
      const data = await res.json();
      result.textContent = data.error || "Something went wrong.";
    }
  });
});
