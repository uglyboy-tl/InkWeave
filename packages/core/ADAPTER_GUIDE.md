# 框架适配器开发指南

本文档定义 InkWeave 框架适配器必须遵守的契约。所有框架特定包（`@inkweave/react`、`@inkweave/svelte` 等）应以此文档为规范基准。

## 概述

InkWeave 采用三层架构：

```
@inkweave/core          ← 数据契约（InkStory、zustand stores、Plugin、Command）
    ↓
@inkweave/<framework>   ← 框架适配器（UI 组件 + ChoiceRegistry + 状态桥接）
    ↓
@inkweave/plugins       ← 插件胶水层（工厂函数 + 框架特定入口）
```

适配器的职责是将 `@inkweave/core` 纯数据层的状态映射为框架原生 UI 组件。现有实现：

| 包 | 框架 | 组件模型 |
|----|------|---------|
| `@inkweave/react` | React 19 | JSX + hooks + memo |
| `@inkweave/svelte` | Svelte 5 | runes (`$state`/`$effect`/`$derived`) |

---

## 必须导出的 4 个组件

每个适配器必须导出以下四个组件，名称和顶层 API 保持一致。

### 1. `Story` - 顶层容器

**职责：** 故事运行时的根组件，初始化故事引擎、提供 InkStory 上下文给所有子组件。

**Props:**

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `ink` | `InkStory` (from core) | 是 | 故事引擎实例 |
| `class` 或 `className` | `string` | 否 | 额外 CSS 类名 |
| `onInit` | `(ink: InkStory) => void` | 否 | 初始化完成回调 |
| `children` | 框架特定 | 否 | 插槽内容（如 Image 组件） |

**行为规范：**

- 渲染一个根 DOM 元素：`<div id="inkweave-story" data-inkweave="story">`
- 在挂载时调用 `ink.continue()` 启动故事
- 在挂载时调用 `onInit?.(ink)`（使用框架的「一次性副作用」机制）
- 将 `InkStory` 实例注入框架的上下文系统，供子组件获取
- 内部固定渲染 `<Contents />` + `<Choices />`，外加 `children` 插槽
- 不得因自身状态变化导致不必要的重渲染（React 用 `memo`，Svelte 用 `untrack` 初始化上下文）

**参考实现：** React (`packages/react/src/components/story/index.tsx:35`)、Svelte (`packages/svelte/src/Story.svelte`)

---

### 2. `Contents` - 内容渲染

**职责：** 渲染 Ink 故事的文本内容行，支持动画和分隔符。

**Props:** 无（从上下文获取 `InkStory` 实例和 zustand store）

**行为规范：**

- 从 `contentsStore` (core) 读取 `ContentItem[]` 数组
- 使用 `ink.visibleLines` 和 `ink.options.linedelay` 控制淡入动画：
  - 每行淡入延迟 = `(索引 - visibleLines) * lineDelay` 秒（非负）
  - 当 `lineDelay === 0` 时，跳过动画（opacity: 1）
  - 当 `lineDelay > 0` 时，设置 `--delay` CSS 自定义属性
- `ContentItem.text === CHOICE_SEPARATOR` 时渲染 `<hr class="inkweave-divider">` 分隔线
- 其他行渲染为 `<p>{item.text}</p>`，携带 `inkweave-content-line` 类名及 `item.classes` 中所有类名
- 根容器：`<section class="inkweave-contents">`
- ContentItem 的 key 策略：分隔符用 `divider_{i}`，普通行用 `line_{i}_{前20字符}`
- 使用框架的性能优化机制避免无效渲染（React: `useMemo`；Svelte：`$derived.by`）

**参考实现：** React (`packages/react/src/components/contents/index.tsx:6`)、Svelte (`packages/svelte/src/Contents.svelte`)

---

### 3. `Choices` - 选项列表

**职责：** 渲染当前可选选项列表，支持自定义选项组件，控制可见性。

**Props:** 无（从上下文获取 `InkStory` 实例和 zustand store）

**行为规范：**

- 从 `choicesStore` (core) 读取 `Choice[]` 数组
- 通过 `ChoiceRegistry` 查找 `choice.type` 对应的自定义组件（如存在则渲染，否则用默认 `<a>` 标签）
- 点击选项调用 `ink.choose(choice.index)`（`type === "unclickable"` 时忽略点击）
- 选项可见性由 `ink.choicesCanShow` 控制：
  - 不为 `boolean` 时默认为 `true`
  - 为 `false` 时列表 `visibility: hidden`（元素保留在 DOM 中）
  - 可见性变化时强制重建列表组件（React: `key={canShow ? ...}`；Svelte: `{#key canShow}`）
- 根容器：`<ul data-inkweave="choices" class="inkweave-choices">`
- 每个选项包裹在 `<li>` 中，CSS 变量 `--index: {数组索引}`
- 默认选项渲染为 `<a>` 标签，CSS 类包含 `inkweave-choice` + `choice.classes` + `button`
- `unclickable` 选项额外添加 `disabled` 类，并设置 `aria-disabled`

**自定义选项组件（ChoiceComponent）接口：**

```typescript
interface ChoiceComponentProps {
  choice: Choice;       // 选项数据对象（来自 core）
  onClick: () => void;  // 点击回调
  className?: string;   // 预构建的 CSS 类名
  children?: 框架特定;  // 默认文本内容（用于自定义组件的插槽）
}
```

自定义组件由适配器的 `ChoiceRegistry` 管理，插件通过 `ChoiceRenderer.register(type, component)` 注册。

**参考实现：** React (`packages/react/src/components/choices/index.tsx:70`)、Svelte (`packages/svelte/src/Choices.svelte`)

---

### 4. `CommandBar` - 命令栏

**职责：** 渲染命令按钮栏 + 模态框，提供存档/读档等全局操作入口。

**Props:**

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `ink` | `InkStory` (from core) | 是 | 故事引擎实例 |
| `class` 或 `className` | `string` | 否 | 命令栏容器类名 |
| `buttonClass` 或 `buttonClassName` | `string` | 否 | 命令按钮类名 |
| `modalClass` 或 `modalClassName` | `string` | 否 | 模态框类名 |
| `t` | `TranslationFunction` | 否 | 翻译函数 |

**行为规范：**

- 从 `CommandRegistry` (core) 获取所有已注册命令
- 按 `priority` 升序排列按钮
- 点击无 `getModalContent` 的命令：调用 `CommandRegistry.execute(id, ink)`
- 点击有 `getModalContent` 的命令：打开 `<dialog>` 模态框
- 模态框结构（固定 DOM ID）：
  ```html
  <dialog>
    <div id="inkweave-modal-header">
      <span id="inkweave-modal-title">{title}</span>
      <button id="inkweave-modal-close">×</button>
    </div>
    <div id="inkweave-modal-body"></div>
  </dialog>
  ```
- 模态框支持：backdrop 点击关闭、ESC 关闭、`dialog.close()` 事件
- SVG 图标按钮仅显示图标；无图标按钮显示翻译后的文字

**模态内容渲染策略（核心差异点）：**

`Command.getModalContent(props)` 在不同框架返回不同类型：

| 框架 | `getModalContent` 返回值 | 渲染方式 |
|------|------------------------|---------|
| React | `ReactNode`（JSX 元素） | 直接作为 JSX 渲染到 body 中 |
| Svelte | `{ component, props }` | 调用 `mount(component, { target, props })` 动态挂载 |

适配器实现 `CommandBar` 时需按框架约定处理此差异。插件入口代码也需对应输出正确类型（见下文「插件集成」）。

**参考实现：** React (`packages/react/src/components/command-bar/index.tsx:9`)、Svelte (`packages/svelte/src/CommandBar.svelte`)

---

## 必须导出的基础设施

### ChoiceRegistry

选择组件注册表，实现 `ChoiceRenderer` 接口（来自 core）：

```typescript
interface ChoiceRenderer {
  register(type: string, component: unknown): void
}
```

**行为：**

- 存储 `type` 到框架原生组件的映射
- 同时导出 `get`/`register`/`unregister`/`clear`/`has` 方法
- 在适配器入口 `index.ts` 中作为命名导出

> 注：React 和 Svelte 的 `ChoiceRegistry` 实现完全相同（代码逐字一致），但必须各自实例化，因为持有的 `component` 类型是框架特定的（`FC<ChoiceComponentProps>` vs `Component<ChoiceComponentProps>`）。

**参考实现：** React (`packages/react/src/components/choices/ChoiceRegistry.ts`)、Svelte (`packages/svelte/src/ChoiceRegistry.ts`)

---

### InkStory 上下文

提供将 `InkStory` 实例向下传递的机制：

- **React：** 使用 `createContext` + Provider，导出 `useStory()` hook
- **Svelte：** 使用 `setContext`/`getContext` + `Symbol` key，导出 `setStoryContext`/`getStoryContext`

子组件（Contents、Choices）通过上下文获取 `InkStory` 实例，不从 props 接收。

---

### 状态桥接

将 core 提供的 zustand stores 桥接到框架的响应式系统：

| Store (core) | 用途 | React 使用方式 | Svelte 使用方式 |
|-------------|------|---------------|----------------|
| `contentsStore` | 内容行 | `contentsStore(s => s.contents)` | `syncZustand(contentsStore, s => s.contents)` |
| `choicesStore` | 选项列表 | `choicesStore(s => s.choices)` | `syncZustand(choicesStore, s => s.choices)` |

React 可直接使用 zustand 的 hook API。Svelte 5 需实现 `syncZustand()` 桥接函数，通过 `$effect` 订阅 store 变化同步到 `$state`。

**参考实现：** Svelte (`packages/svelte/src/stores.svelte.ts:8`)

---

### 全局响应式变量

fade-effect 插件需要在适配器层面暴露两个全局响应式值：

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `choicesCanShow` | `boolean` | `true` | 内容动画播放完毕后选项才可交互 |
| `lineDelay` | `number` | `0.05` | 每行动画延迟（秒） |

- React：通过 zustand store (`useContentComplete`) 管理
- Svelte：需要额外导出 `useChoicesCanShow()` 和 `useLineDelay()` 作为 `$state` wrapper，供 Svelte 版 fade-effect 插件使用

---

## DOM / CSS 约定

以下由 `@inkweave/web` 的全局样式表及适配器组件共同遵守：

| 选择器/ID | 来源 | 说明 |
|----------|------|------|
| `#inkweave-story` | Story 组件 | 故事根元素 ID |
| `[data-inkweave="story"]` | Story 组件 | 故事根元素 data 属性 |
| `.inkweave-contents` | Contents 组件 | 内容区容器 |
| `.inkweave-content-line` | Contents 组件 | 每行内容 |
| `.inkweave-choices` | Choices 组件 | 选项区容器 |
| `[data-inkweave="choices"]` | Choices 组件 | 选项区 data 属性 |
| `.inkweave-choice` | Choice 类 (core) | 选项默认 CSS 类 |
| `.inkweave-divider` | Contents 组件 | 选项前分隔线 |
| `.inkweave-fade` | Contents 组件 | 淡入动画触发类 |
| `.inkweave-command-btn` | CommandBar 组件 | 命令按钮 |
| `#inkweave-modal-header` | CommandBar 组件 | 模态框头部 |
| `#inkweave-modal-title` | CommandBar 组件 | 模态框标题 |
| `#inkweave-modal-body` | CommandBar 组件 | 模态框内容区 |
| `#inkweave-modal-close` | CommandBar 组件 | 模态框关闭按钮 |
| `--delay` (CSS 变量) | Contents 组件 | 淡入动画延迟 |
| `--index` (CSS 变量) | Choices 组件 | 选项列表索引 |

---

## 插件集成

插件通过 `@inkweave/plugins` 的子路径入口（`./react`、`./svelte`）接入适配器。每种适配器需要：

### 1. ChoiceRenderer 适配

为 `createAutoButtonPlugin` / `createCdButtonPlugin` 工厂函数提供 `ChoiceRenderer` 实例：

```typescript
// React 入口
const reactChoiceRenderer: ChoiceRenderer = {
  register(type, component) {
    ChoiceRegistry.register(type, component as never);
  },
};

// Svelte 入口
const svelteChoiceRenderer: ChoiceRenderer = {
  register(type, component) {
    ChoiceRegistry.register(type, component as never);
  },
};
```

### 2. fade-effect 插件适配

`createFadeEffectPlugin(setupFn)` 接受框架特定的 `setupChoicesCanShow` 回调：

- **React**：将 `ink.choicesCanShow` 定义为 zustand store 的 getter
- **Svelte**：将 `ink.choicesCanShow` 桥接到 `useChoicesCanShow()` 的 `$state`，同时桥接 `ink.linedelay` 到 `useLineDelay()`

### 3. memory 插件模态内容

`createMemoryPlugin(fn)` 的回调中，`getModalContent` 需返回框架适配的格式：

- **React**：返回 `ReactNode`（通过 `React.createElement(SaveModal, props)`）
- **Svelte**：返回 `{ component: SaveModal, props: {...} }`（供 `CommandBar` 中 `mount()` 调用）

---

## 新增框架适配器检查清单

- [ ] 实现 4 个组件：`Story`、`Contents`、`Choices`、`CommandBar`
- [ ] 实现 `ChoiceRegistry`（满足 `ChoiceRenderer` 接口）
- [ ] 实现 `InkStory` 上下文传递机制
- [ ] 实现 zustand store 到框架响应式系统的桥接
- [ ] 实现 `choicesCanShow` + `lineDelay` 全局响应式变量（供 fade-effect 插件使用）
- [ ] `Story` 挂载时调用 `ink.continue()` + `onInit`
- [ ] 遵守 DOM ID/类名约定（见上表）
- [ ] `Choices` 支持 `ink.choicesCanShow` 可见性控制 + key 重建
- [ ] `CommandBar` 支持 `getModalContent` 的双返回类型策略
- [ ] 在 `@inkweave/plugins/src/<framework>/index.ts` 添加插件入口
- [ ] 在 `@inkweave/plugins/package.json` 的 `exports` 添加子路径
- [ ] （可选）在 `@inkweave/web` 添加 IIFE bundle 入口和构建配置
- [ ] 编写单元测试和 E2E 测试
