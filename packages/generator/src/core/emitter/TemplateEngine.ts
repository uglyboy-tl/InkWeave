import Handlebars from "handlebars";

export class TemplateEngine {
  private handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  compile(template: string): HandlebarsTemplateDelegate {
    return this.handlebars.compile(template);
  }

  render(template: string, data: Record<string, unknown>): string {
    return this.compile(template)(data);
  }

  private registerHelpers(): void {
    const h = this.handlebars;

    // 对象操作
    h.registerHelper("joinKeys", (obj: Record<string, unknown>) =>
      obj && typeof obj === "object" ? Object.keys(obj).join(", ") : "",
    );
    h.registerHelper("joinKeysFirst", (obj: Record<string, unknown>) => {
      if (!obj || typeof obj !== "object") return "";
      const keys = Object.keys(obj);
      return keys.length ? `(${keys[0]}), ${keys.slice(1).join(", ")}` : "";
    });
    h.registerHelper("values", (obj: Record<string, unknown>) =>
      obj && typeof obj === "object" ? Object.values(obj) : [],
    );
    h.registerHelper("get", (obj: Record<string, unknown>, key: string) => obj?.[key]);
    h.registerHelper(
      "eachEntries",
      function (this: unknown, obj: Record<string, unknown>, options: Handlebars.HelperOptions) {
        if (!obj || typeof obj !== "object") return "";
        return Object.entries(obj)
          .map(([key, value]) =>
            options.fn({
              key,
              value,
              ...(typeof value === "object" && value !== null ? value : {}),
            }),
          )
          .join("");
      },
    );

    // 比较（字符串转换以处理 Handlebars 模板中的类型差异）
    h.registerHelper("eq", (a: unknown, b: unknown) => String(a) === String(b));
    h.registerHelper("neq", (a: unknown, b: unknown) => String(a) !== String(b));
    h.registerHelper("gt", (a: number, b: number) => a > b);
    h.registerHelper("lt", (a: number, b: number) => a < b);

    // 数学
    h.registerHelper("add", (a: number, b: number) => a + b);
    h.registerHelper("sub", (a: number, b: number) => a - b);
    h.registerHelper("mul", (a: number, b: number) => a * b);
    h.registerHelper("div", (a: number, b: number) => (b ? a / b : 0));

    // 数组
    h.registerHelper("length", (arr: unknown[]) => (Array.isArray(arr) ? arr.length : 0));
    h.registerHelper("index1", (index: number) => index + 1);
  }
}

export const templateEngine = new TemplateEngine();
