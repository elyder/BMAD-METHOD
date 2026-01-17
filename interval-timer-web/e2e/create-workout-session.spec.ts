import { test, expect } from '@playwright/test';

test.describe('Create New Workout Session', () => {
  test('should allow a user to create and save a new workout session with default items', async ({ page }) => {
    await page.goto('/');

    // 1. Clicking "Create New Session" shall load a predefined session
    // Find and click the "Create New Session" button
    await page.getByRole('button', { name: 'Create New Session' }).click();

    // Verify that the page navigates to a new session creation form/page
    await expect(page.getByRole('heading', { name: 'New Session' })).toBeVisible();

    // 2. Verify default items (Warm-up, Actions, Cooldown) are present and have the correct durations
    const warmUpItem = page.locator('div.bg-gray-700', { has: page.getByRole('heading', { name: 'Warm-up' }) });
    await expect(warmUpItem).toBeVisible();
    await expect(warmUpItem.getByText('10:00')).toBeVisible();

    const actionsItem = page.locator('div.bg-gray-700', { has: page.getByRole('heading', { name: 'Actions' }) });
    await expect(actionsItem).toBeVisible();
    await expect(actionsItem.getByText('30:00')).toBeVisible();

    const cooldownItem = page.locator('div.bg-gray-700', { has: page.getByRole('heading', { name: 'Cooldown' }) });
    await expect(cooldownItem).toBeVisible();
    await expect(cooldownItem.getByText('10:00')).toBeVisible();

    // 6. During the creation of a session a total time shall show the duration of the session
    await expect(page.locator('div.bg-gray-800')).toContainText('Total Time: 50:00');

    // Attempt to save the session - should prompt for a name
    await page.getByRole('button', { name: 'Save Session' }).click();

    // Verify the prompt for a name (this might be a dialog, an inline error, etc.)
    await expect(page.getByPlaceholder('Session Name')).toBeVisible();

    // Enter a session name and save
    await page.getByPlaceholder('Session Name').fill('My First Workout');
    await page.getByRole('button', { name: 'Save', exact: true }).click(); // Use exact: true for the Save button

    // Verify successful saving - e.g., redirect to session overview or a success message
    await expect(page.getByText('Session saved successfully!')).toBeVisible();
    
    // The page should redirect to the home page where the new session is listed
    await expect(page.getByRole('heading', { name: 'My First Workout' })).toBeVisible();
  });

  // TODO: Add more detailed tests for editing, duplicating, deleting items within a session
  // TODO: Add tests for naming collision
});
