// All coords are in pixels relative the viewport
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
		return (this.max.x = this.min.x);
	}

	get height(): number {
		return (this.max.y = this.min.y);
	}
}

export class Controller {
	public container = new Container();
}
