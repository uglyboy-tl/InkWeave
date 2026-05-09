# @inkweave/svelte

[English](./README.md) | 中文

InkWeave 的 Svelte 组件包，提供开箱即用的交互式小说 UI 组件。

## 安装

```bash
npm install @inkweave/svelte @inkweave/core svelte
```

## 快速开始

```svelte
<script>
  import { createInkStory } from "@inkweave/core";
  import { Story } from "@inkweave/svelte";
  import "@inkweave/svelte/svelte.css";

  const ink = createInkStory("Hello, World!\n+ [Choice A] You chose A. -> DONE\n+ [Choice B] You chose B. -> DONE");
</script>

<Story {ink} />
```

## 组件

### Story

故事容器组件。

```svelte
<Story
  {ink}
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

### Contents

故事内容显示组件。

```svelte
<script>
  import { Contents } from "@inkweave/svelte";
</script>

<Contents />
```

### Choices

选项列表组件。

```svelte
<script>
  import { Choices } from "@inkweave/svelte";
</script>

<Choices />
```

### CommandBar

命令栏组件，提供存档、读档、重启等按钮。

```svelte
<script>
  import { CommandBar } from "@inkweave/svelte";
</script>

<CommandBar {ink} />
```

## 自定义选项组件

通过 `ChoiceRegistry` 注册自定义选项按钮组件：

```svelte
<script>
  import { ChoiceRegistry } from "@inkweave/svelte";

  const MyButton = ({ choice, onClick, className, children }) => {
    return (
      <button class={className} on:click={onClick}>
        {children}
      </button>
    );
  };

  ChoiceRegistry.register("mytype", MyButton);
</script>
```

## Stores

与 Zustand store 同步的 Svelte stores：

```svelte
<script>
  import { useChoices, useContents } from "@inkweave/svelte";

  const choices = useChoices();
  const contents = useContents();
</script>

{#each $contents as item}
  <p>{item.text}</p>
{/each}
```

## Context

通过 `getStoryContext` / `setStoryContext` 管理 InkStory 实例的上下文。

## 样式

导入默认 CSS：

```svelte
<style>
  @import "@inkweave/svelte/svelte.css";
</style>
```

## License

MIT
