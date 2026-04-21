import type { InkStory } from "@inkweave/core";
import { Patches } from "@inkweave/core";
import type { SaveSlot } from "./storage";
import useStorage from "./storage";

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
      if (label in ink && typeof ink[label as keyof InkStory] !== "undefined" && label in save)
        (ink as Record<string, unknown>)[label] = save[label];
    });
    ink.continue();
  }
};

const loadMemory = () => {
  Patches.add(() => {
    useStorage.getState().changeFormat(options.memory_format);
  }, options);
};

export const memory = { save, load, show };
export type { SaveSlot };
export default loadMemory;
