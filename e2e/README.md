# E2E Tests

English | [中文](./README.zh-cn.md)

End-to-end tests for InkWeave using Playwright to verify ink syntax and plugin functionality.

## Directory Structure

```
e2e/
├── fixtures/
│   ├── index.html       # Unified test entry point
│   ├── assets/          # Shared resources (images, etc.)
│   ├── core/            # Core feature .ink files
│   ├── plugins/         # Plugin feature .ink files
│   └── syntax/          # Ink syntax .ink files
├── core/                # Core feature tests
├── plugins/             # Plugin feature tests
└── syntax/              # Ink syntax tests
```

## Running Tests

```bash
# Run all E2E tests
bun test:e2e

# Run directly with Playwright
bun run playwright test

# View test report
bun run playwright show-report
```

## Test Architecture

### Unified Entry Point

All E2E tests are driven via `fixtures/index.html` + URL parameters:

```
?story=<path>&plugins=<id1,id2|all>
```

**Examples:**

| URL | Description |
|-----|-------------|
| `?story=core/basic.ink` | Core feature test (no plugins) |
| `?story=plugins/auto-button.ink&plugins=auto-button` | Plugin test |
| `?story=syntax/basic-content.ink` | Syntax test |

### Framework Switching

Switch the tested framework via the `FRAMEWORK` environment variable:

```bash
# Test React (default)
FRAMEWORK=react bun run playwright test

# Test Svelte
FRAMEWORK=svelte bun run playwright test
```

### Helper Functions

`helpers.ts` provides `gotoFixture(page, params)` for unified navigation:

```typescript
import { gotoFixture } from "../helpers";

test.beforeEach(async ({ page }) => {
  await gotoFixture(page, "story=core/basic.ink&plugins=memory");
});
```

## Writing Tests

### Core Feature Tests (core/)

Test basic UI interactions: content display, choice clicking, save/load, restart, etc.

```typescript
test("clicking choice shows result", async ({ page }) => {
  await page.locator(".inkweave-choices .inkweave-choice").first().click();
  const contents = page.locator(".inkweave-contents");
  await expect(contents).toContainText("You chose A.");
});
```

### Plugin Tests (plugins/)

Test plugin-specific functionality. Each plugin has a corresponding `.ink` file and `.spec.ts` file.

```typescript
test.beforeEach(async ({ page }) => {
  await gotoFixture(page, "story=plugins/auto-button.ink&plugins=auto-button");
  await page.waitForSelector("#inkweave-story");
});

test("should automatically click auto buttons", async ({ page }) => {
  // ...
});
```

### Syntax Tests (syntax/)

Verify ink syntax correctness. One test file per syntax feature.

```typescript
test.beforeEach(async ({ page }) => {
  await gotoFixture(page, "story=syntax/basic-content.ink");
  await page.waitForSelector("#inkweave-story");
});

test("text content displays", async ({ page }) => {
  const contents = page.locator(".inkweave-contents");
  await expect(contents).toContainText("Hello, World!");
});
```

## Conventions

1. **Each `.ink` file is used by only one test suite**
2. **Use `gotoFixture()` + `page.waitForSelector("#inkweave-story")` in `beforeEach`**
3. **Do not call `page.goto()` inside individual `it` blocks**
4. **Use `expect(contents).toContainText(...)` to wait for content, not elements**
5. **New test workflow:** create .ink -> write spec.ts -> configure `beforeEach` -> regression test -> clean up old HTML fixtures

## License

MIT
