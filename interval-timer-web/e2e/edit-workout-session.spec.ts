import { test, expect } from '@playwright/test';
import { Session } from '../src/types';

test.describe('Edit Workout Session with Sub-items', () => {
  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // 1. Create a new session with a sub-item
    await page.goto('/');
    await page.getByRole('button', { name: 'Create New Session' }).click();

    // Add a sub-item to the first workout item
    await page.locator('div.bg-gray-700', { has: page.getByRole('heading', { name: 'Warm-up' }) })
      .getByRole('button', { name: 'Add Sub-item' }).click();

    // Fill in the sub-item details
    await page.locator('div.bg-gray-700', { has: page.getByRole('heading', { name: 'Warm-up' }) })
      .locator('input[placeholder="Sub-item title"]').fill('My Sub-item');
    await page.locator('div.bg-gray-700', { has: page.getByRole('heading', { name: 'Warm-up' }) })
      .locator('input[placeholder="mm:ss"]').fill('01:30');

    // Save the session
    await page.getByRole('button', { name: 'Save Session' }).click();
    await page.getByPlaceholder('Session Name').fill('Session with Sub-item');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Session saved successfully!')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Session with Sub-item' })).toBeVisible();

    // Get the session ID from local storage
    sessionId = await page.evaluate(() => {
      const sessions = JSON.parse(localStorage.getItem('intervalTimerSessions') || '[]') as Session[];
      const session = sessions.find(s => s.name === 'Session with Sub-item');
      return session!.id;
    });
  });

  test('should allow a user to edit a sub-item in an existing session', async ({ page }) => {
    // 2. Navigate to the edit page for that session
    await page.goto(`/edit-session/${sessionId}`);

    // 3. Verify that the sub-item is present
    await expect(page.locator('input[value="My Sub-item"]')).toBeVisible();
    await expect(page.locator('input[value="01:30"]')).toBeVisible();

    // 4. Edit the sub-item
    await page.locator('input[value="My Sub-item"]').fill('My Edited Sub-item');
    await page.locator('input[value="01:30"]').fill('02:00');

    // 5. Save the session
    await page.getByRole('button', { name: 'Save Session' }).click();
    await expect(page.getByRole('heading', { name: 'My Workout Sessions' })).toBeVisible();

    // 6. Verify that the changes to the sub-item have been saved
    await page.goto(`/edit-session/${sessionId}`);
    await expect(page.locator('input[value="My Edited Sub-item"]')).toBeVisible();
    await expect(page.locator('input[value="02:00"]')).toBeVisible();
  });
});
