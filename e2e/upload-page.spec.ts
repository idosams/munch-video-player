import { test, expect } from '@playwright/test';

test.describe('Upload Page', () => {
  test('should display upload interface when no videos exist', async ({ page }) => {
    await page.goto('/');

    // Check that upload page is displayed
    await expect(page.locator('main h2')).toHaveText('Upload Video to Edit');
    await expect(page.locator('main p').first()).toHaveText('Choose a video file to start editing');
    
    // Check upload button exists
    await expect(page.locator('label[for="video-upload"]')).toHaveText('Choose Video File');
    
    // Check supported formats info
    await expect(page.locator('text=Supported formats: MP4, WebM, OGV, MOV')).toBeVisible();
  });

  test('should show video library sidebar', async ({ page }) => {
    await page.goto('/');

    // Check sidebar is present
    await expect(page.locator('text=Video Library')).toBeVisible();
    await expect(page.locator('text=+ New')).toBeVisible();
    
    // Check empty state
    await expect(page.locator('text=No videos yet')).toBeVisible();
    await expect(page.locator('text=Upload a video to get started')).toBeVisible();
  });

  test('should trigger file upload when clicking New button', async ({ page }) => {
    await page.goto('/');

    // Mock file chooser dialog
    const fileChooserPromise = page.waitForEvent('filechooser');
    
    // Click the New button
    await page.click('text=+ New');
    
    // Verify file chooser was triggered
    const fileChooser = await fileChooserPromise;
    expect(fileChooser.isMultiple()).toBe(false);
  });

  test('should handle responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    // Check sidebar is visible
    await expect(page.locator('[class*="sidebar"]')).toBeVisible();
    
    // Check main content area
    await expect(page.locator('[class*="mainContent"]')).toBeVisible();
    
    // Test smaller viewport
    await page.setViewportSize({ width: 800, height: 600 });
    
    // Layout should still be functional
    await expect(page.locator('text=Video Library')).toBeVisible();
    await expect(page.locator('main h2')).toHaveText('Upload Video to Edit');
  });
});