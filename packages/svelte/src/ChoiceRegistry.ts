import type { Choice } from "@inkweave/core";
import { ChoiceRegistry as ChoiceRegistryClass } from "@inkweave/core";
import type { Component, Snippet } from "svelte";

export interface ChoiceComponentProps {
  choice: Choice;
  onClick: () => void;
  className?: string;
  children?: Snippet;
}

export type ChoiceComponent = Component<ChoiceComponentProps>;

export const ChoiceRegistry = new ChoiceRegistryClass<ChoiceComponent>();
