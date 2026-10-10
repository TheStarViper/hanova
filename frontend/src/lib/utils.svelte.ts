export class Pos {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = $state(x);
		this.y = $state(y);
	}

	static add(a: Pos, b: Pos): Pos {
		return new Pos(a.x + b.x, a.y + b.y);
	}

	static sub(a: Pos, b: Pos): Pos {
		return new Pos(a.x - b.x, a.y - b.y);
	}

	static mul(p: Pos, n: number): Pos {
		return new Pos(p.x * n, p.y * n);
	}

	static dist(a: Pos, b: Pos): number {
		return Math.hypot(b.x - a.x, b.y - a.y);
	}

	static lerp(a: Pos, b: Pos, t: number): Pos {
		return Pos.add(a, Pos.mul(Pos.sub(b, a), t));
	}

	static reflect(a: Pos, b: Pos): Pos {
		return this.sub(this.mul(a, 2), b);
	}
}

/**
 * The info about the <main> element
 */
export class Viewport {
	el: HTMLElement | null = null;
	min = new Pos();
	max = new Pos();

	offset = new Pos(0, 0);

	canDrag = $state(false);
	userIsDragging = $state(false);
	private dragStartX = 0;
	private dragStartY = 0;

	constructor() {}

	init(): void {
		this.el = document.getElementById("main");

		this.update();

		window.addEventListener("resize", () => this.update());

		this.initDragListeners();
	}

	update(): void {
		if (this.el === null) return;

		const rect = this.el.getBoundingClientRect();

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

	private resetDrag() {
		this.userIsDragging = false;
	}

	initDragListeners() {
		this.resetDrag();

		window.addEventListener("pointerdown", (event) => {
			if (!this.canDrag) return;

			this.userIsDragging = true;
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
		});
		window.addEventListener("pointerup", () => this.resetDrag());
		window.addEventListener("pointercancel", () => this.resetDrag());
		window.addEventListener("pointermove", (event) => {
			if (!this.userIsDragging) return;

			const dragDeltaX = event.clientX - this.dragStartX;
			const dragDeltaY = event.clientY - this.dragStartY;

			this.offset.x += dragDeltaX;
			this.offset.y += dragDeltaY;

			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
		});
	}
}

export function ease(t: number): number {
	return t * (2 - t);
}

// https://github.com/cprosche/mulberry32
export function mulberry32(seed: number) {
	return function () {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
