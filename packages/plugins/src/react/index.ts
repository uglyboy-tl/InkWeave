import type { ChoiceRenderer, ModalContentProps } from "@inkweave/core";
import { CommandRegistry } from "@inkweave/core";
import { ChoiceRegistry } from "@inkweave/react";
import type { ReactNode } from "react";
import * as React from "react";
import { createAutoButtonPlugin } from "../auto-button";
import AutoButton from "../auto-button/react/AutoButton";
import { createCdButtonPlugin } from "../cd-button";
import CdButton from "../cd-button/react/CdButton";
import { createFadeEffectPlugin, useContentComplete } from "../fade-effect";
import {
  createMemoryPlugin,
  getSlotLabelKey,
  isSlotReserved,
  memory,
  reserveSlot,
} from "../memory";
import SaveModal from "../memory/react/SaveModal";

const SAVE_ICON =
  "M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z";
const RESTORE_ICON =
  "M12 3a9 9 0 0 0-9 9H0l4 4 4-4H5a7 7 0 1 1 2.05 4.95l-1.41 1.41A9 9 0 1 0 12 3z M13 8v5l4.25 2.52.77-1.28-3.52-2.09V8z";

export const memoryPlugin = createMemoryPlugin(() => {
  CommandRegistry.add("memory-save", {
    name: "menu_save",
    description: "menu_save_aria",
    title: "modal_save_title",
    icon: SAVE_ICON,
    priority: 51,
    handler: () => {},
    getModalContent: ({ ink, onClose, t }: ModalContentProps): ReactNode =>
      React.createElement(SaveModal, { key: "mem-save", ink, type: "save", onClose, t }),
  });
  CommandRegistry.add("memory-restore", {
    name: "menu_restore",
    description: "menu_restore_aria",
    title: "modal_restore_title",
    icon: RESTORE_ICON,
    priority: 50,
    handler: () => {},
    getModalContent: ({ ink, onClose, t }: ModalContentProps): ReactNode =>
      React.createElement(SaveModal, { key: "mem-restore", ink, type: "restore", onClose, t }),
  });
  CommandRegistry.addTranslations({
    modal_save_title: "Save Game",
    modal_restore_title: "Restore Game",
    modal_slot_empty: "Empty",
    menu_save: "Save",
    menu_restore: "Restore",
    menu_save_aria: "Save game",
    menu_restore_aria: "Restore saved game",
    modal_slot_1: "Slot 1",
    modal_slot_2: "Slot 2",
    modal_slot_3: "Slot 3",
    modal_slot_4: "Slot 4",
    modal_slot_5: "Slot 5",
  });
});

const reactChoiceRenderer: ChoiceRenderer = {
  register(type, component) {
    ChoiceRegistry.register(type, component as never);
  },
};

export const autoButtonPlugin = createAutoButtonPlugin(reactChoiceRenderer, AutoButton);
export const cdButtonPlugin = createCdButtonPlugin(reactChoiceRenderer, CdButton);

export const fadeEffectPlugin = createFadeEffectPlugin((ink) => {
  Object.defineProperty(ink, "choicesCanShow", {
    get() {
      return useContentComplete((s) => s.contentComplete);
    },
  });
});

export { audioPlugin, useStoryMusic } from "../audio";
export { autoRestorePlugin } from "../auto-restore";
export { autoSavePlugin } from "../auto-save";
export { classTagPlugin } from "../class-tag";
export { useContentComplete } from "../fade-effect";
export { imagePlugin, useStoryImage } from "../image";
export { default as Image } from "../image/react/Image";
export { linkOpenPlugin } from "../link-open";
export type { SaveSlot } from "../memory";
export { scrollAfterChoicePlugin } from "../scroll-after-choice";
export { getSlotLabelKey, isSlotReserved, memory, reserveSlot };
