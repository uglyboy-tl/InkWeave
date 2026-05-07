import type { ChoiceRenderer, ModalContentProps } from "@inkweave/core";
import { ChoiceRegistry, useChoicesCanShow, useLineDelay } from "@inkweave/solidjs";
import { createAutoButtonPlugin } from "../auto-button";
import AutoButton from "../auto-button/solidjs/AutoButton";
import { createCdButtonPlugin } from "../cd-button";
import CdButton from "../cd-button/solidjs/CdButton";
import { createFadeEffectPlugin, useContentComplete } from "../fade-effect";
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

export const fadeEffectPlugin = createFadeEffectPlugin((ink) => {
  const choicesCanShow = useChoicesCanShow();
  const lineDelay = useLineDelay();

  Object.defineProperty(ink, "choicesCanShow", {
    get() {
      return choicesCanShow.value;
    },
  });

  choicesCanShow.value = useContentComplete.getState().contentComplete;

  useContentComplete.subscribe((state) => {
    choicesCanShow.value = state.contentComplete;
  });

  Object.defineProperty(ink, "linedelay", {
    get() {
      return ink.options.linedelay;
    },
    set(v: number) {
      ink.options.linedelay = v;
      lineDelay.value = v;
    },
  });
});

export { audioPlugin, useStoryMusic } from "../audio";
export { autoRestorePlugin } from "../auto-restore";
export { autoSavePlugin } from "../auto-save";
export { classTagPlugin } from "../class-tag";
export { useContentComplete } from "../fade-effect";
export { imagePlugin, useStoryImage } from "../image";
export { default as Image } from "../image/solidjs/Image";
export { linkOpenPlugin } from "../link-open";
export type { SaveSlot } from "../memory";
export { scrollAfterChoicePlugin } from "../scroll-after-choice";
export { getSlotLabelKey, isSlotReserved, memory, reserveSlot };
