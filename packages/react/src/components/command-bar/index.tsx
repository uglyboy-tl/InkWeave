import type { InkStory } from "@inkweave/core";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Commands } from "../../commands";
import CommandButton from "./CommandButton";

export interface CommandBarProps {
  ink: InkStory;
  className?: string;
  buttonClassName?: string;
  modalClassName?: string;
}

const CommandBar = ({ ink, className, buttonClassName, modalClassName }: CommandBarProps) => {
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
      return command.getModalContent(ink, closeModal);
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
        {getModalContent()}
      </dialog>
    </>
  );
};

export default memo(CommandBar);
