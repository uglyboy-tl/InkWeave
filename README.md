# InkWeave

一个用于 ink 交互式小说的播放器，基于 React 和 Zustand，支持插件扩展。

## 项目名称

**InkWeave** = Ink + Weave（编织）

- **Ink**：基于 ink 脚本语言
- **Weave**：通过插件系统"编织"各种能力

## 包结构

```
@inkweave/core      → 核心引擎 + 扩展系统
@inkweave/react     → React 组件
@inkweave/plugins   → 可选功能模块
@inkweave/web       → 开箱即用的 IIFE 产物
```

## 快速开始

```bash
# 安装依赖
bun install

# 构建 core 和 react 包
bun run build

# 开发模式
bun run dev
```

## 使用方式

### 最小化使用

```bash
bun add @inkweave/core @inkweave/react
```

```tsx
import { InkStory } from '@inkweave/core';
import { Story, Contents, Choices } from '@inkweave/react';
import { Story as InkJsStory } from 'inkjs';

const story = new InkJsStory(inkJsonContent);
const ink = new InkStory(story, 'My Story');

function App() {
  return (
    <Story ink={ink}>
      <Contents />
      <Choices />
    </Story>
  );
}
```

### 添加存档功能

```bash
bun add @inkweave/plugins
```

```tsx
import { loadMemory, MemoryUI } from '@inkweave/plugins/memory';

loadMemory();

function App() {
  return (
    <Story ink={ink}>
      <Contents />
      <MemoryUI />
      <Choices />
    </Story>
  );
}
```

### 直接在 HTML 使用

```html
<script src="inkweave-web.iife.js"></script>
<script>
InkWeave.init({
  container: '#game-container',
  story: inkStoryContent,
  title: 'My Story'
});
</script>
```

## 扩展系统

InkWeave 提供五层扩展机制：

| 系统 | 方向 | 典型用途 |
|------|------|----------|
| **Tags** | ink → JS | 副作用操作：插入元素、清空屏幕 |
| **Parser** | ink → JS | 文本转换：添加 CSS 类 |
| **ExternalFunctions** | ink → JS | ink 脚本调用 JS 函数 |
| **Patches** | JS → Engine | 扩展引擎能力 |
| **ChoiceComponents** | JS → React | 自定义选项组件 |

详细文档见 [docs/why-this-project.md](./docs/why-this-project.md)。

## 技术栈

- React 19
- Zustand 5
- inkjs 2.3
- TypeScript 5
- Vite 6
- Bun

## License

MIT