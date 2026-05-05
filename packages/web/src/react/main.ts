import { createInkStory, type ErrorHandler, type TranslationFunction } from "@inkweave/core";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import pkg from "../../package.json";
import { FetchFileHandler } from "../utils/fileHandler";
import { render } from "./App";
import { initPlugins } from "./plugins";

interface InkWeaveOptions {
  container: string | HTMLElement;
  story: string;
  title?: string;
  basePath?: string;
  theme?: "light" | "dark";
  plugins?: Record<string, boolean>;
  translations?: TranslationFunction;
}

let currentRoot: Root | null = null;

export const init = (
  options: InkWeaveOptions,
): { ink: ReturnType<typeof createInkStory>; dispose: () => void } | undefined => {
  initPlugins(options.plugins);

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

    // Unmount previous instance if re-initialized
    if (currentRoot) {
      currentRoot.unmount();
      currentRoot = null;
    }
    const root = createRoot(containerEl as HTMLElement);
    currentRoot = root;
    render(root, ink, options.translations);

    console.log(`InkWeave v${pkg.version} initialized`);

    return {
      ink,
      dispose: () => {
        ink.dispose();
        if (currentRoot === root) {
          currentRoot.unmount();
          currentRoot = null;
        }
      },
    };
  } catch (error) {
    console.error("InkWeave: Failed to initialize", error);
  }
};

declare global {
  interface Window {
    InkWeave?: { init: typeof init; version: string };
  }
}

if (typeof window !== "undefined") {
  window.InkWeave = { init, version: pkg.version };
}
