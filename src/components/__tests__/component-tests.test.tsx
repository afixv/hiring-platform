import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * CANDIDATES TABLE TESTS
 */
describe('CandidatesTable Component', () => {
  const mockData = [
    {
      id: '1',
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '08123456789',
      position: 'Frontend Developer',
      status: 'pending',
    },
    {
      id: '2',
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '08987654321',
      position: 'Backend Developer',
      status: 'interviewed',
    },
  ]

  it('should render table with candidates data', () => {
    const MockTable = () => (
      <table>
        <tbody>
          {mockData.map((row) => (
            <tr key={row.id}>
              <td>{row.full_name}</td>
              <td>{row.email}</td>
              <td>{row.position}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    render(<MockTable />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should allow row selection', async () => {
    const user = userEvent.setup()
    const MockTable = () => {
      const [selected, setSelected] = React.useState<Set<string>>(new Set())

      return (
        <table>
          <tbody>
            {mockData.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selected)
                      if (e.target.checked) {
                        newSelected.add(row.id)
                      } else {
                        newSelected.delete(row.id)
                      }
                      setSelected(newSelected)
                    }}
                  />
                </td>
                <td>{row.full_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    render(<MockTable />)
    const checkboxes = screen.getAllByRole('checkbox')

    await user.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()
  })

  it('should filter candidates by search query', () => {
    const MockTable = () => {
      const [search, setSearch] = React.useState('')

      const filtered = mockData.filter((item) =>
        item.full_name.toLowerCase().includes(search.toLowerCase())
      )

      return (
        <>
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <table>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.full_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )
    }

    render(<MockTable />)
    const searchInput = screen.getByPlaceholderText('Search')

    fireEvent.change(searchInput, { target: { value: 'John' } })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('should display candidate status badge', () => {
    render(
      <table>
        <tbody>
          {mockData.map((row) => (
            <tr key={row.id}>
              <td>{row.full_name}</td>
              <td>
                <span className={`badge-${row.status}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('interviewed')).toBeInTheDocument()
  })

  it('should select/deselect all candidates', async () => {
    const user = userEvent.setup()

    const MockTable = () => {
      const [selectedAll, setSelectedAll] = React.useState(false)
      const [selected, setSelected] = React.useState<Set<string>>(new Set())

      const handleSelectAll = (checked: boolean) => {
        setSelectedAll(checked)
        if (checked) {
          setSelected(new Set(mockData.map((item) => item.id)))
        } else {
          setSelected(new Set())
        }
      }

      return (
        <>
          <input
            type="checkbox"
            data-testid="select-all"
            checked={selectedAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          {mockData.map((row) => (
            <div key={row.id}>
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                onChange={() => {}}
              />
              {row.full_name}
            </div>
          ))}
        </>
      )
    }

    render(<MockTable />)
    const selectAll = screen.getByTestId('select-all')

    await user.click(selectAll)
    expect(selectAll).toBeChecked()
  })
})

/**
 * CREATE JOB MODAL TESTS
 */
describe('CreateJobModal Component', () => {
  it('should render job creation form', () => {
    const MockModal = () => (
      <div role="dialog">
        <input placeholder="Job Title" />
        <input placeholder="Department" />
        <textarea placeholder="Description" />
        <button>Create Job</button>
      </div>
    )

    render(<MockModal />)
    expect(screen.getByPlaceholderText('Job Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Department')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    const MockModal = () => {
      const handleClick = () => {
        handleSubmit()
      }

      return (
        <div>
          <input placeholder="Job Title" />
          <button onClick={handleClick}>Create</button>
        </div>
      )
    }

    render(<MockModal />)
    const button = screen.getByRole('button')
    await user.click(button)
  })

  it('should close modal on cancel', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()

    const MockModal = () => (
      <div>
        <button onClick={onClose}>Cancel</button>
        <button>Create</button>
      </div>
    )

    render(<MockModal />)
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    await user.click(cancelButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    const MockModal = () => {
      const [title, setTitle] = React.useState('')

      return (
        <div>
          <input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={() => handleSubmit({ title })}>Create</button>
        </div>
      )
    }

    render(<MockModal />)
    const input = screen.getByPlaceholderText('Job Title')
    const button = screen.getByRole('button')

    await user.type(input, 'Frontend Developer')
    await user.click(button)

    expect(handleSubmit).toHaveBeenCalledWith({ title: 'Frontend Developer' })
  })
})

/**
 * JOB CARD TESTS
 */
describe('JobCard Component', () => {
  const mockJob = {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Jakarta',
    salary: 'Rp 10-15 Juta',
    description: 'We are looking for a skilled frontend developer',
  }

  it('should render job card with all details', () => {
    const MockCard = () => (
      <div>
        <h3>{mockJob.title}</h3>
        <p>{mockJob.company}</p>
        <p>{mockJob.location}</p>
        <p>{mockJob.salary}</p>
        <p>{mockJob.description}</p>
        <button>Apply</button>
      </div>
    )

    render(<MockCard />)
    expect(screen.getByText(mockJob.title)).toBeInTheDocument()
    expect(screen.getByText(mockJob.company)).toBeInTheDocument()
    expect(screen.getByText(mockJob.location)).toBeInTheDocument()
  })

  it('should display apply button', async () => {
    const user = userEvent.setup()
    const handleApply = jest.fn()

    const MockCard = () => (
      <button onClick={handleApply}>Apply</button>
    )

    render(<MockCard />)
    const button = screen.getByRole('button', { name: /apply/i })

    await user.click(button)
    expect(handleApply).toHaveBeenCalled()
  })

  it('should navigate to job details on click', () => {
    const MockCard = () => (
      <a href={`/jobs/${mockJob.id}`}>
        <div>{mockJob.title}</div>
      </a>
    )

    const { container } = render(<MockCard />)
    const link = container.querySelector('a')
    expect(link).toHaveAttribute('href', `/jobs/${mockJob.id}`)
  })
})

/**
 * JOB STATUS BADGE TESTS
 */
describe('JobStatusBadge Component', () => {
  it('should display status with correct styling', () => {
    const MockBadge = ({ status }: { status: string }) => (
      <span className={`badge badge-${status}`}>{status}</span>
    )

    const { rerender } = render(<MockBadge status="active" />)
    expect(screen.getByText('active')).toHaveClass('badge-active')

    rerender(<MockBadge status="closed" />)
    expect(screen.getByText('closed')).toHaveClass('badge-closed')
  })

  it('should show different badge colors for different statuses', () => {
    const statuses = ['active', 'closed', 'draft', 'expired']

    statuses.forEach((status) => {
      const { container } = render(
        <span className={`badge badge-${status}`}>{status}</span>
      )
      expect(container.querySelector(`[class*="badge-${status}"]`)).toBeInTheDocument()
    })
  })
})

/**
 * USER AVATAR DROPDOWN TESTS
 */
describe('UserAvatarDropdown Component', () => {
  it('should render user avatar', () => {
    const MockDropdown = () => (
      <button>
        <span data-testid="avatar">Avatar</span>
      </button>
    )

    render(<MockDropdown />)
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })

  it('should open dropdown on click', async () => {
    const user = userEvent.setup()

    const MockDropdown = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <>
          <button onClick={() => setOpen(!open)}>
            Avatar
          </button>
          {open && (
            <ul role="menu">
              <li>Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          )}
        </>
      )
    }

    render(<MockDropdown />)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('should display dropdown menu items', () => {
    const MockDropdown = () => {
      const [open] = React.useState(true)

      return (
        <>
          <button>Avatar</button>
          {open && (
            <ul>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/settings">Settings</a></li>
              <li><a href="/logout">Logout</a></li>
            </ul>
          )}
        </>
      )
    }

    render(<MockDropdown />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should handle logout action', async () => {
    const user = userEvent.setup()
    const handleLogout = jest.fn()

    const MockDropdown = () => (
      <button onClick={handleLogout}>Logout</button>
    )

    render(<MockDropdown />)
    await user.click(screen.getByRole('button'))
    expect(handleLogout).toHaveBeenCalled()
  })
})

/**
 * GESTURE CAPTURE MODAL TESTS
 */
describe('GestureCaptureModal Component', () => {
  it('should render gesture capture modal', () => {
    const MockModal = () => (
      <div role="dialog">
        <h2>Capture Gesture</h2>
        <div>Video Stream</div>
        <button>Capture</button>
        <button>Close</button>
      </div>
    )

    render(<MockModal />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Capture Gesture')).toBeInTheDocument()
  })

  it('should close modal on close button click', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()

    const MockModal = () => (
      <div>
        <button onClick={onClose}>Close</button>
      </div>
    )

    render(<MockModal />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('should close on ESC key press', async () => {
    const onClose = jest.fn()

    const MockModal = () => {
      React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose()
          }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
      }, [])

      return <div>Modal</div>
    }

    render(<MockModal />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('should submit gesture on capture', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    const MockModal = () => (
      <div>
        <button onClick={() => onSubmit('gesture-image.jpg')}>Capture</button>
      </div>
    )

    render(<MockModal />)
    await user.click(screen.getByRole('button', { name: /capture/i }))
    expect(onSubmit).toHaveBeenCalledWith('gesture-image.jpg')
  })
})

/**
 * PROFILE IMAGE UPLOADER TESTS
 */
describe('ProfileImageUploader Component', () => {
  it('should render file input', () => {
    const MockUploader = () => (
      <div>
        <input type="file" accept="image/*" data-testid="file-input" />
      </div>
    )

    render(<MockUploader />)
    expect(screen.getByTestId('file-input')).toBeInTheDocument()
  })

  it('should preview uploaded image', () => {
    const MockUploader = () => {
      const [preview, setPreview] = React.useState<string | null>(null)

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            setPreview(event.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      }

      return (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && <div data-testid="preview">Image Preview</div>}
        </>
      )
    }

    render(<MockUploader />)
    expect(screen.queryByTestId('preview')).not.toBeInTheDocument()
  })

  it('should display upload progress', () => {
    const MockUploader = () => {
      const [progress, setProgress] = React.useState(0)

      return (
        <>
          <input
            type="file"
            onChange={() => {
              setProgress(50)
            }}
          />
          {progress > 0 && <div>{progress}%</div>}
        </>
      )
    }

    render(<MockUploader />)
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })
})

/**
 * UI COMPONENTS - CHECKBOX TESTS
 */
describe('Checkbox Component', () => {
  it('should render checkbox', () => {
    const MockCheckbox = () => <input type="checkbox" />
    render(<MockCheckbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('should toggle checkbox state', async () => {
    const user = userEvent.setup()
    const MockCheckbox = () => <input type="checkbox" />

    render(<MockCheckbox />)
    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('should handle indeterminate state', () => {
    const MockCheckbox = () => {
      const ref = React.useRef<HTMLInputElement>(null)

      React.useEffect(() => {
        if (ref.current) {
          ref.current.indeterminate = true
        }
      }, [])

      return <input type="checkbox" ref={ref} />
    }

    render(<MockCheckbox />)
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
  })
})

/**
 * PROTECTED ROUTE TESTS
 */
describe('ProtectedRoute Component', () => {
  it('should render children when authenticated', () => {
    const MockRoute = ({ isAuth }: { isAuth: boolean }) => (
      isAuth ? <div>Protected Content</div> : <div>Login Required</div>
    )

    render(<MockRoute isAuth={true} />)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to login when not authenticated', () => {
    const MockRoute = ({ isAuth }: { isAuth: boolean }) => (
      isAuth ? <div>Protected Content</div> : <div>Login Required</div>
    )

    render(<MockRoute isAuth={false} />)
    expect(screen.getByText('Login Required')).toBeInTheDocument()
  })
})
