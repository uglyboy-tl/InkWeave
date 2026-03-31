import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3141",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "edge",
      use: { channel: "msedge" },
    },
  ],
  webServer: {
    command: "serve -l 3141 .",
    url: "http://localhost:3141/e2e/fixtures/basic.html",
    reuseExistingServer: true,
  },
});