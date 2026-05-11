import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TerminalCard from '../TerminalCard.jsx'

describe('TerminalCard', () => {
  it('renders the quote-of-the-day title bar', () => {
    render(<TerminalCard quote={null} loading={false} error={null} />)
    expect(screen.getByText('quote-of-the-day')).toBeInTheDocument()
  })

  it('renders quote text and — Author when a quote is provided', () => {
    render(<TerminalCard quote={{ quote: 'Test quote', author: 'Tester' }} loading={false} error={null} />)
    expect(screen.getByText('Test quote')).toBeInTheDocument()
    expect(screen.getByText('— Tester')).toBeInTheDocument()
  })

  it('renders a red error line when an error is provided', () => {
    render(<TerminalCard quote={null} loading={false} error="Failed to fetch quote" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('error: Failed to fetch quote')
    expect(alert).toHaveClass('text-red-500')
  })

  it('applies a dim class when loading is true', () => {
    const { container } = render(<TerminalCard quote={null} loading={true} error={null} />)
    expect(container.querySelector('.opacity-40')).toBeInTheDocument()
  })

  it('shows a spinner when loading', () => {
    render(<TerminalCard quote={null} loading={true} error={null} />)
    expect(screen.getByLabelText('loading')).toBeInTheDocument()
  })
})
