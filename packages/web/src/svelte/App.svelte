<script lang="ts">
import type { InkStory, StatusBarConfig, TranslationFunction } from "@inkweave/core";
import { Image } from "@inkweave/plugins/svelte";
import { CommandBar, StatusBar, Story } from "@inkweave/svelte";

interface Props {
  ink: InkStory;
  translations?: TranslationFunction;
  statusBar?: StatusBarConfig[];
}
let { ink, translations, statusBar }: Props = $props();
</script>

<div id="inkweave-player">
  <nav>
    {#if statusBar}
      <StatusBar ink={ink} variables={statusBar} />
    {/if}
    <CommandBar ink={ink} class="inkweave-command-bar" buttonClass="inkweave-cmd-btn" t={translations} />
  </nav>
  <Story ink={ink}>
    <Image />
  </Story>
</div>