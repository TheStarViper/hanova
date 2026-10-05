import { bezier, pathToBezier, type CubicBezier } from "./bezier";
import type { Island } from "./island.svelte";
import { Pos } from "./utils.svelte";

/**
 *  @param progress must be 0-1 normalized
 */
export type Route = (progress: number) => Pos;

/** just a straight line */
export function linearRouteFactory(start: Pos, end: Pos): Route {
	return (progress: number) => Pos.lerp(start, end, progress);
}

export function aStarRouteFactory(
	startPos: Pos,
	endPos: Pos,
	islands: Island[],
): [Route, CubicBezier[]] {
	const start = gridify(startPos);
	const goal = gridify(endPos);
	const isWalkable = isWalkableFactory(islands);

	const path = aStar(start, goal, isWalkable);

	const curves = pathToBezier(path.map(pixelify));

	const route = (progress: number) => {
		const position = progress * curves.length;
		const index = Math.min(Math.floor(position), curves.length - 1);
		const t = position - index;
		return bezier(curves[index], Math.min(t, 1));
	};

	return [route, curves];
}

export function aStar(
	start: Coords,
	goal: Coords,
	isWalkable: (cell: Coords) => boolean,
): Coords[] {
	let open: Coords[] = [start];
	const gScores = new Map<Coords, number>();
	const parents = new Map<Coords, Coords>();
	const closed = new Set<Coords>();

	const inBounds = inBoundsFactory(start, goal);
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

			let head = goal;
			let path: Coords[] = [head];

			while (head !== start) {
				head = parents.get(head)!;
				path.unshift(head);
			}

			return path;
		}

		if (closed.has(current)) continue;
		closed.add(current);

		const tentativeG = gScores.get(current)! + 1;

		const neighbors = getNeighbors(current);
		for (const neighbor of neighbors) {
			if (!isWalkable(neighbor) || !inBounds(neighbor)) continue;

			const previousG = gScores.get(neighbor);

			if (previousG === undefined || tentativeG < previousG) {
				gScores.set(neighbor, tentativeG);
				parents.set(neighbor, current);
				open.push(neighbor);
			}
		}
	}

	console.warn(
		"Fully traversed the grid with A*, but couldn't find a valid path. Defaulting to crude path",
	);

	return [start, goal];
}

function inBoundsFactory(
	coords1: Coords,
	coords2: Coords,
): (coords: Coords) => boolean {
	const MARGIN = 2;

	const [x1, y1] = numifyCoords(coords1);
	const [x2, y2] = numifyCoords(coords2);

	const minX = Math.min(x1, x2) - MARGIN;
	const maxX = Math.max(x1, x2) + MARGIN;
	const minY = Math.min(y1, y2) - MARGIN;
	const maxY = Math.max(y1, y2) + MARGIN;

	return (coords: Coords) => {
		const [x, y] = numifyCoords(coords);
		return x >= minX && x <= maxX && y >= minY && y <= maxY;
	};
}

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

	return MOORE_NEIGHBORHOOD.map((offset) =>
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
/** sizes in pixels */
const GRID_CELL_WIDTH = 96 / 2;
const GRID_CELL_HEIGHT = 74 / 2;

function isWalkableFactory(islands: Island[]): (coords: Coords) => boolean {
	const cache = new Map<Coords, boolean>();

	return (coords: Coords) => {
		const cached = cache.get(coords);
		if (cached !== undefined) return cached;

		const point = pixelify(coords);

		let walkable = true;

		for (const island of islands) {
			const distance = Math.abs(Pos.dist(point, island.pos));
			if (distance < island.sprite.radius) {
				walkable = false;
				break;
			}
		}

		cache.set(coords, walkable);
		return walkable;
	};
}

const LATERAL_DISTANCE = 1;
const DIAGONAL_DISTANCE = Math.SQRT2;
/** Octile distance */
function heuristicFactory(goal: Coords): (coords: Coords) => number {
	const [gx, gy] = numifyCoords(goal);

	return (coords: Coords) => {
		const [cx, cy] = numifyCoords(coords);

		const dx = Math.abs(gx - cx);
		const dy = Math.abs(gy - cy);

		const distance =
			LATERAL_DISTANCE * (dx + dy) +
			(DIAGONAL_DISTANCE - 2 * LATERAL_DISTANCE) * Math.min(dx, dy);

		return distance;
	};
}
