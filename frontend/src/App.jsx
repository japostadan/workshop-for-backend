import { useEffect } from 'react'
import { useQuote } from './useQuote.js'
import TerminalCard from './TerminalCard.jsx'
import AddQuoteForm from './AddQuoteForm.jsx'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function App() {
  const { quote, loading, error, fetchQuote } = useQuote(backendUrl)

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-8">
      <TerminalCard quote={quote} loading={loading} error={error} />
      <div className="flex gap-6 font-mono text-green-500">
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="disabled:opacity-40 disabled:pointer-events-none hover:underline"
          aria-label="next quote"
        >
          &gt; next
        </button>
      </div>
      <AddQuoteForm backendUrl={backendUrl} />
    </div>
  )
}
