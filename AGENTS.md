# InkWeave 开发指南

## 开发四件套

### 1. 格式化 (Biome)

```bash
bun run format
```

配置文件：

- `biome.json` - Biome 配置（格式化 + lint）

### 2. 语法检查 (TypeScript)

```bash
bun check
```

包含 Biome lint 检查和 TypeScript 类型检查。

### 3. 测试 (Bun Test)

```bash
bun test
bun test --coverage
```

配置：

- `bunfig.toml` - 根目录统一配置
- `test/happydom.ts` - DOM 环境（所有包共享）
- `packages/react/test/testing-library.ts` - React Testing Library 配置
- `packages/react/test/matchers.d.ts` - jest-dom 类型声明

### 4. 编译

```bash
bun run build
```

## TypeScript 配置架构

- `tsconfig.common.json` - 共享基础配置
- `tsconfig.json` - 根目录配置，用于类型检查（VSCode 使用）
- `packages/*/tsconfig.build.json` - 各包构建配置，生成声明文件

## 测试配置

### Bun Test + Happy DOM

项目使用 Bun 内置测试框架，配合 Happy DOM 提供浏览器环境：

- **根目录配置** (`bunfig.toml`)：统一管理所有包的测试配置
- **共享环境**：
  - `test/happydom.ts` - 初始化 Happy DOM
  - `packages/react/test/testing-library.ts` - React 测试工具

### 注意事项

- 使用 `bun:test` 而非 `vitest`
- 测试文件导入：`import { describe, it, expect } from "bun:test"`
- 不需要各包独立的 `bunfig.toml`

## 包结构

```
packages/
├── core/       # 核心引擎
├── react/      # React 组件
├── plugins/    # 插件集
└── web/        # Web 打包

test/
└── happydom.ts    # 共享 DOM 环境
```