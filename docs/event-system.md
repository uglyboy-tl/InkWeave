# InkWeave 事件系统

InkWeave 的事件系统实现了组件间的松耦合通信，灵感来自 Calico 的事件驱动架构。

## 设计理念

事件系统的主要目的是：
- 实现组件间的松耦合
- 提供插件开发的标准接口
- 支持故事生命周期的钩子
- 提供比状态管理更灵活的通信方式

## 核心概念

### EventEmitter 类

```typescript
import { EventEmitter } from "@inkweave/core";

const emitter = new EventEmitter();

// 订阅事件
const unsubscribe = emitter.on("event.name", (data) => {
  console.log("收到事件", data);
});

// 发射事件
emitter.emit("event.name", { some: "data" });

// 取消防护
unsubscribe();
```

### 事件生命周期

InkWeave 在关键节点发射以下事件：

#### 故事相关事件
- `story.continue.start` - 故事即将继续
- `story.continue.end` - 故事继续完成
- `story.restart.start` - 故事即将重启
- `story.restart.end` - 故事重启完成
- `story.clear.start` - 故事即将清空
- `story.clear.end` - 故事清空完成

#### 选择相关事件
- `choice.selecting` - 即将做出选择
- `choice.selected` - 选择已完成

#### 内容相关事件
- `contents.changed` - 内容发生变更

#### 插件相关事件
- `patches.apply.start` - 补丁应用开始
- `patches.apply.end` - 补丁应用结束

## 使用示例

### 在插件中使用事件

```typescript
import { Patches } from "@inkweave/core";

Patches.add(function (this: InkStory) {
  // 监听内容变更并执行操作
  this.eventEmitter.on("contents.changed", (data) => {
    // 更新UI组件
    updateContentDisplay(data.newContents);
  });

  // 监听选择事件
  this.eventEmitter.on("choice.selected", (data) => {
    // 记录用户选择
    analytics.track("choice_made", {
      choice: data.selectedChoice?.text,
      index: data.index
    });
  });
}, {});
```

### 创建自定义事件

```typescript
// 在你的组件中
this.eventEmitter.emit("custom.event", {
  story: this,
  payload: "your data"
});
```

## 与 Calico 事件系统的比较

| 特性 | Calico | InkWeave |
|------|--------|----------|
| 实现方式 | DOM CustomEvent | 自定义 EventEmitter |
| 性能 | 依赖 DOM 事件系统 | 更轻量的纯 JavaScript 实现 |
| 类型安全 | 无 | 完整的 TypeScript 支持 |
| 错误处理 | 基础 | 完善的错误隔离 |
| 解耦程度 | 高 | 极高（不依赖 DOM）|

## 最佳实践

1. **事件命名**：使用点分隔的命名约定，如 `component.action.event`
2. **数据传递**：事件数据应为简单的可序列化对象
3. **错误处理**：事件处理器中的错误不会影响其他处理器
4. **内存管理**：记得在适当时候取消事件订阅
5. **性能考虑**：避免在高频事件中执行重量级操作

## 插件开发指南

事件系统为插件开发提供了强大支持：

```typescript
const myPlugin = () => {
  Patches.add(function (this: InkStory) {
    // 响应故事事件
    const unsub1 = this.eventEmitter.on("story.continue.end", (data) => {
      // 执行插件逻辑
    });

    // 响应选择事件
    const unsub2 = this.eventEmitter.on("choice.selected", (data) => {
      // 执行插件逻辑
    });

    // 在清理时取消订阅
    this.cleanups.push(() => {
      unsub1();
      unsub2();
    });
  }, {});
};
```

这种模式使得插件可以响应故事状态变化而无需紧密耦合到核心系统。