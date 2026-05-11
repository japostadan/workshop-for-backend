import { useState } from 'react'
import { addQuote } from './api.js'

export default function AddQuoteForm({ backendUrl }) {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const data = await addQuote(backendUrl, { quote: quote.trim(), author: author.trim() })

    if (data.error) {
      setStatus({ type: 'error', message: data.error })
    } else {
      setQuote('')
      setAuthor('')
      setStatus({ type: 'success', message: 'Quote added!' })
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
