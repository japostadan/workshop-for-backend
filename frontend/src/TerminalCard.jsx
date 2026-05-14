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
      <div className="border-b border-green-500 px-3 py-2 text-sm flex items-center gap-2">
        <div className="flex gap-1.5 items-center" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="absolute left-1/2 transform -translate-x-1/2">
          $ quote-machine
        </span>
        {loading && (
          <span aria-label="loading" className="ml-auto text-red-500">{SPINNER_FRAMES[spinnerFrame]}</span>
        )}
      </div>
      <div className={`p-4 h-52 flex flex-col overflow-y-auto transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex-1">
          {error && (
            <p className="text-red-500" role="alert">error: {error}</p>
          )}
          {quote && !error && (
            <p className="text-lg">"{quote.quote}"</p>
          )}
          {!loading && <span aria-hidden="true" className="animate-pulse">Σ</span>}
        </div>
        {quote && !error && (
          <p className="text-sm text-right pt-3">ψ {quote.author}</p>
        )}
      </div>
    </div>
  )
}
