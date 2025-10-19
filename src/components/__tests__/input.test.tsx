import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

/**
 * Example test for an Input component
 * This demonstrates how to test form inputs and user interactions
 */

describe('Input Component', () => {
  it('renders input element', () => {
    const InputComponent = () => (
      <input
        data-testid="test-input"
        placeholder="Enter text"
        type="text"
      />
    )

    render(<InputComponent />)
    const input = screen.getByTestId('test-input') as HTMLInputElement

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('updates value when user types', () => {
    const InputComponent = () => {
      const [value, setValue] = React.useState('')
      return (
        <input
          data-testid="test-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )
    }

    render(<InputComponent />)
    const input = screen.getByTestId('test-input') as HTMLInputElement

    // Simulate user typing
    input.value = 'test text'
    input.dispatchEvent(new Event('change', { bubbles: true }))

    expect(input.value).toBe('test text')
  })

  it('has correct input type', () => {
    const InputComponent = () => (
      <input data-testid="email-input" type="email" />
    )

    render(<InputComponent />)
    const input = screen.getByTestId('email-input') as HTMLInputElement

    expect(input.type).toBe('email')
  })

  it('is disabled when disabled prop is true', () => {
    const InputComponent = () => (
      <input data-testid="test-input" disabled />
    )

    render(<InputComponent />)
    const input = screen.getByTestId('test-input') as HTMLInputElement

    expect(input).toBeDisabled()
  })
})
