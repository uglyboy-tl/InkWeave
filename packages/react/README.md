# @inkweave/react

English | [中文](./README.zh-cn.md)

React components for InkWeave - ready to use in React applications.

## Installation

```bash
npm install @inkweave/react @inkweave/core react react-dom
```

## Quick Start

```tsx
import { createInkStory } from "@inkweave/core";
import { Story } from "@inkweave/react";
import "@inkweave/react/react.css";

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
  className="custom-class"
  onInit={(ink) => console.log("Story initialized")}
>
  {/* optional custom children */}
</Story>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `ink` | `InkStory` | Story instance (required) |
| `className` | `string` | Custom CSS class name |
| `onInit` | `(ink: InkStory) => void` | Initialization callback |
| `children` | `React.ReactNode` | Custom content |

### CommandBar

Command bar with save, load, restart buttons.

```tsx
import { CommandBar } from "@inkweave/react";

<CommandBar ink={ink} />
```

## Custom Choice Components

Register custom choice button components via `ChoiceRegistry`:

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

Use with ink tags:

```
+ [Special option#mytype]
  -> special_path
```

## Hooks

### useStory

Access the InkStory instance within Story children:

```tsx
import { useStory } from "@inkweave/react";

function MyComponent() {
  const ink = useStory();
  // ink.choose(0), ink.restart(), etc.
}
```

## Styling

Import default CSS:

```tsx
import "@inkweave/react/react.css";
```

Access internal style class names via `choiceStyles` for custom components:

```tsx
import { choiceStyles } from "@inkweave/react";
```

## External Interaction (InteractionManager)

Map gestures, keyboard, etc. to choice selection:

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
