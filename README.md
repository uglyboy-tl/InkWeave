# InkWeave

InkWeave 是一个交互式小说播放器，基于 [ink](https://github.com/inkle/ink) 脚本语言，支持 React UI 和插件扩展系统。

## 核心功能

### 智能文本播放

- **逐行延迟显示**：模拟打字机效果，可配置显示间隔
- **标签系统**：在 ink 脚本中直接控制播放行为（如 `#image: path.png` 插入图片）
- **状态管理**：通过 Zustand 管理内容、选项、变量的状态
- **选择过滤**：支持条件选项、禁用选项、自动选择

### 存档系统

- **多槽位存档**：支持 3 个独立存档槽位
- **自动存档**：在关键选择点自动保存
- **本地存储**：支持 localStorage 和 sessionStorage
- **时间戳记录**：每次存档自动记录保存时间

### 插件架构

InkWeave 提供五层扩展机制，让开发者能深度定制播放器：

| 系统 | 方向 | 典型用途 |
|------|------|----------|
| **Tags** | ink → JS | 副作用操作：插入图片、播放音乐、清空屏幕 |
| **Parser** | ink → JS | 文本转换：添加 CSS 类、格式化内容 |
| **ExternalFunctions** | ink → JS | ink 脚本调用 JS 函数 |
| **Patches** | JS → Engine | 扩展引擎能力，注入全局属性 |
| **ChoiceComponents** | JS → React | 自定义选项组件（如冷却按钮、自动选择） |

### 预置插件

| 插件 | 功能 |
|------|------|
| **image** | 在 ink 中通过 `#image: path.png` 显示图片 |
| **audio** | 通过 `#music` 和 `#sound` 标签控制音频 |
| **memory** | 存档/读档功能 |
| **fadeEffect** | 内容渐入动画效果 |
| **linkopen** | 点击链接在新窗口打开 |
| **autoButton** | 自动选择按钮（放置类游戏） |
| **cdButton** | 冷却时间按钮 |
| **scrollafterchoice** | 选择后自动滚动 |
| **autosave** | 自动存档 |

### 开箱即用

- **IIFE 产物**：直接在 HTML 中使用，无需构建工具
- **React 组件**：提供 Story、Contents、Choices 等开箱即用的组件
- **主题支持**：内置深色/浅色主题

## 包结构

InkWeave 采用 Monorepo 架构，将功能拆分为独立的包：

```
@inkweave/core      → 核心引擎 + 扩展系统
@inkweave/react     → React 组件
@inkweave/plugins   → 可选功能模块
@inkweave/web       → 开箱即用的 IIFE 产物
```

这种设计允许开发者按需引入：
- 只需要核心引擎？只安装 `@inkweave/core`
- 需要 React UI？加上 `@inkweave/react`
- 需要存档、音频等功能？引入 `@inkweave/plugins`
- 只想直接用？使用 `@inkweave/web`

## 技术栈

- **React 19** - UI 渲染
- **Zustand 5** - 状态管理
- **inkjs 2.3** - ink 脚本解析引擎
- **TypeScript 5** - 类型安全
- **Vite 6** - 构建工具
- **Bun** - 包管理和测试

## License

MIT
