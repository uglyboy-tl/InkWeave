import type { InkStory, TranslationFunction } from "@inkweave/core";
import { getSlotLabelKey, isSlotReserved, memory } from "../index";
import type { SaveSlot } from "../storage";
import styles from "./SaveModal.module.css";

const translations: Record<string, string> = {
  modal_save_title: "Save Game",
  modal_restore_title: "Load Game",
  modal_slot_1: "Slot 1",
  modal_slot_2: "Slot 2",
  modal_slot_3: "Slot 3",
  modal_slot_4: "Slot 4",
  modal_slot_5: "Slot 5",
  modal_slot_empty: "Empty",
};

interface SaveModalProps {
  type: "save" | "restore";
  ink: InkStory;
  onClose: () => void;
  t: TranslationFunction;
}

const SAVE_SLOTS = [1, 2, 3, 4, 5];

const SaveModal = (props: SaveModalProps) => {
  const saves = memory.show(props.ink.title);

  const handleSlotClick = (index: number) => {
    if (!props.ink) {
      props.onClose();
      return;
    }

    if (props.type === "save") {
      memory.save(index, props.ink);
    } else if (props.type === "restore" && saves && saves[index]) {
      memory.load(saves[index].data, props.ink);
    }
    props.onClose();
  };

  return (
    <>
      {SAVE_SLOTS.map((slot) => {
        const save = saves?.[slot] as SaveSlot | undefined;
        const hasData = !!save;
        const reserved = isSlotReserved(slot);
        const labelKey = getSlotLabelKey(slot);
        const isRestoreDisabled = props.type === "restore" && !hasData;
        const isSaveDisabled = props.type === "save" && reserved;

        return (
          <button
            type="button"
            class={styles.slot}
            onClick={() => handleSlotClick(slot)}
            disabled={isRestoreDisabled || isSaveDisabled}
          >
            <span class={styles["slot-name"]}>
              {labelKey
                ? (props.t(labelKey) ?? `Slot ${slot}`)
                : (props.t(`modal_slot_${slot}`) ?? translations[`modal_slot_${slot}`])}
            </span>
            <span class={hasData ? styles["slot-timestamp"] : styles["slot-empty"]}>
              {hasData
                ? save.timestamp
                : (props.t("modal_slot_empty") ?? translations.modal_slot_empty)}
            </span>
          </button>
        );
      })}
    </>
  );
};

export default SaveModal;
