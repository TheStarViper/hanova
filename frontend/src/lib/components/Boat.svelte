<script lang="ts">
import BoatSvg from "#lib/assets/boat.svg?raw";
import type { Boat } from "#lib/boat.svelte.js";
import type { Viewport } from "#lib/viewport.svelte.js";
import Sprite from "./Sprite.svelte";

interface Props {
  me: Boat;
  viewport: Viewport;
}

let { me, viewport }: Props = $props();
</script>

<Sprite
  left={me.pos.x}
  top={me.pos.y}
  {viewport}
  width={96}
  label={me.name}
  hide={me.hide}
  layer={10}
  sunk={me.sunk}
>
  {@html BoatSvg}
</Sprite>
