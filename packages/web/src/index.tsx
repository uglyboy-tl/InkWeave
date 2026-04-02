import { BaseFileHandler, createInkStory } from "@inkweave/core";
import {
  loadAudio,
  loadAutoButton,
  loadCdButton,
  loadFadeEffect,
  loadImage,
  loadLinkopen,
  loadMemory,
  loadScrollafterchoice,
} from "@inkweave/plugins";
import { createRoot } from "react-dom/client";
import Container from "./components/Container/index";
import type { InkWeaveOptions } from "./types";

loadImage();
loadAudio();
loadFadeEffect();
loadScrollafterchoice();
loadLinkopen();
loadMemory();
loadAutoButton();
loadCdButton();

class FetchFileHandler extends BaseFileHandler {
  override loadFile(filename: string): string {
    const path = this.resolveFilename(filename);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();

    if (xhr.status !== 200) {
      throw new Error(`Failed to load: ${path}`);
    }

    return xhr.responseText;
  }
}

const init = (options: InkWeaveOptions) => {
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

    root.render(<Container ink={ink} title={options.title} />);

    console.log("InkWeave v1.0.0 initialized");
  } catch (error) {
    console.error("InkWeave: Failed to initialize", error);
  }
};

const version = "1.0.0";

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).InkWeave = { version, init };
}

export { default as Container } from "./components/Container/index";
export { default as Menu } from "./components/Menu/index";
export { default as SaveModal } from "./components/SaveModal/index";
export type { ContainerProps, InkWeaveOptions, MenuProps, SaveModalProps, SaveSlot } from "./types";
export { FetchFileHandler, init, version };
