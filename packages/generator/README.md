# @inkweave/generator

数据驱动的 Ink 脚本生成器。支持 CSV/Markdown/JSON 输入，通过模式系统生成不同类型的交互式 Ink 游戏。

## 特性

- 多格式输入：CSV、Markdown、JSON，自动检测
- 多模式支持：每种游戏类型是一个独立的模式
- 列结构自动匹配：根据列名识别表格，不依赖表名
- 模板引擎：Handlebars，支持自定义 helper
- 组合式校验：唯一性、引用完整性、冗余检查
- pipeline：parse → validate → generate
- CLI：单文件 / 目录 / 多文件输入

## CLI

```bash
# 列出所有模式
bun run dev list

# 单文件输入
bun run gen -t reigns examples/reigns/example.md -o output

# 目录输入（合并所有 .md/.csv/.json）
bun run gen -t reigns docs/reigns/langya-bang/ -o output

# 预览（不写文件）
bun run gen -t reigns examples/reigns/example.md --dry-run

# 查看模式 schema
bun run schema -t reigns
```

## 编程方式

```typescript
import { reigns } from '@inkweave/generator';

const result = reigns.generate(data);
console.log(result.files);  // [{ path, content }[]]
```

```typescript
import { runPipeline, reigns } from '@inkweave/generator';

const { validation, module } = runPipeline({
  input: 'data.md',           // 或 'data/' 目录，或 ['a.md', 'b.csv']
  plugin: reigns,
});

if (module) {
  // module.files, module.entry
}
```

## 输入格式

框架根据列结构自动匹配逻辑表，不依赖表名。多表通过空行分隔。`##` 标题仅为便于阅读的注释。

### CSV

```csv
name,type1,hp,atk,def
皮卡丘,Electric,35,55,40
```

多表用空行分隔，表名（`# roles`）为注释：

```csv
name,hp
hero,100

name,power
slash,50
```

### Markdown

```markdown
| name | type1 | hp |
|------|-------|-----|
| 皮卡丘 | Electric | 35 |

| name | power |
|------|-------|
| 十万伏特 | 90 |
```

### JSON

```json
{
  "roles": [{ "name": "hero", "hp": 100 }],
  "moves": [{ "name": "slash", "power": 50 }]
}
```

## 内置模式

### reigns（王权系统）

卡牌驱动的左右选择游戏，管理多个属性。

| 逻辑表 | 关键列 |
|--------|--------|
| cards | name, content, left_option, right_option, left_event, right_event |
| events | name + stat ID 列（如 A/B/C/D）+ add_card, remove_card, next_card |
| conditions | name, required_events, condition, trigger_event |
| stats | stat（ID）, dir, text |

输出：`reigns/index.md`, `reigns/cards.ink`, `reigns/events.ink`, `reigns/conditions.ink`, `reigns/stats.ink`

### duel（对战系统）

回合制对战，属性克制、伤害计算。

| 逻辑表 | 关键列 |
|--------|--------|
| roles | name, type1, hp, atk, def, spAtk, spDef, spd |
| moves | name, type, power, category |
| typeChart | attack + 各属性名 |

输出：`duel/index.md`, `duel/base.ink`, `duel/move.ink`, `duel/type.ink`, `duel/utils.ink`

### survey（问卷/考试）

选择题、输入题、判断题，随机出题、得分统计。

| 逻辑表 | 关键列 |
|--------|--------|
| questions | id, type, content, optionA-D, answer, score |
| config（可选） | key, value |
| results（可选） | min, max, title, description |

输出：`survey/index.md`

## 校验规则

每条规则是一个独立实例，按顺序执行：

| 规则 | 作用 |
|------|------|
| `UniquenessRule` | 主键唯一性 |
| `ReferenceRule` | 跨表引用 |
| `RedundancyRule` | 冗余数据告警 |
| `RequiredValuesRule` | 必填字段非空 |

引用规则的 `extract` 支持 `VALUE_PARSERS` 缩写：

```typescript
{ from: "events", col: "add_card", to: "cards", extract: VALUE_PARSERS.comma }
// 或字符串简写：
{ from: "events", col: "add_card", to: "cards", extract: "comma" }
```

内置值解析器：

| 名称 | 作用 |
|------|------|
| `VALUE_PARSERS.comma` | 逗号分隔 |
| `VALUE_PARSERS.beforeColon` | 逗号分隔后取冒号前内容 |

## 编写自定义模式

```typescript
import { defineGameType, UniquenessRule } from '@inkweave/generator';

const myGame = defineGameType({
  id: 'my-game',
  name: '我的游戏',
  requiredTables: ['items'],
  tableSchemas: {
    items: {
      name: '物品表',
      keyColumn: 'name',
      columns: [
        { name: 'name', type: 'string', required: true, description: '名称' },
        { name: 'count', type: 'number', required: true, description: '数量' },
      ],
    },
  },

  validate: [new UniquenessRule(['items'])],

  generate: {
    templates: ['index.md.hbs', 'data.ink.hbs'],
    // 模板文件自动从 modes/<id>/templates/ 加载
    // entry 默认为 <id>/index.md

    transform(data) {
      return { items: data.tables.items.rows };
    },

    helpers: {
      myHelper(...args) { return '...'; },
    },
  },
});

export { myGame };
```

模板文件放在 `modes/my-game/templates/` 目录，factory 自动加载。输出路径由 entry 的目录前缀决定（`<id>/`）。

## 架构

```
src/
├── core/
│   ├── types.ts           # 核心类型定义
│   ├── factory.ts         # defineGameType 工厂
│   ├── pipeline.ts        # runPipeline
│   ├── matcher.ts         # 列结构自动匹配
│   ├── parsers/           # CSV/Markdown/JSON 解析器
│   ├── template/          # Handlebars 引擎 + core helpers
│   └── validator/         # 校验规则 + VALUE_PARSERS
├── modes/                 # 内置模式
│   ├── reigns/
│   ├── duel/
│   └── survey/
├── cli/
└── index.ts
```

## 开发

```bash
bun test           # 测试
bun run check      # 类型检查 + lint
bun run build      # 构建
```

## License

MIT
