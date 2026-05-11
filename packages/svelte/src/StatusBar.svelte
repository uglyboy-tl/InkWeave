<script lang="ts">
import type { InkStory, StatusBarConfig } from "@inkweave/core";
import { variablesStore } from "@inkweave/core";

interface Props {
  ink: InkStory;
  variables: StatusBarConfig[];
  class?: string;
}

let { ink: _ink, variables, class: className = "" }: Props = $props();

// Svelte 5 中的 zustand store 订阅
let allVars = $state(variablesStore.getState().variables);
const unsubscribe = variablesStore.subscribe((s) => {
  allVars = s.variables;
});
$effect(() => {
  return unsubscribe;
});

function getValue(key: string): number {
  const raw = allVars.get(key);
  return typeof raw === "number" ? raw : 0;
}
</script>

<div id="inkweave-status-bar" class="bar {className}">
  {#each variables as cfg}
    <div class="item">
      <span class="label">{cfg.label}</span>
      {#if cfg.display === "bar"}
        <div class="track">
          <div class="fill" style="width: {variablesStore.getState().getPercent(cfg.key)}%"></div>
        </div>
      {:else}
        <span class="value">{Math.round(getValue(cfg.key))}</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .bar {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .label {
    color: #888;
    flex-shrink: 0;
  }

  .track {
    flex: 1;
    min-width: 30px;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: #4a90d9;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .value {
    font-weight: bold;
    color: #555;
  }
</style>
