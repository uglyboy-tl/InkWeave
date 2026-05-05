<script lang="ts">
import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins/svelte";
import { CommandBar, Story } from "@inkweave/svelte";

const _props = $props<{ ink: InkStory }>();
</script>

<div id="inkweave-player">
  <nav>
    <CommandBar ink={_props.ink} class="inkweave-command-bar" />
  </nav>
  <Story ink={_props.ink}>
    <Image />
  </Story>
</div>