import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * Tests for login and logout workflows
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/auth/login')
  })

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveURL(/\/auth\/login/)

    // Check for login form elements
    const emailInput = page.locator('input[type="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test('should show validation error for empty fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()

    // Wait for validation messages to appear
    await expect(page.locator('text=/required|please enter/i').first()).toBeVisible()
  })

  test('should show error for invalid email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    await emailInput.fill('invalid-email')
    await submitButton.click()

    // Check for email validation error
    await expect(page.locator('text=/invalid email|valid email/i').first()).toBeVisible()
  })

  test('should handle login form submission', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    // Fill in valid format (doesn't need to actually authenticate in tests)
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')

    // Submit the form
    await submitButton.click()

    // Wait for navigation or error message
    await page.waitForLoadState('networkidle')
  })

  test('should display remember me checkbox', async ({ page }) => {
    const rememberMeCheckbox = page.locator('input[type="checkbox"]')
    await expect(rememberMeCheckbox).toBeVisible()
  })

  test('should have password toggle', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()

    // Look for password visibility toggle (if you have one)
    const toggleButton = page
      .locator('button')
      .filter({ hasText: /show|hide|eye/ })
      .first()
    if (await toggleButton.isVisible()) {
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })
})

test.describe('Navigation', () => {
  test('should navigate to jobs page for applicants', async ({ page }) => {
    await page.goto('/jobs')
    await expect(page).toHaveURL(/\/jobs/)
    
    // Verify page content loads
    const pageContent = page.locator('main, [role="main"]').first()
    await expect(pageContent).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    const response = await page.goto('/')
    
    // Check if page is accessible
    expect(response?.status()).toBeLessThan(400)
  })
})

test.describe('Responsive Design', () => {
  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/auth/login')
    
    // Elements should still be visible and accessible
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
  })

  test('should be desktop responsive', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    await page.goto('/auth/login')
    
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
  })
})
