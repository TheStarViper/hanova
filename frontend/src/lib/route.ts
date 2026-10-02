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
 *
 * @todo implement this
 */
function aStar(
	/** the starting point */
	start: GridCell,

	/** the goal */
	end: GridCell,

	/** which neighbor nodes to exclude, if any */
	filter?: (cell: GridCell) => boolean,
): GridCell[] {
	return [];
}

// rn I'm only doing 4 neighbors per cell, but maybe I'll change it to 8 later

// prettier-ignore
const MOORE_NEIGHBORHOOD = [
	[-1, -1], [0, -1], [1, -1],
	[-1,  0],          [1,  0],
	[-1,  1], [0,  1], [1,  1],
];
// prettier-ignore
const NEUMANN_NEIGHBORHOOD = [
						[0, -1],
	[-1,  0],          [1,  0],
						[0,  1],
];
function getNeighbors(origin: Coords): Coords[] {
	const [originX, originY] = numifyCoords(origin);

	return NEUMANN_NEIGHBORHOOD.map((offset) =>
		stringifyCoords(originX + offset[0], originY + offset[1]),
	);
}

/** x,y */
type Coords = `${number},${number}`;
const stringifyCoords = (x: number, y: number): Coords => `${x},${y}`;
const numifyCoords = (coord: Coords) =>
	coord.split(",").map(Number) as [number, number];

class GridCell {
	static GRID_CELL_SIZE: { width: number; height: number } = {
		width: 96,
		height: 74,
	};

	constructor(public readonly coords: Coords) {}

	g: number = Infinity;
	h: number = 0;

	get f() {
		return this.g + this.h;
	}

	parent: GridCell | null = null;

	static gridify(pos: Pos): GridCell {
		const x = Math.floor(pos.x / this.GRID_CELL_SIZE.width);
		const y = Math.floor(pos.y / this.GRID_CELL_SIZE.height);

		const coords = stringifyCoords(x, y);
		return new GridCell(coords);
	}

	static pixelify(cell: GridCell): Pos {
		const [x, y] = numifyCoords(cell.coords);

		return new Pos(
			(x + 0.5) * this.GRID_CELL_SIZE.width,
			(y + 0.5) * this.GRID_CELL_SIZE.height,
		);
	}
}

function intersectionCheckFactory(
	islands: Island[],
): (cell: GridCell) => boolean {
	const cache = new Map<Coords, boolean>();

	return (cell: GridCell) => {
		const coords = cell.coords;

		const cached = cache.get(coords);
		if (cached !== undefined) return cached;

		const point = GridCell.pixelify(cell);

		let intersecting = false;

		for (const island of islands) {
			const distance = Math.abs(calcDisplacement(point, island.pos));
			if (distance < island.sprite.radius) {
				intersecting = true;
				break;
			}
		}

		cache.set(coords, intersecting);
		return intersecting;
	};
}

/** Manhattan distance */
function heuristicFactory(goal: Coords): (coords: Coords) => number {
	const cache = new Map<Coords, number>();

	const [gx, gy] = numifyCoords(goal);

	return (coords: Coords) => {
		const cached = cache.get(coords);
		if (cached !== undefined) return cached;

		const [cx, cy] = numifyCoords(coords);

		const distance = Math.abs(gx - cx) + Math.abs(gy - cy);

		cache.set(coords, distance);
		return distance;
	};
}
