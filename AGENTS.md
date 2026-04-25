# InkWeave 开发指南

## 🧭 核心原则 (7条黄金法则)

在开始任何开发工作前，请务必牢记并遵守以下原则：

1.  **先说假设**：做复杂任务前先列出你的假设。
2.  **不懂就问**：需求不明确时立即停止并询问。
3.  **敢于说不**：如发现人类方案有缺陷，请直接指出。
4.  **简洁为王**：能用100行代码解决，绝不用1000行。
5.  **不偷偷动手**：绝不擅自删除注释、重构代码或提交更改。
6.  **先写测试**：实现复杂逻辑前，必须先编写测试。
7.  **声明式指令**：始终以“目标是 X，你同意吗？”的方式确认任务。

## 👤 用户偏好

- **语言**：所有交互和文档均使用中文。
- **字符**：请勿使用 Unicode 连字符 `‑` (U+2011)，请使用 ASCII 连字符 `-` (U+002D)。
- **工具调用**：优先并行调用工具以提高效率。
- **GitHub**：访问 GitHub 相关的一切操作都使用 `gh` 命令。
- **项目整洁**：确保 `git status` 无垃圾文件，并相应更新 `.gitignore`。
- **脚本存放**：一次性分析脚本请写入 `/tmp` 文件夹，不要污染项目目录。

## 📦 项目概述

InkWeave 是一个基于 inkjs 的交互式小说运行时引擎，提供 React 组件和插件系统。

### 包结构

```
packages/
├── cli/        # 命令行工具
├── core/       # 核心引擎 (InkStory, state stores, extensions)
├── desktop/    # 桌面应用 (Tauri)
├── plugins/    # 插件集 (audio, auto-save, image, link-open, etc.)
├── react/      # React 组件 (Story, Choices, Contents)
└── web/        # Web 打包 (预构建的浏览器 bundle)
```

## 🔧 开发四件套

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

**测试配置**：
- `bunfig.toml` - 根目录统一配置
- `test/happydom.ts` - DOM 环境（所有包共享）
- `test/testing-library.ts` - React Testing Library 配置（所有包共享）

### 4. E2E 测试 (Playwright)

```bash
bun test:e2e          # 运行所有 E2E 测试
bun run playwright test   # 直接运行 Playwright 测试
bun run playwright show-report  # 查看测试报告
```

**E2E 测试配置**：
- `playwright.config.ts` - Playwright 配置文件
- `e2e/` - E2E 测试文件目录
- `e2e/fixtures/` - HTML 测试 fixture 目录

### 5. 编译

```bash
bun run build         # 构建所有包
bun run --filter @inkweave/core build  # 构建单个包
```

## ⚙️ 技术栈规范

### TypeScript 配置架构

- `tsconfig.json` - 根目录配置，extends `@tsconfig/bun/tsconfig.json` 和 `@tsconfig/vite-react/tsconfig.json`
- `packages/*/tsconfig.json` - 各包独立配置，extends `@tsconfig/bun/tsconfig.json` 或 `@tsconfig/vite-react/tsconfig.json`

### 代码风格

#### Imports

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

#### 格式化 (Biome 默认)

- **引号**：双引号
- **缩进**：2 空格
- **行宽**：100 字符
- **分号**：不强制
- **尾逗号**：不强制

#### 类型定义

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

#### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 类 | PascalCase | `InkStory`, `BaseFileHandler` |
| 函数 | camelCase | `createInkStory`, `resolveFilename` |
| 常量 | UPPER_SNAKE | `CHOICE_SEPARATOR` |
| 私有成员 | 前缀 `_` | `_side_effects`, `_filename` |
| 文件 | camelCase | `create.ts`, `InkStory.ts` |
| CSS 类 | kebab-case | `inkweave-story` |

#### 错误处理

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

#### React 组件

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

#### 测试编写

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

## 📌 重要注意事项

- **测试框架**：使用 `bun:test` 而非 `vitest`。测试文件导入：`import { describe, it, expect } from "bun:test"`。
- **类型安全**：类型导入必须用 `import type`。严格避免使用 `any`，必要时用 `unknown`。
- **CSS 模块**：CSS 模块导入：`import styles from "./styles.module.css"`。
- **问题解决**：
    - **优先检索**: 遇到复杂或不确定的技术问题时，优先进行网络检索。
    - **技能优先**: 进行网络检索前，先加载 `retrieve` 技能。
    - **资料验证**: 参考网络资料时注意验证时效性和权威性，优先选择官方文档。

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

**插件 ID 对应关系**：
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

### E2E 测试架构与最佳实践

#### 统一测试入口架构

项目使用**统一的 HTML 入口文件**管理所有 E2E 测试，通过 URL 参数动态配置：

- **入口文件**: `e2e/fixtures/index.html`
- **故事文件**: `.ink` 文件存储在对应的子目录中
- **URL 参数**:
  - `story` - 指定 .ink 故事文件的相对路径
  - `plugins` - 指定要启用的插件（逗号分隔，或使用 `all`）

**目录结构**:
```
e2e/fixtures/
├── index.html              # 统一测试入口
├── assets/                 # 公共资源目录
│   ├── test-image.png
│   └── test-image2.png
├── core/                   # 核心功能测试
├── plugins/                # 插件功能测试
└── syntax/                 # ink 语法测试
```

**使用示例**:
- Plugins: `/e2e/fixtures/index.html?story=plugins/auto-button.ink&plugins=auto-button`
- Core: `/e2e/fixtures/index.html?story=core/basic.ink`
- Syntax: `/e2e/fixtures/index.html?story=syntax/choices.ink`

#### 测试文件组织原则

- **按功能分组**: `e2e/core/`（核心功能）、`e2e/plugins/`（插件功能）、`e2e/syntax/`（ink 语法）
- **每个测试只使用一个 .ink 文件**，避免多个文件维护复杂度
- **为每个插件组件添加专用的 HTML ID**（如 `#inkweave-image`）便于测试定位
- **Core 和 Syntax 测试不需要启用插件**，Plugin 测试需要明确指定插件

#### ink 语法注意事项

- 选择后的文本必须正确缩进（4个空格）
- 使用 `-> END` 结束选择分支
- 标签（如 `# image`、`# clear`）应在独立行上，不要在缩进块内
- **移除 `# linedelay:0` 标签**（仅在旧的 HTML fixture 中使用，新的 .ink 文件不需要）

#### 测试用例编写规范

- **使用 beforeEach 统一设置**: 所有测试用例应在 `beforeEach` 中设置页面导航
- **避免重复的 page.goto()**: 不要在每个测试函数内部重复调用 `page.goto()`
- **等待故事容器加载**: 在 beforeEach 中添加 `await page.waitForSelector(".inkweave-story")`
- **编译验证测试**: 每个测试套件都应该包含编译验证测试用例

#### Playwright 测试技巧

- 使用 `page.locator(".inkweave-choice")` 定位选择按钮
- 等待内容更新时使用 `expect(contents).toContainText("expected text")` 而不是等待特定元素
- 点击选择后等待具体的文本内容出现，确保故事执行完成
- 在测试中禁用所有其他插件，只启用待测试的目标插件，避免互相影响

#### 测试迁移工作流程

当需要创建新的 E2E 测试时，遵循以下流程：

1.  **创建 .ink 文件**: 在对应的子目录（core/plugins/syntax）中创建 .ink 文件
2.  **编写测试用例**: 在对应的 spec.ts 文件中编写测试，使用统一入口 URL
3.  **配置 beforeEach**: 使用 `page.goto("/e2e/fixtures/index.html?story=...")`
4.  **回归测试**: 运行测试确保功能正常
5.  **清理**: 如果是从旧 HTML 迁移，删除原 HTML 文件