import type { Island } from "./island.svelte";
import { calcDisplacement, type Pos } from "./utils.svelte";

/**
 *  @param progress must be 0-1 normalized
 */
export type Route = (progress: number) => Pos;

/** just a straight line */
export function linearRouteFactory(startPos: Pos, endPos: Pos): Route {
	const deltaPos: Pos = {
		x: endPos.x - startPos.x,
		y: endPos.y - startPos.y,
	};

	return (progress: number) => ({
		x: startPos.x + deltaPos.x * progress,
		y: startPos.y + deltaPos.y * progress,
	});
}

/**
 * I've never implemented A* or any other Official For Realsies pathfinding
 * algorithm before, so I'm excited :D
 * @todo implement this
 */
function aStar(
	/** the starting point */
	start: Pos,

	/** the goal */
	end: Pos,

	/** which neighbor nodes to exclude, if any */
	filter?: (point: Pos) => boolean,
): Pos[] {
	return [];
}

function collisionCheckFactory(islands: Island[]): (point: Pos) => boolean {
	return (point: Pos) =>
		islands.every(
			(island) =>
				Math.abs(calcDisplacement(point, island.pos)) >= island.sprite.radius,
		);
}
