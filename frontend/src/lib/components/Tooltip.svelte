<script lang="ts">
import { TOOLTIP_DATA } from "#lib/tooltip.svelte.js";
import { world } from "#lib/world.svelte.js";

let me = world.tooltip;

let title = $state("");
let blurb = $state("");

$effect(() => {
  if (me.target === null) return;

  const datum = TOOLTIP_DATA[me.target];

  title = datum.title;
  blurb = datum.blurb;
});
</script>

<div
  class={me.target === null ? "" : "show"}
  style:top="{world.viewport.mouseY}px"
  style:left="{world.viewport.mouseX}px"
>
  <h2>{title}</h2>
  <p>{blurb}</p>
</div>

<style lang="scss">
div {
	position: absolute;
	transform: translate(-15%, -20%);
	user-select: none;
	pointer-events: none;

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

	p {
		font-size: 0.7rem;
	}
}
</style>
