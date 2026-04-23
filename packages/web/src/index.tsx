import { createInkStory } from "@inkweave/core";

import { createRoot } from "react-dom/client";
import pkg from "../package.json";
import Container from "./components/Container/index";
import type { InkWeaveOptions } from "./types";
import { FetchFileHandler, initPlugins } from "./utils";

const init = (options: InkWeaveOptions) => {
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
    const fileHandler = new FetchFileHandler({ basePath: options.basePath || "" });
    const ink = createInkStory(options.story, {
      title: options.title || "Ink Story",
      fileHandler,
    });

    containerEl.innerHTML = "";
    const root = createRoot(containerEl);

    root.render(<Container ink={ink} />);

    console.log(`InkWeave v${pkg.version} initialized`);
  } catch (error) {
    console.error("InkWeave: Failed to initialize", error);
  }
};

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).InkWeave = { init };
}

export { default as Container } from "./components/Container/index";
export { default as Menu } from "./components/Menu/index";
export { default as SaveModal } from "./components/SaveModal/index";
export type { ContainerProps, InkWeaveOptions, MenuProps, SaveModalProps } from "./types";
export { FetchFileHandler, init };
