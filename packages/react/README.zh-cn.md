# @inkweave/react

[English](./README.md) | 中文

InkWeave 的 React 组件包，提供开箱即用的交互式小说 UI 组件。

## 安装

```bash
npm install @inkweave/react @inkweave/core react react-dom
```

## 快速开始

```tsx
import { createInkStory } from "@inkweave/core";
import { Story } from "@inkweave/react";
import "@inkweave/react/react.css";

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
  className="custom-class"
  onInit={(ink) => console.log("Story initialized")}
>
  {/* 可选的自定义子元素 */}
</Story>
```

**Props：**

| Prop | 类型 | 说明 |
|------|------|------|
| `ink` | `InkStory` | 故事实例（必需） |
| `className` | `string` | 自定义 CSS 类名 |
| `onInit` | `(ink: InkStory) => void` | 初始化回调 |
| `children` | `React.ReactNode` | 自定义内容 |

### CommandBar

命令栏组件，提供存档、读档、重启等按钮。

```tsx
import { CommandBar } from "@inkweave/react";

<CommandBar ink={ink} />
```

## 自定义选项组件

通过 `ChoiceRegistry` 注册自定义选项按钮组件：

```tsx
import { ChoiceRegistry, ChoiceComponentProps } from "@inkweave/react";

const MyButton: React.FC<ChoiceComponentProps> = ({ choice, onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

ChoiceRegistry.register("mytype", MyButton);
```

配合 ink 脚本中的标签使用：

```
+ [特殊选项#mytype]
  -> special_path
```

## Hooks

### useStory

在 Story 子组件中获取 InkStory 实例：

```tsx
import { useStory } from "@inkweave/react";

function MyComponent() {
  const ink = useStory();
  // ink.choose(0), ink.restart(), 等
}
```

## 样式

导入默认 CSS：

```tsx
import "@inkweave/react/react.css";
```

通过 `choiceStyles` 对象访问内部样式类名，用于自定义组件：

```tsx
import { choiceStyles } from "@inkweave/react";
```

## 外部交互（InteractionManager）

将手势、键盘等外部操作映射到选项选择：

```tsx
import { useEffect } from "react";
import { useStory } from "@inkweave/react";
import { InteractionManager } from "@inkweave/core";

function SwipeGame() {
  const ink = useStory();

  useEffect(() => {
    ink.interactionManager.register("swipe-left", InteractionManager.presets.left);
    ink.interactionManager.register("swipe-right", InteractionManager.presets.right);
  }, [ink]);

  return (
    <SwipeDetector
      onSwipeLeft={() => ink.interactionManager.trigger("swipe-left")}
      onSwipeRight={() => ink.interactionManager.trigger("swipe-right")}
    >
      <Story ink={ink} />
    </SwipeDetector>
  );
}
```

## License

MIT
