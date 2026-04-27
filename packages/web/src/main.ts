import { createInkStory } from "@inkweave/core";
import type { TranslationFunction } from "@inkweave/react";
import { createRoot } from "react-dom/client";
import pkg from "../package.json";
import { render } from "./components";
import { FetchFileHandler, initPlugins } from "./utils";

interface InkWeaveOptions {
  container: string | HTMLElement;
  story: string;
  title?: string;
  basePath?: string;
  theme?: "light" | "dark";
  plugins?: Record<string, boolean>;
  translations?: TranslationFunction;
}

export const init = (options: InkWeaveOptions) => {
  initPlugins(options.plugins);

  // Translation function is handled directly by the t function in components

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
    const fileHandler = new FetchFileHandler({ basePath: options.basePath || "" });
    const ink = createInkStory(options.story, {
      title: options.title || "Ink Story",
      fileHandler,
    });

    containerEl.innerHTML = "";
    const root = createRoot(containerEl);
    render(root, ink, options.translations);

    console.log(`InkWeave v${pkg.version} initialized`);
  } catch (error) {
    console.error("InkWeave: Failed to initialize", error);
  }
};

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).InkWeave = { init };
}
