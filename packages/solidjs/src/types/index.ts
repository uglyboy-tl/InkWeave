import type { Choice, InkStory, TranslationFunction } from "@inkweave/core";
import type { JSX } from "solid-js";

export interface ChoiceComponentProps {
  choice: Choice;
  onClick: () => void;
  class?: string;
  children?: JSX.Element;
}

export type ChoiceComponent = (props: ChoiceComponentProps) => JSX.Element;

export interface CommandButtonProps {
  commandId: string;
  ink: InkStory;
  class?: string;
  onRequestOpenModal?: (commandId: string) => void;
  t: TranslationFunction;
}

export interface CommandBarProps {
  ink: InkStory;
  class?: string;
  buttonClass?: string;
  modalClass?: string;
  t?: TranslationFunction;
}
