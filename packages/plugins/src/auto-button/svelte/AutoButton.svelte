<script lang="ts">
import type { ChoiceComponentProps } from "@inkweave/svelte";
import { onMount } from "svelte";

let { choice, onClick, className = "" }: ChoiceComponentProps = $props();

const cd = $derived(parseFloat(choice.val ?? "") || 0);

let interval: ReturnType<typeof setInterval> | null = null;

onMount(() => {
  if (cd <= 0) return;
  interval = setInterval(() => {
    onClick();
  }, cd * 1000);

  return () => {
    if (interval) clearInterval(interval);
  };
});
</script>

<button type="button" class={className} style="display: none" aria-hidden="true">
  {choice.text}
</button>
