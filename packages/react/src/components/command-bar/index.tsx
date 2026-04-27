import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Commands } from "../../commands";
import type { CommandBarProps } from "../../types";
import CommandButton from "./CommandButton";
import { t as translate_fn } from "./i18n";
import style from "./styles.module.css";

const CommandBar = ({ ink, className, buttonClassName, modalClassName, t }: CommandBarProps) => {
  if (!t) t = translate_fn;
  const [modalId, setModalId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const closeModal = useCallback(() => {
    setModalId(null);
    if (modalRef.current) {
      modalRef.current.close();
    }
  }, []);

  // Close modal when clicking outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget && modalRef.current?.open) {
        closeModal();
      }
    },
    [closeModal],
  );

  // Keyboard support (close with ESC key)
  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDialogElement>) => {
      if (e.key === "Escape" && modalRef.current?.open) {
        closeModal();
      }
    },
    [closeModal],
  );

  const setActiveModal = useCallback((commandId: string) => {
    setModalId(commandId);
  }, []);

  // 控制 dialog 的打开/关闭
  useEffect(() => {
    if (modalId && modalRef.current) {
      modalRef.current.showModal();
    }

    return () => {
      // 组件卸载时关闭 modal
      if (modalRef.current?.open) {
        modalRef.current.close();
      }
    };
  }, [modalId]);

  const getModalContent = () => {
    if (!modalId) return null;
    const command = Commands.get(modalId);
    if (command?.getModalContent) {
      return command.getModalContent({
        ink,
        onClose: closeModal,
        t,
      });
    }
    return null;
  };

  return (
    <>
      <div className={className}>
        {Commands.getAll()
          .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
          .map((command) => (
            <CommandButton
              key={command.id}
              commandId={command.id}
              ink={ink}
              className={buttonClassName}
              onRequestOpenModal={command.getModalContent ? setActiveModal : undefined}
              t={t}
            />
          ))}
      </div>
      {/* Modal Dialog */}
      <dialog
        ref={modalRef}
        onClose={closeModal}
        onClick={handleBackdropClick}
        onKeyUp={handleKeyUp}
        className={modalClassName}
      >
        <div id="inkweave-modal-header" className={style.header}>
          <span id="inkweave-modal-title" className={style.title}>
            {modalId
              ? (() => {
                  const command = Commands.get(modalId);
                  return t(command?.title) ?? "Command";
                })()
              : "Command"}
          </span>
          <button
            type="button"
            id="inkweave-modal-close"
            className={style.close}
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div id="inkweave-modal-body" className={style.body}>
          {getModalContent()}
        </div>
      </dialog>
    </>
  );
};

export default memo(CommandBar);
