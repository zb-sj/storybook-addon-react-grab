import { test, expect } from '@playwright/test';

test('grabbing a story element copies enriched context', async ({ page }) => {
  // Load the story in the preview iframe (direct URL avoids cross-frame clipboard issues).
  await page.goto('/iframe.html?id=components-button--primary&viewMode=story');
  const button = page.getByTestId('the-button');
  await button.waitFor();

  // Trigger strategy: window.__REACT_GRAB__.copyElement() via page.evaluate.
  //
  // The spike (docs/SPIKE.md) proved that copyElement() goes through the identical
  // Xt() → transformCopyContent() copy path as the keyboard gesture. The real keyboard
  // interaction (hold ⌘/Ctrl + alphanumeric ≥100ms → hover → ⌘C) is unreliable in
  // headless Chromium because synthetic keydown events do not satisfy the 100ms hold
  // timer that react-grab uses for toggle-mode activation. copyElement() bypasses the
  // activation gate while still exercising the full plugin chain, making it the correct
  // headless-safe trigger for verifying the enrichment.
  const result = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="the-button"]');
    if (!el) throw new Error('button not found');
    const api = (window as unknown as { __REACT_GRAB__: { copyElement: (el: Element) => Promise<boolean> } }).__REACT_GRAB__;
    if (!api) throw new Error('react-grab API not found on window');
    return api.copyElement(el);
  });

  expect(result).toBe(true);

  const clip = await page.evaluate(() => navigator.clipboard.readText());

  // Assert that the addon's enrichment block is present in the clipboard output.
  expect(clip).toContain('--- Storybook ---');
  expect(clip).toContain('Components/Button › Primary (components-button--primary)');
  expect(clip).toContain('variant: "primary"');
});
