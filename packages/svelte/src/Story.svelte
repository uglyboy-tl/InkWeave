<script lang="ts">
import type { InkStory } from "@inkweave/core";
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import Choices from "./Choices.svelte";
import Contents from "./Contents.svelte";
import { setStoryContext } from "./context";

interface Props {
  ink: InkStory;
  class?: string;
  onInit?: (ink: InkStory) => void;
  children?: Snippet;
}

let { ink, class: className = "", onInit, children }: Props = $props();

// 必须在组件初始化时设置 context，子组件依赖它
untrack(() => setStoryContext(ink));

$effect(() => {
  ink.continue();
  onInit?.(ink);
});
</script>

<div
  id="inkweave-story"
  class="story {className}"
  data-inkweave="story"
>
  {#if children}
    {@render children()}
  {/if}
  <Contents />
  <Choices />
</div>

<style>
  .story {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
  }
</style>
