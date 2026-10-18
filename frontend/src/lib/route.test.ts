import { describe, expect, it } from "vitest";
import { Island, ISLAND_DATA } from "./island.svelte";
import { aStar, gridify, isWalkableFactory } from "./route";
import { Pos } from "./utils.svelte";

const islands = ISLAND_DATA.map((datum) => new Island(datum, () => {}));

describe("Can pathfind", () => {
  describe.each<Island>(islands)(
    "from $name",
    ({ name: originName, pos: originPos, spawnOffset: originSpawnOffset }) => {
      const start = gridify(Pos.add(originPos, originSpawnOffset));

      it.each<Island>(islands)(
        "to $name",
        ({ name: targetName, pos: targetPos, sprite: { treasureOffset: targetTreasureOffset } }) => {
          const goal = gridify(Pos.add(targetPos, targetTreasureOffset));

          const otherIslands = islands.filter(
            (island) => island.name !== targetName,
          );
          const isWalkable = isWalkableFactory(otherIslands);

          const path = aStar(start, goal, isWalkable);

          // the fallback path always has length 2, and all non-trivial paths
          // ought to be more complex than that
          expect(
            path,
            `Can't pathfind from ${originName} to ${targetName}`,
          ).length.greaterThan(2);
        },
      );
    },
  );
});
