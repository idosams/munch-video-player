import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate to home page by default', async ({ page }) => {
    await page.goto('/');
    
    // Should show upload page as default
    await expect(page.locator('main h2')).toHaveText('Upload Video to Edit');
    
    // URL should be root
    expect(page.url()).toBe('http://localhost:5173/');
  });

  test('should handle invalid video routes gracefully', async ({ page }) => {
    // Try to navigate to a non-existent video
    await page.goto('/video/nonexistent-id');
    
    // Should redirect back to home or show error handling
    // This tests our error handling in VideoEditPage
    await page.waitForTimeout(1000); // Give time for potential redirects
    
    // Should either be on home page or show appropriate error
    const currentUrl = page.url();
    const isOnHomePage = currentUrl === 'http://localhost:5173/';
    const isStillOnVideoPage = currentUrl.includes('/video/');
    
    if (isOnHomePage) {
      await expect(page.locator('main h2')).toHaveText('Upload Video to Edit');
    } else if (isStillOnVideoPage) {
      // If still on video page, should show loading or error state
      await expect(page.locator('text=Loading project...')).toBeVisible();
    }
  });

  test('should maintain sidebar across all routes', async ({ page }) => {
    await page.goto('/');
    
    // Sidebar should be visible on home page
    await expect(page.locator('text=Video Library')).toBeVisible();
    
    // Try navigating to a video route (even if it doesn't exist)
    await page.goto('/video/test-id');
    
    // Sidebar should still be visible
    await expect(page.locator('text=Video Library')).toBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page.locator('main h2')).toHaveText('Upload Video to Edit');
    
    // Navigate to a video route
    await page.goto('/video/test-id');
    
    // Go back
    await page.goBack();
    await expect(page.locator('main h2')).toHaveText('Upload Video to Edit');
    
    // Go forward
    await page.goForward();
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Should either be on video route or redirected to home (if video doesn't exist)
    const currentUrl = page.url();
    const isOnVideoRoute = currentUrl.includes('/video/test-id');
    const isOnHomePage = currentUrl === 'http://localhost:5173/';
    
    expect(isOnVideoRoute || isOnHomePage).toBeTruthy();
  });

  test('should handle direct URL access', async ({ page }) => {
    // Test direct access to video route
    await page.goto('/video/direct-access-test');
    
    // Should handle the route appropriately
    await page.waitForTimeout(500);
    
    // Video library should still be visible
    await expect(page.locator('text=Video Library')).toBeVisible();
    
    // Should either show loading state or redirect to home
    const hasLoadingText = await page.locator('text=Loading project...').count() > 0;
    const hasUploadText = await page.locator('main h2:has-text("Upload Video to Edit")').count() > 0;
    
    expect(hasLoadingText || hasUploadText).toBeTruthy();
  });

  test('should preserve state during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Video library state should be preserved
    await expect(page.locator('text=Video Library')).toBeVisible();
    await expect(page.locator('text=No videos yet')).toBeVisible();
    
    // Navigate away and back
    await page.goto('/video/test');
    await page.goto('/');
    
    // State should be preserved
    await expect(page.locator('text=Video Library')).toBeVisible();
    await expect(page.locator('text=No videos yet')).toBeVisible();
  });
});