# @inkweave/solidjs

[English](./README.md) | 中文

InkWeave 的 SolidJS 组件包，提供开箱即用的交互式小说 UI 组件。

## 安装

```bash
npm install @inkweave/solidjs @inkweave/core solid-js
```

## 快速开始

```tsx
import { createInkStory } from "@inkweave/core";
import { Story } from "@inkweave/solidjs";
import "@inkweave/solidjs/solidjs.css";

const ink = createInkStory("Hello, World!\n+ [Choice A] You chose A. -> DONE\n+ [Choice B] You chose B. -> DONE");

function App() {
  return <Story ink={ink} />;
}
```

## 组件

### Story

故事容器组件。

```tsx
<Story
  ink={ink}
  class="custom-class"
  onInit={(ink) => console.log("Story initialized")}
/>
```

**Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `ink` | `InkStory` | 故事实例（必需） |
| `class` | `string` | 自定义 CSS 类名 |
| `onInit` | `(ink: InkStory) => void` | 初始化回调 |

### CommandBar

命令栏组件，提供存档、读档、重启等按钮。

```tsx
import { CommandBar } from "@inkweave/solidjs";

<CommandBar ink={ink} />
```

## 自定义选项组件

通过 `ChoiceRegistry` 注册自定义选项按钮组件：

```tsx
import { ChoiceRegistry } from "@inkweave/solidjs";
import type { ChoiceComponentProps } from "@inkweave/solidjs";

const MyButton = (props: ChoiceComponentProps) => {
  return (
    <button class={props.className} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

ChoiceRegistry.register("mytype", MyButton);
```

## Hooks

### useStory

在 Story 子组件中获取 InkStory 实例：

```tsx
import { useStory } from "@inkweave/solidjs";

function MyComponent() {
  const ink = useStory();
  // ink.choose(0), ink.restart(), 等
}
```

## 样式

导入默认 CSS：

```tsx
import "@inkweave/solidjs/solidjs.css";
```

## License

MIT
