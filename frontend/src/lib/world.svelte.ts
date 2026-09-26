import { Boat } from "./boat";
import { FileManager } from "./fileManager";
import { Island } from "./island";
import { Pos, Viewport, mulberry32 } from "./utils.svelte";

export class World {
	public viewport = new Viewport();
	public boat = new Boat(this.viewport);
	public islands: Island[] = $state([]);
	public fileManager = new FileManager(() => this.spawnBoat());

	public init(viewportEl: HTMLElement) {
		this.viewport.update(viewportEl);
		this.initIslands(23, 10);
		this.fileManager.init();
	}

	public spawnBoat() {
		this.boat.pos.x = this.viewport.center.x;
		this.boat.pos.y = this.viewport.center.y;
		this.boat.name = this.fileManager.getTrimmedFilename();
		this.boat.hide = false;
	}

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
