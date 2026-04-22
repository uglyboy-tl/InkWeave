import type { InkStory } from "@inkweave/core";

export interface InkWeaveOptions {
  container: string | HTMLElement;
  story: string;
  title?: string;
  basePath?: string;
  theme?: "light" | "dark";
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
