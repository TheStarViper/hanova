import { Pos, Viewport, ease } from "$lib/utils.svelte";

export class Boat {
	public pos = new Pos();
	public targetPos: Pos = this.pos;
	public hide = true;

	/** in pixels per second */
	public speed = 100;

	constructor(public viewport: Viewport) {}

	private moveAnimID: number | null = null;
	/**
	 * Smoothly moves from one position to another
	 */
	public sail(endPos: Pos) {
		// we don't wanna restart the animation if it's the same destination
		if (endPos === this.targetPos) return;
		this.targetPos = endPos;

		if (this.moveAnimID !== null) {
			cancelAnimationFrame(this.moveAnimID);
		}

		const startPos: Pos = { x: this.pos.x, y: this.pos.y };

		/** could be positive or negative */
		const deltaPos: Pos = {
			x: endPos.x - startPos.x,
			y: endPos.y - startPos.y,
		};

		// I init this on the first frame
		let startTime: number | null = null;

		const distance = Math.sqrt(deltaPos.x ** 2 + deltaPos.y ** 2);
		const duration = (distance / this.speed) * 1000;

		if (distance === 0) return;

		const animate = (nowTime: number) => {
			if (startTime === null) {
				startTime = nowTime;
			}

			const elapsed = nowTime - startTime;

			/** normalized between 0 and 1 */
			const rawProgress = Math.min(elapsed / duration, 1);
			const progress = ease(rawProgress);

			this.pos.x = startPos.x + deltaPos.x * progress;
			this.pos.y = startPos.y + deltaPos.y * progress;

			if (progress < 1) {
				this.moveAnimID = requestAnimationFrame(animate);
			} else {
				this.moveAnimID = null;
			}
		};

		this.moveAnimID = requestAnimationFrame(animate);
	}

	/** @deprecated was once used for internal testing. dont use this lol */
	public randomizePos() {
		this.sail({
			x: Math.ceil(Math.random() * this.viewport.width),
			y: Math.ceil(Math.random() * this.viewport.height),
		});
	}
}
