import { Pos } from "./utils.svelte";

export type CubicBezier = {
	p0: Pos;
	p1: Pos;
	p2: Pos;
	p3: Pos;
};

function centripetalCatmullRomToBezier(
	p0: Pos,
	p1: Pos,
	p2: Pos,
	p3: Pos,
): CubicBezier {
	const t0 = 0;
	const t1 = t0 + Math.sqrt(Pos.dist(p0, p1));
	const t2 = t1 + Math.sqrt(Pos.dist(p1, p2));
	const t3 = t2 + Math.sqrt(Pos.dist(p2, p3));

	const dt1 = t1 - t0;
	const dt2 = t2 - t1;
	const dt3 = t3 - t2;

	const m1 = Pos.add(
		Pos.mul(Pos.sub(p2, p1), dt1 / (dt2 * (t2 - t0))),
		Pos.mul(Pos.sub(p1, p0), dt2 / (dt1 * (t2 - t0))),
	);
	const m2 = Pos.add(
		Pos.mul(Pos.sub(p2, p1), dt3 / (dt2 * (t3 - t1))),
		Pos.mul(Pos.sub(p3, p2), dt2 / (dt3 * (t3 - t1))),
	);

	return {
		p0: p1,
		p1: Pos.add(p1, Pos.mul(m1, dt2 / 3)),
		p2: Pos.sub(p2, Pos.mul(m2, dt2 / 3)),
		p3: p2,
	};
}

function colinearSimplification(path: Pos[]): Pos[] {
	return path.filter((current, index) => {
		const prev = path[index - 1];
		const next = path[index + 1];

		// don't simplify away the endpoints, obv
		if (prev === undefined || next === undefined) return true;

		const d1 = Pos.sub(current, prev);
		const d2 = Pos.sub(next, current);

		const isColinear = d1.x * d2.y === d1.y * d2.x;

		return !isColinear;
	});
}

export function pathToBezier(path: Pos[]): CubicBezier[] {
	if (path.length < 2) return [];

	path = colinearSimplification(path);

	const curves: CubicBezier[] = [];

	for (let i = 0; i < path.length - 1; i++) {
		const p1 = path[i];
		const p2 = path[i + 1];

		const p0 = i === 0 ? Pos.reflect(p1, p2) : path[i - 1];
		const p3 = i === path.length - 2 ? Pos.reflect(p2, p1) : path[i + 2];

		curves.push(centripetalCatmullRomToBezier(p0, p1, p2, p3));
	}

	return curves;
}

export function bezier(curve: CubicBezier, t: number): Pos {
	const u = 1 - t;

	return new Pos(
		// x
		u * u * u * curve.p0.x +
			3 * u * u * t * curve.p1.x +
			3 * u * t * t * curve.p2.x +
			t * t * t * curve.p3.x,
		// y
		u * u * u * curve.p0.y +
			3 * u * u * t * curve.p1.y +
			3 * u * t * t * curve.p2.y +
			t * t * t * curve.p3.y,
	);
}
