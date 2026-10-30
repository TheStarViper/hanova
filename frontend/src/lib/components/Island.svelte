<script lang="ts" module>
export const COLOR_SUBSTITIONS: Record<string, string> = {
  "#f9f2db": "var(--land)",
  "#F9F2DB": "var(--land)",

  "#4c2416": "var(--shore-shadow)",

  "#645157": "var(--line)",
  "#645257": "var(--line)",
  "#68565b": "var(--line)",
  "#66535a": "var(--line)",
  "#6d5a5f": "var(--line)",

  "#eadfce": "var(--tree-fill)",
  "#efe6d2": "var(--tree-fill)",
  "#e5dac9": "var(--tree-fill)",
  "#E5DAC9": "var(--tree-fill)",
};
</script>

<script lang="ts">
import type { MediaType } from "#lib/backend.js";
import { Island } from "#lib/island.svelte.js";
import { TOOLTIP_DATA } from "#lib/tooltip.svelte.js";
import { world } from "#lib/world.svelte.js";
import Sprite from "./Sprite.svelte";

interface Props {
  me: Island;
}

let { me }: Props = $props();

const BORDER_COLOR_MAPPING: Record<MediaType, string> = {
  image: "#ffc067",
  audio: "#82ff66",
  video: "#af66ff",
  // docs: "#66c4ff",
};

let allowHover = $derived(world.banner.hide);

let hovered: boolean = $state(false);
let shadowOpacity = $derived(hovered && allowHover ? 1 : 0.7);
let borderColor = $derived(
  hovered && allowHover ? BORDER_COLOR_MAPPING[me.mediaType] : undefined,
);

let processedSvg: string = $derived.by(() => {
  let svg = me.sprite.svg;

  for (const key in COLOR_SUBSTITIONS) {
    const value = COLOR_SUBSTITIONS[key];
    svg = svg.replaceAll(key, value);
  }

  return svg;
});

$effect(() => {
  world.tooltip.target = hovered && allowHover ? me.name : null;
});
</script>

<Sprite
  left={me.pos.x}
  top={me.pos.y}
  width={me.sprite.width}
  {shadowOpacity}
  {borderColor}
  borderWidth={2}
  handlers={{
    click: allowHover
      ? () => {
        setTimeout(() => {
          if (!world.viewport.userIsDragging) me.callBoat();
        }, 100);
      }
      : undefined,
    hover: () => (hovered = true),
    unhover: () => (hovered = false),
  }}
  label={TOOLTIP_DATA[me.name].title}
>{@html processedSvg}</Sprite>
<div
  class="debug"
  style:display={world.debugging ? "flex" : "none"}
  style:left="{me.pos.x + world.viewport.offset.x}px"
  style:top="{me.pos.y + world.viewport.offset.y}px"
>
  <span
    class="radius"
    style:--xAxis="{me.sprite.bound.xAxis}px"
    style:--yAxis="{me.sprite.bound.yAxis}px"
    style:left="{me.sprite.bound.xOffset}px"
    style:top="{me.sprite.bound.yOffset}px"
    style:rotate="{me.sprite.bound.degrees}deg"
  ></span>
  <span
    class="spawn"
    style:left="{me.spawnOffset.x}px"
    style:top="{me.spawnOffset.y}px"
  ></span>
  <span
    class="treasure"
    style:left="{me.sprite.treasureOffset.x}px"
    style:top="{me.sprite.treasureOffset.y}px"
  ></span>
</div>

<style lang="scss">
.debug {
	position: relative;

	* {
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.radius {
		width: calc(var(--xAxis) * 2);
		height: calc(var(--yAxis) * 2);
		transform-origin: top left;
		border: 5px solid red;
		border-radius: 50%;
	}
	.spawn {
		width: 96px;
		height: 74px;
		border: 7px solid lime;
		border-radius: 9999px;
	}
	.treasure {
		width: 30px;
		height: 30px;
		border: 5px solid fuchsia;
		border-radius: 9999px;
	}
}
</style>
