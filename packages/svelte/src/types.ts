import type { Choice, InkStory } from "@inkweave/core";
import type { Component, Snippet } from "svelte";

export interface ChoiceComponentProps {
  choice: Choice;
  onClick: () => void;
  className?: string;
  children?: Snippet;
}

export type ChoiceComponent = Component<ChoiceComponentProps>;

export type TranslationFunction = (content: string | undefined) => string | undefined;

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
  getModalContent?: (props: ModalContentProps) => {
    component: Component;
    props: Record<string, unknown>;
  };
}

export interface CommandBarProps {
  ink: InkStory;
  class?: string;
  buttonClass?: string;
  modalClass?: string;
  t?: TranslationFunction;
}

export interface CommandButtonProps {
  commandId: string;
  ink: InkStory;
  class?: string;
  onRequestOpenModal?: (commandId: string) => void;
  t: TranslationFunction;
}
