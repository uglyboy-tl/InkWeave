import { createInkStory, type ErrorHandler, type TranslationFunction } from "@inkweave/core";
import { render as solidRender } from "solid-js/web";
import pkg from "../../package.json";
import { FetchFileHandler } from "../utils/fileHandler";
import App from "./App";
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

let currentDispose: (() => void) | null = null;

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

    if (currentDispose) {
      currentDispose();
      currentDispose = null;
    }

    const dispose = solidRender(
      () => App({ ink, translations: options.translations }),
      containerEl as HTMLElement,
    );
    currentDispose = dispose;

    console.log(`InkWeave (SolidJS) v${pkg.version} initialized`);

    return {
      ink,
      dispose: () => {
        ink.dispose();
        if (currentDispose === dispose) {
          currentDispose();
          currentDispose = null;
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
