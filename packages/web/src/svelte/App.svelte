<script lang="ts">
import type { InkStory, TranslationFunction } from "@inkweave/core";
import { Image } from "@inkweave/plugins/svelte";
import { CommandBar, Story } from "@inkweave/svelte";

const _props = $props<{ ink: InkStory; translations?: TranslationFunction }>();
</script>

<div id="inkweave-player">
  <nav>
    <CommandBar ink={_props.ink} class="inkweave-command-bar" buttonClass="inkweave-cmd-btn" t={_props.translations} />
  </nav>
  <Story ink={_props.ink}>
    <Image />
  </Story>
</div>