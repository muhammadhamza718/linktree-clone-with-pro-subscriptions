// E2E test for registration flow
import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test('should allow new user to register and create profile', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill in registration form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Password').fill('SecurePassword123!');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should redirect to profile setup
    await expect(page).toHaveURL(/\/profile/);

    // Fill in profile information
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Display Name').fill('Test User');
    await page.getByLabel('Bio').fill('This is my bio');

    // Save profile
    await page.getByRole('button', { name: 'Save Profile' }).click();

    // Should redirect to dashboard or show success
    await expect(page.getByText('Profile saved successfully')).toBeVisible();
  });

  test('should show validation errors for invalid registration data', async ({ page }) => {
    await page.goto('/register');

    // Submit empty form
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should show validation errors
    await expect(page.getByText('Valid email is required')).toBeVisible();
    await expect(page.getByText('Name is required')).toBeVisible();
  });
});