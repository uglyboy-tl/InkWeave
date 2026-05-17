import Handlebars from "handlebars";
import { registerCoreHelpers } from "./helpers";

export class TemplateEngine {
  private handlebars: typeof Handlebars;

  constructor(pluginHelpers?: Record<string, (...args: unknown[]) => unknown>) {
    this.handlebars = Handlebars.create();
    registerCoreHelpers(this.handlebars);
    if (pluginHelpers) {
      for (const [name, fn] of Object.entries(pluginHelpers)) {
        this.handlebars.registerHelper(name, fn as Handlebars.HelperDelegate);
      }
    }
  }

  compile(template: string): HandlebarsTemplateDelegate {
    return this.handlebars.compile(template);
  }

  render(template: string, data: Record<string, unknown>): string {
    return this.compile(template)(data);
  }
}

export const templateEngine = new TemplateEngine();
