import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'

describe('Header', () => {
  it('renders heading and paragraph', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: /find your perfect stay/i })).toBeInTheDocument()
    expect(screen.getByText(/courtesy of david & tryhackme/i)).toBeInTheDocument()
  })
})
