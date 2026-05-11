import { useEffect } from 'react'
import { useQuote } from './useQuote.js'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function App() {
  const { quote, loading, error, fetchQuote } = useQuote(backendUrl)

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-8">
      {loading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {quote && (
        <div>
          <p>{quote.quote}</p>
          <p>{quote.author}</p>
        </div>
      )}
      <button onClick={fetchQuote}>New Quote</button>
    </div>
  )
}
