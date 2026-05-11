import { useEffect, useState } from 'react'
import { useQuote } from './useQuote.js'
import TerminalCard from './TerminalCard.jsx'
import AddQuoteModal from './AddQuoteModal.jsx'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function App() {
  const { quote, loading, error, fetchQuote, setQuote } = useQuote(backendUrl)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  function handleSuccess(newQuote) {
    setQuote(newQuote)
  }

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
        <button
          onClick={() => setModalOpen(true)}
          className="hover:underline"
          aria-label="add quote"
        >
          &gt; add
        </button>
      </div>
      <AddQuoteModal
        backendUrl={backendUrl}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
