import { useEffect, useRef, useState } from 'react'
import { useQuote } from './useQuote.js'
import TerminalCard from './TerminalCard.jsx'
import AddQuoteModal from './AddQuoteModal.jsx'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function App() {
  const { quote, loading, error, fetchQuote } = useQuote(backendUrl)
  const [modalOpen, setModalOpen] = useState(false)
  const [flash, setFlash] = useState(null)
  const [flashVisible, setFlashVisible] = useState(false)
  const flashTimer = useRef(null)

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  function handleSuccess() {
    setModalOpen(false)
    clearTimeout(flashTimer.current)
    setFlash('> [OK] quote added.')
    setFlashVisible(true)
    fetchQuote()
    flashTimer.current = setTimeout(() => setFlashVisible(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-8">
      <TerminalCard quote={quote} loading={loading} error={error} />
      <div className="flex gap-4 font-mono text-green-500">
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="border border-green-500 px-4 py-1 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
          aria-label="next quote"
        >
          &gt; next
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="border border-green-500 px-4 py-1 hover:bg-green-500 hover:text-black transition-colors"
          aria-label="add quote"
        >
          &gt; add
        </button>
      </div>
      {flash && (
        <p
          aria-live="polite"
          className={`font-mono text-sm text-green-500 transition-opacity duration-500 ${flashVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {flash}
        </p>
      )}
      <AddQuoteModal
        backendUrl={backendUrl}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
