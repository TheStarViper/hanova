import type { Pos } from "./utils.svelte";

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
