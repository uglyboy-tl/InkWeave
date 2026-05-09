# @inkweave/core

[English](./README.md) | 中文

InkWeave 的核心运行时引擎，基于 [inkjs](https://github.com/y-lohse/inkjs)。提供 ink 故事解析、事件驱动运行时、插件系统和响应式状态管理。

## 设计理念

Core 包遵循**最小依赖、最大扩展**原则：

- **不依赖任何前端框架** — 可在 React、Svelte、Vue 或纯 Node.js 中使用
- **通过 SPI 暴露扩展点** — 标签处理、内容解析、选择行为、实例补丁均可由外部插件注入
- **事件驱动** — 所有生命周期节点（初始化、继续、选择、清理、销毁）通过事件总线通信
- **静态注册表模式** — 插件通过全局注册表注册处理器，Story 实例化时自动加载

## 目录结构

```
src/
├── index.ts              统一导出（公共 API）
├── create.ts              工厂函数 createInkStory()
├── types.ts               跨模块纯类型定义
├── constants.ts           常量（Events, CHOICE_SEPARATOR 等）
│
├── events/                事件系统
│   ├── EventEmitter.ts    发布订阅实现
│   └── types.ts           EventEmitterInterface 等
│
├── plugin/                插件子系统
│   ├── types.ts           Plugin, ChoiceRenderer
│   ├── PluginRegistry.ts  全局注册表 + 依赖解析
│   └── PluginLoader.ts    实例级加载器
│
├── story/                 Story 引擎 + 扩展点
│   ├── InkStory.ts        核心运行时类
│   ├── TagHandler.ts      标签处理器（ink → JS 副作用）
│   ├── ContentParser.ts   内容行解析器（文本转换）
│   ├── ChoiceHandler.ts   选择项标签处理器
│   ├── InteractionManager.ts  外部交互映射管理器
│   ├── Patches.ts         实例补丁系统（JS → Engine）
│   └── Externals.ts       外部函数绑定
│
├── command/               命令系统
│   ├── types.ts           Command, ModalContentProps
│   └── CommandRegistry.ts 命令注册 + 执行
│
├── state/                 响应式状态（Zustand）
│   ├── contents.ts        内容 store
│   ├── choices.ts         选择 store
│   └── variables.ts       变量 store
│
└── file/                  文件处理
    ├── FileHandler.ts     FileHandler 接口 + BaseFileHandler
    └── InkjsFileHandler.ts inkjs 桥接器
```

## 扩展系统

Core 提供 6 个扩展点，插件通过静态注册表注入行为：

| 扩展点 | 方向 | 注册 API | 用途 |
|--------|------|---------|------|
| `TagHandler` | ink → JS | `TagHandler.add(name, fn)` | 处理 ink 标签副作用（# image, # sound） |
| `ContentParser` | ink → JS | `ContentParser.tag(name, fn)` | 文本行转换（添加 CSS 类） |
| `ChoiceHandler` | ink → JS | `ChoiceHandler.add(type, fn)` | 选择项行为定制 |
| `InteractionManager` | JS → Engine | `ink.interactionManager.register(name, fn)` | 外部交互映射（手势、键盘等驱动选择） |
| `Patches` | JS → Engine | `Patches.add(fn, opts)` | 运行时扩展 Story 实例属性 |
| `Externals` | ink → JS | `Externals.add(id, fn)` | 注册 ink 外部函数 |

**Clear/Restart 标签**由 `TagHandler.isFlushTag()` 统一判断，各扩展点不再硬编码标签名。

## 插件系统

```typescript
// 注册插件
PluginRegistry.register({
  id: "my-plugin",
  enabledByDefault: true,
  onLoad: () => { TagHandler.add("mytag", handler); },
});

// 控制启用
PluginRegistry.setEnabled({ "my-plugin": false });
```

`PluginRegistry` 负责全局注册和配置，`PluginLoader` 负责实例化时加载启用的插件。依赖解析（正向级联启用、反向级联禁用）由 `PluginRegistry.resolveDependencies()` 处理。

## 命令系统

```typescript
CommandRegistry.add("restart", {
  name: "menu_restart",
  handler: (ink) => ink.restart(),
});
```

框架适配器通过 `getModalContent` 注入框架特定的模态框内容。每个框架的入口文件负责将命令注册到 `CommandRegistry`。

## 框架适配

Core 提供 `ChoiceRenderer` SPI 接口供框架适配器实现：

```typescript
export interface ChoiceRenderer {
  register(type: string, component: unknown): void;
}
```

框架适配器（如 React、Svelte）在各自的入口文件中创建 `ChoiceRenderer` 实现，注册框架特定的选择项组件。

## 交互管理器（InteractionManager）

`InteractionManager` 允许将外部交互（手势、键盘、语音等）映射到故事选择，无需用户点击选项。适用于"王权"类左右滑动游戏、键盘快捷操作等场景。

```typescript
import { createInkStory, InteractionManager } from "@inkweave/core";

const ink = createInkStory("...");

// 注册映射：将 "swipe-left" 映射到第一个选项
ink.interactionManager.register("swipe-left", (choices) => choices[0]?.index ?? null);
ink.interactionManager.register("swipe-right", (choices) => choices[1]?.index ?? null);

// 外部检测到滑动后触发
someSwipeDetector.onSwipeLeft(() => ink.interactionManager.trigger("swipe-left"));
```

`trigger()` 会自动调用 `ink.choose(index)`，无需手动处理。

### 内置预设

```typescript
InteractionManager.presets.left   // 第一个选项
InteractionManager.presets.right  // 第二个选项
InteractionManager.presets.first  // 第一个选项
InteractionManager.presets.second // 第二个选项
```

### API

| 方法 | 说明 |
|------|------|
| `register(name, resolver)` | 注册交互映射 |
| `trigger(name)` | 触发交互，返回是否成功 |
| `unregister(name)` | 注销交互 |
| `has(name)` | 检查是否已注册 |
| `getRegistered()` | 获取已注册的名称列表 |
| `clear()` | 清空所有注册 |

## 基本用法

```typescript
import { createInkStory } from "@inkweave/core";

const ink = createInkStory("Hello World\n+ [Choice] -> end");
ink.continue();                           // 推进故事
const choices = ink.choices;              // 获取当前选项
ink.choose(0);                            // 选择第 0 项
```

## 依赖

- `inkjs` — ink 编译器/运行时
- `zustand` — 响应式状态管理（仅用于 stores）
