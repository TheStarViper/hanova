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
	start: Coords,
	goal: Coords,
	isWalkable: (cell: Coords) => boolean,
): Coords[] {
	let open: Coords[] = [start];
	const gScores = new Map<Coords, number>();
	const parents = new Map<Coords, Coords>();
	const closed = new Set<Coords>();

	const heuristic = heuristicFactory(goal);

	const getF = (coords: Coords): number =>
		gScores.get(coords)! + heuristic(coords);

	gScores.set(start, 0);

	while (open.length > 0) {
		open.sort((a, b) => getF(a) - getF(b));

		const current = open.shift();
		if (current === undefined) throw new Error();

		if (current === goal) {
			// we're done! yay!

			let path: Coords[] = [];
			let head = current;

			while (head !== start) {
				path.push(head);
				head = parents.get(head)!;
			}

			return path;
		}

		if (closed.has(current)) continue;
		closed.add(current);

		const tentativeG = gScores.get(current)! + 1;

		const neighbors = getNeighbors(current);
		for (const neighbor of neighbors) {
			if (!isWalkable(neighbor)) continue;

			const previousG = gScores.get(neighbor);

			if (previousG === undefined || tentativeG < previousG) {
				gScores.set(neighbor, tentativeG);
				parents.set(neighbor, current);
				open.push(neighbor);
			}
		}
	}

	throw new Error("fully explored open set, but couldn't find goal");
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

const gridify = (point: Pos): Coords => {
	const x = Math.floor(point.x / GRID_CELL_WIDTH);
	const y = Math.floor(point.y / GRID_CELL_HEIGHT);
	return stringifyCoords(x, y);
};
const pixelify = (coords: Coords): Pos => {
	const [x, y] = numifyCoords(coords);
	return new Pos((x + 0.5) * GRID_CELL_WIDTH, (y + 0.5) * GRID_CELL_HEIGHT);
};

// based on the boat sprite
/** pixel sizes */
const GRID_CELL_WIDTH = 96;
const GRID_CELL_HEIGHT = 74;

function isWalkableFactory(islands: Island[]): (coords: Coords) => boolean {
	const cache = new Map<Coords, boolean>();

	return (coords: Coords) => {
		const cached = cache.get(coords);
		if (cached !== undefined) return cached;

		const point = pixelify(coords);

		let walkable = true;

		for (const island of islands) {
			const distance = Math.abs(calcDisplacement(point, island.pos));
			if (distance < island.sprite.radius) {
				walkable = false;
				break;
			}
		}

		cache.set(coords, walkable);
		return walkable;
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
