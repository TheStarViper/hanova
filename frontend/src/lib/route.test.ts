import { describe, expect, it } from "vitest";
import { ISLAND_DATA } from "./data/islandPlacements";
import { Island } from "./island.svelte";
import { aStar, getCostFactory, gridify, isWalkableFactory } from "./route";
import { Pos } from "./utils.svelte";

const islands = ISLAND_DATA.map((datum) => new Island(datum, () => {}));

describe("Can pathfind", () => {
  describe.each<Island>(islands)(
    "from $name",
    (originIsland) => {
      const start = gridify(
        Pos.add(originIsland.pos, originIsland.spawnOffset),
      );

      it.each<Island>(islands)(
        "to $name",
        (targetIsland) => {
          const goal = gridify(targetIsland.treasurePos);

          const otherIslands = islands.filter(
            (island) => island !== targetIsland,
          );
          const isWalkable = isWalkableFactory(otherIslands);
          const getCost = getCostFactory(targetIsland);

          const path = aStar(start, goal, isWalkable, getCost);

          // the fallback path always has length 2, and all non-trivial paths
          // ought to be more complex than that
          expect(
            path,
            `Can't pathfind from ${originIsland.name} to ${targetIsland.name}`,
          ).length.greaterThan(2);
        },
      );
    },
  );
});
