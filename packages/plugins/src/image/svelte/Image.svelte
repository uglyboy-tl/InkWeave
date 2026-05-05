<script lang="ts">
import { onMount } from "svelte";
import { useStoryImage } from "../index";

interface Props {
  class?: string;
}

let { class: className = "" }: Props = $props();

let image = $state("");
let hasError = $state(false);

onMount(() => {
  const unsub = useStoryImage.subscribe((state) => {
    image = state.image;
    hasError = false;
  });
  return unsub;
});

function handleError() {
  hasError = true;
  console.warn(`InkWeave: Failed to load image: ${image}`);
}

function handleLoad() {
  hasError = false;
}
</script>

{#if image && !hasError}
  <div id="inkweave-image" class="inkweave-image-container {className}">
    <img src={image} alt="" onerror={handleError} onload={handleLoad} />
  </div>
{/if}

<style>
  :global(.inkweave-image-container) {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  :global(.inkweave-image-container img) {
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
    object-fit: contain;
  }
</style>
