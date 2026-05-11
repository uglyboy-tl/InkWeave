import type { InkStory, TranslationFunction } from "@inkweave/core";
import { CommandRegistry } from "@inkweave/core";
import type { ReactNode } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CommandButton from "./CommandButton";
import style from "./styles.module.css";

interface CommandBarProps {
  ink: InkStory;
  class?: string;
  buttonClass?: string;
  modalClass?: string;
  t?: TranslationFunction;
}

const translate: TranslationFunction = (key) => {
  if (!key) return undefined;
  return CommandRegistry.getTranslation(key) ?? key;
};

const CommandBar = ({
  ink,
  class: className,
  buttonClass,
  modalClass,
  t: input_t,
}: CommandBarProps) => {
  const t = useCallback(
    (key: string | undefined) => {
      if (!input_t) return translate(key);
      return input_t(key) ?? translate(key);
    },
    [input_t],
  );
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

  const getModalContent = (): ReactNode => {
    if (!modalId) return null;
    const command = CommandRegistry.get(modalId);
    if (command?.getModalContent) {
      return command.getModalContent({
        ink,
        onClose: closeModal,
        t,
      }) as ReactNode;
    }
    return null;
  };

  const sortedButtons = useMemo(
    () =>
      CommandRegistry.getAll()
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
        .map((command) => (
          <CommandButton
            key={command.id}
            commandId={command.id}
            ink={ink}
            class={buttonClass}
            onRequestOpenModal={command.getModalContent ? setActiveModal : undefined}
            t={t}
          />
        )),
    [ink, buttonClass, t],
  );

  const modalTitle = useMemo(() => {
    if (!modalId) return "Command";
    const command = CommandRegistry.get(modalId);
    return t(command?.title) ?? "Command";
  }, [modalId, t]);

  return (
    <>
      <div className={className}>{sortedButtons}</div>
      {/* Modal Dialog */}
      <dialog
        ref={modalRef}
        onClose={closeModal}
        onClick={handleBackdropClick}
        onKeyUp={handleKeyUp}
        className={modalClass}
      >
        <div id="inkweave-modal-header" className={style.header}>
          <span id="inkweave-modal-title" className={style.title}>
            {modalTitle}
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
