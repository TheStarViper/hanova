import { describe, expect, it } from "vitest";
import { aStar, gridify, isWalkableFactory } from "./route";
import { Island, ISLAND_DATA } from "./island.svelte";
import { Pos } from "./utils.svelte";

const islands = ISLAND_DATA.map((datum) => new Island(datum, () => {}));

describe("Can pathfind", () => {
	describe.each<Island>(islands)(
		"from $name",
		({ name, pos: originPos, sprite: originSprite }) => {
			const start = gridify(Pos.add(originPos, originSprite.spawnOffset));

			it.each<Island>(islands)(
				"to $name",
				({ name: targetName, pos: targetPos, sprite: targetSprite }) => {
					const goal = gridify(Pos.add(targetPos, targetSprite.treasureOffset));

					const otherIslands = islands.filter(
						(island) => island.name !== targetName,
					);
					const isWalkable = isWalkableFactory(otherIslands);

					const path = aStar(start, goal, isWalkable);

					// the fallback path always has length 2, and all actual paths
					// should probably be more complex than that
					expect(path).not.toHaveLength(2);
				},
			);
		},
	);
});
