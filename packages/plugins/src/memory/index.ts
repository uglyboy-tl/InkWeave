import type { InkStory, ModalContentProps, Plugin } from "@inkweave/core";
import { CommandRegistry, Patches } from "@inkweave/core";
import type { SaveSlot } from "./storage";
import useStorage from "./storage";

interface MemorySaveData {
  state: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

const options = { memory_format: "local" as string };

export const memory = {
  show: (title: string): SaveSlot[] | null => {
    const storage = useStorage.getState().storage;
    return storage.get(title) || null;
  },

  save: (index: number, ink: InkStory) => {
    const saveData: MemorySaveData = { state: ink.story.state.toJson() };
    ink.save_label.forEach((label) => {
      const value = ink[label as keyof InkStory];
      if (value !== undefined) {
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
  },

  load: (save_data: string, ink: InkStory) => {
    let saveData: MemorySaveData | null = null;
    try {
      saveData = JSON.parse(save_data);
    } catch (e) {
      console.error("InkWeave: Failed to parse save data:", e);
      return;
    }
    if (saveData) {
      ink.story.state.LoadJson(saveData.state);
      ink.clear();
      ink.save_label.forEach((label) => {
        if (label in saveData) {
          (ink as Record<string, unknown>)[label] = saveData[label];
        }
      });
      ink.continue();
    }
  },
};

const SAVE_ICON =
  "M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z";
const RESTORE_ICON =
  "M12 3a9 9 0 0 0-9 9H0l4 4 4-4H5a7 7 0 1 1 2.05 4.95l-1.41 1.41A9 9 0 1 0 12 3z M13 8v5l4.25 2.52.77-1.28-3.52-2.09V8z";

const DEFAULT_TRANSLATIONS = {
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
};

interface MemoryPluginConfig {
  renderModal: (props: ModalContentProps, type: "save" | "restore") => unknown;
}

export function createMemoryPlugin(config: MemoryPluginConfig): Plugin {
  return {
    id: "memory",
    name: "Memory Plugin",
    description: "Provides save and load functionality using localStorage",
    enabledByDefault: true,
    onLoad: () => {
      Patches.add(() => {
        useStorage.getState().changeFormat(options.memory_format);
      }, options);
      CommandRegistry.add("memory-save", {
        name: "menu_save",
        description: "menu_save_aria",
        title: "modal_save_title",
        icon: SAVE_ICON,
        priority: 51,
        handler: () => {},
        getModalContent: (props) => config.renderModal(props, "save"),
      });
      CommandRegistry.add("memory-restore", {
        name: "menu_restore",
        description: "menu_restore_aria",
        title: "modal_restore_title",
        icon: RESTORE_ICON,
        priority: 50,
        handler: () => {},
        getModalContent: (props) => config.renderModal(props, "restore"),
      });
      CommandRegistry.addTranslations(DEFAULT_TRANSLATIONS);
    },
  };
}

const _reservedSlots = new Map<number, string>();

export const reserveSlot = (index: number, labelKey: string) => {
  _reservedSlots.set(index, labelKey);
};

export const getSlotLabelKey = (index: number) => _reservedSlots.get(index);
export const isSlotReserved = (index: number) => _reservedSlots.has(index);

export type { SaveSlot };
