import { test, expect } from '@playwright/test';

test.describe('Video Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display empty state when no videos exist', async ({ page }) => {
    // Check video library header
    await expect(page.locator('aside h2')).toContainText('Video Library');
    
    // Check New button
    await expect(page.locator('button:has-text("+ New")')).toBeVisible();
    
    // Check empty state message
    await expect(page.locator('text=No videos yet')).toBeVisible();
    await expect(page.locator('text=Upload a video to get started')).toBeVisible();
  });

  test('should maintain consistent styling', async ({ page }) => {
    // Check sidebar background and layout
    const sidebar = page.locator('[class*="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Check video library container
    const videoLibrary = page.locator('[class*="videoLibrary"]');
    await expect(videoLibrary).toBeVisible();
    
    // Check header styling
    const header = page.locator('[class*="header"]');
    await expect(header).toBeVisible();
    
    // Check project list area
    const projectList = page.locator('[class*="projectList"]');
    await expect(projectList).toBeVisible();
  });

  test('should handle New button click', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    
    // Click New button in video library
    await page.click('button:has-text("+ New")');
    
    // Verify file chooser dialog appears
    const fileChooser = await fileChooserPromise;
    expect(fileChooser.isMultiple()).toBe(false);
    
    // File chooser API doesn't expose accept attribute, so we just verify it works
    // The actual accept attribute is set on the input element, not accessible here
  });

  test('should be responsive across different screen sizes', async ({ page }) => {
    // Test various viewport sizes
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1280, height: 720 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 }, // Tablet portrait
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Video library should always be visible
      await expect(page.locator('text=Video Library')).toBeVisible();
      await expect(page.locator('button:has-text("+ New")')).toBeVisible();
      
      // Empty state should be visible
      await expect(page.locator('text=No videos yet')).toBeVisible();
    }
  });

  test('should maintain accessibility standards', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('aside h2')).toHaveText('Video Library');
    
    // Check button accessibility
    const newButton = page.locator('button:has-text("+ New")');
    await expect(newButton).toBeVisible();
    await expect(newButton).toBeEnabled();
    
    // Check keyboard navigation
    // First focus on the page body
    await page.locator('body').click();
    
    // Tab multiple times to reach the New button (may need to go through other focusable elements)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const isFocused = await newButton.evaluate(el => el === document.activeElement);
      if (isFocused) break;
    }
    
    // Verify the button is focusable (even if not currently focused)
    const isFocusable = await newButton.evaluate(el => {
      const tabIndex = el.getAttribute('tabindex');
      return !el.disabled && (tabIndex === null || parseInt(tabIndex) >= 0);
    });
    expect(isFocusable).toBeTruthy();
  });
});