<script lang="ts">
import TreasureSvg from "#lib/assets/treasure.svg";
import { world } from "#lib/world.svelte.js";
import Sprite from "./Sprite.svelte";

let me = world.treasure;
</script>

<Sprite
  top={me.pos.y}
  left={me.pos.x}
  width={30}
  layer={9}
  hide={me.hide}
>{@html TreasureSvg}</Sprite>
