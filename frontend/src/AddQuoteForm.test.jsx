import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AddQuoteForm from './AddQuoteForm.jsx'

const BACKEND_URL = 'http://localhost:3001'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

function stubSuccess() {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  })
}

function stubError(message) {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: message }),
  })
}

async function fillAndSubmit(quote, author) {
  if (quote) await userEvent.type(screen.getByRole('textbox', { name: /quote/i }), quote)
  if (author) await userEvent.type(screen.getByRole('textbox', { name: /author/i }), author)
  await userEvent.click(screen.getByRole('button', { name: /add quote/i }))
}

describe('add quote form', () => {
  it('shows a success message after a valid quote is submitted', async () => {
    stubSuccess()

    render(<AddQuoteForm backendUrl={BACKEND_URL} />)

    await fillAndSubmit('The only way out is through.', 'Robert Frost')

    await waitFor(() => {
      expect(screen.getByText('Quote added!')).toBeInTheDocument()
    })
  })

  it('shows the backend error message when submission fails', async () => {
    stubError('author is required')

    render(<AddQuoteForm backendUrl={BACKEND_URL} />)

    await fillAndSubmit('The only way out is through.', '')

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('author is required')
    })
  })

  it('disables the submit button while the request is in flight', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})) // never resolves

    render(<AddQuoteForm backendUrl={BACKEND_URL} />)

    await fillAndSubmit('The only way out is through.', 'Robert Frost')

    expect(screen.getByRole('button', { name: /add quote/i })).toBeDisabled()
  })

  it('resets the form fields after a successful submission', async () => {
    stubSuccess()

    render(<AddQuoteForm backendUrl={BACKEND_URL} />)

    await fillAndSubmit('The only way out is through.', 'Robert Frost')

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /quote/i })).toHaveValue('')
      expect(screen.getByRole('textbox', { name: /author/i })).toHaveValue('')
    })
  })
})
