# InkWeave 开发指南

## 项目概述

InkWeave 是一个基于 inkjs 的交互式小说运行时引擎，提供 React 组件和插件系统。

## 开发四件套

### 1. 格式化 (Biome)

```bash
bun run format        # 格式化所有文件
bunx biome format --write <file>  # 格式化单个文件
```

配置文件：`biome.json`

### 2. 语法检查 (TypeScript)

```bash
bun check             # Biome lint + TypeScript 类型检查
bunx tsc --noEmit     # 仅类型检查
```

### 3. 测试 (Bun Test)

```bash
bun test              # 运行所有测试
bun test packages/core              # 运行 core 包测试
bun test packages/plugins           # 运行 plugins 包测试
bun test packages/react             # 运行 react 包测试
bun test <file>                     # 运行单个测试文件
bun test --coverage                 # 带覆盖率报告
```

测试配置：
- `bunfig.toml` - 根目录统一配置
- `test/happydom.ts` - DOM 环境（所有包共享）
- `test/testing-library.ts` - React Testing Library 配置（所有包共享）

### 4. E2E 测试 (Playwright)

```bash
bun test:e2e          # 运行所有 E2E 测试
bun run playwright test   # 直接运行 Playwright 测试
bun run playwright show-report  # 查看测试报告
```

E2E 测试配置：
- `playwright.config.ts` - Playwright 配置文件
- `e2e/` - E2E 测试文件目录
- `e2e/fixtures/` - HTML 测试 fixture 目录

### 5. 编译

```bash
bun run build         # 构建所有包
bun run --filter @inkweave/core build  # 构建单个包
```

## TypeScript 配置架构

- `tsconfig.json` - 根目录配置，extends `@tsconfig/bun/tsconfig.json` 和 `@tsconfig/vite-react/tsconfig.json`
- `packages/*/tsconfig.json` - 各包独立配置，extends `@tsconfig/bun/tsconfig.json` 或 `@tsconfig/vite-react/tsconfig.json`

## 包结构

```
packages/
├── cli/        # 命令行工具
├── core/       # 核心引擎 (InkStory, state stores, extensions)
├── desktop/    # 桌面应用 (Tauri)
├── plugins/    # 插件集 (audio, autosave, image, linkopen, etc.)
├── react/      # React 组件 (Story, Choices, Contents)
└── web/        # Web 打包 (预构建的浏览器 bundle)
```

## 代码风格

### Imports

```typescript
// 1. 外部依赖（按字母排序）
import { describe, expect, it } from "bun:test";
import { Story } from "inkjs/engine/Story";
import { createContext, useContext } from "react";

// 2. 内部包依赖（workspace）
import { InkStory } from "@inkweave/core";
import { Tags } from "@inkweave/core";

// 3. 相对路径导入
import { createInkStory } from "../create";
import type { FileHandler } from "./types";

// 4. 类型导入使用 `import type`
import type { InkStoryOptions } from "./types";
```

### 格式化 (Biome 默认)

- **引号**：双引号
- **缩进**：2 空格
- **行宽**：100 字符
- **分号**：不强制
- **尾逗号**：不强制

### 类型定义

```typescript
// 接口命名：PascalCase
export interface InkStoryOptions {
  title?: string;
  debug?: boolean;
  [key: string]: unknown;  // 索引签名用于扩展
}

// 类型别名：PascalCase
export type ErrorHandler = InkErrorHandler;

// 类成员：显式类型注解
export class Choice {
  text: string;
  index: number;
  type: string;
  val?: string;  // 可选属性用 ?
}
```

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 类 | PascalCase | `InkStory`, `BaseFileHandler` |
| 函数 | camelCase | `createInkStory`, `resolveFilename` |
| 常量 | UPPER_SNAKE | `CHOICE_SEPARATOR` |
| 私有成员 | 前缀 `_` | `_side_effects`, `_filename` |
| 文件 | camelCase | `create.ts`, `InkStory.ts` |
| CSS 类 | kebab-case | `inkweave-story` |

### 错误处理

```typescript
// 抛出明确的错误信息
throw new Error("loadFile must be implemented by subclass");
throw new Error("Invalid source type: expected string or Story");

// 使用 try-catch 处理可恢复错误
try {
  const url = new URL(val);
  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
    console.warn("Blocked unsafe URL protocol:", url.protocol);
    return;
  }
} catch {
  console.warn("Invalid URL:", val);
  return;
}

// Context 缺失时抛出错误
if (!ink) {
  throw new Error("useStory must be used within StoryProvider");
}
```

### React 组件

```typescript
// Props 接口定义
interface StoryProps {
  ink: InkStory;
  children?: React.ReactNode;
  className?: string;
  onInit?: (ink: InkStory) => void;
}

// 使用 memo 优化
const StoryComponent: React.FC<StoryProps> = ({ ink, children }) => {
  // ...
};
export default memo(StoryComponent);

// 使用 useRef 存储回调避免重渲染
const onInitRef = useRef(onInit);
onInitRef.current = onInit;
```

### 测试编写

```typescript
import { describe, expect, it, vi } from "bun:test";

describe("模块名", () => {
  describe("功能分组", () => {
    it("should do something", () => {
      // 断言
      expect(result).toBe(expected);
      expect(() => fn()).toThrow();
    });

    it("should mock external calls", () => {
      const handler = {
        loadFile: vi.fn().mockReturnValue("content"),
      };
      // ...
    });
  });
});
```

## 注意事项

- 使用 `bun:test` 而非 `vitest`
- 测试文件导入：`import { describe, it, expect } from "bun:test"`
- 类型导入用 `import type`
- 避免使用 `any`，必要时用 `unknown`
- CSS 模块导入：`import styles from "./styles.module.css"`

### 插件配置

在 Web 环境中初始化 InkWeave 时，可以通过 `plugins` 参数控制插件启用状态：

```typescript
InkWeave.init({
  container: '#app',
  story: '...',
  plugins: {
    'image': false,        // 禁用图片插件
    'audio': true,         // 启用音频插件
    'auto-restore': false  // 禁用自动恢复插件
  }
});
```

插件 ID 对应关系：
- `image` - 图片插件
- `audio` - 音频插件  
- `auto-restore` - 自动恢复插件
- `auto-save` - 自动保存插件
- `fade-effect` - 淡入淡出效果插件
- `scroll-after-choice` - 选择后滚动插件
- `link-open` - 链接打开插件
- `memory` - 记忆插件
- `auto-button` - 自动按钮插件
- `cd-button` - 倒计时按钮插件
- `class-tag` - CSS 类标签插件

### E2E 测试最佳实践

#### 测试文件组织
- E2E 测试按功能分组：`e2e/core/`（核心功能）、`e2e/plugins/`（插件功能）、`e2e/syntax/`（ink 语法）
- 每个测试只使用一个 fixture 文件，避免多个文件维护复杂度
- 为每个插件组件添加专用的 HTML ID（如 `#inkweave-image`）便于测试定位

#### ink 语法注意事项
- 选择后的文本必须正确缩进（4个空格）
- 使用 `-> END` 结束选择分支
- 标签（如 `# image`、`# clear`）应在独立行上，不要在缩进块内

#### Fixture 编译验证
- **每个 fixture 文件都应该首先添加一个编译验证测试用例**
- 验证 story 能够正确编译，没有语法错误
- 这样可以方便定位后续测试失败的原因（是编译问题还是功能问题）
- 编译验证测试应该检查控制台中没有 "Failed to initialize" 和 "Compilation failed" 错误

#### Playwright 测试技巧
- 使用 `page.locator(".inkweave-choice")` 定位选择按钮
- 等待内容更新时使用 `expect(contents).toContainText("expected text")` 而不是等待特定元素
- 点击选择后等待具体的文本内容出现，确保故事执行完成
- 在测试中禁用所有其他插件，只启用待测试的目标插件，避免互相影响

#### 测试流程示例
```typescript
// 编译验证测试用例
test("should compile without errors", async ({ page }) => {
  const consoleMessages: { type: string; text: string }[] = [];
  
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  await page.goto("/e2e/fixtures/plugins/image.html");
  await page.waitForSelector(".inkweave-story");
  
  // Verify no compilation errors
  const hasCompilationError = consoleMessages.some(msg => 
    msg.text.includes('Failed to initialize') && 
    msg.text.includes('Compilation failed')
  );
  expect(hasCompilationError).toBe(false);
});

// 功能测试用例
test("should clear image when # clear tag is used", async ({ page }) => {
  await page.goto("/e2e/fixtures/plugins/image.html");
  await page.waitForSelector(".inkweave-story");
  
  // 验证初始状态
  const initialImageContainer = page.locator("#inkweave-image");
  await expect(initialImageContainer).toBeVisible();
  
  // 执行交互
  const clearChoice = page.locator('.inkweave-choice:has-text("Clear the image")');
  await clearChoice.click();
  
  // 等待内容更新
  const contents = page.locator(".inkweave-contents");
  await expect(contents).toContainText("The image should be cleared.");
  
  // 验证最终状态
  const imageAfterClear = page.locator("#inkweave-image");
  await expect(imageAfterClear).not.toBeVisible();
});
```