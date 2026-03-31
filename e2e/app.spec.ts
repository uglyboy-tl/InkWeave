import { expect, test } from "@playwright/test";

test.describe("basic fixture", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/basic.html");
  });

  test("page title", async ({ page }) => {
    await expect(page).toHaveTitle("E2E Basic Test");
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