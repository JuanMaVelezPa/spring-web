import { expect, test } from '@playwright/test';

test('smoke: login -> list -> create branch', async ({ page }) => {
  const uniqueCode = `BR-${Date.now()}`;

  await page.goto('/login');

  await page.getByTestId('login-username').fill(process.env.E2E_USER ?? 'admin');
  await page.getByTestId('login-password').fill(process.env.E2E_PASSWORD ?? 'Admin_ChangeMe_2026!');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/branches$/);
  await expect(page.getByRole('heading', { name: /branches/i })).toBeVisible();

  await page.getByRole('link', { name: /new branch/i }).click();
  await expect(page).toHaveURL(/\/branches\/new$/);

  await page.getByTestId('branch-code').fill(uniqueCode);
  await page.getByTestId('branch-name').fill(`Smoke ${uniqueCode}`);
  await page.getByTestId('branch-city').fill('Bogota');
  await page.getByTestId('branch-submit').click();

  await expect(page).toHaveURL(/\/branches$/);
  await expect(page.getByRole('cell', { name: uniqueCode, exact: true })).toBeVisible();
});
