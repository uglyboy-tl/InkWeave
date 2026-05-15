# Calico 插件分析与对比

本文档记录了对 [Calico](https://github.com/elliotherriman/calico) 项目插件系统的分析，并与 InkWeave 现有系统进行了对比。

## 项目概述

Calico 是一个基于 JavaScript 的互动小说引擎，提供了丰富的插件系统。它的插件系统设计精良，功能强大，可以作为 InkWeave 插件系统的参考。

## Calico 插件功能列表

### 1. audioplayer.js - 高级音频播放器
```javascript
// 主要功能：
// - #play: 播放音频
// - #playonce: 播放一次音频（不循环）
// - #pause: 暂停音频（实际是静音）
// - #resume: 恢复音频
// - #stop: 停止音频
// - #volume: 设置音量

// 配置选项：
var options = {
    audioplayer_allowmultipletracks: false,  // 是否允许多个音轨同时播放
    audioplayer_fadein: 2000,               // 淡入时间（毫秒）
    audioplayer_fadeout: 2000,              // 淡出时间（毫秒）
};
```

### 2. autosave.js - 自动保存
```javascript
// 自动在每次 passage 开始和故事重启时保存状态
// 依赖 memorycard 插件

Patches.add(function() {
    this.outerdiv.addEventListener("passage start", (event) => {
        if (this.options.autosave_enabled) memorycard.save(event.detail.story);
    });

    this.outerdiv.addEventListener("story restarting", (event) => {
        if (this.options.autosave_enabled) memorycard.save(event.detail.story);
    });
});
```

### 3. history.js - 历史记录管理
```javascript
// 功能：跟踪玩家的选择历史，支持状态回溯
// 关键函数：load(story, index, el, callback) - 加载指定索引的历史状态

// 在 passage 结束时记录选择
this.outerdiv.addEventListener("passage end", (event) => {
    if (this.history.choices.length - 1 > this.ink.state.currentTurnIndex) {
        // 如果当前在回溯状态，删除不需要的状态
        this.history.choices.splice(this.ink.state.currentTurnIndex+1);
    }
    // 记录当前选择
    this.history.choices.push(event.detail.choice.index);
});
```

### 4. stepback.js - 步进回退功能
```javascript
// 提供两个方法：
Story.prototype.stepForwards = function() { /* 前进一步 */ }
Story.prototype.stepBack = function() { /* 回退一步 */ }

// 配置选项：
var options = {
    stepback_enabled: true,          // 启用回退功能
    stepback_stepforwards: true,     // 启用前进功能
};
```

### 5. memorycard.js - 内存卡功能
```javascript
// 保存和加载游戏状态
function save(story, id = "save", format = story.options.memorycard_format) {
    var save = Object.assign({}, story);
    save.history.turnIndex = story.ink.state.currentTurnIndex;
    save.ink = undefined;  // 不序列化引擎实例
    save.options = undefined;
    save.queue = undefined;
    // ... 其他清理工作
    storage.set(id, JSON.stringify(save), format, story);
}

function load(story, id = "save", format = story.options.memorycard_format) {
    var save = storage.get(id, format, story);
    if (save) {
        save = JSON.parse(save);
        Object.assign(story, save);
        // 恢复状态
        story.ink.state.currentTurnIndex = Math.min(save.history.turnIndex, story.history.choices.length - 1);
        history.load(story, story.ink.state.currentTurnIndex+1);
    }
}
```

### 6. storage.js - 多格式存储
```javascript
// 支持三种存储格式
var options = {
    storage_defaultformat: "session",  // 默认存储格式
    storage_ID: "",                   // 存储ID前缀
}

// 存储格式包括：
// - "cookies": ~4KB 限制，适合小数据
// - "session": ~5MB 限制，页面刷新后保留，关闭标签页清除
// - "local": ~5MB 限制，永久保存
```

### 7. scrollafterchoice.js - 选择后滚动
```javascript
// 选择后自动滚动到新内容位置
var options = {
    scrollafterchoice_breakonuserscroll: true,    // 用户滚动时中断动画
    scrollafterchoice_scrollup: true,             // 允许向上滚动
    scrollafterchoice_durationbase: 500,          // 最小滚动时间
    scrollafterchoice_durationmultiplier: 3,      // 滚动时间乘数
    scrollafterchoice_maxduration: 1250,          // 最大滚动时间
    scrollafterchoice_scrollTargetPadding: 0.2,   // 目标位置上边距（占视窗高度比例）
};
```

### 8. fadeafterchoice.js - 选择后文本淡隐
```javascript
// 新内容出现时旧内容淡隐
var options = {
    fadeafterchoice_onchoice: false,              // 选择时立即开始淡隐
    fadeafterchoice_fadelevel: 30.0,              // 淡隐目标透明度（0-100）
    fadeafterchoice_fadespeed: 200.0,             // 淡隐速度（毫秒）
    fadeafterchoice_fadedelay: 0.0,               // 淡隐延迟（毫秒）
};
```

### 9. dragtoscroll.js - 拖拽滚动
```javascript
// 鼠标拖拽页面滚动
var options = {
    dragtoscroll_loadatstart: true,               // 启动时加载
    dragtoscroll_vertical: true,                  // 允许垂直拖拽
    dragtoscroll_horizontal: false,               // 允许水平拖拽
    dragtoscroll_verticalmodifier: 0.9,           // 垂直拖拽灵敏度
    dragtoscroll_horizontalmodifier: 0.9,         // 水平拖拽灵敏度
};
```

### 10. preload.js - 资源预加载
```javascript
// 预加载资源并显示进度条
var options = {
    preload_tags: { 
        "image": ["image", "background"],          // 图片标签
        "audio": [],                              // 音频标签
        "other": [],                              // 其他标签
    },
    preload_extrafiles: [],                        // 额外文件列表
    preload_widthtransitionspeed: 750,             // 进度条宽度变化速度
    preload_opacitytransitionspeed: 500,           // 进度条透明度变化速度
    preload_opacitytransitiondelay: 250,           // 透明度变化延迟
    preload_timeout: 1000,                         // 显示进度条前的延迟
};
```

## 与 InkWeave 现有插件对比

### 音频插件对比

| 功能 | Calico audioplayer | InkWeave audio |
|------|-------------------|----------------|
| 基础播放 | ✅ | ✅ |
| 暂停/恢复 | ✅ | ❌ |
| 淡入淡出 | ✅ | ❌ |
| 音量控制 | ✅ | ❌ |
| 多轨道播放 | 可选 | ❌ |
| 播放一次 | ✅ (#playonce) | ❌ |

### 存储插件对比

| 功能 | Calico memorycard/storage | InkWeave memory |
|------|---------------------------|-----------------|
| 多格式存储 | ✅ (cookies/session/local) | ❌ (仅local) |
| 自动保存 | ✅ (autosave.js) | 部分支持 |
| 状态回溯 | ✅ (history.js) | ❌ |
| 高级功能 | ✅ (历史管理、回退等) | ❌ |

### 滚动插件对比

| 功能 | Calico scrollafterchoice | InkWeave scrollafterchoice |
|------|--------------------------|----------------------------|
| 自动滚动 | ✅ | ✅ |
| 可配置参数 | ✅ (多个选项) | ❌ (基础实现) |
| 用户中断 | ✅ | ❌ |
| 平滑动画 | ✅ | 基础支持 |

## 值得参考的实现模式

### 1. 事件驱动架构
Calico 使用事件系统实现组件间通信：
```javascript
this.outerdiv.addEventListener("passage start", (event) => {
    // 处理事件
});
```

### 2. 模块化插件系统
每个插件都有清晰的职责分离：
- `history.js`: 专注于历史记录
- `memorycard.js`: 专注于状态保存
- `storage.js`: 专注于数据存储

### 3. 配置驱动设计
大量使用配置选项控制行为：
```javascript
var options = {
    feature_enabled: true,
    feature_option: defaultValue,
    // ...
};
```

### 4. Tag 处理模式
标准化的标签处理流程：
```javascript
Tags.add("tagname", function(story, property) {
    property = getTagOptions(property);
    // 处理逻辑
});
```

## 设计亮点

1. **渐进式功能增强** - 插件可以组合使用，例如 `autosave.js` 依赖 `memorycard.js`
2. **配置灵活性** - 大量配置选项允许精细化控制功能行为
3. **状态管理** - 完整的状态保存和恢复机制
4. **用户体验关注** - 滚动、淡隐等细节提升体验
5. **平台兼容性** - 考虑了不同平台的特殊处理（如 iOS 音频限制）

## 总结

Calico 的插件系统设计精良，功能完整，特别在用户体验细节方面有很多值得学习的地方。其模块化设计和灵活的配置系统为 InkWeave 的插件系统提供了很好的参考。