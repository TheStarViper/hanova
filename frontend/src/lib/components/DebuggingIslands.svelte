<script lang="ts">
import { ISLAND_CLUSTER_CENTERS } from "#lib/data/islandPlacements.js";
import { world } from "#lib/world.svelte.js";
</script>

<div
  id="islandDebugs"
  style:left="{world.viewport.offset.x}px"
  style:top="{world.viewport.offset.y}px"
>
  {#each world.islands as island}
    <div
      class="islandDebug"
      style:left="{island.pos.x}px"
      style:top="{island.pos.y}px"
    >
      <span
        class="radius"
        style:--xAxis="{island.sprite.bound.xAxis}px"
        style:--yAxis="{island.sprite.bound.yAxis}px"
        style:left="{island.sprite.bound.xOffset}px"
        style:top="{island.sprite.bound.yOffset}px"
        style:rotate="{island.sprite.bound.degrees}deg"
      ></span>
      <span
        class="spawn"
        style:left="{island.spawnOffset.x}px"
        style:top="{island.spawnOffset.y}px"
      ></span>
      <span
        class="treasure"
        style:left="{island.sprite.treasureOffset.x}px"
        style:top="{island.sprite.treasureOffset.y}px"
      ></span>
    </div>
  {/each}
  <div id="islandClusterDebugs">
    {#each Object.values(ISLAND_CLUSTER_CENTERS) as pos}
      <span
        class="clusterCenter"
        style:left="{pos.x}px"
        style:top="{pos.y}px"
      ></span>
    {/each}
  </div>
</div>

<style lang="scss">
#islandDebugs {
  position: absolute;

  span {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .islandDebug {
    position: relative;

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
      border-radius: 50%;
    }
    .treasure {
      width: 30px;
      height: 30px;
      border: 5px solid fuchsia;
      border-radius: 50%;
    }
  }

  #islandClusterDebugs {
    position: relative;

    .clusterCenter {
      width: 100px;
      height: 100px;
      background-color: color-mix(cyan 30%, transparent);
      border: 7px solid cyan;
      border-radius: 50%;
    }
  }
}
</style>
