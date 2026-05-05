<script lang="ts">
import type { ChoiceComponentProps } from "@inkweave/svelte";
import { getStoryContext } from "@inkweave/svelte";
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

let tick = $state(0);
let cooldownEnd = $state(0);

const isDisabled = $derived.by(() => {
  void tick;
  return isCooldownActive(key);
});
const remainingSeconds = $derived.by(() => {
  void tick;
  return getRemainingSeconds(key);
});

const buttonClass = $derived(isDisabled ? `${className} disabled`.trim() : className);

const template = $derived((ink.options?.cdTemplate as string) || "{text} ({time})");

const displayText = $derived(
  isDisabled && remainingSeconds > 0
    ? template.replace("{text}", String(choice.text)).replace("{time}", String(remainingSeconds))
    : choice.text,
);

function handleClick(e: MouseEvent) {
  e.preventDefault();
  if (isDisabled) return;
  onClick();
  setCooldown(key, cd);
  cooldownEnd = Date.now() + cd * 1000;
  tick++;
}

$effect(() => {
  // 读取 cooldownEnd 建立响应式依赖，使其变更时重启 interval 对齐到点击时刻
  // 不跳过 end===0 的分支，保证组件因故事循环重建后 tick 仍能驱动 $derived 更新
  const end = cooldownEnd;
  const interval = setInterval(() => {
    // 使用闭包捕获的 end 而非响应式 cooldownEnd，避免 tick 变化触发 $effect 重跑
    if (end > 0 && Date.now() >= end) cooldownEnd = 0;
    tick++;
  }, 1000);

  return () => clearInterval(interval);
});
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<a href="#" class={buttonClass} onclick={handleClick} aria-disabled={isDisabled}>
  {displayText}
</a>
