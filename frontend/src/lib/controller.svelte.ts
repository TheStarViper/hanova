export class Controller {
	public container = new Container();
	public boat = new Boat(this.container);
	public islands: Island[] = $state([]);

	public initIslands(seed: number, count: number) {
		const rng = mulberry32(seed);

		this.islands = [];

		while (this.islands.length < count) {
			const x = Math.ceil(rng() * this.container.width);
			const y = Math.ceil(rng() * this.container.height);

			this.islands.push(new Island({ x, y }));
		}
	}
}

export class Pos {
	public x: number;
	public y: number;

	public constructor(x: number = 0, y: number = 0) {
		this.x = $state(x);
		this.y = $state(y);
	}
}

/**
 * The info about the <main> element
 */
export class Container {
	public min = new Pos();
	public max = new Pos();

	constructor() {}

	update(el: HTMLElement): void {
		const rect = el.getBoundingClientRect();

		this.min.x = rect.left;
		this.min.y = rect.top;
		this.max.x = rect.right;
		this.max.y = rect.bottom;
	}

	get width(): number {
		return this.max.x - this.min.x;
	}

	get height(): number {
		return this.max.y - this.min.y;
	}

	get center(): Pos {
		return new Pos(this.width / 2, this.height / 2);
	}
}

export class Boat {
	public pos = new Pos();
	public hide = false;

	constructor(public container: Container) {}

	public randomizePos() {
		this.pos.x = Math.ceil(Math.random() * this.container.width);
		this.pos.y = Math.ceil(Math.random() * this.container.height);
	}
}

export class Island {
	public constructor(public pos: Pos) {}
}

// https://github.com/cprosche/mulberry32
function mulberry32(seed: number) {
	return function () {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
