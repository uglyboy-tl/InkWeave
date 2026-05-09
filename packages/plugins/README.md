# InkWeave Plugins

English | [中文](./README.zh-cn.md)

Plugin extension pack for InkWeave, providing rich functionality for interactive fiction.

## Built-in Plugins

| Plugin            | Description                          |
| ----------------- | ------------------------------------ |
| Image             | Display scene background images      |
| Audio             | Play background music and SFX        |
| Linkopen          | Open external web links              |
| FadeEffect        | Line-by-line text fade-in            |
| ScrollAfterChoice | Auto-scroll to latest content        |
| AutoButton        | Hidden button with auto-trigger      |
| CdButton          | Cooldown button with countdown       |
| Memory            | Save/load management                 |
| Autosave          | Tag-triggered auto-save              |
| AutoRestore       | Auto-save and restore game progress  |

### Content Extensions

#### Image

Display background images or scene illustrations.

**Ink syntax:**

```
#image:path/to/image.png
```

Clear current image:

```
#image:
```

**Effect:** Sets the background image for the current scene. Path is relative to `basePath`.

---

#### Audio

Background music and sound effect playback.

**Ink syntax:**

```
#music:audio/bgm.mp3    // Play BGM (loop)
#sound:audio/effect.wav // Play SFX (once)
```

Stop playback:

```
#music:    // Stop BGM
#sound:    // Stop SFX
```

**Effect:**
- `#music` loops background music for atmosphere
- `#sound` plays one-shot sound effects

---

#### Linkopen

Open external web links within the story.

**Ink syntax:**

```
#linkopen:https://example.com
```

**Effect:** Opens the URL in a new tab (http/https only for security).

---

### Visual Effects

#### FadeEffect

Line-by-line text fade-in for reading rhythm.

**Ink syntax:**

```
#linedelay:0.05    // 0.05s per line
#linedelay:0       // Disable (show all instantly)
```

**Effect:** Text fades in at the set speed. Choice buttons appear only after all text is shown.

---

#### ScrollAfterChoice

Auto-scroll to the latest content after making a choice.

**Ink syntax:** None — works automatically.

**Effect:** Ensures users always see the newest story content. Useful for long stories.

---

### Button Enhancements

#### AutoButton

Hidden button that auto-triggers after a countdown.

**Ink syntax:**

```
+ [Button text#auto:3]
  -> next_scene
```

**Parameter:** `#auto:seconds` — auto-trigger delay

**Effect:**
- Button is invisible
- Auto-executes the choice after the specified delay
- Suitable for countdown transitions, skip cutscenes, auto-advance plot

**Combined usage:**

```
+ [Skip cutscene#auto:5]
  -> next
+ [Click to continue]
  -> next
```

---

#### CdButton

Button with cooldown countdown, disabled during cooldown.

**Ink syntax:**

```
+ [Attack#cd:10]
  -> attack
```

**Parameter:** `#cd:seconds` — cooldown duration

**Effect:**
- Displays button text with remaining seconds: `Attack (10)`
- Button disabled during cooldown
- Suitable for skill cooldowns, reply limits, etc.

**Template customization:**

```js
InkWeave.init({
  cdTemplate: '{text} [{time}s]',  // displays: Attack [10s]
});
```

---

### Save System

#### Memory

Save/load functionality supporting localStorage and sessionStorage.

**API:**

```js
import { memory } from '@inkweave/plugins';

memory.save(1, ink);          // Save to slot 1
memory.load(saveData, ink);   // Load saved data
memory.show(title);           // Get save list for a title
```

**Configuration:**

```js
loadMemory();  // Default localStorage
// Or set during init: memory_format: 'session'
```

---

#### Autosave

Tag-triggered auto-save.

**Ink syntax:**

```
#autosave
```

**Effect:** Auto-saves to slot 1 when this tag is reached.

---

#### AutoRestore

Auto-save and restore, similar to Calico's autosave.

**Features:**
- Auto-saves to slot 0 after each choice
- Auto-loads the latest save on story initialization
- Minimal configuration required

**Usage:**

```js
import { loadAutoRestore } from '@inkweave/plugins';

loadAutoRestore();
```

**Difference from Autosave:**
- `Autosave`: requires `#autosave` tag to trigger
- `AutoRestore`: auto-saves at key points without tags, supports auto-restore

---

## Plugin Development

### Plugin Structure

```
src/
├── myPlugin/
│   ├── index.ts      # Entry, exports load function
│   ├── MyComponent.tsx  # Optional, React component
│   └── utils.ts      # Optional, helpers
│
└── index.ts          # Exports all plugins
```

### Entry File Convention

```ts
// index.ts
import { TagHandler, ChoiceHandler, Patches, type InkStory } from '@inkweave/core';
import { ChoiceRegistry } from '@inkweave/react';

const options = {
  my_option: 'default_value',
};

const load = () => {
  // Register functionality...
};

export default load;
```

### Core Extension Points

#### 1. Tags — Content Tags

Handle `#tag:value` tags in ink scripts.

```ts
TagHandler.add('mytag', (val: string | null | undefined, ink: InkStory) => {
  // val is the tag value, ink is the story instance
  if (val) {
    ink.options.my_option = val;
  }
});
```

**Use cases:** images, audio, links, configuration tweaks.

---

#### 2. ChoiceHandler — Choice Parsing

Parse choice button tags `[text#tag:value]`.

```ts
ChoiceHandler.add('mytype', (choice, val) => {
  choice.type = 'mytype';  // Set button type
  choice.val = val;        // Save parameter value
});
```

**With component registration:**

```ts
ChoiceRegistry.register('mytype', MyButtonComponent);
```

**Use cases:** special button types (auto, cooldown, disabled).

---

#### 3. Patches — Instance Extension

Extend InkStory instance with custom properties and lifecycle hooks.

```ts
Patches.add(function (this: InkStoryContext) {
  this.myProperty = 'value';
  this.save_label.push('myProperty');
}, options);
```

**Use cases:** state management, lifecycle hooks, save fields.

---

#### 4. ChoiceRegistry — Button Components

Register custom React choice button components.

```tsx
import { memo } from 'react';
import type { ChoiceComponentProps } from '@inkweave/react';

const MyButton: React.FC<ChoiceComponentProps> = ({ choice, onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default memo(MyButton);

// index.ts
ChoiceRegistry.register('mytype', MyButton);
```

---

### Type Declaration Extension

Extend type declarations when plugins add new properties:

```ts
declare module '@inkweave/core' {
  interface InkStory {
    myProperty: string;
  }
}
```

---

### Development Tips

1. **Single responsibility** — each plugin focuses on one feature
2. **Naming conventions**:
   - Tags: lowercase, no special chars (`#image`, `#music`)
   - Types: short and descriptive (`cd`, `auto`)
3. **Customizable** — provide defaults via `options`
4. **Lifecycle management** — use event system for cleanup
5. **Save compatibility** — add new state to `save_label`

---

### Plugin Export

Export in `src/index.ts`:

```ts
export { default as loadMyPlugin } from './myPlugin';
```

Consumers load on demand:

```ts
import { loadMyPlugin } from '@inkweave/plugins';
loadMyPlugin();
```
