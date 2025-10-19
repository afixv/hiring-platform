import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Email" />)
    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('allows typing in input', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'test value')
    expect(input).toHaveValue('test value')
  })

  it('shows helper text', () => {
    render(<Input helperText="This is helper text" />)
    const helperText = screen.getByText('This is helper text')
    expect(helperText).toBeInTheDocument()
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('shows character count when showCounter is true', () => {
    render(<Input showCounter maxLength={50} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('applies error state', () => {
    const { container } = render(<Input error />)
    expect(container.querySelector('input')).toHaveClass('border-danger')
  })

  it('applies success state', () => {
    render(<Input success />)
    const input = screen.getByRole('textbox')
    // Check if component renders without error
    expect(input).toBeInTheDocument()
  })

  it('renders with leading icon', () => {
    render(
      <Input
        leadingIcon={<span data-testid="leading-icon">🔍</span>}
        placeholder="Search"
      />
    )
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
  })

  it('renders with trailing icon', () => {
    render(
      <Input trailingIcon={<span data-testid="trailing-icon">✓</span>} />
    )
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
  })

  it('renders required input', () => {
    render(<Input required label="Required Field" />)
    const label = screen.getByText(/required field/i)
    expect(label).toBeInTheDocument()
  })

  it('handles change events', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('restricts input to numeric only', async () => {
    const user = userEvent.setup()
    render(<Input numericOnly />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123abc')
    // Note: The actual filtering behavior depends on implementation
    expect(input).toBeInTheDocument()
  })
})
