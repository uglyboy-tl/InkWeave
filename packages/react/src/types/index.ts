import type { Choice, InkStory, TranslationFunction } from "@inkweave/core";
import type { FC } from "react";

export interface ChoiceComponentProps {
  choice: Choice;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export type ChoiceComponent = FC<ChoiceComponentProps>;

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
