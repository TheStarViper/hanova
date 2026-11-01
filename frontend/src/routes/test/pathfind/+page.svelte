<script lang="ts">
import type { Format } from "#lib/backend.js";
import {
  aStar,
  getCostFactory,
  gridify,
  isWalkableFactory,
} from "#lib/route.js";
import { Pos } from "#lib/utils.svelte.js";
import { world } from "#lib/world.svelte.js";
import { onMount } from "svelte";

type Row = [Format, boolean | undefined];
type Column = [Format, Row[]];

const emptyRows: () => Row[] = () =>
  world.islands.map((i) => [i.name, undefined]);

const columns: Column[] = $state(
  world.islands.map((i) => [i.name, emptyRows()]),
);

// cuz unless I yield the thread, it'll just be one giant thread-blocking for
// loop that locks up the browser
const yieldThread = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * true for completed
 * undefined for haven't started
 * [Format, Format] for in progress
 */
let status: [Format, Format] | true | undefined = $state(undefined);
let totalCount: number = world.islands.length ** 2;
let currentIndex: number = $state(0);
let pathfindableCount: number = $state(0);

async function runTest() {
  for (const originIndex in world.islands) {
    const originIsland = world.islands[originIndex];

    const start = gridify(
      Pos.add(originIsland.pos, originIsland.spawnOffset),
    );

    for (const targetIndex in world.islands) {
      const targetIsland = world.islands[targetIndex];
      const goal = gridify(targetIsland.treasurePos);

      const otherIslands = world.islands.filter(
        (island) => island !== targetIsland,
      );
      const isWalkable = isWalkableFactory(otherIslands);
      const getCost = getCostFactory(targetIsland);

      const path = aStar(start, goal, isWalkable, getCost);

      // the fallback path always has length 2, and all non-trivial paths
      // ought to be more complex than that
      const canPathfind = path.length > 2;

      columns[originIndex][1][targetIndex][1] = canPathfind;
      status = [originIsland.name, targetIsland.name];
      currentIndex++;
      if (canPathfind) pathfindableCount++;

      await yieldThread();
    }
  }

  status = true;
}

let start: number = $state(0);
let end: number = $state(0);

onMount(async () => {
  start = Date.now();
  await runTest();
  end = Date.now();
});
</script>

<h1>Pathfinding Test</h1>

<h2>
  {#if status === undefined}
    Starting...
  {:else if status === true}
    Finished! {pathfindableCount} out of {totalCount} islands are pathfindable.
    Took {(end - start) / 1000} seconds.
  {:else}
    {status[0]} -> {status[1]} ({currentIndex}/{totalCount})
  {/if}
</h2>

<div class="table-container">
  <table>
    <thead>
      <tr>
        {#each columns as column}
          <th scope="col">{column[0]}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if columns.length > 0}
        {#each columns[0][1] as _, rowIndex}
          <tr>
            {#each columns as column}
              {@const row = column[1][rowIndex]}
              <td>
                {#if row}<span
                    class={row[1] === true ? "yes" : row[1] === false ? "no" : "loading"}
                  >{row[0]}</span>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style lang="scss">
h1, h2 {
  text-align: center;
}

h2 {
  font-size: 1.1rem;
}

.table-container {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;

  table {
    margin-inline: auto;

    td {
      .yes {
        color: #66d64d;
      }
      .no {
        color: red;
      }
      .loading {
        opacity: 0.5;
      }
    }
  }
}
</style>
