# InkWeave

InkWeave 是一个交互式小说播放器，基于 [ink](https://github.com/inkle/ink) 脚本语言，支持 React UI 和插件扩展系统。

**名称由来**：InkWeave = Ink + Weave（编织），通过插件系统"编织"各种能力。

## 包结构

```
@inkweave/core      → 核心引擎 + 扩展系统
@inkweave/react     → React 组件
@inkweave/plugins   → 可选功能模块
@inkweave/web       → 开箱即用的 IIFE 产物
@inkweave/cli       → 命令行工具
ink-player          → Obsidian 插件 (git submodule)
```

按需引入：

- 只需要核心引擎？只安装 `@inkweave/core`
- 需要 React UI？加上 `@inkweave/react`
- 需要存档、音频等功能？引入 `@inkweave/plugins`
- 只想直接用？使用 `@inkweave/web`
- 在 Obsidian 中阅读交互式小说？安装 [ink-player](https://github.com/uglyboy-tl/obsidian-ink-player)

## 扩展系统

| 系统                  | 方向        | 典型用途                       |
| --------------------- | ----------- | ------------------------------ |
| **Tags**              | ink → JS    | 副作用操作：插入图片、播放音乐 |
| **Parser**            | ink → JS    | 文本转换：添加 CSS 类          |
| **ExternalFunctions** | ink → JS    | ink 脚本调用 JS 函数           |
| **Patches**           | JS → Engine | 扩展引擎能力，注入属性         |
| **ChoiceParser**      | ink → JS    | 选项行为定制                   |
| **ChoiceRegistry**    | JS → React  | 注册自定义选项组件             |
| **InteractionManager**| JS → Engine | 外部交互映射（手势/键盘驱动选择）|

详细设计思路见 [docs/why-this-project.md](docs/why-this-project.md)。

## 插件

内置 11 个插件：image、audio、memory、fadeEffect、autoButton、cdButton、linkopen、scrollafterchoice、autosave、autoRestore、classTag。

详见 [packages/plugins/README.md](packages/plugins/README.md)。

## 技术栈

- **React 19** - UI 渲染
- **Zustand 5** - 状态管理
- **inkjs 2.3** - ink 脚本解析引擎
- **TypeScript 5** - 类型安全
- **Vite 8** - 构建工具
- **Bun** - 包管理和测试
- **Biome 2** - 格式化和 lint

## 相关链接

- [Ink 官方文档](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)
- [inkjs 仓库](https://github.com/y-lohse/inkjs)
- [Calico 项目](https://github.com/elliotherriman/calico) - 扩展系统设计参考
- [Inky 编辑器](https://github.com/inkle/inky) - ink 可视化编辑器

## License

MIT
