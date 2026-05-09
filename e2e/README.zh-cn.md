# E2E 测试

[English](./README.md) | 中文

InkWeave 的端到端测试，使用 Playwright 验证 ink 语法和插件功能。

## 目录结构

```
e2e/
├── fixtures/
│   ├── index.html       # 统一测试入口
│   ├── assets/          # 公共资源（图片等）
│   ├── core/            # 核心功能 .ink 文件
│   ├── plugins/         # 插件功能 .ink 文件
│   └── syntax/          # ink 语法 .ink 文件
├── core/                # 核心功能测试
├── plugins/             # 插件功能测试
└── syntax/              # ink 语法测试
```

## 运行测试

```bash
# 运行所有 E2E 测试
bun test:e2e

# 使用 Playwright 直接运行
bun run playwright test

# 查看测试报告
bun run playwright show-report
```

## 测试架构

### 统一入口

所有 E2E 测试通过 `fixtures/index.html` + URL 参数驱动：

```
?story=<路径>&plugins=<id1,id2|all>
```

**示例：**

| URL | 说明 |
|-----|------|
| `?story=core/basic.ink` | 核心功能测试（不启用插件） |
| `?story=plugins/auto-button.ink&plugins=auto-button` | 插件测试 |
| `?story=syntax/basic-content.ink` | 语法测试 |

### 框架切换

通过 `FRAMEWORK` 环境变量切换测试的框架：

```bash
# 测试 React（默认）
FRAMEWORK=react bun run playwright test

# 测试 Svelte
FRAMEWORK=svelte bun run playwright test
```

### 辅助函数

`helpers.ts` 提供 `gotoFixture(page, params)` 统一导航：

```typescript
import { gotoFixture } from "../helpers";

test.beforeEach(async ({ page }) => {
  await gotoFixture(page, "story=core/basic.ink&plugins=memory");
});
```

## 编写测试

### 核心功能测试（core/）

测试基本 UI 交互：内容显示、选项点击、存档/读档、重启等。

```typescript
test("clicking choice shows result", async ({ page }) => {
  await page.locator(".inkweave-choices .inkweave-choice").first().click();
  const contents = page.locator(".inkweave-contents");
  await expect(contents).toContainText("You chose A.");
});
```

### 插件测试（plugins/）

测试插件特定功能。每个插件对应一个 `.ink` 文件和一个 `.spec.ts` 文件。

```typescript
test.beforeEach(async ({ page }) => {
  await gotoFixture(page, "story=plugins/auto-button.ink&plugins=auto-button");
  await page.waitForSelector("#inkweave-story");
});

test("should automatically click auto buttons", async ({ page }) => {
  // ...
});
```

### 语法测试（syntax/）

验证 ink 语法正确性。每个语法特性一个测试文件。

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

## 编写规范

1. **每个 `.ink` 文件只用于一个测试套件**
2. **`beforeEach` 中统一使用 `gotoFixture()` + `page.waitForSelector("#inkweave-story")`**
3. **每个 `it` 内不要重复调用 `page.goto()`**
4. **用 `expect(contents).toContainText(...)` 等待内容，而非等待元素**
5. **新增测试流程：** 创建 .ink -> 编写 spec.ts -> 配置 `beforeEach` -> 回归验证 -> 清理旧 HTML fixture

## License

MIT
