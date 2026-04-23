import type { SaveSlot } from "@inkweave/plugins";
import { memory } from "@inkweave/plugins";
import { memo, useCallback } from "react";
import { t } from "../../i18n";
import type { SaveModalProps } from "../../types";
import styles from "./styles.module.css";

const SAVE_SLOTS = [1, 2, 3, 4, 5];

const SaveModal: React.FC<SaveModalProps> = ({ modalRef, type, title, ink, onClose }) => {
  const saves = memory.show(title);

  const handleSlotClick = useCallback(
    (index: number) => {
      if (!ink) return;

      if (type === "save") {
        memory.save(index, ink);
      } else if (type === "restore" && saves && saves[index]) {
        memory.load(saves[index].data, ink);
      }
      modalRef.current?.close();
      onClose?.();
    },
    [ink, type, saves, modalRef, onClose],
  );

  const handleClose = useCallback(() => {
    modalRef.current?.close();
    onClose?.();
  }, [modalRef, onClose]);

  return (
    <dialog ref={modalRef} className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.title}>
          {type === "save" ? t("modal_save_title") : t("modal_restore_title")}
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label={t("close")}
        >
          ×
        </button>
      </div>
      <div className={styles.body}>
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
              <span className={styles["slot-name"]}>{t(`slot_${slot}`)}</span>
              <span className={hasData ? styles["slot-timestamp"] : styles["slot-empty"]}>
                {hasData ? save.timestamp : t("slot_empty")}
              </span>
            </button>
          );
        })}
      </div>
    </dialog>
  );
};

export default memo(SaveModal);
