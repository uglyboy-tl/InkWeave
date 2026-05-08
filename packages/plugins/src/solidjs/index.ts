import type { ChoiceRenderer, ModalContentProps } from "@inkweave/core";
import { ChoiceRegistry } from "@inkweave/solidjs";
import { createAutoButtonPlugin } from "../auto-button";
import AutoButton from "../auto-button/solidjs/AutoButton";
import { createCdButtonPlugin } from "../cd-button";
import CdButton from "../cd-button/solidjs/CdButton";
import {
  createMemoryPlugin,
  getSlotLabelKey,
  isSlotReserved,
  memory,
  reserveSlot,
} from "../memory";
import SaveModal from "../memory/solidjs/SaveModal";

export const memoryPlugin = createMemoryPlugin({
  renderModal: ({ ink, onClose, t }: ModalContentProps, type: "save" | "restore") => ({
    component: SaveModal,
    props: { ink, type, onClose, t },
  }),
});

const solidjsChoiceRenderer: ChoiceRenderer = {
  register(type, component) {
    ChoiceRegistry.register(type, component as never);
  },
};

export const autoButtonPlugin = createAutoButtonPlugin(solidjsChoiceRenderer, AutoButton);
export const cdButtonPlugin = createCdButtonPlugin(solidjsChoiceRenderer, CdButton);

export { audioPlugin, useStoryMusic } from "../audio";
export { autoRestorePlugin } from "../auto-restore";
export { autoSavePlugin } from "../auto-save";
export { classTagPlugin } from "../class-tag";
export { fadeEffectPlugin } from "../fade-effect";
export { imagePlugin, useStoryImage } from "../image";
export { default as Image } from "../image/solidjs/Image";
export { linkOpenPlugin } from "../link-open";
export type { SaveSlot } from "../memory";
export { scrollAfterChoicePlugin } from "../scroll-after-choice";
export { getSlotLabelKey, isSlotReserved, memory, reserveSlot };
