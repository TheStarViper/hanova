import type { Island } from "./island.svelte";
import { calcDisplacement, Pos } from "./utils.svelte";

/**
 *  @param progress must be 0-1 normalized
 */
export type Route = (progress: number) => Pos;

/** just a straight line */
export function linearRouteFactory(startPos: Pos, endPos: Pos): Route {
	const deltaPos = new Pos(endPos.x - startPos.x, endPos.y - startPos.y);

	return (progress: number) =>
		new Pos(
			startPos.x + deltaPos.x * progress,
			startPos.y + deltaPos.y * progress,
		);
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

class GridPos {
	static GRID_CELL_SIZE: { width: number; height: number } = {
		width: 96,
		height: 74,
	};

	/**
	 * this is just to make it so that typescript can't duck type GridPos and
	 * normal Pos
	 */
	private _gridPos: number = 0;
	constructor(
		public x: number,
		public y: number,
	) {}

	static Gridify(pixelPos: Pos): GridPos {
		const x = Math.floor(pixelPos.x / this.GRID_CELL_SIZE.width);
		const y = Math.floor(pixelPos.y / this.GRID_CELL_SIZE.height);

		return new GridPos(x, y);
	}

	static Pixelify(gridPos: GridPos): Pos {
		return new Pos(
			(gridPos.x + 0.5) * this.GRID_CELL_SIZE.width,
			(gridPos.y + 0.5) * this.GRID_CELL_SIZE.height,
		);
	}
}

function collisionCheckFactory(islands: Island[]): (point: Pos) => boolean {
	return (point: Pos) =>
		islands.every(
			(island) =>
				Math.abs(calcDisplacement(point, island.pos)) >= island.sprite.radius,
		);
}
