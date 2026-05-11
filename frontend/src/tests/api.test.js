import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getRandomQuote, addQuote } from '../api.js'

const BASE_URL = 'http://localhost:3001'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('getRandomQuote', () => {
  it('returns parsed quote data on success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ quote: 'Test', author: 'Tester' }),
    })

    const result = await getRandomQuote(BASE_URL)

    expect(result).toEqual({ quote: 'Test', author: 'Tester' })
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/quotes`)
  })

  it('throws on non-ok response', async () => {
    fetch.mockResolvedValueOnce({ ok: false })

    await expect(getRandomQuote(BASE_URL)).rejects.toThrow()
  })

  it('propagates network failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(getRandomQuote(BASE_URL)).rejects.toThrow('Network error')
  })
})

describe('addQuote', () => {
  it('returns parsed body on success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const result = await addQuote(BASE_URL, { quote: 'Test', author: 'Tester' })

    expect(result).toEqual({ success: true })
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/quotes`, expect.objectContaining({ method: 'POST' }))
  })

  it('returns error payload on non-ok response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'quote is required' }),
    })

    const result = await addQuote(BASE_URL, { quote: '', author: 'Tester' })

    expect(result).toEqual({ error: 'quote is required' })
  })

  it('propagates network failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(addQuote(BASE_URL, { quote: 'Test', author: 'Tester' })).rejects.toThrow('Network error')
  })
})
