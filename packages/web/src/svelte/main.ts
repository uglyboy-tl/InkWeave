import {
  createInkStory,
  type ErrorHandler,
  type StatusBarConfig,
  type TranslationFunction,
} from "@inkweave/core";
import { mount, unmount } from "svelte";
import pkg from "../../package.json";
import App from "./App.svelte";
import "@inkweave/svelte/svelte.css";
import "@inkweave/plugins/svelte.css";
import "../global.css";
import { FetchFileHandler } from "../utils/fileHandler";
import { initPlugins } from "./plugins";

interface InkWeaveOptions {
  container: string | HTMLElement;
  story: string;
  title?: string;
  basePath?: string;
  theme?: "light" | "dark";
  display?: string;
  statusBar?: StatusBarConfig[];
  plugins?: Record<string, boolean>;
  translations?: TranslationFunction;
}

let currentApp: Record<string, unknown> | null = null;

export const init = (
  options: InkWeaveOptions,
): { ink: ReturnType<typeof createInkStory>; dispose: () => void } | undefined => {
  initPlugins(options.plugins, options.display);
  const containerEl =
    typeof options.container === "string"
      ? document.querySelector(options.container)
      : options.container;

  if (!containerEl) {
    console.error("InkWeave: Container not found");
    return;
  }

  if (options.theme === "dark") {
    containerEl.classList.add("ink-dark");
  }

  try {
    const errorHandler: ErrorHandler = (message, errorType) => {
      console.error(`InkWeave: ${errorType}: ${message}`);
    };

    const fileHandler = new FetchFileHandler({ basePath: options.basePath || "" });
    const ink = createInkStory(options.story, {
      title: options.title || "Ink Story",
      fileHandler,
      errorHandler,
    });

    if (currentApp) {
      unmount(currentApp);
      currentApp = null;
    }

    currentApp = mount(App, {
      target: containerEl as HTMLElement,
      props: { ink, translations: options.translations, statusBar: options.statusBar },
    });

    console.log(`InkWeave (Svelte) v${pkg.version} initialized`);

    return {
      ink,
      dispose: () => {
        ink.dispose();
        if (currentApp) {
          unmount(currentApp);
          currentApp = null;
        }
      },
    };
  } catch (error) {
    console.error("InkWeave: Failed to initialize", error);
  }
};

interface InkWeaveGlobal {
  InkWeave?: { init: typeof init; version: string };
}

if (typeof window !== "undefined") {
  (window as unknown as InkWeaveGlobal).InkWeave = { init, version: pkg.version };
}
