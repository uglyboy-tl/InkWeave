import type { InkStory } from "@inkweave/core";
import type { TranslationFunction } from "@inkweave/react";
import { memo, useCallback } from "react";
import { memory } from "../index";
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

const SaveModal: React.FC<SaveModalProps> = ({ ink, type, onClose, t }) => {
  const saves = memory.show(ink.title);

  const handleSlotClick = useCallback(
    (index: number) => {
      if (!ink) return;

      if (type === "save") {
        memory.save(index, ink);
      } else if (type === "restore" && saves && saves[index]) {
        memory.load(saves[index].data, ink);
      }
      onClose();
    },
    [ink, type, saves, onClose],
  );

  return (
    <>
      {SAVE_SLOTS.map((slot) => {
        const save = saves?.[slot] as SaveSlot | undefined;
        const hasData = !!save;
        const isDisabled = type === "restore" && !hasData;

        return (
          <button
            type="button"
            key={slot}
            className={styles.slot}
            onClick={() => handleSlotClick(slot)}
            disabled={isDisabled}
          >
            <span className={styles["slot-name"]}>
              {t(`modal_slot_${slot}`) ?? translations[`modal_slot_${slot}`]}
            </span>
            <span className={hasData ? styles["slot-timestamp"] : styles["slot-empty"]}>
              {hasData ? save.timestamp : (t("modal_slot_empty") ?? translations.modal_slot_empty)}
            </span>
          </button>
        );
      })}
    </>
  );
};

export default memo(SaveModal);
