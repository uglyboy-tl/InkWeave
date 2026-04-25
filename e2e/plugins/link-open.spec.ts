import { test, expect } from "@playwright/test";

const TEST_URL = "/e2e/fixtures/index.html?story=plugins/link-open.ink&plugins=link-open";

test.describe("Link Open Plugin", () => {

  test("should compile without errors", async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];

    page.on("console", (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
      });
    });

    await page.goto(TEST_URL);
    await page.waitForSelector(".inkweave-story");

    const hasCompilationError = consoleMessages.some(
      (msg) =>
        msg.text.includes("Failed to initialize") ||
        msg.text.includes("Compilation failed"),
    );
    expect(hasCompilationError).toBe(false);
  });

  test("should open HTTPS link when tag is triggered", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__openedUrls = [];
      window.open = ((url?: string | URL | undefined) => {
        (window as any).__openedUrls.push(url);
        return null;
      }) as any;
    });

    await page.goto(TEST_URL);
    await page.waitForSelector(".inkweave-story");

    await page.locator('.inkweave-choice:has-text("Open HTTPS Link")').click();

    const urls = await page.evaluate(() => (window as any).__openedUrls);
    expect(urls).toContain("https:example.com");
  });

  test("should open HTTP link when tag is triggered", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__openedUrls = [];
      window.open = ((url?: string | URL | undefined) => {
        (window as any).__openedUrls.push(url);
        return null;
      }) as any;
    });

    await page.goto(TEST_URL);
    await page.waitForSelector(".inkweave-story");

    await page.locator('.inkweave-choice:has-text("Open HTTP Link")').click();

    const urls = await page.evaluate(() => (window as any).__openedUrls);
    expect(urls).toContain("http:example.org");
  });

  test("should display content after clicking link", async ({ page }) => {
    await page.addInitScript(() => {
      window.open = () => null;
    });

    await page.goto(TEST_URL);
    await page.waitForSelector(".inkweave-story");

    await page.locator('.inkweave-choice:has-text("Open HTTPS Link")').click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You clicked the HTTPS link!");
  });

  test("should open URL with slash when tag is triggered", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__openedUrls = [];
      window.open = ((url?: string | URL | undefined) => {
        (window as any).__openedUrls.push(url);
        return null;
      }) as any;
    });

    await page.goto(TEST_URL);
    await page.waitForSelector(".inkweave-story");

    await page.locator('.inkweave-choice:has-text("Open URL with Slash")').click();

    const urls = await page.evaluate(() => (window as any).__openedUrls);
    expect(urls).toContain("https:example.com/path/to/page");
  });

  test("should handle relative path to existing page", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__openedUrls = [];
      window.open = ((url?: string | URL | undefined) => {
        (window as any).__openedUrls.push(url);
        return null;
      }) as any;
    });

    await page.goto(TEST_URL);
    await page.waitForSelector(".inkweave-story");

    await page.locator('.inkweave-choice:has-text("Open Relative Path")').click();

    const urls = await page.evaluate(() => (window as any).__openedUrls);
    expect(urls).toContain("http:../core/basic.html");
  });
});
