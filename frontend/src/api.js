export async function getRandomQuote(baseUrl) {
  const res = await fetch(`${baseUrl}/quotes`)
  if (!res.ok) throw new Error('Failed to fetch quote')
  return res.json()
}

export async function addQuote(baseUrl, { quote, author }) {
  const res = await fetch(`${baseUrl}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quote, author }),
  })
  return res.json()
}
