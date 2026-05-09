# @inkweave/web

[English](./README.md) | 中文

InkWeave 的预构建浏览器包 — 可通过 CDN 或 script 标签直接使用，无需任何构建工具。

## 通过 CDN 快速开始

### unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/@inkweave/web/dist/inkweave.min.css">
<script src="https://unpkg.com/@inkweave/web"></script>
```

### jsDelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@inkweave/web/dist/inkweave.min.css">
<script src="https://cdn.jsdelivr.net/npm/@inkweave/web"></script>
```

## 使用方式

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@inkweave/web/dist/inkweave.min.css">
</head>
<body>
  <div id="story-container"></div>

  <script src="https://unpkg.com/@inkweave/web"></script>
  <script>
    InkWeave.init({
      container: '#story-container',
      story: `
        Hello, World!
        + [Choice A] You chose A. -> DONE
        + [Choice B] You chose B. -> DONE
      `,
      title: 'My Story',
      basePath: './stories/'  // 可选：用于加载外部 .ink 文件
    });
  </script>
</body>
</html>
```

## API

### `InkWeave.init(options)`

在你的容器中初始化 InkWeave。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `container` | `string \| Element` | CSS 选择器或 DOM 元素 |
| `story` | `string` | Ink 故事内容（内联或来自文件） |
| `title` | `string` | 故事标题 |
| `basePath` | `string` | 加载外部文件的基础路径 |
| `theme` | `'light' \| 'dark'` | 主题模式 |
| `plugins` | `Record<string, boolean>` | 插件启用/禁用配置 |

### `InkWeave.version`

当前版本字符串。

## 插件配置

在初始化时控制启用哪些插件：

```js
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

### 插件 ID 对照表

| ID | 插件 | ID | 插件 |
|----|------|----|------|
| `image` | 图片 | `link-open` | 链接打开 |
| `audio` | 音频 | `memory` | 记忆 |
| `auto-restore` | 自动恢复 | `auto-button` | 自动按钮 |
| `auto-save` | 自动保存 | `cd-button` | 倒计时按钮 |
| `fade-effect` | 淡入淡出效果 | `class-tag` | CSS 类标签 |
| `scroll-after-choice` | 选择后滚动 | | |

## 包内容

此包包含你需要的一切：

- React & ReactDOM
- inkjs 运行时
- InkWeave 核心引擎
- 内置插件（图片、音频、淡入淡出等）
- CSS 样式

**包大小：** ~138KB (gzip)

## 构建工具用户

如果你使用 webpack、Vite 或其他构建工具，建议使用模块化包：

- `@inkweave/core` — 核心引擎
- `@inkweave/react` — React 组件
- `@inkweave/plugins` — 可选插件

这样可以获得更好的优化和更小的包体积。

## License

MIT
