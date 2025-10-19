import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Integration Test Example
 * Tests multiple components working together
 */

// Example: Form integration test
describe('Form Integration', () => {
  // Mock component that uses Button and Input
  const LoginForm = ({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit({ email, password })
    }

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    )
  }

  it('should submit form with valid data', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})

/**
 * Async Tests Example
 * Tests with async operations like API calls
 */
describe('Async Operations', () => {
  it('should handle async data fetching', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'Test Job' }),
      })
    ) as jest.Mock

    // Simulate component that fetches data
    const TestComponent = () => {
      const [job, setJob] = React.useState<{ id: number; name: string } | null>(null)
      const [loading, setLoading] = React.useState(true)

      React.useEffect(() => {
        fetch('/api/jobs/1')
          .then((res) => res.json())
          .then((data) => {
            setJob(data)
            setLoading(false)
          })
      }, [])

      if (loading) return <div>Loading...</div>
      return <div>{job?.name}</div>
    }

    render(<TestComponent />)

    // Wait for loading to finish
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data to load
    await screen.findByText('Test Job')

    // Cleanup
    jest.clearAllMocks()
  })
})

/**
 * Context Integration Example
 * Tests with React Context
 */
describe('Context Integration', () => {
  const ThemeContext = React.createContext<{ theme: string }>({ theme: 'light' })

  const ThemedButton = () => {
    const { theme } = React.useContext(ThemeContext)
    return <button data-testid="themed-button" className={`button-${theme}`}>
      Themed Button
    </button>
  }

  it('should apply theme from context', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={{ theme: 'dark' }}>
        {children}
      </ThemeContext.Provider>
    )

    render(<ThemedButton />, { wrapper: TestWrapper })

    const button = screen.getByTestId('themed-button')
    expect(button).toHaveClass('button-dark')
  })
})

/**
 * Error Handling Tests
 * Tests error scenarios and edge cases
 */
describe('Error Handling', () => {
  it('should handle form submission errors', async () => {
    const handleSubmit = jest.fn().mockRejectedValue(new Error('Network error'))
    const user = userEvent.setup()

    const ErrorForm = ({ onSubmit }: { onSubmit: () => Promise<void> }) => {
      const [error, setError] = React.useState<string | null>(null)

      const handleClick = async () => {
        try {
          await onSubmit()
        } catch (err) {
          setError((err as Error).message)
        }
      }

      return (
        <>
          <button onClick={handleClick}>Submit</button>
          {error && <div role="alert">{error}</div>}
        </>
      )
    }

    render(<ErrorForm onSubmit={handleSubmit} />)

    const button = screen.getByRole('button')
    await user.click(button)

    await screen.findByRole('alert')
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })
})

/**
 * User Interaction Tests
 * Tests complex user interactions
 */
describe('Complex User Interactions', () => {
  it('should handle multi-step form', async () => {
    const user = userEvent.setup()

    const MultiStepForm = () => {
      const [step, setStep] = React.useState(1)

      return (
        <>
          <div>Step {step}</div>
          {step === 1 && (
            <input placeholder="Name" />
          )}
          {step === 2 && (
            <input placeholder="Email" />
          )}
          {step < 2 && (
            <button onClick={() => setStep(step + 1)}>Next</button>
          )}
          {step === 2 && (
            <button onClick={() => setStep(step - 1)}>Back</button>
          )}
        </>
      )
    }

    render(<MultiStepForm />)

    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  })
})
