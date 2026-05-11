import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AddQuoteModal from '../AddQuoteModal.jsx'

const BACKEND_URL = 'http://localhost:3001'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

function renderModal(props = {}) {
  const defaults = {
    backendUrl: BACKEND_URL,
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  }
  return render(<AddQuoteModal {...defaults} {...props} />)
}

describe('AddQuoteModal', () => {
  it('is not visible when isOpen is false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByText('add-quote.sh')).not.toBeInTheDocument()
  })

  it('renders the add-quote.sh title when open', () => {
    renderModal()
    expect(screen.getByText('add-quote.sh')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows an error line when the server returns a validation error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'quote is required' }),
    })
    renderModal()
    await userEvent.type(screen.getByRole('textbox', { name: /author/i }), 'Tester')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('error: quote is required')
    })
  })

  it('disables the submit button while the request is in flight', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}))
    renderModal()
    await userEvent.type(screen.getByRole('textbox', { name: /author/i }), 'Tester')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('calls onSuccess with the returned data and closes on success', async () => {
    const returned = { quote: 'Test', author: 'Tester' }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => returned,
    })
    const onSuccess = vi.fn()
    const onClose = vi.fn()
    renderModal({ onSuccess, onClose })
    await userEvent.type(screen.getAllByRole('textbox')[0], 'Test')
    await userEvent.type(screen.getAllByRole('textbox')[1], 'Tester')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(returned)
      expect(onClose).toHaveBeenCalled()
    })
  })
})
