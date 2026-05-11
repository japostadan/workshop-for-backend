import { useState } from 'react'

export default function AddQuoteForm({ backendUrl }) {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const res = await fetch(`${backendUrl}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote: quote.trim(), author: author.trim() }),
    })

    if (res.ok) {
      setQuote('')
      setAuthor('')
      setStatus({ type: 'success', message: 'Quote added!' })
    } else {
      const data = await res.json()
      setStatus({ type: 'error', message: data.error })
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Quote
        <textarea
          name="quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </label>
      <label>
        Author
        <input
          type="text"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </label>
      <button type="submit" disabled={submitting}>Add Quote</button>
      {status && (
        <p role={status.type === 'error' ? 'alert' : undefined}>
          {status.message}
        </p>
      )}
    </form>
  )
}
