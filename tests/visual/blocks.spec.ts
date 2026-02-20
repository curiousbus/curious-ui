import { expect, test } from "@playwright/test";

const STORIES = [
  { id: "blocks-cta-banner--default", name: "cta-banner" },
  { id: "blocks-hero-split--default", name: "hero-split" }
];

test.describe("blocks visual regression", () => {
  for (const story of STORIES) {
    test(`${story.name} matches baseline`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForSelector("#storybook-root > *");
      await expect(page).toHaveScreenshot(`${story.name}.png`, {
        fullPage: true
      });
    });
  }
});
