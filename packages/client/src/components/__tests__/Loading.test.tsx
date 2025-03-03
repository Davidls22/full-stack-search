import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loading from '../Loading'

describe('Loading', () => {
  it('renders the loading container and spinner', () => {
    const { container } = render(<Loading />)
    expect(container.querySelector('.loading-container')).toBeInTheDocument()
    expect(container.querySelector('.spinner')).toBeInTheDocument()
  })
})
