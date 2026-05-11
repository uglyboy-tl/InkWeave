import type { ChoiceRenderer, ModalContentProps } from "@inkweave/core";
import { ChoiceRegistry } from "@inkweave/react";
import type { ReactNode } from "react";
import * as React from "react";
import { createAutoButtonPlugin } from "../auto-button";
import AutoButton from "../auto-button/react/AutoButton";
import { createCdButtonPlugin } from "../cd-button";
import CdButton from "../cd-button/react/CdButton";
import {
  createMemoryPlugin,
  getSlotLabelKey,
  isSlotReserved,
  memory,
  reserveSlot,
} from "../memory";
import SaveModal from "../memory/react/SaveModal";

export const memoryPlugin = createMemoryPlugin({
  renderModal: ({ ink, onClose, t }: ModalContentProps, type: "save" | "restore"): ReactNode =>
    React.createElement(SaveModal, { key: `mem-${type}`, ink, type, onClose, t }),
});

const reactChoiceRenderer: ChoiceRenderer = {
  register(type, component) {
    ChoiceRegistry.register(type, component as never);
  },
};

export const autoButtonPlugin = createAutoButtonPlugin(reactChoiceRenderer, AutoButton);
export const cdButtonPlugin = createCdButtonPlugin(reactChoiceRenderer, CdButton);

export { audioPlugin, useStoryMusic } from "../audio";
export { autoRestorePlugin } from "../auto-restore";
export { autoSavePlugin } from "../auto-save";
export { classTagPlugin } from "../class-tag";
export { fadeEffectPlugin } from "../fade-effect";
export { imagePlugin, useStoryImage } from "../image";
export { default as Image } from "../image/react/Image";
export { linkOpenPlugin } from "../link-open";
export type { SaveSlot } from "../memory";
export { reignsPlugin } from "../reigns";
export { scrollAfterChoicePlugin } from "../scroll-after-choice";
export { getSlotLabelKey, isSlotReserved, memory, reserveSlot };
