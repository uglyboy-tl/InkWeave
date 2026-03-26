# ink-player

一个用于 ink 交互式小说的播放器，支持 Hugo 网站和 Obsidian 插件。

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建 Web 版本
npm run build
```

## 输出产物

| 文件 | 用途 |
|------|------|
| `dist/ink-player-web.iife.js` | 浏览器直接引入 |
| `dist/style.css` | 样式文件 |
| `dist/lib.js` | ESM 模块 (供其他项目引用) |
| `dist/lib.cjs` | CommonJS 模块 |

## 使用方式

### Hugo 集成

1. 构建并复制到 Hugo：

```bash
npm run build
cp dist/ink-player-web.iife.js /path/to/hugo/static/js/
cp dist/style.css /path/to/hugo/static/css/ink-player.css
```

2. 在文章中指定 layout：

```yaml
---
layout: ink
title: "我的互动故事"
---
```

3. 编写 Ink 故事内容

### Obsidian 插件引用

在 `obsidian-ink-player` 中通过相对路径引用本地构建产物：

```typescript
// 在 tsconfig.json 中添加 paths
{
  "compilerOptions": {
    "paths": {
      "@ink-player/core": ["../ink-js/src/lib.ts"]
    }
  }
}
```

或者直接引用构建后的文件：

```typescript
import { InkStory, Tags, memory, useContents, useChoices } from '../../ink-js/dist/lib.js';
```

## API

### Web 初始化

```javascript
InkPlayer.init({
  container: '#game-container',
  story: inkStoryContent,
  title: 'My Story',
  lineDelay: 50
});
```

### 核心类

#### `InkStory`

```typescript
const ink = new InkStory(story: Story, title: string);

ink.contents       // 当前显示的内容
ink.choices        // 当前选项
ink.continue()     // 继续故事
ink.choose(index)  // 选择选项
ink.restart()      // 重新开始
ink.dispose()      // 销毁实例
```

### 状态管理

```typescript
import { useContents, useChoices, useStorage } from '@ink-player/core';

useContents.getState().contents
useContents.getState().add(['new content'])

useChoices.getState().choices
useChoices.getState().setChoices(inkChoices)

useStorage.getState().storage
useStorage.getState().setStorage(title, index, data)
```

### 功能模块

```typescript
import { memory, loadImage, loadAudio, loadFadeEffect } from '@ink-player/core';

memory.save(index, ink);
memory.load(saveData, ink);
memory.show(title);

loadImage();
loadAudio();
loadFadeEffect();
```

### 标签系统

```typescript
import { Tags } from '@ink-player/core';

Tags.add('myTag', (value, ink) => {
  console.log('Tag triggered:', value);
});
```

## 支持的标签

| 标签 | 用途 | 示例 |
|------|------|------|
| `# image:` | 显示图片 | `# image: images/scene.png` |
| `# sound:` | 播放音效 | `# sound: audio/click.mp3` |
| `# music:` | 播放背景音乐 | `# music: audio/bgm.mp3` |
| `# clear` | 清空内容 | `# clear` |
| `# restart` | 重新开始 | `# restart` |

## 开发命令

```bash
npm run dev         # 启动开发服务器
npm run build       # 构建 Web 版本 (IIFE)
npm run build:lib   # 构建库版本 (ESM + CJS)
npm run build:all   # 构建所有版本
```

## 技术栈

- React 19
- Zustand 5
- inkjs 2.4
- TypeScript 5
- Vite 6

## License

MIT