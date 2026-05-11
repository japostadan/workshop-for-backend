import { useState } from 'react'
import { addQuote } from './api.js'

export default function AddQuoteModal({ backendUrl, isOpen, onClose, onSuccess }) {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const data = await addQuote(backendUrl, { quote: quote.trim(), author: author.trim() })

    if (data.error) {
      setError(data.error)
      setSubmitting(false)
    } else {
      onSuccess(data)
      onClose()
    }
  }

  function handleClose() {
    setError(null)
    setQuote('')
    setAuthor('')
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-80" onClick={handleClose} />
      <div className="relative border border-green-500 font-mono w-full max-w-xl z-10">
        <div className="border-b border-green-500 px-3 py-1 text-sm flex justify-between">
          <span>add-quote.sh</span>
          <button onClick={handleClose} aria-label="close">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span>&gt; quote:</span>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="bg-black border border-green-500 p-2 text-green-500 resize-none"
              rows={3}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>&gt; author:</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-black border border-green-500 p-2 text-green-500"
            />
          </label>
          {error && (
            <p className="text-red-500" role="alert">error: {error}</p>
          )}
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="disabled:opacity-40">
              &gt; submit
            </button>
            <button type="button" onClick={handleClose}>
              &gt; cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
