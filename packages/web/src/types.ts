import type { InkStory } from "@inkweave/core";

import type { TranslationFunction } from "./i18n";

export interface InkWeaveOptions {
  container: string | HTMLElement;
  story: string;
  title?: string;
  basePath?: string;
  theme?: "light" | "dark";
  plugins?: Record<string, boolean>;
  /**
   * Translation function for internationalization.
   * Should match signature: (key: string) => string
   * External users should wrap their i18n library to match this interface.
   */
  translations?: TranslationFunction;
}

export interface ContainerProps {
  ink: InkStory;
}

export interface MenuProps {
  ink: InkStory;
}

export interface SaveModalProps {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  type: "save" | "restore";
  title: string;
  ink: InkStory | null;
  onClose?: () => void;
}
