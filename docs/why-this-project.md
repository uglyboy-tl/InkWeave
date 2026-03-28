# 为什么创建 InkWeave

本文档记录 InkWeave 项目的创建背景和设计思路。

## 背景知识

### Ink - 交互式叙事脚本语言

[Ink](https://github.com/inkle/ink) 是由 [inkle](https://www.inklestudios.com) 工作室开发的开源脚本语言，专为编写交互式叙事游戏而设计。它具有以下特点：

- **简洁易学**：语法设计直观，让作者专注于故事本身
- **功能强大**：支持条件逻辑、变量、多线程等高级特性
- **高度分支**：能够处理复杂的叙事分支结构
- **跨平台**：官方提供 Unity 集成，社区提供 JavaScript 等其他语言支持

Ink 的典型应用场景包括：

- 纯文本交互游戏
- 图形游戏中的分支剧情系统
- 视觉小说
- 教育类互动内容

### inkjs - JavaScript 运行时

[inkjs](https://github.com/y-lohse/inkjs) 是 ink 引擎的 JavaScript 移植版本，由社区维护（主要贡献者：@y-lohse 和 @ephread）。它具有：

- **完全兼容**：与官方 C# 版本功能一致
- **零依赖**：纯 JavaScript 实现，体积小
- **跨环境**：支持浏览器和 Node.js
- **TypeScript 支持**：提供完整的类型定义

## 问题分析

虽然 inkjs 提供了核心的故事运行能力，但在实际使用中存在以下问题：

### 1. 缺少界面层

inkjs 是一个纯逻辑引擎，不提供任何用户界面。每次使用都需要：

- 编写 UI 组件渲染故事内容
- 实现选项点击交互
- 处理滚动、动画等用户体验细节
- 适配不同平台（Web、移动端等）

这导致大量重复劳动，每个新项目都要重写相似的基础代码。

### 2. 扩展能力不足

inkjs 只提供核心的叙事逻辑，很多常见需求需要额外实现：

| 需求 | inkjs 状态 |
|------|-----------|
| 图片显示 | 需自行实现 |
| 音频播放 | 需自行实现 |
| 存档/读档 | 需自行实现 |
| 自动播放 | 需自行实现 |
| 自定义标签 | 无原生支持 |

每次都要重新实现这些功能，既浪费时间又容易引入 bug。

### 3. 状态管理分散

inkjs 的状态管理较为原始：

- 变量通过 `variablesState` 访问
- 故事状态通过 `state.ToJson()` 序列化
- 没有响应式更新机制

在现代前端框架中，需要额外封装才能实现良好的状态同步。

## 解决方案

InkWeave 项目旨在解决上述问题，提供一个开箱即用的 ink 播放器。

### 项目名称由来

**InkWeave** = Ink + Weave（编织）

- **Ink**：基于 ink 脚本语言
- **Weave**：通过插件系统"编织"各种能力

这与参考项目 Calico（印花布）形成呼应——Calico 是布料，InkWeave 是编织动作。

### 包结构

```
@inkweave/core      → 核心引擎 + 扩展系统
@inkweave/react     → React 组件
@inkweave/plugins   → 可选功能模块
@inkweave/web       → 开箱即用的 IIFE 产物
```

### 1. React 界面组件

提供完整的 React 组件库，封装故事渲染、选项交互、滚动处理等常见需求。

**核心组件**：

| 组件 | 功能 | 包 |
|------|------|-----|
| `Story` | 故事容器，管理故事生命周期 | `@inkweave/react` |
| `Contents` | 内容渲染区域 | `@inkweave/react` |
| `Choices` | 选项列表 | `@inkweave/react` |

### 2. Zustand 状态管理

使用 Zustand 提供响应式状态管理，将 inkjs 的状态封装为易于使用的 React hooks。

**状态模块**：

| Store | 功能 | 包 |
|-------|------|-----|
| `useContents` | 已显示的故事内容 | `@inkweave/core` |
| `useChoices` | 当前选项列表 | `@inkweave/core` |
| `useVariables` | ink 变量状态 | `@inkweave/core` |

> `useStorage` 是 memory 插件的内部组件，仅在 `loadMemory()` 后可用。

### 3. 扩展系统

设计五层扩展机制，覆盖不同的扩展场景。架构设计参考了 [Calico](https://github.com/elliotherriman/calico) 项目。

#### 五层扩展机制

| 系统 | 方向 | 操作对象 | 典型用途 | 包 |
|------|------|----------|----------|-----|
| **Tags** | ink → JS | story (引擎) | 副作用操作：插入元素、清空屏幕、播放音频 | `@inkweave/core` |
| **Parser** | ink → JS | line (文本) | 文本转换：添加 CSS 类、markdown 转 HTML | `@inkweave/core` |
| **ExternalFunctions** | ink → JS | 函数调用 | ink 脚本调用 JS 能力：判断设备、调用系统 API | `@inkweave/core` |
| **Patches** | JS → Engine | InkStory 类 | 扩展引擎能力：添加新方法、新属性 | `@inkweave/core` |
| **ChoiceParser** | ink → JS | choice (选项) | 选项行为定制：自动选择、冷却按钮 | `@inkweave/core` |
| **ChoiceRegistry** | JS → React | React 组件 | 注册自定义选项组件 | `@inkweave/react` |

#### Tags vs Parser 的区别

两者都处理 `# tag: value` 格式的标签，但**调用时机和操作对象不同**：

| 特性 | Tags | Parser |
|------|------|--------|
| 调用时机 | 文本渲染前后 | 文本渲染过程中 |
| 操作对象 | `story` 引擎实例 | `line` 文本对象 |
| 能力 | 创建/删除 DOM 元素、修改游戏状态 | 修改文本内容、添加 CSS 类 |
| 典型例子 | `# image:` 插入图片元素 | `# red` 添加 CSS 类 |

**Tags 示例**：`# image:` 标签需要创建图片元素并插入到故事队列中，这涉及到 DOM 结构的修改，必须用 Tags。

**Parser 示例**：`# red` 标签只需要给当前文本行添加 CSS 类 `red`，不涉及 DOM 结构变化，用 Parser 更合适。

#### ExternalFunctions 的用途

让 ink 脚本可以调用 JavaScript 函数，实现 ink 无法完成的逻辑。

**Calico 示例**：storylets 系统

```
ink 脚本                          JS 实现
────────────────────────────────────────────
EXTERNAL _openStorylets()    →   ExternalFunctions.add("_openStorylets", () => {...})
~ temp divert = _openStorylets()
-> divert ->
```

ink 脚本声明外部函数，JS 端实现具体逻辑，引擎在运行时自动绑定。

#### Patches 的用途

扩展 InkStory 类本身，添加新的方法和属性。所有内置功能模块都通过 Patches 实现。

**实现方式**：传入一个函数，在函数内部 `this` 指向 InkStory 实例，可以直接扩展其能力。

#### ChoiceParser vs ChoiceRegistry

| 系统 | 职责 | 包 |
|------|------|-----|
| **ChoiceParser** | 解析 choice 标签，修改 `choice.type`、`choice.val` | `@inkweave/core` |
| **ChoiceRegistry** | 注册和渲染自定义 React 组件 | `@inkweave/react` |

**使用示例**：

```ts
// core 包 - 解析逻辑
ChoiceParser.add('auto', (choice, val) => {
  choice.type = 'auto';
  choice.val = val;
});

// plugins 包 - 注册组件
ChoiceRegistry.register('auto', AutoButtonComponent);
```

### 参考：Calico 项目

[Calico](https://github.com/elliotherriman/calico) 是由 Elliot Herriman 开发的基于 inkjs 的 Web 引擎，本项目扩展系统的设计参考了它的架构。

#### Calico 的 Patches 示例

| Patch | 使用的扩展点 | 功能描述 |
|-------|-------------|----------|
| `shorthandclasstags.js` | Parser.tag | 简写类标签，`#red` 等同于 `#class: red` |
| `markdowntohtml.js` | Events | 将 markdown 语法转换为 HTML |
| `storylets.js` | ExternalFunctions + Tags | 实现 storylet 叙事模式 |
| `eval.js` | Tags | 允许 ink 直接执行 JS 代码 |
| `memorycard.js` | Tags + Patches | 存档/读档系统 |

#### InkWeave 的调整

| 特性 | Calico | InkWeave |
|------|--------|----------|
| UI 框架 | 原生 JS | React |
| 状态管理 | 内置简单状态 | Zustand |
| 类型支持 | 无 | TypeScript |
| 模块化 | 全局加载 | 按需加载 |
| 事件系统 | 有 | 暂无 |
| 选项扩展 | 无 | ChoiceParser + ChoiceRegistry |
| 包结构 | 单文件 | Monorepo 多包 |

InkWeave 采用**按需加载**模式，所有功能模块需要显式调用 `load*()` 函数才会激活，避免不必要的代码膨胀。

## 内置插件

InkWeave 内置了以下功能模块（位于 `@inkweave/plugins` 包）：

| 模块 | 扩展点 | 标签/语法 | 说明 |
|------|--------|-----------|------|
| image | Tags | `# image:` | 显示图片 |
| audio | Tags | `# sound:` / `# music:` | 播放音效/背景音乐 |
| memory | Tags + Patches | `# autosave` | 存档系统 |
| fadeEffect | Patches | - | 内容淡入效果 |
| autoButton | ChoiceParser + ChoiceRegistry | `* [auto:5]` | 自动选择按钮 |
| cdButton | ChoiceParser + ChoiceRegistry | `* [cd:3]` | 冷却按钮 |
| linkopen | Tags | `# linkopen:` | 打开外部链接 |
| scrollafterchoice | Patches | - | 选择后自动滚动 |

## 总结

InkWeave 的目标是：

1. **降低使用门槛**：提供完整的 UI 组件，开箱即用
2. **提高扩展性**：通过五层扩展系统支持灵活定制
3. **复用最佳实践**：内置常用功能，避免重复造轮子
4. **类型安全**：完整的 TypeScript 支持

通过封装 inkjs 的核心能力并提供友好的接口，让开发者能够快速构建交互式叙事体验。

## 相关链接

- [Ink 官方文档](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)
- [inkjs 仓库](https://github.com/y-lohse/inkjs)
- [Calico 项目](https://github.com/elliotherriman/calico)
- [Inky 编辑器](https://github.com/inkle/inky) - ink 的可视化编辑器