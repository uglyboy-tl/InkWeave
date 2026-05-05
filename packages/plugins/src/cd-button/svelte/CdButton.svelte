<script lang="ts">
import type { ChoiceComponentProps } from "@inkweave/svelte";
import { getStoryContext } from "@inkweave/svelte";
import { onMount } from "svelte";
import {
  getCooldownKey,
  getRemainingSeconds,
  isCooldownActive,
  setCooldown,
} from "../cooldownState";

let { choice, onClick, className = "" }: ChoiceComponentProps = $props();

const ink = getStoryContext();
const cd = $derived(parseFloat(choice.val || "0"));
const key = $derived(getCooldownKey(choice));
const isDisabled = $derived(isCooldownActive(key));
const remainingSeconds = $derived(getRemainingSeconds(key));

let tick = $state(0);

const buttonClass = $derived(isDisabled ? `${className} disabled`.trim() : className);

const template = $derived((ink.options?.cdTemplate as string) || "{text} ({time})");

const displayText = $derived(
  isDisabled && remainingSeconds > 0
    ? template.replace("{text}", String(choice.text)).replace("{time}", String(remainingSeconds))
    : choice.text,
);

function handleClick() {
  if (isDisabled) return;
  onClick();
  setCooldown(key, cd);
  tick++;
}

onMount(() => {
  const interval = setInterval(() => {
    tick++;
  }, 1000);
  return () => clearInterval(interval);
});
</script>

<button type="button" class={buttonClass} onclick={handleClick} aria-disabled={isDisabled}>
  {displayText}
</button>
