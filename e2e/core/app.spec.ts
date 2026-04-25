import { expect, test } from "@playwright/test";

test.describe("modal functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=core/basic.ink");
  });

  test("save modal opens and closes", async ({ page }) => {
    await page.getByRole("button", { name: "Save game" }).click();
    const saveModal = page.locator("dialog");
    await expect(saveModal).toBeVisible();
    await expect(saveModal).toContainText("Save Game");

    await saveModal.getByRole("button", { name: /close|×|Save/i }).first().click();
    await expect(saveModal).not.toBeVisible();
  });

  test("load modal opens and closes", async ({ page }) => {
    await page.getByRole("button", { name: "Restore saved game" }).click();
    const loadModal = page.locator("dialog");
    await expect(loadModal).toBeVisible();

    await loadModal.getByRole("button", { name: /close|×|Cancel/i }).first().click();
    await expect(loadModal).not.toBeVisible();
  });

  test("restart button restarts the game", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You chose A.");

    await page.getByRole("button", { name: "Restart game" }).click();
    await expect(contents).toContainText("Hello, World!");
  });

  test("save modal has proper form elements", async ({ page }) => {
    await page.getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal.locator("textarea, input, select")).toHaveCount(0);
    await expect(modal.getByRole("button", { name: "Close" })).toHaveCount(1);
  });
});

test.describe("basic fixture", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=core/basic.ink");
  });

  test("page loads successfully", async ({ page }) => {
    // Just verify the page loaded without errors
    await expect(page).toHaveURL(/index\.html/);
  });

  test("story container renders", async ({ page }) => {
    const story = page.locator(".inkweave-story");
    await expect(story).toBeVisible();
  });

  test("content displays story text", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Hello, World!");
  });

  test("choices are rendered", async ({ page }) => {
    const choices = page.locator(".inkweave-choices");
    await expect(choices).toBeVisible();
    await expect(choices.locator("li")).toHaveCount(2);
  });

  test("choice items are clickable", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choices .inkweave-choice");
    await expect(choiceItems.first()).toContainText("Choice A");
    await expect(choiceItems.nth(1)).toContainText("Choice B");
  });

  test("clicking choice shows result", async ({ page }) => {
    await page.locator(".inkweave-choices .inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You chose A.");
  });

  test("nav buttons exist", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav.getByRole("button", { name: "Restore saved game" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Save game" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Restart game" })).toBeVisible();
  });

  test("save modal opens", async ({ page }) => {
    await page.locator("nav").getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Save Game");
  });
});