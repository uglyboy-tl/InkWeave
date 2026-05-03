import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";

const file = process.argv[2];

if (!file) {
  console.error("用法: bun run scripts/compile-ink.ts <ink文件路径>");
  console.error("示例: bun run scripts/compile-ink.ts /tmp/test.ink");
  process.exit(1);
}

const content = readFileSync(file, "utf-8");

const errors: string[] = [];
const errorHandler = (message: string, errorType: number) => {
  errors.push(`[${errorType}] ${message}`);
};

try {
  const compilerOptions = new CompilerOptions(null, [], false, errorHandler, null);
  const compiler = new Compiler(content, compilerOptions);
  compiler.Compile();

  if (errors.length > 0) {
    console.log("⚠ 编译警告:");
    for (const err of errors) {
      console.log(`  ${err}`);
    }
  } else {
    console.log("✓ 编译成功");
  }
} catch (err: unknown) {
  console.error("✗ 编译失败:");
  console.error(err instanceof Error ? err.message : String(err));

  if (errors.length > 0) {
    console.log("\n编译错误详情:");
    for (const err of errors) {
      console.log(`  ${err}`);
    }
  }
  process.exit(1);
}
