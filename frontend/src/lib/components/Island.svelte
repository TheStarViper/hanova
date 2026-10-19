<script lang="ts">
import type { Format } from "#lib/fileManager.js";
import { Island } from "#lib/island.svelte.js";
import type { Viewport } from "#lib/viewport.svelte.js";
import Sprite from "./Sprite.svelte";

interface Props {
  me: Island;
  viewport: Viewport;
  debugging: boolean;
  allowHover: boolean;
  setTooltip: (format: Format | null) => void;
}

let { me, viewport, debugging, allowHover, setTooltip }: Props = $props();

let hovered: boolean = $state(false);
let shadowOpacity = $derived(hovered && allowHover ? 0.8 : 0.4);
let borderColor = $derived(hovered && allowHover ? "#FFC067" : undefined);

$effect(() => {
  setTooltip(hovered && allowHover ? me.name : null);
});
</script>

<Sprite
  left={me.pos.x}
  top={me.pos.y}
  {viewport}
  width={me.sprite.width}
  {shadowOpacity}
  {borderColor}
  borderWidth={2}
  handlers={{
    click: allowHover
      ? () => {
        setTimeout(() => {
          if (!viewport.userIsDragging) me.callBoat();
        }, 100);
      }
      : undefined,
    hover: () => (hovered = true),
    unhover: () => (hovered = false),
  }}
  label={me.name.toUpperCase()}
>{@html me.sprite.svg}</Sprite>
<div
  class="debug"
  style:display={debugging ? "flex" : "none"}
>
  <span
    class="radius"
    style:left="{me.pos.x + viewport.offset.x}px"
    style:top="{me.pos.y + viewport.offset.y}px"
    style:--radius="{me.sprite.radius}px"
  ></span>
  <span
    class="spawn"
    style:left="{me.pos.x + me.spawnOffset.x + viewport.offset.x}px"
    style:top="{me.pos.y + me.spawnOffset.y + viewport.offset.y}px"
  ></span>
  <span
    class="treasure"
    style:left="{me.pos.x + me.sprite.treasureOffset.x + viewport.offset.x}px"
    style:top="{me.pos.y + me.sprite.treasureOffset.y + viewport.offset.y}px"
  ></span>
</div>

<style lang="scss">
.debug {
	* {
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.radius {
		width: calc(var(--radius) * 2);
		height: calc(var(--radius) * 2);
		border: 5px solid red;
		border-radius: 9999px;
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
