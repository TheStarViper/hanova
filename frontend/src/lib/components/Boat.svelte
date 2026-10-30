<script lang="ts">
import BoatSvg from "#lib/assets/boat.svg";
import { world } from "#lib/world.svelte.js";
import Sprite from "./Sprite.svelte";

let me = world.boat;
</script>

<Sprite
  left={me.pos.x}
  top={me.pos.y}
  width={96}
  label={me.name}
  hide={me.hide}
  layer={10}
  sunk={me.sunk}
>
  {@html BoatSvg}
</Sprite>
