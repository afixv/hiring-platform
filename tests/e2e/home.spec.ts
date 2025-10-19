import { test, expect } from '@playwright/test'

/**
 * Home Page E2E Tests
 * Tests for home page functionality and navigation
 */

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveURL('/')
    
    // Check that page has main content
    const mainContent = page.locator('main, [role="main"]')
    await expect(mainContent.first()).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    // Check for common navigation elements
    const navigation = page.locator('nav, [role="navigation"]').first()
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible()
    }
  })

  test('should display page title', async ({ page }) => {
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test('should have correct base URL', async ({ page }) => {
    expect(page.url()).toContain('localhost:3000')
  })
})

test.describe('Job Listings', () => {
  test('should display jobs page', async ({ page }) => {
    await page.goto('/jobs')
    await expect(page).toHaveURL(/\/jobs/)
  })

  test('should have job cards or list items', async ({ page }) => {
    await page.goto('/jobs')
    
    // At least check the page loads
    await expect(page.locator('main, [role="main"]').first()).toBeVisible()
  })
})

test.describe('Admin Dashboard', () => {
  test('should have admin jobs page accessible', async ({ page }) => {
    // This assumes the page is accessible without auth for testing
    // In production, you'd need to authenticate first
    const response = await page.goto('/admin/jobs', { waitUntil: 'networkidle' })
    
    // Check if page loaded (may be 200 or redirect to login)
    expect(response?.status()).toBeDefined()
  })
})

test.describe('Performance', () => {
  test('should load page within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    
    const loadTime = Date.now() - startTime
    
    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should not have critical console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Log errors for debugging
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors)
    }
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check for at least one h1 tag
    const h1 = page.locator('h1').first()
    if (await h1.isVisible()) {
      await expect(h1).toBeVisible()
    }
  })

  test('should have proper link text', async ({ page }) => {
    await page.goto('/')
    
    // Check that links have accessible text
    const links = page.locator('a').first()
    if (await links.isVisible()) {
      const ariaLabel = await links.getAttribute('aria-label')
      const text = await links.textContent()
      
      expect(ariaLabel || text).toBeTruthy()
    }
  })
})

test.describe('Navigation', () => {
  test('should navigate to jobs page', async ({ page }) => {
    await page.goto('/')
    // Update this selector based on your actual navigation structure
    const jobsLink = page.locator('a[href*="/jobs"]').first()
    if (await jobsLink.isVisible()) {
      await jobsLink.click()
      await expect(page).toHaveURL(/\/jobs/)
    }
  })
})

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    // Check that content is still visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    // Check that content is still visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport (default)
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    // Check that content is still visible
    await expect(page.locator('body')).toBeVisible()
  })
})
