# AGENTS.md

## 用户偏好
- 请勿使用 Unicode 连字符 `‑` (U+2011)，请使用 ASCII 连字符 `-` (U+002D)
- 始终用**中文**交互
- 优先并行调用工具

## 项目概述

ink-js 是一个用于 ink 交互式小说的 Web 播放器，支持：
- Hugo 静态网站集成
- obsidian-ink-player 核心库复用
- NPM 包发布（子路径导出）

## 项目结构

```
ink-js/
├── src/
│   ├── lib/                  # 可复用核心库
│   │   ├── core/             # 核心模块 (InkStory, Tags, Patches 等)
│   │   ├── stores/           # Zustand 状态管理
│   │   └── features/         # 功能模块 (memory, image, audio 等)
│   ├── utils/                # Web 专用工具
│   │   └── FetchFileHandler.ts  # INCLUDE 文件加载器
│   ├── components/           # React UI 组件
│   ├── styles/               # CSS 样式
│   └── index.tsx             # Web 入口
├── dist/
│   ├── lib/                  # NPM 包输出
│   │   ├── index.js
│   │   ├── core/index.js
│   │   ├── stores/index.js
│   │   └── features/index.js
│   ├── ink-player-web.iife.js  # Web IIFE 版本
│   └── style.css
└── stories/                  # 测试用 ink 故事文件
```

## 构建命令

```bash
npm run build        # 构建 Web 版本 (IIFE)
npm run build:lib    # 构建 NPM 库 (ESM + CJS)
npm.run build:all    # 构建全部
```

## NPM 包导出

```typescript
// 主入口
import { useStory, memory } from 'ink-player';

// 子路径导出
import { InkStory, Tags, Patches } from 'ink-player/core';
import { useStory, useChoices } from 'ink-player/stores';
import { memory, loadImage } from 'ink-player/features';
```

## INCLUDE 支持

Web 版本支持运行时 INCLUDE：

```javascript
InkPlayer.init({
  container: '#container',
  story: storyContent,
  basePath: './stories',  // INCLUDE 文件查找路径
});
```

ink 故事中使用：
```
INCLUDE other_file.ink
```

## 关键实现

### FetchFileHandler

位于 `src/utils/FetchFileHandler.ts`：
- 递归预加载所有 INCLUDE 文件
- 支持 fetch 加载远程文件
- 构建虚拟文件系统供编译器使用

### 编译流程

1. 解析 INCLUDE 语句
2. 递归 fetch 所有依赖
3. 构建 FetchFileHandler
4. 使用 inkjs Compiler 编译

## 与 obsidian-ink-player 的关系

obsidian-ink-player 通过软链接复用 `src/lib/` 目录：

```
obsidian-ink-player/src/ink -> ink-js/src/lib
```

使用别名：
- `@ink/core` → `ink/core/index.ts`
- `@ink/stores` → `ink/stores/index.ts`
- `@ink/features` → `ink/features/index.ts`

## 注意事项

- ink 故事需要明确的入口指令（如 `-> start`）
- INCLUDE 文件路径相对于 `basePath`
- Web 版本需要 HTTP 服务器（不支持 file:// 协议）
- 构建时确保 `emptyOutDir: false`（多配置共享输出目录）