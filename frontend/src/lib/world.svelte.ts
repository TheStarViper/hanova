import { Boat } from "./boat";
import { Island } from "./island";
import { Pos, Viewport, mulberry32 } from "./utils.svelte";

export class World {
	public viewport = new Viewport();
	public boat = new Boat(this.viewport);
	public islands: Island[] = $state([]);

	public initIslands(seed: number, count: number) {
		const rng = mulberry32(seed);

		this.islands = [];

		while (this.islands.length < count) {
			const x = Math.ceil(rng() * this.viewport.width);
			const y = Math.ceil(rng() * this.viewport.height);

			this.islands.push(
				new Island({ x, y }, (endPos: Pos) => this.boat.sail(endPos)),
			);
		}
	}
}
