// Framework-agnostic plugin exports

// ---- pure logic plugins ----
export { audioPlugin, useStoryMusic } from "./audio";
export { autoRestorePlugin } from "./auto-restore";
export { autoSavePlugin } from "./auto-save";
export { classTagPlugin } from "./class-tag";
// ---- zustand stores ----
export { useContentComplete } from "./fade-effect";
// ---- image ----
export { imagePlugin, useStoryImage } from "./image";
export { linkOpenPlugin } from "./link-open";
export type { SaveSlot } from "./memory";
// ---- memory ----
export { getSlotLabelKey, isSlotReserved, memory, reserveSlot } from "./memory";
export { scrollAfterChoicePlugin } from "./scroll-after-choice";
