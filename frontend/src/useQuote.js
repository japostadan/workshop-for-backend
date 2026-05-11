import { useState, useCallback } from 'react'
import { getRandomQuote } from './api.js'

export function useQuote(backendUrl) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchQuote = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRandomQuote(backendUrl)
      setQuote(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [backendUrl])

  return { quote, setQuote, loading, error, fetchQuote }
}
