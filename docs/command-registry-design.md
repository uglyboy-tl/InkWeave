## 事件通信机制

由于 React 组件状态管理的复杂性，命令系统使用自定义 window 事件进行通信：

- **CommandButton** 执行命令 handler
- **插件 handler** 发射 `inkweave:modal-open` 事件  
- **CommandContainer** 监听事件并管理 modal 状态
- **Modal 组件** 监听事件并控制自身显示/隐藏

这种方式避免了修改 core 模块，同时保持了松耦合架构。