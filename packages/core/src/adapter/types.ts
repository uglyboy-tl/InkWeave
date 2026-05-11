import type { InkStory } from "../story/InkStory";
import type { TranslationFunction } from "../types";

export interface ModalContentProps {
  ink: InkStory;
  onClose: () => void;
  t: TranslationFunction;
}

export interface Command {
  id: string;
  name: string;
  priority?: number;
  description?: string;
  title?: string;
  icon?: string;
  handler: (ink: InkStory) => void | Promise<void>;
  getModalContent?: (props: ModalContentProps) => unknown;
}

export interface StatusBarConfig {
  key: string;
  label: string;
  display: "bar" | "number";
}
