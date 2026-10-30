<script lang="ts" module>
import { Pos } from "#lib/utils.svelte.js";
import { IslandManager } from "./Island.svelte";

export class TreasureManager {
  owner: IslandManager | null = $state(null);

  /**
   * This is just to make the pos not instantly jump away when owner is set to
   * null, *sigh*
   */
  previousOwner: IslandManager | null = $state(null);
  pos: Pos = $derived(
    this.previousOwner === null ? new Pos() : this.previousOwner.treasurePos,
  );
  hide: boolean = $derived(this.owner === null);
}
</script>

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
