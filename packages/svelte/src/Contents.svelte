<script lang="ts">
import type { ContentItem } from "@inkweave/core";
import { CHOICE_SEPARATOR } from "@inkweave/core";
import { getStoryContext } from "./context";
import { useContents, useLineDelay } from "./stores.svelte";

const ink = getStoryContext();
const store = useContents();
const lineDelayStore = useLineDelay();

const visibleLines = $derived(
  typeof ink.visibleLines === "number" ? ink.visibleLines : store.contents.length,
);
const lineDelay = $derived(lineDelayStore.value);
</script>

<section class="inkweave-contents contents">
  {#key lineDelay}
  {#each store.contents as item, i (i)}
    {@const delay = `${(i > visibleLines ? i - visibleLines : 0) * lineDelay}s`}
    {#if item.text === CHOICE_SEPARATOR}
      <div
        class={lineDelay > 0 ? "inkweave-fade" : ""}
        style={lineDelay > 0 ? `--delay: ${delay}` : "opacity: 1"}
      >
        <hr class="inkweave-divider" />
      </div>
    {:else}
      <div
        class="inkweave-content-line {item.classes?.join(' ') ?? ''} {lineDelay > 0 ? 'inkweave-fade' : ''}"
        style={lineDelay > 0 ? `--delay: ${delay}` : "opacity: 1"}
      >
        <p>{item.text}</p>
      </div>
    {/if}
  {/each}
  {/key}
</section>

<style>
  .contents {
    flex: none;
  }

  .contents > :global(div.inkweave-fade) {
    opacity: 0;
    animation: fade-in 0.5s ease-out forwards;
    animation-delay: var(--delay, 0s);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.inkweave-contents p) {
    margin: 0 0 0.5rem 0;
  }

  :global(.inkweave-divider) {
    opacity: 0.3;
  }
</style>
