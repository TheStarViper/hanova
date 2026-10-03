import { Pos } from "./utils.svelte";

type CubicBezier = {
	p0: Pos;
	p1: Pos;
	p2: Pos;
	p3: Pos;
};

function catmullRomToBezier(
	p0: Pos,
	p1: Pos,
	p2: Pos,
	p3: Pos,
	tension = 1 / 6,
): CubicBezier {
	const c1 = Pos.add(p1, Pos.mul(Pos.sub(p2, p0), tension));
	const c2 = Pos.sub(p2, Pos.mul(Pos.sub(p3, p1), tension));

	return {
		p0: p1,
		p1: c1,
		p2: c2,
		p3: p2,
	};
}

export function pathToBezier(path: Pos[]): CubicBezier[] {
	if (path.length < 2) return [];

	const curves: CubicBezier[] = [];

	for (let i = 0; i < path.length - 1; i++) {
		const p0 = path[Math.max(0, i - 1)];
		const p1 = path[i];
		const p2 = path[i + 1];
		const p3 = path[Math.min(path.length - 1, i + 2)];

		curves.push(catmullRomToBezier(p0, p1, p2, p3));
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
