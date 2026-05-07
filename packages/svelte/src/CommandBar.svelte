<script lang="ts">
import type { Command, InkStory, TranslationFunction } from "@inkweave/core";
import { CommandRegistry } from "@inkweave/core";
import { mount, unmount } from "svelte";

interface Props {
  ink: InkStory;
  class?: string;
  buttonClass?: string;
  modalClass?: string;
  t?: TranslationFunction;
}

let { ink, class: className = "", buttonClass = "", modalClass = "", t }: Props = $props();

const translate: TranslationFunction = (key) => {
  if (!key) return undefined;
  if (t) return t(key) ?? CommandRegistry.getTranslation(key) ?? key;
  return CommandRegistry.getTranslation(key) ?? key;
};

let modalRef = $state<HTMLDialogElement | null>(null);
let activeCommand = $state<Command | null>(null);
let currentModalInstance: Record<string, unknown> | null = null;

const modalTitle = $derived(
  activeCommand ? (translate(activeCommand.title) ?? "Command") : "Command",
);

function openModal(command: Command) {
  activeCommand = command;
}

function closeModal() {
  activeCommand = null;
  if (currentModalInstance) {
    unmount(currentModalInstance);
    currentModalInstance = null;
  }
  modalRef?.close();
}

// Mount modal content when activeCommand changes
$effect(() => {
  if (activeCommand && modalRef) {
    // Clean up previous instance
    if (currentModalInstance) {
      unmount(currentModalInstance);
      currentModalInstance = null;
    }
    const body = modalRef.querySelector("#inkweave-modal-body");
    if (body && activeCommand.getModalContent) {
      body.innerHTML = "";
      const content = activeCommand.getModalContent({
        ink,
        onClose: closeModal,
        t: translate,
      }) as { component: never; props: Record<string, unknown> };
      currentModalInstance = mount(content.component, {
        target: body,
        props: content.props,
      });
    }
    modalRef.showModal();
  }
});

function handleCommand(command: Command) {
  if (command.getModalContent) {
    openModal(command);
  } else {
    CommandRegistry.execute(command.id, ink);
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === modalRef && modalRef?.open) {
    closeModal();
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && modalRef?.open) {
    closeModal();
  }
}

const sortedCommands = $derived(
  CommandRegistry.getAll().sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
);
</script>

<div class={className}>
  {#each sortedCommands as command (command.id)}
    <button
      type="button"
      class="inkweave-command-btn {buttonClass}"
      onclick={() => handleCommand(command)}
      title={translate(command.name)}
      aria-label={translate(command.description)}
    >
      {#if command.icon}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={command.icon} />
        </svg>
      {:else}
        {translate(command.name)}
      {/if}
    </button>
  {/each}
</div>
<dialog
  bind:this={modalRef}
  onclose={closeModal}
  onclick={handleBackdropClick}
  onkeyup={handleKeyDown}
  class="modal {modalClass}"
>
  <div id="inkweave-modal-header" class="header">
    <span id="inkweave-modal-title" class="title">{modalTitle}</span>
    <button
      type="button"
      id="inkweave-modal-close"
      class="close"
      onclick={closeModal}
      aria-label="Close"
    >
      ×
    </button>
  </div>
  <div id="inkweave-modal-body" class="body"></div>
</dialog>

<style>
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    margin: auto;
    width: 320px;
    max-width: calc(100vw - 2rem);
    height: fit-content;
    padding: 0;
    border: none;
    border-radius: 12px;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.12),
      0 2px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .modal[open] {
    display: flex;
    flex-direction: column;
    animation: slide-in 0.2s ease-out;
  }

  .modal::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  .body {
    display: flex;
    flex-direction: column;
  }

  .close {
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close:hover {
    opacity: 0.7;
  }
</style>
