import type { Choice, InkStory } from "@inkweave/core";
import type { FC } from "react";

export interface ChoiceComponentProps {
  choice: Choice;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export type ChoiceComponent = FC<ChoiceComponentProps>;

export type TranslationFunction = (content: string | undefined) => string | undefined;

export interface ModalContentProps {
  ink: InkStory;
  onClose: () => void;
  t: TranslationFunction;
}

export interface Command {
  id: string;
  name: string;
  priority?: number; // 越小越靠前，默认为0
  description?: string;
  title?: string;
  icon?: string;
  handler: (ink: InkStory) => void | Promise<void>;
  getModalContent?: (props: ModalContentProps) => React.ReactNode;
}

export interface CommandButtonProps {
  commandId: string;
  ink: InkStory;
  className?: string;
  onRequestOpenModal?: (commandId: string) => void;
  t: TranslationFunction;
}

export interface CommandBarProps {
  ink: InkStory;
  className?: string;
  buttonClassName?: string;
  modalClassName?: string;
  t?: TranslationFunction;
}
