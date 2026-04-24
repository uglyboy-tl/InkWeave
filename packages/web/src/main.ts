import { createInkStory } from "@inkweave/core";
import { createRoot } from "react-dom/client";
import pkg from "../package.json";
import { render } from "./components";
import { setTranslationFunction } from "./locales";
import type { InkWeaveOptions } from "./types";
import { FetchFileHandler, initPlugins } from "./utils";

export const init = (options: InkWeaveOptions) => {
  initPlugins(options.plugins);

  // Initialize translation function if provided
  if (options.translations) {
    setTranslationFunction(options.translations);
  }

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
    render(root, ink);

    console.log(`InkWeave v${pkg.version} initialized`);
  } catch (error) {
    console.error("InkWeave: Failed to initialize", error);
  }
};

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).InkWeave = { init };
}
