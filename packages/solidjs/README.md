# @inkweave/solidjs

English | [中文](./README.zh-cn.md)

SolidJS components for InkWeave - ready to use in SolidJS applications.

## Installation

```bash
npm install @inkweave/solidjs @inkweave/core solid-js
```

## Quick Start

```tsx
import { createInkStory } from "@inkweave/core";
import { Story } from "@inkweave/solidjs";
import "@inkweave/solidjs/solidjs.css";

const ink = createInkStory("Hello, World!\n+ [Choice A] You chose A. -> DONE\n+ [Choice B] You chose B. -> DONE");

function App() {
  return <Story ink={ink} />;
}
```

## Components

### Story

The main story container component.

```tsx
<Story
  ink={ink}
  class="custom-class"
  onInit={(ink) => console.log("Story initialized")}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `ink` | `InkStory` | Story instance (required) |
| `class` | `string` | Custom CSS class name |
| `onInit` | `(ink: InkStory) => void` | Initialization callback |

### CommandBar

Command bar with save, load, restart buttons.

```tsx
import { CommandBar } from "@inkweave/solidjs";

<CommandBar ink={ink} />
```

## Custom Choice Components

Register custom choice button components via `ChoiceRegistry`:

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

Access the InkStory instance within Story children:

```tsx
import { useStory } from "@inkweave/solidjs";

function MyComponent() {
  const ink = useStory();
  // ink.choose(0), ink.restart(), etc.
}
```

## Styling

Import default CSS:

```tsx
import "@inkweave/solidjs/solidjs.css";
```

## License

MIT
