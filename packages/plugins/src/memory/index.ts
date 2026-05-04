import type { InkStory, Plugin } from "@inkweave/core";
import { Patches } from "@inkweave/core";
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

export function createMemoryPlugin(registerCommands: () => void): Plugin {
  return {
    id: "memory",
    name: "Memory Plugin",
    description: "Provides save and load functionality using localStorage",
    enabledByDefault: true,
    onLoad: () => {
      Patches.add(() => {
        useStorage.getState().changeFormat(options.memory_format);
      }, options);
      registerCommands();
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
