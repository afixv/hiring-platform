import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

/**
 * Example test for a simple Button component
 * This demonstrates how to test UI components with React Testing Library
 */

describe('Button Component', () => {
  it('renders button with text', () => {
    const ButtonComponent = () => (
      <button data-testid="test-button">Click me</button>
    )

    render(<ButtonComponent />)
    const button = screen.getByTestId('test-button')

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    const ButtonComponent = () => (
      <button onClick={handleClick}>Click me</button>
    )

    render(<ButtonComponent />)
    const button = screen.getByRole('button')

    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has correct styling classes', () => {
    const ButtonComponent = () => (
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Styled Button
      </button>
    )

    render(<ButtonComponent />)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('bg-blue-500')
    expect(button).toHaveClass('text-white')
  })
})
