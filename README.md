# 🎯 Hiring Platform

A modern, full-featured hiring platform built with Next.js that enables companies to post job openings and manage candidate applications with gesture-based authentication and real-time updates.

## 📋 Project Overview

The Hiring Platform is a comprehensive recruitment management system designed to streamline the hiring process. It provides:

- **Job Management**: Create, update, and manage job postings
- **Candidate Applications**: Track and manage candidate applications with detailed profiles
- **Gesture-Based Authentication**: Secure login using hand gesture recognition for enhanced security
- **Admin Dashboard**: Powerful tools for recruiters to manage jobs and review candidates
- **Applicant Portal**: User-friendly interface for job seekers to browse and apply for positions
- **Real-time Updates**: Live data synchronization using Supabase
- **Responsive Design**: Fully responsive UI that works across all devices

## 🛠️ Tech Stack Used

### Frontend Framework
- **Next.js** (15.5.6) - React framework for production-ready web applications
- **React** (19.1.0) - JavaScript library for building user interfaces
- **TypeScript** (^5) - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS** (^4) - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
  - `@radix-ui/react-dialog` - Modal/Dialog components
  - `@radix-ui/react-popover` - Popover components
  - `@radix-ui/react-select` - Select/Dropdown components
  - `@radix-ui/react-avatar` - Avatar components
  - `@radix-ui/react-checkbox` - Checkbox components
- **Lucide React** (^0.546.0) - Beautiful icon library
- **React Icons** (^5.5.0) - Icon sets
- **class-variance-authority** - Type-safe CSS class management
- **clsx & tailwind-merge** - Conditional CSS utilities

### Database & Authentication
- **Supabase** (^2.75.1) - PostgreSQL database with real-time capabilities
- **Zod** (^4.1.12) - TypeScript-first schema validation

### Gesture Recognition & Media
- **Fingerpose** (^0.1.0) - Hand gesture recognition library
- **React Webcam** (^7.2.0) - Webcam component for React
- **TensorFlow.js** (implied via Fingerpose) - Machine learning for gesture detection

### State Management
- **Zustand** (^5.0.8) - Lightweight state management
- **React Context API** - Built-in React state management

### Testing & Quality
- **Jest** (^30.2.0) - JavaScript testing framework
- **@testing-library/react** (^16.3.0) - React component testing utilities
- **@testing-library/jest-dom** (^6.9.1) - Jest matchers for DOM
- **Playwright** (^1.56.1) - End-to-end testing framework
- **ESLint** (^9) - Code linting and quality

### Development Tools
- **ts-node** - TypeScript execution for Node.js
- **Turbopack** - Next.js bundler (used in dev/build)

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Git
- A Supabase account and project (for database)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hiring-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will start on [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack

# Production
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run unit tests with Jest
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run Playwright e2e tests
npm run test:e2e:ui     # Run e2e tests with UI
npm run test:e2e:debug  # Run e2e tests in debug mode

# Code Quality
npm run lint            # Run ESLint
```

## 📁 Project Structure

```
hiring-platform/
├── public/                          # Static assets
│   ├── icons/                       # Icon files
│   └── img/
│       └── pose/                    # Pose detection images
│
├── src/
│   ├── app/                         # Next.js app directory
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── __tests__/
│   │   │   └── pages.test.tsx       # Page component tests
│   │   │
│   │   ├── (admin)/                 # Admin routes (layout group)
│   │   │   ├── layout.tsx           # Admin layout
│   │   │   └── admin/
│   │   │       ├── jobs/
│   │   │       │   ├── page.tsx     # Jobs management page
│   │   │       │   └── [jobId]/
│   │   │       │       └── candidates/
│   │   │       │           └── page.tsx  # Candidates for specific job
│   │   │
│   │   ├── (applicant)/             # Applicant routes (layout group)
│   │   │   ├── layout.tsx           # Applicant layout
│   │   │   └── jobs/
│   │   │       ├── page.tsx         # Jobs listing page
│   │   │       └── [id]/
│   │   │           └── apply/
│   │   │               └── page.tsx # Job application page
│   │   │
│   │   └── auth/
│   │       └── login/
│   │           └── page.tsx         # Login page with gesture auth
│   │
│   ├── components/                  # React components
│   │   ├── ProtectedRoute.tsx       # Route protection wrapper
│   │   │
│   │   ├── __tests__/               # Component tests
│   │   │   ├── button.test.tsx
│   │   │   ├── component-tests.test.tsx
│   │   │   ├── input.test.tsx
│   │   │   └── integration.test.tsx
│   │   │
│   │   ├── feature/                 # Feature-specific components
│   │   │   ├── admin/
│   │   │   │   ├── candidates-table.tsx      # Candidate table with drag-drop
│   │   │   │   ├── create-job-modal.tsx      # Create job form modal
│   │   │   │   ├── job-card.tsx              # Job card component
│   │   │   │   ├── job-status-badge.tsx      # Status badge
│   │   │   │   └── user-avatar-dropdown.tsx  # User menu dropdown
│   │   │   │
│   │   │   └── gesture/
│   │   │       ├── gesture-capture-modal.tsx # Gesture capture UI
│   │   │       ├── gesture-overlay.tsx       # Camera overlay
│   │   │       ├── pose-sequence.tsx         # Pose display
│   │   │       └── profile-image-uploader.tsx # Image upload
│   │   │
│   │   └── ui/                      # Reusable UI primitives
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── checkbox.tsx
│   │       ├── chip.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── phone-input.tsx
│   │       ├── radio-button.tsx
│   │       ├── searchable-dropdown.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── __tests__/           # UI component tests
│   │       │   ├── button.test.tsx
│   │       │   └── input.test.tsx
│   │       │
│   │       └── calendar/            # Date picker components
│   │           ├── calendar.css
│   │           ├── calendar.tsx
│   │           └── datepicker.tsx
│   │
│   ├── context/                     # React context providers
│   │   ├── AuthContext.tsx          # Authentication context
│   │   └── DropdownContext.tsx      # Dropdown state context
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useGestureCapture.ts     # Gesture capture hook
│   │
│   ├── lib/                         # Utility functions & configs
│   │   ├── currency.ts              # Currency formatting
│   │   ├── domicile-options.ts      # Location options
│   │   ├── supabase.ts              # Supabase client setup
│   │   ├── utils.ts                 # General utilities
│   │   └── zod-schemas.ts           # Form validation schemas
│   │
│   ├── service/                     # Service hooks (data fetching)
│   │   └── useGetCountry.ts         # Country data fetching
│   │
│   ├── services/                    # Backend services
│   │   ├── database.ts              # Database operations
│   │   └── (other services)
│   │
│   └── types/                       # TypeScript type definitions
│       └── database.ts              # Database schema types
│
├── tests/                           # E2E and integration tests
│   └── e2e/
│       ├── auth.spec.ts             # Authentication e2e tests
│       └── home.spec.ts             # Home page e2e tests
│
├── Configuration Files
│   ├── next.config.ts               # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── postcss.config.mjs           # PostCSS configuration
│   ├── jest.config.ts               # Jest testing config
│   ├── jest.setup.ts                # Jest setup file
│   ├── playwright.config.ts         # Playwright e2e config
│   ├── eslint.config.mjs            # ESLint configuration
│   ├── components.json              # Component library config
│   ├── middleware.ts                # Next.js middleware
│   ├── package.json                 # Dependencies & scripts
│   └── next-env.d.ts                # Next.js type definitions
│
└── Documentation
    ├── README.md                    # This file
    ├── DOCUMENTATION.md             # Detailed component & design docs
    └── TESTING_SETUP_SUMMARY.md     # Testing setup guide
```

### Directory Purposes

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js app router pages and layouts |
| `src/components/` | Reusable React components |
| `src/components/ui/` | Low-level UI primitives |
| `src/components/feature/` | Business logic components |
| `src/context/` | Global state management |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Utility functions and helpers |
| `src/services/` | Database and API operations |
| `src/types/` | TypeScript type definitions |
| `tests/` | End-to-end tests |
| `public/` | Static files (images, icons) |

## ✨ Key Features Implemented

### Authentication & Security
- ✅ **Gesture-Based Login** - Secure authentication using hand gesture recognition
- ✅ **Protected Routes** - Role-based access control (Admin/Applicant)
- ✅ **Session Management** - Secure session handling with Supabase Auth

### Job Management (Admin)
- ✅ **Create Job Postings** - Admin can create new job openings with detailed descriptions
- ✅ **Manage Jobs** - View and update status job postings
- ✅ **Job Status Tracking** - Track job status (Open, Closed, etc.)
- ✅ **Candidate Review** - View all candidates who applied for specific jobs

### Candidate Management
- ✅ **Application Tracking** - Track candidate applications
- ✅ **Candidate Profiles** - Detailed candidate information and application history

### Job Application (Applicant)
- ✅ **Application Submission** - Apply for jobs with required information

### UI/UX Components
- ✅ **Design System** - Comprehensive design system with consistent theming
- ✅ **Responsive Layout** - Mobile-first responsive design
- ✅ **Form Validation** - Real-time form validation with Zod
- ✅ **Modal Dialogs** - Reusable modal components for job creation and more
- ✅ **Toast Notifications** - User feedback notifications
- ✅ **Avatar Components** - User profile avatars with dropdown menus

### Testing
- ✅ **Unit Tests** - Component and utility function tests
- ✅ **Integration Tests** - Feature integration testing
- ✅ **E2E Tests** - End-to-end user flow testing with Playwright
- ✅ **Test Coverage** - Comprehensive test coverage reports

## 🎨 Optional Enhancements You Added

### UI/UX Enhancements
- 🎯 **Custom Design System** - Tailored color palette and typography matching brand guidelines
- 🎯 **Gesture Overlay** - Real-time visual feedback during gesture capture
- 🎯 **Pose Sequence Display** - Shows detected hand pose positions

### Advanced Features
- 🎯 **Gesture Recognition System** - Advanced hand pose detection using Fingerpose
- 🎯 **Webcam Integration** - Real-time video capture for gesture authentication
- 🎯 **Phone Input Formatting** - International phone number input support

### Developer Experience
- 🎯 **TypeScript Strict Mode** - Full type safety throughout the application
- 🎯 **ESLint Configuration** - Custom ESLint rules for code quality
- 🎯 **Turbopack Integration** - Faster build times with next-generation bundler
- 🎯 **Jest Configuration** - Comprehensive testing setup with coverage

## 🏗️ Design or Logic Assumptions

### Authentication Flow
- Users authenticate via gesture recognition which requires webcam access
- Authentication tokens are securely stored and managed by Supabase
- Role-based access control determines whether users see Admin or Applicant UI

### Data Management
- Job and candidate data is stored in Supabase PostgreSQL database
- All data operations follow REST principles through Supabase API

### Gesture Recognition
- Gesture recognition requires adequate lighting conditions for optimal detection
- Hand poses are detected using Fingerpose library with TensorFlow.js
- Multiple pose sequences can be captured for validation

### UI/UX Design
- Mobile-first responsive design approach using Tailwind CSS
- Radix UI primitives provide accessibility (WCAG compliance) out of the box
- Form validation occurs client-side with Zod before server submission

### Component Architecture
- Reusable UI components in `/components/ui/` directory
- Feature-specific components in `/components/feature/` directory
- Shared business logic in custom hooks (`/hooks/`)
- Database operations centralized in `/services/`
---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 Project Documentation

For more detailed information about components, design system, and architecture, see [DOCUMENTATION.md](./DOCUMENTATION.md)

---

**Last Updated**: October 2025
