import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from '../App.jsx'

const BACKEND_URL = 'http://localhost:3001'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
  import.meta.env.VITE_BACKEND_URL = BACKEND_URL
})

function stubQuote(quote) {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => quote,
  })
}

describe('quote display', () => {
  it('shows the quote text and author fetched on mount', async () => {
    stubQuote({ quote: 'Either write something worth reading or do something worth writing.', author: 'Benjamin Franklin' })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Either write something worth reading or do something worth writing.')).toBeInTheDocument()
      expect(screen.getByText('Benjamin Franklin')).toBeInTheDocument()
    })
  })

  it('shows an error message when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error')
    })
  })

  it('shows a new quote when the New Quote button is clicked', async () => {
    stubQuote({ quote: 'I should have been more kind.', author: 'Clive James' })
    stubQuote({ quote: 'The only way out is through.', author: 'Robert Frost' })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('I should have been more kind.')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'New Quote' }))

    await waitFor(() => {
      expect(screen.getByText('The only way out is through.')).toBeInTheDocument()
      expect(screen.getByText('Robert Frost')).toBeInTheDocument()
    })
  })

  it('shows a loading indicator while the fetch is in flight', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})) // never resolves

    render(<App />)

    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })
})
