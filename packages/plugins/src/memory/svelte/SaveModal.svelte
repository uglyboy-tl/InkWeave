<script lang="ts">
import type { InkStory, TranslationFunction } from "@inkweave/core";
import { getSlotLabelKey, isSlotReserved, memory } from "../index";
import type { SaveSlot } from "../storage";

interface Props {
  type: "save" | "restore";
  ink: InkStory;
  onClose: () => void;
  t: TranslationFunction;
}

const { type, ink, onClose, t }: Props = $props();

const SAVE_SLOTS = [1, 2, 3, 4, 5];

const saves = $derived(memory.show(ink.title));

const defaultLabels: Record<string, string> = {
  modal_slot_1: "Slot 1",
  modal_slot_2: "Slot 2",
  modal_slot_3: "Slot 3",
  modal_slot_4: "Slot 4",
  modal_slot_5: "Slot 5",
  modal_slot_empty: "Empty",
};

function handleSlotClick(index: number) {
  if (!ink) {
    onClose();
    return;
  }

  if (type === "save") {
    memory.save(index, ink);
  } else if (type === "restore" && saves && saves[index]) {
    memory.load(saves[index].data, ink);
  }
  onClose();
}

function getSlotLabel(slot: number): string {
  const labelKey = getSlotLabelKey(slot);
  if (labelKey) return t(labelKey) ?? `Slot ${slot}`;
  return t(`modal_slot_${slot}`) ?? defaultLabels[`modal_slot_${slot}`] ?? `Slot ${slot}`;
}

function getSlotTimestamp(slot: number): string {
  const save = saves?.[slot] as SaveSlot | undefined;
  if (save) return save.timestamp;
  return t("modal_slot_empty") ?? defaultLabels.modal_slot_empty ?? "Empty";
}

function isDisabled(slot: number): boolean {
  const save = saves?.[slot] as SaveSlot | undefined;
  const hasData = !!save;
  const reserved = isSlotReserved(slot);
  if (type === "restore" && !hasData) return true;
  if (type === "save" && reserved) return true;
  return false;
}
</script>

{#each SAVE_SLOTS as slot}
  {@const save = saves?.[slot]}
  {@const hasData = !!save}
  <button
    type="button"
    class="inkweave-memory-slot"
    onclick={() => handleSlotClick(slot)}
    disabled={isDisabled(slot)}
  >
    <span class="inkweave-memory-slot-name">{getSlotLabel(slot)}</span>
    <span class={hasData ? "inkweave-memory-slot-timestamp" : "inkweave-memory-slot-empty"}>
      {getSlotTimestamp(slot)}
    </span>
  </button>
{/each}

<style>
  .inkweave-memory-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid var(--inkweave-border-color, #e0e0e0);
    background: var(--inkweave-btn-bg, transparent);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .inkweave-memory-slot:hover:not(:disabled) {
    background: var(--inkweave-btn-hover-bg, #f5f5f5);
  }

  .inkweave-memory-slot:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .inkweave-memory-slot-name {
    font-weight: 500;
    color: var(--inkweave-text-color, #333);
  }

  .inkweave-memory-slot-timestamp {
    color: var(--inkweave-secondary-text-color, #666);
    font-size: 0.875rem;
  }

  .inkweave-memory-slot-empty {
    color: var(--inkweave-placeholder-color, #999);
    font-style: italic;
    font-size: 0.875rem;
  }
</style>
