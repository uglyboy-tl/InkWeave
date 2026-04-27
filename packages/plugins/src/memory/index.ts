import type { InkStory, Plugin } from "@inkweave/core";
import { Patches } from "@inkweave/core";
import type { ModalContentProps } from "@inkweave/react";
import { Commands } from "@inkweave/react";
import * as React from "react";
import SaveModal from "./components/SaveModal";
import type { SaveSlot } from "./storage";
import useStorage from "./storage";

const SAVE_ICON_PATH =
  "M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z";
const RESTORE_ICON_PATH =
  "M12 3a9 9 0 0 0-9 9H0l4 4 4-4H5a7 7 0 1 1 2.05 4.95l-1.41 1.41A9 9 0 1 0 12 3z M13 8v5l4.25 2.52.77-1.28-3.52-2.09V8z";

// Default English translations
const defaultTranslations: Record<string, string> = {
  // Save Modal translations
  modal_save_title: "Save Game",
  modal_restore_title: "Restore Game",
  modal_slot_empty: "Empty",

  // Menu button translations
  menu_save: "Save",
  menu_restore: "Restore",
  menu_save_aria: "Save game",
  menu_restore_aria: "Restore saved game",
};

// Generate slot keys dynamically (slot_1, slot_2, etc.)
for (let i = 1; i <= 5; i++) {
  defaultTranslations[`modal_slot_${i}`] = `Slot ${i}`;
}

interface MemorySaveData {
  state: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

const options = {
  memory_format: "local",
};

const show = (title: string): SaveSlot[] | null => {
  const storage = useStorage.getState().storage;
  return storage.get(title) || null;
};

const save = (index: number, ink: InkStory) => {
  const saveData: MemorySaveData = {
    state: ink.story.state.toJson(),
  };
  ink.save_label.forEach((label) => {
    const value = ink[label as keyof InkStory];
    if (label in ink && value !== undefined) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        Array.isArray(value)
      ) {
        saveData[label] = value as string | number | boolean | string[];
      }
    }
  });
  useStorage.getState().setStorage(ink.title, index, saveData);
};

const load = (save_data: string, ink: InkStory) => {
  let save: MemorySaveData | null = null;
  try {
    save = JSON.parse(save_data);
  } catch (e) {
    console.error("InkWeave: Failed to parse save data:", e);
    return;
  }
  if (save) {
    ink.story.state.LoadJson(save.state);
    ink.clear();
    ink.save_label.forEach((label) => {
      if (label in save) {
        // Safe to assign since save_label contains only user-defined savable properties
        (ink as Record<string, unknown>)[label] = save[label];
      }
    });
    ink.continue();
  }
};

export const memoryPlugin: Plugin = {
  id: "memory",
  name: "Memory Plugin",
  description: "Provides save and load functionality using localStorage",
  enabledByDefault: true,
  onLoad: () => {
    Patches.add(() => {
      useStorage.getState().changeFormat(options.memory_format);
    }, options);

    // Register memory commands
    Commands.add("memory-save", {
      name: "menu_save",
      description: "menu_save_aria",
      title: "modal_save_title",
      icon: SAVE_ICON_PATH,
      priority: 51,
      handler: (_ink: InkStory) => {
        // Handler is not used since Menu handles modal opening
      },
      getModalContent: ({ ink, onClose, t }: ModalContentProps) =>
        React.createElement(SaveModal, {
          key: "memory-save-modal",
          ink,
          type: "save",
          onClose,
          t,
        }),
    });

    Commands.add("memory-restore", {
      name: "menu_restore",
      description: "menu_restore_aria",
      title: "modal_restore_title",
      icon: RESTORE_ICON_PATH,
      priority: 50,
      handler: (_ink: InkStory) => {
        // Handler is not used since Menu handles modal opening
      },
      getModalContent: ({ ink, onClose, t }: ModalContentProps) =>
        React.createElement(SaveModal, {
          key: "memory-restore-modal",
          ink,
          type: "restore",
          onClose,
          t,
        }),
    });

    Commands.addTranslations(defaultTranslations);
  },
};

export const memory = { save, load, show };
export type { SaveSlot };
