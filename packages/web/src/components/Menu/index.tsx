import { memo, useCallback, useRef, useState } from "react";
import { t } from "../../i18n";
import type { MenuProps } from "../../types";
import SaveModal from "../SaveModal";
import { RestartIcon, RestoreIcon, SaveIcon } from "./Icons";
import styles from "./styles.module.css";

const Menu = ({ ink }: MenuProps) => {
  const [modalType, setModalType] = useState<"save" | "restore">("save");
  const [title, setTitle] = useState<string>("");
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = useCallback((type: "save" | "restore") => {
    setModalType(type);
    setTitle(ink.title);
    modalRef.current?.showModal();
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => openModal("restore")}
          title={t("menu_restore")}
          aria-label={t("menu_restore_aria")}
        >
          <RestoreIcon />
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => openModal("save")}
          title={t("menu_save")}
          aria-label={t("menu_save_aria")}
        >
          <SaveIcon />
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => ink.restart()}
          title={t("menu_restart")}
          aria-label={t("menu_restart_aria")}
        >
          <RestartIcon />
        </button>
      </div>
      <SaveModal modalRef={modalRef} type={modalType} title={title} ink={ink} />
    </nav>
  );
};

export default memo(Menu);
