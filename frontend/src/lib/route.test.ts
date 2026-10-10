import { describe, expect, it } from "vitest";
import { aStar, gridify, isWalkableFactory } from "./route";
import { Island, ISLAND_DATA } from "./island.svelte";
import { Pos } from "./utils.svelte";

const islands = ISLAND_DATA.map((datum) => new Island(datum, () => {}));

describe("Islands pathfindable", () => {
	describe.each<Island>(islands)(
		"$name",
		({ name, pos: originPos, sprite: originSprite }) => {
			const start = gridify(Pos.add(originPos, originSprite.spawnOffset));

			it.each<Island>(islands)(
				"can pathfind to $name",
				({ name: targetName, pos: targetPos, sprite: targetSprite }) => {
					const goal = gridify(Pos.add(targetPos, targetSprite.treasureOffset));

					const otherIslands = islands.filter(
						(island) => island.name !== targetName,
					);
					const isWalkable = isWalkableFactory(otherIslands);

					/** this is the path that A* will fall back on */
					const crudePath = [start, goal];

					const path = aStar(start, goal, isWalkable);

					expect(path).not.toEqual(crudePath);
				},
			);
		},
	);
});
