<script lang="ts" module>
import { type Format, FORMATS } from "#lib/backend.js";
import { TOOLTIP_DATA, type TooltipKey } from "#lib/data/tooltipData.js";
export class TooltipManager {
  target: TooltipKey | null = $state(null);
  island: IslandManager | undefined = $derived(
    world.formatToIsland[this.target as any as Format],
  );
}
</script>

<script lang="ts">
import { world } from "#lib/world.svelte.js";
import type { IslandManager } from "./Island.svelte";

let me = world.tooltip;

let title = $state("");
let blurb = $state("");
let incompatible = $state(false);

$effect(() => {
  if (world.islandEditTarget !== null) {
    const target = world.islandEditTarget;
    title = `Editing ${target.name}`;
    blurb = `
    X: ${target.pos.x} Y: ${target.pos.y}<br>
    Sprite: ${target.islandSpriteIndex}<br>
    Topic: ${world.islandEditTopic}
    `;

    return;
  }

  if (me.target === null) return;

  const datum = TOOLTIP_DATA[me.target];

  title = datum.title;
  blurb = datum.blurb;
  incompatible = me.island?.incompatible ?? false;
});
</script>

<div
  class={me.target === null && world.islandEditTarget === null ? "" : "show"}
  style:top="{world.viewport.mouseY}px"
  style:left="{world.viewport.mouseX}px"
>
  <h2>{title}</h2>
  <p>{@html blurb}</p>
  {#if incompatible}
    <h3>
      Can't convert: {
        world.fileManager.getInputFormatName(world.fileManager.file?.name ?? "")
      } -> {me.target}
    </h3>
  {/if}
</div>

<style lang="scss">
div {
  position: absolute;
  transform: translate(-15%, -20%);
  user-select: none;
  pointer-events: none;
  z-index: 101;

  color: var(--ink);
  background: #fffae5ff;
  border: 5px double #6f5d64ff;
  padding: 0.5rem 0.4rem;
  border-radius: 0.5rem;
  max-width: 20ch;

  clip-path: xywh(0 0 0 0);
  transition: clip-path 0.3s ease;

  &.show {
    clip-path: xywh(0 0 100% 100%);
  }

  h2 {
    font-size: 1rem;
  }

  h3 {
    font-size: 0.9rem;
    color: #ce2727;
  }

  p {
    font-size: 0.7rem;

    :global {
      ul {
        padding-left: 1rem;

        li {
          text-indent: 1ch hanging;
        }
      }
    }
  }
}
</style>
