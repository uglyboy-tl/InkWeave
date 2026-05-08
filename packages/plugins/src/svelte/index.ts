import type { ChoiceRenderer, ModalContentProps } from "@inkweave/core";
import { Events } from "@inkweave/core";
import { ChoiceRegistry, useChoicesCanShow } from "@inkweave/svelte";
import { createAutoButtonPlugin } from "../auto-button";
import AutoButton from "../auto-button/svelte/AutoButton.svelte";
import { createCdButtonPlugin } from "../cd-button";
import CdButton from "../cd-button/svelte/CdButton.svelte";
import { createFadeEffectPlugin, useContentComplete } from "../fade-effect";
import {
  createMemoryPlugin,
  getSlotLabelKey,
  isSlotReserved,
  memory,
  reserveSlot,
} from "../memory";
import SaveModal from "../memory/svelte/SaveModal.svelte";

export const memoryPlugin = createMemoryPlugin({
  renderModal: ({ ink, onClose, t }: ModalContentProps, type: "save" | "restore") => ({
    component: SaveModal,
    props: { ink, type, onClose, t },
  }),
});

const svelteChoiceRenderer: ChoiceRenderer = {
  register(type, component) {
    ChoiceRegistry.register(type, component as never);
  },
};

export const autoButtonPlugin = createAutoButtonPlugin(svelteChoiceRenderer, AutoButton);
export const cdButtonPlugin = createCdButtonPlugin(svelteChoiceRenderer, CdButton);

export const fadeEffectPlugin = createFadeEffectPlugin((ink) => {
  const svelteCC = useChoicesCanShow();
  const unsub = useContentComplete.subscribe((state) => {
    svelteCC.value = state.contentComplete;
  });
  ink.eventEmitter.on(Events.STORY_DISPOSE, unsub);
});

export { audioPlugin, useStoryMusic } from "../audio";
export { autoRestorePlugin } from "../auto-restore";
export { autoSavePlugin } from "../auto-save";
export { classTagPlugin } from "../class-tag";
export { imagePlugin, useStoryImage } from "../image";
export { default as Image } from "../image/svelte/Image.svelte";
export { linkOpenPlugin } from "../link-open";
export type { SaveSlot } from "../memory";
export { scrollAfterChoicePlugin } from "../scroll-after-choice";
export { getSlotLabelKey, isSlotReserved, memory, reserveSlot };
