import { useState, useCallback } from 'react'

export function useQuote(backendUrl) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchQuote = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${backendUrl}/quotes`)
      if (!res.ok) throw new Error('Failed to fetch quote')
      const data = await res.json()
      setQuote(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [backendUrl])

  return { quote, loading, error, fetchQuote }
}
