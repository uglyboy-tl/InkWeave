# @inkweave/generator

Ink 脚本生成器 - 数据驱动的 ink 代码生成工具。

## 特性

- 支持多种输入格式：CSV、Markdown 表格、JSON
- 模块化的游戏类型系统
- 基于 Handlebars 的模板引擎
- TypeScript 实现，类型安全
- 完整的 CLI 工具

## 安装

```bash
bun install
```

## 使用方式

### CLI

```bash
# 列出所有游戏类型
bun run dev list

# 生成 ink 文件
bun run gen -t duel -i examples/duel.md -o output/duel
bun run gen -t reigns -i examples/reigns.md -o output/reigns
bun run gen -t survey -i examples/survey.md -o output/survey

# 预览输出（不写入文件）
bun run gen -t duel -i examples/duel.md -o output/duel --dry-run

# 查看游戏类型 schema
bun run schema -t duel
```

### 编程方式

```typescript
import { autoParse, registry } from '@inkweave/generator';

// 解析输入数据
const data = autoParse(markdownContent);

// 获取游戏类型
const duel = registry.get('duel');

// 验证数据
const validation = duel.validate(data);
if (!validation.valid) {
  console.error(validation.errors);
  return;
}

// 生成 ink 文件
const result = duel.generate(data);
```

## 输入格式

### CSV

```csv
name,type1,hp,atk,def
皮卡丘,Electric,35,55,40
喷火龙,Fire,78,84,78
```

多个表格通过空行分隔：

```csv
# roles
name,hp
hero,100

# moves
name,power
slash,50
```

### Markdown 表格

```markdown
## Role
| name | type1 | hp |
|------|-------|-----|
| 皮卡丘 | Electric | 35 |

## Move
| name | power |
|------|-------|
| 十万伏特 | 90 |
```

### JSON

```json
{
  "roles": [{ "name": "皮卡丘", "hp": 35 }],
  "moves": [{ "name": "十万伏特", "power": 90 }]
}
```

## 游戏类型

### duel (对战系统)

回合制对战系统，支持属性克制、伤害计算、技能系统。

**必需表格：**
- `roles` - 角色定义（name, type1, type2, hp, atk, def, spAtk, spDef, spd）
- `moves` - 技能定义（name, type, power, category）
- `typeChart` - 属性克制表

**生成文件：**
- `duel/base.ink` - 角色属性和类型
- `duel/move.ink` - 技能数据
- `duel/type.ink` - 属性克制关系
- `duel/utils.ink` - 计算工具函数
- `duel/battle.ink` - 战斗系统主文件

### reigns (王权系统)

卡牌驱动的左右选择游戏，管理多个属性（教会、民众、军队、金钱）。

**必需表格：**
- `cards` - 卡牌定义（name, Content, Left, Right, LC, LP, LA, LM, LN, LR, RC, RP, RA, RM, RN, RR）

**可选表格：**
- `config` - 游戏配置（initialChurch, initialPeople, initialArmy, initialMoney, maxAttribute）

**生成文件：**
- `reigns/cards.ink` - 卡牌数据和处理函数
- `reigns/utils.ink` - 工具函数和游戏状态
- `reigns/game.ink` - 游戏主循环

### survey (问卷/考试系统)

支持多种题型（选择题、输入题、判断题），随机出题、得分统计、结果分级。

**必需表格：**
- `questions` - 题目定义（id, type, content, optionA-D, answer, score, explanation, category）

**可选表格：**
- `config` - 问卷配置（title, description, maxQuestions, randomize, showAnswer, passScore, isExam）
- `results` - 结果区间配置（min, max, title, description）

**生成文件：**
- `survey/survey.ink` - 问卷/考试主文件

## 开发

```bash
# 运行测试
bun test

# 类型检查
bun run check

# 构建
bun run build
```

## 示例

查看 `examples/` 目录获取完整的示例数据文件。

## 架构

```
src/
├── core/
│   ├── types.ts           # 核心类型定义
│   ├── parsers/           # 输入解析器（CSV, Markdown, JSON）
│   └── emitter/           # 输出生成器（TemplateEngine, InkEmitter）
├── games/
│   ├── types.ts           # GameType 接口
│   ├── registry.ts        # 游戏类型注册表
│   ├── duel/              # 对战系统
│   ├── reigns/            # 王权系统
│   └── survey/            # 问卷/考试系统
├── cli/                   # CLI 入口
└── index.ts               # 包主入口
```

## 扩展

添加新的游戏类型：

1. 在 `src/games/` 下创建新目录
2. 实现 `GameType` 接口
3. 定义 `schema.ts`（表结构）
4. 编写 `templates/*.ink.hbs`（Handlebars 模板）
5. 在 `src/games/index.ts` 中注册

## License

MIT
