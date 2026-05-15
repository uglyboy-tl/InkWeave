# Ink 语法 E2E 测试方法总结

## 一、测试流程

### 1.1 理解测试对象

InkWeave 项目测试分为三个层面：
- 核心单元测试：`packages/core/test`
- React 组件测试：`packages/react/test`
- E2E 语法测试：`e2e/`

本文档聚焦 E2E 语法测试，验证 ink 脚本在浏览器中的运行时行为。

### 1.2 测试文件结构

当前项目有 35+ 个语法测试文件：

```
e2e/
├── fixtures/                         # HTML 固件（每个语法功能一个）
│   ├── basic-content.html
│   ├── choices.html
│   ├── variables.html
│   ├── sequences.html
│   ├── functions.html
│   ├── logic-operators.html
│   ├── conditional.html
│   ├── cycles.html
│   ├── tunnels.html
│   ├── threads.html
│   ├── lists-basic.html
│   └── ...
└── syntax-{功能}.spec.ts             # Playwright 测试文件
    ├── syntax-basic.spec.ts
    ├── syntax-choices.spec.ts
    └── ...
```

### 1.3 测试流程

```
创建固件 → 编写测试 → 运行验证 → 修复问题
```

**步骤 1：创建固件 HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>E2E Ink 语法 - 功能名称</title>
  <link rel="stylesheet" href="../../packages/web/dist/inkweave.min.css">
  <style>
    html, body { margin: 0; padding: 0; min-height: 100vh; }
    #app { min-height: 100vh; max-width: 680px; margin: 0 auto; padding: 1.5rem; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script src="../../packages/web/dist/inkweave.min.js"></script>
  <script>
    InkWeave.init({
      container: '#app',
      story: `INK 脚本内容`,
      title: "测试标题",
    });
  </script>
</body>
</html>
```

**步骤 2：编写测试用例**

```typescript
import { expect, test } from "@playwright/test";

test.describe("ink 语法 - 功能名称", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/文件名.html");
  });

  test("测试场景描述", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await page.locator(".inkweave-choice").first().click();
    await expect(contents).toContainText("预期文本");
  });
});
```

**步骤 3：运行测试**

```bash
bun run playwright test e2e/syntax-功能名.spec.ts
```

## 二、核心断言模式（共 35+ 文件归纳）

### 2.1 模式一：文本包含验证

验证内容包含指定文本（最常用）。

```typescript
const contents = page.locator(".inkweave-contents");
await expect(contents).toContainText("Hello, World!");
```

使用场景：
- 验证初始内容显示
- 验证选择后的结果文本

### 2.2 模式二：元素计数验证

验证选项/元素的数量。

```typescript
const choiceItems = page.locator(".inkweave-choice");
await expect(choiceItems).toHaveCount(2);
```

### 2.3 模式三：选择点击 + 状态验证

验证点击后内容变化（最常用交互模式）。

```typescript
await page.locator(".inkweave-choice").first().click();
const contents = page.locator(".inkweave-contents");
await expect(contents).toContainText("You chose A.");
```

### 2.4 模式四：多元素定位

当有多个相似元素时精确定位。

```typescript
const choiceItems = page.locator(".inkweave-choice");
await expect(choiceItems.first()).toContainText("Choice A");
await expect(choiceItems.nth(1)).toContainText("Choice B");
```

关键方法：
- `.first()` - 第一个元素
- `.nth(index)` - 索引选择（从 0 开始）

### 2.5 模式五：否定验证

验证某些内容不应该出现。

```typescript
const contents = page.locator(".inkweave-contents");
await expect(contents).not.toContainText("这是注释");
await expect(choiceItems.first()).not.toContainText("Hidden Option");
```

### 2.6 模式六：批量获取文本

获取所有选项的文本进行复杂验证。

```typescript
const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
expect(choiceTexts).not.toContain(expect.stringContaining("Hidden Option"));
expect(choiceTexts.some(t => t.includes("Low score option"))).toBe(true);
```

### 2.7 模式七：连续交互验证

多次点击验证状态持久化。

```typescript
await page.locator(".inkweave-choice").first().click();
await page.locator(".inkweave-choice").first().click();
const contents = page.locator(".inkweave-contents");
await expect(contents).toContainText("You have 10 gold coins.");
await expect(contents).toContainText("You earned 10 gold!");
```

### 2.8 模式八：类名验证

验证元素具有正确的 CSS 类。

```typescript
const contentLines = page.locator(".inkweave-contents .inkweave-content-line");
await expect(contentLines.first()).toHaveClass(/inkweave-content-line/);

const choiceItems = page.locator(".inkweave-choice");
await expect(choiceItems.first()).toHaveClass(/inkweave-choice/);
```

## 三、常见问题与解决方案

### 3.1 问题汇总表

| 问题 | 表现 | 原因 | 解决方案 |
|------|------|------|----------|
| multi-element 错误 | 匹配到多个元素 | 选择器太宽 | 使用 `.first()` 或 `.nth(i)` |
| 文本验证失败 | 找不到文本 | 编码问题 | 检查 meta charset="UTF-8" |
| 状态未更新 | 值不正确 | await 不充分 | 增加 await 或使用 expect 等待 |

### 3.2 多元素定位问题

错误写法（会导致 strict mode violation）：
```typescript
// 错误：locator 匹配到多个元素
await expect(page.locator(".inkweave-choice")).toContainText("选项 A");
```

正确写法：
```typescript
// 正确：指定索引
await expect(page.locator(".inkweave-choice").first()).toContainText("选项 A");
await expect(page.locator(".inkweave-choice").nth(1)).toContainText("选项 B");
```

### 3.3 编码问题

HTML 必须包含编码声明：
```html
<meta charset="UTF-8">
```

测试国际化内容（中文、西里尔文、希腊文等）时特别注意。

### 3.4 异步等待问题

复杂状态变更需要多次 await：
```typescript
// 第一次点击
await page.locator(".inkweave-choice").first().click();
// expect 会自动等待，无需手动 sleep
await expect(contents).toContainText("第一步结果");
// 第二次点击
await page.locator(".inkweave-choice").first().click();
await expect(contents).toContainText("最终状态");
```

## 四、元素选择器参考

| 元素 | 选择器 | 说明 |
|------|--------|------|
| 故事容器 | `.inkweave-story` | 最外层容器 |
| 内容区域 | `.inkweave-contents` | 显示的文本内容 |
| 内容行 | `.inkweave-content-line` | 每行文本 |
| 选择列表 | `.inkweave-choices` | 选择项容器 |
| 选择按钮 | `.inkweave-choice` | 用户可点击的选项 |
| 文本查找 | `page.getByText(text)` | 按文本精确定位 |

### 选择器组合示例

```typescript
// 获取所有内容行
page.locator(".inkweave-contents .inkweave-content-line")

// 获取第一个选择项
page.locator(".inkweave-choice").first()

// 获取指定索引的选择项
page.locator(".inkweave-choice").nth(1)

// 按文本查找
page.getByText("选项 A")
page.getByText(/选项.*/)
```

## 五、测试覆盖范围

| 语法功能 | 测试文件 | 说明 |
|---------|---------|------|
| 基础内容 | syntax-basic | 文本、注释、标签 |
| 选择 | syntax-choices | 选项、抑制 |
| 变量 | syntax-variables | 声明、更新、持久化 |
| 序列 | syntax-sequences | 顺序、推进 |
| 函数 | syntax-functions | 调用、参数 |
| 逻辑运算 | syntax-logic-operators | NOT、AND、OR |
| 条件 | syntax-conditional | if、else |
| 循环 | syntax-cycles | 循环结构 |
| 隧道 | syntax-tunnels | -> 语法 |
| 线程 | syntax-threads | 线程切换 |
| 国际字符 | syntax-international-chars | 多语言支持 |
| 列表 | syntax-lists-* | 列表操作 |

## 六、运行命令

### 6.1 运行所有测试

```bash
bun run playwright test e2e/
```

### 6.2 运行单个测试

```bash
bun run playwright test e2e/syntax-basic.spec.ts
```

### 6.3 查看详细输出

```bash
bun run playwright test e2e/ --reporter=list
```

### 6.4 生成 HTML 报告

```bash
bun run playwright test e2e/ --reporter=html
```

## 七、测试最佳实践

1. **每个测试独立**：使用 `beforeEach` 确保测试环境干净
2. **命名清晰**：测试名称描述预期行为
3. **断言具体**：包含明确的预期值
4. **元素定位明确**：多元素使用 `.first()` 或 `.nth(i)`
5. **编码正确**：HTML 必须声明 UTF-8
6. **利用自动等待**：Playwright 自动等待元素可见，少用 sleep