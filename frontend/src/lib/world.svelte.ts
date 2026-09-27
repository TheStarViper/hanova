// class imports
import { Banner } from "./banner.svelte";
import { Boat } from "./boat";
import { FileManager } from "./fileManager";
import { Island } from "./island.svelte";
import { Treasure } from "./treasure.svelte";
import { Pos, Viewport, mulberry32 } from "./utils.svelte";

// misc imports
import type { CppManager } from "./cppManager";
import islandData from "./islandData.json";

export class World {
	viewport = new Viewport();
	boat = new Boat(this.viewport);
	islands: Island[] = $state([]);
	fileManager = new FileManager(async () => this.dropHook());
	treasure = new Treasure();
	banner = new Banner(this.viewport);

	constructor(public cppManager: CppManager) {}

	init(viewportEl: HTMLElement) {
		this.viewport.update(viewportEl);
		this.initIslands();
		this.fileManager.init();
	}

	async dropHook() {
		this.spawnBoat();
		this.banner.hide = true;

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

	initIslands() {
		const sailBoat = (me: Island, endPos: Pos) => {
			if (this.boat.hide) return;
			// intentionally update both
			this.treasure.owner = me;
			this.treasure.previousOwner = me;

			this.boat.sail(endPos, () => {
				// intentionally *not* update treasure.previousOwner
				this.treasure.owner = null;

				this.banner.text = "You've found buried treasure: a PNG file!";
				this.banner.hide = false;
			});
		};

		this.islands = islandData.islands.map((datum) => {
			const pos = new Pos(datum.pos.x, datum.pos.y);

			return new Island(datum.name, pos, datum.islandSpriteIndex, sailBoat);
		});
	}
}
