<script lang="ts">
import { choicesStore } from "@inkweave/core";
import { ChoiceRegistry } from "./ChoiceRegistry";
import { getStoryContext } from "./context";
import { syncZustand, useChoices } from "./stores.svelte";

const ink = getStoryContext();
const store = useChoices();
const canShowStore = syncZustand(choicesStore, (s) => s.choicesVisible);

const canShow = $derived(canShowStore.value);

function getClassName(choice: { classes: string[]; type: string }): string {
  const classList = [...choice.classes, buttonClass, "inkweave-choice"];
  if (choice.type === "unclickable") {
    classList.push(disabledClass);
  }
  return [...new Set(classList)].join(" ");
}

function handleClick(choice: { index: number; type: string }) {
  if (choice.type !== "unclickable") {
    ink.choose(choice.index);
  }
}

const buttonClass = "button";
const disabledClass = "disabled";
</script>

{#key canShow}
<ul
  data-inkweave="choices"
  class="inkweave-choices choices"
  style="visibility: {canShow ? 'visible' : 'hidden'}"
>
  {#each store.choices as choice, index (choice.index)}
    {@const CustomComponent = ChoiceRegistry.get(choice.type)}
    <li class="item" style="--index: {index}">
      {#if CustomComponent}
        <CustomComponent
          {choice}
          onClick={() => handleClick(choice)}
          className={getClassName(choice)}
        />
      {:else}
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a
          href="#"
          onclick={(e) => {
            e.preventDefault();
            handleClick(choice);
          }}
          class={getClassName(choice)}
          aria-disabled={choice.type === "unclickable"}
        >
          {choice.text}
        </a>
      {/if}
    </li>
  {/each}
</ul>
{/key}

<style>
  .choices {
    list-style: none;
    margin: 0;
    flex-shrink: 0;
    opacity: 0;
    animation: fade-in 0.5s forwards;
    animation-delay: var(--delay, 0s);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .item {
    margin: 0;
  }

  :global(.inkweave-choices) {
    padding: 0.75rem 0 0 0;
    text-align: left;
  }

  :global(.inkweave-choices li) {
    padding: 0.2rem 0;
    padding-left: 1rem;
  }

  :global(.inkweave-choice)::before {
    content: "\25B8 ";
    opacity: 0.6;
    margin-right: 0.25rem;
  }

  :global(.button) {
    display: inline;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    font: inherit;
    transition: opacity 0.15s ease;
  }

  :global(.button:focus-visible) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  :global(.button:hover) {
    opacity: 0.7;
  }

  :global(.button:active) {
    opacity: 0.5;
  }

  :global(.disabled) {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
