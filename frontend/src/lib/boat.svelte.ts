import { Pos, Viewport, ease } from "#lib/utils.svelte.js";
import type { Route } from "./route";

// [TODO] replace this with an actual conversion time estimate
/** in milliseconds */
export const SAIL_DURATION = 4000;

export class Boat {
	pos = new Pos();
	route: Route | undefined;
	hide = $state(true);
	name = "Boat";

	constructor(public viewport: Viewport) {}

	private moveAnimID: number | null = null;
	/**
	 * Smoothly moves from one position to another
	 *
	 * @param route
	 * @param duration in milliseconds
	 * @param arriveHook runs after the animation
	 */
	sail(route: Route, duration: number, arriveHook?: () => void) {
		// sailing should only happen if visible
		if (this.hide) return;

		// we don't wanna restart the animation if there's already one running
		if (this.route !== undefined) return;
		this.route = route;

		if (this.moveAnimID !== null) cancelAnimationFrame(this.moveAnimID);

		let startTime: number | null = null;

		const animate = (nowTime: number) => {
			if (startTime === null) {
				startTime = nowTime;
			}

			const elapsed = nowTime - startTime;

			/** normalized between 0 and 1 */
			const rawProgress = Math.min(elapsed / duration, 1);
			const progress = ease(rawProgress);

			const newPos = route(progress);
			this.pos.x = newPos.x;
			this.pos.y = newPos.y;

			if (progress < 1) {
				this.moveAnimID = requestAnimationFrame(animate);
			} else {
				this.moveAnimID = null;
				arriveHook?.();
			}
		};

		this.moveAnimID = requestAnimationFrame(animate);
	}
}
