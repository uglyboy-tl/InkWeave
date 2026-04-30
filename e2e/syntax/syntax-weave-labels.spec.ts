import { expect, test } from "@playwright/test";

test.describe("ink syntax - weave labels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/weave-labels.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("gather point can be labelled", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("The guard frowns at you.");
  });

  test("option can be labelled", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(2);
  });

  test("conditional choice appears after labelled option selected", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toContainText("Having a nice day?");
  });

  test("different conditional choice after different option", async ({ page }) => {
    await page.locator(".inkweave-choice").nth(1).click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toContainText("Shove him aside");
  });

  test("labelled gather content displays", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("'Hmm,' replies the guard.");
  });
});
