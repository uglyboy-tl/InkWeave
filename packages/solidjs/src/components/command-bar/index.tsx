import { CommandRegistry, type InkStory, type TranslationFunction } from "@inkweave/core";
import { createComponent, createEffect, createMemo, createSignal, type JSX } from "solid-js";
import CommandButton from "./CommandButton";
import style from "./styles.module.css";

const translate: TranslationFunction = (key) => {
  if (!key) return undefined;
  return CommandRegistry.getTranslation(key) ?? key;
};

interface CommandBarProps {
  ink: InkStory;
  class?: string;
  buttonClass?: string;
  modalClass?: string;
  t?: TranslationFunction;
}

const CommandBar = (props: CommandBarProps) => {
  const t = (key: string | undefined) => {
    if (!props.t) return translate(key);
    return props.t(key) ?? translate(key);
  };

  const [modalId, setModalId] = createSignal<string | null>(null);
  let modalRef: HTMLDialogElement | undefined;

  const closeModal = () => {
    setModalId(null);
    if (modalRef) {
      modalRef.close();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && modalRef?.open) {
      closeModal();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Escape" && modalRef?.open) {
      closeModal();
    }
  };

  const setActiveModal = (commandId: string) => {
    setModalId(commandId);
  };

  createEffect(() => {
    const id = modalId();
    if (id && modalRef) {
      modalRef.showModal();
    }
    return () => {
      if (modalRef?.open) {
        modalRef.close();
      }
    };
  });

  const modalContent = createMemo((): JSX.Element | null => {
    const id = modalId();
    if (!id) return null;
    const command = CommandRegistry.get(id);
    if (command?.getModalContent) {
      const content = command.getModalContent({
        ink: props.ink,
        onClose: closeModal,
        t,
      });

      // Handle { component, props } objects from plugins
      if (content && typeof content === "object" && "component" in content && "props" in content) {
        const { component: Comp, props: compProps } = content as {
          component: (props: Record<string, unknown>) => JSX.Element;
          props: Record<string, unknown>;
        };
        return createComponent(Comp, compProps);
      }

      // Handle DOM elements（HTMLElement 继承自 Node，属于 JSX.Element 的合法成员）
      if (content instanceof HTMLElement) {
        return content as JSX.Element;
      }

      return content as JSX.Element;
    }
    return null;
  });

  const sortedButtons = createMemo(() =>
    CommandRegistry.getAll()
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .map((command) => (
        <CommandButton
          commandId={command.id}
          ink={props.ink}
          class={props.buttonClass}
          onRequestOpenModal={command.getModalContent ? setActiveModal : undefined}
          t={t}
        />
      )),
  );

  const modalTitle = createMemo(() => {
    const id = modalId();
    if (!id) return "Command";
    const command = CommandRegistry.get(id);
    return t(command?.title) ?? "Command";
  });

  return (
    <>
      <div class={props.class}>{sortedButtons()}</div>
      <dialog
        ref={(el) => {
          modalRef = el;
        }}
        onclose={closeModal}
        onClick={handleBackdropClick}
        onKeyUp={handleKeyUp}
        class={props.modalClass}
      >
        <div id="inkweave-modal-header" class={`inkweave-modal-header ${style.header}`}>
          <span id="inkweave-modal-title" class={`inkweave-modal-title ${style.title}`}>
            {modalTitle()}
          </span>
          <button
            type="button"
            id="inkweave-modal-close"
            class={`inkweave-modal-close ${style.close}`}
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div id="inkweave-modal-body" class={`inkweave-modal-body ${style.body}`}>
          {modalContent()}
        </div>
      </dialog>
    </>
  );
};

export default CommandBar;
