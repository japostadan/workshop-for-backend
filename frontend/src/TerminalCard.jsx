import { useState, useEffect } from 'react'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export default function TerminalCard({ quote, loading, error }) {
  const [spinnerFrame, setSpinnerFrame] = useState(0)

  useEffect(() => {
    if (!loading) return
    const id = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length)
    }, 100)
    return () => clearInterval(id)
  }, [loading])

  return (
    <div className="border border-green-500 font-mono w-full max-w-xl">
      <div className="border-b border-green-500 px-3 py-1 text-sm">
        quote-of-the-day
      </div>
      <div className={`p-4 min-h-24 transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {error && (
          <p className="text-red-500" role="alert">error: {error}</p>
        )}
        {quote && !error && (
          <>
            <p className="text-lg mb-2">{quote.quote}</p>
            <p className="text-sm">— {quote.author}</p>
          </>
        )}
        {loading
          ? <span aria-label="loading" className="text-green-500">{SPINNER_FRAMES[spinnerFrame]}</span>
          : <span aria-hidden="true" className="animate-pulse">_</span>
        }
      </div>
    </div>
  )
}
