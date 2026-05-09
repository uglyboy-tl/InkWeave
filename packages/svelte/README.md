# @inkweave/svelte

English | [中文](./README.zh-cn.md)

Svelte components for InkWeave - ready to use in Svelte applications.

## Installation

```bash
npm install @inkweave/svelte @inkweave/core svelte
```

## Quick Start

```svelte
<script>
  import { createInkStory } from "@inkweave/core";
  import { Story } from "@inkweave/svelte";
  import "@inkweave/svelte/svelte.css";

  const ink = createInkStory("Hello, World!\n+ [Choice A] You chose A. -> DONE\n+ [Choice B] You chose B. -> DONE");
</script>

<Story {ink} />
```

## Components

### Story

The main story container component.

```svelte
<Story
  {ink}
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

### Contents

Story content display component.

```svelte
<script>
  import { Contents } from "@inkweave/svelte";
</script>

<Contents />
```

### Choices

Choice list component.

```svelte
<script>
  import { Choices } from "@inkweave/svelte";
</script>

<Choices />
```

### CommandBar

Command bar with save, load, restart buttons.

```svelte
<script>
  import { CommandBar } from "@inkweave/svelte";
</script>

<CommandBar {ink} />
```

## Custom Choice Components

Register custom choice button components via `ChoiceRegistry`:

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

Svelte stores synced with Zustand stores:

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

Manage InkStory instance context via `getStoryContext` / `setStoryContext`.

## Styling

Import default CSS:

```svelte
<style>
  @import "@inkweave/svelte/svelte.css";
</style>
```

## License

MIT
