# InkWeave Plugins

InkWeave 插件扩展包，为交互式故事提供丰富的功能增强。

## 内置插件

| 插件              | 功能说明                 |
| ----------------- | ------------------------ |
| Image             | 显示场景背景图片         |
| Audio             | 播放背景音乐和音效       |
| Linkopen          | 打开外部网页链接         |
| FadeEffect        | 文字逐行淡入效果         |
| ScrollAfterChoice | 选择后自动滚动到最新内容 |
| AutoButton        | 隐藏按钮，定时自动触发   |
| CdButton          | 冷却按钮，显示倒计时     |
| Memory            | 存档管理（保存/读取）    |
| Autosave          | 自动保存游戏进度         |

### 内容扩展

#### Image - 图片显示

在故事中显示背景图片或场景插图。

**Ink 语法：**

```
#image:path/to/image.png
```

清除当前图片：

```
#image:
```

**效果：** 设置当前场景的背景图片，图片路径相对于 `basePath`。

---

#### Audio - 音频播放

支持背景音乐和音效播放。

**Ink 语法：**

```
#music:audio/bgm.mp3    // 播放背景音乐（循环）
#sound:audio/effect.wav // 播放音效（单次）
```

停止播放：

```
#music:    // 停止背景音乐
#sound:    // 停止音效
```

**效果：**

- `#music` 循环播放背景音乐，适合场景氛围
- `#sound` 播放单次音效，适合点击、过渡等

---

#### Linkopen - 外部链接

在故事中打开外部网页链接。

**Ink 语法：**

```
#linkopen:https://example.com
```

**效果：** 在新标签页打开指定 URL（仅支持 http/https 协议，安全限制）。

---

### 视觉效果

#### FadeEffect - 文字淡入

为文字添加逐行淡入效果，营造阅读节奏感。

**Ink 语法：**

```
#linedelay:0.05    // 设置每行延迟 0.05 秒
#linedelay:0       // 关闭淡入效果（立即显示全部文字）
```

**效果：** 文字按设定速度逐行淡入显示，选项按钮会在文字完全显示后才出现。

---

#### ScrollAfterChoice - 选择后滚动

选择选项后自动滚动到最新内容位置。

**Ink 语法：** 无需语法，自动生效。

**效果：** 确保用户始终看到最新的故事内容，适合长篇故事。

---

### 按钮增强

#### AutoButton - 自动按钮

隐藏按钮，倒计时后自动触发。

**Ink 语法：**

```
+ [按钮文本#auto:3]
  -> next_scene
```

**参数：** `#auto:秒数` - 自动触发的时间间隔

**效果：**

- 按钮隐藏不可见
- 指定秒数后自动执行该选项
- 适合倒计时跳转、跳过过场、自动推进剧情

**组合用法：** 同时提供手动和自动选项：

```
+ [跳过过场#auto:5]
  -> next
+ [点击继续]
  -> next
```

---

#### CdButton - 冷却按钮

按钮显示冷却倒计时，冷却期间禁用。

**Ink 语法：**

```
+ [攻击#cd:10]
  -> attack
```

**参数：** `#cd:秒数` - 冷却时间

**效果：**

- 显示按钮文本和剩余秒数：`攻击 (10)`
- 冷却期间按钮禁用，不可点击
- 适合技能冷却、回复限制等场景

**模板定制：** 初始化时可配置 `cdTemplate`：

```js
InkWeave.init({
  cdTemplate: '{text} [{time}s]', // 显示：攻击 [10s]
});
```

---

### 存档系统

#### Memory - 存档管理

提供存档、读档功能，支持 localStorage 和 sessionStorage。

**API：**

```js
import { memory } from '@inkweave/plugins';

memory.save(1, ink); // 保存到槽位 1
memory.load(saveData, ink); // 加载存档
memory.show(title); // 获取指定故事的存档列表
```

**配置：**

```js
loadMemory(); // 默认 localStorage
// 或在 init 时设置：memory_format: 'session'
```

---

#### Autosave - 自动存档

在指定位置自动保存游戏进度。

**Ink 语法：**

```
#autosave
```

**效果：** 执行到此标签时自动保存到槽位 1。

---

## 插件开发规范

### 插件结构

```
src/
├── myPlugin/
│   ├── index.ts      # 入口，导出 load 函数
│   ├── MyComponent.tsx  # 可选，React 组件
│   └── utils.ts      # 可选，辅助逻辑
│
└── index.ts          # 导出所有插件
```

### 入口文件规范

```ts
// index.ts
import { Tags, ChoiceParser, Patches, type InkStory } from '@inkweave/core';
import { ChoiceRegistry } from '@inkweave/react';

const options = {
  my_option: 'default_value',
};

const load = () => {
  // 注册功能...
};

export default load;
```

### 核心扩展点

#### 1. Tags - 内容标签

处理 ink 脚本中的 `#tag:value` 标签。

```ts
Tags.add('mytag', (val: string | null | undefined, ink: InkStory) => {
  // val 是标签值，ink 是故事实例
  if (val) {
    ink.options.my_option = val;
  }
});
```

**使用场景：** 图片、音频、链接、配置修改等。

---

#### 2. ChoiceParser - 选项解析

解析选项按钮的标签 `[文本#tag:value]`。

```ts
ChoiceParser.add('mytype', (choice, val) => {
  choice.type = 'mytype'; // 设置按钮类型
  choice.val = val; // 保存参数值
});
```

**配合组件注册：**

```ts
ChoiceRegistry.register('mytype', MyButtonComponent);
```

**使用场景：** 特殊按钮类型（自动、冷却、禁用等）。

---

#### 3. Patches - 实例扩展

扩展 InkStory 实例的能力和生命周期。

```ts
Patches.add(function (this: InkStoryContext) {
  // 添加属性
  this.myProperty = 'value';

  // 添加存档字段
  this.save_label.push('myProperty');

  // 清理钩子（故事重置时）
  this.clears.push(() => {
    this.myProperty = '';
  });

  // 销毁钩子（实例销毁时）
  this.cleanups.push(() => {
    // 清理资源...
  });
}, options);
```

**使用场景：** 添加状态、生命周期管理、存档字段。

---

#### 4. ChoiceRegistry - 按钮组件

注册自定义 React 选项按钮组件。

```tsx
// MyButton.tsx
import { memo } from 'react';
import type { ChoiceComponentProps } from '@inkweave/react';

const MyButton: React.FC<ChoiceComponentProps> = ({ choice, onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
      {/* 自定义渲染 */}
    </button>
  );
};

export default memo(MyButton);

// index.ts
ChoiceRegistry.register('mytype', MyButton);
```

---

### 类型声明扩展

当插件添加新属性时，需要扩展类型声明：

```ts
declare module '@inkweave/core' {
  interface InkStory {
    myProperty: string;
  }
}
```

---

### 开发建议

1. **单一职责**：每个插件专注一个功能
2. **命名规范**：
   - 标签：小写，无特殊字符（`#image`、`#music`）
   - 类型：简短描述性（`cd`、`auto`）
3. **配置可定制**：通过 options 提供默认配置
4. **生命周期管理**：
   - 使用 `clears` 处理故事重置
   - 使用 `cleanups` 处理实例销毁
5. **存档兼容**：新增状态需添加到 `save_label`

---

### 插件导出

在 `src/index.ts` 中导出：

```ts
export { default as loadMyPlugin } from './myPlugin';
```

使用方按需加载：

```ts
import { loadMyPlugin } from '@inkweave/plugins';
loadMyPlugin();
```
