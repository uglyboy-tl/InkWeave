# @inkweave/core

English | [中文](./README.zh-cn.md)

The core runtime engine for InkWeave, built on [inkjs](https://github.com/y-lohse/inkjs). Provides ink story parsing, event-driven runtime, plugin system, and reactive state management.

## Design Philosophy

The core package follows a **minimal dependencies, maximum extensibility** principle:

- **No frontend framework dependency** — works with React, Svelte, Vue, or pure Node.js
- **SPI-exposed extension points** — tag handling, content parsing, choice behavior, and instance patching are all injectable by external plugins
- **Event-driven** — all lifecycle nodes (init, continue, choose, clear, dispose) communicate via event bus
- **Static registry pattern** — plugins register handlers via global registries, auto-loaded on Story instantiation

## Directory Structure

```
src/
├── index.ts              Unified exports (public API)
├── create.ts              Factory function createInkStory()
├── types.ts               Cross-module pure type definitions
├── constants.ts           Constants (Events, CHOICE_SEPARATOR, etc.)
│
├── events/                Event system
│   ├── EventEmitter.ts    Pub/sub implementation
│   └── types.ts           EventEmitterInterface, etc.
│
├── plugin/                Plugin subsystem
│   ├── types.ts           Plugin, ChoiceRenderer
│   ├── PluginRegistry.ts  Global registry + dependency resolution
│   └── PluginLoader.ts    Instance-level loader
│
├── story/                 Story engine + extension points
│   ├── InkStory.ts        Core runtime class
│   ├── TagHandler.ts      Tag handler (ink → JS side effects)
│   ├── ContentParser.ts   Content line parser (text transformation)
│   ├── ChoiceHandler.ts   Choice item tag handler
│   ├── InteractionManager.ts  External interaction mapper
│   ├── Patches.ts         Instance patch system (JS → Engine)
│   └── Externals.ts       External function binding
│
├── command/               Command system
│   ├── types.ts           Command, ModalContentProps
│   └── CommandRegistry.ts Command registration + execution
│
├── state/                 Reactive state (Zustand)
│   ├── contents.ts        Content store
│   ├── choices.ts         Choice store
│   └── variables.ts       Variable store
│
└── file/                  File handling
    ├── FileHandler.ts     FileHandler interface + BaseFileHandler
    └── InkjsFileHandler.ts inkjs bridge
```

## Extension System

Core provides 6 extension points. Plugins inject behavior via static registries:

| Extension Point | Direction | Registration API | Purpose |
|-----------------|-----------|-----------------|---------|
| `TagHandler` | ink → JS | `TagHandler.add(name, fn)` | Handle ink tag side effects (# image, # sound) |
| `ContentParser` | ink → JS | `ContentParser.tag(name, fn)` | Text line transformation (add CSS classes) |
| `ChoiceHandler` | ink → JS | `ChoiceHandler.add(type, fn)` | Choice item behavior customization |
| `InteractionManager` | JS → Engine | `ink.interactionManager.register(name, fn)` | External interaction mapping (gestures, keyboard, etc.) |
| `Patches` | JS → Engine | `Patches.add(fn, opts)` | Runtime Story instance property extension |
| `Externals` | ink → JS | `Externals.add(id, fn)` | Register ink external functions |

**Clear/Restart tags** are unified via `TagHandler.isFlushTag()`, no hardcoded tag names in extension points.

## Plugin System

```typescript
// Register a plugin
PluginRegistry.register({
  id: "my-plugin",
  enabledByDefault: true,
  onLoad: () => { TagHandler.add("mytag", handler); },
});

// Control enable/disable
PluginRegistry.setEnabled({ "my-plugin": false });
```

`PluginRegistry` handles global registration and configuration. `PluginLoader` loads enabled plugins on instantiation. Dependency resolution (cascading enable/disable) is handled by `PluginRegistry.resolveDependencies()`.

## Command System

```typescript
CommandRegistry.add("restart", {
  name: "menu_restart",
  handler: (ink) => ink.restart(),
});
```

Framework adapters inject framework-specific modal content via `getModalContent`. Each framework's entry file is responsible for registering commands to `CommandRegistry`.

## Framework Adapters

Core provides the `ChoiceRenderer` SPI interface for framework adapters:

```typescript
export interface ChoiceRenderer {
  register(type: string, component: unknown): void;
}
```

Framework adapters (React, Svelte, etc.) create `ChoiceRenderer` implementations in their entry files to register framework-specific choice components.

## InteractionManager

`InteractionManager` maps external interactions (gestures, keyboard, voice, etc.) to story choices without requiring users to click options. Ideal for "Reigns"-style swipe games, keyboard shortcuts, etc.

```typescript
import { createInkStory, InteractionManager } from "@inkweave/core";

const ink = createInkStory("...");

// Register mappings
ink.interactionManager.register("swipe-left", (choices) => choices[0]?.index ?? null);
ink.interactionManager.register("swipe-right", (choices) => choices[1]?.index ?? null);

// Trigger from external gesture detector
someSwipeDetector.onSwipeLeft(() => ink.interactionManager.trigger("swipe-left"));
```

`trigger()` automatically calls `ink.choose(index)`, no manual handling needed.

### Built-in Presets

```typescript
InteractionManager.presets.left   // First choice
InteractionManager.presets.right  // Second choice
InteractionManager.presets.first  // First choice
InteractionManager.presets.second // Second choice
```

### API

| Method | Description |
|--------|-------------|
| `register(name, resolver)` | Register interaction mapping |
| `trigger(name)` | Trigger interaction, returns success |
| `unregister(name)` | Unregister interaction |
| `has(name)` | Check if registered |
| `getRegistered()` | Get list of registered names |
| `clear()` | Clear all registrations |

## Basic Usage

```typescript
import { createInkStory } from "@inkweave/core";

const ink = createInkStory("Hello World\n+ [Choice] -> end");
ink.continue();                           // Advance the story
const choices = ink.choices;              // Get current choices
ink.choose(0);                            // Select choice 0
```

## Dependencies

- `inkjs` — ink compiler/runtime
- `zustand` — reactive state management (stores only)
