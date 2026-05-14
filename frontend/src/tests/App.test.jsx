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

describe('add quote modal', () => {
  it('opens the modal when > add is clicked', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}))
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'add quote' }))
    expect(screen.getByText('add-quote.sh')).toBeInTheDocument()
  })

  it('shows flash message and fetches new quote after modal success', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ quote: 'First', author: 'A' }) })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, quote: 'Submitted', author: 'B' }) })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ quote: 'New Random', author: 'C' }) })

    render(<App />)
    await waitFor(() => expect(screen.getByText('"First"')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'add quote' }))
    await userEvent.type(screen.getAllByRole('textbox')[0], 'Submitted')
    await userEvent.type(screen.getAllByRole('textbox')[1], 'B')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('> [OK] quote added.')).toBeInTheDocument()
      expect(screen.queryByText('add-quote.sh')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('"New Random"')).toBeInTheDocument()
    })
  })
})

describe('quote display', () => {
  it('shows the quote text and author fetched on mount', async () => {
    stubQuote({ quote: 'Either write something worth reading or do something worth writing.', author: 'Benjamin Franklin' })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('"Either write something worth reading or do something worth writing."')).toBeInTheDocument()
      expect(screen.getByText('ψ Benjamin Franklin')).toBeInTheDocument()
    })
  })

  it('shows an error message when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error')
    })
  })

  it('shows a new quote when the next button is clicked', async () => {
    stubQuote({ quote: 'I should have been more kind.', author: 'Clive James' })
    stubQuote({ quote: 'The only way out is through.', author: 'Robert Frost' })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('"I should have been more kind."')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'next quote' }))

    await waitFor(() => {
      expect(screen.getByText('"The only way out is through."')).toBeInTheDocument()
      expect(screen.getByText('ψ Robert Frost')).toBeInTheDocument()
    })
  })

  it('shows a loading indicator while the fetch is in flight', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})) // never resolves

    render(<App />)

    expect(screen.getByLabelText('loading')).toBeInTheDocument()
  })
})
