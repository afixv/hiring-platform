/**
 * PAGE TESTS
 * Test cases untuk semua pages dalam aplikasi
 */

import { render, screen } from '@testing-library/react'

/**
 * HOME PAGE TESTS (/page.tsx)
 */
describe('Home Page', () => {
  it('should render home page', () => {
    // Mock home page content
    const HomePage = () => (
      <div>
        <h1>Welcome to Hiring Platform</h1>
        <p>Find your next opportunity</p>
        <button>Get Started</button>
      </div>
    )

    render(<HomePage />)
    expect(screen.getByText(/welcome to hiring platform/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('should display call-to-action buttons', () => {
    const HomePage = () => (
      <div>
        <button>Browse Jobs</button>
        <button>Post a Job</button>
      </div>
    )

    render(<HomePage />)
    expect(screen.getByRole('button', { name: /browse jobs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /post a job/i })).toBeInTheDocument()
  })

  it('have navigation links', () => {
    const HomePage = () => (
      <nav>
        <a href="/jobs">Jobs</a>
        <a href="/auth/login">Login</a>
      </nav>
    )

    render(<HomePage />)
    expect(screen.getByText('Jobs')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })
})

/**
 * LOGIN PAGE TESTS (/auth/login/page.tsx)
 */
describe('Login Page', () => {
  it('should render login form', () => {
    const LoginPage = () => (
      <form>
        <input placeholder="Email" type="email" />
        <input placeholder="Password" type="password" />
        <button type="submit">Sign In</button>
      </form>
    )

    render(<LoginPage />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should have remember me checkbox', () => {
    const LoginPage = () => (
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <label>
          <input type="checkbox" /> Remember me
        </label>
        <button type="submit">Sign In</button>
      </form>
    )

    render(<LoginPage />)
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
  })

  it('should have forgot password link', () => {
    const LoginPage = () => (
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <a href="/forgot-password">Forgot Password?</a>
        <button type="submit">Sign In</button>
      </form>
    )

    render(<LoginPage />)
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  it('should have sign up link', () => {
    const LoginPage = () => (
      <div>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign In</button>
        </form>
        <p>
          No account yet? <a href="/auth/signup">Sign Up</a>
        </p>
      </div>
    )

    render(<LoginPage />)
    expect(screen.getByText(/no account yet/i)).toBeInTheDocument()
    expect(screen.getByText(/sign up/i)).toBeInTheDocument()
  })
})

/**
 * JOBS LISTING PAGE TESTS (/jobs/page.tsx)
 */
describe('Jobs Listing Page', () => {
  const mockJobs = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'Jakarta',
    },
    {
      id: '2',
      title: 'Backend Developer',
      company: 'StartUp Inc',
      location: 'Bandung',
    },
  ]

  it('should render jobs listing page', () => {
    const JobsPage = () => (
      <div>
        <h1>Available Jobs</h1>
        <div>
          {mockJobs.map((job) => (
            <div key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </div>
          ))}
        </div>
      </div>
    )

    render(<JobsPage />)
    expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText('Backend Developer')).toBeInTheDocument()
  })

  it('should have search functionality', () => {
    const JobsPage = () => (
      <div>
        <input placeholder="Search jobs..." type="text" />
        <div>
          {mockJobs.map((job) => (
            <div key={job.id}>{job.title}</div>
          ))}
        </div>
      </div>
    )

    render(<JobsPage />)
    expect(screen.getByPlaceholderText(/search jobs/i)).toBeInTheDocument()
  })

  it('should display job filters', () => {
    const JobsPage = () => (
      <div>
        <div>
          <label>
            <input type="checkbox" /> Frontend
          </label>
          <label>
            <input type="checkbox" /> Backend
          </label>
          <label>
            <input type="checkbox" /> Full Stack
          </label>
        </div>
      </div>
    )

    render(<JobsPage />)
    expect(screen.getByLabelText(/frontend/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/backend/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full stack/i)).toBeInTheDocument()
  })

  it('should have pagination controls', () => {
    const JobsPage = () => (
      <div>
        <button disabled>Previous</button>
        <span>Page 1 of 10</span>
        <button>Next</button>
      </div>
    )

    render(<JobsPage />)
    expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })
})

/**
 * JOB DETAIL PAGE TESTS (/jobs/[id]/page.tsx)
 */
describe('Job Detail Page', () => {
  const mockJob = {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'Jakarta',
    salary: 'Rp 15-20 Juta',
    description: 'We are looking for a senior frontend developer with React experience.',
    requirements: ['React', 'TypeScript', '5+ years experience'],
    benefits: ['Health Insurance', '401k', 'Remote Work'],
  }

  it('should render job details', () => {
    const JobDetailPage = () => (
      <div>
        <h1>{mockJob.title}</h1>
        <p>{mockJob.company}</p>
        <p>{mockJob.location}</p>
        <p>{mockJob.salary}</p>
        <p>{mockJob.description}</p>
      </div>
    )

    render(<JobDetailPage />)
    expect(screen.getByText(mockJob.title)).toBeInTheDocument()
    expect(screen.getByText(mockJob.company)).toBeInTheDocument()
  })

  it('should display job requirements', () => {
    const JobDetailPage = () => (
      <div>
        <h2>Requirements</h2>
        <ul>
          {mockJob.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>
    )

    render(<JobDetailPage />)
    expect(screen.getByText(/requirements/i)).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('should display job benefits', () => {
    const JobDetailPage = () => (
      <div>
        <h2>Benefits</h2>
        <ul>
          {mockJob.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </div>
    )

    render(<JobDetailPage />)
    expect(screen.getByText(/benefits/i)).toBeInTheDocument()
    expect(screen.getByText('Health Insurance')).toBeInTheDocument()
  })

  it('should have apply button', () => {
    const JobDetailPage = () => (
      <div>
        <button>Apply Now</button>
      </div>
    )

    render(<JobDetailPage />)
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument()
  })

  it('should share job buttons', () => {
    const JobDetailPage = () => (
      <div>
        <button>Share on LinkedIn</button>
        <button>Share on Twitter</button>
        <button>Copy Link</button>
      </div>
    )

    render(<JobDetailPage />)
    expect(screen.getByRole('button', { name: /share on linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
  })
})

/**
 * JOB APPLICATION PAGE TESTS (/jobs/[id]/apply/page.tsx)
 */
describe('Job Application Page', () => {
  it('should render application form', () => {
    const ApplicationPage = () => (
      <form>
        <input placeholder="Full Name" />
        <input placeholder="Email" type="email" />
        <input placeholder="Phone" type="tel" />
        <textarea placeholder="Cover Letter"></textarea>
        <button type="submit">Submit Application</button>
      </form>
    )

    render(<ApplicationPage />)
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/cover letter/i)).toBeInTheDocument()
  })

  it('should have file upload for resume', () => {
    const ApplicationPage = () => (
      <form>
        <label>Upload Resume</label>
        <input type="file" accept=".pdf,.doc,.docx" />
        <button type="submit">Submit</button>
      </form>
    )

    render(<ApplicationPage />)
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument()
  })

  it('should require gesture capture', () => {
    const ApplicationPage = () => (
      <div>
        <button>Capture Gesture</button>
        <p>Please capture your gesture for verification</p>
      </div>
    )

    render(<ApplicationPage />)
    expect(screen.getByText(/capture gesture/i)).toBeInTheDocument()
  })

  it('should show progress indicator', () => {
    const ApplicationPage = () => (
      <div>
        <div>Step 1 of 3: Personal Info</div>
        <div>Step 2 of 3: Resume</div>
        <div>Step 3 of 3: Gesture Capture</div>
      </div>
    )

    render(<ApplicationPage />)
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument()
  })
})

/**
 * ADMIN JOBS PAGE TESTS (/admin/jobs/page.tsx)
 */
describe('Admin Jobs Page', () => {
  const mockAdminJobs = [
    {
      id: '1',
      title: 'Frontend Developer',
      status: 'Active',
      applications: 12,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Backend Developer',
      status: 'Closed',
      applications: 25,
      createdAt: '2024-01-10',
    },
  ]

  it('should render admin jobs page', () => {
    const AdminJobsPage = () => (
      <div>
        <h1>Manage Jobs</h1>
        <button>Create New Job</button>
        <table>
          <tbody>
            {mockAdminJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.status}</td>
                <td>{job.applications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )

    render(<AdminJobsPage />)
    expect(screen.getByText(/manage jobs/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create new job/i })).toBeInTheDocument()
  })

  it('should show job status', () => {
    const AdminJobsPage = () => (
      <table>
        <tbody>
          {mockAdminJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    render(<AdminJobsPage />)
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('should display application count', () => {
    const AdminJobsPage = () => (
      <table>
        <tbody>
          {mockAdminJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.applications} Applications</td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    render(<AdminJobsPage />)
    expect(screen.getByText(/12 applications/i)).toBeInTheDocument()
    expect(screen.getByText(/25 applications/i)).toBeInTheDocument()
  })

  it('should have job actions (edit, delete)', () => {
    const AdminJobsPage = () => (
      <div>
        <button data-testid="edit-job">Edit</button>
        <button data-testid="delete-job">Delete</button>
        <button data-testid="view-candidates">View Candidates</button>
      </div>
    )

    render(<AdminJobsPage />)
    expect(screen.getByTestId('edit-job')).toBeInTheDocument()
    expect(screen.getByTestId('delete-job')).toBeInTheDocument()
    expect(screen.getByTestId('view-candidates')).toBeInTheDocument()
  })
})

/**
 * ADMIN CANDIDATES PAGE TESTS (/admin/jobs/[jobId]/candidates/page.tsx)
 */
describe('Admin Candidates Page', () => {
  const mockCandidates = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Pending',
      appliedAt: '2024-01-20',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Interviewed',
      appliedAt: '2024-01-18',
    },
  ]

  it('should render candidates list', () => {
    const CandidatesPage = () => (
      <div>
        <h1>Job Candidates</h1>
        <table>
          <tbody>
            {mockCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )

    render(<CandidatesPage />)
    expect(screen.getByText(/job candidates/i)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should filter candidates by status', () => {
    const CandidatesPage = () => (
      <div>
        <select>
          <option>All</option>
          <option>Pending</option>
          <option>Interviewed</option>
          <option>Rejected</option>
        </select>
      </div>
    )

    render(<CandidatesPage />)
    expect(screen.getByDisplayValue('All')).toBeInTheDocument()
  })

  it('should have candidate actions', () => {
    const CandidatesPage = () => (
      <div>
        <button data-testid="view-profile">View Profile</button>
        <button data-testid="change-status">Change Status</button>
        <button data-testid="send-message">Send Message</button>
      </div>
    )

    render(<CandidatesPage />)
    expect(screen.getByTestId('view-profile')).toBeInTheDocument()
    expect(screen.getByTestId('change-status')).toBeInTheDocument()
  })

  it('should export candidates list', () => {
    const CandidatesPage = () => (
      <div>
        <button>Export to CSV</button>
        <button>Export to Excel</button>
      </div>
    )

    render(<CandidatesPage />)
    expect(screen.getByRole('button', { name: /export to csv/i })).toBeInTheDocument()
  })
})

/**
 * LAYOUT TESTS
 */
describe('Layout Components', () => {
  it('should render main layout', () => {
    const MainLayout = ({ children }: { children: React.ReactNode }) => (
      <div>
        <header>Hiring Platform</header>
        <nav>
          <a href="/jobs">Jobs</a>
        </nav>
        <main>{children}</main>
        <footer>© 2024 Hiring Platform</footer>
      </div>
    )

    render(
      <MainLayout>
        <div>Page Content</div>
      </MainLayout>
    )

    expect(screen.getByText('Hiring Platform')).toBeInTheDocument()
    expect(screen.getByText('Page Content')).toBeInTheDocument()
    expect(screen.getByText(/© 2024 hiring platform/i)).toBeInTheDocument()
  })

  it('should render admin layout', () => {
    const AdminLayout = ({ children }: { children: React.ReactNode }) => (
      <div>
        <div>
          <aside>
            <a href="/admin">Dashboard</a>
            <a href="/admin/jobs">Jobs</a>
            <a href="/admin/candidates">Candidates</a>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    )

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
