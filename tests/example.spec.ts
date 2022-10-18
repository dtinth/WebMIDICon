import { test, expect } from '@playwright/test'

test('UI elements', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('WebMIDICon').first()).toBeVisible()
  await expect(page.getByText('Transpose').first()).toBeVisible()
  await expect(page.getByText('Octave').first()).toBeVisible()
})
