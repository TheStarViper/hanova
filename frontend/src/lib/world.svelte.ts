import { Boat } from "./boat";
import type { CppManager } from "./cppManager";
import { FileManager } from "./fileManager";
import { Island } from "./island.svelte";
import { Treasure } from "./treasure.svelte";
import { Pos, Viewport, mulberry32 } from "./utils.svelte";

export class World {
	viewport = new Viewport();
	boat = new Boat(this.viewport);
	islands: Island[] = $state([]);
	fileManager = new FileManager(async () => this.dropHook());
	treasure = new Treasure();

	constructor(public cppManager: CppManager) {}

	init(viewportEl: HTMLElement) {
		this.viewport.update(viewportEl);
		this.initIslands(23, 10);
		this.fileManager.init();
	}

	async dropHook() {
		this.spawnBoat();

		if (this.fileManager.file === null) throw new Error("unreachable");
		const bytes = await this.fileManager.file.bytes();
		const result = this.cppManager.convertToPNG(bytes);
		console.log(result);
	}

	spawnBoat() {
		this.boat.pos.x = this.viewport.center.x;
		this.boat.pos.y = this.viewport.center.y;
		this.boat.name = this.fileManager.getTrimmedFilename();
		this.boat.hide = false;
	}

	initIslands(seed: number, count: number) {
		const rng = mulberry32(seed);

		this.islands = [];

		while (this.islands.length < count) {
			const x = Math.ceil(rng() * this.viewport.width);
			const y = Math.ceil(rng() * this.viewport.height);

			this.islands.push(
				new Island({ x, y }, (me: Island, endPos: Pos) => {
					if (this.boat.hide) return;
					// intentionally update both
					this.treasure.owner = me;
					this.treasure.previousOwner = me;

					this.boat.sail(endPos, () => {
						// intentionally *not* update treasure.previousOwner
						this.treasure.owner = null;
					});
				}),
			);
		}
	}
}
