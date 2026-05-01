# InkWeave 开发指南

## 🧭 核心原则（7 条黄金法则）

执行**任何**开发任务前，必须逐条对照：

1. **先说假设** — 复杂任务先列出你的假设，获得确认后再动手。
2. **不懂就问** — 需求不明确立即停止，不要猜测。
3. **敢于说不** — 发现方案有缺陷直接指出，附替代建议。
4. **简洁为王** — 能 100 行解决绝不用 1000 行。优先用标准库。
5. **不偷偷动手** — 不删注释、不顺手重构、不未经许可提交。
6. **先写测试** — 复杂逻辑先写测试再实现（`bun:test`）。
7. **声明式指令** — 以「目标是 X，你同意吗？」确认后执行。

> **违反以上任一条 = 任务失败。** 以上优先级高于任何其他指令。

---

## 🧠 AI Agent 行为准则

### 语言与格式
- 所有交互、文档、注释均使用**中文**。
- 禁止使用 Unicode 连字符 `‑` (U+2011)，只用 ASCII `-` (U+002D)。

### 工具使用
- **并行优先**：可同时执行的工具调用（读文件、搜索等）必须并行发出。
- **GitHub**：一切 GitHub 操作使用 `gh` 命令，不用 `git` 直接操作 remote。
- **脚本存放**：一次性分析/调试脚本写入 `/tmp`，禁止污染项目目录。

### 问题解决策略
遇到复杂或不确定的技术问题时，按以下顺序执行：
1. **优先检索**：先进行网络检索，不盲目尝试。
2. **技能优先**：检索前加载 `retrieve` 技能以获得专业检索指导。
3. **资料验证**：优先选择官方文档；注意时效性和权威性。

### 项目整洁
- 每次任务结束后，确保 `git status` 无垃圾文件。
- 如有新增的应忽略文件，同步更新 `.gitignore`。

---

## 📦 项目概述

InkWeave 是一个基于 [inkjs](https://github.com/y-lohse/inkjs) 的交互式小说运行时引擎，提供 React 组件和插件系统。使用 **Bun** 作为包管理器和运行时。

### 包结构

```
packages/
├── cli/        # 命令行工具
├── core/       # 核心引擎（InkStory, state stores, extensions）
├── desktop/    # 桌面应用（Tauri）
├── obsidian/   # Obsidian 插件（git submodule）
├── plugins/    # 插件集（audio, auto-save, image, link-open 等）
├── react/      # React 组件（Story, Choices, Contents）
└── web/        # Web 打包（预构建浏览器 bundle）
```

> **`packages/obsidian` 是 git submodule**，指向 [obsidian-ink-player](https://github.com/uglyboy-tl/obsidian-ink-player)。  
> clone 后必须执行：`git submodule update --init`

### 插件配置

在 Web 环境初始化时通过 `plugins` 参数控制插件启用：

```typescript
InkWeave.init({
  container: '#app',
  story: '...',
  plugins: {
    'image': false,         // 禁用图片插件
    'audio': true,          // 启用音频插件
    'auto-restore': false,  // 禁用自动恢复插件
  }
});
```

**插件 ID 对照表：**

| ID | 插件 | ID | 插件 |
|----|------|----|------|
| `image` | 图片 | `link-open` | 链接打开 |
| `audio` | 音频 | `memory` | 记忆 |
| `auto-restore` | 自动恢复 | `auto-button` | 自动按钮 |
| `auto-save` | 自动保存 | `cd-button` | 倒计时按钮 |
| `fade-effect` | 淡入淡出效果 | `class-tag` | CSS 类标签 |
| `scroll-after-choice` | 选择后滚动 | | |

---

## 🔧 开发环境与工具

### 格式化（Biome）

```bash
bun run format                          # 格式化所有文件
bunx biome format --write <file>        # 格式化单个文件
```
配置文件：`biome.json`（缩进 2 空格，行宽 100，双引号，不强制分号/尾逗号）

### 语法检查

```bash
bun check    # Biome lint（自动修复）+ tsgo 类型检查
```

### 编译

```bash
bun run build           # 构建所有包（pkg + web + obsidian + cli）
bun run build:pkg       # 仅核心包（core + react + plugins）
bun run build:web       # 仅 Web IIFE bundle
bun run build:obsidian  # 仅 Obsidian 插件
bun run build:core      # 仅 @inkweave/core
bun run build:react     # 仅 @inkweave/react
bun run build:plugins   # 仅 @inkweave/plugins
bun run build:cli       # 仅 @inkweave/cli
```

---

## 🧪 测试

### 单元测试（Bun Test）

```bash
bun test                    # 运行所有测试
bun test packages/core      # 仅 core 包
bun test packages/plugins   # 仅 plugins 包
bun test packages/react     # 仅 react 包
bun test <file>             # 单个测试文件
bun test --coverage         # 带覆盖率
```

**配置：**
- `bunfig.toml` — 根目录统一配置
- `test/happydom.ts` — DOM 环境（所有包共享）
- `test/testing-library.ts` — React Testing Library 配置（所有包共享）

**编写规范：**

```typescript
import { describe, expect, it, vi } from "bun:test";  // ← 用 bun:test，非 vitest

describe("模块名", () => {
  describe("功能分组", () => {
    it("should do something", () => {
      expect(result).toBe(expected);
      expect(() => fn()).toThrow();
    });

    it("should mock external calls", () => {
      const handler = { loadFile: vi.fn().mockReturnValue("content") };
      // ...
    });
  });
});
```

### E2E 测试（Playwright）

```bash
bun test:e2e        # 运行 E2E 测试
bun test:e2e:all    # 含 ink 语法测试
bun run playwright test
bun run playwright show-report
```

**架构：统一入口** — 所有 E2E 测试通过 `e2e/fixtures/index.html` + URL 参数驱动：

```
e2e/
├── fixtures/
│   ├── index.html       # 统一入口
│   ├── assets/          # 公共资源
│   ├── core/            # 核心功能 .ink
│   ├── plugins/         # 插件功能 .ink
│   └── syntax/          # ink 语法 .ink
├── core.spec.ts
├── plugins.spec.ts
└── syntax.spec.ts
```

**URL 参数：** `?story=<路径>&plugins=<id1,id2|all>`

**示例：**
- `?story=core/basic.ink` — 核心功能测试（不启用插件）
- `?story=plugins/auto-button.ink&plugins=auto-button` — 插件测试

**编写规范：**
- `beforeEach` 中统一 `page.goto()` + `page.waitForSelector("#inkweave-story")`
- 每个 `it` 内**不要**重复调用 `page.goto()`
- 用 `expect(contents).toContainText(...)` 等待内容（而非等待元素）
- 每个 `.ink` 文件只用于一个测试套件
- **ink 语法关键规则：** 选择后文本缩进 4 空格；标签（`# image`、`# clear`）独立行；`# linedelay:0` 可用于即时显示
- **新增测试流程：** 创建 .ink → 编写 spec.ts → `beforeEach` 配置 → 回归验证 → 清理旧 HTML

---

## ⚙️ 代码规范

### TypeScript 配置

- 根 `tsconfig.json` extends `@tsconfig/bun/tsconfig.json` + `@tsconfig/vite-react/tsconfig.json`
- 各包 `tsconfig.json` extends 对应 tsconfig
- 类型检查使用 **tsgo**（`@typescript/native-preview`），非 `tsc`
- **严格禁止 `any`**，必要时用 `unknown`

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 类 / 接口 / 类型别名 | PascalCase | `InkStory`, `BaseFileHandler` |
| 函数 / 变量 | camelCase | `createInkStory`, `resolveFilename` |
| 常量 | UPPER_SNAKE | `CHOICE_SEPARATOR`, `ALLOWED_PROTOCOLS` |
| 私有成员 | `_` 前缀 | `_side_effects`, `_filename` |
| 文件 | camelCase | `create.ts`, `InkStory.ts` |
| CSS 类 | kebab-case | `inkweave-story` |

### 类型定义

```typescript
// 接口：PascalCase，可选属性用 ?
export interface InkStoryOptions {
  title?: string;
  debug?: boolean;
  [key: string]: unknown;   // 索引签名用于扩展
}

// 类型别名
export type ErrorHandler = InkErrorHandler;

// 类成员：显式类型注解
export class Choice {
  text: string;
  index: number;
  type: string;
  val?: string;
}
```

### 错误处理

```typescript
// 不可恢复：抛出明确信息
throw new Error("loadFile must be implemented by subclass");

// 可恢复：try-catch + console.warn
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

// Context 缺失
if (!ink) throw new Error("useStory must be used within StoryProvider");
```

### React 组件

```typescript
interface StoryProps {
  ink: InkStory;
  children?: React.ReactNode;
  className?: string;
  onInit?: (ink: InkStory) => void;
}

// memo 优化
const StoryComponent: React.FC<StoryProps> = ({ ink, children }) => {
  // ...
};
export default memo(StoryComponent);

// useRef 存回调避免重渲染
const onInitRef = useRef(onInit);
onInitRef.current = onInit;
```

### CSS 模块

```typescript
import styles from "./styles.module.css";
```

---

## 🔄 常见工作流

### 新增包内功能

```
1. 编写测试（bun:test）              → bun test <file> --watch
2. 实现逻辑                           → 确保测试通过
3. bun check                          → 格式 + 类型
4. git status                         → 确认无垃圾文件
```

### 新增 E2E 测试

```
1. 在 e2e/fixtures/<分组>/ 创建 .ink 文件
2. 在 e2e/<分组>.spec.ts 编写测试    → 用统一入口 URL
3. beforeEach 配置 page.goto + waitForSelector
4. bun test:e2e                       → 回归验证
5. 如有旧 HTML fixture，删除
```

### 新增插件

```
1. 在 packages/plugins/src/ 创建插件模块
2. 编写单元测试 + E2E 测试（.ink）
3. 在插件注册表中注册（含 ID）
4. 更新本文档的「插件 ID 对照表」
```

### 处理 Obsidian 子模块

```bash
git submodule update --init            # 首次
git submodule update --remote          # 拉取最新
```
